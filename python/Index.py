import sys
import json
import re

import DB
import dbpool.pool

dbpool.pool.Connection.init(DB.config)

HTMLTop = """<!DOCTYPE html>
<html>
 <head>
  <title>{title}</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <link rel="icon" href="favicon.ico" type="image/png">
  <link rel="shortcut icon" href="favicon.ico" type="image/png">
  <link href="{subdir}static/Base.css" rel="stylesheet" type="text/css">
  <link href="{subdir}static/Styles.css" rel="stylesheet" type="text/css">
  <link href="{subdir}static/Button.css" rel="stylesheet" type="text/css">
  <link href="{subdir}static/bootstrap.css" rel="stylesheet" type="text/css">
  <script type="text/javascript" src="/userFunctions.js"></script>
  <script type="text/javascript" src="/sysHelper.js"></script>
  <script type="text/javascript" src="/sysSourceObjectHandler.js"></script>
  <script type="text/javascript" src="/sysRequestDataHandler.js"></script>
  <script type="text/javascript" src="/sysReactor.js"></script>
  <script type="text/javascript" src="/sysRandomNr.js"></script>
  <script type="text/javascript" src="/sysBase64.js"></script>
  <script type="text/javascript" src="/sysBaseDOMElement.js"></script>
  <script type="text/javascript" src="/sysBaseObject.js"></script>
  <script type="text/javascript" src="/sysXMLRPCRequest.js"></script>
  <script type="text/javascript" src="/sysXMLRPCBaseSyncLoader.js"></script>
  <script type="text/javascript" src="/sysJSONData.js"></script>
  <script type="text/javascript" src="/sysText.js"></script>
  <script type="text/javascript" src="/sysServiceConnector.js"></script>
  <script type="text/javascript" src="/sysObjFormula.js"></script>
  <script type="text/javascript" src="/sysObjLink.js"></script>
  <script type="text/javascript" src="/sysObjLinkExternal.js"></script>
  <script type="text/javascript" src="/sysObjMenuEnclose.js"></script>
  <script type="text/javascript" src="/sysObjSQLText.js"></script>
  <script type="text/javascript" src="/sysObjRowContainer.js"></script>
  <script type="text/javascript" src="/sysObjDiv.js"></script>
  <script type="text/javascript" src="/sysObjContextMenu.js"></script>
  <script type="text/javascript" src="/sysScreenOverlay.js"></script>
  <script type="text/javascript" src="/sysObjButton.js"></script>
  <script type="text/javascript" src="/sysObjButtonInternal.js"></script>
  <script type="text/javascript" src="/sysObjButtonCallback.js"></script>
  <script type="text/javascript" src="/sysObjNavigateForwardBackward.js"></script>
  <script type="text/javascript" src="/sysObjFileUpload.js"></script>
  <script type="text/javascript" src="/sysObjErrorContainer.js"></script>
  <script type="text/javascript" src="/sysFormfieldOnChangeHandler.js"></script>
  <script type="text/javascript" src="/sysIntervalHandler.js"></script>
  <script type="text/javascript" src="/sysObjFormfieldItem.js"></script>
  <script type="text/javascript" src="/sysFormfieldValidate.js"></script>
  <script type="text/javascript" src="/sysGlobalData.js"></script>
  <script type="text/javascript" src="/sysScreen.js"></script>
  <script type="text/javascript" src="/sysObjectLoader.js"></script>
  <script type="text/javascript" src="/sysObjList.js"></script>
  <script type="text/javascript" src="/sysObjTabContainer.js"></script>
  <script type="text/javascript" src="/sysObjFormfieldList.js"></script>
  <script type="text/javascript" src="/sysFactory.js"></script>
  <script type="text/javascript" src="/sysAsyncNotify.js"></script>
  <script type="text/javascript" src="/sysAsyncNotifyIndicator.js"></script>
  <script type="text/javascript" src="/sysAsyncNotifyIndicatorItem.js"></script>
  <script type="text/javascript" src="/sysAsyncNotifyMsgHandler.js"></script>
  {user_templates}
"""

