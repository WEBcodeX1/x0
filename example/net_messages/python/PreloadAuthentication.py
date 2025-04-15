import sys
import json
import random

from StdoutLogger import logger


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'POST':

        UserSessions = [
            "0a34cb25-7fa23e34",
            "0a34cb22-7fa23e34",
            "0a34cb20-7fa23e34",
        ]

        randnr = random.randrange(0, 3)

        Result = {
            "user_id": 'user{}'.format(randnr+1),
            "user_session": UserSessions[randnr]
        }

        logger.debug(Result)

        yield bytes(json.dumps(Result), 'utf-8')
