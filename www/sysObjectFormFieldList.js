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

function sysFormFieldList()
{
	this.FormFieldItems			= new Object();						//- Form Field Items
	this.ChildObjects			= new Array();						//- Child Objects
	this.CellGroups				= new Array();						//- CellGroups (Enclosed by given Div Style)
	this.CellGroupColumns		= null;								//- CellGroups Column Count
	this.CellGroupIndex			= 0;								//- CellGroups Index
	this.PostRequestData		= new sysRequestDataHandler();		//- Request Data Handler
	this.doValidate				= true;								//- If set false, do not validate
}

sysFormFieldList.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- Inherit Class Methods
//------------------------------------------------------------------------------

sysFormFieldList.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.init = function()
{
	this.DOMStyle = this.JSONConfig.Style;
    //this.DOMStyles = this.JSONConfig.AdditionalStyles;

	const Formfields = this.JSONConfig.Attributes.FormFields;

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

	//console.log('::init Formfields:%o', Formfields);

	for (FormIndex in Formfields) {
		FormObjectID = Formfields[FormIndex];
		//console.log('::init FormIndex:%s FormObjectID:%s', FormIndex, FormObjectID);
		var FormItem = new sysFormFieldItem();

		FormItem.JSONConfig		= sysFactory.DataObject.XMLRPCResultData[FormObjectID];

		FormItem.ObjectID		= FormObjectID;
		FormItem.ObjectType		= FormItem.JSONConfig.Type;
		FormItem.ScreenObject 	= this.ScreenObject;
		FormItem.ParentObject	= this;
		FormItem.Index			= FormIndex;

		FormItem.init();

		this.FormFieldItems[FormObjectID] = FormItem;
	}
}


//------------------------------------------------------------------------------
//- METHOD "CellEnclosedByGenerator"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.CellEnclosedByGenerator = function*()
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

sysFormFieldList.prototype.CellGroupGenerator = function*()
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

sysFormFieldList.prototype.SegmentGenerator = function*(Config)
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

sysFormFieldList.prototype.setupTabSwitchBehaviour = function()
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

