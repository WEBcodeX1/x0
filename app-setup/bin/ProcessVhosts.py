#!/usr/bin/python3

import os
import sys
import json
import shutil
import logging
import subprocess


dir_x0_base = '/var/lib/x0'
dir_x0_app_setup = '{}/app-setup'.format(dir_x0_base)
dir_x0_app_install = '{}/app-install'.format(dir_x0_base)
dir_x0_app_config = '{}/app-config'.format(dir_x0_base)
dir_x0_app_config_apache = '{}/apache'.format(dir_x0_app_config)
dir_x0_app_config_apache_vhost = '{}/vhost'.format(dir_x0_app_config_apache)
dir_x0_app_bin = '{}/bin'.format(dir_x0_app_setup)

app_config_file = '{}/app-config.json'.format(dir_x0_app_config)

dir_apache2_base = '/etc/apache2'
dir_apache2_sites_available = '{}/sites-available'.format(dir_apache2_base)
dir_apache2_sites_enabled = '{}/sites-enabled'.format(dir_apache2_base)

apache2_config = '{}/apache2.conf'.format(dir_apache2_base)

dir_vhost_base = '/var/www/vhosts'
dir_python = '/var/www/python'

global_replace_vars = {}


def log_message(log_prefix, msg):
    logging.info('{}:{}'.format(log_prefix, msg))

def replace_vhost_template(conf_data):
    log_message('Replace-vars', 'Global replace vars:{}'.format(global_replace_vars))
    for replace_var, replace_value in global_replace_vars.items():
        log_message('Replace-vars', 'var:{} value:{}'.format(replace_var, replace_value))
        replace_str = '${}'.format(replace_var)
        conf_data = conf_data.replace(replace_str, replace_value)
    return conf_data


