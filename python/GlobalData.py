import sys
import json

import DB
import dbpool.pool

dbpool.pool.Connection.init(DB.config)


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        tmpResult = { 0: { "SysName": "ObjectLoaderRequestID", "SysID": "GlobalData" } }

        try:
        #for i in range(1):
            sql = """ SELECT
                    CAST(1 AS bigint) AS id,
                    'Testvar1' AS Var,
                    'Testvalue1' AS Value
                    """;

            with dbpool.pool.Handler('x0') as db:
                for tmpRecord in db.query(sql):
                    tmpDict = {
                        "id": tmpRecord[1],
                        "Var": tmpRecord[1],
                        "Value": tmpRecord[2]
                    }
                    tmpResult[tmpRecord[0]] = tmpDict

        except Exception as e:
            tmpResult['error'] = True
            tmpResult['exception'] = type(e).__name__

        yield bytes(json.dumps(tmpResult), 'utf-8')
