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

//- inherit ContextMenu methods
sysObjButtonInternal.prototype.setDstScreenProperties = sysContextMenuItem.prototype.setDstScreenProperties;


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysObjButtonInternal.prototype.EventListenerClick = function(Event) {

	this.PostRequestData.reset();

	var Attributes = this.JSONConfig.Attributes;

	//- reset validate result to true
	var ValidateResult = true;

	//- validate form fields
	if (Attributes.FormValidate == true) {
		ValidateResult = this.validateForm();
	}

	if (ValidateResult == true) {

		console.debug('::EventListenerClick Config Attributes Action:%s', Attributes.Action);

		//- copy object data
		if (Attributes.Action == 'copy') {
			this.copyData();
		}

		//- reset list
		if (Attributes.Action == 'reset') {
			const DstObject = sysFactory.getObjectByID(Attributes.ActionAttributes.ObjectID);
			DstObject.reset();
		}

		//- deselect list
		if (Attributes.Action == 'deselect') {
			var ObjType = Attributes.ActionAttributes.ObjectType;
			if (ObjType !== undefined && ObjType == 'List') {
				this.deselectList();
			}
		}

		//- switch tab
		if (Attributes.Action == 'tabswitch') {
            var TabContainerObj = sysFactory.getObjectByID(Attributes.ActionAttributes.TabContainer);
            //console.debug('TabContainerObj:%o', TabContainerObj);
            TabContainerObj.switchTab(Attributes.ActionAttributes.Tab);
		}

		//- screen overlay trigger
		if (Attributes.Action == 'screenoverlay') {
			sysFactory.switchScreenToOverlay(Attributes.Screen, Attributes.Override);
		}

		if (Attributes.Action == 'parentcopyrow') {
			var DstListObj = sysFactory.getObjectByID(Attributes.DstObjectID);
            //console.debug('::EventListenerClick copy DstObjectID:%o ListObject:%o RowData:%o', Attributes.DstObjectID, DstListObj, this.ParentRow);
			DstListObj.appendData(this.ParentRow.SetupData);
		}

		if (Attributes.Action == 'parentremoverow') {
			this.ParentRow.SourceObject.removeData(this.ParentRow.Index);
		}

		if (Attributes.Action == 'SetPOSTREquestData') {

			const Column = Attributes.SrcColumn;
			var Item = new Object();
			const ColumnValue = this.ParentRow.SetupData[Column];
			Item[Column] = ColumnValue;
			var DstObject = sysFactory.getObjectByID(Attributes.DstObjectID);

			if (Attributes.SetDBPrimaryKey === true) {
				const ScreenObj = sysFactory.getScreenByID(Attributes.SetDBPrimaryKeyScreen);
				ScreenObj.DBPrimaryKeyValue = ColumnValue;
			}

			if (Attributes.ResetObjectID !== undefined) {
				const ResetObject = sysFactory.getObjectByID(Attributes.ResetObjectID);
				//console.debug('ResetObject:%o ObjectID:%s', ResetObject, ResetObject.ObjectID);
				ResetObject.reset();
			}

			try {
				DstObject.PostRequestData.merge(Item);
			}
			catch(err) {
				console.log('::EventListenerClick PostRequestData err:%s', err);
			}

			try {
				DstObject.FocusObjectID = Attributes.SetFocusObjectID;
			}
			catch(err) {
				console.log('::EventListenerClick FocusObjectID err:%s', err);
			}
		}

		if (Attributes.Action == 'setrowcolumn') {
			try {
				const Column = Attributes.RowColumn;
				var Item = new Object();
				Item[Column] = this.ParentRow.SetupData[Column];
				const DstObject = sysFactory.getObjectByID(Attributes.DstObjectID);
				try {
					DstObject.PostRequestData.merge(Item);
				}
				catch(err) {
					console.log('::EventListenerClick PostRequestData err:%s', err);
				}
				DstObject.setValue(this.ParentRow.SetupData[Column]);
				//console.debug('::EventListenerClick setrowcolumn ConnectorObject:%o', DstObject);
			}
			catch(err) {
				console.log('::EventListenerClick setrowcolumn err:%s', err);
			}
		}

		if (Attributes.Action == 'addrow') {
			const DstObj = sysFactory.getObjectByID(Attributes.DstObjectID);
			DstObj.addDynamicRow();
		}

		if (Attributes.Action == 'switchscreen') {
			const ScreenObject = sysFactory.getScreenByID(Attributes.DstScreenID);
			//console.debug(this.ParentRow.SetupData);
			ScreenObject.DBPrimaryKeyValue = this.ParentRow.SetupData[Attributes.DBPrimaryKeyColumn];
			ScreenObject.DBPrimaryKeyID = Attributes.DBPrimaryKeyColumn;
			this.DstScreenID = Attributes.DstScreenID;
		}

		if (Attributes.Action == 'columndependend') {
			const RowData = this.ParentRow.SetupData;
			//console.debug('columndependend Attributes:%o RowData:%o', Attributes, RowData);
			for (Index in Attributes.ColumnDependend) {
				const ColConfig = Attributes.ColumnDependend[Index];
				if (ColConfig.Column1 !== undefined) {
					Col1Value = RowData[ColConfig.Column1];
					Col1Compare = ColConfig.Column1Value;
				}
				if (ColConfig.Column2 !== undefined) {
					Col2Value = RowData[ColConfig.Column2];
					Col2Compare = ColConfig.Column2Value;
				}
				if (ColConfig.Column1 !== undefined && ColConfig.Column2 !== undefined) {
					if (Col1Value == Col1Compare && Col2Value == Col2Compare) {
						this.DstScreenID = ColConfig.DstScreenID;
						break;
					}
				}
				else if (ColConfig.Column1 !== undefined) {
					if (Col1Value == Col1Compare) {
						this.DstScreenID = ColConfig.DstScreenID;
						break;
					}
				}
			}
		}

		if (Attributes.Action == 'activate' || Attributes.Action == 'deactivate') {
			for (Index in Attributes.Objects) {
				const ObjectID = Attributes.Objects[Index];
				const DstObj = sysFactory.getObjectByID(ObjectID);
				if (Attributes.Action == 'activate') {
					console.debug('::activate ObjectID:%s Object:%o', ObjectID, DstObj);
					try {
						DstObj.setValidate(true);
					}
					catch(err) {
					}
					DstObj.activateForce();
				}				
				if (Attributes.Action == 'deactivate') {
					try {
						DstObj.setValidate(false);
					}
					catch(err) {
					}
					DstObj.deactivate();
				}
			}
		}

		if (this.DstScreenID !== undefined && Attributes.Action !== undefined) {
			if (Attributes.ResetAll === true) {
				//console.debug('ButtonInternalDBG ResetAll:%s', Attributes.ResetAll);
				const ScreenObj = sysFactory.getScreenByID(this.DstScreenID);
				ScreenObj.HierarchyRootObject.processReset();
			}

			this.setDstScreenProperties();
			sysFactory.switchScreen(this.DstScreenID);
		}

		//- fire events
		sysFactory.Reactor.fireEvents(Attributes.FireEvents);

	}

}