sysFormFieldList.prototype.render = function()
{

	const Attributes = this.JSONConfig.Attributes;
	var OrderedItems = this.getFormFieldItemsOrdered();

	//console.debug('::render Attributes:%o OrderedItems:%o', Attributes, OrderedItems);

	for (Index in OrderedItems) {
		var FormItem = OrderedItems[Index];
		FormItem.generateHTML();

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

sysFormFieldList.prototype.getData = function()
{
	RPC = new sysCallXMLRPC(this.DataURL);
	RPC.Request(this);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.callbackXMLRPCAsync = function()
{
	//console.log('FormList XMLRPCResultData:%o', this.XMLRPCResultData);
	this.update();
}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.update = function()
{
	for (ItemKey in this.FormFieldItems) {

		FormItem = this.FormFieldItems[ItemKey];
		/*
		 * should be moved to FormFieldItem
		*/
		if (FormItem.DBColumn !== undefined && FormItem.DBColumn != null) {

			try {
				var RowData = this.XMLRPCResultData[0];
				var DBValue = RowData[FormItem.DBColumn];
				if (DBValue == null) { DBValue = ''; }

				FormItem.Value = DBValue;
				FormItem.updateValue();
			}
			catch(err) {
				console.debug('::update DBColumn:%s XMLRPCResult:%o', FormItem.DBColumn, this.XMLRPCResultData);
			}
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "setData"
//------------------------------------------------------------------------------
//- Overrides "update" Function to "setData" from "External"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.setData = function(DataObj)
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

sysFormFieldList.prototype.validate = function()
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

				for (FormFieldIndex in ValidateObj.FormFields) {
					var FormFieldID = ValidateObj.FormFields[FormFieldIndex];
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

sysFormFieldList.prototype.checkMaxSelected = function()
{
	var CountSelected = 0;
	const FormItems = this.getFormItemByType(['checkbox']);
	//console.debug('::getMaxSelected FormItems:%o', FormItems);
	for (i in FormItems) {
		const FormItem = FormItems[i];
		console.debug('::getMaxSelected Item:%o', FormItem);
		const FormValue = FormItem.getObjectData();
		console.debug('::getMaxSelected Value:%s', FormValue);
		if (FormItem.Type == 'checkbox' && FormValue === true) { CountSelected += 1; }
	}
	return CountSelected;
}


//------------------------------------------------------------------------------
//- METHOD "resetFormElementsDefault"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.resetFormElementsDefault = function()
{
	for (ItemKey in this.FormFieldItems) {
		this.FormFieldItems[ItemKey].reset();
	}
}


//------------------------------------------------------------------------------
//- METHOD "resetValidateStatus"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.resetValidateStatus = function()
{
	this.ValidateStatus = false;
}


//------------------------------------------------------------------------------
//- METHOD "disable"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.disable = function()
{
	for (ItemKey in this.FormFieldItems) {
		const FormItem = this.FormFieldItems[ItemKey];
		FormItem.disable();
	}

}


//------------------------------------------------------------------------------
//- METHOD "enable"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.enable = function()
{
	for (ItemKey in this.FormFieldItems) {
		const FormItem = this.FormFieldItems[ItemKey];
		FormItem.enable();
	}	
}


//------------------------------------------------------------------------------
//- METHOD "processSwitchScreen"
//------------------------------------------------------------------------------
sysFormFieldList.prototype.processSwitchScreen = function()
{
	for (ItemKey in this.FormFieldItems) {
		const FormItem = this.FormFieldItems[ItemKey];
		FormItem.processSwitchScreen();
	}
}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldItemData"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.getFormFieldItemData = function()
{
	var ResultData = new Object();

	for (ItemKey in this.FormFieldItems) {
		const FormItem = this.getFormFieldItemByID(ItemKey);
		if (FormItem.Type != 'label' &&  FormItem.Type != 'dummy') {
			ResultData[FormItem.ObjectID] = FormItem.getObjectData();
		}
	}

	return ResultData;
}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldItemByID"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.getFormFieldItemByID = function(ObjectID)
{
	return this.FormFieldItems[ObjectID];
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.reset = function()
{
	this.resetFormElementsDefault();
	this.resetValidateStatus();
}


//------------------------------------------------------------------------------
//- METHOD "clearStyle"
//------------------------------------------------------------------------------

//- for backwards compatibility, should be removed from sysFactory
//- (clearFormStylesByScreenID removed)
sysFormFieldList.prototype.clearStyle = function()
{
	this.reset();
}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldItemsByType"
//------------------------------------------------------------------------------

sysFormFieldList.prototype.getFormFieldItemsByType = function(Type)
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

sysFormFieldList.prototype.getFormFieldItemsOrdered = function()
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

sysFormFieldList.prototype.getFormFieldItemByIndex = function(CheckIndex)
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

sysFormFieldList.prototype.getFormItemByType = function(CheckTypes)
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

sysFormFieldList.prototype.updateInstanceObjectNames = function()
{
	//console.debug('::Instance FormfieldListID:%s Instanceprefix:%s', this.ObjectID, this.JSONConfig.InstancePrefix);
	var FormfieldConfig = this.JSONConfig.Attributes.FormFields;
	var NewFormfieldConfig = new Array();

	for (ItemIndex in FormfieldConfig) {

		ItemKey = FormfieldConfig[ItemIndex];
		NewKey = this.JSONConfig.InstancePrefix + ItemKey;

		NewFormfieldConfig.push(NewKey);

		var GlobalObjectData = sysFactory.DataObject.XMLRPCResultData;

		if (GlobalObjectData[NewKey] === undefined) {
			GlobalObjectData[NewKey] = sysFactory.DataObject.XMLRPCResultData[ItemKey];
		}

		//console.debug('NewObject:%o', GlobalObjectData[NewKey]);

		if (this.JSONConfig.SetAttributes !== undefined && this.JSONConfig.SetAttributes[ItemKey] !== undefined) {
			const SetObject = GlobalObjectData[NewKey];
			SetObject.Attributes = sysMergeObjects(SetObject.Attributes, this.JSONConfig.SetAttributes[ItemKey]);
			//console.debug('::Instance SetObject Merge:%o SetObject:%o', this.JSONConfig.SetAttributes[ItemKey], SetObject);
		}
	}
	this.JSONConfig.Attributes.FormFields = NewFormfieldConfig;
}
