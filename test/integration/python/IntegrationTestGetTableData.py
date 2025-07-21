import sys
import json

import DB
from pgdbpool import pool

import POSTData

pool.Connection.init(DB.config)


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        Result = []

        service_json = json.loads(POSTData.Environment.getPOSTData(environ))
        data_req = service_json['RequestData']

        try:
            sql = """SELECT
                       id,
                       col1,
                       col2
                    FROM
                    integrationtest.list1
                    LIMIT %(LimitRows)s"""

            try:
                sql_params = {
                    'LimitRows': data_req['LimitRows']
                }
            except Exception as e:
                sql_params = {
                    'LimitRows': 100
                }

            with pool.Handler('x0') as db:
                for Record in db.query(sql, sql_params):
                    Row = {}
                    Row['id'] = Record['id']
                    Row['col1'] = Record['col1']
                    Row['col2'] = Record['col2']
                    Result.append(Row)

        except Exception as e:
            pass
        yield bytes(json.dumps(Result), 'utf-8')
