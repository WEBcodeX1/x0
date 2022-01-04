//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "FormFieldItem" Object                                            -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- FormFieldItem Object                                                     -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormFieldItem"
//------------------------------------------------------------------------------

function sysFormFieldItem()
{
	this.Index							= null;					//- Index (sorted)

	this.ContainerObject				= null;					//- Container Sys Object

	this.Type							= null;					//- text | password | textarea | pulldown | hidden | file
	this.DescriptionTextID				= null;					//- Description TextID
	this.Placeholder					= null;					//- Placeholder
	this.DisplayText					= null;					//- Direct Display Text (not multilanguage for Tpye::dummy)

	this.ValidateRef					= null;					//- Validate Regex Reference ID
	this.ValidateNullable				= false;				//- If set true, Form Value can be null (validate will not fail)

	this.FormFieldRefScreen				= null;					//- Form Field Value Reference ID Screen
	this.FormFieldRefContainer			= null;					//- Form Field Value Reference ID Container
	this.FormFieldRef					= null;					//- Form Field Value Reference ID FormField

	this.StyleClass						= null;					//- Style Class
	this.StyleClassOnFocus				= null;					//- Style Class On Focus
	this.StyleClassValidateOk			= null;					//- Style Class Validate Ok
	this.StyleClassValidateFail			= null;					//- Style Class Validate Fail

	this.Disabled						= false;				//- Form Field Disabled
	this.Deactivated					= false;				//- Form Field Deactivated
	this.ReadOnly						= false;				//- Form Field ReadOnly

	this.HTMLPrepend					= null;					//- Prepend HTML
	this.HTMLAppend						= null;					//- Append HTML

	this.MaxLength						= null;					//- Max Input Characters

    this.OverrideValidate				= false;				//- If set true -> validate

	this.Value							= null;					//- Value
	this.GlobalVar						= null;					//- Global Var Value

	this.NumberMin						= null;					//- Number Minimal Value
	this.NumberMax						= null;					//- Number Maximal Value

	this.DynPulldownURL					= null;					//- Dyn Pulldown Service URL
	this.PulldownDynLoaded				= false;				//- Dyn Pulldown Loaded Indicator

	this.FormFieldHTML					= '';					//- Rendered FormField HTML

	//* DELETE on refactoring 
	this.UpdatePulldown					= null;					//- Referenced Pulldown Object ID
	this.UpdatePulldownValueSplitChar	= null;					//- Split Array Character
	this.UpdatePulldownValueStartIndex	= null;					//- Generation Start Source Array Index
	this.UpdatePulldownValueEndIndex	= null;					//- Generation End Source Array Index
	this.UpdatePulldownPrependIndex		= null;					//- Generation Prepend Source Array Index
	this.UpdatePulldownPrependRegex		= null;					//- Generation Prepend Regular Expression
	//* DELETE on refactoring

	this.AddNoneItem					= false;				//- Add additional None Item
	this.AddNoneItemSingleItem			= null;					//- Do not set selected option property

    this.RuntimeGetDataFunc				= this.getRuntimeData	//- Runtime Get Data Value/Function

	this.OnChange						= null;					//- OnChange
	this.OnChangeDstObject				= null;					//- OnChange Dest Object
	this.OnChangeCompareObject			= null;					//- OnChange Compare Object (Value)
	this.OnChangeDstMatchColumn			= null;					//- OnChange Dest Object Match Column
	this.OnChangeDstUpdateColumn		= null;					//- OnChange Dest Update Column
	this.OnChangeDstUpdateValue			= null;					//- OnChange Dest Update Value
	this.OnChangeDstUpdateValueSrcObject= null;					//- OnChange Dest Update Value Source Object
	this.OnChangeDstUpdateRowStyle		= null;					//- OnChange Dest Update Row Style

	this.OnChangeType					= 'change';				//- OnChange Type

	this.TooltipText					= null;					//- Tooltip Text
	this.TooltipSite					= null;					//- Tooltip external HTML

	this.UpdateOnTabSwitch				= null;					//- Updata (reload) DynPulldown on Tab Switch

	this.ChildObjects					= new Array();
	this.EventListeners					= new Object();
    this.DIVType                        = 'FormFieldContainer';

	this.FormulaEventhandlerCounter		= -1;
}


