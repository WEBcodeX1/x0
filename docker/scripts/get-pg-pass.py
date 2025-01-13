#!/usr/bin/python3

import sys
import json

pwd_type = sys.argv[1]

app_config_file = '../config/app-config.json'

with open(app_config_file, 'r') as fh:
    json_config = json.load(fh)

if pwd_type == 'su':
    password = json_config['database']['su_password']
if pwd_type == 'x0':
    password = json_config['database']['x0_password']

print(password)
