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

function userObjExampleEditableItem(ContainerObjRef, ItemIndex)
{
    this.ObjectType             = 'ExampleEditableItem';                    //- System Object Type

    this.DOMStyle               = 'row m-0 pt-3 p-3 border border-top-0'    //- Default Bootstrap "row" DOMStyle

    this.EditMode               = false;                                    //- Switchable Edit Mode
    this.ChangeOrderMode        = false;                                    //- Switchable Change Order Mode

    this.ContainerObjRef        = ContainerObjRef;                          //- Container Object Reference
    this.ItemIndex              = ItemIndex;                                //- Item Position Index

    this.EventListeners         = new Object();                             //- Event Listeners
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

    if (Attributes.Editable !== undefined && Attributes.Editable == true) {
        this.EditMode = true;
    };

    if (Attributes.OrderChangeable !== undefined && Attributes.OrderChangeable == true) {
        this.ChangeOrderMode = true;
    };

    //- set default values
    this.ImagePath = (Attributes.ImagePath === undefined) ? '/image/icon-select-image.png' : Attributes.ImagePath;
    this.HeaderText = (Attributes.HeaderText === undefined) ? '' : Attributes.HeaderText;
    this.ContentText = (Attributes.ContentText === undefined) ? '' : Attributes.ContentText;

    //- setup image select button
    this.SelectImageButton = new sysObjButtonCallback();
    this.SelectImageButton.overrideDOMObjectID = true;
    this.SelectImageButton.setCallback(this, 'selectImage');

    //- setup move up button
    this.MoveUpButton = new sysObjButtonCallback();
    this.MoveUpButton.overrideDOMObjectID = true;
    this.MoveUpButton.setCallback(this, 'moveUp');

    //- setup move down button
    this.MoveDownButton = new sysObjButtonCallback();
    this.MoveDownButton.overrideDOMObjectID = true;
    this.MoveDownButton.setCallback(this, 'moveDown');

    //- setup dynamic content
    this.setupDynamicContent();

    //- setup context menu
    let EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown';
    EventListenerObj['Element'] = this.EventListenerRightClick.bind(this);
    this.EventListeners['ContextMenuOpen'] = EventListenerObj;
}


//------------------------------------------------------------------------------
//- METHOD "setupDynamicContent"
//------------------------------------------------------------------------------

