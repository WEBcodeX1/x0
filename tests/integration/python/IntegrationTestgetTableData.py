# modules import
import re
import sys
import json

import DB
import dbpool.pool

dbpool.pool.Connection.init(DB.config)


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'GET':

        RegexString = 'limit=([0-9][0-9]?)+$'
        RegexObject = re.compile(RegexString)
        URL = environ['QUERY_STRING']
        Match = RegexObject.match(RegexString)
        LimitRows = Match.group(1)

        Result = {}

        try:
            sql = """SELECT
                       country_code,
                       area_code,
                       phone_number
                    FROM
                    phone
                    LIMIT %(LimitRows}"""

            sql_params = {
                'LimitRows': LimitRows
            }
            with dbpool.pool.Handler('clickit') as db:
                for Record in db.query(sql, sql_params):
                    Row = {}
                    Row['country'] = Record['country_code']
                    Row['areacode'] = Record['area_code']
                    Row['number'] = Record['phone_number']
                    Result.append(Row)

        except Exception as e:
            Result['Error'] = True
            Result['Exception'] = type(e).__name__

        yield bytes(json.dumps(Result), 'utf-8')
