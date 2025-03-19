#!/usr/bin/python3

import os
import sys
import json
import time
import uuid
import time
import logging
import subprocess


try:
    dir_config = sys.argv[1]
except Exception as e:
    dir_config = '../../'

dir_x0_app_config = '{}/config'.format(dir_config)
dir_x0_kubernetes_tpl = '../template'

app_config_file = '{}/app-config.json'.format(dir_x0_app_config)


def log_message(log_prefix, msg):
    logging.info('{}:{}'.format(log_prefix, msg))

def prepare_minikube_hyperv(os_type, subtype, driver, offline_install):

    if os_type == 'mswindows' and subtype == 'minikube' and driver == 'hyperv' and offline_install is False:

        curl_binary = '"C:\\Program Files\\Git\\mingw64\\bin\\curl"'
        tmp_path = 'C:\\Windows\\Temp'

        docker_image_base_url = 'https://docker.webcodex.de/x0'

        docker_image_files = {
            'x0_app': 'docker.x0-app.tar',
            'x0_db_install': 'docker.x0-db-install.tar',
            'x0_test': 'docker.x0-test.tar'
        }

        for image_id, image_file in docker_image_files.items():
            cmd_wget = '{} -o {}\\{} -C - {}/{}'.format(
                curl_binary,
                tmp_path,
                image_file,
                docker_image_base_url,
                image_file
            )
            logging.info('Wget cmd:{}'.format(cmd_wget))
            res = subprocess.run(cmd_wget, shell=True)

        cmd_minikube_create_cluster = 'minikube start --driver=hyperv'
        res = subprocess.run(cmd_minikube_create_cluster, shell=True)

        res = subprocess.run('minikube addons enable registry', shell=True)
        res = subprocess.run('minikube addons enable ingress', shell=True)
        res = subprocess.run('minikube addons enable ingress-dns', shell=True)

        res = subprocess.run('minikube image pull reactivetechio/kubegres:1.19', shell=True)
        res = subprocess.run('minikube image pull postgres:14', shell=True)
        res = subprocess.run('minikube image pull selenium/standalone-chrome:131.0', shell=True)

        for image_id, image_file in docker_image_files.items():
            cmd_image_load = 'minikube image load {}/{}'.format(
                tmp_path,
                image_file
            )
            res = subprocess.run(cmd_image_load, shell=True)

def gen_kubernetes_templates(ConfRef, environment, tpl_group='app'):

    config = ConfRef.getConfig()
    app_templates = config['kubernetes']['templates'][tpl_group]

    log_message('gen_kubernetes_templates', 'tpl_group:{}'.format(tpl_group))

    for tpl_key, tpl_file in app_templates.items():
        with open('{}/{}'.format(dir_x0_kubernetes_tpl, tpl_file), 'r') as fh:
            replace_source = fh.read()
            replace_vars = config['x0']['tpl_vars'][tpl_group]
            for x0_var_key, x0_var_value in replace_vars.items():
                replace_string = '${'+x0_var_key+'}'
                replace_value = str(x0_var_value)
                replace_source = replace_source.replace(replace_string, replace_value)

            ConfRef._RunTimeData['templates_gen'][tpl_group][tpl_key] = replace_source

def kubernetes_exec(templates, os_type, wait=False, wait_for='complete', wait_timeout='360s'):

    #log_message('kubernetes_exec', 'templates:{}'.format(templates))

    if wait is True:
        wait_cmd = ' wait --for condition={} --timeout={}'.format(wait_for, wait_timeout)
    else:
        wait_cmd = ''

    if os_type == 'linux':
        path_prefix = '/tmp'
    if os_type == 'mswindows':
        path_prefix = 'C:\\Windows\\Temp'

    for template in templates:
        error = True
        while error is True:
            try:
                filename_out = '{}/kube-tpl-process-{}.yaml'.format(path_prefix, uuid.uuid4())
                log_message('kubernetes_exec', 'Processing file:{}'.format(filename_out))
                with open(filename_out, 'w') as fh:
                    fh.write(template)
                cmd = 'kubectl{} apply -f {}'.format(wait_cmd, filename_out)
                res = subprocess.run(cmd.split(), capture_output=True)
                log_message('kubernetes_exec_result', res)
                if len(res.stderr) > 0:
                    error = True
                    time.sleep(1)
                else:
                    error = False
            except Exception as e:
                error = True
                time.sleep(1)

