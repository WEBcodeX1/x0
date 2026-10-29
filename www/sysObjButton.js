//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Button"                                                   -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjButton"
//------------------------------------------------------------------------------

function sysObjButton()
{
    this.ObjectType             = 'Button';                         //- System Object Type
    this.overrideDOMObjectID    = true;                             //- Override recursive ObjectID

    this.DOMType                = 'button'                          //- DOM Type
    this.DOMAttributes          = new Object();                     //- DOM Attributes

    this.PostRequestData        = new sysRequestDataHandler();      //- POST Request Data Handler

    this.CallURL                = null;                             //- Request URL
    this.CallService            = false;                            //- Call Service Flag (true || false)

    this.FormValidate           = false;                            //- Form Validation Flag (true || false)

    this.ValidateResultError    = true;                             //- Validation Result (true || false)

    this.EventListeners         = new Object();                     //- Event Listerners Object
    this.ChildObjects           = new Array();                      //- Child Objects Array
}

//- inherit sysBaseObject
sysObjButton.prototype = new sysBaseObject();

//- inherit methods
sysObjButton.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjButton.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;
    let SQLTextDisabled = false;

    if (Attributes.DOMType !== undefined) {
        this.DOMType = Attributes.DOMType;
    }

    if (Attributes.DOMValue !== undefined) {
        this.DOMValue = Attributes.DOMValue;
        SQLTextDisabled = true;
    }

    if (Attributes.Style !== undefined) {
        this.DOMStyle = Attributes.Style;
    }

    if (Attributes.FormButton !== undefined) {
        this.DOMType = 'input';
        this.DOMAttributes['type'] = 'button';
        if (Attributes.TextID !== undefined) {
            this.DOMAttributes['value'] = sysFactory.getText(Attributes.TextID);
        }
        SQLTextDisabled = true;
    }

    if (Attributes.Disabled === true) {
        this.disable();
    }

    this.addEventListenerClick();

    console.debug('Button ConfigAttributes TextID:%s', Attributes.TextID);

    if (SQLTextDisabled === false) {

        var SQLTextObj = new sysObjSQLText();

        SQLTextObj.ObjectID = this.ObjectID + 'SQLText';
        SQLTextObj.ObjectType = 'SQLText';
        SQLTextObj.TextID = Attributes.TextID;

        if (Attributes.IconStyle !== undefined) {
            SQLTextObj.JSONConfig = {
                "Attributes": { "IconStyle": Attributes.IconStyle }
            };
        }

        if (Attributes.IconStylePost !== undefined) {
            SQLTextObj.JSONConfig = {
                "Attributes": { "IconStylePost": Attributes.IconStylePost }
            };
        }

        SQLTextObj.init();
        this.addObject(SQLTextObj);
    }

    //console.debug('Button SQLText Object:%o', SQLTextObj);
}


//------------------------------------------------------------------------------
//- METHOD "enable"
//------------------------------------------------------------------------------

sysObjButton.prototype.enable = function()
{
    console.debug('Button enabling.');
    const Attributes = this.JSONConfig.Attributes;
    this.DOMStyle = Attributes.Style;
    this.setDOMElementStyle();
    this.Disabled = false;
}


//------------------------------------------------------------------------------
//- METHOD "disable"
//------------------------------------------------------------------------------

sysObjButton.prototype.disable = function()
{
    console.debug('Button disabling.');
    const Attributes = this.JSONConfig.Attributes;
    this.DOMStyle = Attributes.Style + ' disabled';
    this.setDOMElementStyle();
    this.Disabled = true;
}


//------------------------------------------------------------------------------
//- METHOD "addEventListenerClick"
//------------------------------------------------------------------------------

