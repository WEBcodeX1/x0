//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
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

    this.ItemConfig        = null;                  //- OldStyle Config Behaviour
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
    //console.log('##### CONTEXT MENU EVENT LISTENER CLICK CLOSE #####');
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
    var ContextMenuRootElementID = this.ID;
    var ContextMenuRootObj = this.ScreenObject.HierarchyRootObject.getObjectByID(ContextMenuRootElementID);

    if (ContextMenuRootObj !== undefined) {
        ContextMenuRootObj.removeParent();
    }
}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysContextMenu.prototype.init = function()
{
    //------------------------------------------------------------------------------
    //- remove root object from DOM
    //------------------------------------------------------------------------------

    this.removeRootElement();

    //------------------------------------------------------------------------------
    //- set root object ObjectID
    //------------------------------------------------------------------------------

    this.ObjectID = this.ID;

    //------------------------------------------------------------------------------
    //- setup context menu header
    //------------------------------------------------------------------------------

    //console.debug('###### SET CONTEXT MENU ###### x:' + this.pageX + ' y:' + this.pageY);

    this.setupHeader();

    //------------------------------------------------------------------------------
    //- add items, process
    //------------------------------------------------------------------------------

    this.addItems();
    this.processItems();

    //------------------------------------------------------------------------------
    //- add context menu root object to screen root object
    //------------------------------------------------------------------------------
    this.addObject(this.ContainerObj);
    this.ScreenObject.HierarchyRootObject.addObject(this);

    //------------------------------------------------------------------------------
    //- render, process event listener
    //------------------------------------------------------------------------------

    this.renderObject();
    this.processEventListener();
    this.setDOMElementStyleAttributes();
}


//------------------------------------------------------------------------------
//- METHOD "addItems"
//------------------------------------------------------------------------------

sysContextMenu.prototype.addItems = function()
{
    var ItemConfig = this.ItemConfig;

    for (ProcessItem of ItemConfig) {

        var ContextMenuItem = new sysContextMenuItem();

        ContextMenuItem.ID = ProcessItem.ID;

        ContextMenuItem.TextID = ProcessItem.TextID;
        ContextMenuItem.IconStyle = ProcessItem.IconStyle;

        ContextMenuItem.DstScreenID = ProcessItem.DstScreenID;
        ContextMenuItem.DstObjectID = ProcessItem.DstObjectID;
        ContextMenuItem.DstObjectIDs = ProcessItem.DstObjectIDs;
        ContextMenuItem.DstScreenSrcObjFilter = ProcessItem.DstScreenSrcObjFilter;

        ContextMenuItem.ScreenOverlayID  = ProcessItem.ScreenOverlayID;
        ContextMenuItem.ScreenOverlaySetDataObjects = ProcessItem.ScreenOverlaySetDataObjects;

        ContextMenuItem.ServiceURL = ProcessItem.ServiceURL;
        ContextMenuItem.ServiceID = ProcessItem.ServiceID;
        ContextMenuItem.ServiceKeyColumn = ProcessItem.ServiceKeyColumn;
        ContextMenuItem.Notify = ProcessItem.Notify;

        ContextMenuItem.UpdateSrcObject = ProcessItem.UpdateSrcObject;

        ContextMenuItem.FireEvents = ProcessItem.FireEvents;

        ContextMenuItem.InternalFunction = ProcessItem.InternalFunction;
        ContextMenuItem.RowColumn = ProcessItem.RowColumn;
        ContextMenuItem.DstObjectID = ProcessItem.DstObjectID;
        ContextMenuItem.InternalRemoveItemBy = ProcessItem.InternalRemoveItemBy;
        ContextMenuItem.ColumnDependend = ProcessItem.ColumnDependend;

        ContextMenuItem.ResetAll = ProcessItem.ResetAll;

        ContextMenuItem.ScreenObject = this.ScreenObject;
        ContextMenuItem.ParentObject = this.ParentObject;

        ContextMenuItem.ContextMenuObject = this;

        this.Items.push(ContextMenuItem);
    }
}


//------------------------------------------------------------------------------
//- METHOD "processItems"
//------------------------------------------------------------------------------

