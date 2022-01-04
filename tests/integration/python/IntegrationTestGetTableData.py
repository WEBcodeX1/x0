import sys
import json

import DB
import dbpool.pool

import POSTData

dbpool.pool.Connection.init(DB.config)


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        Result = []

        service_json = json.loads(POSTData.Environment.getPOSTData(environ))
        data_req = service_json['RequestData']

        #try:
        for i in range(1):

            sql = """SELECT
                       id,
                       col1,
                       col2
                    FROM
                    integrationtest.list1
                    LIMIT %(LimitRows)s"""

            sql_params = {
                'LimitRows': data_req['LimitRows']
            }

            with dbpool.pool.Handler('x0') as db:
                for Record in db.query(sql, sql_params):
                    Row = {}
                    Row['id'] = Record['id']
                    Row['col1'] = Record['col1']
                    Row['col2'] = Record['col2']
                    Result.append(Row)

        #except Exception as e:
            #Result['Error'] = True
            #Result['Exception'] = type(e).__name__
            #pass

        yield bytes(json.dumps(Result), 'utf-8')
