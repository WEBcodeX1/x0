import sys
import json

import DB
import DBMapping
import dbpool.pool

import POSTData

dbpool.pool.Connection.init(DB.config)


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        result = {}

        service_json = json.loads(POSTData.Environment.getPOSTData(environ))
        data_req = service_json['RequestData']

        if data_req['auth_key'] != 'cdba23___X//X___baf234':
            start_response('401 Unauthorized', [('Content-Type', 'application/json; charset=UTF-8')])
            result['auth_code'] = '401';
            result['auth_status'] = 'unauthorized';
            yield bytes(json.dumps(result), 'utf-8')
            return

        start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

        sql_update = """  UPDATE
                            public.wpuser
                          SET
                            login_time = now(),
                            session_id = %(session_id)s
                          WHERE
                            id = %(user_id)s"""

        try:
            with dbpool.pool.Handler('kunst') as db:

                sql_props = {
                    'session_id': data_req['session_id'],
                    'user_id': data_req['user_id']
                }

                db.query(sql_update, sql_props)

            result['status'] = 'ok'

        except Exception as e:
            result['error'] = True
            result['exception'] = type(e).__name__
            result['exception'] = "{0}".format(e)

        yield bytes(json.dumps(result), 'utf-8')