sysContextMenu.prototype.processItems = function()
{
    var i=1;
    for (ItemObj of this.Items)
    {
        var ItemDisplayObj = new sysObjSQLText();
        ItemDisplayObj.overrideDOMObjectID = true;
        ItemDisplayObj.ObjectID = this.ID + 'ItemDisplay' + i;
        ItemDisplayObj.DOMType = 'li';
        ItemDisplayObj.TextID = ItemObj.TextID;

        ItemDisplayObj.JSONConfig = {
            "Attributes": {
                "Style": 'list-group-item',
                "IconStyle": ItemObj.IconStyle
            }
        };

        ItemDisplayObj.init();

        // reference for hiliting
        ItemObj.DisplayObj = ItemDisplayObj;

        //- add click event listener
        var EventListenerObj = new Object();
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
        i+=1;
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
    this.ContainerObj.DOMStyle = 'sysContextMenuTable list-group';
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
    this.PostRequestData    = new sysRequestDataHandler();

    this.ID                 = null;                 //- Internal ID
    this.TextID             = null;                 //- Display Text ID
    this.IconStyle          = null;                 //- Display Icon Style

    this.DstScreenID        = null;                 //- Service Destination Screen ID

    this.ServiceURL         = null;                 //- Service Call URL
    this.ServiceID          = null;                 //- Service ID
    this.Notify             = null;                 //- Notify (true | false)

    this.UpdateSrcObject    = false;                //- Update Source Object

    this.ScreenObject       = null;                 //- Screen Object Reference
    this.ParentObject       = null;                 //- Parent Object Reference

    this.ContextMenuObject  = null;                 //- Context Menu Reference

    this.FireEvents         = null;                 //- Reactor Event Array

    this.InternalFunction   = null;                 //- Internal System Functionality

    this.HiLiteStyle        = 'bg-body-secondary';  //- Hilite CSS
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysContextMenuItem.prototype.EventListenerClick = function(Event)
{
    //console.log('##### CONTEXT MENU EVENT LISTENER CLICK #####');

    this.PostRequestData.reset();

    if (this.InternalFunction != null) {

        console.log('Function:%s', this.InternalFunction);
        const RowData = this.ContextMenuObject.RowData;

        if (this.InternalFunction == 'get-data') {
            sysFactory.ClipboardData = this.ParentObject.RuntimeGetDataFunc();
            this.ContextMenuObject.close();
        }

        else if (this.InternalFunction == 'set-data') {
            this.ParentObject.RuntimeSetDataFunc(sysFactory.ClipboardData);
            this.ContextMenuObject.close();
        }

        else if (this.InternalFunction == 'remove') {
            this.ParentObject.remove();
            this.ContextMenuObject.close();
        }

        else if (this.InternalFunction == 'remove-selected') {
            this.ParentObject.ParentObject.removeSelectedRows();
            this.ContextMenuObject.close();
        }

        else if (this.InternalFunction == 'reset') {
            this.ParentObject.reset();
            this.ContextMenuObject.close();
        }

        else if (this.InternalFunction == 'copy') {
            const DstObject = sysFactory.getObjectByID(this.DstObjectID);
            //console.log('::ContextMenu copy ListObject:%o RowData:%o', ListObj, RowData);
            DstObject.RuntimeAppendDataFunc(RowData);
        }

        else if (this.InternalFunction == 'setrowcolumn') {
            try {
                //console.log('setrowcolumn RowData:%o', RowData);
                const DstObject = sysFactory.getObjectByID(this.DstObjectID);
                DstObject.setValue(RowData[this.RowColumn]);
                //console.log('setrowcolumn ConnectorObject:%o', DstObject);
            }
            catch(err) {
                console.log('::EventListenerClick setrowcolumn err:%s', err);
            }
        }

        else if (this.InternalFunction == 'openOverlay') {

            sysFactory.OverlayObj.setupOverlay(
                this.ScreenOverlayID,
                {
                    "SourceData": RowData,
                    "DstObjects": this.ScreenOverlaySetDataObjects
                }
            );

            this.ContextMenuObject.close();
        }

        try {
            sysFactory.UserContextMenu.process(this);
        }
        catch(err) {
            console.log('::ContextMenu process UserContextMenu error:%s', err);
        }

    }

    if (this.ServiceURL != null) {

        sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(this.Notify);

        var Item = new Object();
        //Item['DBPrimaryKeyValue'] = this.DBPrimaryKeyValue;

        if (this.ServiceKeyColumn !== undefined) {
            Item[this.ServiceKeyColumn] =  this.ContextMenuObject.RowData[this.ServiceKeyColumn];
        }

        this.PostRequestData.merge(Item);

        if (this.ServiceID != null) {
            this.PostRequestData.addServiceProperty('BackendServiceID', this.ServiceID);
        }

        this.callService();

    }

    if (this.DstScreenID !== undefined && this.DstScreenID != null) {

        const ScreenObj = sysFactory.getScreenByID(this.DstScreenID);

        console.debug('contextMenu this:%o', this);

        if (this.RowColumn !== undefined && ScreenObj !== undefined) {

            console.debug('contextMenu RowObject:%o', this.ContextMenuObject.RowObject);
            
            const setValue = this.ContextMenuObject.RowObject.RowData[this.RowColumn];

            console.debug('contextMenu setValue:%s', setValue);

            ScreenObj.setGlobalVar(this.RowColumn, setValue);
        }

        this.ContextMenuObject.close();

        if (this.ResetAll === true) {
            ScreenObj.HierarchyRootObject.processReset();
        }

        //- switch screen
        sysFactory.switchScreen(this.DstScreenID);

    }

    //- fire events
    sysFactory.Reactor.fireEvents(this.FireEvents);

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


//------------------------------------------------------------------------------
//- METHOD "callService"
//------------------------------------------------------------------------------

sysContextMenuItem.prototype.callService = function()
{
    if (this.ServiceURL != null && this.ServiceURL !== undefined) {
        RPC = new sysCallXMLRPC(this.ServiceURL);
        RPC.Request(this);
    }
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysContextMenuItem.prototype.callbackXMLRPCAsync = function()
{
    //console.log(this.XMLRPCResultData.error);

    var MsgHandler = sysFactory.sysGlobalAsyncNotifyHandler;
    var XMLRPCStatus = this.XMLRPCResultData.error;
    var NotifyStatus = 'ERROR';

    if (XMLRPCStatus === undefined) {
        NotifyStatus = 'SUCCESS';
    }

    if (this.Notify.ID !== undefined) {
        const IndicatorID = this.Notify.ID;
        const Message = 'SYS__'+IndicatorID+'__'+NotifyStatus;
        MsgHandler.processMsg(Message);
    }

    this.ContextMenuObject.close();
}
