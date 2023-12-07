#!/usr/bin/python3

import sys
import json

app_config_file = '../config/app-config.json'

with open(app_config_file, 'r') as fh:
    json_config = json.load(fh)

print(json_config['database']['name'])