//------------------------------------------------------------------------------
//- METHOD "copyData"
//------------------------------------------------------------------------------
sysObjButtonInternal.prototype.copyData = function() {

    var Attributes = this.JSONConfig.Attributes;
	var ScreenObject = sysFactory.getScreenByID(Attributes.SrcScreen);

	var SrcDataRow = new Object();
	var SrcObjects;

	if (Attributes.SrcType == 'ListRow' && Attributes.SrcColumn !== undefined) {
		//console.log(sysFactory.getObjectByID(Attributes.SrcObject));
		const DstObject = sysFactory.getObjectByID(Attributes.DstObject);
		const SrcValue = this.ParentRow.SetupData[Attributes.SrcColumn];
		DstObject.setValue(SrcValue);
	}

	if (Attributes.SrcObject !== undefined && Attributes.SrcType == 'List') {
		//console.log(sysFactory.getObjectByID(Attributes.SrcObject));
		const ListObject = sysFactory.getObjectByID(Attributes.SrcObject);
		const SrcDataRows = ListObject.getRuntimeData();
		//console.debug('RuntimeData:%o', SrcDataRows);
	}

	//-- new style of getting global data from objects (not using type)
	if (Attributes.SrcObjects !== undefined && Attributes.SrcObjects.Mapping !== undefined) {
		SrcObjects = Attributes.SrcObjects.Mapping;

		//console.debug('::copy SrcObjects:%o', SrcObjects);

		for (SrcObjectID in SrcObjects) {
			const DstData = SrcObjects[SrcObjectID];
			//console.debug('::copy DstData:%o', DstData);
			if (typeof DstData === 'object') {
				for (SrcObjectID2 in DstData) {
					const SrcColumn = DstData[SrcObjectID2];
					SrcDataRow[SrcColumn] = sysFactory.getObjectByID(SrcObjectID2).getRuntimeData();
				}
			}
			else {
				//console.debug('::copy set single value');
				SrcDataRow[DstData] = sysFactory.getObjectByID(SrcObjectID).getRuntimeData();
			}
		}
		//console.debug('::copy SrcDataRow:%o', SrcDataRow);
	}

	if (Attributes.SrcObject !== undefined && Attributes.SrcType == 'FormFieldList') {

		var FormListObject = sysFactory.getFormFieldListObjectByID(ScreenObject, Attributes.SrcObject);

		var SrcObjects = Attributes.SrcObjects;

		for (SrcObjectKey in SrcObjects) {
			const SourceColumn = SrcObjects[SrcObjectKey];
			console.debug('::copyData SourceColumn:%s ObjectID:%s', SourceColumn, SrcObjectKey);
			const FormFieldItem = FormListObject.getFormFieldItemByID(SrcObjectKey);
			SrcDataRow[SourceColumn] = FormFieldItem.getRuntimeData();
		}
	}

	if (Attributes.DstObject !== undefined && Attributes.DstType == 'List') {

		var ScreenObj = sysFactory.getScreenByID(Attributes.DstScreen);
		var ListObj = ScreenObj.HierarchyRootObject.getObjectByID(Attributes.DstObject);
		var CriterionColumn = Attributes.SrcCriterionColumn;

		//- process src list type
		if (Attributes.SrcType == 'List') {
			for (RowIndex in SrcDataRows) {
				if (CriterionColumn === undefined) {
                    var AppendData = SrcDataRows[RowIndex];
					//console.debug('::copyData Append Row with Index:%s Data:%o', RowIndex, AppendData);
					ListObj.appendData(AppendData);
				}
				if (CriterionColumn !== undefined) {
					RowObject = SrcDataRows[RowIndex];
					//console.debug('::copyData Append Row Criterion Column:%o Index:%d', RowObject, RowIndex);
					if (RowObject[CriterionColumn] == 'true') {
						ListObj.appendData(RowObject);
					}
				}
			}
		}

		//- process src form field list type
		if (Attributes.SrcType == 'FormFieldList') {
			//console.debug('::copyData SrcType:FormFieldList SrcDataRow:%o', SrcDataRow);
			ListObj.appendData(SrcDataRow);
		}

	}

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