sysObjButton.prototype.addEventListenerClick = function()
{
    var EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown';
    EventListenerObj['Element'] = this.EventListenerClick.bind(this);

    this.EventListeners["ButtonClick"] = EventListenerObj;
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysObjButton.prototype.EventListenerClick = function(Event)
{
    console.debug('::EventListenerClick Button clicked.');

    const Attributes = this.JSONConfig.Attributes;

    if (this.Disabled != true) {

        console.debug('::EventListenerClick Button not disabled.');

        this.CallURL = Attributes.OnClick;

        this.PostRequestData.reset();

        this.ValidateResultError = true;

        this.validateForm();

        console.debug('::EventListenerClick Validate result:%s', this.ValidateResultError);

        if (this.ValidateResultError == false) {
            this.processActions();
            this.processSourceObjects();
            this.callService();
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "callService"
//------------------------------------------------------------------------------

sysObjButton.prototype.callService = function()
{
    if (this.CallURL !== undefined && this.CallURL != null) {
        const Attributes = this.JSONConfig.Attributes;
        var RequestMethod = (Attributes.RequestMethod != undefined && Attributes.RequestMethod == 'GET') ? 'GET': 'POST';
        this.addNotifyHandler();
        RPC = new sysCallXMLRPC(this.CallURL);
        RPC.setRequestType(RequestMethod);
        RPC.Request(this);
    }
}


//------------------------------------------------------------------------------
//- METHOD "addNotifyHandler"
//------------------------------------------------------------------------------

sysObjButton.prototype.addNotifyHandler = function()
{
    try {
        var NotifyAttributes = this.JSONConfig.Attributes.Notify;

        sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(
            NotifyAttributes
        );
    }
    catch(err) {
        console.debug('::addNotifyHandler err:%s', err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "validateForm"
//------------------------------------------------------------------------------

sysObjButton.prototype.validateForm = function()
{
    const Attributes = this.JSONConfig.Attributes;

    var ValidateFormlistObjects = new Array();

    if (Attributes.Validate !== undefined) {

        if (Attributes.Validate.FormlistsAll !== undefined) {
            const Formfieldlists = this.ScreenObject.HierarchyRootObject.getObjectsByType('FormfieldList');
            for (Key in Formfieldlists) {
                ValidateFormlistObjects = ValidateFormlists.concat(
                    ValidateFormlistObjects,
                    Formfieldlists[Key]
                );
            }
        }

        if (Attributes.Validate.Formlists !== undefined) {
            for (const FormlistID of Attributes.Validate.Formlists) {
                ValidateFormlistObjects.push(sysFactory.getObjectByID(FormlistID));
            }
        }

        console.debug('::validate FormlistObjects:%o', ValidateFormlistObjects);

        for (const FormlistObj of ValidateFormlistObjects) {
            const Result = FormlistObj.validate();
            if (Result == false) {
                this.PostRequestData.merge(FormlistObj.RuntimeGetDataFunc());
            }
            else {
                this.ValidateResultError = false;
            }
        }

        // ----------------------------------------------------------------
        // - Validte Objects
        // ----------------------------------------------------------------

        const ValidateObjects = Attributes.Validate.Objects;

        if (ValidateObjects !== undefined) {
            console.debug('ValidateObjects:%o', ValidateObjects);
            for (GroupKey in ValidateObjects) {

                const GroupConf = ValidateObjects[GroupKey];
                const GroupFunction = GroupConf.FunctionRef;
                const ErrorObj = sysFactory.getObjectByID(GroupConf.ErrorContainer);

                if (ErrorObj !== undefined) {

                    ErrorObj.reset();

                    var Objects = new Array();
                    for (const ObjectID of GroupConf.ObjectIDs) {
                        Objects.push(sysFactory.getObjectByID(ObjectID));
                    }

                    const Result = sysFactory.ObjValidate.validateGroup(
                        GroupFunction,
                        Objects
                    );

                    if (Result['Error'] !== undefined && Result['Error'] == false) {
                        ErrorDisplayText = Result['Message'];
                        this.ValidateResultError = false;
                    }
                }
            }
        }

        // ----------------------------------------------------------------
        // - Post Validate Steps
        // ----------------------------------------------------------------

        var IdObj = Object();
        IdObj['BackendServiceID'] = Attributes.ServiceID;
        this.PostRequestData['ServiceData'] = IdObj;

        console.debug('::validate Result:%s PostRequestData:%o', this.ValidateResultError, this.PostRequestData);

        if (this.ValidateResultError == false) {

            if (Attributes.Validate.POSTRequestDataTransform !== undefined) {
                this.PostRequestData.transform(Attributes.POSTRequestDataTransform);
            }

            if (Attributes.Validate.POSTRequestDataRemovePrefix !== undefined) {
                this.PostRequestData.removePrefix(Attributes.POSTRequestDataRemovePrefix);
            }

            if (Attributes.Validate.ResetValidateOnSuccess == true) {
                for (ObjKey in FormListObjs) {
                    var FormListConfigObj = FormListObjs[ObjKey];
                    FormListConfigObj.clearStyle();
                }
            }
        }
    }
    else {
        this.ValidateResultError = false;
    }
}


//------------------------------------------------------------------------------
//- METHOD "processActions"
//------------------------------------------------------------------------------

sysObjButton.prototype.processActions = function()
{
    const Attributes = this.JSONConfig.Attributes;
    console.debug('::processActions Attributes:%o', Attributes);

    //- delegate action execution
    ActionProcessor.executeAction(Attributes);

    //- fire events
    if (Attributes.FireEvents !== undefined) {
        sysFactory.Reactor.fireEvents(Attributes.FireEvents);
    }
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysObjButton.prototype.callbackXMLRPCAsync = function()
{
    const MsgHandler = sysFactory.sysGlobalAsyncNotifyHandler;

    var NotifyStatus = 'ERROR';

    console.debug('Error result:%o', this.XMLRPCResultData);

    //- check backend error
    if (this.XMLRPCResultData.ErrorCode === undefined && this.XMLRPCResultData.error === undefined)
    {
        const ConfigAttributes = this.JSONConfig.Attributes;

        //- process on-result actions
        ActionProcessor.executeActions(ConfigAttributes.OnResult);

        //- set notify status
        NotifyStatus = 'SUCCESS';
    }

    //- process notify status
    try {
        const IndicatorID = this.JSONConfig.Attributes.Notify.ID;
        if (IndicatorID !== undefined) {
            var Message = {
                'msg-type': 'sys-indicator',
                'notify-id': IndicatorID,
                'notify-status': NotifyStatus
            };
            MsgHandler.processMsg(Message);
        }
    }
    catch (err) {
        console.log('err:%s', err);
    }
}
