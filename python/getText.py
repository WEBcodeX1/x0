import sys
import json

import DB
from pgdbpool import pool

from StdoutLogger import logger

pool.Connection.init(DB.config)


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        Result = { 0: { "SysName": "ObjectLoaderRequestID", "SysID": "Text" } }

        try:
            sql = """ SELECT
                      *
                      FROM
                       "webui"."text"
                      ORDER BY orderby""";

            with pool.Handler('x0') as db:
                for tmpRecord in db.query(sql):
                    tmpDict = {
                        "id":       tmpRecord[0],
                        "group":    tmpRecord[1],
                        "value_de": tmpRecord[2],
                        "value_en": tmpRecord[3],
                        "orderby":  tmpRecord[4]
                    }
                    Result[tmpRecord[0]] = tmpDict

            logger.debug(Result)

            yield bytes(json.dumps(Result), 'utf-8')

        except Exception as e:

            errorID = 101
            errorDescription = 'SQLText failed getting from Database.'

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
