//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "AsyncNotifyIndicatorItem"                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Async Notify Indicator Item                                              -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjAsyncNotifyIndicatorItem"
//------------------------------------------------------------------------------

function sysObjAsyncNotifyIndicatorItem(NotifyConfig, ParentRef)
{
    this.EventListeners         = new Object();                                 //- Event Listeners
    this.ChildObjects           = new Array();                                  //- Child Objects

    this.ParentObj              = ParentRef;                                    //- Async Indicator Object Ref

    this.overrideDOMObjectID    = true;                                         //- Override setting recursive ObjectID
    this.ObjectID               = 'IndicatorItem' + this.ParentObj.zIndex;      //- ObjectID

    this.NotifyConfig           = NotifyConfig;                                 //- Notify Config
    this.ID                     = NotifyConfig.ID;                              //- Unique Name
    this.DisplaySuccess         = NotifyConfig.DisplaySuccess;                  //- Display on Success
    this.DisplayText            = '';                                           //- Display Text

    this.ProcessStatus          = 2;                                            //- Process Status 2: System Error

    this.ResultTimeout          = (NotifyConfig.ResultTimeout !== undefined) ? (NotifyConfig.ResultTimeout * 1000) : 10000;

    this.DOMStyle               = 'notifyindicator-item border border-primary rounded m-0 p-2 bg-primary bg-opacity-75 border-5 border-top-0 border-bottom-0 text-white';

    this.init();
}

sysObjAsyncNotifyIndicatorItem.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.init = function()
{
    //console.debug('::init IndicatorItem');

    this.DOMStyleZIndex = this.ParentObj.zIndex;
    this.setDOMElementZIndex();

    let BtnClose = new sysBaseObject();
    BtnClose.DOMType = 'button';
    BtnClose.DOMStyle = 'btn btn-close';
    BtnClose.DOMAttributes = new Object();
    BtnClose.DOMAttributes['type'] = 'button';
    BtnClose.DOMAttributes['title'] = sysFactory.getText('TXT.SYS.NOTIFYINDICATOR.TITLE_CLOSE');

    //- define instance wide accessible objects
    this.ResultObj = new sysObjSQLText();
    this.IconObj = new sysBaseObject();
    this.IconObj.DOMType = 'h1';
    this.IconObj.DOMStyle = 'fa fa-spinner fa-spin';

    //- setup recursive object structure
    var ObjDefs = [
        {
            "id": "CtrBase",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "m-2"
            },
            "ObjectDefs": [
                {
                    "id": "ButtonClose",
                    "SysObject": BtnClose
                }
            ]
        },
        {
            "id": "CtrRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row p-2"
            },
            "ObjectDefs": [
                {
                    "id": "CtrIcon",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col-md-1"
                    },
                    "ObjectDefs": [
                        {
                            "id": "StatusIcon",
                            "SysObject": this.IconObj
                        }
                    ]
                },
                {
                    "id": "CtrText",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col-md-11"
                    },
                    "ObjectDefs": [
                        {
                            "id": "ResultText",
                            "SysObject": this.ResultObj,
                            "JSONAttributes": {
                                "DOMType": "h1",
                                "TextID": "TXT.SYS.NOTIFYINDICATOR.PROCESS_DATA"
                            }
                        }
                    ]
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);

    //- "connect" to parent object
    this.ParentObj.addObject(this);
    this.renderObject(this.ParentObj.DOMObjectID);

    //- setup close event handler
    this.DOMaddEventListener('mousedown', this.close.bind(this));

    //- on timeout, auto update status
    setTimeout(this.callbackTimeout, this.ResultTimeout, this);
}


//------------------------------------------------------------------------------
//- METHOD "setProcessStatus"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.setProcessStatus = function(Status)
{
    this.ProcessStatus = Status;
}


//------------------------------------------------------------------------------
//- METHOD "setDisplayText"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.setDisplayText = function(TextData)
{
    this.DisplayText = TextData;
}


//------------------------------------------------------------------------------
//- METHOD "callbackTimeout"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.callbackTimeout = function(ItemRef)
{
    ItemRef.updateDisplay();
}


//------------------------------------------------------------------------------
//- METHOD "updateDisplay"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.updateDisplay = function()
{
    this.updateDisplayText();
    this.updateProcessStatus();
}


//------------------------------------------------------------------------------
//- METHOD "processResult"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.processResult = function(Status)
{
    switch (Status) {
        case 'SUCCESS':
            this.setProcessStatus(0);
            break;
        case 'ERROR':
            this.setProcessStatus(1);
            break;
        default:
            this.setProcessStatus(2);
    }

    this.setDisplayText(UpdateDisplayText);
    this.updateDisplay();

    //- on success, fire events
    if (Status == 'SUCCESS') {
        if (this.NotifyConfig.OnSuccess !== undefined && this.NotifyConfig.OnSuccess.FireEvents !== undefined) {
            console.debug('::NotifyIndicator FireEvents:%o', this.NotifyConfig.OnSuccess.FireEvents);
            sysFactory.Reactor.fireEvents(
                this.NotifyConfig.OnSuccess.FireEvents
            );
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "updateProcessStatus"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.updateProcessStatus = function()
{
    //- remove base styles
    this.removeDOMElementStyle('bg-primary');
    this.removeDOMElementStyle('border-primary');

    //- add case relevant styles
    if (this.ProcessStatus == 0)  {
        this.addDOMElementStyle('bg-success border-success');
        this.IconObj.DOMStyle = 'fa fa-check';
        this.IconObj.setDOMElementStyle();
    }
    if (this.ProcessStatus == 1)  {
        this.addDOMElementStyle('bg-warning border-warning');
        this.IconObj.DOMStyle = 'fa fa-exclamation';
        this.IconObj.setDOMElementStyle();
    }
    if (this.ProcessStatus == 2)  {
        this.addDOMElementStyle('bg-danger border-danger');
        this.IconObj.DOMStyle = 'fa fa-bug';
        this.IconObj.setDOMElementStyle();    
    }
}


//------------------------------------------------------------------------------
//- METHOD "updateDisplayText"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.updateDisplayText = function()
{
    switch (this.ProcessStatus) {
        case 0:
            this.DisplayText = sysFactory.getText('TXT.SYS.NOTIFYINDICATOR.SUCCESS') + ' (' + this.DisplaySuccess + ')';
            break;
        case 1:
            this.DisplayText = sysFactory.getText('TXT.SYS.NOTIFYINDICATOR.ERROR') + ' "' + this.ID + '"';
            break;
        case 2:
            this.DisplayText = sysFactory.getText('TXT.SYS.NOTIFYINDICATOR.SYSTEMERROR');
    }

    this.ResultObj.DOMValue = this.DisplayText;
    this.ResultObj.setDOMElementValue();
}


//------------------------------------------------------------------------------
//- METHOD "close"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.close = function()
{
    this.removeParent();
    this.ParentObj.zIndex -= 1;
}
