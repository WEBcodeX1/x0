//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "FormfieldItem" Object                                            -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- FormfieldItem Object                                                     -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItem"
//------------------------------------------------------------------------------

function sysFormfieldItem()
{
    this.EventListeners = new Object();

    this.RuntimeGetDataFunc     = this.FormItemGetValue;
    this.RuntimeSetDataFunc     = this.FormItemSetValue;
    this.RuntimeAppendDataFunc  = undefined;
}

sysFormfieldItem.prototype = new sysBaseObject();

//- add OnChangetHandler functions
sysFormfieldItem.prototype.checkLengthMismatch = sysFormFieldOnChangeHandler.prototype.checkLengthMismatch;
sysFormfieldItem.prototype.processOnChangeItem = sysFormFieldOnChangeHandler.prototype.processOnChangeItem;

//- add IntervalHandler functions
sysFormfieldItem.prototype.processInterval = sysIntervalHandler.prototype.processInterval;

//- add SourceObjectHandler functions
sysFormfieldItem.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;


//------------------------------------------------------------------------------
//- METHOD "FormItemInit"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemInit = function()
{
    const Attributes = this.JSONConfig.Attributes;

    this.DOMType = 'input';
    this.DOMStyle = Attributes.Style;
    this.ObjectType = Attributes.Type;

    this.DOMAttributes = {
        "type": this.ObjectType
    };

    this.overrideDOMObjectID = true;
    this.DOMObjectID = this.ObjectID;
    this.ValidateObj = new sysFormFieldValidate();
    this.ValidateObj.FormObj = this;

    this.DBColumn = Attributes.DBColumn;

    console.debug('FormItem Attributes:%o', Attributes);

    if (this.JSONConfig !== undefined && this.JSONConfig.InstancePrefix !== undefined) {
        this.InstancePrefix = this.JSONConfig.InstancePrefix;
    }

    if (Attributes.LabelFor !== undefined) {
        this.LabelFor = (this.InstancePrefix === undefined) ? Attributes.LabelFor : this.InstancePrefix + Attributes.LabelFor;
    }

    if (Attributes.Placeholder !== undefined) {
        this.DOMAttributes['placeholder'] = Attributes.Placeholder;
    }

    if (Attributes.MaxLength !== undefined) {
        this.DOMAttributes['maxlength'] = Attributes.MaxLength;
    }

    if (Attributes.Number !== undefined) {
        this.DOMAttributes['type'] = 'number';
    }

    if (Attributes.Disabled !== undefined) {
        this.DOMAttributes['disabled'] = '';
    }

    if (Attributes.ReadOnly !== undefined) {
        this.DOMAttributes['readOnly'] = '';
    }

    if (Attributes.Min !== undefined) {
        this.DOMAttributes['min'] = Attributes.Min;
    }

    if (Attributes.Max !== undefined) {
        this.DOMAttributes['max'] = Attributes.Max;
    }

    if (Attributes.Rows !== undefined) {
        this.DOMAttributes['rows'] = Attributes.Rows;
    }
}


//------------------------------------------------------------------------------
//- METHOD "FormItemInitFinish"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemInitFinish = function()
{
    this.setupEventListener();
    this.setupIntervalHandler();
}


