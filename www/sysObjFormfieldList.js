//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
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
	this.ChildObjects			= new Array();						//- Child Objects

	this.CellGroups				= new Array();						//- CellGroups (Enclosed by given Div Style)
	this.CellGroupColumns		= null;								//- CellGroups Column Count
	this.CellGroupIndex			= 0;								//- CellGroups Index

	this.PostRequestData		= new sysRequestDataHandler();		//- Request Data Handler
	
	this.RuntimeGetDataFunc		= this.getFormFieldItemData;		//- Get Runtime Data (Formfield data Key/Value)
	this.RuntimeSetDataFunc		= this.setData;						//- Set Runtime Data
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

	this.ObjectShortID = 'FormList_' + this.ObjectID;

	const Formfields = this.JSONConfig.Attributes.Formfields;

	if (this.JSONConfig.Attributes.CellGroupColumns !== undefined) {
		this.CellGroupColumns = this.JSONConfig.Attributes.CellGroupColumns;
	}

	if (this.JSONConfig.Attributes.FormfieldEnclosedByDivStyle !== undefined) {
		this.FormfieldEnclosedByDivStyle = this.JSONConfig.Attributes.FormfieldEnclosedByDivStyle;
	}

	if (this.CellGroupColumns !== null) {
		this.Segments = this.SegmentGenerator(this.CellGroupColumns);
		this.CellGroupGen = this.CellGroupGenerator();
	}
	this.CellEnclosedByGen = this.CellEnclosedByGenerator();

	//console.debug('::init XMLRPCData:%o', sysFactory.DataObject.XMLRPCResultData);

	for (FormIndex in Formfields) {

		const FormID = Formfields[FormIndex];

		//console.debug('::init this.ObjectID:%s FormIndex:%s FormObjectID:%s', this.ObjectID, FormIndex, FormID);

		try {
			const FormJSONConfig = sysFactory.DataObject.XMLRPCResultData[FormID];
			const Attributes = FormJSONConfig.Attributes;

			//console.debug('::init FormJSON:%o FormAttributes:%o', FormJSONConfig, Attributes);

			var FormObj = sysFormfieldSelector(Attributes.Type);

			if (FormObj !== undefined) {
				FormObj.JSONConfig			= FormJSONConfig;

				FormObj.ObjectID			= 'enclose__' + FormID;
				FormObj.FormObjectID		= FormID;
				FormObj.ObjectType			= Attributes.Type;
				FormObj.ScreenObject 		= this.ScreenObject;
				FormObj.ParentObject		= this;
				FormObj.Index				= FormIndex;

				FormObj.init();

				this.addObject(FormObj);

				this.FormfieldItems[FormID] = FormObj;
			}
		}
		catch(err) {
			console.debug('Formfield:%s err:%s', FormID, err);
		}
	}

	//console.debug('::init FormfieldItems:%o', this.FormfieldItems);

}


