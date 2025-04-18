//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
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
	this.FormfieldItems			= new Object();						//- Form Field Items
	this.FormfieldItemsHidden	= new Object();						//- Form Field Items Hidden

	this.EventListeners			= new Object();						//- Event Listeners
	this.ChildObjects			= new Array();						//- Child Objects

	this.PostRequestData		= new sysRequestDataHandler();		//- Request Data Handler

	this.RuntimeGetDataFunc		= this.getFormfieldItemData;		//- Get Runtime Data (Formfield data Key/Value)
	this.RuntimeSetDataFunc		= this.setData;						//- Set Runtime Data

	this.DOMType				= 'form';							//- Enclosed Form Element

	this.ValidateGroupObj		= new sysFormFieldValidateGroup();	//- Validate Group Object
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

	this.DOMStyle = this.JSONConfig.Style;

	const Sections = this.JSONConfig.Attributes.Sections;

	for (const SectionItem of Sections) {

		const Formfields = SectionItem.Formfields;

		for (const FormID of Formfields) {
			const FormJSONConfig = sysFactory.DataObject.XMLRPCResultData[FormID];
			this.FormfieldItems[FormID] = this.setupFormItem(
				FormID, FormJSONConfig.Attributes, FormJSONConfig
			);
		}
	}

	try {
		for (const FormID of Attributes.HiddenFields) {
			const FormJSONConfig = sysFactory.DataObject.XMLRPCResultData[FormID];
			const FormItem = this.setupFormItem(FormID, FormJSONConfig.Attributes, FormJSONConfig);
			this.FormfieldItemsHidden[FormID] = FormItem;
			this.addObject(FormItem);
		}
	}
	catch(err) {
	}

	//console.debug('::init FormfieldItems:%o', this.FormfieldItems);

	var EventListenerObj = new Object();
	EventListenerObj['Type'] = 'mousedown';
	EventListenerObj['Element'] = this.EventListenerRightClick.bind(this);
	this.EventListeners['ContextMenuOpen'] = EventListenerObj;

	this.render();
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerRightClick"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.EventListenerRightClick = function(Event)
{
	var ContextMenuItems = this.JSONConfig.Attributes.ContextMenuItems;

	//- check for right click on mousedown
	if (Event.button == 2 && ContextMenuItems !== undefined) {

		var ContextMenu = new sysContextMenu();

		ContextMenu.ID 					= 'CtMenu_' + this.ObjectID;
		ContextMenu.ItemConfig 			= ContextMenuItems;
		ContextMenu.ScreenObject 		= this.ScreenObject;
		ContextMenu.ParentObject 		= this;
		ContextMenu.pageX 				= Event.pageX;
		ContextMenu.pageY 				= Event.pageY;

		ContextMenu.init();
	}
}


//------------------------------------------------------------------------------
//- METHOD "setupFormItem"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.setupFormItem = function(FormID, Attributes, FormJSONConfig)
{
	try {
		var FormObj = new sysFormfieldSelector(Attributes.Type);

		FormObj.JSONConfig			= FormJSONConfig;
		FormObj.ObjectID			= FormID;

		FormObj.ScreenObject 		= this.ScreenObject;
		FormObj.ParentObject		= this;

		FormObj.init();
		return FormObj;
	}
	catch(err) {
	}
}


