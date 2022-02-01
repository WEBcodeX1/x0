//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2022                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ScreenOverlay"                                            -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysScreenOverlay"
//------------------------------------------------------------------------------

function sysScreenOverlay(FactoryRef) {
	this.FactoryRef = FactoryRef;
}


//------------------------------------------------------------------------------
//- METHOD "setupOverlay"
//------------------------------------------------------------------------------

sysScreenOverlay.prototype.setupOverlay = function(ScreenID)
{
	OverlayScreen = new sysScreen(true);

	const SkeletonData = this.FactoryRef.DataSkeleton.XMLRPCResultData[ScreenID];

	const DefaultStyle = sysFactory.DefaultStyleScreenOverlay;
	const OverlayStyle = (DefaultStyle !== undefined) ? DefaultStyle : 'sysScreenOverlay col-lg-10 col-md-12';

	OverlayScreen.setStyle(OverlayStyle);

	//console.debug('ScreenID:%s SkeletonData:%o', ScreenID, SkeletonData);

	OverlayScreen.ScreenID = ScreenID;
	OverlayScreen.SkeletonData = SkeletonData;

	CloseObject = new sysObjDiv();
	CloseObject.ObjectID = 'close';
	CloseObject.EventListeners = new Object();

	var EventConfig = new Object();
	EventConfig['Type'] = 'mousedown';
	EventConfig['Element'] = this.EventListenerClick.bind(this);
	CloseObject.EventListeners["closeOverlay"] = EventConfig;

	OverlayScreen.HierarchyRootObject.addObject(CloseObject);

	OverlayScreen.setup();

	OverlayScreen.HierarchyRootObject.processUpdate();

	CloseObject.processEventListener();
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysScreenOverlay.prototype.EventListenerClick = function()
{
	console.debug('click');
}