def get_loadbalancers(ConfRef):

    load_balancers = {}
    runtime_data = ConfRef.getRuntimeData()
    for env_key, env in runtime_data['x0_config']['environments'].items():
        vhost_config = runtime_data['x0_config']['vhosts']
        for vhost_key, vhost in vhost_config.items():
            try:
                lb_name = vhost_config[vhost_key]['loadbalancer']['ref']+'-'+env_key
                load_balancers[lb_name] = lb_name
            except Exception as e:
                pass
    return load_balancers

def gen_service_account_namespace(namespace, project_id, install_subtype='production'):

    cmd = 'kubectl --namespace {} create serviceaccount ci-builder'.format(namespace)
    subprocess.run(cmd.split())

    cmd = 'kubectl create clusterrolebinding ci-builder-role-{} --clusterrole=cluster-admin --serviceaccount={}:ci-builder'.format(namespace, namespace)
    subprocess.run(cmd.split())

    if install_subtype == 'production':
        cmd = 'kubectl --namespace {} create secret generic docker-reg-read-{} --from-file=.dockerconfigjson=/home/kube-deploy/kube-deploy/docker-{}.json --type=kubernetes.io/dockerconfigjson'.format(namespace, namespace, project_id)
        subprocess.run(cmd.split())

    log_message('service-act', cmd)

    if install_subtype == 'production':
        cmd = [
            'kubectl',
            '--namespace',
            namespace,
            'patch',
            'serviceaccount',
            'ci-builder',
            '-p',
            '{"imagePullSecrets": [ {"name": "docker-reg-read-'+namespace+'"} ]}'
        ]
        subprocess.run(cmd)

def gen_cert(CH, cert_type='staging'):

    # process certmanager ingress patch template
    tpl_ingress_patch = CH.getRuntimeData()['templates_gen']['certmanager']['PatchIngress']

    cm_tpl_vars = CH.getConfig()['x0']['tpl_vars']['certmanager']

    cm_issuer = '{}-{}-{}-issuer-{}'.format(
        cm_tpl_vars['x0_APP_ID'],
        cm_tpl_vars['x0_VHOST_ID'],
        cm_tpl_vars['x0_APP_ENV'],
        cert_type
    )

    cm_issuer_annotation = ingress_annotation_tpl['cert-manager-issuer'].format(cm_issuer)

    dns_replace_var = '${x0_APP_VHOST_DNS}'
    annotation_replace_var = '${cm_ANNOTATION_ISSUER}'

    dns_name = '{}.{}'.format(
        venv['dns']['hostname'],
        venv['dns']['domain']
    )

    tpl_ingress_patch = tpl_ingress_patch.replace(annotation_replace_var, cm_issuer_annotation)
    tpl_ingress_patch = tpl_ingress_patch.replace(dns_replace_var, dns_name)

    cm_tpl_vars = CH.getConfig()['x0']['tpl_vars']['certmanager']

    ingress_id = '{}-{}-{}-tls-ingress'.format(
        cm_tpl_vars['x0_APP_ID'],
        cm_tpl_vars['x0_VHOST_ID'],
        cm_tpl_vars['x0_APP_ENV']
    )

    patch_file = '/tmp/kube-tpl-process-{}.yaml'.format(uuid.uuid4())

    with open(patch_file, 'w') as fh:
        fh.write(tpl_ingress_patch)

    cmd = 'kubectl --namespace {} patch ingress {} --patch-file {}'.format(
        kube_namespace,
        ingress_id,
        patch_file
    )

    subprocess.run(cmd.split())