//------------------------------------------------------------------------------
//- METHOD "setupEventListener"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setupEventListener = function()
{
    const Attributes = this.JSONConfig.Attributes;
    //console.debug('::FormItem setupEventListener AttrOnChange:%s AttrOnChangeType:%s', Attributes.OnChange,Attributes.OnChange.Type);
    if (Attributes.OnChange !== undefined) {
        try {
            const EventType = (Attributes.OnChange.Type !== undefined) ? Attributes.OnChange.Type : 'change';
            this.EventListeners["OnChangeHandler"] = {
                "Type": EventType,
                "Element": this.processOnChangeItem.bind(this)
            };
        }
        catch(err) {
            console.debug('::setupEventListenerObject err:%s ObjectID:%s', err, this.ObjectID);
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "FormItemGetValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemGetValue = function()
{
    console.debug('::FormItemGetValue DOMObjectID:%s ObjectID:%s', this.DOMObjectID, this.ObjectID);
    try {
        const FormElement = document.getElementById(this.ObjectID);
        const FormValue = FormElement.value;
        console.debug('::FormItemGetValue Element:%o Value:%s', FormElement, FormValue);
        return FormValue;
    }
    catch(err) {
        console.debug('::FormItemGetValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.ObjectID, err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "FormItemSetValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemSetValue = function(Value)
{
    try {
        this.Value = Value;
        const divElement = document.getElementById(this.ObjectID);
        //console.debug('::setDOMFormElementValue ObjectID:%s Value:%s', this.FormObjectID, this.Value);
        divElement.value = this.Value;
    }
    catch(err) {
        console.debug('::FormItemSetValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.ObjectID, err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "focus"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.focus = function()
{
    const Element = document.getElementById(this.ObjectID);
    if (Element != null && Element !== undefined) {
        Element.focus();
    }
}


//------------------------------------------------------------------------------
//- METHOD "updateDBValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.updateDBValue = function(RowData)
{
    if (RowData !== undefined && this.JSONConfig.Attributes.DBColumn !== undefined) {

        //console.debug('::updateDBValue');
        var DBValue = RowData[this.JSONConfig.Attributes.DBColumn];
        //console.debug('::updateDBValue DBValue:%s DBColumn:%s', DBValue, this.JSONConfig.Attributes.DBColumn);

        if (DBValue == null) { DBValue = ''; }

        this.reset();
        this.RuntimeSetDataFunc(DBValue);
    }
}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.validate = function()
{
    const Attributes = this.JSONConfig.Attributes;

    this.StyleValidateFail = (Attributes.StyleValidateFail === undefined) ? 'alert alert-danger p-2' : Attributes.StyleValidateFail;
    this.StyleValidateOk = (Attributes.StyleValidateOk === undefined) ? 'alert alert-success p-2' : Attributes.StyleValidateOk;

    //- ignore non validateable types
    if (Attributes.Type == 'pulldown' || Attributes.Type == 'dynpulldown' || Attributes.Type == 'dummy' || Attributes.Type == 'label') { return false; }

    //- if deactivated, do not validate
    if (this.Deactivated == true || this.TabDeactivated == true) { return false; }

    //- if disabled do not process
    if (this.Disabled == true && this.OverrideValidate == false) { return false; }

    //- ignore form field without validate regex set
    if (Attributes.ValidateRef == null || Attributes.ValidateRef === undefined) { return false; }

    //- if nullable and value length = 0, do not mark as failed
    if (Attributes.ValidateNullable == true && this.FormItemGetValue().length == 0) {

        this.removeDOMElementStyle(this.StyleValidateFail);
        this.addDOMElementStyle(this.StyleValidateOk);

        return false;
    }

    //- check min characters length
    if (Attributes.ValidateMinChar !== undefined && this.FormItemGetValue().length < Attributes.ValidateMinChar) {
        this.FormItemAddStyle(this.StyleValidateFail);
        return false;
    }

    //- check max characters length
    if (Attributes.ValidateMaxChar !== undefined && this.FormItemGetValue().length > Attributes.ValidateMaxChar) {
        this.FormItemAddStyle(this.StyleValidateFail);
        return false;
    }

    //- check min value
    if (Attributes.ValidateMinValue !== undefined && this.FormItemGetValue() < Attributes.ValidateMinValue) {
        this.FormItemAddStyle(this.StyleValidateFail);
        return false;
    }

    //- check max value
    if (Attributes.ValidateMaxValue !== undefined && this.FormItemGetValue() > Attributes.ValidateMaxValue) {
        this.FormItemAddStyle(this.StyleValidateFail);
        return false;
    }

    const Result = this.ValidateObj.validate();
    console.debug('::validate FormItem ObjectID:%s Result:%s', this.ObjectID, Result);

    if (typeof Result == 'object') {
        this.setValidateStyle(Result['Error']);
    }
    else {
        this.setValidateStyle(Result);
    }

    return Result;
}


//------------------------------------------------------------------------------
//- METHOD "setValidateStyle"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setValidateStyle = function(Result)
{
    if (Result == true) {
        this.removeDOMElementStyle(this.StyleValidateOk);
        this.addDOMElementStyle(this.StyleValidateFail);
    }
    if (Result == false) {
        this.removeDOMElementStyle(this.StyleValidateFail);
        this.addDOMElementStyle(this.StyleValidateOk);
    }
}


//------------------------------------------------------------------------------
//- METHOD "setupEvents"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setupEvents = function()
{
    if (this.UpdateOnEvents !== undefined) {
        //console.log('sysFormFieldItem setupEvents() Events:%o', this.UpdateOnEvent.Events);
        var Attributes = new Object();
        Attributes.OnEvent = this.UpdateOnEvents;
        sysFactory.Reactor.registerEvent(Attributes, this, 'Dynpulldown');
    }
}


//------------------------------------------------------------------------------
//- METHOD "setupIntervalHandler"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setupIntervalHandler = function()
{
    if (this.JSONConfig.Attributes.CheckInterval !== undefined) {
        const Config = this.JSONConfig.Attributes.CheckInterval;
        setTimeout(this.processInterval, Config.Interval, Config, this, ValidateMultiDataXMLRPCHandler);
    }
}


//------------------------------------------------------------------------------
//- METHOD "clearStyle"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.clearStyle = function()
{
    this.DOMFormElementRemoveStyle(this.StyleClassValidateOk);
    this.DOMFormElementRemoveStyle(this.StyleClassValidateFail);
}


//------------------------------------------------------------------------------
//- METHOD "resetStyle"
//------------------------------------------------------------------------------
sysFormfieldItem.prototype.resetStyle = function()
{
    this.DOMStyle = this.StyleClass;
    this.setDOMElementStyle();
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.reset = function()
{
    console.debug('FormfieldItem reset method call Object:%o', this);

    const Attributes = this.JSONConfig.Attributes;
    this.RuntimeSetDataFunc(
        (Attributes.Value !== undefined ? Attributes.Value : '')
    );
    if (Attributes.GlobalVar !== undefined) {
        this.RuntimeSetDataFunc(sysFactory.getGlobalVar(Attributes.GlobalVar));
    }
    this.resetStyle();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemText"
//------------------------------------------------------------------------------

function sysFormfieldItemText()
{
    this.Index                    = null;

    this.Deactivated            = false;
    this.Disabled                = false;

    this.ChildObjects            = new Array();
    this.EventListeners            = new Object();
}

sysFormfieldItemText.prototype = new sysFormfieldItem();

sysFormfieldItemText.prototype.init = function()
{
    this.FormItemInit();
    this.FormItemInitFinish();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemTextarea"
//------------------------------------------------------------------------------

function sysFormfieldItemTextarea()
{
    this.Index            = null;

    this.Deactivated      = false;
    this.Disabled         = false;

    this.ChildObjects     = new Array();
    this.EventListeners   = new Object();
}

sysFormfieldItemTextarea.prototype = new sysFormfieldItem();
sysFormfieldItemTextarea.prototype.clear = sysFormfieldItemText.prototype.clear;


sysFormfieldItemTextarea.prototype.init = function()
{
    this.FormItemInit();

    this.DOMType = 'textarea';

    this.FormItemInitFinish();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemPulldown"
//------------------------------------------------------------------------------

function sysFormfieldItemPulldown()
{
    this.Index               = null;
    this.Deactivated         = false;

    this.ChildObjects        = new Array();
    this.EventListeners      = new Object();

    this.RuntimeGetDataFunc  = this.getValue;
    this.RuntimeSetDataFunc  = this.setValue;
}

sysFormfieldItemPulldown.prototype = new sysFormfieldItem();


sysFormfieldItemPulldown.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    this.FormItemInit();

    this.DOMType = 'select';

    this.generateOptions();
    this.FormItemInitFinish();
}


//------------------------------------------------------------------------------
//- METHOD "generateOptions"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.generateOptions = function()
{
    const Attributes = this.JSONConfig.Attributes;

    var OptionHTML = '';

    if (Attributes.AddNoneItem === true) {
        const NoneItemValue = (Attributes.AddNoneItemValue !== undefined) ? Attributes.AddNoneItemValue : null;
        Attributes.Options.unshift(
            {
                "TextID": Attributes.AddNoneItemTxtID,
                "Value": NoneItemValue
            }
        );
    }

    for (var Index in Attributes.Options) {

        const OptionAttributes = Attributes.Options[Index];
        const TextID = OptionAttributes.TextID;
        const Value = OptionAttributes.Value;

        const Text = (OptionAttributes.Display) ? OptionAttributes.Display : sysFactory.getText(TextID);

        const Selected = (OptionAttributes.Default === true) ? 'selected' : '';

        OptionHTML += '<option value="' + Value + '"' + Selected + '>' + Text + '</option>';
    }

    this.DOMValue = OptionHTML;
}


//------------------------------------------------------------------------------
//- METHOD "setValue"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.setValue = function(Value) {
    this.Value = Value;
    this.update();
}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.update = function() {

    //console.debug('DomPulldownSetValue Value:' + this.Value);
    if (this.Value !== undefined && this.Value != null) {

        console.debug('::sysFormfieldItemPulldown update FormObjectID:%s', this.ObjectID);

        const SetValue = this.Value.toString();
        const PulldownObj = document.getElementById(this.ObjectID);

        try {
            //- iterate on pulldown options, compare values
            for (var i=0; i < PulldownObj.options.length; i++) {
                if (PulldownObj.options[i].value == SetValue) {
                    PulldownObj.selectedIndex = i;
                }
            }
        }
        catch {
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "getValue"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.getValue = function() {

    const PulldownObj = document.getElementById(this.ObjectID);

    try {
        const PDValue = PulldownObj.options[PulldownObj.selectedIndex].value;
        console.debug('Pulldown getValue() Type:%s Value:%o', typeof(PDValue), PDValue);
        return PDValue;
    }
    catch(err) {
        console.debug('::sysFormfieldItemPulldown error:%s FormObjectID:%o', err, this.ObjectID);
    }
}


//------------------------------------------------------------------------------
//- METHOD "getDefault"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.getDefault = function()
{
    for (OptionKey in this.PulldownOptions) {
        var Item = this.PulldownOptions[OptionKey];
        if (Item.Default == true) { return OptionKey; }
    }
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemDynPulldown"
//------------------------------------------------------------------------------

function sysFormfieldItemDynPulldown()
{
    this.Index          = null;
    this.Deactivated    = false;

    this.ChildObjects   = new Array();
    this.EventListeners = new Object();
}

sysFormfieldItemDynPulldown.prototype = new sysFormfieldItem();

sysFormfieldItemDynPulldown.prototype.generateOptions = sysFormfieldItemPulldown.prototype.generateOptions;
sysFormfieldItemDynPulldown.prototype.setValue = sysFormfieldItemPulldown.prototype.setValue;
sysFormfieldItemDynPulldown.prototype.getValue = sysFormfieldItemPulldown.prototype.getValue;
sysFormfieldItemDynPulldown.prototype.getDefault = sysFormfieldItemPulldown.prototype.getDefault;
sysFormfieldItemDynPulldown.prototype.initReferencedPulldowns = sysFormfieldItemPulldown.prototype.initReferencedPulldowns;
sysFormfieldItemDynPulldown.prototype.clear = sysFormfieldItemPulldown.prototype.clear;

sysFormfieldItemDynPulldown.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    this.FormItemInit();

    this.DOMType = 'select';

    if (Attributes.UpdateOnEvents !== undefined) {
        const EventConfig = {
            "OnEvent": {
                "Events": Attributes.UpdateOnEvents
            }
        }
        sysFactory.Reactor.registerEvent(EventConfig, this, 'Dynpulldown');
    }

    this.getDynPulldownData();

    this.FormItemInitFinish();
}


//------------------------------------------------------------------------------
//- METHOD "getDynPulldownData"
//------------------------------------------------------------------------------

sysFormfieldItemDynPulldown.prototype.getDynPulldownData = function()
{
    const Attributes = this.JSONConfig.Attributes;

    const ServiceID = Attributes.ServiceID;
    const ServiceURL = Attributes.ServiceURL;

    console.debug('::getDynPulldownData ServiceID:%s ServiceURL:%s', ServiceID, ServiceURL);

    if (ServiceID !== undefined) {
        this.PostRequestData = new sysRequestDataHandler();
        this.PostRequestData.addServiceProperty('ServiceID', ServiceID);

        this.processSourceObjects();
    }

    RPC = new sysCallXMLRPC(Attributes.ServiceURL);
    RPC.Request(this);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysFormfieldItemDynPulldown.prototype.callbackXMLRPCAsync = function()
{
    this.JSONConfig.Attributes.Options = new Array();
    var PulldownOptions = this.JSONConfig.Attributes.Options;

    console.debug('::DynPulldown XMLRPCCallback');

    for (Index in this.XMLRPCResultData) {
        console.debug('::DynPulldown XMLRPCCallback Index:%s', Index);
        const Option = this.XMLRPCResultData[Index];
        PulldownOptions.push(Option);
    }
    this.generateOptions();
    this.setDOMElementValue();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemCheckbox"
//------------------------------------------------------------------------------

function sysFormfieldItemCheckbox()
{
    this.Index              = null;
    this.Deactivated        = false;

    this.ChildObjects       = new Array();
    this.EventListeners     = new Object();

    this.RuntimeGetDataFunc = this.getChecked;
    this.RuntimeSetDataFunc = this.setChecked;
}

sysFormfieldItemCheckbox.prototype = new sysFormfieldItem();

sysFormfieldItemCheckbox.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    this.FormItemInit();

    if (Attributes.Value !== undefined && Attributes.Value == true) {
        this.DOMAttributes['checked'] = ''
        this.setChecked(true);
    }

    this.FormItemInitFinish();
}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.update = function() {
    try {
        console.debug('Checkbox update:%s', this.ObjectID);
        const CheckboxObj = document.getElementById(this.ObjectID);
        CheckboxObj.checked = this.Value;
    }
    catch {
    }
}


//------------------------------------------------------------------------------
//- METHOD "getChecked"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.getChecked = function() {
    //console.debug('Checkbox ID:%s', this.ObjectID);
    const CheckboxObj = document.getElementById(this.ObjectID);
    return CheckboxObj.checked;
}


//------------------------------------------------------------------------------
//- METHOD "setChecked"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.setChecked = function(Value) {
    this.Value = Value;
    console.debug('Form checkbox this:%o', this);
    this.update();
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.reset = function()
{
    this.resetStyle();
    this.update();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemLabel"
//------------------------------------------------------------------------------

function sysFormfieldItemLabel()
{
    this.Index               = null;
    this.Deactivated         = false;

    this.ChildObjects        = new Array();
    this.EventListeners      = new Object();

    this.RuntimeGetDataFunc  = this.getRuntimeData;
    this.RuntimeSetDataFunc  = this.setRuntimeData;
}

sysFormfieldItemLabel.prototype = new sysFormfieldItem();

sysFormfieldItemLabel.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    this.FormItemInit();

    this.DOMType = 'label';

    const Text = (Attributes.DisplayText) ? Attributes.DisplayText : sysFactory.getText(Attributes.TextID);

    this.DOMValue = Text;

    this.FormItemInitFinish();
}


//------------------------------------------------------------------------------
//- METHOD "getRuntimeData"
//------------------------------------------------------------------------------

sysFormfieldItemLabel.prototype.getRuntimeData = function()
{
    return null;
}


//------------------------------------------------------------------------------
//- METHOD "setRuntimeData"
//------------------------------------------------------------------------------

sysFormfieldItemLabel.prototype.setRuntimeData = function()
{
    if (this.Value !== undefined && this.Value != null) {
        try {
            this.DOMValue = this.Value;
            this.setDOMElementValue();
        }
        catch(err) {
            console.debug('::setDOMFormElementValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.ObjectID, err);
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormfieldItemLabel.prototype.reset = function()
{
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemHidden"
//------------------------------------------------------------------------------

function sysFormfieldItemHidden()
{
    this.Index = null;
    this.Value = null;
}

sysFormfieldItemHidden.prototype = new sysFormfieldItem();


sysFormfieldItemHidden.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    this.FormItemInit();
    this.FormItemInitFinish();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldSelector"
//------------------------------------------------------------------------------

function sysFormfieldSelector(Type)
{
    //console.debug('Selector Type:%s', Type);

    FormTypes = {
        'text': sysFormfieldItemText,
        'number': sysFormfieldItemText,
        'password': sysFormfieldItemText,
        'file': sysFormfieldItemText,
        'date': sysFormfieldItemText,
        'hidden': sysFormfieldItemHidden,
        'textarea': sysFormfieldItemTextarea,
        'pulldown': sysFormfieldItemPulldown,
        'dynpulldown': sysFormfieldItemDynPulldown,
        'checkbox': sysFormfieldItemCheckbox,
        'label': sysFormfieldItemLabel
    };

    if (Type !== undefined && Type != null) {
        return new FormTypes[Type]();
    }
}
