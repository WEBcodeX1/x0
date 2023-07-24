#!/usr/bin/python3

import os
import sys
import json
import uuid
import logging
import subprocess


dir_repo = sys.argv[1]
dir_x0_app_config = '{}/config'.format(dir_repo)
dir_x0_kubernetes_tpl = '../template'

app_config_file = '{}/app-config.json'.format(dir_x0_app_config)


def log_message(log_prefix, msg):
    logging.info('{}:{}'.format(log_prefix, msg))

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

def kubernetes_exec(configs):
    #log_message('kubernetes_exec', 'configs:{}'.format(configs))
    for config_data in configs:
        filename_out = '/tmp/kube-tpl-process-{}.yaml'.format(uuid.uuid4())
        with open(filename_out, 'w') as fh:
            fh.write(config_data)
        cmd = 'kubectl apply -f {}'.format(filename_out)
        subprocess.run(cmd.split())

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

def certbot_gen(configs):
    # kubernetes cert-manager "workaround"
    cmd_certgen = 'certbot certonly --apache -d {} -m {} --agree-tos'
    cmd_pack_certs = 'tar -cjvf /tmp/certbot-certs.tar.bz2 /etc/letsencrypt/'
    cmd_copy_certs = 'kubectl --namespace x0-app cp {}:/tmp/certbot-certs.tar.bz2 ./{}'


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
                        "Ingress": "03-ingress.yaml"
                    },
                    "lb_group": {
                        "LoadBalancer": "04-ingress-controller-nginx.yaml"
                    },
                    "kubegres": {
                        "SecretSuperuser": "05-kubegres-secret.yaml",
                        "SetupDB": "06-kubegres-setup-db.yaml",
                    }
                },
                "ingress": {
                    "annotations": {
                        "cert-manager": 'cert-manager.io/issuer: "{}"',
                        "auth-tls-verify-client": 'nginx.ingress.kubernetes.io/auth-tls-verify-client: "{}"',
                        "auth-tls-secret": 'nginx.ingress.kubernetes.io/auth-tls-secret: "{}"',
                        "auth-tls-verify-depth": 'nginx.ingress.kubernetes.io/auth-tls-verify-depth: "{}"',
                        "auth-tls-pass-certificate-to-upstream": 'nginx.ingress.kubernetes.io/auth-tls-pass-certificate-to-upstream: "{}"'
                    }
                }
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
                        "x0_DB_SIZE": json_config['database']['size']
                    }
                }
            }
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

    load_balancers = get_loadbalancers(CH)
    log_message(log_prefix, 'LoadBalancers:{}'.format(load_balancers))

    for environment in CH.getRuntimeData()['x0_config']['env_list']:

        log_message(log_prefix, 'Processing Environment:{}'.format(environment))

        env_config = CH.getRuntimeData()['x0_config']['environments'][environment]

        kubernetes_conf = env_config['kubernetes']['deployment']
        kube_namespace = env_config['kubernetes']['namespace']

        CH._Configuration['x0']['tpl_vars']['app']['x0_APP_ENV'] = environment
        CH._Configuration['x0']['tpl_vars']['app']['x0_NAMESPACE'] = kube_namespace
        CH._Configuration['x0']['tpl_vars']['app']['x0_KUBERNETES_REPLICAS'] = kubernetes_conf['replicas']
        CH._Configuration['x0']['tpl_vars']['app']['x0_KUBERNETES_CPU'] = kubernetes_conf['cpu']
        CH._Configuration['x0']['tpl_vars']['app']['x0_KUBERNETES_MEMORY'] = kubernetes_conf['memory']
        CH._Configuration['x0']['tpl_vars']['app']['x0_KUBERNETES_IMAGE'] = kubernetes_conf['image']

        # copy replace properties for dynamic replacement
        CH._Configuration['x0']['tpl_vars']['kubegres']['x0_NAMESPACE'] = CH._Configuration['x0']['tpl_vars']['app']['x0_NAMESPACE']

        # generate namespace
        cmd = 'kubectl create namespace {}'.format(kube_namespace)
        subprocess.run(cmd.split())

        # generate loadbalancers
        for loadbalancer_id in load_balancers:

            CH.getConfig()['x0']['tpl_vars']['lb_group']['x0_INGRESS_CONTROLLER_ID'] = loadbalancer_id

            gen_kubernetes_templates(CH, environment, 'lb_group')

            lb_tpl_data = CH.getRuntimeData()['templates_gen']['lb_group']['LoadBalancer']
            #log_message(log_prefix, 'Load Balancer ID:{} Template:{}'.format(loadbalancer_id, lb_tpl_data))

            kubernetes_exec([lb_tpl_data])

        # process app templates
        app_templates = env_config['kubernetes']['app_templates']

        for app_tpl in app_templates:

            gen_kubernetes_templates(CH, environment, app_tpl)

            tpl_dict = CH._Configuration['kubernetes']['templates'][app_tpl]

            templates_replaced = []
            for tpl_key, tpl_file in tpl_dict.items():
                templates_replaced.append(CH.getRuntimeData()['templates_gen'][app_tpl][tpl_key])

            kubernetes_exec(templates_replaced)

        # generate deployment template
        gen_kubernetes_templates(CH, environment)

        tpl_data = CH.getRuntimeData()['templates_gen']['app']

        kubernetes_exec([tpl_data['Deployment']])

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

                tpl_data = CH.getRuntimeData()['templates_gen']['service']

                tpl_service = tpl_data['Service']
                tpl_ingress = tpl_data['Ingress']

                # replace loadbalancer ref
                lb_ref_id = vhost_app_config[vhost_key]['loadbalancer']['ref']
                lb_ref_id = '{}-{}'.format(lb_ref_id, environment)

                tpl_ingress = tpl_ingress.replace('${x0_LOADBALANCER_REF}', lb_ref_id)

                # replace tls related
                tls_annotations = []
                tls_annotation_string = 'annotations:\n'

                tls_config = vhost_app_config[vhost_key]['env'][environment]['tls']
                tls_annotation_tpl = CH.getConfig()['kubernetes']['ingress']['annotations']

                try:
                    if tls_config['certbot']['generate'] is True:
                        tls_annotations.append(tls_annotation_tpl['cert-manager'].format('letsencrypt-prod'))
                except Exception as e:
                    pass

                try:
                    if tls_config['verify-client-certs'] == 'require':
                        tls_annotations.append(tls_annotation_tpl['auth-tls-verify-client'].format('on'))                    
                except Exception as e:
                    pass

                try:
                    if isinstance(tls_config['certs'], dict):

                        def mk_file_name(filename):
                            return '{}/ssl/{}/{}'.format(dir_repo, vhost_key, filename)

                        tls_ca_cert = mk_file_name(tls_config['certs']['ca-cert'])
                        tls_cert = mk_file_name(tls_config['certs']['cert'])
                        tls_key = mk_file_name(tls_config['certs']['key'])

                        kube_secret_cmd_tpl = ['kubectl', 'create', 'secret', 'generic']
                        kube_secret_file_param = '--from-file'

                        kube_cert_id = '{}-{}-{}-tls-cert'.format(
                            CH.getConfig()['x0']['tpl_vars']['app']['x0_APP_ID'],
                            vhost_key,
                            environment
                        )

                        kube_ca_id = 'ca-{}'.format(kube_cert_id)

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
                    for annotation in tls_annotations:
                        tls_annotation_string = tls_annotation_string + '    ' + annotation + '\n'
                    annotations_replace_var = '${x0_INGRESS_ANNOTATIONS}'
                    tls_annotation_string = tls_annotation_string.rstrip()
                    tpl_ingress = tpl_ingress.replace(annotations_replace_var, tls_annotation_string)
                except Exception as e:
                    pass

                # replace loadbalancer ref in ingress
                try:
                    lb_replace_var = '${x0_LOADBALANCER_REF}'
                    tpl_ingress = tpl_ingress.replace(lb_replace_var, lb_ref_id)
                except Exception as e:
                    pass

                # replace hostname
                try:
                    dns_replace_var = '${x0_APP_VHOST_DNS}'
                    dns_name = vhost_config['env'][environment]['dns']

                    tpl_ingress = tpl_ingress.replace(dns_replace_var, dns_name)
                except Exception as e:
                    pass

                log_message(log_prefix, 'Tpl Service Env:{} Template:{}'.format(environment, tpl_service))
                log_message(log_prefix, 'Tpl Ingress Env:{} Template:{}'.format(environment, tpl_ingress))

                configs_app = [
                    tpl_service,
                    tpl_ingress
                ]

                kubernetes_exec(configs_app)