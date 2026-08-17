//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
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

    this.DOMType                = 'button'          //- DOM Type
    this.DOMAttributes          = new Object();     //- DOM Attributes

    this.overrideDOMObjectID    = true;             //- Override recursive ObjectID
    this.ObjectID               = this.ID;          //- Set unique ID

    this.EventListeners         = new Object();     //- Event Listerners Object
    this.ChildObjects           = new Array();      //- Child Objects Array
}

//- inherit sysBaseObject
sysObjButtonCallback.prototype = new sysBaseObject();

//- inherit Button methods
sysObjButtonCallback.prototype.init = sysObjButton.prototype.init;
sysObjButtonCallback.prototype.addEventListenerClick = sysObjButton.prototype.addEventListenerClick;


//------------------------------------------------------------------------------
//- METHOD "setCallback"
//------------------------------------------------------------------------------

sysObjButtonCallback.prototype.setCallback = function(CBObject, CBFunction, CBArgs) {
    this.CallbackObject = CBObject;
    this.CallbackFunction = CBFunction;
    this.CallbackArguments = CBArgs;
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysObjButtonCallback.prototype.EventListenerClick = function(Event) {
    this.CallbackObject.processCallback(this.CallbackFunction, this.CallbackArguments);
}
