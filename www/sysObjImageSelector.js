//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ImageSelector"                                            -//
//- SYSTEM OBJECT "ImageSelectorRow"                                         -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjImageSelectorRow"
//------------------------------------------------------------------------------

function sysObjImageSelectorRow(ParentObject, RowIndex, Data)
{
    this.ObjectType             = 'ImageSelectorRow';       //- System Object Type
    this.ParentObject           = ParentObject;             //- Parent Object Ref
    this.RowIndex               = RowIndex;                 //- Row Index
    this.Data                   = Data;                     //- Key / Value Pair Data
    this.ChildObjects           = new Array();              //- Child Objects
}

//- inherit sysBaseObject
sysObjImageSelectorRow.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjImageSelectorRow.prototype.init = function()
{
    //- set object id
    this.ObjectID = this.ParentObject.ObjectID + this.RowIndex;

    console.debug('::sysObjImageSelectorRow init() ObjectID:%s', this.ObjectID);

    //- setup image select button
    let SelectImageButton = new sysObjButtonCallback();
    SelectImageButton.overrideDOMObjectID = true;
    SelectImageButton.setCallback(this);

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
                    "id": "ColImage",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-1 p-1"
                    },
                    "ObjectDefs": [
                        {
                            "id": "Image",
                            "SysObject": new sysObjImage(),
                            "JSONAttributes": {
                                "Value": this.Data.Path,
                                "Width": "80px",
                                "Height": "80px"
                            }
                        }
                    ]
                },
                {
                    "id": "ColImageID",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-3 p-1 h5 text-primary-emphasis",
                        "Value": this.Data.ID
                    }
                },
                {
                    "id": "ColImageDescription",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-3 p-1 h5 text-primary-emphasis",
                        "Value": this.Data.Description
                    }
                },
                {
                    "id": "ColImagePath",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-4 p-1 h5 text-primary-emphasis",
                        "Value": this.Data.Path
                    }
                },
                {
                    "id": "CtrColBtnSelect",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-1 p-1"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "BtnSelect",
                            "SysObject": SelectImageButton,
                            "JSONAttributes": {
                                "TextID": "TXT.SYS.BUTTON.SELECT_ITEM",
                                "Style": "btn btn-primary w-100",
                                "IconStylePost": "fa-solid fa-right-to-bracket"
                            }
                        }
                    ]
                },
                {
                    "id": "RowSeperator",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "DOMType": "hr",
                        "Style": "text-primary-emphasis"
                    }
                }

            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "processCallback"
//------------------------------------------------------------------------------