if __name__ == '__main__':

    logging.basicConfig(
        level=logging.DEBUG
    )

    log_prefix = __name__
    log_message(log_prefix, 'processing config file:{}'.format(app_config_file))

    with open(app_config_file, 'r') as fh:
        app_config = json.load(fh)

    try:
        installer_type = app_config['installer']['type']
    except Exception as e:
        installer_type = None

    try:
        environment = app_config['selected_env']
    except Exception as e:
        environment = 'test'

    log_message(log_prefix, 'Installer type:{}'.format(installer_type))

    env_config = app_config['environments']
    vhost_config = app_config['vhosts']

    # remove all apache sites-enebled links
    cmd = 'rm {}/*'.format(dir_apache2_sites_enabled)
    subprocess.run(cmd.split())

    log_message(log_prefix, 'Processing environment:{}'.format(environment))

    vhost_ids = []
    for vhost_id in vhost_config:

        vhost_ids.append(vhost_id)

        log_message(log_prefix, 'Processing vhost:{}'.format(vhost_id))

        vhost_id_env = '{}-{}'.format(vhost_id, environment)
        vhost_www_path = '{}/{}'.format(dir_vhost_base, vhost_id)

        log_message(log_prefix, 'VhostEnv:{} WWW-Path:{}'.format(vhost_id_env, vhost_www_path))

        try:
            env_config = vhost_config[vhost_id]['env'][environment]
        except Exception as e:
            env_config = None

        if env_config is not None:

            host_name = '{}.{}'.format(
                env_config['dns']['hostname'],
                env_config['dns']['domain']
            )

            log_message(log_prefix, 'HostName:{}'.format(host_name))

            try:
                vhost_x0_apps = vhost_config[vhost_id]['apps']
            except Exception as e:
                vhost_x0_apps = []

            # x0 installer related actions
            if installer_type is not None and installer_type == 'x0':

                # mk vhost www path
                cmd = 'mkdir -p {}'.format(vhost_www_path)
                log_message(log_prefix, 'mkdir cmd:{}'.format(cmd))
                p = subprocess.Popen(cmd.split())
                p.communicate()

                # mk vhost www/python path
                cmd = 'mkdir -p {}/python'.format(vhost_www_path)
                log_message(log_prefix, 'mkdir cmd:{}'.format(cmd))
                p = subprocess.Popen(cmd.split())
                p.communicate()

                # copy base system to vhost
                cmd = '{}/copy-base-sys.sh {}'.format(dir_x0_app_bin, vhost_id)
                p = subprocess.Popen(cmd.split())
                p.communicate()

            # process template vhost config / write to sites_available
            global_replace_vars['SERVER_FQDN'] = host_name
            global_replace_vars['WWW_PATH'] = vhost_www_path

            vhost_tpl_file = '{}/{}.conf'.format(dir_x0_app_config_apache_vhost, vhost_id)

            log_message(log_prefix, 'Open TplFile:{}'.format(vhost_tpl_file))

            with open(vhost_tpl_file, 'r') as fh:
                conf_data = fh.read()
                conf_data = replace_vhost_template(conf_data)

            # replace $VHOST_NAME_ENV
            replace_str = '${}'.format('VHOST_NAME_ENV')
            conf_data = conf_data.replace(replace_str, vhost_id_env)

            # write vhost conf file
            vhost_conf_file = '{}/{}.conf'.format(dir_apache2_sites_available, vhost_id_env)

            with open(vhost_conf_file, 'w') as fh:
                fh.write(conf_data)

            # link (activate) environment
            log_message(log_prefix, 'Enabling apache2 with vhost_env_id:{}'.format(vhost_id_env))
            cmd = 'a2ensite {}'.format(vhost_id_env)
            subprocess.run(cmd.split())

            # x0 installer related actions
            if installer_type is not None and installer_type == 'x0':

                # process global python
                src = '{}/python'.format(dir_x0_app_install)

                shutil.copytree(src, dir_python, dirs_exist_ok=True)

                for x0_app_id in vhost_x0_apps:

                    # process static
                    app_static_dir = '{}/static/{}'.format(vhost_www_path, x0_app_id)

                    cmd = 'mkdir -p {}'.format(app_static_dir)
                    p = subprocess.Popen(cmd.split())
                    p.communicate()

                    src = '{}/www/static/{}'.format(dir_x0_app_install, x0_app_id)
                    shutil.copytree(src, app_static_dir, dirs_exist_ok=True)

                    # if global css styles put in each app subdir
                    try:
                        src = '{}/www/css'.format(dir_x0_app_install)
                        shutil.copytree(src, app_static_dir, dirs_exist_ok=True)
                    except Exception as e:
                        pass

                # process www python
                src = '{}/www/python'.format(dir_x0_app_install)
                dst = '{}/python'.format(vhost_www_path)

                shutil.copytree(src, dst, dirs_exist_ok=True)

                # process x0 .js templates and userFunctions.js
                src = '{}/www/x0'.format(dir_x0_app_install)
                dst = '{}'.format(vhost_www_path)

                shutil.copytree(src, dst, dirs_exist_ok=True)
        else:
            # link (activate) "global" environment
            log_message(log_prefix, 'Enabling apache2 with vhost_id:{}'.format(vhost_id))
            cmd = 'a2ensite {}'.format(vhost_id)
            subprocess.run(cmd.split())

    # get first environment id
    first_env = app_config['env_list'][0]
    first_vhost = vhost_ids[0]

    # set apache2 server name
    vf_config = vhost_config[first_vhost]['env'][first_env]

    host_name = '{}.{}'.format(
        vf_config['dns']['hostname'],
        vf_config['dns']['domain']
    )

    cmd = [
        'sed',
        '-i',
        '/ServerName x0-test.local/c\ServerName {}'.format(host_name),
        apache2_config
    ]

    subprocess.run(cmd)

    log_message(log_prefix, 'Replace apache server name (sed) cmd:{}'.format(cmd))

    # reload apache
    cmd = 'service apache2 reload'
    subprocess.run(cmd.split())
