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
                    'Foerderrunde' AS Var,
                    CASE
                        WHEN now() BETWEEN "Foerderrunde1StartDate" AND "Foerderrunde1EndDate" THEN '1'
                        WHEN now() BETWEEN "Foerderrunde2StartDate" AND "Foerderrunde2EndDate" THEN '2'
                        ELSE NULL
                    END
                    AS Value
                    FROM \
                    public.foerderrunde
                    WHERE
                        EXTRACT(YEAR FROM "FestsetzungJahr") = EXTRACT(YEAR FROM now())
					UNION
					SELECT
                    CAST(2 AS bigint) AS id,
                    'FoerderrundeEndDate' AS Var,
                    CASE
                        WHEN now() BETWEEN "Foerderrunde1StartDate" AND "Foerderrunde1EndDate" THEN CAST ("Foerderrunde1EndDate" AS varchar)
                        WHEN now() BETWEEN "Foerderrunde2StartDate" AND "Foerderrunde2EndDate" THEN CAST ("Foerderrunde2EndDate" AS varchar)
                        ELSE NULL
                    END
                    AS Value
                    FROM \
                    public.foerderrunde
                    WHERE
                        EXTRACT(YEAR FROM "FestsetzungJahr") = EXTRACT(YEAR FROM now())
                    UNION
                    SELECT
                    (id+2) AS id,
                    variable_name AS Var,
                    variable_value AS Value
                    FROM
                    public.globalvars
                    """;

            with dbpool.pool.Handler('kunst') as db:
                for tmpRecord in db.query(sql):
                    tmpDict = {
                        "id":    tmpRecord[1],
                        "Var":    tmpRecord[1],
                        "Value":  tmpRecord[2]
                    }
                    tmpResult[tmpRecord[0]] = tmpDict

        except Exception as e:
            tmpResult['error'] = True
            tmpResult['exception'] = type(e).__name__

        yield bytes(json.dumps(tmpResult), 'utf-8')
