//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "SystemSettingsContainer"                                  -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjSystemSettingsContainerItem"
//------------------------------------------------------------------------------

function sysObjSystemSettingsContainerItem(ParentID, ItemIndex, Attributes, GridEnable)
{
    this.ObjectType             = 'SystemSettingsContainerItem';    //- System Object Type
    this.overrideDOMObjectID    = true;                             //- Override setting recursive ObjectID

    this.ObjectID               = ParentID + ItemIndex;             //- ObjectID

    this.SettingAttributes      = Attributes;                       //- Setting Attributes
    this.ItemIndex              = ItemIndex;                        //- Item Numeric Index
    this.GridMode               = GridEnable;                       //- Grid Mode enabled | disabled

    this.ChildObjects           = new Array();                      //- Child Objects

    this.DOMStyle               = 'row border border-start-0 border-top-0 border-end-0 m-1 p-3';

}

sysObjSystemSettingsContainerItem.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjSystemSettingsContainerItem.prototype.init = function()
{
    let ResetButton = new sysObjButtonCallback();
    ResetButton.overrideDOMObjectID = true;
    ResetButton.setCallback(this, 'getSettingValue');

    let SaveButton = new sysObjButtonCallback();
    SaveButton.overrideDOMObjectID = true;
    SaveButton.setCallback(this, 'setSettingValue');

    const SettingObjectAttributes = this.SettingAttributes.SettingsObject;

    let ObjDefs = [
        {
            "id": "CtrDescription",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-3"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "Description",
                    "SysObject": new sysObjSQLText(),
                    "JSONAttributes": {
                        "TextID": this.SettingAttributes.TextID,
                        "Style": this.SettingAttributes.Style,
                        "IconStyle": this.SettingAttributes.IconStyle
                    }
                }
            ]
        },
        {
            "id": "CtrSettingObject",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-6"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "SettingObj",
                    "SysObject": new sysFactory.SetupClasses[SettingObjectAttributes.ObjectType](),
                    "JSONAttributes": SettingObjectAttributes.Attributes
                }
            ]
        },
        {
            "id": "CtrButtons",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-3"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "BtReset",
                    "SysObject": ResetButton,
                    "JSONAttributes": {
                        "Style": "btn btn-outline-secondary w-50",
                        "IconStyle": "fa-solid fa-rotate-left",
                        "TextID": "TXT.SYS.BUTTON.SYSSETTING.RESET"
                    }
                },
                {
                    "id": this.ObjectID + "BtSave",
                    "SysObject": SaveButton,
                    "JSONAttributes": {
                        "Style": "btn btn-outline-secondary w-50",
                        "IconStyle": "fa-solid fa-floppy-disk",
                        "TextID": "TXT.SYS.BUTTON.SYSSETTING.SAVE"
                    }
                }
            ]
        }
    ];

    if (this.GridMode == true) {
        ObjDefs[0]['JSONAttributes'] = {};
        ObjDefs[1]['JSONAttributes'] = {};
        ObjDefs[2]['JSONAttributes'] = {};
    }

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "processCallback"
//------------------------------------------------------------------------------

sysObjSystemSettingsContainerItem.prototype.processCallback = function(FunctionID, Arguments)
{
    const SettingObj = this.getObjectByID(this.ObjectID + "SettingObj");

    if (FunctionID == 'getSettingValue')
    {
        SettingObj.rerenderObject();
    }
    else if (FunctionID == 'setSettingValue')
    {
        const NotifyID = "SaveSystemSetting_" + this.ItemIndex;
        const NotifyIndicator = sysFactory.GlobalAsyncNotifyIndicator;

        NotifyIndicator.addMsgItem(
            {
                "ID": NotifyID,
                "DisplaySuccess": sysFactory.getText('TXT.SYS.NOTIFYINDICATOR.SYSSETTING_SAVE_SUCCESS'),
                "ResultTimeout": 3
            }
        );

        let NotifyStatus = -1;

        try {
            const GetData = SettingObj.RuntimeGetDataFunc();
            SettingObj.RuntimeSetDataFunc(GetData);
            NotifyStatus = 0;
        }
        catch {
            NotifyStatus = 1;
        }

        NotifyIndicator.getMsgItemByName(NotifyID).setProcessStatus(NotifyStatus);
    }
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjSystemSettingsContainer"
//------------------------------------------------------------------------------

function sysObjSystemSettingsContainer()
{
    this.ObjectType             = "SystemSettingsContainer";        //- System Object Type
    this.overrideDOMObjectID    = true;                             //- Override setting recursive ObjectID

    this.SettingItems           = new Array();                      //- Setting Item Instances

    this.EventListeners         = new Object();                     //- Event Listeners
    this.ChildObjects           = new Array();                      //- Child Objects
}

sysObjSystemSettingsContainer.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjSystemSettingsContainer.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    let SettingIndex = 0;
    for (const SettingAttributes of Attributes.Settings)
    {
        const SettingItem = new sysObjSystemSettingsContainerItem(
            this.ObjectID, SettingIndex, SettingAttributes
        )
        SettingItem.init();
        this.SettingItems.push(SettingItem);
        this.addObject(SettingItem);

        ++SettingIndex;
    }
}
