//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Link"                                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjLink"
//------------------------------------------------------------------------------

function sysObjLink()
{
    this.EventListeners         = new Object();   //- Event Listeners
    this.ChildObjects           = Array();        //- Child Objects

    this.ScreenID               = null;           //- ScreenID
    this.TextID                 = null;           //- TextID
    this.FireEvents             = null;           //- Dispatch Events
    this.OverlayID              = null;           //- Open OverlayID
    this.OverlayAttributes      = null;           //- Overlay Open Attributes

    this.DOMType                = 'button'        //- Set DOM Element Type

    this.LinkHilteStyle         = null;
}

sysObjLink.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjLink.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    console.debug('set Link Attributes:%o', Attributes);

    this.DOMStyle = Attributes.Style;
    this.LinkHilteStyle = Attributes.HiliteStyle;

    this.ScreenID = Attributes.ScreenID;
    this.ScreenStyle = Attributes.ScreenStyle;
    this.TextID    = Attributes.TextID;
    this.FireEvents    = Attributes.FireEvents;
    this.OverlayID= Attributes.OverlayID;
    this.OverlayAttributes = Attributes.OverlayAttributes;

    this.SQLTextObj = new sysObjSQLText();
    this.SQLTextObj.ObjectID = 'SQLText';
    this.SQLTextObj.TextID = this.TextID;
    this.SQLTextObj.init();
    this.addObject(this.SQLTextObj);

    var EventConfig = new Object();
    EventConfig['Type'] = 'mousedown';
    EventConfig['Element'] = this.EventListener.bind(this);
    this.EventListeners['sysLink'] = EventConfig;
}


//------------------------------------------------------------------------------
//- METHOD "EventListener"
//------------------------------------------------------------------------------

sysObjLink.prototype.EventListener = function(Event)
{
    //console.debug('Link EventListener ScreenID:%s OverlayID:%s', this.ScreenID, this.OverlayID);

    if (this.ScreenStyle !== undefined) {
        sysFactory.getScreenByID(this.ScreenID).updateStyle(this.ScreenStyle);
    }

    if (this.ScreenID !== undefined) {
        sysFactory.switchScreen(this.ScreenID);
    }

    if (this.OverlayID !== undefined) {
        sysFactory.OverlayObj.setupOverlay(this.OverlayID, this.OverlayAttributes);
    }

    if (this.FireEvents !== undefined) {
        sysFactory.Reactor.fireEvents(this.FireEvents);
    }
}


//------------------------------------------------------------------------------
//- METHOD "Hilite"
//------------------------------------------------------------------------------

sysObjLink.prototype.Hilite = function(Event)
{
    //console.debug('::Hilite Style:%s', this.LinkHilteStyle);
    this.addDOMElementStyle(this.LinkHilteStyle);
}


//------------------------------------------------------------------------------
//- METHOD "DeHilite"
//------------------------------------------------------------------------------

sysObjLink.prototype.DeHilite = function(Event)
{
    //console.debug('::DeHilite Style:%s', this.LinkHilteStyle);
    this.removeDOMElementStyle(this.LinkHilteStyle);
}
