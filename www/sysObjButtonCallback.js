//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2021                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ButtonCallback"                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjButtonCallback"
//------------------------------------------------------------------------------

function sysObjButtonCallback() {
    this.EventListeners		= new Object();
	this.ChildObjects		= new Array();
}

//- inherit sysBaseObject
sysObjButtonCallback.prototype = new sysBaseObject();

//- inherit Button methods
sysObjButtonCallback.prototype.init = sysObjButton.prototype.init;
sysObjButtonCallback.prototype.addEventListenerClick = sysObjButton.prototype.addEventListenerClick;


//------------------------------------------------------------------------------
//- METHOD "setCallback"
//------------------------------------------------------------------------------

sysObjButtonCallback.prototype.setCallback = function(CallbackObject, CallbackFunction) {
	this.CallbackObject = CallbackObject;
	this.CallbackFunction = CallbackFunction;
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysObjButtonCallback.prototype.EventListenerClick = function(Event) {
	this.CallbackObject.processCallback(this.CallbackFunction);
}
