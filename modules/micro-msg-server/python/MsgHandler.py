import sys
import time
import json
import socket


class Environment:
    @staticmethod
    def getPOSTData(environ):
        ContentLength = int(environ.get('CONTENT_LENGTH', 0))
        Data = environ['wsgi.input'].read(ContentLength)
        return Data


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        Params = json.loads(Environment.getPOSTData(environ))

        result = {}

        req_params = {}

        try:
            session_src = Params['SessionData']['Value']
            session_dst = Params['RequestData']['FormlistSelectDstUser']['DstUserSession']
            payload = Params['RequestData']['FormlistExchangeData']
            req_params['type'] = 'SET'
            req_params['session_src'] = session_src
            req_params['session_dst'] = session_dst
            req_params['payload'] = {
                'msg-type': 'net-message',
                'method-id': 'set-data',
                'dst-object': 'FormlistExchangeData',
                'payload': payload
            }
        except Exception as e:
            req_params = Params
            result['exception-set-params'] = '{0}'.format(e)

        try:
            server_address = '/var/lib/msgserver/messageserver.socket'

            try:
                received = ''
                if req_params['type'] == 'SET' or req_params['type'] == 'DEL':
                    sock = socket.socket(socket.AF_UNIX, socket.SOCK_SEQPACKET)
                    sock.connect(server_address)
                    sock.sendall(bytes(json.dumps(req_params), 'utf-8'))
                    received = sock.recv(4096)
                    sock.close()
                if req_params['type'] == 'GET':
                    send_data = bytes(json.dumps(req_params), 'utf-8')
                    for i in range(0, 10):
                        sock = socket.socket(socket.AF_UNIX, socket.SOCK_SEQPACKET)
                        sock.connect(server_address)
                        sock.sendall(send_data)
                        received = sock.recv(4096)
                        sock.close()
                        check = json.loads(received)
                        if check['messages'] is not None:
                            break
                        time.sleep(1)

            except Exception as e:
                result['error'] = True
                result['exception_id'] = type(e).__name__
                result['exception'] = 'Server send error {0}'.format(e)
                raise e

            yield bytes(json.dumps(json.loads(received)), 'utf-8')

        except Exception as e:
            result['error'] = True
            result['req_params'] = req_params
            result['Params'] = Params
            result['exception_id'] = type(e).__name__
            result['exception'] = '{0}'.format(e)
            yield bytes(json.dumps(result), 'utf-8')
