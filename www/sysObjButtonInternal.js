//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ButtonInternal"                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjButtonInternal"
//------------------------------------------------------------------------------

function sysObjButtonInternal() {
    this.EventListeners		= new Object();
	this.ChildObjects		= new Array();
    this.PostRequestData	= new sysRequestDataHandler();
}

//- inherit sysBaseObject
sysObjButtonInternal.prototype = new sysBaseObject();

//- inherit Button methods
sysObjButtonInternal.prototype.init = sysObjButton.prototype.init;
sysObjButtonInternal.prototype.addEventListenerClick = sysObjButton.prototype.addEventListenerClick;
sysObjButtonInternal.prototype.validateForm = sysObjButton.prototype.validateForm;
sysObjButtonInternal.prototype.processActions = sysObjButton.prototype.processActions;

//- inherit ContextMenu methods
sysObjButtonInternal.prototype.setDstScreenProperties = sysContextMenuItem.prototype.setDstScreenProperties;


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysObjButtonInternal.prototype.EventListenerClick = function(Event) {
	this.PostRequestData.reset();

	const Attributes = this.JSONConfig.Attributes;

	//- reset validate result to true
	var ValidateResult = true;

	//- validate form fields
	if (Attributes.FormValidate == true) {
		ValidateResult = this.validateForm();
	}

	if (ValidateResult == true) {
		this.processActions();
		sysFactory.Reactor.fireEvents(Attributes.FireEvents);
	}
}


//------------------------------------------------------------------------------
//- METHOD "copyData"
//------------------------------------------------------------------------------

sysObjButtonInternal.prototype.copyData = function() {

	const Attributes = this.JSONConfig.Attributes;

	var DstData = new Object();

	for (Index in Attributes.SrcObjects) {
		const ObjectID = Attributes.SrcObjects[Index];
		const ObjectData = sysFactory.getObjectByID(ObjectID).RuntimeGetDataFunc();
		console.debug('ObjectID:%s Data:%o', ObjectID, ObjectData);
		DstData = sysMergeObjects(DstData, ObjectData);
	}

	sysFactory.getObjectByID(Attributes.DstObject).RuntimeSetDataFunc(DstData);

	//- workaround because actually no multiple actions can be executed, has to be refactored
	if (Attributes.SwitchScreenID !== undefined) {
		sysFactory.switchScreen(Attributes.SwitchScreenID);
	}
}


//------------------------------------------------------------------------------
//- METHOD "resetList"
//------------------------------------------------------------------------------
sysObjButtonInternal.prototype.resetList = function() {
	var ScreenObj = sysFactory.getScreenByID(this.ConfigAttributes.ActionAttributes.ScreenID);
	ScreenObj.HierarchyRootObject.getObjectByID(this.ConfigAttributes.ActionAttributes.ObjectID).reset();
}


//------------------------------------------------------------------------------
//- METHOD "deselectList"
//------------------------------------------------------------------------------
sysObjButtonInternal.prototype.deselectList = function() {
	var ActionAttributes = this.ConfigAttributes.ActionAttributes;
	var ScreenObject = sysFactory.getScreenByID(ActionAttributes.ScreenID);
	var ListObject = ScreenObject.RootObject.getObjectByID(ActionAttributes.ObjectID);
	var ConstraintColumn = ActionAttributes.ConstraintColumn;
	var CheckValue = ActionAttributes.ConstraintCheckValue;
	var SrcDataRows = ListObject.getRuntimeData();

	//console.log(SrcDataRows);

	var IndexArray = new Array();

	for (RowIndex in SrcDataRows) {
		//console.log(RowIndex);
		//console.log(SrcDataRows[RowIndex]);
		if (SrcDataRows[RowIndex][ConstraintColumn] == CheckValue) {
			IndexArray.push(RowIndex);
		}
	}

	ListObject.removeMultiData(IndexArray);
	//console.log(ListObject.Data);
}


//------------------------------------------------------------------------------
//- METHOD "setDstObjectPostRequestData"
//------------------------------------------------------------------------------
sysObjButtonInternal.prototype.setDstObjectPostRequestData = function() {

	var DstScreen = this.ConfigAttributes.DstScreen;
	var DstObject = this.ConfigAttributes.DstObject;

	if (DstScreen !== undefined && DstObject !== undefined) {
		var ScreenObj = sysFactory.getScreenByID(this.ConfigAttributes.DstScreen);
		var DestinationObj = ScreenObj.HierarchyRootObject.getObjectByID(this.ConfigAttributes.DstObject);
		DestinationObj.PostRequestData = this.PostRequestData;
	}

	var DynValues = this.ConfigAttributes.DynamicValues;
	for (ValueKey in DynValues) {
		Value = DynValues[ValueKey];
		DestinationObj.PostRequestData.add(Value, ValueKey);
	}

}
