//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
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
    this.DOMType             = 'button'
    this.DOMAttributes       = new Object();

    this.EventListeners      = new Object();
    this.ChildObjects        = new Array();

    this.PostRequestData     = new sysRequestDataHandler();

    this.CallURL             = null;
    this.CallService         = false;

    this.FormValidate        = false;

    this.ValidateResultError = true;
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
    var SQLTextDisabled = false;

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

    if (SQLTextDisabled == false) {

        var SQLTextObj = new sysObjSQLText();

        SQLTextObj.ObjectID = 'SQLText';
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

        //console.debug('sysObjButton.EventListenerClick() JSONConfig:%o', this.JSONConfig);
        //console.debug('sysObjButton.EventListenerClick() ScreenObject:%o', this.ScreenObject.ScreenID);
        //console.debug('sysObjButton.EventListenerClick() ScreenObjects:%o', sysFactory.getObjectsByType(this.ScreenObject.ScreenID, 'FormfieldList'));

        this.PostRequestData.reset();

        this.ValidateResultError = true;

        this.validateForm();

        console.debug('::EventListenerClick Validate result:%s', this.ValidateResultError);

        if (this.ValidateResultError == false) {
            this.processSourceObjects();
            this.processActions();
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
        this.addNotifyHandler();
        RPC = new sysCallXMLRPC(this.CallURL);
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

    var Action;
    try {
        Action = Attributes.Action.toLowerCase();
    }
    catch(err) {
        Action = null;
    }

    console.debug('::processActions Attributes:%o Action:%s', Attributes, Action);

    if (Action != null) {

        var DstObject;
        try {
            DstObject = sysFactory.getObjectByID(Attributes.DstObjectID);
        }
        catch {
            DstObject = undefined;
        }

        if (Action == 'append') {
            const SrcObject = sysFactory.getObjectByID(Attributes.SrcDataObject);
            const DstObject = sysFactory.getObjectByID(Attributes.DstDataObject);
            DstObject.RuntimeAppendDataFunc(SrcObject.RuntimeGetDataFunc());
        }

        if (Action == 'enable') {
            DstObject.VisibleState = 'visible';
            DstObject.setDOMVisibleState();
        }

        if (Action == 'disable') {
            DstObject.VisibleState = 'hidden';
            DstObject.setDOMVisibleState();
        }

        if (Action == 'activate') {
            DstObject.setActivated();
        }

        if (Action == 'deactivate') {
            DstObject.setDeactivated();
        }

        console.debug('::EventListenerClick Config Attributes Action:%s', Action);

        if (Action == 'reset') {
            DstObject.reset();
        }

        if (Action == 'switchscreen') {
            const ScreenObject = sysFactory.getScreenByID(Attributes.DstScreenID);
            //console.debug(this.ParentRow.SetupData);
            this.DstScreenID = Attributes.DstScreenID;
        }

        if (this.DstScreenID !== undefined && Action !== undefined) {
            if (Attributes.ResetAll == true) {
                //console.debug('ButtonInternalDBG ResetAll:%s', Attributes.ResetAll);
                const ScreenObj = sysFactory.getScreenByID(this.DstScreenID);
                ScreenObj.HierarchyRootObject.processReset();
            }
            //this.setDstScreenProperties();
            sysFactory.switchScreen(this.DstScreenID);
        }

        if (Attributes.FireEvents !== undefined) {
            sysFactory.Reactor.fireEvents(Attributes.FireEvents);
        }

    }

    if (Attributes.CloseOverlay !== undefined && Attributes.CloseOverlay == true) {
        try {
            sysFactory.OverlayObj.EventListenerClick();
        }
        catch(err) {
        }
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

    //- check error
    if (this.XMLRPCResultData.ErrorCode === undefined && this.XMLRPCResultData.error === undefined) {

        const ConfigAttributes = this.JSONConfig.Attributes;
        const SwitchScreen = ConfigAttributes.SwitchScreen;
        const SwitchTabContainer = ConfigAttributes.SwitchTabContainer;
        const SwitchTabID = ConfigAttributes.SwitchTabID;

        /*
         * process on result actions
         * 
         * refactoring needed, make button, context menu and global logic generic
        */

        if (ConfigAttributes.OnResult !== undefined) {

            console.debug('::ButtonAfterRPC ConfigAttributes:%o', ConfigAttributes.OnResult);

            var ResultConfig = ConfigAttributes.OnResult;

            if (Array.isArray(ResultConfig) == false) {
                ResultConfig = [ResultConfig];
            }

            for (const Result of ResultConfig) {

                console.debug('::ButtonAfterRPC ConfigAttributes new:%o', ConfigAttributes.OnResult);

                const Action = ResultConfig.Action.toLowerCase();

                if (Action !== undefined) {

                    if (Action == 'enable') {
                        const DstObject = sysFactory.getObjectByID(Result.DstObjectID);
                        DstObject.VisibleState = 'visible';
                        DstObject.setDOMVisibleState();
                    }
                    if (Action == 'disable') {
                        const DstObject = sysFactory.getObjectByID(Result.DstObjectID);
                        DstObject.VisibleState = 'hidden';
                        DstObject.setDOMVisibleState();
                    }
                    if (Action == 'activate') {
                        const DstObject = sysFactory.getObjectByID(Result.DstObjectID);
                        DstObject.setActivated();
                    }
                    if (Action == 'deactivate') {
                        const DstObject = sysFactory.getObjectByID(Result.DstObjectID);
                        DstObject.setDeactivated();
                    }
                    if (Action == 'reset') {
                        const DstObject = sysFactory.getObjectByID(Result.DstObjectID);
                        DstObject.reset();
                    }

                    if (Action == 'tabswitch') {
                        const TabContainerObj = sysFactory.getObjectByID(Result.TabContainer);
                        console.debug('TabContainerObj:%o', TabContainerObj);
                        TabContainerObj.switchTab(Result.Tab);
                    }
                }

                //- global fire events
                if (Result.FireEvents !== undefined) {
                    sysFactory.Reactor.fireEvents(Result.FireEvents);
                }
            }
        }

        //- switch screen
        if (SwitchScreen !== undefined && SwitchScreen != false) {
            console.debug('switchScreen:%s', SwitchScreen);
            //- switch screen
            sysFactory.switchScreen(ConfigAttributes.SwitchScreen);
        }

        //- switch screen tab
        if (SwitchTabContainer !== undefined && SwitchTabID !== undefined) {
            var TabObj = sysFactory.getObjectByID(SwitchTabContainer);
            TabObj.TabContainerObject.switchTab(SwitchTabID);
        }

        //- fire events
        if (ConfigAttributes.FireEvents != undefined) {
            sysFactory.Reactor.fireEvents(ConfigAttributes.FireEvents);
        }

        //- fire net events
        this.fireNetEvents();

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


//------------------------------------------------------------------------------
//- METHOD "fireNetEvents"
//------------------------------------------------------------------------------

/*
 * a) should be included by prototype
 * b) destination session should be modified to destination user
 * c) configuration values should be read from global config
*/

sysObjButton.prototype.fireNetEvents = function()
{
    console.log('FireNetEvents config:%o', this.JSONConfig.Attributes.FireNetEvents);
    var Events = this.JSONConfig.Attributes.FireNetEvents;
    for (EventID in Events) {
        DstSessionID = Events[EventID];
        URL = '/python/MsgHandler.py';
        URLParams = '&Type=SET&DestinationSession='+DstSessionID+'&Payload=SYS__NET_EVENT-'+EventID;
        RPC = new sysCallXMLRPC(URL, URLParams);
        RPC.setRequestType('GET');
        RPC.Request();
    }
}
