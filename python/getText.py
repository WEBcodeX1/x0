import sys
import json

import DB
import dbpool.pool

dbpool.pool.Connection.init(DB.config)


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        tmpResult = { 0: { "SysName": "ObjectLoaderRequestID", "SysID": "Text" } }

        try:
            sql = """ SELECT
                      *
                      FROM
                       "webui"."text"
                      ORDER BY orderby""";

            with dbpool.pool.Handler('kunst') as db:
                for tmpRecord in db.query(sql):
                    tmpDict = {
                        "id":       tmpRecord[0],
                        "group":    tmpRecord[1],
                        "value_de": tmpRecord[2],
                        "value_en": tmpRecord[3],
                        "orderby":  tmpRecord[4]
                    }
                    tmpResult[tmpRecord[0]] = tmpDict

        except Exception as e:
            tmpResult['error'] = True
            tmpResult['exception'] = type(e).__name__

        yield bytes(json.dumps(tmpResult), 'utf-8')
