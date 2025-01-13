import sys
import json
import re

import DB
import dbpool.pool

from StdoutLogger import logger

dbpool.pool.Connection.init(DB.config)

HTMLTop = """<!DOCTYPE html>
<html>
 <head>
  <title>{title}</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <link rel="icon" href="favicon.ico" type="image/png">
  <link rel="shortcut icon" href="favicon.ico" type="image/png">
  <link href="{subdir}/Base.css" rel="stylesheet">
  <link href="{subdir}/Styles.css" rel="stylesheet">
  <link href="{subdir}/Button.css" rel="stylesheet">
  <link href="{subdir}/bootstrap.css" rel="stylesheet">
  <link href="{subdir}/fonts/fontawesome/css/all.min.css" rel="stylesheet">
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
  var sysVarUserSetupClasses = new Object();
  var sysVarGlobalData = new Object();
  var sysVarUserFunctions = new Array();
  var sysVarPreLoadVars = new Object();
  var sysVarPreLoadScript = {preload_script};
  var sysVarAppSubdir = {subdir};
  var sysVarConfigMenuFile = {config_menu};
  var sysVarConfigObjectFile = {config_object};
  var sysVarConfigSkeletonFile = {config_skeleton};
  var sysVarDisplayDefaultScreen = {default_screen};
  var sysVarDebugLevel = {debug_level};
  var sysVarParentWindowURL = {parent_window_url};
  var sysVarDisplayLanguage = {display_language};
  var sysVarScreenConfig = {screen_config};
  {preload_vars}
  {user_functions}
  {setup_classes}
 </script>
"""

sql = """
SELECT
 "value"
FROM
 system.config
WHERE
app_id = %(AppID)s AND config_group = %(ConfigGroup)s""";


def application(environ, start_response):

    start_response('200 OK', [('Content-Type', 'text/html; charset=UTF-8')])

    if environ['REQUEST_METHOD'].upper() == 'GET':

        try:
            RegexString = 'appid=([0-9a-zA-Z_]{4,64})(&user_session=([0-9a-zA-Z])+)?$'
            RegexObject = re.compile(RegexString)
            QueryString = environ['QUERY_STRING']
            m = RegexObject.match(QueryString)

            SQLParams = { "AppID": m.group(1) }
        except Exception as e:
            SQLParams = { "AppID": "default" }

        with dbpool.pool.Handler('x0') as db:

            PreLoadScript = 'undefined';
            SQLParams['ConfigGroup'] = 'preload_script'
            for Record in db.query(sql, SQLParams):
                PreLoadScript = Record[0]

            PreLoadVars = ''
            SQLParams['ConfigGroup'] = 'preload_var'
            for Record in db.query(sql, SQLParams):
                PreLoadVarLine = 'sysVarPreLoadVars{};'.format(Record[0])
                PreLoadVars += PreLoadVarLine

            UserFunctions = ''
            SQLParams['ConfigGroup'] = 'user_function'
            for Record in db.query(sql, SQLParams):
                UserFunctionLine = 'sysVarUserFunctions{};'.format(Record[0])
                UserFunctions += UserFunctionLine

            SetupClasses = ''
            SQLParams['ConfigGroup'] = 'setup_class'
            for Record in db.query(sql, SQLParams):
                SetupClassLine = 'sysVarUserSetupClasses{};'.format(Record[0])
                SetupClasses += SetupClassLine

            SQLParams['ConfigGroup'] = 'index_title'
            for Record in db.query(sql, SQLParams):
                SiteTitle = Record[0]

            SQLParams['ConfigGroup'] = 'subdir'
            for Record in db.query(sql, SQLParams):
                SubDirEnclosed = '"{}"'.format(Record[0])
                SubDir = Record[0]

            SQLParams['ConfigGroup'] = 'template_file'
            TemplateFiles = ''
            for Record in db.query(sql, SQLParams):
                ScriptLine = """<script type="text/javascript" src="/{}"></script>""".format(Record[0])
                TemplateFiles += ScriptLine

            SQLParams['ConfigGroup'] = 'config_file_menu'
            for Record in db.query(sql, SQLParams):
                ConfigFileMenu = '"{}"'.format(Record[0])

            SQLParams['ConfigGroup'] = 'config_file_object'
            for Record in db.query(sql, SQLParams):
                ConfigFileObject = '"{}"'.format(Record[0])

            SQLParams['ConfigGroup'] = 'config_file_skeleton'
            for Record in db.query(sql, SQLParams):
                ConfigFileSkeleton = '"{}"'.format(Record[0])

            SQLParams['ConfigGroup'] = 'debug_level'
            for Record in db.query(sql, SQLParams):
                DebugLevel = Record[0]

            SQLParams['ConfigGroup'] = 'display_language'
            for Record in db.query(sql, SQLParams):
                DisplayLanguage = '"{}"'.format(Record[0])

            SQLParams['ConfigGroup'] = 'default_screen'
            for Record in db.query(sql, SQLParams):
                DefaultScreen = '"{}"'.format(Record[0])

            SQLParams['ConfigGroup'] = 'parent_window_url'
            for Record in db.query(sql, SQLParams):
                ParentWindowURL = Record[0]

            ScreenConfig = 'undefined'
            SQLParams['ConfigGroup'] = 'screen_config'
            for Record in db.query(sql, SQLParams):
                ScreenConfig = Record[0]

            HTMLTopR = HTMLTop.format(
                title = SiteTitle,
                subdir = SubDir,
                user_templates = TemplateFiles
            )

            HTMLDynScriptR = HTMLDynScript.format(
                preload_script = PreLoadScript,
                preload_vars = PreLoadVars,
                setup_classes = SetupClasses,
                user_functions = UserFunctions,
                subdir = SubDirEnclosed,
                config_menu = ConfigFileMenu,
                config_object = ConfigFileObject,
                config_skeleton = ConfigFileSkeleton,
                debug_level = DebugLevel,
                display_language = DisplayLanguage,
                default_screen = DefaultScreen,
                parent_window_url = ParentWindowURL,
                screen_config = ScreenConfig
            )

        Result = "{}{}{}".format(HTMLTopR, HTMLDynScriptR, HTMLBottom);

        logger.debug(Result)

        yield bytes(Result, 'utf-8')
