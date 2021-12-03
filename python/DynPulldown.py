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

        tmpResult = []

        service_json = json.loads(POSTData.Environment.getPOSTData(environ))
        data_req = service_json['RequestData']
        data_srv = service_json['ServiceData']

        try:
            sql = DBMapping.mapping[data_srv['ServiceID']]['sql']
            sql_params = {}

            try:
                params = DBMapping.mapping[data_srv['ServiceID']]['params']
            except:
                params = []
            for param in params:
                data_req[param] = str(data_req[param])
                sql_params[param] = data_req[param] if len(data_req[param]) > 0 else None

            with dbpool.pool.Handler('x0') as db:
                try:
                    for tmpRecord in db.query(sql, sql_params):
                        tmpDict = {
                            "display":  tmpRecord[0],
                            "value":    tmpRecord[1],
                        }
                        tmpResult.append(tmpDict)
                except Exception:
                    pass
                yield bytes(json.dumps(tmpResult), 'utf-8')

        except Exception as e:
            errorResult = {}
            errorResult['error'] = True
            errorResult['exception_id'] = type(e).__name__
            errorResult['exception'] = "{0}".format(e)
            yield bytes(json.dumps(errorResult), 'utf-8')
