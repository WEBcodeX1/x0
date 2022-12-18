//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2022                                          -//
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

	FormElement = new sysBaseObject();
	FormElement.ObjectID = this.FormObjectID;
	FormElement.DOMType = 'input';
	FormElement.DOMStyle = Attributes.Style;
	FormElement.DOMObjectID = this.FormObjectID;
	FormElement.ParentObject = this;
	FormElement.overrideDOMObjectID = true;
	FormElement.ObjectType = 'Formfield';

	FormElement.JSONConfig = this.JSONConfig;

	FormElement.DOMAttributes = {
		"type": this.ObjectType
	};

	this.FormElement = FormElement;

	//console.debug('FormFieldItem this.ObjectID:%s this.FormObjectID:%s', this.ObjectID, this.FormObjectID);

	this.DBColumn = Attributes.DBColumn;

	if (this.ParentObject.JSONConfig !== undefined && this.ParentObject.JSONConfig.InstancePrefix !== undefined) {
		this.InstancePrefix = this.ParentObject.JSONConfig.InstancePrefix;
	}

	if (Attributes.LabelFor !== undefined) {
		this.LabelFor = (this.InstancePrefix === undefined) ? Attributes.LabelFor : this.InstancePrefix + Attributes.LabelFor;
	}

	this.OverrideValidate = (Attributes.OverrideValidate === undefined) ? false : true;

	if (Attributes.Value !== undefined) {
		this.FormElement.DOMAttributes['value'] = Attributes.Value;
	}

	if (Attributes.GlobalVar !== undefined) {
		this.FormElement.DOMAttributes['value'] = sysFactory.getGlobalVar(Attributes.GlobalVar);
	}

	if (Attributes.Placeholder !== undefined) {
		this.FormElement.DOMAttributes['placeholder'] = Attributes.Placeholder;
	}

	if (Attributes.MaxLength !== undefined) {
		this.FormElement.DOMAttributes['maxlength'] = Attributes.MaxLength;
	}

	if (Attributes.Disabled !== undefined) {
		this.FormElement.DOMAttributes['disabled'] = '';
	}

	if (Attributes.ReadOnly !== undefined) {
		this.FormElement.DOMAttributes['readOnly'] = '';
	}

	if (Attributes.Min !== undefined) {
		this.FormElement.DOMAttributes['min'] = Attributes.Min;
	}

	if (Attributes.Max !== undefined) {
		this.FormElement.DOMAttributes['max'] = Attributes.Max;
	}
}


//------------------------------------------------------------------------------
//- METHOD "FormItemInitFinish"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemInitFinish = function()
{
	this.addObject(this.FormElement);
	this.setupEventListener();
	this.setupIntervalHandler();
}


