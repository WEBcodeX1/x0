import sys
import json

import DB
import DBMapping
import POSTData

import dbpool.pool

from StdoutLogger import logger

dbpool.pool.Connection.init(DB.config)


def application(environ, start_response):

    def row_index_generator():
        index = -1
        while True:
            index += 1
            yield index

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        Result = {}

        service_json = json.loads(POSTData.Environment.getPOSTData(environ))

        try:

            data_req = service_json['RequestData']
            data_srv = service_json['ServiceData']

            config = DBMapping.mapping[data_srv['ServiceID']]

            sql_params = {}

            #Result['params'] = sql_params
            #Result['config'] = config

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
            with dbpool.pool.Handler('x0') as db:
                try:
                    for rec in db.query(config['sql'], sql_params):
                        tmp_record = {}
                        for key in rec.keys():
                            if rec[key] is None:
                                rec[key] = ''
                            tmp_record[key] = str(rec[key])
                        Result[row_index.__next__()] = tmp_record
                except Exception as e:
                    if "{0}".format(e) != 'no results to fetch':
                        raise
            logger.debug(Result)
            yield bytes(json.dumps(Result), 'utf-8')

        except Exception as e:
            errorID = 103
            errorDescription = 'SQL Mapper processing / getting data from Database failed.'

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