HTMLBottom = """
  <script type="text/javascript" src="/sysInitOnLoad.js"></script>
 </head>
 <body onload="Init();">
 </body>
</html>
"""

HTMLDynScript = """
 <script>
  var sysVarPreLoadScript = undefined;
  var sysVarUserSetupClasses = new Object();
  var sysVarGlobalData = new Object();
  var sysVarUserFunctions = new Object();
  var sysVarAppSubdir = {subdir};
  var sysVarConfigMenuFile = {config_menu};
  var sysVarConfigObjectFile = {config_object};
  var sysVarConfigSkeletonFile = {config_skeleton};
  var sysVarDisplayDefaultScreen = {default_screen};
  var sysVarDebugLevel = {debug_level};
  var sysVarParentWindowURL = {parent_window_url};
  var sysVarDisplayLanguage = {display_language};
 </script>
"""

sql_template = """
SELECT
 "value"
FROM
 sys.config
WHERE
app_id = %(AppID)s AND config_group = '{}'""";


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'application/json; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'GET':

        try:
            RegexString = 'appid=([0-9a-zA-Z]{4,64})$'
            RegexObject = re.compile(RegexString)
            QueryString = environ['QUERY_STRING']
            m = RegexObject.match(QueryString)

            SQLParams = { "AppID": m.group(1) }
        except Exception as e:
            SQLParams = { "AppID": "default" }

        with dbpool.pool.Handler('x0') as db:

            sql = sql_template.format('index_title')
            for Record in db.query(sql, SQLParams):
                SiteTitle = Record[0]

            sql = sql_template.format('subdir')
            for Record in db.query(sql, SQLParams):
                SubDirEnclosed = '"{}"'.format(Record[0])
                SubDir = Record[0]

            sql = sql_template.format('template_file')

            ScriptLines = ''
            for Record in db.query(sql, SQLParams):
                ScriptLine = """<script type="text/javascript" src="/{}"></script>""".format(Record[0])
                ScriptLines += script_line

            sql = sql_template.format('config_file_menu')
            for Record in db.query(sql, SQLParams):
                ConfigFileMenu = '"{}"'.format(Record[0])

            sql = sql_template.format('config_file_object')
            for Record in db.query(sql, SQLParams):
                ConfigFileObject = '"{}"'.format(Record[0])

            sql = sql_template.format('config_file_skeleton')
            for Record in db.query(sql, SQLParams):
                ConfigFileSkeleton = '"{}"'.format(Record[0])

            sql = sql_template.format('debug_level')
            for Record in db.query(sql, SQLParams):
                DebugLevel = Record[0]

            sql = sql_template.format('display_language')
            for Record in db.query(sql, SQLParams):
                DisplayLanguage = '"{}"'.format(Record[0])

            sql = sql_template.format('default_screen')
            for Record in db.query(sql, SQLParams):
                DefaultScreen = '"{}"'.format(Record[0])

            sql = sql_template.format('parent_window_url')
            for Record in db.query(sql, SQLParams):
                ParentWindowURL = Record[0]

            HTMLTopR = HTMLTop.format(
                title = SiteTitle,
                subdir = SubDir,
                user_templates = ScriptLines
            )

            HTMLDynScriptR = HTMLDynScript.format(
                subdir = SubDirEnclosed,
                config_menu = ConfigFileMenu,
                config_object = ConfigFileObject,
                config_skeleton = ConfigFileSkeleton,
                debug_level = DebugLevel,
                display_language = DisplayLanguage,
                default_screen = DefaultScreen,
                parent_window_url = ParentWindowURL                
            )

        Result = "{}{}{}".format(HTMLTopR, HTMLDynScriptR, HTMLBottom);

        start_response('200 OK', [('Content-Type', 'text/html; charset=UTF-8')])
        yield bytes(Result, 'utf-8')
