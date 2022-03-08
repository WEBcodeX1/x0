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

function sysObjButtonInternal()
{
	this.EventListeners		= new Object();
	this.ChildObjects		= new Array();
	this.PostRequestData	= new sysRequestDataHandler();
}

sysObjButtonInternal.prototype = new sysBaseObject();

sysObjButtonInternal.prototype.init = sysObjButton.prototype.init;
sysObjButtonInternal.prototype.addEventListenerClick = sysObjButton.prototype.addEventListenerClick;
sysObjButtonInternal.prototype.validateForm = sysObjButton.prototype.validateForm;
sysObjButtonInternal.prototype.processActions = sysObjButton.prototype.processActions;

sysObjButtonInternal.prototype.setDstScreenProperties = sysContextMenuItem.prototype.setDstScreenProperties;


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysObjButtonInternal.prototype.EventListenerClick = function(Event)
{
	this.PostRequestData.reset();

	const Attributes = this.JSONConfig.Attributes;

	if (this.validateForm() === true) {
		this.processActions();
		sysFactory.Reactor.fireEvents(Attributes.FireEvents);
	}
}


//------------------------------------------------------------------------------
//- METHOD "copyData"
//------------------------------------------------------------------------------

sysObjButtonInternal.prototype.copyData = function()
{
	const Attributes = this.JSONConfig.Attributes;

	console.debug('Attributes:%o', Attributes);

	var DstData = new Object();

	for (Index in Attributes.SrcObjects) {
		const inOverlay = Attributes.SrcObjectsInOverlay;
		const tmpID = Attributes.SrcObjects[Index];
		const ObjectID = (inOverlay === true) ? tmpID + '__overlay' : tmpID;
		console.debug('SrcObject ObjectID:%s', ObjectID);
		const ObjectData = sysFactory.getObjectByID(ObjectID).RuntimeGetDataFunc();
		DstData = sysMergeObjects(DstData, ObjectData);
	}

	console.debug('DstObjectID:%s DstData:%o', Attributes.DstObject, DstData);

	const DstObject = sysFactory.getObjectByID(Attributes.DstObject);

	console.debug('DstObject:%o DstDataPrepared:%o', DstObject, DstData);

	if (Attributes.DstObjectRowIDColumn !== undefined) {
		const InstancePrefix = DstObject.JSONConfig.InstancePrefix;
		const OverlayPostfix = '__overlay';

		var NewData = new Object();

		for (DataKey in DstData) {
			var NewKey = DataKey;
			NewKey = (InstancePrefix !== undefined) ? NewKey.replace(InstancePrefix, '') : NewKey;
			NewKey = NewKey.replace('__overlay', '');
			NewData[NewKey] = DstData[DataKey];
		}

		const Index = NewData[Attributes.DstObjectRowIDColumn];
		DstObject.updateRow(Index, NewData);
	}
	else if (Attributes.DstScreenGlobal !== undefined) {
		console.debug('DstScreenGlobal:%s', Attributes.DstScreenGlobal);
		const DstScreenObj = sysFactory.getScreenByID(Attributes.DstScreenGlobal);
		DstScreenObj.mergeGlobalVars(DstData);
		console.debug('GlobalVars:%o', DstScreenObj.getGlobalVars());
	}
	else {
		DstObject.RuntimeSetDataFunc(DstData);
	}

	//- workaround because actually no multiple actions can be executed, has to be refactored
	if (Attributes.SwitchScreenID !== undefined) {
		sysFactory.switchScreen(Attributes.SwitchScreenID);
	}
}


//------------------------------------------------------------------------------
//- METHOD "deselectList"
//------------------------------------------------------------------------------

sysObjButtonInternal.prototype.deselectList = function()
{
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

sysObjButtonInternal.prototype.setDstObjectPostRequestData = function()
{
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