//- inherit sysBaseDOMFormElement
sysFormFieldItem.prototype = new sysBaseObject();

//- add BaseObject functions
sysFormFieldItem.prototype.getObjectData = sysBaseObject.prototype.getObjectData;
sysFormFieldItem.prototype.getObjectDataStringified = sysBaseObject.prototype.getObjectDataStringified;
sysFormFieldItem.prototype.activate = sysBaseObject.prototype.activate;
sysFormFieldItem.prototype.deactivate = sysBaseObject.prototype.deactivate;

//- add BaseDOMElement functions
sysFormFieldItem.prototype.getDOMValue = sysBaseDOMElement.prototype.getDOMValue;
sysFormFieldItem.prototype.setDOMElementValue = sysBaseDOMElement.prototype.setDOMElementValue;
sysFormFieldItem.prototype.addEventListener = sysBaseDOMElement.prototype.addEventListener;

//- add BaseDOMFormElement functions
sysFormFieldItem.prototype.DOMPulldownGetValue = sysBaseDOMFormElement.prototype.DOMPulldownGetValue;
sysFormFieldItem.prototype.DOMPulldownSetValue = sysBaseDOMFormElement.prototype.DOMPulldownSetValue;
sysFormFieldItem.prototype.getDOMFormElementValue = sysBaseDOMFormElement.prototype.getDOMFormElementValue;
sysFormFieldItem.prototype.setDOMFormElementValue = sysBaseDOMFormElement.prototype.setDOMFormElementValue;
sysFormFieldItem.prototype.DOMCheckboxGetChecked = sysBaseDOMFormElement.prototype.DOMCheckboxGetChecked;
sysFormFieldItem.prototype.DOMCheckboxSetChecked = sysBaseDOMFormElement.prototype.DOMCheckboxSetChecked;

sysFormFieldItem.prototype.DOMFormElementRemoveStyle = sysBaseDOMFormElement.prototype.DOMFormElementRemoveStyle;
sysFormFieldItem.prototype.DOMFormElementAddStyle = sysBaseDOMFormElement.prototype.DOMFormElementAddStyle;

//- add OnChangetHandler functions
sysFormFieldItem.prototype.checkLengthMismatch = sysFormFieldOnChangeHandler.prototype.checkLengthMismatch;
sysFormFieldItem.prototype.processOnChangeItem = sysFormFieldOnChangeHandler.prototype.processOnChangeItem;
sysFormFieldItem.prototype.processObjectsEnableOnValues = sysFormFieldOnChangeHandler.prototype.processObjectsEnableOnValues;
sysFormFieldItem.prototype.setupOnChangeConfig = sysFormFieldOnChangeHandler.prototype.setupOnChangeConfig;
sysFormFieldItem.prototype.processObjectsEnableOnValuesResetTabs = sysFormFieldOnChangeHandler.prototype.processObjectsEnableOnValuesResetTabs;
sysFormFieldItem.prototype.processObjectsEnableOnValuesActivate = sysFormFieldOnChangeHandler.prototype.processObjectsEnableOnValuesActivate;
sysFormFieldItem.prototype.processObjectsEnableOnValuesDeactivate = sysFormFieldOnChangeHandler.prototype.processObjectsEnableOnValuesDeactivate;

//- add IntervalHandler functions
sysFormFieldItem.prototype.processInterval = sysIntervalHandler.prototype.processInterval;

//- add SourceObjectHandler functions
sysFormFieldItem.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;