def app_template_dyn_replace(CH, env_config, tpl_key):

    json_config = CH.getRuntimeData()["x0_config"]

    # kubegres database.size and replica count will be taken from corresponding env if set, else global
    if tpl_key == 'kubegres':

        try:
            CH._Configuration['x0']['tpl_vars'][tpl_key]['x0_DB_SIZE'] = env_config['database']['size']
        except KeyError as e:
            CH._Configuration['x0']['tpl_vars'][tpl_key]['x0_DB_SIZE'] = json_config['database']['size']

        try:
            CH._Configuration['x0']['tpl_vars'][tpl_key]['x0_DB_REPLICAS'] = env_config['database']['replicas']
        except KeyError as e:
            CH._Configuration['x0']['tpl_vars'][tpl_key]['x0_DB_REPLICAS'] = json_config['database']['replicas']


class ConfigHandler(object):
    """Configuration Handler class.
    """

    def __init__(self):

        log_prefix = 'ConfigHandler::__init__'
        log_message(log_prefix, 'processing config file:{}'.format(app_config_file))

        with open(app_config_file, 'r') as fh:
            json_config = json.load(fh)

        self._Configuration = {
            "kubernetes": {
                "templates": {
                    "app": {
                        "Deployment": "01-deployment.yaml"
                    },
                    "service": {
                        "Service": "02-service.yaml",
                        "Ingress": "03-ingress.yaml",
                        "IngressTLS": "03-ingress-tls.yaml",
                        "IngressMinikube": "03-ingress-minikube.yaml",
                    },
                    "lb_group": {
                        "LoadBalancer": "04-ingress-controller-nginx.yaml"
                    },
                    "kubegres": {
                        "SecretSuperuser": "05-kubegres-secret.yaml",
                        "SetupDB": "06-kubegres-setup-db.yaml",
                    },
                    "certmanager": {
                        "Staging": "07-certmanager-staging.yaml",
                        "Production": "08-certmanager-production.yaml",
                        "PatchIngress": "09-certmanager-ingress-patch.yaml"
                    },
                    "db_install": {
                        "Install": "11-db-install.yaml"
                    },
                    "selenium_server": {
                        "ServerPod": "12-selenium-server.yaml",
                        "Service": "12-selenium-server-service.yaml"
                    },
                    "grafana": {
                        "Install": "13-grafana.yaml"
                    },
                    "test_run": {
                        "Run": "14-test-run.yaml"
                    }
                },
                "ingress": {
                    "annotations": {
                        "cert-manager-issuer": 'cert-manager.io/cluster-issuer: "{}"',
                        "auth-tls-verify-client": 'nginx.ingress.kubernetes.io/auth-tls-verify-client: "{}"',
                        "auth-tls-secret": 'nginx.ingress.kubernetes.io/auth-tls-secret: "{}"',
                        "auth-tls-verify-depth": 'nginx.ingress.kubernetes.io/auth-tls-verify-depth: "{}"',
                        "auth-tls-pass-certificate-to-upstream": 'nginx.ingress.kubernetes.io/auth-tls-pass-certificate-to-upstream: "{}"',
                        "whitelist-source-range": 'nginx.ingress.kubernetes.io/whitelist-source-range: "{}"'
                    }
                },
                "install": [
                    "https://raw.githubusercontent.com/kubernetes/ingress-nginx/controller-v1.8.0/deploy/static/provider/cloud/deploy.yaml",
                    "https://raw.githubusercontent.com/reactive-tech/kubegres/v1.19/kubegres.yaml",
                    "https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml"
                ],
                "install_minikube": [
                    "kubegres-v1.19.yaml"
                ]
            },
            "x0": {
                "tpl_vars": {
                    "app": {
                        "x0_APP_ID": json_config['project']['id'],
                        "x0_VHOST_ID": None,
                        "x0_APP_ENV": None,
                        "x0_NAMESPACE": None,
                        "x0_KUBERNETES_REPLICAS": None,
                        "x0_KUBERNETES_CPU": None,
                        "x0_KUBERNETES_MEMORY": None,
                        "x0_KUBERNETES_IMAGE": None
                    },
                    "lb_group": {
                        "x0_INGRESS_CONTROLLER_ID": None
                    },
                    "kubegres": {
                        "x0_DB_SU_PASSWORD": json_config['database']['su_password'],
                        "x0_DB_REPL_PASSWORD": json_config['database']['repl_password'],
                        "x0_DB_SIZE": '100Mi',
                        "x0_DB_REPLICAS": 2
                    },
                    "certmanager": {
                        "x0_APP_ID": json_config['project']['id'],
                        "x0_VHOST_ID": None,
                        "x0_APP_ENV": None,
                        "cm_CONTACT_MAIL": None,
                        "x0_LOADBALANCER_REF": None
                    },
                    "db_install": {
                        "x0_APP_ID": json_config['project']['id'],
                        "x0_APP_ENV": None,
                        "x0_NAMESPACE": None,
                        "x0_GITLAB_REPO": json_config['project']['git-repo'],
                        "x0_DB_NAME": json_config['database']['name']
                    },
                    "test_run": {
                        "x0_APP_ID": json_config['project']['id'],
                        "x0_APP_ENV": None,
                        "x0_NAMESPACE": None,
                        "x0_GITLAB_REPO": json_config['project']['git-repo']
                    },
                    "selenium_server": {
                        "x0_APP_ID": json_config['project']['id'],
                        "x0_NAMESPACE": None,
                        "x0_SELENIUM_SERVER_INDEX": None,
                        "x0_SELENIUM_DOCKER_IMAGE": 'selenium/standalone-chrome:131.0'
                    },
                    "grafana": {
                        "x0_APP_ID": json_config['project']['id'],
                        "x0_NAMESPACE": None
                    }
                }
            },
            "app_config": json_config
        }

        self._RunTimeData = {
            "templates_gen": {
                "app": {
                    "Deployment": None
                },
                "service": {
                    "Service": None,
                    "Ingress": None
                },
                "lb_group": {
                    "LoadBalancer": None
                },
                "kubegres": {
                    "SecretSuperuser": None,
                    "SetupDB": None
                },
                "certmanager": {
                    "Staging": None,
                    "Production": None,
                    "PatchIngress": None
                },
                "db_install": {
                    "Install": None
                },
                "selenium_server": {
                    "ServerPod": None,
                    "Service": None
                },
                "grafana": {
                    "Install": None
                },
                "test_run": {
                    "Run": None
                }
            },
            "x0_config": json_config
        }

        log_message(log_prefix, 'JSON config:{}'.format(self._Configuration))

    def getConfig(self):
        return self._Configuration

    def getRuntimeData(self):
        return self._RunTimeData


