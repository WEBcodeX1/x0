//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ContextMenu"                                              -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Renders Context Menu                                                     -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysContextMenu"
//------------------------------------------------------------------------------

function sysContextMenu()
{
    this.ID                = null;                  //- Internal ID

    this.ItemConfig        = null;                  //- Context Menu Item Config
    this.Items             = new Array();           //- Content Menu Items Array

    this.pageX             = 0;                     //- Screen Coordinates X
    this.pageY             = 0;                     //- Screen Coordinates Y
    this.DOMStyleZIndex    = 1000;                  //- Screen z-index

    this.ScreenObject      = null;                  //- Reset "bound" Screen Object
    this.ParentObject      = null;                  //- Reset Parent Object

    this.ChildObjects      = new Array();           //- Child Objects
}

//- inherit sysBaseDOMElement
sysContextMenu.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "EventListenerClickClose"
//------------------------------------------------------------------------------

sysContextMenu.prototype.EventListenerClickClose = function(Event)
{
    this.close();
}


//------------------------------------------------------------------------------
//- METHOD "close"
//------------------------------------------------------------------------------

sysContextMenu.prototype.close = function(Event)
{
    this.removeRootElement();
    delete this;
}


//------------------------------------------------------------------------------
//- METHOD "removeRootElement"
//------------------------------------------------------------------------------

sysContextMenu.prototype.removeRootElement = function(Event)
{
    let ContextMenuRootElementID = this.ID;
    let ContextMenuRootObj = this.ScreenObject.HierarchyRootObject.getObjectByID(ContextMenuRootElementID);

    if (ContextMenuRootObj !== undefined) {
        ContextMenuRootObj.removeParent();
    }
}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysContextMenu.prototype.init = function()
{
    //- remove root object from DOM
    this.removeRootElement();

    //- set root object ObjectID
    this.ObjectID = this.ID;

    //- setup context menu header
    this.setupHeader();

    //- add items, process
    this.addItems();
    this.processItems();

    //- add context menu root object to screen root object
    this.addObject(this.ContainerObj);
    this.ScreenObject.HierarchyRootObject.addObject(this);

    //- render, process event listener
    this.renderObject();
    this.processEventListener();
    this.setDOMElementStyleAttributes();
}


//------------------------------------------------------------------------------
//- METHOD "addItems"
//------------------------------------------------------------------------------

sysContextMenu.prototype.addItems = function()
{
    let ItemConfigArray = this.ItemConfig;

    for (ItemConfig of ItemConfigArray)
    {
        let ContextMenuItem                 = new sysContextMenuItem();
        ContextMenuItem.ItemConfig          = ItemConfig;
        ContextMenuItem.ParentObject        = this.ParentObject;
        ContextMenuItem.ContextMenuObject   = this;

        console.debug('::CtxMenu addItems() Item:%o', ContextMenuItem);

        this.Items.push(ContextMenuItem);
    }
}


//------------------------------------------------------------------------------
//- METHOD "processItems"
//------------------------------------------------------------------------------

sysContextMenu.prototype.processItems = function()
{
    let i = 1;
    for (const ItemObj of this.Items)
    {
        console.debug('::CtxMenu processItems() Item:%o', ItemObj);

        let ItemDisplayObj = new sysObjSQLText();
        ItemDisplayObj.overrideDOMObjectID = true;
        ItemDisplayObj.ObjectID = this.ID + 'ItemDisplay' + i;
        ItemDisplayObj.DOMType = 'li';
        ItemDisplayObj.TextID = ItemObj.ItemConfig.TextID;

        ItemDisplayObj.JSONConfig = {
            "Attributes": {
                "Style": 'list-group-item',
                "IconStyle": ItemObj.ItemConfig.IconStyle
            }
        };

        ItemDisplayObj.init();

        // reference for hiliting
        ItemObj.DisplayObj = ItemDisplayObj;

        //- add click event listener
        let EventListenerObj = new Object();
        EventListenerObj['Type'] = 'click';
        EventListenerObj['Element'] = ItemObj.EventListenerClick.bind(ItemObj);

        ItemDisplayObj.EventListeners["CMenuItemClick"] = EventListenerObj;

        //- mouseover / mouseout event handler
        let EventMouseOver = new Object();
        EventMouseOver['Type'] = 'mouseover';
        EventMouseOver['Element'] = ItemObj.setHilite.bind(ItemObj);
        ItemDisplayObj.EventListeners["MouseOver"] = EventMouseOver;

        let EventMouseOut = new Object();
        EventMouseOut['Type'] = 'mouseout';
        EventMouseOut['Element'] = ItemObj.removeHilite.bind(ItemObj);
        ItemDisplayObj.EventListeners["MouseOut"] = EventMouseOut;

        this.ContainerObj.addObject(ItemDisplayObj);
        ++i;
    }
}


