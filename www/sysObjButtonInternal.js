//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ButtonInternal"                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjButtonInternal"
//------------------------------------------------------------------------------

function sysObjButtonInternal()
{
    this.DOMType             = 'button'
    this.DOMAttributes       = new Object();

    this.EventListeners      = new Object();
    this.ChildObjects        = new Array();
    this.PostRequestData     = new sysRequestDataHandler();

    this.ValidateResultError = true;
}

sysObjButtonInternal.prototype = new sysBaseObject();

sysObjButtonInternal.prototype.init = sysObjButton.prototype.init;
sysObjButtonInternal.prototype.validateForm = sysObjButton.prototype.validateForm;
sysObjButtonInternal.prototype.processActions = sysObjButton.prototype.processActions;

sysObjButtonInternal.prototype.setDstScreenProperties = sysContextMenuItem.prototype.setDstScreenProperties;


//------------------------------------------------------------------------------
//- METHOD "addEventListenerClick"
//------------------------------------------------------------------------------

sysObjButtonInternal.prototype.addEventListenerClick = function()
{
    var EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown';
    EventListenerObj['Element'] = this.EventListenerClick.bind(this);

    this.EventListeners["ButtonClick"] = EventListenerObj;
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysObjButtonInternal.prototype.EventListenerClick = function(Event)
{
    console.debug('ButtonInternal click');

    this.ValidateResultError = true;

    const Attributes = this.JSONConfig.Attributes;

    this.validateForm();

    console.debug('ButtonInternal ValidateResult:%s', this.ValidateResultError);

    if (this.ValidateResultError == false) {
        this.processActions();
        sysFactory.Reactor.fireEvents(Attributes.FireEvents);
    }
}