//------------------------------------------------------------------------------
//- METHOD "setAttributes"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.setAttributes = function(Attributes)
{

	if (this.ParentObject.JSONConfig !== undefined && this.ParentObject.JSONConfig.InstancePrefix !== undefined) {
		this.InstancePrefix = this.ParentObject.JSONConfig.InstancePrefix
	}

	if (Attributes.LabelFor !== undefined) {
		this.LabelFor = (this.InstancePrefix === undefined) ? Attributes.LabelFor : this.InstancePrefix + Attributes.LabelFor;
	}

	this.Type							= Attributes.Type;
	this.DescriptionTextID				= Attributes.TextID;
	this.DisplayText					= Attributes.DisplayText;

	this.Placeholder					= (Attributes.Placeholder === undefined) ? '' : Attributes.Placeholder;

	this.DOMStyle						= Attributes.GridStyle;

	this.DBColumn						= Attributes.DBColumn;

	this.ValidateRef					= Attributes.ValidateRef;
	this.ValidateNullable				= Attributes.ValidateNullable;

	this.FormFieldRefScreen				= Attributes.FormFieldRefScreen;
	this.FormFieldRefContainer			= Attributes.FormFieldRefContainer;
	this.FormFieldRef					= Attributes.FormFieldRef;

	this.StyleClass						= Attributes.Style;
	this.StyleClassOnFocus				= Attributes.StyleOnFocus;
	this.StyleClassValidateOk			= Attributes.StyleValidateOk;
	this.StyleClassValidateFail			= Attributes.StyleValidateFail;

	this.PulldownOptions				= Attributes.Options;
	this.DynPulldownURL					= Attributes.ServiceURL;
	this.DynPulldownServiceID			= Attributes.ServiceID;
	this.DynPulldownNoneItemDisplay		= (Attributes.DynPulldownNoneItemDisplay === undefined) ? 'Bitte auswählen' : Attributes.DynPulldownNoneItemDisplay;

	this.Disabled						= Attributes.Disabled;
	this.Deactivated					= Attributes.Deactivated;
	this.ReadOnly						= Attributes.ReadOnly;

	this.HTMLPrepend					= (Attributes.HTMLPrepend === undefined) ? '' : Attributes.HTMLPrepend;
	this.HTMLAppend						= (Attributes.HTMLAppend === undefined) ? '' : Attributes.HTMLAppend;

	this.OverrideValidate               = (Attributes.OverrideValidate === undefined) ? false : true;

	this.Value							= Attributes.Value;
	this.GlobalVar						= Attributes.GlobalVar;

	this.NumberMin						= Attributes.Min;
	this.NumberMax						= Attributes.Max;

	this.OnChange						= Attributes.OnChange;
	this.OnChangeDstObject				= Attributes.DstObject;
	this.OnChangeCompareObject			= Attributes.CompareObject;
	this.OnChangeDstMatchColumn			= Attributes.DstMatchColumn;
	this.OnChangeDstUpdateColumn		= Attributes.DstUpdateColumn;
	this.OnChangeDstUpdateValue			= Attributes.DstUpdateValue;
	this.OnChangeDstUpdateValueSrcObject= Attributes.DstUpdateValueSrcObject;
	this.OnChangeDstUpdateRowStyle		= Attributes.DstUpdateRowStyle;

	this.OnChangeType                   = (Attributes.OnChangeType === undefined) ? 'change' : Attributes.OnChangeType;

	this.Height							= Attributes.Height;

	this.MaxLength						= Attributes.MaxLength;

    this.UpdatePulldown					= Attributes.UpdatePulldown;
	this.UpdatePulldownValueSplitChar	= Attributes.UpdatePulldownValueSplitChar;
	this.UpdatePulldownValueStartIndex	= Attributes.UpdatePulldownValueStartIndex;
	this.UpdatePulldownValueEndIndex	= Attributes.UpdatePulldownValueEndIndex;
	this.UpdatePulldownPrependIndex		= Attributes.UpdatePulldownPrependIndex;
	this.UpdatePulldownPrependRegex		= Attributes.UpdatePulldownPrependRegex;

	this.AddNoneItem					= Attributes.AddNoneItem;
	this.AddNoneItemSingleItem			= Attributes.AddNoneItemSingleItem;

	this.UpdateOnEvent					= Attributes.UpdateOnEvent;

	this.TooltipText					= Attributes.TooltipText;
	this.TooltipSite					= Attributes.TooltipSite;

	this.VerticalGridStyle				= Attributes.VerticalGridStyle;
	this.VerticalGridAdd				= Attributes.VerticalGridAdd;
	this.VerticalGridLastElement		= Attributes.VerticalGridLastElement;

	this.UpdateOnTabSwitch				= Attributes.UpdateOnTabSwitch;

}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.init = function()
{
	this.doValidate = true;

	this.setAttributes(this.JSONConfig.Attributes);

	this.setupEventListenerObject();

	this.setupIntervalHandler();

	//this.setupOnMouseoverObject();
}