//------------------------------------------------------------------------------
//- METHOD "setupHeader"
//------------------------------------------------------------------------------

sysContextMenu.prototype.setupHeader = function()
{
    this.ContainerObj = new sysBaseObject();
    this.ContainerObj.overrideDOMObjectID = true;
    this.ContainerObj.ObjectID = this.ID + 'CMHeaderContainer';
    this.ContainerObj.DOMStyle = 'context-menu list-group';
    this.ContainerObj.DOMType = 'ul';
    this.ContainerObj.DOMStyleTop = this.pageY.toString() + 'px';
    this.ContainerObj.DOMStyleLeft = this.pageX.toString() + 'px';

    this.HeaderItemObj = new sysObjSQLText();
    this.HeaderItemObj.overrideDOMObjectID = true;
    this.HeaderItemObj.ObjectID = this.ID + 'CMHeader';
    this.HeaderItemObj.DOMType = 'li';
    this.HeaderItemObj.TextID = 'TXT.SYS.CONTEXTMENU.DISPLAY';

    this.HeaderItemObj.JSONConfig = {
        "Attributes": {
            "Style": 'list-group-item active',
            "IconStyle": 'fa-solid fa-rectangle-xmark'
        }
    };

    this.HeaderItemObj.init();

    //- add close event listener
    var EventListenerObj = Object();
    EventListenerObj['Type'] = 'click';
    EventListenerObj['Element'] = this.EventListenerClickClose.bind(this);

    this.HeaderItemObj.EventListeners["ContextMenuClose"] = EventListenerObj;

    this.ContainerObj.addObject(this.HeaderItemObj);
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysContextMenuItem"
//------------------------------------------------------------------------------

function sysContextMenuItem()
{
    this.ParentObject       = null;                 //- Parent Object Reference
    this.ContextMenuObject  = null;                 //- Context Menu Reference

    this.HiLiteStyle        = 'bg-body-secondary';  //- Hilite CSS
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysContextMenuItem.prototype.EventListenerClick = function(Event)
{
    //- dispatch function
    const FunctionID = this.ItemConfig.InternalFunction;
    if (FunctionID !== undefined && FunctionID != null)
    {
        console.debug('FunctionID:%s ItemConfig:%o ClipboardData:%o', FunctionID, this.ItemConfig, sysFactory.ClipboardData);
        FunctionDispatcher.dispatchFunction(
            FunctionID, this.ParentObject, this.ItemConfig
        )
    }

    //- open overlay
    const OverlayScreenID = this.ItemConfig.OverlayScreenID;
    if (OverlayScreenID !== undefined) {
        sysFactory.OverlayObj.activateOverlay(OverlayScreenID);
        this.ContextMenuObject.close();
    }

    //- fire events
    const FireEvents = this.ItemConfig.FireEvents;
    if (FireEvents !== undefined) {
        sysFactory.Reactor.fireEvents(FireEvents);
    }

    //- close context menu
    this.ContextMenuObject.close();
}


//------------------------------------------------------------------------------
//- METHOD "setHilite"
//------------------------------------------------------------------------------

sysContextMenuItem.prototype.setHilite = function()
{
    this.DisplayObj.addDOMElementStyle(this.HiLiteStyle);
}


//------------------------------------------------------------------------------
//- METHOD "removeHilite"
//------------------------------------------------------------------------------

sysContextMenuItem.prototype.removeHilite = function()
{
    this.DisplayObj.removeDOMElementStyle(this.HiLiteStyle);
}
