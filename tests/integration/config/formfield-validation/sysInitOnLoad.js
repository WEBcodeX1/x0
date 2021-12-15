//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2020                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Init On Load (+Configuration)                                            -//
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

	//----------------------------------------------------------------------------
	//- Construct Global Object Factory (Main Object Handler)
	//----------------------------------------------------------------------------

	sysFactory = new sysFactory();
	sysFactory.DisplayDefaultScreen = 'Test1';

	sysFactory.DBPrimaryKeyContainer = new Object();

	sysObjLoader = new sysObjectLoader(sysFactory);

	sysFactory.ObjText = new sysText();
	sysFactory.ObjMenu = new sysMenu();
	sysFactory.ObjGlobalData = new sysGlobalData();
	sysFactory.DataObject = new sysJSONData();
	sysFactory.DataSkeleton = new sysJSONData();

	sysObjLoader.add(sysFactory.ObjText);
	sysObjLoader.add(sysFactory.ObjMenu);
	//sysObjLoader.add(sysFactory.ObjGlobalData);
	sysObjLoader.add(sysFactory.DataObject);
	sysObjLoader.add(sysFactory.DataSkeleton);

	sysFactory.ObjText.setLoaderObj(sysObjLoader);
	sysFactory.ObjMenu.setLoaderObj(sysObjLoader);
	//sysFactory.ObjGlobalData.setLoaderObj(sysObjLoader);
	sysFactory.DataObject.setLoaderObj(sysObjLoader);
	sysFactory.DataSkeleton.setLoaderObj(sysObjLoader);

	sysFactory.ObjText.requestXMLRPCData('/python/getText.py');
	sysFactory.ObjMenu.requestXMLRPCData('static/menu.json');
	//sysFactory.ObjGlobalData.requestXMLRPCData('../python/GlobalData.py');
	sysFactory.DataObject.requestXMLRPCData('static/object.json');
	sysFactory.DataSkeleton.requestXMLRPCData('static/skeleton.json');


	//----------------------------------------------------------------------------
	//- Set System Vars
	//----------------------------------------------------------------------------

	var paramString						= new URLSearchParams(document.URL);

	sysFactory.SysDebugLevel			= 10;
	sysFactory.SysSessionID				= 'WCDX_SYS_SESSION';
	sysFactory.SysSessionValue			= paramString.get("user_session");
	//sysFactory.MsgServerURL				= '../python/MsgHandler.py';
	sysFactory.MsgServerURL				= '/python/MsgHandler.py';

	sysFactory.AdminInterface			= true;
	sysFactory.HideLayerForceActivated	= false;

	console.log('::Init SessionID:%s', sysFactory.SysSessionValue);


	//----------------------------------------------------------------------------
	//- Set Environment Vars
	//----------------------------------------------------------------------------

	sysFactory.EnvUserLanguage	= 'de';


	//----------------------------------------------------------------------------
	//- Set Global Validate Regex Object
	//----------------------------------------------------------------------------

	sysFactory.ObjFormValidate = new sysFormFieldValidate();


	//----------------------------------------------------------------------------
	//- Set Global Reactor Object
	//----------------------------------------------------------------------------

	sysFactory.Reactor = new sysReactor();


	//----------------------------------------------------------------------------
	//- Construct Global Async Notify Indicator
	//----------------------------------------------------------------------------

	sysFactory.GlobalAsyncNotifyIndicator = new sysObjAsyncNotifyIndicator();


	//----------------------------------------------------------------------------
	//- Construct Global Tooltip Layer
	//----------------------------------------------------------------------------

	/*
	sysFactory.TooltipHandler = new sysTooltipHandler();
	sysFactory.TooltipHandler.initLayer();
	*/

	//----------------------------------------------------------------------------
	//- Start Async Notify Message Handler
	//----------------------------------------------------------------------------

	sysFactory.sysGlobalAsyncNotifyHandler = new sysAsyncNotifyMsgHandler();

}