//------------------------------------------------------------------------------
//- METHOD "setAttributes"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.setupEvents = function()
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

sysFormFieldItem.prototype.setupIntervalHandler = function()
{
	if (this.JSONConfig.Attributes.CheckInterval !== undefined) {
		const Config = this.JSONConfig.Attributes.CheckInterval;
		//var XMLRPCHandler = new ValidateMultiDataXMLRPCHandler(Config, this);
		setTimeout(this.processInterval, Config.Interval, Config, this, ValidateMultiDataXMLRPCHandler);
	}
}


//------------------------------------------------------------------------------
//- METHOD "setupTabSwitchBehaviour"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.setupTabSwitchBehaviour = function()
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
//- METHOD "generateHTML"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.generateHTML = function()
{
	//------------------------------------------------------------------------------
	//- Calculate disabled, ReadOnly
	//------------------------------------------------------------------------------

	var FormDisabled = '';
	var FormReadOnly = '';

	if (this.Disabled == true)	{ FormDisabled = 'disabled'; }
	if (this.ReadOnly == true)	{ FormReadOnly = 'readOnly'; }

	if (this.GlobalVar !== undefined)	{
		this.Value = sysFactory.getGlobalVar(this.GlobalVar)
	}


	//------------------------------------------------------------------------------
	//- Generate Form Field HTML
	//------------------------------------------------------------------------------

	this.FormFieldHTML = this.HTMLPrepend;

	if (this.Type == 'text' || this.Type == 'number' || this.Type == 'password' || this.Type == 'file' || this.Type == 'date' || this.Type == 'hidden') {
		this.FormFieldHTML += '<input ';
		this.FormFieldHTML += 'type="' + this.Type + '" ';
		this.FormFieldHTML += 'id="' + this.ObjectID + '" ';

		this.FormFieldHTML += 'class="' + this.StyleClass + '" ';
		this.FormFieldHTML += 'placeholder="' + this.Placeholder + '" ';

		if (this.Value !== undefined) {
			this.FormFieldHTML += 'value="' + this.Value + '" ';
		}

		if (this.NumberMin !== undefined) {
			this.FormFieldHTML += 'min="' + this.NumberMin + '" ';
		}

		if (this.NumberMax !== undefined) {
			this.FormFieldHTML += 'max="' + this.NumberMax + '" ';
		}

		this.FormFieldHTML += FormDisabled + ' ' + FormReadOnly + '>';
	}

	if (this.Type == 'textarea') {
		this.FormFieldHTML += '<textarea ';
		this.FormFieldHTML += 'id="' + this.ObjectID + '" ';
		this.FormFieldHTML += 'class="' + this.StyleClass + '" ';
		this.FormFieldHTML += 'maxlength="' + this.MaxLength + '" ';
		this.FormFieldHTML += 'placeholder="' + this.Placeholder + '" ';

		if (this.Value !== undefined) {
			this.FormFieldHTML += 'value="' + this.Value + '" ';
		}

		this.FormFieldHTML += FormDisabled + ' ' + FormReadOnly + '>';
		this.FormFieldHTML += '</textarea>';
	}

	if (this.Type == 'checkbox') {
		this.FormFieldHTML += '<input type="checkbox" ';
		this.FormFieldHTML += 'id="' + this.ObjectID + '" ';
		this.FormFieldHTML += 'name="' + this.ObjectID + '" ';
		this.FormFieldHTML += 'class="' + this.StyleClass + '" ';
		if (this.Value == 1) { this.FormFieldHTML += 'checked'; }
		this.FormFieldHTML += '>';
	}

	if (this.Type == 'pulldown' || this.Type == 'dynpulldown' || this.Type == 'pulldowndummy') {

		var PulldownOptions = this.generatePulldownOptions();

		var PulldownProperties = FormDisabled + ' ' + FormReadOnly;

		this.FormFieldHTML += '<select ';
		this.FormFieldHTML += 'id="' + this.ObjectID + '" ';
		this.FormFieldHTML += 'class="' + this.StyleClass + '" ' + PulldownProperties + '>';
		this.FormFieldHTML += PulldownOptions;
		this.FormFieldHTML += '</select>';

	}

	if (this.Type == 'label') {
		this.FormFieldHTML += '<label for="' + this.LabelFor + '" ';
		this.FormFieldHTML += 'class="' + this.StyleClass + '">';
		this.FormFieldHTML += this.DisplayText;
		this.FormFieldHTML += '</label>';
	}

	if (this.Type == 'dummy') {
		this.FormFieldHTML = this.DisplayText;
	}

	this.FormFieldHTML += this.HTMLAppend;

	this.DOMValue = this.FormFieldHTML;
    this.setDOMElementValue();

}


