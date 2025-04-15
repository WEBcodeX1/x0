#!/usr/bin/python3

import socket
import time
import json
import sys
import pwd
import grp
import os


sys.path.append('/var/lib/msgserver/bin')

server_config = {
    'address': '/var/lib/msgserver/messageserver.socket',
    'permissions': {
        'user': 'www-data',
        'group': 'www-data',
        'userid': 33,
        'groupid': 33,
        'mod': '0770'
    }
}

messages = {}


def drop_privileges(uid_name='nobody', gid_name='nogroup'):

    if os.getuid() != 0:
        return

    # set the uid/gid from the name
    running_uid = pwd.getpwnam(uid_name).pw_uid
    running_gid = grp.getgrnam(gid_name).gr_gid

    # remove group privileges
    os.setgroups([])

    # try setting the new uid/gid
    os.setgid(running_gid)
    os.setuid(running_uid)


# unlink server socket if exists
try:
    os.unlink(server_config['address'])
except OSError:
    if os.path.exists(server_config['address']):
        raise

# create socket
try:
    sock = socket.socket(socket.AF_UNIX, socket.SOCK_SEQPACKET)
    sock.bind(server_config['address'])
    sock.listen(1)
except Exception as e:
    raise
    exit(0)

try:
    os.chown(
        server_config['address'],
        server_config['permissions']['userid'],
        server_config['permissions']['groupid']
    )
except OSError:
    if os.path.exists(server_config['address']):
        raise
try:
    drop_privileges(server_config['permissions']['user'], server_config['permissions']['group'])
except Exception as e:
    raise
    exit(0)

while True:
    # wait for a connection
    #print('waiting for a connection')
    connection, client_address = sock.accept()

    try:
        data = connection.recv(4096)
        #print("received '{}'".format(data))

        result = {
            'messages': None
        }

        request = json.loads(data)

        if request['type'] == 'SET':
            dst_session = request['session_dst']
            if dst_session not in messages:
                messages[dst_session] = []
            request['payload']['session_src'] = request['session_src']
            messages[dst_session].append(request['payload'])
            #print('SET message for dst_session:{} payload:{}'.format(dst_session, str(request['payload'])))
            result['status'] = 'ok'

        if request['type'] == 'GET':
            src_session = request['session_src']
            #print('Try GET messages for src_session:{} len msgs:{}'.format(src_session, len(messages)))
            if src_session in messages:
                result['messages'] = messages[src_session]
                #print('Returning messages for src_session:{} result:{}'.format(src_session, str(result)))

                src_session = request['session_src']
                if src_session in messages:
                    del messages[src_session]
                    #print('DEL messages for src_session:{}'.format(src_session))

        time.sleep(1)
        #print(result)

        connection.sendall(bytes(json.dumps(result), 'utf-8'))

    except Exception as e:
        result = {}
        result['error'] = True
        result['exception_id'] = type(e).__name__
        result['exception'] = '{0}'.format(e)
        #print(result)
    finally:
        connection.close()
