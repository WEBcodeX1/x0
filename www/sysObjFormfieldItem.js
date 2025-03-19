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
//- CONSTRUCTOR "sysFormfieldItemContainer"
//------------------------------------------------------------------------------

function sysFormfieldItemContainer(ObjectID, JSONConfig, ParentObject)
{
	const Attributes = JSONConfig.Attributes;

	//FormElement = new sysBaseObject();
	this.ObjectID = ObjectID;
	this.DOMObjectID = ObjectID;
	this.DOMType = 'input';
	this.DOMStyle = Attributes.Style;
	this.ParentObject = ParentObject;
	this.overrideDOMObjectID = true;
	this.ObjectType = 'Formfield';
	this.JSONConfig = JSONConfig;

	this.EventListeners = new Object();

	this.RuntimeGetDataFunc	= this.ParentObject.RuntimeGetDataFunc
	this.RuntimeSetDataFunc	= this.ParentObject.RuntimeSetDataFunc;
}

sysFormfieldItemContainer.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItem"
//------------------------------------------------------------------------------

function sysFormfieldItem()
{
	this.RuntimeGetDataFunc	= this.FormItemGetValue;
	this.RuntimeSetDataFunc	= this.FormItemSetValue;
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

	var FormElement = new sysFormfieldItemContainer(
		this.FormObjectID,
		this.JSONConfig,
		this
	)

	FormElement.DOMAttributes = {
		"type": this.ObjectType
	};

	this.FormElement = FormElement;

	this.ValidateObj = new sysFormFieldValidate();
	this.ValidateObj.FormObj = this;

	console.debug('::formfield this.ObjectID:%s this.FormObjectID:%s', this.ObjectID, this.FormObjectID);

	this.DBColumn = Attributes.DBColumn;

	if (this.ParentObject.JSONConfig !== undefined && this.ParentObject.JSONConfig.InstancePrefix !== undefined) {
		this.InstancePrefix = this.ParentObject.JSONConfig.InstancePrefix;
	}

	if (Attributes.LabelFor !== undefined) {
		this.LabelFor = (this.InstancePrefix === undefined) ? Attributes.LabelFor : this.InstancePrefix + Attributes.LabelFor;
	}

	this.OverrideValidate = (Attributes.OverrideValidate === undefined) ? false : true;

	if (Attributes.Placeholder !== undefined) {
		this.FormElement.DOMAttributes['placeholder'] = Attributes.Placeholder;
	}

	if (Attributes.MaxLength !== undefined) {
		this.FormElement.DOMAttributes['maxlength'] = Attributes.MaxLength;
	}

	if (Attributes.Number !== undefined) {
		this.FormElement.DOMAttributes['type'] = 'number';
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

	if (Attributes.Rows !== undefined) {
		this.FormElement.DOMAttributes['rows'] = Attributes.Rows;
	}
}


//------------------------------------------------------------------------------
//- METHOD "FormItemInitFinish"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemInitFinish = function()
{
	console.debug('::FormItem SetupFinish');
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
	//console.debug('::FormItem setupEventListener AttrOnChange:%s AttrOnChangeType:%s', Attributes.OnChange,Attributes.OnChange.Type);
	if (Attributes.OnChange !== undefined) {
		try {
			const EventType = (Attributes.OnChange.Type !== undefined) ? Attributes.OnChange.Type : 'change';
			this.FormElement.EventListeners["OnChangeHandler"] = {
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
//- METHOD "FormItemSetValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemSetValue = function(Value)
{
	try {
		this.Value = Value;
		const divElement = document.getElementById(this.FormObjectID);
		//console.debug('::setDOMFormElementValue ObjectID:%s Value:%s', this.FormObjectID, this.Value);
		divElement.value = this.Value;
	}
	catch(err) {
		console.debug('::FormItemSetValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.ObjectID, err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateFormItemValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.updateFormItemValue = function()
{
	try {
		const divElement = document.getElementById(this.FormObjectID);
		//console.debug('::setDOMFormElementValue ObjectID:%s Value:%s', this.FormObjectID, this.Value);
		divElement.value = this.Value;
	}
	catch(err) {
		console.debug('::updateFormItemValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.ObjectID, err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "FormItemGetValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemGetValue = function()
{
	console.debug('::FormItemGetValue DOMObjectID:%s ObjectID:%s FormObjectID:%s', this.DOMObjectID, this.ObjectID, this.FormObjectID);
	try {
		const FormElement = document.getElementById(this.FormObjectID);
		const FormValue = FormElement.value;
		console.debug('::FormItemGetValue Element:%o Value:%s', FormElement, FormValue);
		return FormValue;
	}
	catch(err) {
		console.debug('::FormItemGetValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.FormObjectID, err);
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

	console.debug(
		'::validate Type:%s ValidateRef:%s OverrideValidate:%s Deactivated:%s Disabled:%s StyleValidateFail:%s',
		Attributes.Type,
		Attributes.ValidateRef,
		this.OverrideValidate,
		this.FormElement.Deactivated,
		this.FormElement.Disabled,
		this.StyleValidateFail
	);

	const Result = this.ValidateObj.validate();
	console.debug('::validate FormItem ObjectID:%s Result:%s', this.FormElement.ObjectID, Result);

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
	this.Index					= null;

	this.Deactivated			= false;
	this.Disabled				= false;

	this.ChildObjects			= new Array();
	this.EventListeners			= new Object();
}

sysFormfieldItemText.prototype = new sysFormfieldItem();

sysFormfieldItemText.prototype.init = function()
{
	this.FormItemInit();
	this.FormItemInitFinish();
}

sysFormfieldItemText.prototype.updateFormItemValue = function()
{
	this.FormItemSetValue();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemTextarea"
//------------------------------------------------------------------------------

function sysFormfieldItemTextarea()
{
	this.Index					= null;

	this.Deactivated			= false;
	this.Disabled				= false;

	this.ChildObjects			= new Array();
	this.EventListeners			= new Object();
}

sysFormfieldItemTextarea.prototype = new sysFormfieldItem();
sysFormfieldItemTextarea.prototype.clear = sysFormfieldItemText.prototype.clear;


sysFormfieldItemTextarea.prototype.init = function()
{
	this.FormItemInit();

	this.FormElement.DOMType = 'textarea';

	this.FormItemInitFinish();
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
	this.RuntimeSetDataFunc		= this.setValue;
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
