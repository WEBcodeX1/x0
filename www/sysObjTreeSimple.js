//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "TreeSimple"                                               -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjTreeSimple"
//------------------------------------------------------------------------------

function sysObjTreeSimple()
{
    this.ChildObjects       = new Array();      //- Child Objects
    this.LastSelectedItem   = null;             //- Last Selected Objet Reference
}

//- inherit sysBaseObject
sysObjTreeSimple.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjTreeSimple.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;
    console.debug('TreeSimple JSONConfig:%o', Attributes);

    let i=0;
    for (const RootItem of Attributes.TreeItems)
    {
        console.debug('TreeSimple RootItem:%o', RootItem);
        let NodeItem = new sysObjTreeSimpleNode();

        NodeItem.JSONConfig = {
            "Attributes": {
                "ObjectID": i,
                "TextID": RootItem.TextID
            }
        }

        NodeItem.init();
        this.addObject(NodeItem);
        this.addTreeItems(this, NodeItem, RootItem.Children);
        ++i;
    }
}


//------------------------------------------------------------------------------
//- METHOD "addTreeItems"
//------------------------------------------------------------------------------

sysObjTreeSimple.prototype.addTreeItems = function(RootObj, NodeItem, ChildItems)
{
    let i=0;
    for (const ChildItem of ChildItems)
    {
        var TreeItem;

        const ItemObjectID = NodeItem.JSONConfig.Attributes.ObjectID;
        ChildItem['ObjectID'] = ItemObjectID+i;

        if (ChildItem.Type == 'Item') {
            TreeItem = new sysObjTreeSimpleItem(RootObj);
        }

        if (ChildItem.Type == 'Node') {
            TreeItem = new sysObjTreeSimpleNode();
        }

        TreeItem.JSONConfig = {
            "Attributes": ChildItem
        }

        TreeItem.init();
        NodeItem.ItemContainerObj.addObject(TreeItem);

        if (ChildItem.Type == 'Node') {
            this.addTreeItems(RootObj, TreeItem, ChildItem.Children);
        }

        ++i;
    }
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjTreeSimpleNode"
//------------------------------------------------------------------------------

function sysObjTreeSimpleNode()
{
    this.ChildObjects   = new Array();          //- Child Objects
    this.DOMStyle       = 'sysTreeNodeRoot';    //- CSS Style
}

//- inherit sysBaseObject
sysObjTreeSimpleNode.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjTreeSimpleNode.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;
    console.debug('TreeSimpleNode JSONConfig:%o', Attributes);

    this.ObjectID = Attributes.ObjectID;

    const NodeText = sysFactory.getText(Attributes.TextID);
    console.debug('TreeSimpleNode NodeText:%s', NodeText);

    //- define items container object
    this.ItemContainerObj = new sysBaseObject();
    this.ItemContainerObj.ObjectID = 'children-container';
    this.ItemContainerObj.ChildObjects = new Array();

    //- define open/close button
    this.OpenCloseIcon = new sysBaseObject();
    this.OpenCloseIcon.EventListeners = new Object();
    this.OpenCloseIcon.DOMStyle = 'sysTreeOpenClose';
    this.OpenCloseIcon.DOMValue = '<i class="fa-regular fa-square-caret-down"></i>';
    this.OpenCloseIcon.StateOpen = true;
    this.OpenCloseIcon.RootObject = this.ItemContainerObj;

    let EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown';
    EventListenerObj['Element'] = this.toggleVisibleState.bind(this.OpenCloseIcon);
    this.OpenCloseIcon.EventListeners["OpenClose"] = EventListenerObj;

    //- setup recursive object structure
    const ObjDefs =  [
        {
            "id": "selected",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "sysTreeSelected"
            }
        },
        {
            "id": "item-container",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "sysTreeItemContainer"
            },
            "ObjectDefs": [
                {
                    "id": "node-icon",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "sysTreeIcon",
                        "Value": '<i class="fa-solid fa-hexagon-nodes"></i>'
                    }
                },
                {
                    "id": "node-text",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "sysTreeNodeText",
                        "Value": NodeText
                    }
                },
                {
                    "id": "open-close-button",
                    "SysObject": this.OpenCloseIcon
                }
            ]
        }
    ]

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);

    this.addObject(this.ItemContainerObj);
}


//------------------------------------------------------------------------------
//- METHOD "toggleVisibleState"
//------------------------------------------------------------------------------

