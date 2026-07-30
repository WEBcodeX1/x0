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
    this.DOMType                = 'button'                      //- DOM Type
    this.DOMAttributes          = new Object();                 //- DOM Attributes

    this.overrideDOMObjectID    = true;                         //- Override recursive ObjectID
    this.ObjectID               = this.ID;                      //- Set unique ID

    this.EventListeners         = new Object();                 //- Event Listerners Object
    this.ChildObjects           = new Array();                  //- Child Objects Array
    this.PostRequestData        = new sysRequestDataHandler();  //- POST Request Data Handler

    this.ValidateResultError    = true;                         //- Validation Result (true || false)
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
