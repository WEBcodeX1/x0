import os
import time
import json

from datetime import datetime

import dbpool.pool


DBName = 'x0'
DBUser = 'x0'
DBHost = '127.0.0.1'
DBPass = 'dummy'

config = {
    'db': {
        'host': DBHost,
        'name': DBName,
        'user': DBUser,
        'pass': DBPass,
        'ssl': 'disable',
        'connect_timeout': 30,
        'connection_retry_sleep': 1,
        'query_timeout': 30,
        'session_tmp_buffer': 128
    },
    'groups': {
        'x0': {
            'connection_count': 3,
            'autoommit': True,
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
        'query_timeout': 30,
        'session_tmp_buffer': 128
    },
    'groups': {
        'x0noac': {
            'connection_count': 3,
            'autoommit': False,
        }
    }
}
