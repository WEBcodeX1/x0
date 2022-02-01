import sys
import json

import DB
import DBMapping
import dbpool.pool

import POSTData

dbpool.pool.Connection.init(DB.config)


def application(environ, start_response):

    if environ['REQUEST_METHOD'].upper() == 'POST':

        result = {}

        service_json = json.loads(POSTData.Environment.getPOSTData(environ))
        data_req = service_json['RequestData']

        if data_req['auth_key'] != 'a2c3b2___//___ca23b2':
            start_response('401 Unauthorized', [('Content-Type', 'application/json; charset=UTF-8')])
            result['auth_code'] = '401';
            result['auth_status'] = 'unauthorized';
            yield bytes(json.dumps(result), 'utf-8')
            return

        start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

        sql_user = """    INSERT INTO
                        public.wpuser
                        (
                            id,
                            user_login,
                            usertype
                        )
                        VALUES
                        (
                            %(user_id)s,
                            %(user_login)s,
                            %(user_type)s
                        );"""

        try:
            with dbpool.pool.Handler('x0') as db:

                sql_props = {
                    'user_id': data_req['user_id'],
                    'user_login': data_req['user_login'],
                    'user_type': 20 if data_req['user_admin'] == '1' else 10
                }

                db.query(sql_user, sql_props)

            result['status'] = 'ok'

        except Exception as e:
            result['error'] = True
            result['exception'] = type(e).__name__
            result['exception'] = "{0}".format(e)

        yield bytes(json.dumps(result), 'utf-8')
