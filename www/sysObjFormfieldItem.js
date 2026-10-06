//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
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
    this.EventListeners         = new Object();
    this.DOMAttributes          = new Object();

    this.RuntimeGetDataFunc     = this.getValue;
    this.RuntimeSetDataFunc     = this.setValue;
    this.RuntimeAppendDataFunc  = undefined;
}

sysFormfieldItem.prototype = new sysBaseObject();

//- add OnChangetHandler functions
sysFormfieldItem.prototype.processOnChangeItem = sysFormFieldOnChangeHandler.prototype.processOnChangeItem;

//- add SourceObjectHandler functions
sysFormfieldItem.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;


//------------------------------------------------------------------------------
//- METHOD "FormItemInit"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemInit = function()
{
    const Attributes = this.JSONConfig.Attributes;
    const test = sysFactory.DataObject.XMLRPCResultData['WorkerName'];
    console.debug('::sysFormfieldItem FormItemInit() ObjectID:%s Attributes:%o Test:%o', this.ObjectID, Attributes, test);

    this.overrideDOMObjectID = true;

    this.DOMType = 'input';
    this.DOMStyle = Attributes.Style;
    this.ValidateObj = new sysFormFieldValidate();
    this.ValidateObj.FormObj = this;

    this.DBColumn = Attributes.DBColumn;

    //- setup object layer attributes
    this.setupAttributes(Attributes);
}


//------------------------------------------------------------------------------
//- METHOD "FormItemInitFinish"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemInitFinish = function()
{
    this.setupOnChangeEventListener();
}


