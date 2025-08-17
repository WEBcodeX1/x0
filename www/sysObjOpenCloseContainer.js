//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "OpenClose"                                                -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjOpenClose"
//------------------------------------------------------------------------------

function sysObjOpenClose()
{
    this.ChildObjects   = new Array();     //- Child Objects
}

//- inherit sysBaseObject
sysObjOpenClose.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjOpenClose.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    //- define open/close button
    this.OpenCloseIcon = new sysBaseObject();
    this.OpenCloseIcon.EventListeners = new Object();
    this.OpenCloseIcon.DOMStyle = 'col-sm-4 mb-3 mb-sm-0 text-end';
    this.OpenCloseIcon.DOMValue = '<i class="fa-regular fa-square-caret-down"></i>';
    this.OpenCloseIcon.StateOpen = true;
    this.OpenCloseIcon.RootObject = this;

    let EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown';
    EventListenerObj['Element'] = this.toggleVisibleState.bind(this.OpenCloseIcon);
    this.OpenCloseIcon.EventListeners["OpenClose"] = EventListenerObj;

    //- setup recursive object structure
    const ObjDefs = [
        {
            "id": "card-ctn",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "card"
            },
            "ObjectDefs": [
                {
                    "id": "card-header-ctn",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "card-header"
                    },
                    "ObjectDefs": [
                        {
                            "id": "card-header-row",
                            "SysObject": new sysObjDiv(),
                            "JSONAttributes": {
                                "Style": "row"
                            },
                            "ObjectDefs": [
                                {
                                    "id": "header-text",
                                    "SysObject": new sysObjDiv(),
                                    "JSONAttributes": {
                                        "Style": "col-sm-8 mb-3 mb-sm-0",
                                        "Value": sysFactory.getText(Attributes.TextID)
                                    }
                                },
                                {
                                    "id": "open-close-button",
                                    "SysObject": this.OpenCloseIcon
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "toggleVisibleState"
//------------------------------------------------------------------------------

sysObjOpenClose.prototype.toggleVisibleState = function()
{
    if (this.StateOpen === true) {
        this.StateOpen = false;
        this.DOMValue = '<i class="fa-regular fa-square-caret-right"></i>';
        this.setDOMElementValue();
        this.RootObject.processChildObjects();
        return;
    }
    else {
        this.StateOpen = true;
        this.DOMValue = '<i class="fa-regular fa-square-caret-down"></i>';
        this.setDOMElementValue();
        this.RootObject.processChildObjects();
    }
}


//------------------------------------------------------------------------------
//- METHOD "processChildObjects"
//------------------------------------------------------------------------------

sysObjOpenClose.prototype.processChildObjects = function()
{
    for (let i=1; i<this.ChildObjects.length; ++i) {
        const ChildObject = this.ChildObjects[i];
        if (this.OpenCloseIcon.StateOpen === true) {
            ChildObject.VisibleState = 'visible';
        }
        if (this.OpenCloseIcon.StateOpen === false) {
            ChildObject.VisibleState = 'hidden';
        }
        ChildObject.setDOMVisibleState();
    }
}
