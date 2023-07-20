import json


class Environment:
    @staticmethod
    def getPOSTData(environ):
        ContentLength = int(environ.get('CONTENT_LENGTH', 0))
        Data = environ['wsgi.input'].read(ContentLength)
        return Data
