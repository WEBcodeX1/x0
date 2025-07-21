import sys
import json

import DB
import DBMapping

from pgdbpool import pool

import POSTData

from StdoutLogger import logger

pool.Connection.init(DB.config)


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        Result = []

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

            with pool.Handler('x0') as db:
                try:
                    for tmpRecord in db.query(sql, sql_params):
                        tmpDict = {
                            "Display":  tmpRecord[0],
                            "Value":    tmpRecord[1],
                        }
                        Result.append(tmpDict)
                except Exception as e:
                    pass
                logger.debug(Result)
                yield bytes(json.dumps(Result), 'utf-8')

        except Exception as e:

            errorID = 100
            errorDescription = 'DynPulldown failed getting from Database.'

            errorResult = {}
            errorResult['error'] = True
            errorResult['error_id'] = errorID
            errorResult['exception_id'] = type(e).__name__
            errorResult['exception'] = "{0}".format(e)

            logger.error(errorResult)

            errorReturn = {}
            errorReturn['error'] = True
            errorReturn['error_id'] = errorID

            yield bytes(json.dumps(errorReturn), 'utf-8')
