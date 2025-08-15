import sys
import json
import re

import DB
from pgdbpool import pool

from StdoutLogger import logger

pool.Connection.init(DB.config)

HTMLTop = """<!DOCTYPE html>
<html>
 <head>
  <title>{title}</title>
  <meta http-equiv="Content-Type" content="text/html; charset=utf-8">
  <link rel="icon" href="favicon.ico" type="image/png">
  <link rel="shortcut icon" href="favicon.ico" type="image/png">
  <link href="{subdir}/bootstrap.css" rel="stylesheet">
  <link href="{subdir}/globalstyles.css" rel="stylesheet">
  <link href="{subdir}/fontawesome/css/all.min.css" rel="stylesheet">
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
  <script type="text/javascript" src="/sysRTPagination.js"></script>
  <script type="text/javascript" src="/sysRTFormSectionHeader.js"></script>
  <script type="text/javascript" src="/sysObjLink.js"></script>
  <script type="text/javascript" src="/sysObjLinkExternal.js"></script>
  <script type="text/javascript" src="/sysObjSQLText.js"></script>
  <script type="text/javascript" src="/sysObjDiv.js"></script>
  <script type="text/javascript" src="/sysObjContextMenu.js"></script>
  <script type="text/javascript" src="/sysScreenOverlay.js"></script>
  <script type="text/javascript" src="/sysObjButton.js"></script>
  <script type="text/javascript" src="/sysObjButtonInternal.js"></script>
  <script type="text/javascript" src="/sysObjButtonCallback.js"></script>
  <script type="text/javascript" src="/sysObjFileUpload.js"></script>
  <script type="text/javascript" src="/sysObjErrorContainer.js"></script>
  <script type="text/javascript" src="/sysFormfieldOnChangeHandler.js"></script>
  <script type="text/javascript" src="/sysIntervalHandler.js"></script>
  <script type="text/javascript" src="/sysFormfieldValidate.js"></script>
  <script type="text/javascript" src="/sysObjFormfieldItem.js"></script>
  <script type="text/javascript" src="/sysGlobalData.js"></script>
  <script type="text/javascript" src="/sysScreen.js"></script>
  <script type="text/javascript" src="/sysObjectLoader.js"></script>
  <script type="text/javascript" src="/sysObjList.js"></script>
  <script type="text/javascript" src="/sysObjTabContainer.js"></script>
  <script type="text/javascript" src="/sysObjFormfieldList.js"></script>
  <script type="text/javascript" src="/sysObjDynRadioList.js"></script>
  <script type="text/javascript" src="/sysGridGenerator.js"></script>
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
  var sysVarMessageHandling = {message_handling};
  {preload_vars}
  {user_functions}
  {setup_classes}
 </script>
"""

sql = """
SELECT
 config_group,
 "value"
FROM
 system.config
WHERE
 app_id = %(AppID)s
ORDER BY
 config_group, "value" ASC
""";


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

        with pool.Handler('x0') as db:

            PreLoadVars = ''
            UserFunctions = ''
            SetupClasses = ''
            TemplateFiles = ''

            PreLoadScript = 'undefined';
            ScreenConfig = 'undefined'
            MessageHandling = 'false'

            for Record in db.query(sql, SQLParams):

                if Record[0] == 'preload_script':
                    PreLoadScript = Record[1]
                elif Record[0] == 'index_title':
                    SiteTitle = Record[1]
                elif Record[0] == 'subdir':
                    SubDirEnclosed = '"{}"'.format(Record[1])
                    SubDir = Record[1]
                elif Record[0] == 'config_file_menu':
                    ConfigFileMenu = '"{}"'.format(Record[1])
                elif Record[0] == 'config_file_object':
                    ConfigFileObject = '"{}"'.format(Record[1])
                elif Record[0] == 'config_file_skeleton':
                    ConfigFileSkeleton = '"{}"'.format(Record[1])
                elif Record[0] == 'debug_level':
                    DebugLevel = Record[1]
                elif Record[0] == 'display_language':
                    DisplayLanguage = '"{}"'.format(Record[1])
                elif Record[0] == 'default_screen':
                    DefaultScreen = '"{}"'.format(Record[1])
                elif Record[0] == 'parent_window_url':
                    ParentWindowURL = Record[1]
                elif Record[0] == 'screen_config':
                    ScreenConfig = Record[1]
                elif Record[0] == 'message_handler':
                    MessageHandling = Record[1]

                elif Record[0] == 'preload_var':
                    PreLoadVarLine = 'sysVarPreLoadVars{};'.format(Record[1])
                    PreLoadVars += PreLoadVarLine
                elif Record[0] == 'user_function':
                    UserFunctionLine = 'sysVarUserFunctions{};'.format(Record[1])
                    UserFunctions += UserFunctionLine
                elif Record[0] == 'setup_class':
                    SetupClassLine = 'sysVarUserSetupClasses{};'.format(Record[1])
                    SetupClasses += SetupClassLine
                elif Record[0] == 'template_file':
                    ScriptLine = """<script type="text/javascript" src="/{}"></script>""".format(Record[1])
                    TemplateFiles += ScriptLine

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
                screen_config = ScreenConfig,
                message_handling = MessageHandling
            )

        Result = "{}{}{}".format(HTMLTopR, HTMLDynScriptR, HTMLBottom);

        logger.debug(Result)

        yield bytes(Result, 'utf-8')
