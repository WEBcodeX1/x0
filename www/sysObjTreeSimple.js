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
    this.ChildObjects   = new Array();      //- Child Objects
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
        this.addTreeItems(NodeItem, RootItem.Children);
        ++i;
    }
}


//------------------------------------------------------------------------------
//- METHOD "addTreeItems"
//------------------------------------------------------------------------------

sysObjTreeSimple.prototype.addTreeItems = function(NodeItem, ChildItems)
{
    let i=0;
    for (const ChildItem of ChildItems)
    {
        let TreeItem = new sysObjTreeSimpleItem();

        const NodeObjectID = NodeItem.JSONConfig.Attributes.ObjectID;

        TreeItem.JSONConfig = {
            "Attributes": {
                "ObjectID": NodeObjectID + i,
                "TextID": ChildItem.TextID
            }
        }

        TreeItem.init();
        NodeItem.ItemContainerObj.addObject(TreeItem);
        ++i;
    }
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjTreeSimpleNode"
//------------------------------------------------------------------------------

function sysObjTreeSimpleNode()
{
    this.ChildObjects   = new Array();          //- Child Objects
    this.DOMStyle       = 'SystreeNodeRoot';    //- CSS Style
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
    this.OpenCloseIcon.DOMStyle = 'SystreeOpenClose';
    this.OpenCloseIcon.DOMValue = '<i class="fa-regular fa-square-caret-down"></i>';
    this.OpenCloseIcon.StateOpen = true;
    this.OpenCloseIcon.RootObject = this.ItemContainerObj;

    let EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown';
    EventListenerObj['Element'] = this.toggleVisibleState.bind(this.OpenCloseIcon);
    this.OpenCloseIcon.EventListeners["OpenClose"] = EventListenerObj;

    //- setup recursive object structure
    ObjDefs =  [
        {
            "id": "selected",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "SystreeSelected"
            }
        },
        {
            "id": "item-container",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "SystreeItemContainer"
            },
            "ObjectDefs": [
                {
                    "id": "node-icon",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "SystreeIcon",
                        "Value": '<i class="fa-solid fa-hexagon-nodes"></i>'
                    }
                },
                {
                    "id": "node-text",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "SystreeNodeText",
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

function sysObjTreeSimpleItem()
{
    this.ChildObjects   = new Array();          //- Child Objects
    this.DOMStyle       = 'SystreeItemRoot';    //- CSS Style
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

    const ItemText = sysFactory.getText(Attributes.TextID);
    console.debug('TreeSimpleItem NodeText:%s', ItemText);

    //- setup recursive object structure
    ObjDefs =  [
        {
            "id": "selected",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "SystreeSelected"
            }
        },
        {
            "id": "item-container",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "SystreeItemContainer"
            },
            "ObjectDefs": [
                {
                    "id": "node-icon",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "SystreeIcon",
                        "Value": '<i class="fa-solid fa-hexagon-nodes"></i>'
                    }
                },
                {
                    "id": "node-text",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "SystreeNodeText",
                        "Value": ItemText
                    }
                }
            ]
        }
    ]

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}
