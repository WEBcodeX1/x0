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
	sysFactory.DisplayDefaultScreen = 'Screen1';

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

	sysFactory.ObjText.requestXMLRPCData('python/getText.py');
	sysFactory.DataMenu.requestXMLRPCData('static/menu.json');
	sysFactory.DataObject.requestXMLRPCData('static/object.json');
	sysFactory.DataSkeleton.requestXMLRPCData('static/skeleton.json');


	//----------------------------------------------------------------------------
	//- Set System Vars
	//----------------------------------------------------------------------------

	var paramString						= new URLSearchParams(document.URL);

	sysFactory.SysDebugLevel			= 10;
	sysFactory.SysSessionID				= 'SYS_SESSION';
	sysFactory.SysSessionValue			= '';
	sysFactory.MsgServerGetURL			= '/python/getMessages.py';
	sysFactory.MsgServerDelURL			= '/python/delMessages.py';
	sysFactory.AddEncryptedMsgURL		= '/python/addEncryptedMessage.py';

	sysFactory.DefaultStyleScreen		= 'sysScreenRoot col-lg-10 col-md-12';
	sysFactory.DefaultStyleListNavLeft	= 'col-6 pl-0';
	sysFactory.DefaultStyleListNavRight	= 'col-6 text-right pr-0';

	sysFactory.ParentWindowURL			= null;

	console.debug('::Init SessionID:%s', sysFactory.SysSessionValue);

	//----------------------------------------------------------------------------
	//- User Functions
	//----------------------------------------------------------------------------

	sysFactory.UserFunctions = {
	};

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

	sysFactory.TooltipHandler = new sysTooltipHandler();
	sysFactory.TooltipHandler.initLayer();


	//----------------------------------------------------------------------------
	//- Start Async Notify Message Handler
	//----------------------------------------------------------------------------

	sysFactory.sysGlobalAsyncNotifyHandler = new sysAsyncNotifyMsgHandler();

}
