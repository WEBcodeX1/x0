//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "LanguageSwitch"                                            -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjLanguageSwitch"
//------------------------------------------------------------------------------

function sysObjLanguageSwitch()
{
    this.EventListeners = new Object();
    this.ChildObjects = new Array();
}

sysObjLanguageSwitch.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjLanguageSwitch.prototype.init = function()
{
    const Attributes = (this.JSONConfig !== undefined && this.JSONConfig.Attributes !== undefined)
        ? this.JSONConfig.Attributes : new Object();

    this.DOMStyle = (Attributes.Style !== undefined) ? Attributes.Style : 'input-group';

    this.PulldownObjectID = (Attributes.PulldownObjectID !== undefined) ? Attributes.PulldownObjectID : 'language';
    const ButtonObjectID = (Attributes.ButtonObjectID !== undefined) ? Attributes.ButtonObjectID : 'update';

    var PulldownAttributes = {
        "Type": "pulldown",
        "Style": (Attributes.PulldownStyle !== undefined) ? Attributes.PulldownStyle : 'form-select',
        "Options": this.getLanguageOptions(Attributes)
    };

    if (Attributes.PulldownAttributes !== undefined) {
        PulldownAttributes = Object.assign(PulldownAttributes, Attributes.PulldownAttributes);
    }

    if (PulldownAttributes.Type === undefined) {
        PulldownAttributes.Type = 'pulldown';
    }

    if (PulldownAttributes.Options === undefined) {
        PulldownAttributes.Options = this.getLanguageOptions(Attributes);
    }

    var UpdateButton = new sysObjButtonCallback();
    UpdateButton.setCallback(this, 'updateLanguage');

    var ButtonAttributes = {
        "DOMType": "button",
        "Style": (Attributes.ButtonStyle !== undefined) ? Attributes.ButtonStyle : 'btn btn-outline-secondary'
    };

    if (Attributes.ButtonTextID !== undefined) {
        ButtonAttributes.TextID = Attributes.ButtonTextID;
    }

    if (Attributes.ButtonAttributes !== undefined) {
        ButtonAttributes = Object.assign(ButtonAttributes, Attributes.ButtonAttributes);
    }

    if (ButtonAttributes.DOMType === undefined) {
        ButtonAttributes.DOMType = 'button';
    }

    if (ButtonAttributes.Style === undefined) {
        ButtonAttributes.Style = 'btn btn-outline-secondary';
    }

    if (ButtonAttributes.TextID === undefined && ButtonAttributes.DOMValue === undefined) {
        ButtonAttributes.DOMValue = 'Update';
    }

    var ObjDef = [
        {
            "id": this.PulldownObjectID,
            "SysObject": new sysFormfieldItemPulldown(),
            "JSONAttributes": PulldownAttributes
        },
        {
            "id": ButtonObjectID,
            "SysObject": UpdateButton,
            "JSONAttributes": ButtonAttributes
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDef, this);

    try {
        this.getObjectByID(this.PulldownObjectID).setValue(sysFactory.EnvUserLanguage);
    }
    catch(err) {
    }
}


//------------------------------------------------------------------------------
//- METHOD "getLanguageOptions"
//------------------------------------------------------------------------------

sysObjLanguageSwitch.prototype.getLanguageOptions = function(Attributes)
{
    var Options = new Array();

    if (Attributes.Options !== undefined) {
        for (const OptionItem of Attributes.Options) {
            Options.push(Object.assign({}, OptionItem));
        }
    }
    else {
        for (const Language of sysFactory.ObjText.Languages) {
            Options.push({
                "Display": Language.toUpperCase(),
                "Value": Language
            });
        }
    }

    var HasDefault = false;
    for (const OptionItem of Options) {
        if (OptionItem.Default === true) {
            HasDefault = true;
        }
    }

    if (HasDefault == false) {
        for (const OptionItem of Options) {
            if (OptionItem.Value == sysFactory.EnvUserLanguage) {
                OptionItem.Default = true;
            }
        }
    }

    return Options;
}


//------------------------------------------------------------------------------
//- METHOD "processCallback"
//------------------------------------------------------------------------------

sysObjLanguageSwitch.prototype.processCallback = function(Function, Arguments)
{
    if (Function == 'updateLanguage') {
        this.updateLanguage();
    }
}


//------------------------------------------------------------------------------
//- METHOD "updateLanguage"
//------------------------------------------------------------------------------

sysObjLanguageSwitch.prototype.updateLanguage = function()
{
    try {
        const PulldownObj = this.getObjectByID(this.PulldownObjectID);
        sysFactory.EnvUserLanguage = PulldownObj.getValue();
        sysFactory.updateAllSQLTextObjects();
    }
    catch(err) {
    }
}
