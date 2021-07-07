import sys
import json

import DB
import DBMapping
import POSTData

import dbpool.pool

dbpool.pool.Connection.init(DB.config)


def application(environ, start_response):

    def row_index_generator():
        index = -1
        while True:
            index += 1
            yield index

    if environ['REQUEST_METHOD'].upper() == 'POST':

        tmp_result = {}

        service_json = json.loads(POSTData.Environment.getPOSTData(environ))

        try:
            session_id = service_json['SessionData']['Value']
        except Exception as e:
            session_id = None

        try:
            user_id = 0

            with dbpool.pool.Handler('clickit') as db:
                sql = 'SELECT id, usertype FROM public.wpuser WHERE session_id = %(SessionID)s'
                sql_params = { 'SessionID': session_id }
                for record in db.query(sql, sql_params):
                    user_id = record['id']
                    user_type = record['usertype']

                if user_id == 0:
                    start_response('401 Unauthorized', [('Content-Type', 'application/json; charset=UTF-8')])
                    tmp_result['auth_code'] = '401';
                    tmp_result['auth_status'] = 'unauthorized';
                    yield bytes(json.dumps(tmp_result), 'utf-8')
                    return

            data_req = service_json['RequestData']
            data_srv = service_json['ServiceData']

            config = DBMapping.mapping[data_srv['BackendServiceID']]

            try:
                query_role = config['role']
            except Exception as e:
                query_role = 'user'

            if query_role == 'admin' and user_type == 10:
                start_response('401 Unauthorized', [('Content-Type', 'application/json; charset=UTF-8')])
                tmp_result['auth_code'] = '401';
                tmp_result['auth_status'] = 'unauthorized';
                yield bytes(json.dumps(tmp_result), 'utf-8')
                return

            sql_params = {}
            sql_params['SessionID'] = session_id
            data_req['SessionID'] = session_id

            #tmp_result['params'] = sql_params
            #tmp_result['config'] = config

            for param in config['params']:
                try:
                    param_prepend = config['modify'][param]['prepend']
                    param_append = config['modify'][param]['append']
                except Exception as e:
                    param_prepend = ''
                    param_append = ''
                sql_params[param] = "{}{}{}".format(param_prepend, data_req[param], param_append)

                if isinstance(data_req[param], str) and len(sql_params[param]) == 0:
                    sql_params[param] = None
                if isinstance(data_req[param], str) and sql_params[param] == '<NULL>':
                    sql_params[param] = None

            row_index = row_index_generator()
            with dbpool.pool.Handler('clickit') as db:
                try:
                    for rec in db.query(config['sql'], sql_params):
                        tmp_record = {}
                        for key in rec.keys():
                            if rec[key] is None:
                                rec[key] = ''
                            tmp_record[key] = str(rec[key])
                        tmp_result[row_index.__next__()] = tmp_record
                except Exception as e:
                    if "{0}".format(e) != 'no results to fetch':
                        raise

                start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])
                yield bytes(json.dumps(tmp_result), 'utf-8')

        except Exception as e:
            start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])
            tmp_result['error'] = True
            tmp_result['exception_id'] = type(e).__name__
            tmp_result['exception'] = "{0}".format(e)

            yield bytes(json.dumps(tmp_result), 'utf-8')