sysObjTreeSimpleNode.prototype.toggleVisibleState = function()
{
    if (this.StateOpen === true) {
        this.StateOpen = false;
        this.DOMValue = '<i class="fa-regular fa-square-caret-right"></i>';
        this.setDOMElementValue();
        this.RootObject.VisibleState = 'hidden';
        this.RootObject.setDOMVisibleState();
        return;
    }
    else if (this.StateOpen === false) {
        this.StateOpen = true;
        this.DOMValue = '<i class="fa-regular fa-square-caret-down"></i>';
        this.setDOMElementValue();
        this.RootObject.VisibleState = 'visible';
        this.RootObject.setDOMVisibleState();
    }
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjTreeSimpleItem"
//------------------------------------------------------------------------------

function sysObjTreeSimpleItem(TreeRootObj)
{
    this.ChildObjects   = new Array();          //- Child Objects
    this.DOMStyle       = 'sysTreeItemRoot';    //- CSS Style
    this.TreeRootObj    = TreeRootObj;          //- Tree root Reference
}

//- inherit sysBaseObject
sysObjTreeSimpleItem.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjTreeSimpleItem.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;
    console.debug('TreeSimpleItem JSONConfig:%o', Attributes);

    this.ObjectID = Attributes.ObjectID;

    //- selected indicator object
    this.SelectedIndicator = new sysObjDiv();

    //- item container object
    this.ItemContainerObj = new sysObjDiv();
    this.ItemContainerObj.EventListeners = new Array();

    let EventMouseOver = new Object();
    EventMouseOver['Type'] = 'mouseover';
    EventMouseOver['Element'] = this.setHilite.bind(this.ItemContainerObj);
    this.ItemContainerObj.EventListeners["MouseOver"] = EventMouseOver;

    let EventMouseOut = new Object();
    EventMouseOut['Type'] = 'mouseout';
    EventMouseOut['Element'] = this.removeHilite.bind(this.ItemContainerObj);
    this.ItemContainerObj.EventListeners["MouseOut"] = EventMouseOut;

    //- link object
    this.LinkObj = new sysObjLink();
    this.LinkObj.EventListeners = new Array();

    let EventLinkClick = new Object();
    EventLinkClick['Type'] = 'mousedown';
    EventLinkClick['Element'] = this.activateSelected.bind(this.SelectedIndicator);
    this.ItemContainerObj.EventListeners["LinkClick"] = EventLinkClick;

    //- setup recursive object structure
    const ObjDefs =  [
        {
            "id": "selected",
            "SysObject": this.SelectedIndicator,
            "JSONAttributes": {
                "Style": "sysTreeSelected"
            }
        },
        {
            "id": "item-container",
            "SysObject": this.ItemContainerObj,
            "JSONAttributes": {
                "Style": "sysTreeItemContainer"
            },
            "ObjectDefs": [
                {
                    "id": "item-icon",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "sysTreeIcon",
                        "Value": '<i class="' + Attributes.Icon + '"></i>'
                    }
                },
                {
                    "id": "item-link",
                    "SysObject": this.LinkObj,
                    "JSONAttributes": {
                        "Style": "sysTreeItemLink",
                        "DOMType": "div",
                        "TextID": Attributes.TextID,
                        "ScreenID": Attributes.ScreenID
                    }
                }
            ]
        }
    ]

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "setHilite"
//------------------------------------------------------------------------------

sysObjTreeSimpleItem.prototype.setHilite = function()
{
    this.addDOMElementStyle('sysTreeNodeTextHilite');
}


//------------------------------------------------------------------------------
//- METHOD "removeHilite"
//------------------------------------------------------------------------------

sysObjTreeSimpleItem.prototype.removeHilite = function()
{
    this.removeDOMElementStyle('sysTreeNodeTextHilite');
}


//------------------------------------------------------------------------------
//- METHOD "activateSelected"
//------------------------------------------------------------------------------

sysObjTreeSimpleItem.prototype.activateSelected = function()
{
    this.addDOMElementStyle('sysTreeSelectedHilite');

    try {
        this.ParentObject.TreeRootObj.LastSelectedItem.removeDOMElementStyle('sysTreeSelectedHilite');
    }
    catch(err) {
        console.debug('TreeSimple activateSelected error:%s', err);
    }

    this.ParentObject.TreeRootObj.LastSelectedItem = this;
}