sysObjImageSelectorRow.prototype.processCallback = function()
{
    this.ParentObject.SrcObjectRef.setImgData(this.Data);
    sysFactory.OverlayObj.closeOverlay('ExamplesBasicOverlayImageSelector');
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjImageSelector"
//------------------------------------------------------------------------------

function sysObjImageSelector()
{
    this.ObjectType             = 'ImageSelector';                  //- System Object Type

    this.RowCount               = 5;                                //- Row Count Default (Pagination Rows Per Page)

    this.RowItems               = new Array();                      //- Row Objects Container (Pagination)
    this.RuntimeData            = new Array();                      //- Runtime Data

    this.ChildObjects           = new Array();                      //- Child Objects
    this.PaginationObject       = new sysPagination(this);          //- Pagination

    //- Default Bootstrap DOMStyle
    this.DOMStyle = 'border border-light border-5 border-opacity-75 rounded m-0 p-0'
}

//- inherit sysBaseObject
sysObjImageSelector.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjImageSelector.prototype.init = function()
{
    //- set processing attributes from config
    let Attributes = this.JSONConfig.Attributes;

    //- define empty attributes (object) when undefined
    if (Attributes === undefined) { Attributes = new Object(); }

    //- set properties from attributes
    if (Attributes.Style !== undefined) { this.DOMStyle = Attributes.Style; }
    if (Attributes.Value !== undefined) { this.RuntimeData = Attributes.Value; }
    if (Attributes.RowCount !== undefined) { this.RowCount = Attributes.RowCount; }

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
                        "Style": "col col-md-12 p-3"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "HeaderText",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
                                "TextID": "TXT.SYS.IMAGESELECTOR.HEADER",
                                "Style": "h2 text-white",
                                "IconStyle": "fa-solid fa-image"
                            }
                        }
                    ]
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefsHeader, this);

    //- process image items
    this.processRows();

    //- setup save server image settings button
    let SaveSettingsButton = new sysObjButtonCallback();
    SaveSettingsButton.overrideDOMObjectID = true;
    SaveSettingsButton.setCallback(this);

    //- setup file-upload object structure
    const ObjDefsFileUpload = [
        {
            "id": "CtrUploadRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0 bg-secondary-subtle bg-opacity-25 border border-5 border-start-0 border-bottom-0 border-end-0"
            },
            "ObjectDefs": [
                {
                    "id": "CtrDescriptionCol",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-2 p-2 border border-2 border-right-dotted"
                    },
                    "ObjectDefs": [
                        {
                            "id": "FileDescriptionText",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
                                "TextID": "TXT.SYS.IMAGESELECTOR.ROW.FILE.DESCRIPTION",
                                "Style": "h4 text-success-emphasis"
                            }
                        }
                    ]
                },
                {
                    "id": "CtrUploadCol",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-10 m-0 p-0"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "FileUpload",
                            "SysObject": new sysFileUpload(),
                            "JSONAttributes": {
                                "Style": "m-0 p-1",
                                "StyleSelectButton": "text-primary-emphasis"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "CtrFormRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0 bg-secondary-subtle bg-opacity-25 border border-dark border-opacity-50 border-start-0 border-bottom-0 border-end-0"
            },
            "ObjectDefs": [
                {
                    "id": "CtrFormDescriptionCol",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-2 p-2"
                    },
                    "ObjectDefs": [
                        {
                            "id": "FileDescriptionText",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
                                "TextID": "TXT.SYS.IMAGESELECTOR.ROW.FORM.DESCRIPTION",
                                "Style": "h4 text-primary-emphasis"
                            }
                        }
                    ]
                },
                {
                    "id": this.ObjectID + "FileUploadForm",
                    "SysObject": new sysFormfieldList(),
                    "JSONAttributes": {
                        "Style": "col-md-10",
                        "ObjectIDs": [
                            "ImageIDLabel",
                            "ImageID",
                            "ImageDescriptionLabel",
                            "ImageDescription",
                            "ImageServerPathLabel",
                            "ImageServerPath",
                            "ImageFilenameLabel",
                            "ImageFilename"
                        ],
                        "RowStyle": [
                            "row mb-6"
                        ],
                        "RowAfterElements": 8,
                        "ColAfterElements": 2,
                        "ColStyle": "col-md-3 mb-4",
                        "Disable": true
                    }
                }
            ]
        },
        {
            "id": "CtrButtonRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0 bg-secondary-subtle bg-opacity-25 border border-dark border-opacity-50 border-start-0 border-end-0"
            },
            "ObjectDefs": [
                {
                    "id": "CtrBtnDescriptionCol",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-2 p-2"
                    },
                    "ObjectDefs": [
                        {
                            "id": "FileDescriptionText",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
                                "TextID": "TXT.SYS.IMAGESELECTOR.ROW.FORMSEND.DESCRIPTION",
                                "Style": "h4 text-primary-emphasis"
                            }
                        }
                    ]
                },
                {
                    "id": "CtrBtnCol",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-10 p-2"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "BtnSaveSettings",
                            "SysObject": SaveSettingsButton,
                            "JSONAttributes": {
                                "TextID": "TXT.SYS.BUTTON.IMAGE_SAVE_SERVER_SETTINGS",
                                "Style": "btn btn-primary w-100",
                                "IconStyle": "fa-solid fa-floppy-disk",
                                "Disabled": true
                            }
                        }
                    ]
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefsFileUpload, this);

    //- update pagination
    this.PaginationObject.update();
}


//------------------------------------------------------------------------------
//- METHOD "processRows"
//------------------------------------------------------------------------------

sysObjImageSelector.prototype.processRows = function()
{
    let RowIndex = 0;
    for (const RowData of this.RuntimeData)
    {
        let RowObj = new sysObjImageSelectorRow(
            this, RowIndex, RowData
        );

        RowObj.init();

        this.addObject(RowObj);
        this.RowItems.push(RowObj);

        ++RowIndex;
    }
}


//------------------------------------------------------------------------------
//- METHOD "setSrcObjectRef"
//------------------------------------------------------------------------------

sysObjImageSelector.prototype.setSrcObjectRef = function(ObjectRef)
{
    this.SrcObjectRef = ObjectRef;
}
