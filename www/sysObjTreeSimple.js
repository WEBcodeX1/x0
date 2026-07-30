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
    this.ChildObjects           = new Array();                      //- Child Objects
    this.LastSelectedItem       = null;                             //- Last Selected Objet Reference
    this.DOMStyle               = 'list-group list-group-flush';    //- Bootstrap List Group CSS
    this.overrideDOMObjectID    = true;                             //- Override recursive ID
    this.ObjectID               = this.ID;                          //- Set Unique ID
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

    this.IndentLevel = 0;

    let i=0;
    for (const RootItem of Attributes.TreeItems)
    {
        console.debug('TreeSimple RootItem:%o', RootItem);
        let NodeItem = new sysObjTreeSimpleNode(this.IndentLevel);

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
    this.IndentLevel += 1;

    let i=0;
    for (const ChildItem of ChildItems)
    {
        var TreeItem;

        const ItemObjectID = NodeItem.JSONConfig.Attributes.ObjectID;
        ChildItem['ObjectID'] = ItemObjectID+i;

        if (ChildItem.Type == 'Item') {
            TreeItem = new sysObjTreeSimpleItem(RootObj, this.IndentLevel);
        }

        else if (ChildItem.Type == 'Node') {
            TreeItem = new sysObjTreeSimpleNode(this.IndentLevel);
        }

        TreeItem.JSONConfig = {
            "Attributes": ChildItem
        }

        TreeItem.init();
        NodeItem.TreeItemContainerObj.addObject(TreeItem);

        if (ChildItem.Type == 'Node') {
            this.addTreeItems(RootObj, TreeItem, ChildItem.Children);
        }

        ++i;
    }

    this.IndentLevel -= 1;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjTreeSimpleNode"
//------------------------------------------------------------------------------

function sysObjTreeSimpleNode(IndentLevel)
{
    this.ChildObjects   = new Array();          //- Child Objects
    this.DOMType        = 'li';                 //- Div Type
    this.DOMStyle       = 'list-group-item';    //- Bootstrap CSS Style
    this.IndentLevel    = IndentLevel;          //- Tree Indent Level
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

    //- children container
    this.TreeItemContainerObj = new sysBaseObject();
    this.TreeItemContainerObj.DOMStyle = 'list-group list-group-flush';
    this.TreeItemContainerObj.ObjectID = 'Children';
    this.TreeItemContainerObj.ChildObjects = new Array();

    //- define open/close folder icon
    this.OpenCloseIcon = new sysBaseObject();
    this.OpenCloseIcon.EventListeners = new Object();
    this.OpenCloseIcon.DOMStyle = 'col-1';
    this.OpenCloseIcon.DOMValue = '<i class="fa-solid fa-folder-open"></i>';
    this.OpenCloseIcon.StateOpen = true;
    this.OpenCloseIcon.RootObject = this.TreeItemContainerObj;

    let EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown';
    EventListenerObj['Element'] = this.toggleVisibleState.bind(this.OpenCloseIcon);
    this.OpenCloseIcon.EventListeners["OpenClose"] = EventListenerObj;

    //- setup recursive object structure
    const ObjDefs =  [
        {
            "id": "NodeContainer",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row"
            },
            "ObjectDefs": [
                {
                    "id": "NodeIcon",
                    "SysObject": this.OpenCloseIcon,
                },
                {
                    "id": "NodeText",
                    "SysObject": new sysObjSQLText(),
                    "JSONAttributes": {
                        "Style": "col-xl-11",
                        "TextID": Attributes.TextID
                    }
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);

    this.addObject(this.TreeItemContainerObj);
}


//------------------------------------------------------------------------------
//- METHOD "toggleVisibleState"
//------------------------------------------------------------------------------

sysObjTreeSimpleNode.prototype.toggleVisibleState = function()
{
    if (this.StateOpen === true) {
        this.StateOpen = false;
        this.DOMValue = '<i class="fa-regular fa-folder"></i>';
        this.setDOMElementValue();
        this.RootObject.VisibleState = 'hidden';
        this.RootObject.setDOMVisibleState();
        return;
    }
    else if (this.StateOpen === false) {
        this.StateOpen = true;
        this.DOMValue = '<i class="fa-regular fa-folder-open"></i>';
        this.setDOMElementValue();
        this.RootObject.VisibleState = 'visible';
        this.RootObject.setDOMVisibleState();
    }
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjTreeSimpleItem"
//------------------------------------------------------------------------------

function sysObjTreeSimpleItem(TreeRootObj, IndentLevel)
{
    this.ChildObjects       = new Array();              //- Child Objects
    this.DOMType            = 'li';                     //- Div Type
    this.DOMStyle           = 'list-group-item';        //- Bootstrap CSS Style
    this.TreeRootObj        = TreeRootObj;              //- Tree root Reference
    this.IndentLevel        = IndentLevel;              //- Tree Indent Level
    this.EventListeners     = new Array();              //- Event Listeners
    this.HiLiteStyle        = 'bg-body-secondary';      //- Hilite CSS
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

    //- link object
    this.LinkObj = new sysObjSQLText();
    this.LinkObj.EventListeners = new Array();

    let EventLinkClick = new Object();
    EventLinkClick['Type'] = 'mousedown';
    EventLinkClick['Element'] = this.activateSelected.bind(this.SelectedIndicator);
    this.LinkObj.EventListeners["LinkClick"] = EventLinkClick;

    //- mouseover / mouseout event handler
    let EventMouseOver = new Object();
    EventMouseOver['Type'] = 'mouseover';
    EventMouseOver['Element'] = this.setHilite.bind(this);
    this.LinkObj.EventListeners["MouseOver"] = EventMouseOver;

    let EventMouseOut = new Object();
    EventMouseOut['Type'] = 'mouseout';
    EventMouseOut['Element'] = this.removeHilite.bind(this);
    this.LinkObj.EventListeners["MouseOut"] = EventMouseOut;

    //- setup recursive object structure
    const ObjDefs =  [
        {
            "id": "ItemSelected",
            "SysObject": this.SelectedIndicator,
            "JSONAttributes": {
                "Style": "sysTreeItemSelected"
            }
        },
        {
            "id": "ItemDisplay",
            "SysObject": this.LinkObj,
            "JSONAttributes": {
                "IconStyle": Attributes.Icon,
                "TextID": Attributes.TextID
            }
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "setHilite"
//------------------------------------------------------------------------------

sysObjTreeSimpleItem.prototype.setHilite = function()
{
    this.addDOMElementStyle(this.HiLiteStyle);
}


//------------------------------------------------------------------------------
//- METHOD "removeHilite"
//------------------------------------------------------------------------------

sysObjTreeSimpleItem.prototype.removeHilite = function()
{
    this.removeDOMElementStyle(this.HiLiteStyle);
}


//------------------------------------------------------------------------------
//- METHOD "activateSelected"
//------------------------------------------------------------------------------

sysObjTreeSimpleItem.prototype.activateSelected = function()
{
    this.addDOMElementStyle('sysTreeItemSelectedHilite');

    try {
        this.ParentObject.TreeRootObj.LastSelectedItem.removeDOMElementStyle('sysTreeItemSelectedHilite');
    }
    catch(err) {
        console.debug('TreeSimple activateSelected error:%s', err);
    }

    this.ParentObject.TreeRootObj.LastSelectedItem = this;
}