if __name__ == '__main__':

    logging.basicConfig(
        level=logging.DEBUG
    )

    log_prefix = __name__

    CH = ConfigHandler()

    try:
        os_type = CH._Configuration['app_config']['installer']['os']
    except Exception as e:
        os_type = 'linux'

    try:
        install_type = CH._Configuration['app_config']['installer']['type']
    except Exception as e:
        install_type = 'x0'

    try:
        install_subtype = CH._Configuration['app_config']['installer']['subtype']
    except Exception as e:
        install_subtype = 'production'

    try:
        install_offline = CH._Configuration['app_config']['installer']['offline_install']
    except Exception as e:
        install_offline = False

    try:
        minikube_driver = CH._Configuration['app_config']['installer']['minikube_driver']
    except Exception as e:
        minikube_driver = 'hyperv'

    print("OS type:{}".format(os_type))
    print("Install type:{}".format(install_type))
    print("Install sub type:{}".format(install_subtype))

    # prepare win 
    prepare_minikube_hyperv(os_type, install_subtype, minikube_driver, install_offline)

    load_balancers = get_loadbalancers(CH)
    log_message(log_prefix, 'LoadBalancers:{}'.format(load_balancers))

    # install production "packages"
    if install_subtype == 'production':

        install_packages = CH.getConfig()['kubernetes']['install']

        for package_url in install_packages:
            cmd = 'kubectl apply -f {}'.format(package_url)
            subprocess.run(cmd.split())

    # install minikube "packages"
    if install_subtype == 'minikube':

        install_packages = CH.getConfig()['kubernetes']['install_minikube']

        for package_yaml_file in install_packages:
            cmd = 'kubectl apply -f ./install-minikube/{}'.format(package_yaml_file)
            subprocess.run(cmd.split())

    # use single env from command line, else list from json config
    try:
        environments = []
        environments.append(sys.argv[2])
    except Exception as e:
        environments = CH.getRuntimeData()['x0_config']['env_list']

    for environment in environments:

        log_message(log_prefix, 'Processing Environment:{}'.format(environment))

        env_config = CH.getRuntimeData()['x0_config']['environments'][environment]

        kubernetes_conf = env_config['kubernetes']['deployment']
        kube_namespace = env_config['kubernetes']['namespace']

        project_id = CH.getConfig()['x0']['tpl_vars']['app']['x0_APP_ID']

        CH._Configuration['x0']['tpl_vars']['app']['x0_APP_ENV'] = environment
        CH._Configuration['x0']['tpl_vars']['app']['x0_NAMESPACE'] = kube_namespace
        CH._Configuration['x0']['tpl_vars']['app']['x0_KUBERNETES_REPLICAS'] = kubernetes_conf['replicas']
        CH._Configuration['x0']['tpl_vars']['app']['x0_KUBERNETES_CPU'] = kubernetes_conf['cpu']
        CH._Configuration['x0']['tpl_vars']['app']['x0_KUBERNETES_MEMORY'] = kubernetes_conf['memory']
        CH._Configuration['x0']['tpl_vars']['app']['x0_KUBERNETES_IMAGE'] = kubernetes_conf['image']

        CH._Configuration['x0']['tpl_vars']['kubegres']['x0_NAMESPACE'] = kube_namespace

        CH._Configuration['x0']['tpl_vars']['db_install']['x0_APP_ENV'] = environment
        CH._Configuration['x0']['tpl_vars']['db_install']['x0_NAMESPACE'] = kube_namespace

        CH._Configuration['x0']['tpl_vars']['test_run']['x0_APP_ENV'] = environment
        CH._Configuration['x0']['tpl_vars']['test_run']['x0_NAMESPACE'] = kube_namespace

        CH._Configuration['x0']['tpl_vars']['selenium_server']['x0_NAMESPACE'] = kube_namespace

        # generate namespace
        cmd = 'kubectl create namespace {}'.format(kube_namespace)
        subprocess.run(cmd.split())

        # generate serviceaccount / roles / authentication
        gen_service_account_namespace(kube_namespace, project_id)

        # generate loadbalancers
        for loadbalancer_id in load_balancers:

            CH.getConfig()['x0']['tpl_vars']['lb_group']['x0_INGRESS_CONTROLLER_ID'] = loadbalancer_id

            gen_kubernetes_templates(CH, environment, 'lb_group')

            lb_tpl_data = CH.getRuntimeData()['templates_gen']['lb_group']['LoadBalancer']
            #log_message(log_prefix, 'Load Balancer ID:{} Template:{}'.format(loadbalancer_id, lb_tpl_data))

            kubernetes_exec([lb_tpl_data], os_type)

        # process app templates
        app_templates = env_config['kubernetes']['app_templates']

        for app_tpl in app_templates:

            app_template_dyn_replace(CH, env_config, app_tpl)
            gen_kubernetes_templates(CH, environment, app_tpl)

            tpl_dict = CH._Configuration['kubernetes']['templates'][app_tpl]

            templates_replaced = []
            for tpl_key, tpl_file in tpl_dict.items():
                templates_replaced.append(CH.getRuntimeData()['templates_gen'][app_tpl][tpl_key])

            kubernetes_exec(templates_replaced, os_type)

        # generate deployment template
        gen_kubernetes_templates(CH, environment)

        tpl_data = CH.getRuntimeData()['templates_gen']['app']

        kubernetes_exec([tpl_data['Deployment']], os_type)

        vhost_app_config = CH.getRuntimeData()['x0_config']['vhosts']

        # copy app template vars to service template vars
        CH._Configuration['x0']['tpl_vars']['service'] = CH._Configuration['x0']['tpl_vars']['app']

        for vhost_key, vhost_config in vhost_app_config.items():

            try:
                is_kube_service = vhost_app_config[vhost_key]['kubernetes-service']
            except Exception as e:
                is_kube_service = True

            log_message(log_prefix, 'Vhost:{} is_kube_service:{}'.format(vhost_key, is_kube_service))

            if is_kube_service:
                CH._Configuration['x0']['tpl_vars']['app']['x0_VHOST_ID'] = vhost_key

                # generate service / ingress templates
                gen_kubernetes_templates(CH, environment, 'service')

                try:
                    tls_config = vhost_app_config[vhost_key]['env'][environment]['tls']
                except Exception as e:
                    tls_config = False

                ingress_annotation_tpl = CH.getConfig()['kubernetes']['ingress']['annotations']

                tpl_data = CH.getRuntimeData()['templates_gen']['service']

                try:
                    certbot = tls_config['certbot']['generate']
                except:
                    certbot = False

                tpl_service = tpl_data['Service']
                
                if install_subtype == 'minikube':
                    tpl_ingress = tpl_data['IngressMinikube']
                else:                
                    if tls_config is False or certbot is True:
                        tpl_ingress = tpl_data['Ingress']
                    else:
                        tpl_ingress = tpl_data['IngressTLS']

                #tpl_ingress = tpl_data['Ingress'] if certbot is True else tpl_data['IngressTLS']

                try:
                    # replace loadbalancer ref
                    lb_ref_id = vhost_app_config[vhost_key]['loadbalancer']['ref']
                    lb_ref_id = '{}-{}'.format(lb_ref_id, environment)

                    tpl_ingress = tpl_ingress.replace('${x0_LOADBALANCER_REF}', lb_ref_id)
                except Exception as e:
                    pass

                # replace tls related
                ingress_annotations = []
                annotation_string = 'annotations:\n'

                try:
                    if certbot is True:

                        CH._Configuration['x0']['tpl_vars']['certmanager']['x0_APP_ENV'] = environment
                        CH._Configuration['x0']['tpl_vars']['certmanager']['x0_VHOST_ID'] = vhost_key
                        CH._Configuration['x0']['tpl_vars']['certmanager']['cm_CONTACT_MAIL'] = tls_config['certbot']['admin_mail']
                        CH._Configuration['x0']['tpl_vars']['certmanager']['x0_LOADBALANCER_REF'] = lb_ref_id

                        gen_kubernetes_templates(CH, environment, 'certmanager')

                except Exception as e:
                    pass

                kube_cert_id = '{}-{}-{}-tls-cert'.format(
                    CH.getConfig()['x0']['tpl_vars']['app']['x0_APP_ID'],
                    vhost_key,
                    environment
                )

                kube_ca_id = 'ca-{}'.format(kube_cert_id)

                try:
                    if tls_config['verify-client-certs'] is True:
                        ingress_annotations.append(ingress_annotation_tpl['auth-tls-verify-client'].format('on'))
                        ingress_annotations.append(ingress_annotation_tpl['auth-tls-secret'].format('default/'.format(kube_ca_id)))
                        ingress_annotations.append(ingress_annotation_tpl['auth-tls-verify-depth'].format('1'))
                        ingress_annotations.append(ingress_annotation_tpl['auth-tls-pass-certificate-to-upstream'].format('true'))
                except Exception as e:
                    pass

                try:
                    lb_config = vhost_app_config[vhost_key]['env'][environment]['loadbalancer']
                    ingress_annotations.append(ingress_annotation_tpl['whitelist-source-range'].format(lb_config['whitelist-source']))
                except Exception as e:
                    pass

                try:
                    if isinstance(tls_config['certs'], dict):

                        def mk_file_name(filename):
                            return '{}/ssl/{}/{}'.format(dir_config, vhost_key, filename)

                        tls_ca_cert = mk_file_name(tls_config['certs']['ca-cert'])
                        tls_cert = mk_file_name(tls_config['certs']['cert'])
                        tls_key = mk_file_name(tls_config['certs']['key'])

                        kube_secret_cmd_tpl = [
                            'kubectl',
                            '--namespace',
                            kube_namespace,
                            'create',
                            'secret',
                            'generic'
                        ]

                        kube_secret_file_param = '--from-file'

                        kube_secret_cmd_ca = [] + kube_secret_cmd_tpl
                        kube_secret_cmd_ca.extend(
                            (kube_ca_id, kube_secret_file_param, tls_ca_cert)
                        )

                        log_message(log_prefix, 'Kubectl secret ca-cert cmd:{}'.format(kube_secret_cmd_ca))

                        kube_secret_cmd = [] + kube_secret_cmd_tpl
                        kube_secret_cmd.extend(
                            (kube_cert_id, kube_secret_file_param, tls_cert, kube_secret_file_param, tls_key)
                        )

                        log_message(log_prefix, 'Kubectl secret cert cmd:{}'.format(kube_secret_cmd))

                        subprocess.run(kube_secret_cmd_ca)
                        subprocess.run(kube_secret_cmd)

                except Exception as e:
                    pass

                # replace ingress annotations
                try:
                    for annotation in ingress_annotations:
                        annotation_string = annotation_string + '    ' + annotation + '\n'
                    annotations_replace_var = '${x0_INGRESS_ANNOTATIONS}'
                    annotation_string = annotation_string.rstrip()
                    tpl_ingress = tpl_ingress.replace(annotations_replace_var, annotation_string)
                except Exception as e:
                    pass

                # replace loadbalancer ref in ingress
                try:
                    lb_replace_var = '${x0_LOADBALANCER_REF}'
                    tpl_ingress = tpl_ingress.replace(lb_replace_var, lb_ref_id)
                except Exception as e:
                    pass

                # replace hostname
                venv = vhost_config['env'][environment]
                try:
                    dns_replace_var = '${x0_APP_VHOST_DNS}'
                    dns_name = '{}.{}'.format(
                        venv['dns']['hostname'],
                        venv['dns']['domain']
                    )
                    tpl_ingress = tpl_ingress.replace(dns_replace_var, dns_name)
                except Exception as e:
                    dns_name = None

                #log_message(log_prefix, 'Tpl Service Env:{} Template:{}'.format(environment, tpl_service))
                #log_message(log_prefix, 'Tpl Ingress Env:{} Template:{}'.format(environment, tpl_ingress))

                templates = [
                    tpl_service,
                    tpl_ingress
                ]

                # apply service / ingress
                kubernetes_exec(templates, os_type)

                if certbot is True:

                    # apply certmanager staging
                    certmanager_tpl = CH.getRuntimeData()['templates_gen']['certmanager']['Staging']
                    log_message('certmanager', 'Staging template:{}'.format(certmanager_tpl))
                    kubernetes_exec([certmanager_tpl], os_type)

                    # apply certmanager production
                    certmanager_tpl = CH.getRuntimeData()['templates_gen']['certmanager']['Production']
                    log_message('certmanager', 'Production template:{}'.format(certmanager_tpl))
                    kubernetes_exec([certmanager_tpl], os_type)

                ingress_id = '{}-{}-{}-tls-ingress'.format(
                    CH.getConfig()['x0']['tpl_vars']['app']['x0_APP_ID'],
                    vhost_key,
                    environment
                )

                if dns_name is not None and venv['ip']['v4']['dns_register'] is True:

                    zone_id = venv['dns']['domain']

                    # get ingress loadbalancer ip
                    cmd = 'kubectl --namespace {} get ingress {} -o json'.format(kube_namespace, ingress_id)

                    loadbalancer_ip = None
                    while loadbalancer_ip is None:

                        ingress_result = subprocess.run(cmd.split(), capture_output=True)
                        kube_ingress = json.loads(ingress_result.stdout)

                        try:
                            log_message('DNS', 'Try getting lb ingress official IPv4')
                            loadbalancer_ip = kube_ingress['status']['loadBalancer']['ingress'][0]['ip']
                        except Exception as e:
                            log_message('DNS', 'Failed getting lb ingress official IPv4')
                            loadbalancer_ip = None
                            time.sleep(10)

                    log_message('DNS', 'Zone:{} LoadBalancer IP:{}'.format(zone_id, loadbalancer_ip))

                    # get openstack zone id
                    cmd = 'openstack zone list -f json'
                    zone_result = subprocess.run(cmd.split(), capture_output=True)
                    zones = json.loads(zone_result.stdout)

                    for zone in zones:
                        if zone['name'] == '{}.'.format(zone_id):
                            log_message('DNS', 'Zone found:{}'.format(zone))

                            cmd = 'openstack recordset list {} -f json'.format(zone['id'])
                            records_result = subprocess.run(cmd.split(), capture_output=True)
                            records = json.loads(records_result.stdout)
                            log_message('DNS', 'Records:{}'.format(records))

                            # if zone record exists, delete
                            for record in records:
                                if record['type'] == 'A' and record['name'] == '{}.{}.'.format(venv['dns']['hostname'], zone_id):
                                    cmd = 'openstack recordset delete {} {}'.format(zone['id'], record['id'])
                                    subprocess.run(cmd.split())

                            # add zone record
                            cmd = 'openstack recordset create --type A --record {} {} {} -f json'.format(
                                loadbalancer_ip,
                                zone['id'],
                                venv['dns']['hostname']
                            )

                            rs_create_result = subprocess.run(cmd.split(), capture_output=True)
                            record = json.loads(rs_create_result.stdout)

                            log_message('DNS', 'Record create:{}'.format(record))

                # trigger letsencrypt certs for staging and production
                if certbot is True:
                    gen_cert(CH)
                    gen_cert(CH, 'production')

                # process db-installer pod
                gen_kubernetes_templates(CH, environment, 'db_install')

                tpl_db_install = CH.getRuntimeData()['templates_gen']['db_install']['Install']

                # wait until kubegres is ready
                time.sleep(20)

                kubernetes_exec([tpl_db_install], os_type)

                # setup selenium server pods
                try:
                    test_config = CH.getRuntimeData()['x0_config']['test']
                    test_envs = test_config['testenvs']

                    if environment in test_envs:
                        tpl_pods = []
                        for i in range(0, test_config['selenium']['run_servers']):
                            CH._Configuration['x0']['tpl_vars']['selenium_server']['x0_SELENIUM_SERVER_INDEX'] = i
                            gen_kubernetes_templates(CH, environment, 'selenium_server')
                            tpl_pods.append(CH.getRuntimeData()['templates_gen']['selenium_server']['ServerPod'])
                            tpl_pods.append(CH.getRuntimeData()['templates_gen']['selenium_server']['Service'])
                        kubernetes_exec(tpl_pods, os_type)
                except Exception as e:
                    #TODO: add logging
                    pass

                # wait until selenium pod(s) is / are ready
                time.sleep(20)

                # run test pod
                try:
                    if environment in test_envs:
                        gen_kubernetes_templates(CH, environment, 'test_run')

                        tpl_test_run = CH.getRuntimeData()['templates_gen']['test_run']['Run']

                        kubernetes_exec([tpl_test_run], os_type)
                except Exception as e:
                    #TODO: add logging
                    pass
