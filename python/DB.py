import os
import time
import json

from datetime import datetime


DBName = 'x0'
DBUser = 'x0'
DBHost = 'mypostgres'
DBPass = os.environ['PSQL_x0_PWD']

config = {
    'db': {
        'host': DBHost,
        'name': DBName,
        'user': DBUser,
        'pass': DBPass,
        'ssl': 'disable',
        'connect_timeout': 30,
        'connection_retry_sleep': 1,
        'query_timeout': 30000,
        'session_tmp_buffer': 128
    },
    'groups': {
        'x0': {
            'connection_count': 3,
            'autocommit': True
        }
    }
}

config_ac_disabled = {
    'db': {
        'host': DBHost,
        'name': DBName,
        'user': DBUser,
        'pass': DBPass,
        'ssl': 'disable',
        'connect_timeout': 30,
        'connection_retry_sleep': 1,
        'query_timeout': 30000,
        'session_tmp_buffer': 128
    },
    'groups': {
        'x0noac': {
            'connection_count': 3,
            'autocommit': False,
        }
    }
}
