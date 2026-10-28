//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "PeopleSelector"                                           -//
//- SYSTEM OBJECT "PeopleSelectorRow"                                        -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "userObjExamplePeopleSelectorRow"
//------------------------------------------------------------------------------

function userObjExamplePeopleSelectorRow(ParentObject, RowIndex, Data)
{
    this.ObjectType             = 'PeopleSelectorRow';      //- System Object Type
    this.ParentObject           = ParentObject;             //- Parent Object Ref
    this.RowIndex               = RowIndex;                 //- Row Index
    this.Data                   = Data;                     //- Key / Value Pair Data
    this.ChildObjects           = new Array();              //- Child Objects
}

//- inherit sysBaseObject
userObjExamplePeopleSelectorRow.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

userObjExamplePeopleSelectorRow.prototype.init = function()
{
    //- set object id
    this.ObjectID = this.ParentObject.ObjectID + this.RowIndex;

    console.debug('::userObjExamplePeopleSelectorRow init() ObjectID:%s', this.ObjectID);

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
                    "id": "ColPicture",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-2 p-1"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "Image",
                            "SysObject": new sysObjImage(),
                            "JSONAttributes": {
                                "Value": this.Data.Image
                            }
                        }
                    ]
                },
                {
                    "id": "ColName",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-4 p-1"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "DisplayName",
                            "SysObject": new sysObjDivValue(),
                            "JSONAttributes": {
                                "Value": this.Data.Name
                            }
                        }
                    ]
                },
                {
                    "id": "ColRemark",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-5 p-1"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "Remark",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
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
//- CONSTRUCTOR "userObjExamplePeopleSelector"
//------------------------------------------------------------------------------

function userObjExamplePeopleSelector()
{
    this.ObjectType             = 'PeopleSelector';         //- System Object Type
    this.ChildObjects           = new Array();              //- Child Objects

    //- Default Bootstrap DOMStyle
    this.DOMStyle = 'border border-light border-5 border-opacity-75 rounded m-0 p-0'
}

//- inherit sysBaseObject
userObjExamplePeopleSelector.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

userObjExamplePeopleSelector.prototype.init = function()
{
    //- set processing attributes from config
    let Attributes = this.JSONConfig.Attributes;

    //- define empty attributes (object) when undefined
    if (Attributes === undefined) { Attributes = new Object(); }

    //- set properties from attributes
    if (Attributes.Style !== undefined) { this.DOMStyle = Attributes.Style; }

    //- set peoples data (non-overidable)
    const PeopleData = [
        {
            "Style": "",
            "Image": "/image/icon-correspondend-bush-michael.png",
            "Name": "Bush, Michael",
            "TextID": "TXT.EXAMPLE.PEOPLE_SELECTOR.BUSH_MICHAEL"
        },
        {
            "Style": "",
            "Image": "/image/icon-correspondend-pruefer-claus.png",
            "Name": "Prüfer, Claus",
            "TextID": "TXT.EXAMPLE.PEOPLE_SELECTOR.PRUEFER_CLAUS"
        },
        {
            "Style": "",
            "Image": "/image/icon-correspondend-kroemer-dr.png",
            "Name": "Dr. Krömer",
            "TextID": "TXT.EXAMPLE.PEOPLE_SELECTOR.DR_KROEMER"
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
                                "TextID": "TXT.EXAMPLE.PEOPLESELECTOR.HEADER",
                                "Style": "h2 text-white",
                                "IconStyle": "fa-solid fa-people-group"
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
    for (const RowData of PeopleData)
    {
        let RowObj = new userObjExamplePeopleSelectorRow(
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
                                "TextID": "TXT.EXAMPLE.PEOPLESELECTOR.SELECT_PEOPLES",
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

userObjExamplePeopleSelector.prototype.ButtonCallback = function(FunctionID)
{
    if (FunctionID == 'close') {
        this.ParentObject.VisibleState = 'hidden';
        this.ParentObject.setDOMVisibleState();
    }
    else if (FunctionID == 'select') {
        console.debug('Select Data:%o', this.getObjectData());
    }
}


//------------------------------------------------------------------------------
//- METHOD "setSrcObjectRef"
//------------------------------------------------------------------------------

userObjExamplePeopleSelector.prototype.setSrcObjectRef = function(ObjectRef)
{
    this.SrcObjectRef = ObjectRef;
}
