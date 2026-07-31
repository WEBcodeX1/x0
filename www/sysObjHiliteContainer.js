//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "HiliteContainer"                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Wraps one (singular) or multiple hierarchical (plural) child objects.    -//
//- A visible border is drawn on mouse-over; a right-click context menu      -//
//- provides actions (edit, move hierarchy, etc.) on the contained objects.  -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjHiliteContainer"
//------------------------------------------------------------------------------

function sysObjHiliteContainer()
{
    this.ChildObjects       = new Array();      //- Child Objects
    this.EventListeners     = new Object();     //- Event Listeners

    this.HiliteActive       = false;            //- Hover-hilite Active State
    this.ContextMenuOpen    = false;            //- Context Menu Open State

    this.Mode               = 'singular';       //- 'singular' or 'plural'
    this.ContextMenuItems   = undefined;        //- Context Menu Item Config

    this.RuntimeGetDataFunc = this.getData;     //- Get Runtime Data
    this.RuntimeSetDataFunc = this.setData;     //- Set Runtime Data
}

//- inherit sysBaseObject
sysObjHiliteContainer.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjHiliteContainer.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    //- build outer css style
    this.DOMStyle = 'sysHiliteContainerRoot';
    if (Attributes.Style !== undefined) {
        this.DOMStyle += ' ' + Attributes.Style;
    }

    //- store mode ('singular' or 'plural')
    if (Attributes.Mode !== undefined) {
        this.Mode = Attributes.Mode;
    }

    //- store context menu item config
    this.ContextMenuItems = Attributes.ContextMenuItems;

    //- mouseenter: draw border when pointer enters the container
    var EventMouseEnter = new Object();
    EventMouseEnter['Type']    = 'mouseenter';
    EventMouseEnter['Element'] = this.EventListenerMouseEnter.bind(this);
    this.EventListeners['HiliteEnter'] = EventMouseEnter;

    //- mouseleave: remove border when pointer leaves (unless context menu open)
    var EventMouseLeave = new Object();
    EventMouseLeave['Type']    = 'mouseleave';
    EventMouseLeave['Element'] = this.EventListenerMouseLeave.bind(this);
    this.EventListeners['HiliteLeave'] = EventMouseLeave;

    //- mousedown: open right-click context menu on button 2
    var EventMouseDown = new Object();
    EventMouseDown['Type']    = 'mousedown';
    EventMouseDown['Element'] = this.EventListenerMouseDown.bind(this);
    this.EventListeners['ContextMenuOpen'] = EventMouseDown;

    //- optional label at the top of the container
    if (Attributes.TextID !== undefined) {
        var LabelObj      = new sysBaseObject();
        LabelObj.ObjectID = 'hilite-label';
        LabelObj.DOMStyle = 'sysHiliteContainerLabel';
        LabelObj.DOMValue = sysFactory.getText(Attributes.TextID);
        this.addObject(LabelObj);
    }
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerMouseEnter"
//------------------------------------------------------------------------------

sysObjHiliteContainer.prototype.EventListenerMouseEnter = function(Event)
{
    this.HiliteActive = true;
    this.addDOMElementStyle('sysHiliteContainerBorder');
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerMouseLeave"
//------------------------------------------------------------------------------

sysObjHiliteContainer.prototype.EventListenerMouseLeave = function(Event)
{
    this.HiliteActive = false;
    if (this.ContextMenuOpen === false) {
        this.removeDOMElementStyle('sysHiliteContainerBorder');
    }
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerMouseDown"
//------------------------------------------------------------------------------

sysObjHiliteContainer.prototype.EventListenerMouseDown = function(Event)
{
    if (Event.button == 2 && this.ContextMenuItems !== undefined) {

        this.ContextMenuOpen = true;

        var ContextMenu = new sysContextMenu();

        ContextMenu.ID           = 'CtMenu_' + this.ObjectID;
        ContextMenu.ItemConfig   = this.ContextMenuItems;
        ContextMenu.ScreenObject = this.ScreenObject;
        ContextMenu.ParentObject = this;
        ContextMenu.pageX        = Event.pageX;
        ContextMenu.pageY        = Event.pageY;

        ContextMenu.RowData      = null;
        ContextMenu.RowObject    = this;

        //- override close() to reset ContextMenuOpen and border state
        const Self = this;
        const OrigClose = ContextMenu.close.bind(ContextMenu);
        ContextMenu.close = function() {
            OrigClose();
            Self.ContextMenuOpen = false;
            if (Self.HiliteActive === false) {
                Self.removeDOMElementStyle('sysHiliteContainerBorder');
            }
        };

        ContextMenu.init();
    }
}


//------------------------------------------------------------------------------
//- METHOD "getData"
//------------------------------------------------------------------------------

sysObjHiliteContainer.prototype.getData = function()
{
    return null;
}


//------------------------------------------------------------------------------
//- METHOD "setData"
//------------------------------------------------------------------------------

sysObjHiliteContainer.prototype.setData = function(Data)
{
}
