//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "InitOnLoad"                                                      -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- System Initialization                                                    -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- Set Global Namespace Variables
//------------------------------------------------------------------------------

var sysFactory;


//------------------------------------------------------------------------------
//- Disable Global Browser based Context Menu
//------------------------------------------------------------------------------

document.oncontextmenu = function() {
    return false;
}


//------------------------------------------------------------------------------
//- Main
//------------------------------------------------------------------------------

function Init() {

    if (sysVarPreLoadScript === undefined) {
        InitOk();
    }
    else {
        var paramString = new URLSearchParams(document.URL);

        var XHR = new XMLHttpRequest();
        XHR.upload.addEventListener('error', this.InitError);
        XHR.open('POST', sysVarPreLoadScript);
        XHR.send(null);
        XHR.onreadystatechange = function() {
            if (XHR.readyState == 4 && XHR.status == 200) {
                InitOk(XHR);
            }
        }
    }
}

function InitError() {
    alert('Critical System Error');
}

function InitOk(XHR) {

    //----------------------------------------------------------------------------
    //- Set User ID / Session
    //----------------------------------------------------------------------------

    var UserID = null;
    var UserSession = null;

    //----------------------------------------------------------------------------
    //- Construct Global Object Factory (Main Object Handler)
    //----------------------------------------------------------------------------

    sysFactory = new sysFactory();

    sysFactory.SetupClasses = Object.assign(
        sysFactory.SetupClasses,
        sysVarUserSetupClasses
    );

    sysFactory.ObjGlobalData = {};

    if (sysVarPreLoadScript !== undefined) {
        const InsertResult = JSON.parse(XHR.responseText);
        for (Key in sysVarPreLoadVars) {
            sysFactory.ObjGlobalData[Key] = InsertResult[sysVarPreLoadVars[Key]];
        }
        try {
            UserID = sysFactory.ObjGlobalData['UserID'];
            UserSession = sysFactory.ObjGlobalData['UserSession'];
        }
        catch {
            console.debug('No user data supplied by backend');
        }
    }

    if (sysVarScreenConfig !== undefined) {
        sysFactory.ScreenConfig = sysVarScreenConfig;
    }


    //----------------------------------------------------------------------------
    //- System Object Loader
    //----------------------------------------------------------------------------

    sysObjLoader = new sysObjectLoader(sysFactory);

    sysFactory.ObjText = new sysText();
    sysFactory.DataMenu = new sysJSONData();
    sysFactory.DataObject = new sysJSONData();
    sysFactory.DataSkeleton = new sysJSONData();

    sysObjLoader.add(sysFactory.ObjText);
    sysObjLoader.add(sysFactory.DataMenu);
    sysObjLoader.add(sysFactory.DataObject);
    sysObjLoader.add(sysFactory.DataSkeleton);

    sysFactory.ObjText.setLoaderObj(sysObjLoader);
    sysFactory.DataMenu.setLoaderObj(sysObjLoader);
    sysFactory.DataObject.setLoaderObj(sysObjLoader);
    sysFactory.DataSkeleton.setLoaderObj(sysObjLoader);

    sysFactory.ObjText.requestXMLRPCData('/python/getText.py');
    sysFactory.DataMenu.requestXMLRPCData(sysVarAppSubdir + '/' + sysVarConfigMenuFile);
    sysFactory.DataObject.requestXMLRPCData(sysVarAppSubdir + '/' + sysVarConfigObjectFile);
    sysFactory.DataSkeleton.requestXMLRPCData(sysVarAppSubdir + '/' + sysVarConfigSkeletonFile);


    //----------------------------------------------------------------------------
    //- Set System Vars
    //----------------------------------------------------------------------------

    sysFactory.DisplayDefaultScreen            = sysVarDisplayDefaultScreen;

    sysFactory.SysDebugLevel                = sysVarDebugLevel;
    sysFactory.SysSessionID                    = 'SYS_SESSION';
    sysFactory.SysUserID                    = UserID;
    sysFactory.SysSessionValue                = UserSession;
    sysFactory.MsgServerGetURL                = 'http://x0-msg-server.x0.localnet:8080/python/MsgHandler.py';

    sysFactory.ParentWindowURL                = sysVarParentWindowURL;


    //----------------------------------------------------------------------------
    //- Style Defaults
    //----------------------------------------------------------------------------

    sysFactory.DefaultStyleScreen            = 'col-md-8 ms-auto me-auto';
    sysFactory.DefaultStyleMenu                = 'menu-absolute-pos';
    sysFactory.DefaultStyleScreenOverlay    = 'p-3 shadow-lg border bg-gradient bg-opacity-75 overlay-default';
    sysFactory.DefaultStyleListNavLeft        = 'col-6 p-4 pl-0';
    sysFactory.DefaultStyleListNavRight        = 'col-6 p-4 float-end text-end pr-0';


    //----------------------------------------------------------------------------
    //- Display Language
    //----------------------------------------------------------------------------

    sysFactory.EnvUserLanguage    = sysVarDisplayLanguage;


    //----------------------------------------------------------------------------
    //- User Functions
    //----------------------------------------------------------------------------

    sysFactory.UserFunctions = new Object();


    //----------------------------------------------------------------------------
    //- Set Global Reactor / Event Processing Object
    //----------------------------------------------------------------------------

    sysFactory.Reactor = new sysReactor();


    //----------------------------------------------------------------------------
    //- Construct Global Async Notify Indicator
    //----------------------------------------------------------------------------

    sysFactory.GlobalAsyncNotifyIndicator = new sysObjAsyncNotifyIndicator();


    //----------------------------------------------------------------------------
    //- Start Async Notify Message Handler
    //----------------------------------------------------------------------------

    sysFactory.sysGlobalAsyncNotifyHandler = new sysAsyncNotifyMsgHandler();

}