//------------------------------------------------------------------------------
//- METHOD "setupOnChangeEventListener"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setupOnChangeEventListener = function()
{
    const Attributes = this.JSONConfig.Attributes;
    if (Attributes.OnChange !== undefined)
    {
        try {
            const EventType = (Attributes.OnChange.Type !== undefined) ? Attributes.OnChange.Type : 'change';
            this.EventListeners["OnChangeHandler"] = {
                "Type": EventType,
                "Element": this.processOnChangeItem.bind(this)
            };
        }
        catch(err) {
            console.log('::setupEventListenerObject err:%s ObjectID:%s', err, this.ObjectID);
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "getValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.getValue = function()
{
    //console.debug('::FormItemGetValue ObjectID:%s', this.ObjectID);
    try {
        const FormElement = document.getElementById(this.ObjectID);
        const FormValue = FormElement.value;
        //console.debug('::FormItemGetValue Element:%o Value:%s', FormElement, FormValue);
        return FormValue;
    }
    catch(err) {
        console.log('::FormItemGetValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.ObjectID, err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "setValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setValue = function(Value)
{
    this.Value = Value;
    this.displayValue();
}


//------------------------------------------------------------------------------
//- METHOD "displayValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.displayValue = function()
{
    if (this.Value !== undefined) {
        console.debug('::sysFormfieldItem displayValue() ObjectID:%s this.Value:%s', this.ObjectID, this.Value);
        try {
            const divElement = document.getElementById(this.ObjectID);
            divElement.value = this.Value;
        }
        catch(err) {
            console.log('::sysFormfieldItem displayValue() ObjectID:%s err:%s', this.ObjectID, err);
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.reset = function()
{
    console.debug('::FormfieldItem reset() method call Object:%o', this);
    const Attributes = this.JSONConfig.Attributes;

    try {
        if (Attributes.GlobalVar !== undefined) {
            this.RuntimeSetDataFunc(sysFactory.getGlobalVar(Attributes.GlobalVar));
        }
        this.displayValue();
    }
    catch(err) {
        console.debug('::sysFormfieldItem reset() err:%s ObjectID:%s', err, this.ObjectID);
    }
}


//------------------------------------------------------------------------------
//- METHOD "focus"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.focus = function()
{
    const FocusElement = document.getElementById(this.ObjectID);
    if (FocusElement != null && FocusElement !== undefined) {
        FocusElement.focus();
    }
}


//------------------------------------------------------------------------------
//- METHOD "setupAttributes"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setupAttributes = function(Attributes)
{
    console.debug('::sysFormfieldItem setupAttributes() ObjectID:%s Attributes:%o', this.ObjectID, Attributes);

    if (Attributes.Value !== undefined) {
        this.Value = Attributes.Value;
    }

    //- DOM form type
    if (Attributes.Type !== undefined) {
        this.DOMAttributes['type'] = Attributes.Type;
    }

    //- label for
    if (Attributes.LabelFor !== undefined) {
        this.LabelFor = (this.InstancePrefix === undefined) ? Attributes.LabelFor : this.InstancePrefix + Attributes.LabelFor;
    }

    //- placeholder
    if (Attributes.Placeholder !== undefined) {
        this.DOMAttributes['placeholder'] = Attributes.Placeholder;
    }
    if (Attributes.PlaceholderTextID !== undefined) {
        this.DOMAttributes['placeholder'] = sysFactory.getText(Attributes.PlaceholderTextID);
    }

    //- number
    if (Attributes.Number !== undefined) {
        this.DOMAttributes['type'] = 'number';
    }

    //- disabled / read-only
    if (Attributes.Disabled !== undefined) {
        this.DOMAttributes['disabled'] = '';
    }

    if (Attributes.ReadOnly !== undefined) {
        this.DOMAttributes['readOnly'] = '';
    }

    //- min / max / maxlength
    if (Attributes.Min !== undefined) {
        this.DOMAttributes['min'] = Attributes.Min;
    }

    if (Attributes.Max !== undefined) {
        this.DOMAttributes['max'] = Attributes.Max;
    }

    if (Attributes.MaxLength !== undefined) {
        this.DOMAttributes['maxlength'] = Attributes.MaxLength;
    }

    //- rows
    if (Attributes.Rows !== undefined) {
        this.DOMAttributes['rows'] = Attributes.Rows;
    }
}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.validate = function()
{
    const Attributes = this.JSONConfig.Attributes;

    const StyleValidateFailFirst = Attributes.StyleValidateFailFirst;
    const StyleValidateFail = Attributes.StyleValidateFail;
    const StyleValidateOk = Attributes.StyleValidateOk;

    this.StyleValidateFailFirst = (StyleValidateFailFirst !== undefined) ? StyleValidateFailFirst : 'border-4';
    this.StyleValidateFail = (StyleValidateFail !== undefined) ? StyleValidateFail : 'border border-danger border-opacity-50';
    this.StyleValidateOk = (StyleValidateOk !== undefined) ? StyleValidateOk : 'border border-success border-opacity-50';

    //- ignore non validateable types
    if (Attributes.Type == 'pulldown' || Attributes.Type == 'dynpulldown' || Attributes.Type == 'dummy' || Attributes.Type == 'label')
    {
        return false;
    }

    //- if deactivated, do not validate
    if (this.Deactivated == true)
    {
        return false;
    }

    //- ignore form field without validate reference
    if (Attributes.ValidateRef == null || Attributes.ValidateRef === undefined)
    {
        return false;
    }

    //- if nullable and value length = 0, do not mark as failed
    if (Attributes.ValidateNullable == true && this.FormItemGetValue().length == 0)
    {
        this.removeDOMElementStyle(this.StyleValidateFail);
        this.addDOMElementStyle(this.StyleValidateOk);
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
    this.removeDOMElementStyle(this.StyleValidateFailFirst);

    if (Result == true) {
        this.removeDOMElementStyle(this.StyleValidateOk);
        this.addDOMElementStyle(this.StyleValidateFail);
    }
    else if (Result == false) {
        this.removeDOMElementStyle(this.StyleValidateFail);
        this.addDOMElementStyle(this.StyleValidateOk);
    }
}


//------------------------------------------------------------------------------
//- METHOD "clearStyle"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.clearStyle = function()
{
    this.removeDOMElementStyle(this.StyleValidateOk);
    this.removeDOMElementStyle(this.StyleValidateFailFirst);
    this.removeDOMElementStyle(this.StyleValidateFail);
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemText"
//------------------------------------------------------------------------------

function sysFormfieldItemText()
{
    this.ObjectType     = 'FormfieldText';

    this.Deactivated    = false;

    this.DOMAttributes  = new Object();
    this.ChildObjects   = new Array();
    this.EventListeners = new Object();
}

sysFormfieldItemText.prototype = new sysFormfieldItem();

sysFormfieldItemText.prototype.init = function()
{
    this.DOMAttributes['type'] = 'text';
    this.FormItemInit();
    this.FormItemInitFinish();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemTextarea"
//------------------------------------------------------------------------------

function sysFormfieldItemTextarea()
{
    this.ObjectType       = 'FormfieldTextarea';

    this.Deactivated      = false;

    this.DOMAttributes    = new Object();
    this.ChildObjects     = new Array();
    this.EventListeners   = new Object();
}

sysFormfieldItemTextarea.prototype = new sysFormfieldItem();


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
    this.ObjectType             = 'FormfieldPulldown';

    this.Deactivated            = false;

    this.ChildObjects           = new Array();
    this.EventListeners         = new Object();

    this.RuntimeGetDataFunc     = this.getValue;
    this.RuntimeSetDataFunc     = this.setValue;
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
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.reset = function()
{
    this.update();
}


//------------------------------------------------------------------------------
//- METHOD "setValue"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.setValue = function(Value)
{
    this.Value = Value;
    this.update();
}


//------------------------------------------------------------------------------
//- METHOD "generateOptions"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.generateOptions = function()
{
    const Attributes = this.JSONConfig.Attributes;

    var OptionHTML = '';

    if (Attributes.AddNoneItem === true)
    {
        const NoneItemValue = (Attributes.AddNoneItemValue !== undefined) ? Attributes.AddNoneItemValue : null;
        Attributes.Options.unshift(
            {
                "TextID": Attributes.AddNoneItemTxtID,
                "Value": NoneItemValue
            }
        );
    }

    for (const OptionAttributes of Attributes.Options)
    {
        const TextID = OptionAttributes.TextID;
        const Value = OptionAttributes.Value;

        const Text = (OptionAttributes.Display) ? OptionAttributes.Display : sysFactory.getText(TextID);

        const Selected = (OptionAttributes.Default === true) ? 'selected' : '';

        OptionHTML += '<option value="' + Value + '"' + Selected + '>' + Text + '</option>';
    }

    this.DOMValue = OptionHTML;
}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.update = function()
{
    //console.debug('DomPulldownSetValue Value:' + this.Value);
    if (this.Value !== undefined && this.Value != null) {

        console.debug('::sysFormfieldItemPulldown update ObjectID:%s', this.ObjectID);

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
        catch(err) {
            console.log('::sysFormfieldItemPulldown err:%s', err);
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "getValue"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.getValue = function()
{
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
    this.ObjectType     = 'FormfieldDynPulldown';

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
        sysFactory.Reactor.registerEvent(EventConfig, this.getDynPulldownData);
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

    if (ServiceID !== undefined)
    {
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

    for (const Option of this.XMLRPCResultData) {
        console.debug('::DynPulldown XMLRPCCallback Option:%s', Option);
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
    this.ObjectType         = 'FormfieldCheckbox';

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

    this.DOMAttributes['type'] = 'checkbox';

    this.FormItemInit();

    if (Attributes.Value !== undefined && Attributes.Value == true)
    {
        this.DOMAttributes['checked'] = ''
        this.setChecked(true);
    }

    this.FormItemInitFinish();
}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.update = function()
{
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

sysFormfieldItemCheckbox.prototype.getChecked = function()
{
    //console.debug('Checkbox ID:%s', this.ObjectID);
    const CheckboxObj = document.getElementById(this.ObjectID);
    return CheckboxObj.checked;
}


//------------------------------------------------------------------------------
//- METHOD "setChecked"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.setChecked = function(Value)
{
    this.Value = Value;
    console.debug('Form checkbox this:%o', this);
    this.update();
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.reset = function()
{
    this.update();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemLabel"
//------------------------------------------------------------------------------

function sysFormfieldItemLabel()
{
    this.ObjectType         = 'FormfieldLabel';

    this.Deactivated         = false;

    this.ChildObjects        = new Array();
    this.EventListeners      = new Object();

    this.RuntimeGetDataFunc  = undefined;
    this.RuntimeSetDataFunc  = undefined;
}

sysFormfieldItemLabel.prototype = new sysFormfieldItem();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysFormfieldItemLabel.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    this.FormItemInit();

    this.DOMType = 'label';

    let ObjDefs = [
        {
            "id": this.ObjectID + "LabelText",
            "SysObject": new sysObjSQLText(),
            "JSONAttributes": {
                "Style": Attributes.TextStyle,
                "IconStyle": Attributes.IconStyle,
                "TextID": Attributes.TextID
            }
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);

    this.FormItemInitFinish();
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
    this.ObjectType = 'FormfieldHidden';
    this.Value = undefined;
}

sysFormfieldItemHidden.prototype = new sysFormfieldItem();


sysFormfieldItemHidden.prototype.init = function()
{
    this.DOMAttributes['type'] = 'hidden';
    this.FormItemInit();
    this.FormItemInitFinish();
}
