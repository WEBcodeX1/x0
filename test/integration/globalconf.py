#!/usr/bin/python3

import os
import json
import logging

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()


def setup():

    # currently only run test inside container supported
    sys_config_file = '/var/lib/x0/config/app-config.json'

    try:
        https_only = os.environ['TEST_HTTPS_ONLY']
        url_prefix = 'https://'
    except Exception as e:

        # if run in kubernetes namespace always use https
        try:
            run_namespace = os.environ['RUN_NAMESPACE']
            url_prefix = 'https://'
        except Exception as e:
            url_prefix = 'http://'

    vhost_test_dns = {}
    vhost_test_urls = {}

    with open(sys_config_file) as fh:
        sys_config = json.load(fh)
        for vhost_id, vhost_data in sys_config['vhosts'].items():
            try:
                vhost_dns = vhost_data['env']['test']['dns']
                vhost_test_dns[vhost_id] = '{}.{}'.format(
                    vhost_dns['hostname'],
                    vhost_dns['domain']
                )
                vhost_test_urls[vhost_id] = '{}{}'.format(
                    url_prefix,
                    vhost_test_dns[vhost_id]
                )
            except Exception as e:
                pass

    logger.debug('vhost_test_dns:{}'.format(vhost_test_dns))
    logger.debug('vhost_test_urls:{}'.format(vhost_test_urls))

    return vhost_test_urls
