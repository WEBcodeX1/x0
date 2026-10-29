//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "BadgeSelector"                                            -//
//- SYSTEM OBJECT "BadgeSelectorRow"                                         -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjBadgeSelectorRow"
//------------------------------------------------------------------------------

function sysObjBadgeSelectorRow(ParentObject, RowIndex, Data)
{
    this.ObjectType             = 'BadgeSelectorRow';       //- System Object Type
    this.ParentObject           = ParentObject;             //- Parent Object Ref
    this.RowIndex               = RowIndex;                 //- Row Index
    this.Data                   = Data;                     //- Key / Value Pair Data
    this.ChildObjects           = new Array();              //- Child Objects
}

//- inherit sysBaseObject
sysObjBadgeSelectorRow.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjBadgeSelectorRow.prototype.init = function()
{
    //- set object id
    this.ObjectID = this.ParentObject.ObjectID + this.RowIndex;

    console.debug('::sysObjBadgeSelectorRow init() ObjectID:%s', this.ObjectID);

    //- setup recursive object structure
    const ObjDefs = [
        {
            "id": "CtrRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0 bg-white align-items-center"
            },
            "ObjectDefs": [
                {
                    "id": "ColCheckbox",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-1 p-1 ps-2"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "CheckBox",
                            "SysObject": new sysFormfieldItemCheckbox()
                        }
                    ]
                },
                {
                    "id": "ColBadge",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-11 p-1"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "Badge",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
                                "DOMType": "span",
                                "Style": "badge w-100 " + this.Data.Style,
                                "TextID": this.Data.TextID
                            }
                        }
                    ]
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjBadgeSelector"
//------------------------------------------------------------------------------

function sysObjBadgeSelector()
{
    this.ObjectType             = 'BadgeSelector';                  //- System Object Type
    this.ChildObjects           = new Array();                      //- Child Objects

    //- Default Bootstrap DOMStyle
    this.DOMStyle = 'border border-light border-5 border-opacity-75 rounded m-0 p-0'
}

//- inherit sysBaseObject
sysObjBadgeSelector.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjBadgeSelector.prototype.init = function()
{
    //- set processing attributes from config
    let Attributes = this.JSONConfig.Attributes;

    //- define empty attributes (object) when undefined
    if (Attributes === undefined) { Attributes = new Object(); }

    //- set properties from attributes
    if (Attributes.Style !== undefined) { this.DOMStyle = Attributes.Style; }

    //- set badges data (non-overidable)
    const BadgesData = [
        {
            "Style": "bg-primary",
            "TextID": "TXT.SYS.BADGE.PRIMARY"
        },
        {
            "Style": "bg-secondary",
            "TextID": "TXT.SYS.BADGE.SECONDARY"
        },
        {
            "Style": "bg-success",
            "TextID": "TXT.SYS.BADGE.SUCCESS"
        },
        {
            "Style": "bg-info",
            "TextID": "TXT.SYS.BADGE.INFO"
        },
        {
            "Style": "bg-warning",
            "TextID": "TXT.SYS.BADGE.WARNING"
        },
        {
            "Style": "bg-danger",
            "TextID": "TXT.SYS.BADGE.DANGER"
        }
    ];

    //- setup close button
    let CloseButton = new sysObjButtonCallback();
    CloseButton.overrideDOMObjectID = true;
    CloseButton.setCallback(this, 'close');

    //- setup select selected badges button
    let SelectBadgesButton = new sysObjButtonCallback();
    SelectBadgesButton.overrideDOMObjectID = true;
    SelectBadgesButton.setCallback(this, 'select');

    //- setup header object structure
    const ObjDefsHeader = [
        {
            "id": "HeaderRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 bg-primary bg-opacity-75 border border-5 border-opacity-75 border-start-0 border-top-0 border-end-0"
            },
            "ObjectDefs": [
                {
                    "id": "CtrColImage",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-10 p-3"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "HeaderText",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
                                "TextID": "TXT.SYS.BADGESELECTOR.HEADER",
                                "Style": "h2 text-white",
                                "IconStyle": "fa-solid fa-flag"
                            }
                        }
                    ]
                },
                {
                    "id": "CtrColClose",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-2 p-3 text-end"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "BtClose",
                            "SysObject": CloseButton,
                            "JSONAttributes": {
                                "Style": "btn m-0 p-0 text-white",
                                "DOMValue": '<i class="fa-solid fa-rectangle-xmark">'
                            }
                        }
                    ]
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefsHeader, this);

    //- add system badges
    let RowIndex = 0;
    for (const RowData of BadgesData)
    {
        let RowObj = new sysObjBadgeSelectorRow(
            this, RowIndex, RowData
        );

        RowObj.init();
        this.addObject(RowObj);

        ++RowIndex;
    }

    //- setup header object structure
    const ObjDefsFooter = [
        {
            "id": "FooterRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0 bg-white"
            },
            "ObjectDefs": [
                {
                    "id": "CtrColBtnSelect",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-12 p-2 border border-2 border-start-0 border-end-0 border-bottom-0"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "BtnSelectBadges",
                            "SysObject": SelectBadgesButton,
                            "JSONAttributes": {
                                "TextID": "TXT.SYS.BADGESELECTOR.SELECT_BADGES",
                                "Style": "btn btn-primary w-100",
                                "IconStylePost": "fa-solid fa-right-to-bracket"
                            }
                        }
                    ]
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefsFooter, this);
}


//------------------------------------------------------------------------------
//- METHOD "ButtonCallback"
//------------------------------------------------------------------------------

sysObjBadgeSelector.prototype.ButtonCallback = function(FunctionID)
{
    if (FunctionID == 'close') {
        this.ParentObject.VisibleState = 'hidden';
        this.ParentObject.setDOMVisibleState();
    }
}


//------------------------------------------------------------------------------
//- METHOD "setSrcObjectRef"
//------------------------------------------------------------------------------

sysObjBadgeSelector.prototype.setSrcObjectRef = function(ObjectRef)
{
    this.SrcObjectRef = ObjectRef;
}