//------------------------------------------------------------------------------
//- METHOD "setupEventListener"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setupEventListener = function()
{
	const Attributes = this.JSONConfig.Attributes;
	if (Attributes.OnChange !== undefined && Attributes.OnChange.Type !== undefined) {
		try {
			this.EventListeners["OnChangeHandler"] = {
				"Type": Attributes.OnChange.Type,
				"Element": this.processOnChangeItem.bind(this)
			};
		}
		catch(err) {
			console.debug('::setupEventListenerObject err:%s ObjectID:%s', err, this.ObjectID);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "FormItemSetValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemSetValue = function()
{
	try {
		const divElement = document.getElementById(this.FormObjectID);
		//console.debug('::setDOMFormElementValue ObjectID:%s Value:%s', this.FormObjectID, this.Value);
		divElement.value = this.Value;
	}
	catch(err) {
		console.debug('::setDOMFormElementValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.ObjectID, err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "FormItemGetValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemGetValue = function()
{
	try {
		return document.getElementById(this.FormObjectID).value;
	}
	catch(err) {
		console.debug('::getDOMFormElementValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.FormObjectID, err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "FormItemAddStyle"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemAddStyle = function(StyleClass)
{
	try {
		const FormElement = document.getElementById(this.FormElement.ObjectID);
		FormElement.classList.add(StyleClass);
	}
	catch(err) {
		console.debug('::DOMFormElementAddStyle err:%s ObjectID:%s DOMObjectID:%o', err, this.ObjectID, this.DOMObjectID);
	}
}


//------------------------------------------------------------------------------
//- METHOD "FormItemRemoveStyle"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemRemoveStyle = function(StyleClass)
{
	try {
		var FormElement = document.getElementById(this.FormElement.ObjectID);

		if (FormElement.classList.contains(StyleClass)) {
			FormElement.classList.remove(StyleClass);
		}
	}
	catch(err) {
		console.debug('DOMFormElementRemoveStyle err:%s ObjectID:%s DOMObjectID:%o', err, this.ObjectID, this.DOMObjectID);
	}
}


//------------------------------------------------------------------------------
//- METHOD "focus"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.focus = function()
{
	const Element = document.getElementById(this.FormElement.ObjectID);
	if (Element != null && Element !== undefined) {
		Element.focus();
	}
}


//------------------------------------------------------------------------------
//- METHOD "enable"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.enable = function()
{
	console.debug('Formfield enable FormObjectID:%s', this.FormElement.ObjectID);
	this.Disabled = false;
	const Element = document.getElementById(this.FormElement.ObjectID);
	if (Element != null && Element !== undefined) {
		Element.disabled = false;
	}
}


//------------------------------------------------------------------------------
//- METHOD "disable"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.disable = function()
{
	console.debug('Formfield disable FormObjectID:%s', this.FormElement.ObjectID);
	this.Disabled = true;
	const Element = document.getElementById(this.FormElement.ObjectID);
	if (Element != null && Element !== undefined) {
		Element.disabled = true;
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateDBValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.updateDBValue = function(RowData)
{
	if (RowData !== undefined && this.JSONConfig.Attributes.DBColumn !== undefined) {
		//console.debug('updateDBValue');
		var DBValue = RowData[this.JSONConfig.Attributes.DBColumn];
		//console.debug('::callbackXMLRPCAsync DBValue:%s DBColumn:%s', DBValue, SetObject.JSONConfig.Attributes.DBColumn);

		if (DBValue == null) { DBValue = ''; }

		this.reset();
		this.Value = DBValue;
		//- use RuntimeSetDataFunc or it will not work with all derived form types
		this.FormItemSetValue();
	}
}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.validate = function()
{

	const Attributes = this.JSONConfig.Attributes;

	console.debug('::validate type:%s OverrideValidate:%s Deactivated:%s Disabled:%s', Attributes.Type, this.OverrideValidate, this.FormElement.Deactivated, this.FormElement.Disabled);

	//- ignore non validateable types
	if (Attributes.Type == 'pulldown' || Attributes.Type == 'dynpulldown' || Attributes.Type == 'dummy' || Attributes.Type == 'label') { return true; }

	//- if deactivated, do not validate
	if (this.Deactivated === true || this.TabDeactivated === true) { return true; }

	//- if disabled do not process
	if (this.Disabled === true && this.OverrideValidate === false) { return true; }

	//- ignore form field without validate regex set
	if (Attributes.ValidateRef == null || Attributes.ValidateRef === undefined) { return true; }

	//- if nullable and value length = 0, do not mark as failed
	if (Attributes.ValidateNullable == true && this.FormItemGetValue().length == 0) {

		this.FormItemRemoveStyle(Attributes.StyleValidateFail);
		this.FormItemAddStyle(Attributes.StyleValidateOk);

		return true;
	}

	//- check min characters length
	if (Attributes.ValidateMinChar !== undefined && this.FormItemGetValue().length < Attributes.ValidateMinChar) {
		this.FormItemAddStyle(Attributes.StyleValidateFail);
		return false;
	}

	//- check max characters length
	if (Attributes.ValidateMaxChar !== undefined && this.FormItemGetValue().length > Attributes.ValidateMaxChar) {
		this.FormItemAddStyle(Attributes.StyleValidateFail);
		return false;
	}

	//- check min value
	if (Attributes.ValidateMinValuer !== undefined && this.FormItemGetValue() < Attributes.ValidateMinValue) {
		this.FormItemAddStyle(Attributes.StyleValidateFail);
		return false;
	}

	//- check max value
	if (Attributes.ValidateMaxValue !== undefined && this.FormItemGetValue() > Attributes.ValidateMaxValue) {
		this.FormItemAddStyle(Attributes.StyleValidateFail);
		return false;
	}

	const Result = sysFactory.ObjValidate.validate(Attributes.ValidateRef, this.FormItemGetValue());
	//console.debug('::validate FormItem ObjectID:%s Result:%s', this.ObjectID, Result);

	this.setValidateStyle(Result);

	return Result;
}


//------------------------------------------------------------------------------
//- METHOD "setupEvents"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setupEvents = function()
{
	if (this.UpdateOnEvent !== undefined) {
		//console.log('sysFormFieldItem setupEvents() Events:%o', this.UpdateOnEvent.Events);
		var Attributes = new Object();
		Attributes.OnEvent = this.UpdateOnEvent;
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
//- METHOD "setValidateStyle"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setValidateStyle = function(Result)
{
	const Attributes = this.JSONConfig.Attributes;
	if (Result === false) {
		this.FormItemRemoveStyle(Attributes.StyleValidateOk);
		this.FormItemAddStyle(Attributes.StyleValidateFail);
	}
	if (Result === true) {
		this.FormItemRemoveStyle(Attributes.StyleValidateFail);
		this.FormItemAddStyle(Attributes.StyleValidateOk);
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
	const Attributes = this.JSONConfig.Attributes;
	this.setValue(
		(Attributes.Value !== undefined ? Attributes.Value : '')
	);
	this.resetStyle();
}


//------------------------------------------------------------------------------
//- METHOD "setValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setValue = function(Value)
{
	this.Value = Value;
	this.FormItemSetValue();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemText"
//------------------------------------------------------------------------------

function sysFormfieldItemText()
{
	this.Index							= null;

	this.Deactivated					= false;
	this.Disabled						= false;

	this.ChildObjects					= new Array();
	this.EventListeners					= new Object();

	this.RuntimeSetDataFunc				= this.setRuntimeData;
	this.RuntimeGetDataFunc				= this.getRuntimeData;
}

sysFormfieldItemText.prototype = new sysFormfieldItem();


sysFormfieldItemText.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.FormItemInit();
	this.FormItemInitFinish();
}

sysFormfieldItemText.prototype.updateFormItemValue = function()
{
	this.FormItemSetValue();
}


//------------------------------------------------------------------------------
//- METHOD "getRuntimeData"
//------------------------------------------------------------------------------

sysFormfieldItemText.prototype.getRuntimeData = function()
{
	return this.FormItemGetValue();
}


//------------------------------------------------------------------------------
//- METHOD "setRuntimeData"
//------------------------------------------------------------------------------

sysFormfieldItemText.prototype.setRuntimeData = function(Value)
{
	this.Value = Value;
	this.updateFormItemValue();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemTextarea"
//------------------------------------------------------------------------------

function sysFormfieldItemTextarea()
{
	this.Index					= null;
	this.Deactivated			= false;

	this.ChildObjects			= new Array();
	this.EventListeners			= new Object();

	this.RuntimeGetDataFunc		= this.getRuntimeData;
}

sysFormfieldItemTextarea.prototype = new sysFormfieldItem();
sysFormfieldItemTextarea.prototype.clear = sysFormfieldItemText.prototype.clear;


sysFormfieldItemTextarea.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.FormItemInit();

	this.FormElement.DOMType = 'textarea';

	this.FormItemInitFinish();
}

sysFormfieldItemTextarea.prototype.updateFormItemValue = function()
{
	//console.debug('updateValue');
	this.FormItemSetValue();
}


//------------------------------------------------------------------------------
//- METHOD "getRuntimeData"
//------------------------------------------------------------------------------

sysFormfieldItemTextarea.prototype.getRuntimeData = function()
{
	return this.FormItemGetValue();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemPulldown"
//------------------------------------------------------------------------------

function sysFormfieldItemPulldown()
{
	this.Index					= null;
	this.Deactivated			= false;

	this.ChildObjects			= new Array();
	this.EventListeners			= new Object();

	this.RuntimeGetDataFunc		= this.getValue;
}

sysFormfieldItemPulldown.prototype = new sysFormfieldItem();


sysFormfieldItemPulldown.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.FormItemInit();

	this.FormElement.DOMType = 'select';

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

	this.FormElement.DOMValue = OptionHTML;
}


//------------------------------------------------------------------------------
//- METHOD "updateValue"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.updateFormItemValue = function() {
	this.setValue();
}


//------------------------------------------------------------------------------
//- METHOD "setValue"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.setValue = function() {

	//console.debug('DomPulldownSetValue Value:' + this.Value);
	if (this.Value !== undefined && this.Value != null) {

		const SetValue = this.Value.toString();
		const PulldownObj = document.getElementById(this.FormElement.ObjectID);

		//- iterate on pulldown options, compare values
		for (var i=0; i < PulldownObj.options.length; i++) {
			if (PulldownObj.options[i].value == SetValue) {
				PulldownObj.selectedIndex = i;
			}
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "getValue"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.getValue = function() {

	const PulldownObj = document.getElementById(this.FormElement.ObjectID);

	try {
		const PDValue = PulldownObj.options[PulldownObj.selectedIndex].value;
		console.debug('Pulldown getValue() Type:%s Value:%o', typeof(PDValue), PDValue);
		return PDValue;
	}
	catch(err) {
		console.debug('::DOMPulldownGetValue error:%s DOMObjectID:%o', err, this.FormObjectID);
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
	this.Index					= null;
	this.Deactivated			= false;

	this.ChildObjects			= new Array();
	this.EventListeners			= new Object();

	this.RuntimeGetDataFunc		= this.getValue;
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

	this.FormElement.DOMType = 'select';

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

	//console.debug('::getDynPulldownData ServiceID:%s ServiceURL:%s', ServiceID, ServiceURL);

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

	for (Index in this.XMLRPCResultData) {
		const Option = this.XMLRPCResultData[Index];
		PulldownOptions.push(Option);
	}
	this.generateOptions();
	this.FormElement.setDOMElementValue();
}


//------------------------------------------------------------------------------
//- METHOD "updateFormItemValue"
//------------------------------------------------------------------------------

sysFormfieldItemDynPulldown.prototype.updateFormItemValue = function() {
	this.getDynPulldownData();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemCheckbox"
//------------------------------------------------------------------------------

function sysFormfieldItemCheckbox()
{
	this.Index					= null;
	this.Deactivated			= false;

	this.ChildObjects			= new Array();
	this.EventListeners			= new Object();

	this.RuntimeGetDataFunc		= this.getChecked;

}

sysFormfieldItemCheckbox.prototype = new sysFormfieldItem();

sysFormfieldItemCheckbox.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.FormItemInit();

	//this.FormElement.DOMAttributes['checked'] = '';

	this.FormItemInitFinish();
}


//------------------------------------------------------------------------------
//- METHOD "getChecked"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.getChecked = function() {
	//console.debug('Checkbox ID:%s', this.FormElement.ObjectID);
	const CheckboxObj = document.getElementById(this.FormObjectID);
	return CheckboxObj.checked;
}


//------------------------------------------------------------------------------
//- METHOD "setChecked"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.setChecked = function() {
	const CheckboxObj = document.getElementById(this.FormObjectID);
	CheckboxObj.checked = (this.Value == 1) ? true : false;
}


//------------------------------------------------------------------------------
//- METHOD "updateValue"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.updateFormItemValue = function() {
	this.setChecked();
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.reset = function()
{
	this.resetStyle();
	this.setChecked();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemLabel"
//------------------------------------------------------------------------------

function sysFormfieldItemLabel()
{
	this.Index					= null;
	this.Deactivated			= false;

	this.ChildObjects			= new Array();
	this.EventListeners			= new Object();

	this.RuntimeGetDataFunc		= this.getRuntimeData;
}

sysFormfieldItemLabel.prototype = new sysFormfieldItem();

sysFormfieldItemLabel.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.FormItemInit();

	this.FormElement.DOMType = 'label';

	const Text = (Attributes.DisplayText) ? Attributes.DisplayText : sysFactory.getText(Attributes.TextID);

	this.FormElement.DOMValue = Text;

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
//- METHOD "FormItemSetValue
//------------------------------------------------------------------------------

sysFormfieldItemLabel.prototype.FormItemSetValue = function()
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
//- METHOD "updateValue"
//------------------------------------------------------------------------------

sysFormfieldItemLabel.prototype.updateFormItemValue = function()
{
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
	this.Index							= null;

	this.Value							= null;

    this.RuntimeSetDataFunc				= this.setRuntimeData;
	this.RuntimeGetDataFunc				= this.getRuntimeData;
}

sysFormfieldItemHidden.prototype = new sysFormfieldItem();


sysFormfieldItemHidden.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.FormItemInit();
	this.FormItemInitFinish();
}

sysFormfieldItemHidden.prototype.updateFormItemValue = function()
{
}


//------------------------------------------------------------------------------
//- METHOD "getRuntimeData"
//------------------------------------------------------------------------------

sysFormfieldItemHidden.prototype.getRuntimeData = function()
{
	return this.Value;
}


//------------------------------------------------------------------------------
//- METHOD "setRuntimeData"
//------------------------------------------------------------------------------

sysFormfieldItemHidden.prototype.setRuntimeData = function(Value)
{
	this.Value = Value;
}


//------------------------------------------------------------------------------
//- METHOD "setupEventListenerFormula"
//------------------------------------------------------------------------------

/*
 * check if method should be inherited by some kind of base class
 * when using in multiple object types
*/

sysFormfieldItem.prototype.setupEventListenerFormula = function(FormulaRefObject)
{
	//console.debug('Add EventListener Object:%s Counter:%s', this.ObjectID, this.FormulaEventhandlerCounter);
	var EventListenerID = 'OnChangeFormula' + this.FormulaEventhandlerCounter;

	this.EventListeners[EventListenerID] = {
		"Type": 'change',
		"Element": FormulaRefObject.updateValues.bind(FormulaRefObject),
		"RefObject": FormulaRefObject
	};

	this.FormulaEventhandlerCounter += 1;
	//console.debug('EventListeners:%o', this.EventListeners);
}


//------------------------------------------------------------------------------
//- METHOD "updateEventListenerFormula"
//------------------------------------------------------------------------------

/*
 * check if method should be inherited by some kind of base class
 * when using in multiple object types
*/

sysFormfieldItem.prototype.updateEventListenerFormula = function(FormulaRefObject)
{
	for (EventID in this.EventListeners) {
		const Listener = this.EventListeners[EventID];
		Listener.RefObject.updateValues();
	}
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


//------------------------------------------------------------------------------
//- CONSTRUCTOR "ValidateMultiDataXMLRPCHandler"
//------------------------------------------------------------------------------

function ValidateMultiDataXMLRPCHandler(Config, FormfieldRef) {
	this.Config = Config;
	this.FormfieldRef = FormfieldRef;
}


//------------------------------------------------------------------------------
//- METHOD "callService"
//------------------------------------------------------------------------------

ValidateMultiDataXMLRPCHandler.prototype.callService = function()
{
	//console.debug('Config:%o', this.Config);

	this.PostRequestData = {}
	this.PostRequestData[this.Config.ServiceParam] = this.Config.FormfieldValue;

	RPC = new sysCallXMLRPC(this.Config.ServiceURL);
	RPC.Request(this);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

ValidateMultiDataXMLRPCHandler.prototype.callbackXMLRPCAsync = function()
{
	const DstObject = sysFactory.getObjectByID(this.Config.ServiceDstObject);
	console.debug(DstObject);

	const ErrorCheck = this.XMLRPCResultData['Error'];
	if (ErrorCheck !== undefined && ErrorCheck[this.Config.CancelOnError] !== undefined && ErrorCheck[this.Config.CancelOnError] === true ) {
		if (this.Config.ResetOnFailure === true) {
			this.FormfieldRef.reset();
		}
		return;
	}

	if (DstObject.ObjectType == 'FormfieldList') {
		DstObject.setData(this.XMLRPCResultData);
	}
	if (DstObject.ObjectType == 'List') {
		DstObject.appendData(this.XMLRPCResultData);
	}
	if (DstObject.ObjectType == 'Formfield' && this.Config.ServiceResultKey !== undefined) {
		DstObject.ParentObject.setValue(this.XMLRPCResultData[this.Config.ServiceResultKey]);
	}

	if (this.Config.ResetOnSuccess === true) {
		this.FormfieldRef.reset();
	}

}
