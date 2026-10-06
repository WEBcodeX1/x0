//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "LanguageSwitch"                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjLanguageSwitch"
//------------------------------------------------------------------------------

function sysObjLanguageSwitch()
{
    this.overrideDOMObjectID    = true;             //- Override setting recursive ObjectID
    this.EventListeners         = new Object();     //- Event Listeners
    this.ChildObjects           = new Array();      //- Child Objects
}

sysObjLanguageSwitch.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjLanguageSwitch.prototype.init = function()
{
    console.debug('sysObjLanguageSwitch init().');

    const Attributes = this.JSONConfig.Attributes;

    const PulldownStyle = (Attributes.PulldownStyle !== undefined) ? Attributes.PulldownStyle : 'form-select w-100';
    const ButtonStyle = (Attributes.ButtonStyle !== undefined) ? Attributes.ButtonStyle : 'btn btn-outline-primary w-100'

    this.DOMStyle = (Attributes.Style !== undefined) ? Attributes.Style : 'row';

    this.PulldownObjectID = this.ObjectID + 'Pulldown';
    this.ButtonObjectID = this.ObjectID + 'Button';

    let UpdateButton = new sysObjButtonCallback();
    UpdateButton.ObjectID = this.ButtonObjectID;
    UpdateButton.overrideDOMObjectID = true;
    UpdateButton.setCallback(this);

    const ObjDefs = [
        {
            "id": "CtrPulldown",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-10"
            },
            "ObjectDefs": [
                {
                    "id": this.PulldownObjectID,
                    "SysObject": new sysFormfieldItemPulldown(),
                    "JSONAttributes": {
                        "Style": PulldownStyle,
                        "Options": this.getLanguageOptions()
                    }
                }
            ]
        },
        {
            "id": "CtrButton",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-2"
            },
            "ObjectDefs": [
                {
                    "id": this.ButtonObjectID,
                    "SysObject": UpdateButton,
                    "JSONAttributes": {
                        "DOMType": "button",
                        "Style": ButtonStyle,
                        "IconStyle": "fa-solid fa-play",
                        "TextID": "TXT.SYS.LANGUAGE-SWITCH-BUTTON"
                    }
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "getLanguageOptions"
//------------------------------------------------------------------------------

sysObjLanguageSwitch.prototype.getLanguageOptions = function()
{
    let Options = new Array();

    const TextObj = sysFactory.ObjText;
    const DisplayLanguages = TextObj.PDLanguagesDisplay;

    for (const Language of TextObj.Languages)
    {
        const DisplayValue = DisplayLanguages[Language][sysFactory.EnvUserLanguage];

        let PDOption = {
            "Display": DisplayValue,
            "Value": Language
        };

        if (sysFactory.EnvUserLanguage == Language) {
            PDOption['Default'] = true;
        }

        Options.push(PDOption);
    }

    console.debug('LanguageSwitch: Options:%o', Options);
    return Options;
}


//------------------------------------------------------------------------------
//- METHOD "processCallback"
//------------------------------------------------------------------------------

sysObjLanguageSwitch.prototype.processCallback = function(FunctionID, Arguments)
{
    const PulldownObj = this.getObjectByID(this.PulldownObjectID);

    //- update all system objects with SQLText type
    sysFactory.EnvUserLanguage = PulldownObj.getValue();
    sysFactory.updateLanguageObjectsGlobal();

    //- re-render (updated) language switch pulldown
    PulldownObj.JSONConfig.Attributes.Options = this.getLanguageOptions();
    PulldownObj.init();
    PulldownObj.rerenderObject();
}
