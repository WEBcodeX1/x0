//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
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

function sysObjDynRadioListRow(ParentObject, CtxtMenu, ButtonRef, ButtonJSONAttr, SetRemoveCallback)
{
    this.ObjectType             = 'DynRadioListRow';              //- System Object Type
    this.overrideDOMObjectID    = true;                           //- Override setting recursive ObjectID

    this.ParentObject           = ParentObject;                   //- Parent Object

    this.Index                  = this.ParentObject.RowIndex;     //- Row Index
    this.CtxtMenuActive         = CtxtMenu;                       //- Active Context Menu

    this.ButtonRef              = ButtonRef;                      //- Button Object Ref
    this.ButtonJSONAttr         = ButtonJSONAttr;                 //- Button JSON Config
    this.SetRemoveCallback      = SetRemoveCallback;              //- Set Remove

    this.EventListeners         = new Object();                   //- Event Listeners
    this.ChildObjects           = new Array();                    //- Child Objects

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
            "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.REMOVE",
            "IconStyle": "fa-solid fa-trash-can",
            "InternalFunction": "remove"
        }
    ];

    //- check for right click on mousedown
    if (Event.button == 2 && ContextMenuItems !== undefined)
    {
        let ContextMenu = new sysContextMenu();

        ContextMenu.ID              = 'CtMenu_' + this.ObjectID;
        ContextMenu.ItemConfig      = ContextMenuItems;
        ContextMenu.ScreenObject    = sysFactory.getScreenByID(sysFactory.CurrentScreenID);
        ContextMenu.ParentObject    = this;
        ContextMenu.pageX           = Event.pageX;
        ContextMenu.pageY           = Event.pageY;

        ContextMenu.init();
    }
}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjDynRadioListRow.prototype.init = function()
{
    this.DOMStyle = 'row';
    this.ObjectID = 'CtrRow' + this.ParentObject.ObjectID + this.Index;
    this.RadioGroupID = 'RadioGrp' + this.ParentObject.ObjectID;

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
    let ObjDefs = [
        {
            "id": this.Index + "ColCtr",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col-md-11"
            },
            "ObjectDefs": [
                {
                    "id": this.Index + "BaseCtr",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "input-group"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.Index + "RadioCtr",
                            "SysObject": new sysObjDiv(),
                            "JSONAttributes": {
                                "Style": "input-group-text",
                                "Value": '<input type="radio" id="' + this.ObjectID + '-root" name="' + this.RadioGroupID + '" class="form-check-input mt-0">'
                            }
                        },
                        {
                            "id": this.ObjectID + this.Index + "InputText",
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
            "id": this.ObjectID + this.Index + "ColBtn",
            "SysObject": ButtonRef,
            "JSONAttributes": ButtonJSONAttributes
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjDynRadioList"
//------------------------------------------------------------------------------

function sysObjDynRadioList()
{
    this.ObjectType        = 'DynRadioList';    //- System Object Type

    this.EventListeners    = new Object();      //- Event Listeners
    this.ChildObjects      = new Array();       //- Child Objects

    this.RowItems          = new Array();       //- Row Objects Array
    this.RowIndex          = 0;                 //- Row Index
}

//- inherit sysBaseObject
sysObjDynRadioList.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjDynRadioList.prototype.init = function()
{
    this.DOMType = 'div';
    this.DOMStyle = 'container-fluid';

    const Attributes = this.JSONConfig.Attributes;

    let AddButton = new sysObjButtonCallback();
    AddButton.setCallback(this, 'add');

    const AddButtonTextID = (Attributes.ButtonTextDisabled === true) ? 'TXT.SYS.BUTTON.NO_TEXT' : 'TXT.SYS.BUTTON.ADD';

    AddButtonJSONAttributes = {
        "DOMType": "a",
        "Style": "col-md-1 btn btn-primary btn-sm",
        "IconStyle": "fa-solid fa-plus",
        "TextID": AddButtonTextID
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

sysObjDynRadioList.prototype.add = function()
{
    console.debug('sysObjDynRadioList ::add this.DOMParentID:%s', this.DOMParentID);

    const Attributes = this.JSONConfig.Attributes;

    this.RowIndex += 1;

    let RemoveButton = new sysObjButtonCallback();

    const RemoveButtonTextID = (Attributes.ButtonTextDisabled === true) ? 'TXT.SYS.BUTTON.NO_TEXT' : 'TXT.SYS.BUTTON.REMOVE';

    RemoveButtonJSONAttributes = {
        "DOMType": "a",
        "Style": "col-md-1 btn btn-primary btn-sm",
        "IconStyle": "fa-solid fa-minus",
        "TextID": RemoveButtonTextID
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

sysObjDynRadioList.prototype.remove = function(RowIndex)
{
    this.RowItems[RowIndex].remove();
}
