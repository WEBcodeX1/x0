import sys
import json

import DB
from pgdbpool import pool

from StdoutLogger import logger

pool.Connection.init(DB.config)


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        Result = { 0: { "SysName": "ObjectLoaderRequestID", "SysID": "GlobalData" } }

        try:
            sql = """ SELECT
                    CAST(1 AS bigint) AS id,
                    'Testvar1' AS Var,
                    'Testvalue1' AS Value
                    """;

            with pool.Handler('x0') as db:
                for tmpRecord in db.query(sql):
                    tmpDict = {
                        "id": tmpRecord[1],
                        "Var": tmpRecord[1],
                        "Value": tmpRecord[2]
                    }
                    Result[tmpRecord[0]] = tmpDict

            logger.debug(Result)
            yield bytes(json.dumps(Result), 'utf-8')

        except Exception as e:

            errorID = 102
            errorDescription = 'GlobalData failed getting from Database.'

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
