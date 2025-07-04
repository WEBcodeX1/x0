//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "DynRadioList"                                             -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjDynRadioListRow"
//------------------------------------------------------------------------------

function sysObjDynRadioListRow(ParentObject, CtxtMenu, ButtonRef, ButtonJSONAttr, SetRemoveCallback) {

    this.EventListeners      = new Object();                   //- Event Listeners
    this.ChildObjects        = new Array();                    //- Child Objects

    this.ParentObject        = ParentObject;                   //- Parent Object

    this.Index               = this.ParentObject.RowIndex;     //- Row Index
    this.CtxtMenuActive      = CtxtMenu;                       //- Active Context Menu

    this.ButtonRef           = ButtonRef;                      //- Button Object Ref
    this.ButtonJSONAttr      = ButtonJSONAttr;                 //- Button JSON Config
    this.SetRemoveCallback   = SetRemoveCallback;              //- Set Remove

    this.init();
}

sysObjDynRadioListRow.prototype = new sysBaseObject();
sysObjDynRadioListRow.prototype.removeBase = sysBaseObject.prototype.remove;


//------------------------------------------------------------------------------
//- METHOD "EventListenerRightClick"
//------------------------------------------------------------------------------

sysObjDynRadioListRow.prototype.EventListenerRightClick = function(Event)
{
    var ContextMenuItems = [
        {
            "ID": "Remove",
            "TextID": "TXT.CONTEXTMENU.METHOD.REMOVE",
            "IconStyle": "fa-solid fa-paste",
            "InternalFunction": "remove"
        }
    ];

    //- check for right click on mousedown
    if (Event.button == 2 && ContextMenuItems !== undefined) {

        var ContextMenu = new sysContextMenu();

        ContextMenu.ID             = 'CtMenu_' + this.ObjectID;
        ContextMenu.ItemConfig     = ContextMenuItems;
        ContextMenu.ScreenObject   = sysFactory.getScreenByID(sysFactory.CurrentScreenID);
        ContextMenu.ParentObject   = this;
        ContextMenu.pageX          = Event.pageX;
        ContextMenu.pageY          = Event.pageY;

        ContextMenu.init();
    }
}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjDynRadioListRow.prototype.init = function()
{
    this.DOMStyle = 'row';
    this.ObjectID = 'row-ctain' + this.ParentObject.ObjectID + this.Index;
    this.RadioGroupID = 'row-ctain' + this.ParentObject.ObjectID;

    this.addObjects(this.ButtonRef, this.ButtonJSONAttr);

    if (this.SetRemoveCallback !== undefined && this.SetRemoveCallback == true) {
        this.ButtonRef.setCallback(this, 'remove');
    }

    if (this.CtxtMenuActive == true) {
        var EventListenerObj = new Object();
        EventListenerObj['Type'] = 'mousedown';
        EventListenerObj['Element'] = this.EventListenerRightClick.bind(this);
        this.EventListeners['ContextMenuOpen'] = EventListenerObj;
    }
}


//------------------------------------------------------------------------------
//- METHOD "processCallback"
//------------------------------------------------------------------------------

sysObjDynRadioListRow.prototype.processCallback = function(Function, Arguments)
{
    if (Function == 'remove') { this.remove(); }
}


//------------------------------------------------------------------------------
//- METHOD "remove"
//------------------------------------------------------------------------------

sysObjDynRadioListRow.prototype.remove = function()
{
    this.removeBase();
}


//------------------------------------------------------------------------------
//- METHOD "addObjects"
//------------------------------------------------------------------------------

sysObjDynRadioListRow.prototype.addObjects = function(ButtonRef, ButtonJSONAttributes)
{
    ObjDefs = [
        {
            "id": "col-ctnt" + this.Index,
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col-md-11"
            },
            "ObjectDefs": [
                {
                    "id": "base-ctain" + this.Index,
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "input-group"
                    },
                    "ObjectDefs": [
                        {
                            "id": "radio-ctain" + this.Index,
                            "SysObject": new sysObjDiv(),
                            "JSONAttributes": {
                                "Style": "input-group-text",
                                "Value": '<input type="radio" id="' + this.ObjectID + '-root" name="' + this.RadioGroupID + '" class="form-check-input mt-0">'
                            }
                        },
                        {
                            "id": "input-text" + this.ObjectID + this.Index,
                            "SysObject": new sysFormfieldItemText(),
                            "JSONAttributes": {
                                "Style": "form-control",
                                "Type": "text"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "col-btn",
            "SysObject": ButtonRef,
            "JSONAttributes": ButtonJSONAttributes
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjDynRadioList"
//------------------------------------------------------------------------------

function sysObjDynRadioList() {

    this.EventListeners    = new Object();   //- Event Listeners
    this.ChildObjects      = new Array();    //- Child Objects

    this.RowItems          = new Array();    //- Row Objects Array
    this.RowIndex          = 0;              //- Row Index
}

//- inherit sysBaseObject
sysObjDynRadioList.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjDynRadioList.prototype.init = function() {

    this.DOMType = 'div';
    this.DOMStyle = 'container-fluid';

    if (this.JSONConfig !== undefined) {
        const Attributes = this.JSONConfig.Attributes;
    }

    var AddButton = new sysObjButtonCallback();
    AddButton.setCallback(this, 'add');

    AddButtonJSONAttributes = {
        "DOMType": "a",
        "Style": "col-md-1 btn btn-primary btn-sm",
        "IconStyle": "fa-solid fa-plus",
        "TextID": "TXT.BUTTON.ADD"
    };

    this.addObject(
        new sysObjDynRadioListRow(
            this,
            false,
            AddButton,
            AddButtonJSONAttributes
        )
    );
}


//------------------------------------------------------------------------------
//- METHOD "processCallback"
//------------------------------------------------------------------------------

sysObjDynRadioList.prototype.processCallback = function(Function, Arguments)
{
    if (Function == 'add') { this.add(); }
}


//------------------------------------------------------------------------------
//- METHOD "add"
//------------------------------------------------------------------------------

sysObjDynRadioList.prototype.add = function() {

    console.debug('sysObjDynRadioList ::add this.DOMParentID:%s', this.DOMParentID);

    this.RowIndex += 1;

    var RemoveButton = new sysObjButtonCallback();

    RemoveButtonJSONAttributes = {
        "DOMType": "a",
        "Style": "col-md-1 btn btn-primary btn-sm",
        "IconStyle": "fa-solid fa-minus",
        "TextID": "TXT.BUTTON.REMOVE"
    };

    this.addObject(
        new sysObjDynRadioListRow(
            this,
            true,
            RemoveButton,
            RemoveButtonJSONAttributes,
            true
        )
    );

    this.renderObject(this.DOMParentID);
}


//------------------------------------------------------------------------------
//- METHOD "remove"
//------------------------------------------------------------------------------

sysObjDynRadioList.prototype.remove = function(RowIndex) {
    alert(RowIndex);
    this.RowItems[RowIndex].remove();
}
