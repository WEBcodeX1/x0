#!/usr/bin/python3

import json
import logging
import subprocess

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger()


with open("../config/app-config.json") as fh:

    sys_config = json.load(fh)

    container_name = 'selenium-server'

    cmd = 'docker stop {}'.format(container_name)
    subprocess.run(cmd.split())
    cmd = 'docker container prune -f'
    subprocess.run(cmd.split())

    vhost_test_urls = {}

    for vhost_id, vhost_data in sys_config['vhosts'].items():
        vhost_dns = vhost_data['env']['test']['dns']
        vhost_test_urls[vhost_id] = '{}.{}'.format(
            vhost_dns['hostname'],
            vhost_dns['domain']
        )

    logger.debug('vhost_test_urls:{}'.format(vhost_test_urls))

    cmd = [
        'docker',
        'run',
        '-d',
        '--name',
        container_name,
        '--net',
        'x0-connect',
        '--ip',
        '172.20.0.40',
        '--shm-size=4gb'
    ]

    for host_id, test_url in vhost_test_urls.items():
        cmd.append('--add-host={}:172.20.0.10'.format(test_url))

    cmd.append('selenium/standalone-chrome:latest')

    logger.debug('docker cmd:{}'.format(cmd))

    res = subprocess.run(cmd, capture_output=True)