//------------------------------------------------------------------------------
//- METHOD "CellEnclosedByGenerator"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.CellEnclosedByGenerator = function*()
{
	while(true) {
		for (Index in this.FormfieldEnclosedByDivStyle) {
			yield this.FormfieldEnclosedByDivStyle[Index];
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "CellGroupGenerator"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.CellGroupGenerator = function*()
{
	var ElementIndex = -1;
	var CheckCellGroupColumns = 0;
	var CurrentObject;

	var CellGroupCheck;

	while(true) {
		ElementIndex += 1;
		if (ElementIndex == 0 || CheckCellGroupColumns == CellGroupCheck-1) {
			CurrentObject = new sysObjDiv();
			CurrentObject.ObjectID = this.ObjectID + '_CellGroup' + this.CellGroupIndex;
			CurrentObject.DOMStyle = this.JSONConfig.Attributes.CellGroupStyle;
			CurrentObject.init();
			this.CellGroups.push(CurrentObject);
			CheckCellGroupColumns = -1;
			this.CellGroupIndex += 1;
			CellGroupCheck = this.Segments.next().value;
		}
		CheckCellGroupColumns += 1;
		yield CurrentObject;
	}
}


//------------------------------------------------------------------------------
//- METHOD "SegmentGenerator"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.SegmentGenerator = function*(Config)
{
	const SegmentAfter = (Array.isArray(Config)) ? Config : [ Config ]
	while(true) {
		for (Index in SegmentAfter) {
			yield SegmentAfter[Index];
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "setupTabSwitchBehaviour"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.setupTabSwitchBehaviour = function()
{
    var FormFieldItems = this.FormFieldItems;
	for (ItemKey in FormFieldItems) {
        var FormFieldItem = FormFieldItems[ItemKey];
		FormFieldItem.setupTabSwitchBehaviour();
	}
}


//------------------------------------------------------------------------------
//- METHOD "render"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.render = function()
{

	const Attributes = this.JSONConfig.Attributes;
	const OrderedItems = this.getFormFieldItemsOrdered();

	//console.debug('::render Attributes:%o OrderedItems:%o', Attributes, OrderedItems);

	for (Index in OrderedItems) {
		var FormItem = OrderedItems[Index];
		//FormItem.generateHTML();

		if (this.FormfieldEnclosedByDivStyle !== undefined) {
			var EncloseObj = new sysBaseObject();
			EncloseObj.ObjectID = FormItem.ObjectID + '_enclosedby';
			EncloseObj.DOMStyle = this.CellEnclosedByGen.next().value;
		}

		if (this.CellGroupColumns == null) {
			if (this.FormfieldEnclosedByDivStyle !== undefined) {
				EncloseObj.addObject(FormItem);
				this.addObject(EncloseObj);
			}
			else {
 				this.addObject(FormItem);
			}
		}
		else {
			var RefObject = this.CellGroupGen.next().value;
			//console.log('::render RefIndex:%o', RefObject);
			if (this.FormfieldEnclosedByDivStyle !== undefined) {
				EncloseObj.addObject(FormItem);
				RefObject.addObject(EncloseObj);
			}
			else {
				RefObject.addObject(FormItem);
			}
		}
	}

	this.ErrorObj = new sysBaseObject();
	this.ErrorObj.ObjectID = this.ObjectID + 'Error';
	this.addObject(this.ErrorObj);

	for (Index in this.CellGroups) {
		CellGroupObject = this.CellGroups[Index];
		this.addObject(CellGroupObject);
	}
}


//------------------------------------------------------------------------------
//- METHOD "getData"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getData = function()
{
	RPC = new sysCallXMLRPC(this.DataURL);
	RPC.Request(this);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.callbackXMLRPCAsync = function()
{
	//console.debug('sysFormfieldList update FormItems:%o', this.FormfieldItems);

	for (ItemKey in this.FormfieldItems) {
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
	for (Key in DataObj) {
		const Value = DataObj[Key];
		FormItem = this.FormFieldItems[Key];
		if (FormItem !== undefined) {
			FormItem.Value = Value;
			FormItem.updateValue();
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.validate = function()
{
	ErrorObj = sysFactory.getObjectByID(this.JSONConfig.Attributes.ErrorContainer);
	if (ErrorObj !== undefined) {
		ErrorObj.reset();
	}

	var ValidateStatus = true;

	for (ItemKey in this.FormFieldItems) {
		FormItem = this.FormFieldItems[ItemKey];
		var FormItemValidate = FormItem.validate();
		if (FormItemValidate == false) { ValidateStatus = false; }
	}

	const ConfigAttributes = this.JSONConfig.Attributes;

	if (ConfigAttributes !== undefined && ConfigAttributes.ValidateGroup !== undefined) {

		//console.debug('::validate grouped Formfield check ValidateGroup:%o', ConfigAttributes.ValidateGroup);

		for (ElementIndex in ConfigAttributes.ValidateGroup) {

			try {
				const ValidateObj = ConfigAttributes.ValidateGroup[ElementIndex];
				//console.debug('::validate grouped ElementIndex:%s', ElementIndex);
				//console.debug('::validate grouped ValidateObj:%o', ValidateObj);

				var FormItems = new Object();
				var ItemDeactivated = false;

				for (FormFieldIndex in ValidateObj.Formfields) {
					var FormFieldID = ValidateObj.Formfields[FormFieldIndex];
					var FormItem = sysFactory.getObjectByID(FormFieldID);
					//console.debug('::validate grouped FormItem:%o', FormItem);
					/*
					* Workaround, quick fix. If DependendOnGlobal is set on FormFieldList,
					* just the FormField List Object.Deactivated will be set to 1, not the relevant FormField
					*/
					if (FormItem.DependendDeactivated == true || FormItem.ParentObject.DependendDeactivated == true) {
						ItemDeactivated = true;
					}
					FormItems[FormFieldID] = FormItem;
				}

				if (ItemDeactivated == false) {
					var result = sysFactory.ObjFormValidate.validateGroup(ValidateObj.ValidateFunction, FormItems, ValidateObj.ValidateFunctionParams);
					//console.debug('::validate grouped FormItems:%o Result:%s', FormItems, result);
					if (result == false) {
						ValidateStatus = false;
						//console.debug('::validate grouped ErrorContainer adding error display div ObjectID:%s', this.ObjectID);
						if (ErrorObj !== undefined) {
							ErrorObj.displayError(ValidateObj.ValidateMessage);
						}
						//console.debug('::validate grouped processing error display Message:%s', ValidateObj.ValidateMessage);
					}
					//console.debug('::validate grouped Formfield check result:%s', result);
				}
			}
			catch(err) {
				console.log('::validate grouped err:%s ObjectID:%s DOMObjectID:%s', err, this.ObjectID, this.DOMObjectID);
			}
		}
	}

	const MaxSelected = ConfigAttributes.MaxSelected;
	if (MaxSelected !== undefined) {
		if (this.checkMaxSelected() > MaxSelected) {
			ErrorObj.displayError(ConfigAttributes.ErrorMessage);
			ValidateStatus = false;
		}
	}

	return ValidateStatus;
}


//------------------------------------------------------------------------------
//- METHOD "checkMaxSelected"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.checkMaxSelected = function()
{
	var CountSelected = 0;
	const FormItems = this.getFormItemByType(['checkbox']);
	//console.debug('::getMaxSelected FormItems:%o', FormItems);
	for (i in FormItems) {
		const FormItem = FormItems[i];
		//console.debug('::getMaxSelected Item:%o', FormItem);
		const FormValue = FormItem.getObjectData();
		//console.debug('::getMaxSelected Value:%s', FormValue);
		if (FormItem.Type == 'checkbox' && FormValue === true) { CountSelected += 1; }
	}
	return CountSelected;
}


//------------------------------------------------------------------------------
//- METHOD "resetFormElementsDefault"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.resetFormElementsDefault = function()
{
	for (ItemKey in this.FormFieldItems) {
		this.FormFieldItems[ItemKey].reset();
	}
}


//------------------------------------------------------------------------------
//- METHOD "disable"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.disable = function()
{
	for (ItemKey in this.FormFieldItems) {
		const FormItem = this.FormFieldItems[ItemKey];
		FormItem.disable();
	}

}


//------------------------------------------------------------------------------
//- METHOD "enable"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.enable = function()
{
	for (ItemKey in this.FormFieldItems) {
		const FormItem = this.FormFieldItems[ItemKey];
		FormItem.enable();
	}
}


//------------------------------------------------------------------------------
//- METHOD "processSwitchScreen"
//------------------------------------------------------------------------------
sysFormfieldList.prototype.processSwitchScreen = function()
{
	for (ItemKey in this.FormFieldItems) {
		const FormItem = this.FormFieldItems[ItemKey];
		FormItem.processSwitchScreen();
	}
}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldItemData"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getFormFieldItemData = function()
{
	//console.debug('getFormFieldItemData this:%o', this);
	var ResultData = new Object();

	for (ItemKey in this.FormfieldItems) {
		const FormItem = this.FormfieldItems[ItemKey];
		//console.debug('FormfieldID:%s Item:%o', ItemKey, FormItem);
		const Result = FormItem.RuntimeGetDataFunc();
		if (Result !== undefined && Result !== null) {
			ResultData[ItemKey] = Result;
		}
	}

	return ResultData;
}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldItemByID"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getFormFieldItemByID = function(ObjectID)
{
	return this.FormFieldItems[ObjectID];
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.reset = function()
{
	this.resetFormElementsDefault();
}


//------------------------------------------------------------------------------
//- METHOD "clearStyle"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.clearStyle = function()
{
	this.reset();
}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldItemsByType"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getFormFieldItemsByType = function(Type)
{
	var ResultData = new Object();

	for (ItemKey in this.FormFieldItems) {
		var FormItem = this.getFormFieldItemByID(ItemKey);
        if (FormItem.Type == Type) {
            ResultData[FormItem.ID] = FormItem;
        }
	}

	return ResultData;
}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldItemsOrdered"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getFormFieldItemsOrdered = function()
{
	var ReturnItems = new Array();
	for (ItemKey in this.FormFieldItems) {
		const FormItem = this.FormFieldItems[ItemKey];
		//console.debug('::getFormFieldItemsOrdered FormItem:%o', FormItem);
		ReturnItems.push(this.getFormFieldItemByIndex(FormItem.Index));
	}
	return ReturnItems;
}


//------------------------------------------------------------------------------
//- METHOD "getFormItemByIndex"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getFormFieldItemByIndex = function(CheckIndex)
{
	for (ItemKey in this.FormFieldItems) {
        FormItem = this.FormFieldItems[ItemKey];
        FormItemIndex = FormItem.Index;
        //console.log('::getFormItemByIndex FormItemIndex:%s CheckIndex:%s ObjectID:%s', FormItemIndex, CheckIndex, this.ObjectID);
		if (FormItemIndex == CheckIndex) {
            //console.log('::getFormItemByIndex return Item:%o', FormItem);
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
		for (ItemKey in this.FormFieldItems) {
			const FormItem = this.FormFieldItems[ItemKey];
			if (FormItem.Type == CheckType) { FormItems.push(FormItem); }
		}
	}
	return FormItems;
}


//------------------------------------------------------------------------------
//- METHOD "updateInstanceObjectNames"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.updateInstanceObjectNames = function()
{
	//console.debug('::Instance FormfieldListID:%s Instanceprefix:%s', this.ObjectID, this.JSONConfig.InstancePrefix);
	const FormfieldConfig = this.JSONConfig.Attributes.Formfields;

	var NewFormfieldConfig = new Array();

	for (ItemIndex in FormfieldConfig) {

		ItemKey = FormfieldConfig[ItemIndex];
		NewKey = this.JSONConfig.InstancePrefix + ItemKey;

		NewFormfieldConfig.push(NewKey);

		var GlobalObjectData = sysFactory.DataObject.XMLRPCResultData;

		if (GlobalObjectData[NewKey] === undefined) {
			const SrcFormJSON = sysFactory.DataObject.XMLRPCResultData[ItemKey];
			GlobalObjectData[NewKey] = SrcFormJSON;
		}

		//console.debug('NewObject:%o', GlobalObjectData[NewKey]);

		if (this.JSONConfig.SetAttributes !== undefined && this.JSONConfig.SetAttributes[ItemKey] !== undefined) {
			const SetObject = GlobalObjectData[NewKey];
			SetObject.Attributes = sysMergeObjects(SetObject.Attributes, this.JSONConfig.SetAttributes[ItemKey]);
			//console.debug('::Instance SetObject Merge:%o SetObject:%o', this.JSONConfig.SetAttributes[ItemKey], SetObject);
		}
	}
	//console.debug('NewFormfieldConfig:%o', NewFormfieldConfig);
	this.JSONConfig.Attributes.Formfields = NewFormfieldConfig;
}


//------------------------------------------------------------------------------
//- METHOD "rewriteOverlayFormitemNames"
//------------------------------------------------------------------------------

//-> Due to Screen with identical Formfield DOM IDs already exists in DOM:
//-> We have to prefix all FormfieldList Formitem IDs with "overlay__",
//-> so they are referencable again.

sysFormfieldList.prototype.rewriteOverlayFormitemNames = function()
{
	const FormlistFormfields = this.JSONConfig.Attributes.Formfields;

	var NewFormfields = new Array();

	for (Index in FormlistFormfields) {

		FormID = FormlistFormfields[Index];
		FormOverlayID = FormID + '__overlay';
		NewFormfields.push(FormOverlayID);

		var GlobalObjectConfig = sysFactory.DataObject.XMLRPCResultData;
		GlobalObjectConfig[FormOverlayID] = GlobalObjectConfig[FormID];
	}
	this.JSONConfig.Attributes.Formfields = NewFormfields;
}