//------------------------------------------------------------------------------
//- METHOD "render"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.render = function()
{
	const Attributes = this.JSONConfig.Attributes;

	console.debug('::render Attributes:%o', Attributes);

	const Sections = this.JSONConfig.Attributes.Sections;

	for (const SectionItem of Sections) {

		var SectionHeaderObj = new sysFactory.SetupClassesRT[SectionItem.Object](
			this,
			SectionItem.ObjectAttributes
		);
		SectionHeaderObj.ObjectID = 'SH_' + SectionItem.ID;
		SectionHeaderObj.init();

		//var SectionHeaderObj = new sysFormSectionHeader(this, SectionItem.ObjectAttributes);

		const Formfields = SectionItem.Formfields;

		var FormObjects = new Array();
		for (const FormID of Formfields) {
			FormObjects.push(this.FormfieldItems[FormID]);
		}

		var GridGenerator = new sysGridGenerator(FormObjects);

		GridGenerator.init(
			SectionItem.RowStyle,
			SectionItem.ColStyle,
			SectionItem.RowAfterElements,
			SectionItem.ColAfterElements
		);

		const RowItems = GridGenerator.generate();
		console.debug('::genGrid RowItems:%o', RowItems);

		for (const RowItem of RowItems) {
			SectionHeaderObj.ContainerObj.addObject(RowItem);
		}
		this.addObject(SectionHeaderObj);
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
	for (const ItemKey in this.FormfieldItems) {
		FormItem = this.FormfieldItems[ItemKey];
		//console.debug('update Key:%s FormItem:%o', ItemKey, FormItem);
		FormItem.updateDBValue(this.XMLRPCResultData[0]);
	}
}


//------------------------------------------------------------------------------
//- METHOD "setData"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.setData = function(DataObj)
{
	for (const ItemKey in this.FormfieldItems) {
		try {
			FormItem = this.FormfieldItems[ItemKey];
			//console.debug('FormItem:%o', FormItem);
			FormItem.RuntimeSetDataFunc(DataObj[ItemKey]);
		}
		catch {
			console.debug('sysFormfieldList ::setData ItemKey:%s error DataObj:%o', ItemKey, DataObj);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.validate = function()
{
	const Attributes = this.JSONConfig.Attributes;

	console.debug('::validate Attributes:%o', Attributes);

	const Ovrlay = Attributes.ErrorContainerOverlay;
	const ErrorContainerID = (Ovrlay === true) ? Attributes.ErrorContainer + '__overlay' : Attributes.ErrorContainer;
	const ErrorObj = sysFactory.getObjectByID(ErrorContainerID);

	var ValidateStatus = true;

	console.debug('::validate ErrorContainerID:%s ErrorObj:%o', ErrorContainerID, ErrorObj);

	if (ErrorObj !== undefined) {
		ErrorObj.reset();

		var ErrorDisplayText;
		var ErrorDetailDisplayText;

		for (Key in this.FormfieldItems) {
			const FormItem = this.FormfieldItems[Key];
			console.debug('::validate FormfieldID:%s', Key);
			const FormAttributes = FormItem.JSONConfig.Attributes;
			const TxtID = FormAttributes.ValidateErrorTextID;
			const ErrorDisplayTextID = (TxtID !== undefined) ? TxtID : 'TXT.SYS.ERROR.FORMVALIDATE.DEFAULT';
			console.debug('::validate FormValidateErrorTextID:%s', ErrorDisplayTextID);
			const RetValue = FormItem.validate();
			console.debug('::validate RetValue:%s', RetValue);

			var ValidateError;
			if (typeof RetValue == 'object' && RetValue['Error'] == true) {
				ErrorDetailDisplayText = RetValue['Message'];
				ValidateError = RetValue['Error'];
			}
			else {
				ValidateError = RetValue;
			}

			if (ValidateError == true) {
				ErrorDisplayText = sysFactory.getText(ErrorDisplayTextID);
				ValidateStatus = false;
				//break; #TODO: make this configurable (break on first val-error occurence or display all)
			}
		}

		// ----------------------------------------------------------------
		// - group validate
		// ----------------------------------------------------------------

		if (Attributes.GroupValidate !== undefined && ValidateError == false) {

			for (GroupItem of Attributes.GroupValidate) {

				const GTxtID = GroupItem.ValidateErrorTextID;
				const GroupErrorDisplayTextID = (GTxtID !== undefined) ? GTxtID : 'TXT.SYS.ERROR.FORMVALIDATE.DEFAULT';
				ErrorDisplayText = sysFactory.getText(GroupErrorDisplayTextID);

				console.debug('GroupValidate:%o', GroupItem);

				const GroupFunction = GroupItem.FunctionRef;
				var FormObjects = new Array();
				for (FormID of GroupItem.ObjectIDs) {
					FormObjects.push(sysFactory.getObjectByID(FormID));
				}
				const Result = this.ValidateGroupObj.validate(
					GroupFunction,
					FormObjects
				);
				if (Result['Error'] !== undefined && Result['Error'] == true) {
					ErrorDetailDisplayText = Result['Message'];
					ValidateStatus = false;
				}
			}
		}

		// ----------------------------------------------------------------
		// - check validate status
		// ----------------------------------------------------------------
		console.debug('::validate ValidateStatus:%s', ValidateStatus);
		if (ValidateStatus == false) {
			console.debug('ErrorObj:%o', ErrorObj);
			ErrorObj.displayError(ErrorDisplayText, ErrorDetailDisplayText);
		}
	}

	return ValidateStatus;
}


//------------------------------------------------------------------------------
//- METHOD "getFormfieldItemData"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getFormfieldItemData = function()
{
	console.debug('::getFormfieldItemData');
	var ResultData = new Object();

	for (ItemKey in this.FormfieldItems) {
		const FormItem = this.FormfieldItems[ItemKey];
		//console.debug('FormfieldID:%s Item:%o', ItemKey, FormItem);
		const Result = FormItem.getObjectData();
		if (Result !== undefined && Result != null) {
			ResultData[ItemKey] = Result;
		}
	}

	for (ItemKey in this.FormfieldItemsHidden) {
		const FormItem = this.FormfieldItemsHidden[ItemKey];
		//console.debug('FormfieldID:%s Item:%o', ItemKey, FormItem);
		const Result = FormItem.getObjectData();
		if (Result !== undefined && Result != null) {
			ResultData[ItemKey] = Result;
		}
	}

	console.debug('::getFormfieldItemData ResultData:%o', ResultData);
	return ResultData;
}


//------------------------------------------------------------------------------
//- METHOD "getFormfieldItemByID"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getFormfieldItemByID = function(ObjectID)
{
	return this.FormfieldItems[ObjectID];
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.reset = function()
{
	console.debug('Formlist reset() called.');
	for (ItemKey in this.FormfieldItems) {
		const FormItemID = this.FormfieldItems[ItemKey].ObjectID;
		const FormItemObj = sysFactory.getObjectByID(FormItemID);
		console.debug('reset Object:%o', FormItemObj);
		FormItemObj.reset();
	}
}


//------------------------------------------------------------------------------
//- METHOD "clearStyle"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.clearStyle = function()
{
	this.reset();
}


//------------------------------------------------------------------------------
//- METHOD "getFormfieldItemsByType"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getFormfieldItemsByType = function(Type)
{
	var ResultData = new Object();

	for (ItemKey in this.FormfieldItems) {
		var FormItem = this.getFormfieldItemByID(ItemKey);
		if (FormItem.Type == Type) {
			ResultData[FormItem.ID] = FormItem;
		}
	}

	return ResultData;
}


//------------------------------------------------------------------------------
//- METHOD "getFormfieldItemByIndex"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getFormfieldItemByIndex = function(CheckIndex)
{
	for (ItemKey in this.FormfieldItems) {
		FormItem = this.FormfieldItems[ItemKey];
		FormItemIndex = FormItem.Index;
		//console.log('::getFormfieldItemByIndex FormItemIndex:%s CheckIndex:%s ObjectID:%s', FormItemIndex, CheckIndex, this.ObjectID);
		if (FormItemIndex == CheckIndex) {
			//console.log('::getFormfieldItemByIndex return Item:%o', FormItem);
			return FormItem;
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "getFormItemByType"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getFormItemByType = function(CheckTypes)
{
	var FormItems = new Array();
	for (i in CheckTypes) {
		const CheckType = CheckTypes[i];
		for (ItemKey in this.FormfieldItems) {
			const FormItem = this.FormfieldItems[ItemKey];
			if (FormItem.Type == CheckType) { FormItems.push(FormItem); }
		}
	}
	return FormItems;
}


//------------------------------------------------------------------------------
//- METHOD "initOnChangeItems"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.initOnChangeItems = function()
{
	console.debug('::initOnChangeItems');
	for (ItemKey in this.FormfieldItems) {
		//console.debug('ItemKey:%s', ItemKey);
		this.FormfieldItems[ItemKey].processOnChangeItem();
	}
}
