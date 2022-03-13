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

		var UserSession = new Object();
		UserSession['user_session'] = paramString.get('user_session');

		var XHR = new XMLHttpRequest();
		XHR.upload.addEventListener('error', this.InitError);
		XHR.open('POST', './python/CalculatorOfferNew.py');
		XHR.send(JSON.stringify(UserSession));
		XHR.onreadystatechange = function() {
			if (XHR.readyState == 4 && XHR.status == 200) {
				InitOk(XHR);
			}
		}
	}
}

function InitError() {
	alert('System Backend Error');
}

function InitOk(XHR) {

	//----------------------------------------------------------------------------
	//- Parse User Session
	//----------------------------------------------------------------------------

	const paramString = new URLSearchParams(document.URL);
	const UserSession = paramString.get('user_session');

	
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
		sysFactory.ObjGlobalData = Object.assign(
			sysFactory.ObjGlobalData,
			sysVarGlobalData
		);
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
	sysFactory.DataMenu.requestXMLRPCData(sysVarAppSubdir + '/static/' + sysVarConfigMenuFile);
	sysFactory.DataObject.requestXMLRPCData(sysVarAppSubdir + '/static/' + sysVarConfigObjectFile);
	sysFactory.DataSkeleton.requestXMLRPCData(sysVarAppSubdir + '/static/' + sysVarConfigSkeletonFile);


	//----------------------------------------------------------------------------
	//- Set System Vars
	//----------------------------------------------------------------------------

	sysFactory.DisplayDefaultScreen			= sysVarDisplayDefaultScreen;

	sysFactory.SysDebugLevel				= sysVarDebugLevel;
	sysFactory.SysSessionID					= 'SYS_SESSION';
	sysFactory.SysSessionValue				= UserSession;
	sysFactory.MsgServerGetURL				= '/python/getMessages.py';
	sysFactory.MsgServerDelURL				= '/python/delMessages.py';
	sysFactory.AddEncryptedMsgURL			= '/python/addEncryptedMessage.py';

	sysFactory.ParentWindowURL				= sysVarParentWindowURL;


	//----------------------------------------------------------------------------
	//- Style Defaults
	//----------------------------------------------------------------------------

	sysFactory.DefaultStyleScreen			= 'sysScreenRoot col-lg-10 col-md-12';
	sysFactory.DefaultStyleMenu				= 'col-lg-2 col-md-12';
	sysFactory.DefaultStyleScreenOverlay	= 'sysScreenOverlay col-lg-10 col-md-12';
	sysFactory.DefaultStyleListNavLeft		= 'col-6 pl-0';
	sysFactory.DefaultStyleListNavRight		= 'col-6 text-right pr-0';


	//----------------------------------------------------------------------------
	//- Display Language
	//----------------------------------------------------------------------------

	sysFactory.EnvUserLanguage	= sysVarDisplayLanguage;


	//----------------------------------------------------------------------------
	//- User Functions
	//----------------------------------------------------------------------------

	sysFactory.UserFunctions = sysVarUserFunctions;


	//----------------------------------------------------------------------------
	//- Validation Object
	//----------------------------------------------------------------------------

	sysFactory.ObjValidate = new sysFormFieldValidate();


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
