//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "OpenCloseContainer"                                       -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjOpenCloseContainer"
//------------------------------------------------------------------------------

function sysObjOpenCloseContainer()
{
    this.overrideDOMObjectID    = true;             //- Override recursive ObjectID
    this.ChildObjects           = new Array();      //- Child Objects
}

//- inherit sysBaseObject
sysObjOpenCloseContainer.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjOpenCloseContainer.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    //- set/override default config attributes
    this.StateOpen = (Attributes.StateOpen !== undefined) ? Attributes.StateOpen : true;
    this.DOMStyle = (Attributes.Style !== undefined) ? Attributes.Style : 'card mb-3';

    //- set header style
    const HeaderStyle = (Attributes.HeaderStyle !== undefined) ? Attributes.HeaderStyle : 'card-header';

    //- define open/close button
    this.OpenCloseIcon = new sysBaseObject();
    this.OpenCloseIcon.EventListeners = new Object();
    this.OpenCloseIcon.DOMType = 'h4';
    this.OpenCloseIcon.DOMStyle = 'col-sm-4 mb-3 mb-sm-0 text-secondary text-end';
    this.OpenCloseIcon.DOMValue = '<i class="fa-solid fa-angle-down"></i>';

    //- setup open/close event listener
    let EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown';
    EventListenerObj['Element'] = this.toggleVisibleState.bind(this);
    this.OpenCloseIcon.EventListeners["OpenClose"] = EventListenerObj;

    //- setup recursive object structure
    const ObjDefs = [
        {
            "id": "CtrCardHeader",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": HeaderStyle
            },
            "ObjectDefs": [
                {
                    "id": "CardHeaderRow",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "row"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "CardHeaderText",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
                                "Style": "col-sm-8 mb-3 mb-sm-0",
                                "DOMType": "h5",
                                "TextID": Attributes.TextID,
                                "IconStyle": Attributes.IconStyle
                            }
                        },
                        {
                            "id": "OpenCloseButton",
                            "SysObject": this.OpenCloseIcon
                        }
                    ]
                }
            ]
        },
        {
            "id": this.ObjectID + 'Content',
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "card-body"
            }
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "toggleVisibleState"
//------------------------------------------------------------------------------

sysObjOpenCloseContainer.prototype.toggleVisibleState = function()
{
    if (this.StateOpen === true) {
        this.StateOpen = false;
        this.OpenCloseIcon.DOMValue = '<i class="fa-solid fa-angle-up"></i>';
        this.OpenCloseIcon.setDOMElementValue();
    }
    else if (this.StateOpen === false) {
        this.StateOpen = true;
        this.OpenCloseIcon.DOMValue = '<i class="fa-solid fa-angle-down"></i>';
        this.OpenCloseIcon.setDOMElementValue();
    }
    this.updateState();
}


//------------------------------------------------------------------------------
//- METHOD "updateState"
//------------------------------------------------------------------------------

sysObjOpenCloseContainer.prototype.updateState = function()
{
    const ActivateObj = sysFactory.getObjectByID(this.ObjectID + 'Content');

    if (this.StateOpen === true) {
        ActivateObj.VisibleState = 'visible';
    }
    if (this.StateOpen === false) {
        ActivateObj.VisibleState = 'hidden';
    }

    ActivateObj.setDOMVisibleState();
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysObjOpenCloseContainer.prototype.reset = function()
{
    this.updateState();
}