//------------------------------------------------------------------------------
//- METHOD "generatePulldownOptions"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.generatePulldownOptions = function()
{
	var OptionsHTML = '';
	var Options = this.PulldownOptions;

	if (this.AddNoneItem == true && Options !== undefined && ( this.Type == 'pulldown' || this.Type == 'dynpulldown' ) ) {
		Options['<NULL>'] = new Object();
		Options['<NULL>']['DisplayText'] = this.DynPulldownNoneItemDisplay;
		Options['<NULL>']['Value'] = '<NULL>';
		if (this.AddNoneItemOverrideDefault !== true) {
			Options['<NULL>']['Default'] = true;
		}
	}

	for (OptionKey in Options) {
		var Item = Options[OptionKey];
		OptionsHTML += this.generateOptionHTML(Item);
        //console.log('::generatePulldownOptions ID:%s Value:%s', this.ID, Item.Value);
	}

	return OptionsHTML;
}


//------------------------------------------------------------------------------
//- METHOD "getDefault"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.getDefault = function()
{
	for (OptionKey in this.PulldownOptions) {
		var Item = this.PulldownOptions[OptionKey];
		if (Item.Default == true) { return OptionKey; }
	}
}


//------------------------------------------------------------------------------
//- METHOD "initReferencedPulldowns"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.initReferencedPulldowns = function()
{
	//- deactivate all dependend objects (no need for recursive processing)
	if (this.OnChange !== undefined && this.OnChange.ObjectsEnableOnValues !== undefined) {
		const EnableOnValuesElements = this.OnChange.ObjectsEnableOnValues;

		for (Key in EnableOnValuesElements) {
			var EnableElements = EnableOnValuesElements[Key];
			for (i in EnableElements) {
				try {
					Element = EnableElements[i];
					var ProcessObj = sysFactory.getObjectByID(Element);
					try {
						ProcessObj.setValidate(false);
					}
					catch(err) {
						console.debug('::initReferencedPulldowns Object not List Type and not providing setValidate() method. err:%s', err);
					}
					ProcessObj.Deactivated = true;
					ProcessObj.deactivate();
				}
				catch(err) {
					console.log('::initReferencedPulldowns err:%s', err);
				}
			}
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "generateOptionHTML"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.generateOptionHTML = function(Item)
{
	var selected = '';

	if (Item.Default == true) { selected = ' selected'; }

	var DisplayText = this.getPulldownDisplayText(Item);

	return '<option value="' + Item.Value + '"' + selected + '>' + DisplayText + '</option>';
}


//------------------------------------------------------------------------------
//- METHOD "getPulldownDisplayText"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.getPulldownDisplayText = function(OptionItem)
{
	if (OptionItem.TextID !== undefined) {
		var DisplayTextObj = sysFactory.ObjText.getTextObjectByID(OptionItem.TextID);
		return DisplayTextObj[sysFactory.EnvUserLanguage];
	}

	else if (OptionItem.DisplayText !== undefined) {
		return OptionItem.DisplayText;
	}

	else if (OptionItem.Value !== undefined) {
		return OptionItem.Value;
	}

	return '';
}


//------------------------------------------------------------------------------
//- METHOD "processSwitchScreen"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.processSwitchScreen = function()
{
	if (this.Type == 'dynpulldown' && this.PulldownDynLoaded == false) {
		this.updateValue();
	}
}


//------------------------------------------------------------------------------
//- METHOD "setValue"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.setValue = function(value)
{
	this.Value = value;
	this.updateValue();
}


//------------------------------------------------------------------------------
//- METHOD "updateValue"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.updateValue = function()
{
	this.DOMValue = this.Value;

	if (this.Type == 'dynpulldown') {
		this.getDynPulldownData();
	}
	else if (this.Type == 'pulldown') {
		this.DOMPulldownSetValue();
	}
	else if (this.Type == 'checkbox') {
		this.DOMCheckboxSetChecked();
	}
	else {
		this.setDOMFormElementValue();
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateRefValue"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.updateRefValue = function()
{
	//console.log(this.FormFieldRef);
	if (this.FormFieldRef != null) {
		this.DOMValue = sysFactory.getFormFieldValueByID(
			this.FormFieldRefScreen,
			this.FormFieldRefContainer,
			this.FormFieldRef
		);
		this.DOMFormSetValue();
	}
}


//------------------------------------------------------------------------------
//- METHOD "getDynPulldownData"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.getDynPulldownData = function()
{
    //console.debug('::getDynPulldownData DynPulldownServiceID:%s', this.DynPulldownServiceID);
	if (this.DynPulldownServiceID !== undefined) {

		this.PostRequestData = new sysRequestDataHandler();
		this.PostRequestData.addServiceProperty('ServiceID', this.DynPulldownServiceID);

		this.processSourceObjects();

	}

	RPC = new sysCallXMLRPC(this.DynPulldownURL);
	RPC.Request(this);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.callbackXMLRPCAsync = function()
{
	//- generate pulldown options/render
	this.generateDynPulldownOptions(this.XMLRPCResultData);

	//- deprecated when dynpulldown loading will be completely event driven
	this.PulldownDynLoaded = true;
}


//------------------------------------------------------------------------------
//- METHOD "PulldownIndexGenerator"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.PulldownIndexGenerator = function*()
{
	Index = 0;
	while(true) {
		Index += 1;
		yield Index.toString();
	}
}


//------------------------------------------------------------------------------
//- METHOD "generateDynPulldownOptions"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.generateDynPulldownOptions = function(PulldownOptions)
{
	this.PulldownOptions = new Object();

	//console.debug('::generateDynPulldownOptions PulldownOptions:%o', PulldownOptions);

	var IndexGenerator = this.PulldownIndexGenerator();

	for (OptionKey in PulldownOptions) {

		var OptionItem = PulldownOptions[OptionKey];
		var PulldownIndex = IndexGenerator.next().value;

		this.PulldownOptions[PulldownIndex] = new Object();
		this.PulldownOptions[PulldownIndex]['DisplayText'] = OptionItem.display;
		this.PulldownOptions[PulldownIndex]['Value'] = OptionItem.value;

		if (this.Value == OptionItem.value) {
			this.PulldownOptions[PulldownIndex]['Default'] = true;
			this.AddNoneItemOverrideDefault = true;
		}

	}

	//console.debug('::generateDynPulldownOptions PulldownOptions:%o', this.PulldownOptions);

	this.generateHTML();

}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.validate = function()
{
	//console.log('::validate type:%s OverrideValidate:%s', this.Type, this.OverrideValidate);

	//- ignore pulldown type
	//if (this.Type == 'pulldown' || this.Type == 'dynpulldown' || this.Type == 'dummy') { return true; }

	//- if do validate is set, do not validate
	if (this.doValidate !== true) { return true; }

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
//- METHOD "setValidateStyle"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.setValidateStyle = function(Result)
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

sysFormFieldItem.prototype.clearStyle = function()
{
	this.DOMFormElementRemoveStyle(this.StyleClassValidateOk);
	this.DOMFormElementRemoveStyle(this.StyleClassValidateFail);
}


//------------------------------------------------------------------------------
//- METHOD "disable"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.disable = function()
{
	this.Disabled = true;
	const Element = document.getElementById(this.ObjectID);
	if (Element != null && Element !== undefined) {
		Element.disabled = true;
	}
}


//------------------------------------------------------------------------------
//- METHOD "enable"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.enable = function()
{
	this.Disabled = false;
	const Element = document.getElementById(this.ObjectID);
	if (Element != null && Element !== undefined) {
		Element.disabled = false;
	}
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.reset = function()
{
	if (this.Type != 'pulldown') {
		this.setValue('');
	}
	if (this.Type == 'pulldown') {
		this.setValue('<NULL>');
	}
	this.DOMStyle = this.StyleClass;
}


//------------------------------------------------------------------------------
//- METHOD "focus"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.focus = function()
{
	const Element = document.getElementById(this.ObjectID);
	if (Element != null && Element !== undefined) {
		Element.focus();
	}
}


//------------------------------------------------------------------------------
//- METHOD "getRuntimeData"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.getRuntimeData = function()
{
	//console.log('getRuntimeData Type:%s ObjectID:%s' + this.ObjectID, this.Type);
	if (this.Type == 'checkbox') {
		return this.DOMCheckboxGetChecked();
	}
	if (this.Type != 'pulldown') {
		return this.getDOMValue();
	}
	if (this.Type == 'pulldown') {
		return this.DOMPulldownGetValue();
	}
}


//------------------------------------------------------------------------------
//- METHOD "setupEventListenerFormula"
//------------------------------------------------------------------------------

/*
 * check if method should be inherited by some kind of base class
 * when using in multiple object types
*/

sysFormFieldItem.prototype.setupEventListenerFormula = function(FormulaRefObject)
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

sysFormFieldItem.prototype.updateEventListenerFormula = function(FormulaRefObject)
{
	for (EventID in this.EventListeners) {
		const Listener = this.EventListeners[EventID];
		Listener.RefObject.updateValues();
	}
}


//------------------------------------------------------------------------------
//- METHOD "setupEventListenerObject"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.setupEventListenerObject = function()
{
	if (this.OnChange !== undefined) {
		try {
			this.EventListeners["OnChangeHandler"] = {
				"Type": this.OnChangeType,
				"Element": this.processOnChangeItem.bind(this)
			};
		}
		catch(err) {
			console.log('::setupEventListenerObject err:%s ObjectID:%s', err, this.ObjectID);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "setupOnHooverObject"
//------------------------------------------------------------------------------

sysFormFieldItem.prototype.setupOnMouseoverObject = function()
{
    try {
        var EventListenerObj = new Object();
        EventListenerObj['Type'] = 'mouseover';
        EventListenerObj['Element'] = this.processOnMouseover.bind(this);
        this.EventListeners["FormFieldOnMouseover"] = EventListenerObj;
    }
    catch(err) {
        console.log('::setupOnMouseoverObject err:%s ObjectID:%s', err, this.ObjectID);
    }
}


//------------------------------------------------------------------------------
//- METHOD "processOnMouseover"
//------------------------------------------------------------------------------

/*
 * method should be moved to sysTooltipHandler (same with tab tooltips)
 * 
*/

sysFormFieldItem.prototype.processOnMouseover = function()
{
    /*
    console.log('::processOnMouseover Tooltip FormFieldItem');
	var TooltipElement = document.getElementById('SYSGlobalTooltips');

    var setPosition = false;

    if (this.TooltipSite != null) {
		TooltipElement.innerHTML = '<object type="text/html data="'+this.TooltipSite+'" width="200" height="200" style="overflow:auto"></object>';
        setPosition = true;
	}

	if (this.TooltipText != null) {
        console.log('::processOnMouseover TooltipText set');
		TooltipElement.innerHTML = this.TooltipText;
        setPosition = true;
	}

	if (this.TooltipSite == null && this.TooltipText == null) {
		TooltipElement.innerHTML = '';
	}

	if (setPosition == true) {
        console.log('::processOnMouseover set Tooltip Position');
        var FormElement = document.getElementById(this.DOMObjectID);
        if (FormElement != null) {
            var x1pos = FormElement.getBoundingClientRect().left;
            var y1pos = FormElement.getBoundingClientRect().top;
            var x2pos = x1pos+FormElement.getBoundingClientRect().right;
            var y2pos = y1pos+FormElement.getBoundingClientRect().bottom;
            console.log('::processOnMouseover DIV Layer coordinates x1:%s y1:%s', x1pos, y1pos);
            TooltipElement.style.left = x1pos+'px';
            TooltipElement.style.top = y1pos+'px';
        }
    }
    */
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
