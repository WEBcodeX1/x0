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
sysFormfieldItem.prototype.setupOnChangeConfig = sysFormFieldOnChangeHandler.prototype.setupOnChangeConfig;

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

	if (this.Value !== undefined) {
		this.FormElement.DOMAttributes['value'] = this.Value;
	}

	if (Attributes.GlobalVar !== undefined) {
		this.FormElement.DOMAttributes['value'] = sysFactory.getGlobalVar(Attributes.GlobalVar);
	}

	if (Attributes.Placeholder !== undefined) {
		this.FormElement.DOMAttributes['placeholder'] = Attributes.Placeholder;
	}

	if (Attributes.Disabled !== undefined) {
		this.FormElement.DOMAttributes['disabled'] = '';
	}

	if (Attributes.ReadOnly !== undefined) {
		this.FormElement.DOMAttributes['readOnly'] = '';
	}

}


//------------------------------------------------------------------------------
//- METHOD "FormItemInitFinish"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemInitFinish = function()
{
	this.addObject(this.FormElement);
	this.setupEventListenerObject();
	this.setupIntervalHandler();	
}


//------------------------------------------------------------------------------
//- METHOD "FormItemSetValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemSetValue = function()
{
	//console.debug('FormItemSetValue Value:%s', this.Value);
	if (this.Value !== undefined && this.Value != null) {
		try {
			const divElement = document.getElementById(this.FormElement.ObjectID);
			//console.debug('::setDOMFormElementValue ObjectID:%s Value:%s DIVElement:%o', this.ObjectID, this.DOMValue, divElement);
			divElement.value = this.Value;
		}
		catch(err) {
			console.debug('::setDOMFormElementValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.ObjectID, err);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "FormItemGetValue"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemGetValue = function()
{
	try {
		return document.getElementById(this.FormElement.ObjectID).value;
	}
	catch(err) {
		console.debug('::getDOMFormElementValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.ObjectID, err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "FormItemAddStyle"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.FormItemAddStyle = function(StyleClass)
{
	try {
		const FormElement = document.getElementById(this.FormElement.ObjectID);
		FormElement.classList.add('class', StyleClass);
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
	//console.debug('updateDBValue');
	const DBValue = RowData[this.JSONConfig.Attributes.DBColumn];
	//console.debug('::callbackXMLRPCAsync DBValue:%s DBColumn:%s', DBValue, SetObject.JSONConfig.Attributes.DBColumn);

	if (DBValue == null) { DBValue = ''; }

	this.reset();
	this.Value = DBValue;
	this.FormItemSetValue();

	try {
		//console.debug('::callbackXMLRPCAsync triggering FormItem OnChange');
		this.processOnChangeItem();
	}
	catch(e) {
		console.debug('');
	}
}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.validate = function()
{
	//console.log('::validate type:%s OverrideValidate:%s', this.Type, this.OverrideValidate);

	//- ignore pulldown type
	//if (this.Type == 'pulldown' || this.Type == 'dynpulldown' || this.Type == 'dummy') { return true; }

	//- if deactivated, do not validate
	if (this.Deactivated === true || this.TabDeactivated === true) { return true; }

	//- ignore dummy type
	if (this.Type == 'dummy') { return true; }

	//- if disabled do not process
	if (this.Disabled == true && this.OverrideValidate == false) { return true; }

	//- ignore form field without validate regex set
	if (this.ValidateRef == null || this.ValidateRef === undefined) { return true; }

	//- if nullable and value length = 0, do not mark as failed
	if (this.ValidateNullable == true && this.getDOMFormElementValue().length == 0) {

		this.DOMFormElementRemoveStyle(this.StyleClassValidateFail);
		this.DOMFormElementAddStyle(this.StyleClassValidateOk);

		return true;
	}

	const Result = sysFactory.ObjFormValidate.validate(this.ValidateRef, this.getDOMFormElementValue());
	//console.debug('::validate FormItem ObjectID:%s Result:%s', this.ObjectID, Result);

	return this.setValidateStyle(Result);
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
//- METHOD "setupTabSwitchBehaviour"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setupTabSwitchBehaviour = function()
{
	if (this.UpdateOnTabSwitch !== undefined) {
		try {
			var TabObj = sysFactory.getObjectByID(this.UpdateOnTabSwitch.TabContainer);
			//console.log('::setupTabSwitchBehaviour TabContainer:%s Tab:%s Object:%o', this.UpdateOnTabSwitch.TabContainer, this.UpdateOnTabSwitch.Tab, TabObj);
			TabObj.TabContainerObject.addUpdateOnTabSwitchElement(this.UpdateOnTabSwitch.Tab, this);
		}
		catch(err) {
			console.debug('::setupTabSwitchBehaviour err:%s', err);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "setValidateStyle"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setValidateStyle = function(Result)
{
	if (Result == -1) {
		this.DOMFormElementRemoveStyle(this.StyleClassValidateOk);
		this.DOMFormElementAddStyle(this.StyleClassValidateFail);
		return false;
	}
	else {
		this.DOMFormElementRemoveStyle(this.StyleClassValidateFail);
		this.DOMFormElementAddStyle(this.StyleClassValidateOk);
		return true;
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
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.reset = function()
{
	this.DOMStyle = this.StyleClass;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemText"
//------------------------------------------------------------------------------

function sysFormfieldItemText()
{
	this.Index					= null;
	this.Deactivated			= false;

	this.ChildObjects			= new Array();
	this.EventListeners			= new Object();

	this.RuntimeGetDataFunc		= this.getRuntimeData;
}

sysFormfieldItemText.prototype = new sysFormfieldItem();

sysFormfieldItemText.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.FormItemInit();
	this.FormItemInitFinish();
}

sysFormfieldItemText.prototype.updateValue = function(RowData)
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

sysFormfieldItemTextarea.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.FormItemInit();

	this.FormElement.DOMType = 'textarea';

	this.FormItemInitFinish();
}

sysFormfieldItemTextarea.prototype.updateValue = function()
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

	//- get pulldown dom object
	const PulldownObj = document.getElementById(this.ObjectID);

	try {
		return PulldownObj.options[PulldownObj.selectedIndex].value;
	}
	catch(err) {
		console.debug('::DOMPulldownGetValue error:%s DOMObjectID:%o', err, this.ObjectID);
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
//- METHOD "processSwitchScreen"
//------------------------------------------------------------------------------

sysFormfieldItemPulldown.prototype.processSwitchScreen = function()
{
	this.updateValue();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemDynPulldown"
//------------------------------------------------------------------------------

function sysFormfieldItemDynPulldown()
{
	this.Index							= null;
	this.Deactivated					= false;

	this.ChildObjects					= new Array();
	this.EventListeners					= new Object();

	this.RuntimeGetDataFunc				= this.getValue;
}

sysFormfieldItemDynPulldown.prototype = new sysFormfieldItem();

sysFormfieldItemDynPulldown.prototype.generateOptions = sysFormfieldItemPulldown.prototype.generateOptions;
sysFormfieldItemDynPulldown.prototype.setValue = sysFormfieldItemPulldown.prototype.setValue;
sysFormfieldItemDynPulldown.prototype.getValue = sysFormfieldItemPulldown.prototype.getValue;
sysFormfieldItemDynPulldown.prototype.getDefault = sysFormfieldItemPulldown.prototype.getDefault;
sysFormfieldItemDynPulldown.prototype.initReferencedPulldowns = sysFormfieldItemPulldown.prototype.initReferencedPulldowns;

sysFormfieldItemDynPulldown.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.FormItemInit();

	this.FormElement.DOMType = 'select';

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
//- METHOD "updateValue"
//------------------------------------------------------------------------------

sysFormfieldItemDynPulldown.prototype.updateValue = function() {
	this.getDynPulldownData();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemCheckbox"
//------------------------------------------------------------------------------

function sysFormfieldItemCheckbox()
{
	this.Index							= null;
	this.Deactivated					= false;

	this.ChildObjects					= new Array();
	this.EventListeners					= new Object();

	this.RuntimeGetDataFunc				= this.getChecked;
}

sysFormfieldItemCheckbox.prototype = new sysFormfieldItem();

sysFormfieldItemCheckbox.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.FormItemInit();

	if (this.Value == 1) {
		this.FormElement.DOMAttributes['checked'] = '';
	}

	this.FormItemInitFinish();
}


//------------------------------------------------------------------------------
//- METHOD "getChecked"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.getChecked = function() {
	//console.debug('Checkbox ID:%s', this.FormElement.ObjectID);
	const CheckboxObj = document.getElementById(this.FormElement.ObjectID);
	return CheckboxObj.checked;
}


//------------------------------------------------------------------------------
//- METHOD "setChecked"
//------------------------------------------------------------------------------

sysFormfieldItemCheckbox.prototype.setChecked = function() {
	const CheckboxObj = document.getElementById(this.FormElement.ObjectID);
	CheckboxObj.checked = (this.DOMValue == 'True') ? true : false;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormfieldItemLabel"
//------------------------------------------------------------------------------

function sysFormfieldItemLabel()
{
	this.Index							= null;
	this.Deactivated					= false;

	this.ChildObjects					= new Array();
	this.EventListeners					= new Object();

	this.RuntimeGetDataFunc				= this.getRuntimeData;
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
//- METHOD "setupEventListenerObject"
//------------------------------------------------------------------------------

sysFormfieldItem.prototype.setupEventListenerObject = function()
{
	if (this.OnChange !== undefined) {
		try {
			this.EventListeners["OnChangeHandler"] = {
				"Type": this.OnChangeType,
				"Element": this.processOnChangeItem.bind(this)
			};
		}
		catch(err) {
			console.debug('::setupEventListenerObject err:%s ObjectID:%s', err, this.ObjectID);
		}
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
		'hidden': sysFormfieldItemText,
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

	if (DstObject.ObjectType == 'FormFieldList') {
		DstObject.setData(this.XMLRPCResultData);
	}
	if (DstObject.ObjectType == 'List') {
		DstObject.appendData(this.XMLRPCResultData);
	}
	if (DstObject.ObjectType == 'FormField' && this.Config.ServiceResultKey !== undefined) {
		DstObject.setValue(this.XMLRPCResultData[this.Config.ServiceResultKey]);
	}

	if (this.Config.ResetOnSuccess === true) {
		this.FormfieldRef.reset();
	}

}