userObjExampleEditableItem.prototype.setupDynamicContent = function()
{
    let UploadIconStylePS = 'ps-2';
    let DisplayIconStylePS = 'ps-0';
    let DescriptionStyleMD = 'col-md-10';

    if (this.EditMode == true && this.ChangeOrderMode == true) {
        UploadIconStylePS = 'ps-3';
        DescriptionStyleMD = 'col-md-8';
    }
    else if (this.EditMode == false && this.ChangeOrderMode == false) {
        DescriptionStyleMD = 'col-md-11';
        DisplayIconStylePS = 'ps-2';
    }

    //- reset dynamic object references
    let ObjDefs = [];

    //- reference image object
    this.ImgageObj = new sysObjImage();

    const ColUploadIcon = {
        "id": "CtrColUploadIcon",
        "SysObject": new sysObjDiv(),
        "JSONAttributes": {
            "Style": "col col-md-1 p-3 pt-2 " + UploadIconStylePS
        },
        "ObjectDefs": [
            {
                "id": this.ObjectID + "UploadIcon",
                "SysObject": this.SelectImageButton,
                "JSONAttributes": {
                    "Style": "btn m-0 p-0 text-center",
                    "DOMValue": '<i class="fa-solid fa-upload text-primary-emphasis bg-primary bg-opacity-25 p-2 border border-5 border-primary-subtle rounded rounded-circle"></i>'
                }
            }
        ]
    };

    const ColSelectedIcon = {
        "id": "CtrColImage",
        "SysObject": new sysObjDiv(),
        "JSONAttributes": {
            "Style": "col col-md-1 p-3 pt-2 " + DisplayIconStylePS
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
    };

    const ColTextDisplay = {
        "id": "CtrColText",
        "SysObject": new sysObjDiv(),
        "JSONAttributes": {
            "Style": "col p-2 " + DescriptionStyleMD
        },
        "ObjectDefs": [
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
        ]
    };

    const ColTextEdit = {
        "id": "CtrColText",
        "SysObject": new sysObjDiv(),
        "JSONAttributes": {
            "Style": "col p-2 " + DescriptionStyleMD
        },
        "ObjectDefs": [
            {
                "id": this.ObjectID + "HeaderText",
                "SysObject": new sysFormfieldItemText(),
                "KeyID": "HeaderText",
                "JSONAttributes": {
                    "PlaceholderTextID": "TXT.EXAMPLE.EDITABLE_ITEM.PLACEHOLDER.HEADER",
                    "Style": "form-control mb-1 p-1 w-100 fw-bold",
                    "Value": this.HeaderText
                }
            },
            {
                "id": this.ObjectID + "ContentText",
                "SysObject": new sysFormfieldItemTextarea(),
                "KeyID": "ContentText",
                "JSONAttributes": {
                    "PlaceholderTextID": "TXT.EXAMPLE.EDITABLE_ITEM.PLACEHOLDER.CONTENT",
                    "Style": "form-control mb-1 p-1 w-100",
                    "Value": this.ContentText
                }
            }
        ]
    };

    const ColMove = {
        "id": "CtrColMove",
        "SysObject": new sysObjDiv(),
        "JSONAttributes": {
            "Style": "col col-md-2 p-3 text-center"
        },
        "ObjectDefs": [
            {
                "id": this.ObjectID + "MoveUpIcon",
                "SysObject": this.MoveUpButton,
                "JSONAttributes": {
                    "Style": "btn p-0 m-0",
                    "DOMValue": '<i class="fa-solid fa-caret-up text-primary-emphasis bg-primary bg-opacity-25 p-2 border border-4 border-primary-subtle rounded float-start"></i>'
                }
            },
            {
                "id": this.ObjectID + "MoveDownIcon",
                "SysObject": this.MoveDownButton,
                "JSONAttributes": {
                    "Style": "btn p-0 m-0",
                    "DOMValue": '<i class="fa-solid fa-caret-down text-primary-emphasis bg-primary bg-opacity-25 p-2 border border-4 border-primary-subtle rounded"></i>'
                }
            }
        ]
    };

    if (this.EditMode == true && this.ChangeOrderMode == false) {
        ObjDefs.push(ColUploadIcon);
        ObjDefs.push(ColSelectedIcon);
        ObjDefs.push(ColTextEdit);
    }
    else if (this.EditMode == true && this.ChangeOrderMode == true) {
        ObjDefs.push(ColUploadIcon);
        ObjDefs.push(ColSelectedIcon);
        ObjDefs.push(ColTextEdit);
        ObjDefs.push(ColMove);
    }
    else if (this.EditMode == false && this.ChangeOrderMode == false) {
        ObjDefs.push(ColSelectedIcon);
        ObjDefs.push(ColTextDisplay);
    }

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerRightClick"
//------------------------------------------------------------------------------

userObjExampleEditableItem.prototype.EventListenerRightClick = function(Event)
{
    const ContextMenuItems = [
        {
            "ID": "EnableEditMode",
            "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.EDIT_DATA",
            "IconStyle": "fa-solid fa-edit",
            "CallbackFunction": this.enableEditMode,
            "CallbackObjRef": this
        },
        {
            "ID": "RemoveItem",
            "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.REMOVE_DATA",
            "IconStyle": "fa-solid fa-trash",
            "CallbackFunction": this.remove,
            "CallbackObjRef": this
        },
        {
            "ID": "DisableEditMode",
            "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.SAVE_DATA",
            "IconStyle": "fa-solid fa-floppy-disk",
            "CallbackFunction": this.disableEditMode,
            "CallbackObjRef": this
        }
    ];

    //- check for right click on mousedown
    if (Event.button == 2 && ContextMenuItems !== undefined)
    {
        let ContextMenu             = new sysContextMenu();

        ContextMenu.ID              = 'CtMenu' + this.ObjectID;
        ContextMenu.ItemConfig      = ContextMenuItems;
        ContextMenu.ScreenObject    = this.ScreenObject;
        ContextMenu.ParentObject    = this;
        ContextMenu.pageX           = Event.pageX;
        ContextMenu.pageY           = Event.pageY;

        ContextMenu.init();
    }
}


//------------------------------------------------------------------------------
//- METHOD "remove"
//------------------------------------------------------------------------------

userObjExampleEditableItem.prototype.remove = function(ObjRef)
{
    const ContainerObj = ObjRef.ContainerObjRef;
    console.debug('::userObjExampleEditableItem remove() ContainerObj:%o', ContainerObj);
    ContainerObj.ChildObjects.length = 0;
    ContainerObj.RowItems.splice(ObjRef.ItemIndex, 1);
    ContainerObj.redrawList();
    ContainerObj.reindexItems();
}


//------------------------------------------------------------------------------
//- METHOD "enableEditMode"
//------------------------------------------------------------------------------

userObjExampleEditableItem.prototype.enableEditMode = function(ObjRef)
{
    ObjRef.EditMode = true;
    ObjRef.ChangeOrderMode = true;
    ObjRef.updateEditStatus();
}


//------------------------------------------------------------------------------
//- METHOD "disableEditMode"
//------------------------------------------------------------------------------

userObjExampleEditableItem.prototype.disableEditMode = function(ObjRef)
{
    const ResultData = ObjRef.getObjectData();
    const KeyValueData = sysConvertSysData2KeyValue(ResultData);
    console.debug('::userObjExampleEditableItem disableEditMode() Save Data:%o', KeyValueData);

    ObjRef.ImagePath = KeyValueData.ImagePath;
    ObjRef.HeaderText = KeyValueData.HeaderText;
    ObjRef.ContentText = KeyValueData.ContentText;

    ObjRef.EditMode = false;
    ObjRef.ChangeOrderMode = false;
    ObjRef.updateEditStatus();
}


//------------------------------------------------------------------------------
//- METHOD "updateEditStatus"
//------------------------------------------------------------------------------

userObjExampleEditableItem.prototype.updateEditStatus = function()
{
    this.ChildObjects = new Array();
    this.setupDynamicContent();
    this.rerenderObject();
}


//------------------------------------------------------------------------------
//- METHOD "ButtonCallback"
//------------------------------------------------------------------------------

userObjExampleEditableItem.prototype.ButtonCallback = function(FunctionID)
{
    if (FunctionID == 'selectImage')
    {
        sysFactory.OverlayObj.activateOverlay('ExamplesBasicOverlayImageSelector');
        const ImgSelectorObj = sysFactory.getObjectByID('ExamplesBasicOverlayImageList');
        ImgSelectorObj.setSrcObjectRef(this);
    }
    else if (FunctionID == 'moveUp')
    {
        this.moveItemUp();
    }
    else if (FunctionID == 'moveDown')
    {
        this.moveItemDown();
    }
}


//------------------------------------------------------------------------------
//- METHOD "moveItemUp"
//------------------------------------------------------------------------------

userObjExampleEditableItem.prototype.moveItemUp = function()
{
    if (this.ItemIndex > 0)
    {
        const CurrentIndex = this.ItemIndex;
        const SwapIndex = this.ItemIndex-1;
        const ContainerObj = this.ContainerObjRef;
        const RowItems = ContainerObj.RowItems;
        const TmpValue = RowItems[CurrentIndex];

        RowItems[CurrentIndex] = RowItems[SwapIndex];
        RowItems[SwapIndex] = TmpValue;

        ContainerObj.ChildObjects.length = 0;
        ContainerObj.redrawList();
        ContainerObj.reindexItems();
    }
}


//------------------------------------------------------------------------------
//- METHOD "moveItemDown"
//------------------------------------------------------------------------------

userObjExampleEditableItem.prototype.moveItemDown = function()
{
    if (this.ItemIndex < this.ContainerObjRef.RowItems.length-1)
    {
        const CurrentIndex = this.ItemIndex;
        const SwapIndex = this.ItemIndex+1;
        const ContainerObj = this.ContainerObjRef;
        const RowItems = ContainerObj.RowItems;

        const TmpValue = RowItems[CurrentIndex];
        RowItems[CurrentIndex] = RowItems[SwapIndex];
        RowItems[SwapIndex] = TmpValue;

        ContainerObj.ChildObjects.length = 0;
        ContainerObj.redrawList();
        ContainerObj.reindexItems();
    }
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

    this.RowCount               = 3;                                //- Row Count Default (Pagination Rows Per Page)

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
    const ItemData = sysConvertSysData2KeyValue(Data);

    //- reset child objects
    this.ChildObjects.length = 0;

    //- row index
    const RowIndex = this.RowItems.length;

    //- base container object
    let BaseContainerObj = new sysObjDivUnique()
    BaseContainerObj.ObjectID = 'BaseRowCtr' + this.ObjectID + '_' + RowIndex;
    BaseContainerObj.init();

    //- new item object
    let ItemObj = new userObjExampleEditableItem(this, RowIndex);
    ItemObj.ScreenObject = this.ScreenObject;
    BaseContainerObj.ItemRef = ItemObj;

    //- setup recursive object structure
    let ObjDefs = [
        {
            "id": "CtrItem" + this.ObjectID + '_' + RowIndex,
            "SysObject": new sysObjDivUnique(),
            "JSONAttributes": {
                "Style": ""
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + '_' + RowIndex,
                    "SysObject": ItemObj,
                    "JSONAttributes": {
                        "Style": "row m-0 p-0",
                        "ImagePath": ItemData.ImagePath,
                        "HeaderText": ItemData.HeaderText,
                        "ContentText": ItemData.ContentText
                    }
                }
            ]
        },
        {
            "id": "CtrRowSeparator" + this.ObjectID + '_' + RowIndex,
            "SysObject": new sysObjDivUnique(),
            "JSONAttributes": {
                "DOMType": "hr",
                "Style": "example-item-container1-hrcolor m-2"
            }
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, BaseContainerObj);

    //- push to navigation array
    this.RowItems.push(BaseContainerObj);

    //- redraw list
    this.redrawList();
}


//------------------------------------------------------------------------------
//- METHOD "redrawList"
//------------------------------------------------------------------------------

userObjExampleEditableItemContainer.prototype.redrawList = function()
{
    //- re-draw header
    this.renderHeader();

    //- re-draw items
    for (RowItem of this.RowItems)
    {
        this.addObject(RowItem);
        RowItem.processEventListener();
    }

    //- update pagination
    this.PaginationObject.update();

    //- rerender
    this.rerenderObject();
}


//------------------------------------------------------------------------------
//- METHOD "reindexItems"
//------------------------------------------------------------------------------

userObjExampleEditableItemContainer.prototype.reindexItems = function()
{
    let ReIndex = 0;
    for (RowItem of this.RowItems)
    {
        console.debug('::userObjExampleEditableItemContainer reindexItems() Old:%s New:%s', RowItem.ItemRef.ItemIndex, ReIndex);
        RowItem.ItemRef.ItemIndex = ReIndex;
        ReIndex++;
    }
}


//------------------------------------------------------------------------------
//- METHOD "ButtonCallback"
//------------------------------------------------------------------------------

userObjExampleEditableItemContainer.prototype.ButtonCallback = function()
{
    let EditFinished = false;
    if (this.EditMode == false) {

        //- re-draw items
        let RowIndex = this.RowItems.length-1;
        while (RowIndex >= 0)
        {
            const ItemID = this.ObjectID + '_' + RowIndex;
            const ItemObj = sysFactory.getObjectByID(ItemID);

            ItemObj.enableEditMode(ItemObj);

            RowIndex--;
        }
        this.EditMode = true;
        EditFinished = true;
    }

    if (this.EditMode == true && EditFinished == false) {

        //- re-draw items
        let RowIndex = this.RowItems.length-1;
        while (RowIndex >= 0)
        {
            const ItemID = this.ObjectID + '_' + RowIndex;
            const ItemObj = sysFactory.getObjectByID(ItemID);

            ItemObj.disableEditMode(ItemObj);

            RowIndex--;
        }
        this.EditMode = false;
    }
}
