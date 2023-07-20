//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2021                                 -//
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

	this.RuntimeGetDataFunc		= this.getFormfieldItemData;		//- Get Runtime Data (Formfield data Key/Value)
	this.RuntimeSetDataFunc		= this.setData;						//- Set Runtime Data

	this.DOMType				= 'form';							//- Enclosed Form Element
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

	if (this.CellGroupColumns !== undefined) {
		this.Segments = this.SegmentGenerator(this.CellGroupColumns);
		this.CellGroupGen = this.CellGroupGenerator();
	}
	this.CellEnclosedByGen = this.CellEnclosedByGenerator();

	console.debug('CellGroupColumns:%o DivEnclose:%o Segments:%o', this.CellGroupColumns, this.FormfieldEnclosedByDivStyle, this.Segments);

	for (FormIndex in Formfields) {

		const FormID = Formfields[FormIndex];

		//console.debug('::init this.ObjectID:%s FormIndex:%s FormObjectID:%s', this.ObjectID, FormIndex, FormID);

		try {
			const FormJSONConfig = sysFactory.DataObject.XMLRPCResultData[FormID];
			const Attributes = FormJSONConfig.Attributes;

			//console.debug('::init FormJSON:%o FormAttributes:%o', FormJSONConfig, Attributes);

			var FormObj = new sysFormfieldSelector(Attributes.Type);

			if (FormObj !== undefined) {
				FormObj.JSONConfig			= FormJSONConfig;

				FormObj.ObjectID			= 'enclose__' + FormID;
				FormObj.FormObjectID		= FormID;
				FormObj.overrideDOMObjectID	= true;
				FormObj.DOMObjectID			= this.ObjectID + '__enclose__' + FormID;
				FormObj.ObjectType			= Attributes.Type;
				FormObj.ScreenObject 		= this.ScreenObject;
				FormObj.ParentObject		= this;
				FormObj.Index				= FormIndex;

				FormObj.init();

				this.FormfieldItems[FormID] = FormObj;
			}
		}
		catch(err) {
			console.debug('Formfield:%s err:%s', FormID, err);
		}
	}

	this.render();
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
//- METHOD "render"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.render = function()
{

	const Attributes = this.JSONConfig.Attributes;
	const OrderedItems = this.getFormfieldItemsOrdered();

	console.debug('::render Attributes:%o OrderedItems:%o', Attributes, OrderedItems);

	for (Index in OrderedItems) {
		var FormItem = OrderedItems[Index];
		//FormItem.generateHTML();

		if (this.FormfieldEnclosedByDivStyle !== undefined) {
			console.debug('Enclose Object');
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
	//console.debug('::setData DataObj:%o Formfields:%o isOverlay:%s', DataObj, this.FormfieldItems, this.isOverlay);

	//console.debug('NewData:%o', NewData);

	if (DataObj !== undefined) {
		for (var FormID in this.FormfieldItems) {
			FormItem = this.FormfieldItems[FormID];
			//console.debug('FormItem:%o', FormItem);
			if (FormItem !== undefined) {
				FormItem.Value = DataObj[FormID];
				FormItem.updateFormItemValue();
			}
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

	const ErrorContainerID = (Attributes.ErrorContainerOverlay === true) ? Attributes.ErrorContainer + '__overlay' : Attributes.ErrorContainer;
	const ErrorObj = sysFactory.getObjectByID(ErrorContainerID);

	var ValidateStatus = true;

	console.debug('::validate ErrorContainerID:%s ErrorObj:%o', ErrorContainerID, ErrorObj);

	if (ErrorObj !== undefined) {
		ErrorObj.reset();

		var ErrorDisplayTextID;
		var ErrorDisplayText;

		for (Key in this.FormfieldItems) {
			console.debug('Formfield Key:%s', Key);
			const FormItem = this.FormfieldItems[Key];
			const FormValidateTextID = FormItem.JSONConfig.Attributes.ValidateTextID;
			if (FormItem.validate() === false) {
				console.debug('FormValidateTextID:%s', FormValidateTextID);
				ErrorDisplayTextID = (FormValidateTextID !== undefined) ? FormValidateTextID : 'TXT.SYS.ERROR.FORMVALIDATE.DEFAULT';
				ErrorDisplayText = sysFactory.getText(ErrorDisplayTextID); 
				ValidateStatus = false;
			}
		}

		// ----------------------------------------------------------------
		// - group validate
		// ----------------------------------------------------------------

		if (Attributes.GroupValidate !== undefined) {
			console.debug('GroupValidate:%o', Attributes.GroupValidate);
			for (GroupKey in Attributes.GroupValidate) {
				const GroupConf = Attributes.GroupValidate[GroupKey];
				const GroupFunction = GroupConf.FunctionRef;
				var Objects = new Array();
				for (ObjectKey in GroupConf.ObjectIDs) {
					Objects.push(sysFactory.getObjectByID(GroupConf.ObjectIDs[ObjectKey]));
				}
				const Result = sysFactory.ObjValidate.validateGroup(
					GroupFunction,
					Objects
				);
				if (Result['Error'] !== undefined && Result['Error'] === false) {
					ErrorDisplayText = Result['Message'];
					ValidateStatus = false;
				}
			}
		}

		// ----------------------------------------------------------------
		// - check validate status
		// ----------------------------------------------------------------

		if (ValidateStatus === false) {
			console.debug('ErrorObj:%o', ErrorObj);
			ErrorObj.displayError(ErrorDisplayText);
		}
	}

	return ValidateStatus;
}


//------------------------------------------------------------------------------
//- METHOD "getFormfieldItemData"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getFormfieldItemData = function()
{
	var ResultData = new Object();

	for (ItemKey in this.FormfieldItems) {
		const FormItem = this.FormfieldItems[ItemKey];
		//console.debug('FormfieldID:%s Item:%o', ItemKey, FormItem);
		const Result = FormItem.RuntimeGetDataFunc();
		if (Result !== undefined && Result !== null) {
			ResultData[ItemKey] = Result;
		}
	}

	//- TODO: think of placing somewhere else
	const InstancePrefix = this.JSONConfig.InstancePrefix;
	const OverlayPostfix = '__overlay';

	console.debug('InstancePrefix:%s', InstancePrefix);

	var NewData = new Object();

	for (DataKey in ResultData) {
		var NewKey = DataKey;
		NewKey = (InstancePrefix !== undefined) ? NewKey.replace(InstancePrefix, '') : NewKey;
		NewKey = NewKey.replace('__overlay', '');
		NewData[NewKey] = ResultData[DataKey];
	}

	return NewData;
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
	for (FormKey in this.FormfieldItems) {
		const FormItemID = this.FormfieldItems[FormKey].ObjectID;
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
//- METHOD "getFormfieldItemsOrdered"
//------------------------------------------------------------------------------

sysFormfieldList.prototype.getFormfieldItemsOrdered = function()
{
	var ReturnItems = new Array();
	for (ItemKey in this.FormfieldItems) {
		const FormItem = this.FormfieldItems[ItemKey];
		//console.debug('::getFormfieldItemsOrdered FormItem:%o', FormItem);
		ReturnItems.push(this.getFormfieldItemByIndex(FormItem.Index));
	}
	return ReturnItems;
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
	const FormOverlayPrefix = '__overlay';

	var NewFormfields = new Array();

	for (Index in FormlistFormfields) {

		FormID = FormlistFormfields[Index];
		FormOverlayID = (FormID.includes(FormOverlayPrefix)) ? FormID : FormID + FormOverlayPrefix;

		NewFormfields.push(FormOverlayID);

		var GlobalObjectConfig = sysFactory.DataObject.XMLRPCResultData;
		GlobalObjectConfig[FormOverlayID] = GlobalObjectConfig[FormID];

	}

	this.JSONConfig.Attributes.Formfields = NewFormfields;
	console.debug('Overlay Formfields:%o', this.JSONConfig.Attributes.Formfields);
}
