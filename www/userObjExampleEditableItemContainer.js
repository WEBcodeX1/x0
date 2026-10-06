//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- USER SYSTEM OBJECT "ExampleEditableItem"                                 -//
//- USER SYSTEM OBJECT "ExampleEditableItemContainer"                        -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "userObjExampleEditableItem"
//------------------------------------------------------------------------------

function userObjExampleEditableItem()
{
    this.ObjectType             = 'ExampleEditableItem';                    //- System Object Type

    this.DOMStyle               = 'row m-0 pt-3 p-3 border border-top-0'    //- Default Bootstrap "row" DOMStyle

    this.EditMode               = false;                                    //- Switchable Edit Mode
    this.ChangeOrderMode        = false;                                    //- Switchable Change Order Mode

    this.ChildObjects           = new Array();                              //- Child Objects
}

//- inherit sysObjDivUnique
userObjExampleEditableItem.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

userObjExampleEditableItem.prototype.init = function()
{
    //- set processing attributes from config
    let Attributes = this.JSONConfig.Attributes;

    //- define empty attributes (object) when undefined
    if (Attributes === undefined) {
        Attributes = new Object();
    }

    //- set style
    if (Attributes.Style !== undefined) {
        this.DOMStyle = Attributes.Style;
    }

    if (Attributes.Editable !== undefined) {
        this.EditMode = true;
    };

    if (Attributes.OrderChangeable !== undefined) {
        this.ChangeOrderMode = true;
    };

    //- set default values
    this.ImagePath = (Attributes.ImagePath === undefined) ? '/image/icon-select-image.png' : Attributes.ImagePath;
    this.HeaderText = (Attributes.HeaderText === undefined) ? 'Default Header Text' : Attributes.HeaderText;
    this.ContentText = (Attributes.ContentText === undefined) ? 'Default Content Text' : Attributes.ContentText;

    //- setup upload button
    let SelectImageButton = new sysObjButtonCallback();
    SelectImageButton.overrideDOMObjectID = true;
    SelectImageButton.setCallback(this);

    //- set dynamic edit or display objects
    ObjectsDisplay = [
        {
            "id": this.ObjectID + "HeaderText",
            "SysObject": new sysObjDivValue(),
            "KeyID": "HeaderText",
            "JSONAttributes": {
                "Value": this.HeaderText,
                "Style": "fw-bold"
            }
        },
        {
            "id": this.ObjectID + "ContentText",
            "SysObject": new sysObjDivValue(),
            "KeyID": "ContentText",
            "JSONAttributes": {
                "Value": this.ContentText
            }
        }
    ];

    ObjectsEdit = [
        {
            "id": this.ObjectID + "HeaderText",
            "SysObject": new sysFormfieldItemText(),
            "KeyID": "HeaderText",
            "JSONAttributes": {
                "PlaceholderTextID": "TXT.EXAMPLE.EDITABLE_ITEM.PLACEHOLDER.HEADER",
                "Style": "form-control mb-1 p-1 w-100 fw-bold"
            }
        },
        {
            "id": this.ObjectID + "ContentText",
            "SysObject": new sysFormfieldItemTextarea(),
            "KeyID": "ContentText",
            "JSONAttributes": {
                "PlaceholderTextID": "TXT.EXAMPLE.EDITABLE_ITEM.PLACEHOLDER.CONTENT",
                "Style": "form-control mb-1 p-1 w-100"
            }
        }
    ];

    DisplayObjects = (this.EditMode === true) ? ObjectsEdit : ObjectsDisplay;

    //- reference image object
    this.ImgageObj = new sysObjImage();

    //- setup recursive object structure
    let ObjDefs = [
        {
            "id": "CtrColUploadIcon",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-1 p-3"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "UploadIcon",
                    "SysObject": SelectImageButton,
                    "JSONAttributes": {
                        "Style": "btn m-0 p-0 text-center",
                        "DOMValue": '<i class="fa-solid fa-upload text-primary-emphasis bg-primary bg-opacity-25 p-2 border border-5 border-primary-subtle rounded rounded-circle"></i>'
                    }
                }
            ]
        },
        {
            "id": "CtrColImage",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-1 p-3"
            },
            "ObjectDefs": [
                {
                    "id": "CtrImage",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "rounded rounded-circle p-0 example-item-container1-image text-center"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "Image",
                            "SysObject": this.ImgageObj,
                            "KeyID": "ImagePath",
                            "JSONAttributes": {
                                "Value": this.ImagePath,
                                "Width": "40px",
                                "Height": "40px"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "CtrColText",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-9 p-2"
            },
            "ObjectDefs": DisplayObjects
        },
        {
            "id": "CtrColMove",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-1 p-3 text-center"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "MoveUpIcon",
                    "SysObject": new sysObjDivUnique(),
                    "JSONAttributes": {
                        "Value": '<i class="fa-solid fa-caret-up text-primary-emphasis bg-primary bg-opacity-25 p-2 border border-4 border-primary-subtle rounded"></i>'
                    }
                },
                {
                    "id": this.ObjectID + "MoveDownIcon",
                    "SysObject": new sysObjDivUnique(),
                    "JSONAttributes": {
                        "Value": '<i class="fa-solid fa-caret-down text-primary-emphasis bg-primary bg-opacity-25 p-2 border border-4 border-primary-subtle rounded"></i>'
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

userObjExampleEditableItem.prototype.processCallback = function()
{
    sysFactory.OverlayObj.activateOverlay('ExamplesBasicOverlayImageSelector');
    const ImgSelectorObj = sysFactory.getObjectByID('ExamplesBasicOverlayImageList');
    ImgSelectorObj.setSrcObjectRef(this);
}


//------------------------------------------------------------------------------
//- METHOD "setImgData"
//------------------------------------------------------------------------------

userObjExampleEditableItem.prototype.setImgData = function(Data)
{
    console.debug('::userObjExampleEditableItem setImgData:%o', Data);
    this.ImgageObj.RuntimeSetDataFunc(Data.Path);
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "userObjExampleEditableItemContainer"
//------------------------------------------------------------------------------

function userObjExampleEditableItemContainer()
{
    this.ObjectType             = 'ExampleEditableItemContainer';   //- System Object Type

    this.EditMode               = false;                            //- Switchable Edit Mode

    this.SetDataMechanism       = 'Plain'                           //- Set Data Key/Value Pair Type
    this.RuntimeSetDataFunc     = this.addItem;                     //- Add Item / Row
    this.RuntimeAppendDataFunc  = this.addItem;                     //- Add Item / Row

    this.RowCount               = 6;                                //- Row Count Default (Pagination Rows Per Page)

    this.RowItems               = new Array();                      //- Row Objects Container (Pagination)
    this.ChildObjects           = new Array();                      //- Child Objects

    this.PaginationObject       = new sysPagination(this);          //- Pagination
}

//- inherit sysObjDivUnique
userObjExampleEditableItemContainer.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

userObjExampleEditableItemContainer.prototype.init = function()
{
    //- set processing attributes from config
    let Attributes = this.JSONConfig.Attributes;

    //- define empty attributes (object) when undefined
    if (Attributes === undefined) {
        Attributes = new Object();
    }

    //- set default values
    this.DOMStyle = (Attributes.Style !== undefined) ? Attributes.Style : 'example-item-container1 border rounded shadow';

    if (Attributes.Editable !== undefined) {
        this.EditMode = true;
    };

    //- setup clickable edit icon button
    this.EditIconButton = new sysObjButtonCallback();
    this.EditIconButton.overrideDOMObjectID = true;
    this.EditIconButton.RootObject = this;
    this.EditIconButton.setCallback(this);

    //- render header
    this.renderHeader();

    //- update pagination
    this.PaginationObject.update();
}


userObjExampleEditableItemContainer.prototype.renderHeader = function()
{
    const Attributes = this.JSONConfig.Attributes;

    //- setup recursive object structure
    let ObjDefs = [
        {
            "id": "CtrRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0"
            },
            "ObjectDefs": [
                {
                    "id": "CtrColLeft",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-10 p-3"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "HeaderText",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
                                "TextID": Attributes.HeaderTextID,
                                "Style": Attributes.HeaderStyle,
                                "IconStyle": Attributes.HeaderIconStyle
                            }
                        }
                    ]
                },
                {
                    "id": "CtrColRight",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-2 p-1 text-end"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "EditIcon",
                            "SysObject": this.EditIconButton,
                            "JSONAttributes": {
                                "Style": "btn align-text-top text-center",
                                "DOMValue": '<i class="fa-solid fa-pen-to-square text-primary-emphasis bg-primary bg-opacity-25 p-2 border border-5 border-primary-subtle rounded rounded-circle"></i>'
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "RowSeparator",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "DOMType": "hr",
                "Style": "example-item-container1-hrcolor m-2"
            }
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "addItem"
//------------------------------------------------------------------------------

userObjExampleEditableItemContainer.prototype.addItem = function(Data)
{
    console.debug('::userObjExampleEditableItemContainer addItem() Data:%o', Data);

    //- convert to key/value
    const ItemData = sysConvertData2KeyValue(Data);

    //- reset child objects
    this.ChildObjects.length = 0;

    //- new row item
    let ItemObj = new userObjExampleEditableItem();
    ItemObj.ObjectID = this.ObjectID + '_' + this.RowItems.length;

    ItemObj.JSONConfig = {
        "Attributes": {
            "Style": "row m-0 p-0",
            "ImagePath": ItemData.ImagePath,
            "HeaderText": ItemData.HeaderText,
            "ContentText": ItemData.ContentText
        }
    };

    ItemObj.init();

    this.RowItems.push(ItemObj);

    let RowSeparatorObj = new sysObjDivUnique();
    RowSeparatorObj.ObjectID = ItemObj.ObjectID + "RowSeparator";
    RowSeparatorObj.JSONConfig = {
        "Attributes": {
            "DOMType": "hr",
            "Style": "example-item-container1-hrcolor m-2"
        }
    };
    RowSeparatorObj.init();

    this.RowItems.push(RowSeparatorObj);

    //- re-draw header
    this.renderHeader();

    //- re-draw items
    for (RowItem of this.RowItems)
    {
        this.addObject(RowItem);
    }

    //- update pagination
    this.PaginationObject.update();

    //- rerender
    this.rerenderObject();
}
