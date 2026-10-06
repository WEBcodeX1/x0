//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "FormFieldList"                                            -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormFieldList"
//------------------------------------------------------------------------------

function sysFormfieldList()
{
    this.ObjectType             = 'FormfieldList'                       //- System Object Type
    this.overrideDOMObjectID    = true;                                 //- Override recursive ObjectID

    this.FormfieldItems         = new Array();                          //- Formfield Object Array
    this.PostRequestData        = new sysRequestDataHandler();          //- Request Data Handler

    this.SetDataMechanism       = 'KeyValue'                            //- Set Data Key/Value Pair Type

    this.DOMType                = 'form';                               //- Enclosed Form Element

    this.ValidateGroupObj       = new sysFormFieldValidateGroup();      //- Validate Group Object

    this.EventListeners         = new Object();                         //- Event Listeners
    this.ChildObjects           = new Array();                          //- Child Objects
}

sysFormfieldList.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- Inherit Class Methods
//------------------------------------------------------------------------------

sysFormfieldList.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    console.debug('::sysFormfieldList init() Attributes:%o', Attributes);

    if (Attributes.Style !== undefined) {
        this.DOMStyle = Attributes.Style;
    }

    for (const ObjectID of Attributes.ObjectIDs)
    {
        const JSONConfig = sysFactory.DataObject.XMLRPCResultData[ObjectID];
        const InstanceObjectID = this.ObjectID + ObjectID;
        this.FormfieldItems.push(
            this.setupFormObject(ObjectID, InstanceObjectID, JSONConfig)
        );
    }

    console.debug('::sysFormfieldList init() FormfieldItems:%o', this.FormfieldItems);

    let EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown';
    EventListenerObj['Element'] = this.EventListenerRightClick.bind(this);
    this.EventListeners['ContextMenuOpen'] = EventListenerObj;

    //- grid processing
    this.genGrid(Attributes);
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.reset = function()
{
    const Attributes = this.JSONConfig.Attributes;

    if (Attributes !== undefined && Attributes.Disable === true) {
        this.disableDOMElementRecursive();
    }
}


