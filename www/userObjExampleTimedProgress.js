//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- USER SYSTEM OBJECT "TimedProgress"                                             -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "userObjTimedProgress"
//------------------------------------------------------------------------------

function userObjTimedProgress()
{
    this.ObjectType             = 'ExampleTimedProgress';                               //- System Object Type

    this.DOMStyle               = 'row m-0 p-0 align-items-center border border-top-0'  //- Default Bootstrap "row" DOMStyle

    this.ChildObjects           = new Array();                                          //- Child Objects
}

//- inherit sysObjDivUnique
userObjTimedProgress.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

userObjTimedProgress.prototype.init = function()
{
    //- define start progress button
    let ButtonStart = new sysObjButtonCallback();
    ButtonStart.ObjectID = this.ObjectID + 'BtnStartUpdate';
    ButtonStart.overrideDOMObjectID = true;
    ButtonStart.setCallback(this);

    //- progress bar object
    this.ProgressBarObj = new sysObjProgressBar()

    //- setup recursive object structure
    let ObjDefs = [
        {
            "id": "CtrColInterval",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-3 p-1"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "LabelInterval",
                    "SysObject": new sysFormfieldItemLabel(),
                    "JSONAttributes": {
                        "Style": "p-1 w-100 text-primary-emphasis",
                        "IconStyle": "fa-solid fa-stopwatch",
                        "TextID": "TXT.EXAMPLE.TIMED_PROGRESS.INTERVAL"
                    }
                },
                {
                    "id": this.ObjectID + "FormInterval",
                    "SysObject": new sysFormfieldItemText(),
                    "JSONAttributes": {
                        "Style": "form-control m-1 p-2 w-100 text-primary-emphasis",
                        "Placeholder": "100",
                        "Number": true,
                        "Min": 100,
                        "Max": 5000
                    }
                }
            ]
        },
        {
            "id": "CtrColAddValue",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-3 p-1"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "LabelAddValue",
                    "SysObject": new sysFormfieldItemLabel(),
                    "JSONAttributes": {
                        "Style": "p-1 w-100 text-primary-emphasis",
                        "IconStyle": "fa-solid fa-plus",
                        "TextID": "TXT.EXAMPLE.TIMED_PROGRESS.ADD_VALUE"
                    }
                },
                {
                    "id": this.ObjectID + "FormAddValue",
                    "SysObject": new sysFormfieldItemText(),
                    "JSONAttributes": {
                        "Style": "form-control m-1 p-2 w-100 text-primary-emphasis",
                        "Placeholder": "1",
                        "Number": true,
                        "Min": 1,
                        "Max": 10

                    }
                }
            ]
        },
        {
            "id": "CtrColBtnUpdate",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-1 p-2"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "BtnUpdate",
                    "SysObject": ButtonStart,
                    "JSONAttributes": {
                        "Style": "btn btn-primary w-100",
                        "IconStyle": "fa-solid fa-arrow-right",
                        "TextID": "TXT.EXAMPLE.TIMED_PROGRESS.START_UPDATE"
                    }
                }
            ]
        },
        {
            "id": "CtrColProgressBar",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-5 p-1 pe-2"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "ProgressBar",
                    "SysObject": this.ProgressBarObj,
                    "JSONAttributes": {
                        "Height": "60px"
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

userObjTimedProgress.prototype.processCallback = function()
{
    this.ProgressValue = 0;
    const IntervalObjID = this.ObjectID + 'FormInterval';
    const Interval = Number(
        sysFactory.getObjectByID(IntervalObjID).RuntimeGetDataFunc()
    );
    this.ProgressInterval = Interval;
    setTimeout(this.updateProgress, Interval, this);
}


//------------------------------------------------------------------------------
//- METHOD "updateProgress"
//------------------------------------------------------------------------------

userObjTimedProgress.prototype.updateProgress = function(RefObject)
{
    if (RefObject.ProgressValue < 100) {
        const AddValueObjID = RefObject.ObjectID + 'FormAddValue';
        const AddValue = Number(
            sysFactory.getObjectByID(AddValueObjID).RuntimeGetDataFunc()
        );
        RefObject.ProgressValue += AddValue;
        RefObject.ProgressBarObj.RuntimeSetDataFunc(RefObject.ProgressValue);
        setTimeout(RefObject.updateProgress, RefObject.ProgressInterval, RefObject);
    }
}