//------------------------------------------------------------------------------
//- METHOD "setupFormObject"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.setupFormObject = function(ObjectID, InstanceObjectID, JSONConfig)
{
    let FormObj = new sysFactory.SetupClasses[JSONConfig.Type]();
    FormObj.overrideDOMObjectID = true;
    FormObj.ObjectID = InstanceObjectID;
    FormObj.KeyID = ObjectID;
    FormObj.JSONConfig = JSONConfig;
    FormObj.init();
    return FormObj;
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerRightClick"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.EventListenerRightClick = function(Event)
{
    let ContextMenuItems = this.JSONConfig.Attributes.ContextMenuItems;

    //- check for right click on mousedown
    if (Event.button == 2 && ContextMenuItems !== undefined)
    {
        let ContextMenu             = new sysContextMenu();

        ContextMenu.ID              = 'CtMenu_' + this.ObjectID;
        ContextMenu.ItemConfig      = ContextMenuItems;
        ContextMenu.ScreenObject    = this.ScreenObject;
        ContextMenu.ParentObject    = this;
        ContextMenu.pageX           = Event.pageX;
        ContextMenu.pageY           = Event.pageY;

        ContextMenu.init();
    }
}


//------------------------------------------------------------------------------
//- METHOD "genGrid"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.genGrid = function(Attrributes)
{
    let GridGenerator = new sysGridGenerator(this.FormfieldItems);

    GridGenerator.init(
        Attrributes.RowStyle,
        Attrributes.ColStyle,
        Attrributes.RowAfterElements,
        Attrributes.ColAfterElements
    );

    const RowItems = GridGenerator.generate();
    console.debug('::::sysFormfieldList genGrid() RowItems:%o', RowItems);

    for (const RowItem of RowItems) {
        this.addObject(RowItem);
    }
}


//------------------------------------------------------------------------------
//- METHOD "getServiceData"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getServiceData = function()
{
    RPC = new sysCallXMLRPC(this.DataURL);
    RPC.Request(this);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.callbackXMLRPCAsync = function()
{
    this.setObjectData(this.XMLRPCResultData[0]);
}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.validate = function()
{
    const Attributes = this.JSONConfig.Attributes;

    console.debug('::validate Attributes:%o', Attributes);

    const ErrorContainerID = Attributes.ErrorContainer;
    const ErrorObj = sysFactory.getObjectByID(ErrorContainerID);

    let ValidateStatus = true;
    let FirstValidateErrorItem = null;

    console.debug('::validate ErrorContainerID:%s ErrorObj:%o', ErrorContainerID, ErrorObj);

    if (ErrorObj !== undefined)
    {
        ErrorObj.reset();

        let ErrorDisplayText;
        let ErrorDetailDisplayText;

        // ----------------------------------------------------------------
        // - form item validate
        // ----------------------------------------------------------------

        let ErrorCount = 0;
        for (const FormItem of this.FormfieldItems)
        {
            const FormAttributes = FormItem.JSONConfig.Attributes;
            const TxtID = FormAttributes.ValidateErrorTextID;
            const ErrorDisplayTextID = (TxtID !== undefined) ? TxtID : 'TXT.SYS.ERROR.FORMVALIDATE.DEFAULT';
            console.debug('::validate FormValidateErrorTextID:%s', ErrorDisplayTextID);
            const RetValue = FormItem.validate();
            console.debug('::validate RetValue:%s', RetValue);

            let ValidateError;

            if (typeof RetValue == 'object' && RetValue['Error'] == true) {
                ErrorDetailDisplayText = RetValue['Message'];
                ValidateError = RetValue['Error'];
            }
            else {
                ValidateError = RetValue;
            }

            if (ValidateError == true) {
                ValidateStatus = false;
                if (ErrorCount == 0) {
                    ErrorDisplayText = sysFactory.getText(ErrorDisplayTextID);
                    FirstValidateErrorItem = FormItem;
                }
                ErrorCount++;
            }
        }

        //- set style on first detected error item
        if (FirstValidateErrorItem != null) {
            FirstValidateErrorItem.addDOMElementStyle(
                FirstValidateErrorItem.StyleValidateFailFirst
            );
        }

        // ----------------------------------------------------------------
        // - group validate
        // ----------------------------------------------------------------

        if (Attributes.GroupValidate !== undefined && ValidateError == false)
        {
            for (GroupItem of Attributes.GroupValidate)
            {
                const GTxtID = GroupItem.ValidateErrorTextID;
                const GroupErrorDisplayTextID = (GTxtID !== undefined) ? GTxtID : 'TXT.SYS.ERROR.FORMVALIDATE.DEFAULT';

                console.debug('GroupValidate:%o', GroupItem);

                const GroupFunction = GroupItem.FunctionRef;
                let FormObjects = new Array();

                for (FormID of GroupItem.ObjectIDs)
                {
                    FormObjects.push(sysFactory.getObjectByID(FormID));
                }

                const Result = this.ValidateGroupObj.validate(
                    GroupFunction,
                    FormObjects
                );

                if (Result['Error'] !== undefined && Result['Error'] == true) {
                    ErrorDisplayText = sysFactory.getText(GroupErrorDisplayTextID);
                    ErrorDetailDisplayText = Result['Message'];
                    ValidateStatus = false;
                }
            }
        }

        // ----------------------------------------------------------------
        // - check validate status
        // ----------------------------------------------------------------

        console.debug('::validate ValidateStatus:%s', ValidateStatus);
        if (ValidateStatus == false)
        {
            console.debug('ErrorObj:%o', ErrorObj);
            ErrorObj.displayError(ErrorDisplayText, ErrorDetailDisplayText);
        }
        else {
            for (const FormItem of this.FormfieldItems) {
                FormItem.clearStyle();
            }
        }
    }

    return ValidateStatus;
}
