//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Button"                                                   -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjButton"
//------------------------------------------------------------------------------

function sysObjButton() {

    this.EventListeners		= new Object();
	this.ChildObjects		= new Array();

	this.PostRequestData	= new sysRequestDataHandler();

	this.CallURL			= null;
	this.CallService		= false;

	this.FormValidate		= false;

}

//- inherit sysBaseObject
sysObjButton.prototype = new sysBaseObject();

//- inherit methods
sysObjButton.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;
sysObjButton.prototype.processResetObjects = sysResetObjectHandler.prototype.processResetObjects;


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjButton.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.DOMStyle = Attributes.Style;

	if (Attributes.Disabled === true) {
		this.disable();
	}

	this.addEventListenerClick();

	//console.debug('Button ConfigAttributes TextID:%s', Attributes.TextID);

	var SQLTextObj = new sysObjSQLText();
	SQLTextObj.ObjectID = 'SQLText';
	SQLTextObj.TextID = Attributes.TextID;
	SQLTextObj.init();

	//console.debug('Button SQLText Object:%o', SQLTextObj);

	this.addObject(SQLTextObj);
}


//------------------------------------------------------------------------------
//- METHOD "enable"
//------------------------------------------------------------------------------

sysObjButton.prototype.enable = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.DOMStyle = Attributes.Style;

	this.setDOMElementStyle();

	this.Disabled = false;
}


//------------------------------------------------------------------------------
//- METHOD "disable"
//------------------------------------------------------------------------------

sysObjButton.prototype.disable = function()
{
	this.DOMStyle = 'sysButtonDisabled';
	this.setDOMElementStyle();
	this.Disabled = true;
}


//------------------------------------------------------------------------------
//- METHOD "addEventListenerClick"
//------------------------------------------------------------------------------

sysObjButton.prototype.addEventListenerClick = function()
{
	var EventListenerObj = new Object();
	EventListenerObj['Type'] = 'mousedown';
	EventListenerObj['Element'] = this.EventListenerClick.bind(this);

	this.EventListeners["ButtonClick"] = EventListenerObj;
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysObjButton.prototype.EventListenerClick = function(Event)
{
	console.debug('::EventListenerClick Button clicked.');

	const Attributes = this.JSONConfig.Attributes;

	if (this.Disabled !== true) {

		console.debug('::EventListenerClick Button not disabled.');

		this.CallURL = this.JSONConfig.Attributes.OnClick;
		this.CallService = false;

		//- trigger scrollTop
		this.scrollTop();

		//console.log('sysObjButton.EventListenerClick() JSONConfig:%o', this.JSONConfig);

		//- reset post request data
		this.PostRequestData.reset();

		//- process connected source objects
		this.processSourceObjects();

		//- process actions
		this.processActions();

		//- if no source objects connected, process formlistobjects
		this.processFormFieldListObjects();

	}
}


//------------------------------------------------------------------------------
//- METHOD "scrollTop"
//------------------------------------------------------------------------------

sysObjButton.prototype.scrollTop = function()
{
	if (sysFactory.ParentWindowURL !== undefined) {
		try {
			const Attributes = this.JSONConfig.Attributes;

			if (Attributes.ScrollTop !== undefined && Attributes.ScrollTop == true) {
				//console.debug('::validateForm ScrollTop:true');
				window.parent.postMessage({'task': 'scroll_top'}, sysFactory.ParentWindowURL);
			}
		}
		catch(err) {
			console.debug('::scrollTop err:%s', err);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "processFormFieldListObjects"
//------------------------------------------------------------------------------

sysObjButton.prototype.processFormFieldListObjects = function()
{
	var ValidateResult = this.validateForm();
	console.debug('sysObjButton ValidateResult:%s', ValidateResult);

	//- if validate ok, setup get params, call service
	if (ValidateResult === true) {
		/*
		console.log('##### BUTTON FORM VALIDATION OK #####');
		console.log(this.ConfigObject);
		console.log(this.PostRequestData);
		*/
		this.callService();
	}
}


//------------------------------------------------------------------------------
//- METHOD "callService"
//------------------------------------------------------------------------------
sysObjButton.prototype.callService = function()
{
	if (this.CallURL != null && this.CallURL !== undefined) {

		//- add async notify handler item
		this.addNotifyHandler();

		//- trigger async service request
		RPC = new sysCallXMLRPC(this.CallURL);
		RPC.Request(this);

	}
}


//------------------------------------------------------------------------------
//- METHOD "addNotifyHandler"
//------------------------------------------------------------------------------

sysObjButton.prototype.addNotifyHandler = function()
{
    try {
        var NotifyAttributes = this.JSONConfig.Attributes.Notify;
    
        sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(
            NotifyAttributes
        );
    }
    catch(err) {
		console.debug('::addNotifyHandler err:%s', err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "processActions"
//------------------------------------------------------------------------------

sysObjButton.prototype.processActions = function()
{
	const Attributes = this.JSONConfig.Attributes;

	console.debug('::processActions Attributes:%o', Attributes);

	if (Attributes.Action !== undefined) {

		if (Attributes.Action == 'Disable') {
			const DstObject = sysFactory.getObjectByID(ActionAttributes.DstObjectID);
			DstObject.disable();
		}

		if (Attributes.Action == 'Enable') {
			const DstObject = sysFactory.getObjectByID(ActionAttributes.DstObjectID);
			DstObject.enable();
		}

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

			console.debug('SetPOSTREquestData ColumnItem:%o', Item);

			var DstObject = sysFactory.getObjectByID(Attributes.DstObjectID);

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

		if (Attributes.Action == 'SetPOSTREquestData2') {

			const PColumn = Attributes.SrcColumn;
			var Item = new Object();
			const PColumnValue = this.ParentRow.SetupData[PColumn];
			Item[PColumn] = PColumnValue;

			console.debug('SetPOSTREquestData ColumnItem:%o', Item);

			this.PostRequestData.merge(Item);
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
					DstObj.activate();
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
	}
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysObjButton.prototype.callbackXMLRPCAsync = function()
{
	const MsgHandler = sysFactory.sysGlobalAsyncNotifyHandler;
	const NotifyStatus = 'ERROR';

	//- check error
	if (this.XMLRPCResultData.ErrorCode === undefined && this.XMLRPCResultData.error === undefined) {

		const ConfigAttributes = this.JSONConfig.Attributes;
		const SwitchScreen = ConfigAttributes.SwitchScreen;
		const SwitchTabContainer = ConfigAttributes.SwitchTabContainer;
		const SwitchTabID = ConfigAttributes.SwitchTabID;

		/*
		 * process on result actions
		 * 
		 * refactoring needed, make button, context menu and global logic generic
		*/

		if (ConfigAttributes.OnResult !== undefined) {

			console.debug('::ButtonAfterRPC ConfigAttributes:%o', ConfigAttributes.OnResult);

			var ResultConfig = ConfigAttributes.OnResult;

			if (Array.isArray(ResultConfig) === false) {
				ResultConfig = [ ResultConfig ];
			}

			for (Index in ResultConfig) {

				const Result = ResultConfig[Index];
				const setResultValues = Result.setResultValues;

				if (setResultValues !== undefined) {
					var DstObject = sysFactory.getObjectByID(setResultValues.DstObjectID);
					const SetData = this.XMLRPCResultData[setResultValues.ResultKey]; 
					DstObject.PostRequestData.add(SetData, setResultValues.ServiceKey);
					console.log('::ButtonAfterRPC setResultValues DstObject:%o PostRequestData:%o', DstObject, DstObject.PostRequestData);
				}

				const Action = Result.Action;
				if (Action !== undefined) {
					if (Result.DstObjectType == 'List' && Result.Action == 'append') {
						const DstObject = sysFactory.getObjectByID(Result.DstObjectID);
						console.log('::ButtonAfterRPC Action DstObject:%o', DstObject);
						DstObject.appendData(this.XMLRPCResultData);
					}
					if (Result.DstObjectType == 'FormField' && Result.Action == 'set') {
						const FormListObject = sysFactory.getObjectByID(Result.FormListID);
						const FormFieldItem = FormListObject.getFormFieldItemByID(Result.FormFieldID);
						const UpdateValue = this.XMLRPCResultData[Result.ResultKey];
						FormFieldItem.setValue(UpdateValue);
						console.log('::ButtonAfterRPC set Formfield FormListObject:%o FormFieldItem:%o UpdateValue:%s', FormListObject, FormFieldItem, UpdateValue);
						if (Result.UpdateDynPulldownFormListID !== undefined) {
							const UpdateFormListObject = sysFactory.getObjectByID(Result.UpdateDynPulldownFormListID);
							const UpdateFormFieldItem = UpdateFormListObject.getFormFieldItemByID(Result.UpdateDynPulldownFormFieldID);
							console.debug('::ButtonAfterRPC set UpdateDynPulldownFormListID UpdateFormListObject:%o UpdateFormFieldItem:%o UpdateValue:%s', UpdateFormListObject, UpdateFormFieldItem, UpdateValue);
							UpdateFormFieldItem.setValue(UpdateValue);
						}
					}
					if (Result.Action == 'UpdateDynValue') {
						const OnResultConfig = Result;
						const DstObject = sysFactory.getObjectByID(OnResultConfig.DstObjectID);

						var ResultObject = new Object();
						ResultObject[OnResultConfig.ResultKey] = this.XMLRPCResultData[OnResultConfig.ResultKey];

						/* WORKAROUND */
						if (ResultObject[OnResultConfig.ResultKey] === undefined) {
							ResultObject[OnResultConfig.ResultKey] = this.XMLRPCResultData[0][OnResultConfig.ResultKey];
						}

						DstObject.updateDynValue(ResultObject);
					}
					if (Result.Action == 'Enable') {
						const DstObject = sysFactory.getObjectByID(Result.DstObjectID);
						DstObject.enable();
					}
					if (Result.Action == 'Disable') {
						const DstObject = sysFactory.getObjectByID(Result.DstObjectID);
						DstObject.disable();
					}
					if (Result.Action == 'Activate') {
						const DstObject = sysFactory.getObjectByID(Result.DstObjectID);
						DstObject.setDOMVisibleState('visible');
					}
					if (Result.Action == 'Deactivate') {
						const DstObject = sysFactory.getObjectByID(Result.DstObjectID);
						DstObject.setDOMVisibleState('hidden');
					}
					if (Result.Action == 'Reset') {
						const DstObject = sysFactory.getObjectByID(Result.DstObjectID);
						DstObject.reset();
					}
					if (Result.Action == 'Focus') {
						const DstObject = sysFactory.getObjectByID(Result.DstObjectID);
						DstObject.focus();
					}

					if (Result.Action == 'TabSwitch') {
						const TabContainerObj = sysFactory.getObjectByID(Result.TabContainer);
						console.debug('TabContainerObj:%o', TabContainerObj);
						TabContainerObj.switchTab(Result.Tab);
					}
					//- global fire events
					if (Result.FireEvents !== undefined) {
						sysFactory.Reactor.fireEvents(Result.FireEvents);
					}
				}
			}
		}

		//- process reset objects
		this.processResetObjects();

		//- switch screen
		if (SwitchScreen !== undefined && SwitchScreen != false) {

			var ScreenObj = sysFactory.getScreenByID(this.ConfigAttributes.SwitchScreen);
			var ScreenRootObj = ScreenObj.ConfigRootObject;

			//- switch screen
			sysFactory.switchScreen(ConfigAttributes.SwitchScreen);

			//- reset form field styles
			sysFactory.clearFormStylesByScreenID(this.ScreenObject.ScreenID);

			//- reset form field values
			sysFactory.resetFormValuesByScreenID(this.ScreenObject.ScreenID);

		}

		//- switch screen tab
		if (SwitchTabContainer !== undefined && SwitchTabID !== undefined) {
			var TabObj = sysFactory.getObjectByID(SwitchTabContainer);
			TabObj.TabContainerObject.switchTab(SwitchTabID);
		}

        //- fire events
		sysFactory.Reactor.fireEvents(this.JSONConfig.Attributes.FireEvents);

		//- fire net events
		this.fireNetEvents();

		//- set notify status
		NotifyStatus = 'SUCCESS';
	}

	//- set notify status
    try {
        var IndicatorID = this.JSONConfig.Attributes.Notify.ID;
        if (IndicatorID !== undefined) {
            var Message = 'SYS__' + IndicatorID + '__' + NotifyStatus;
            MsgHandler.processMsg(Message);
        }
    }
    catch (err) {
        console.log('err:%s', err);
    }

}


//------------------------------------------------------------------------------
//- METHOD "fireNetEvents"
//------------------------------------------------------------------------------

/*
 * a) should be included by prototype 
 * b) destination session should be modified to destination user
 * c) configuration values should be read from global config
*/

sysObjButton.prototype.fireNetEvents = function()
{
	console.log('FireNetEvents config:%o', this.JSONConfig.Attributes.FireNetEvents);
	var Events = this.JSONConfig.Attributes.FireNetEvents;
	for (EventID in Events) {
		DstSessionID = Events[EventID];
		URL = '/python/MsgHandler.py';
		URLParams = '&Type=SET&DestinationSession='+DstSessionID+'&Payload=SYS__NET_EVENT-'+EventID;
		RPC = new sysCallXMLRPC(URL, URLParams);
		RPC.setRequestType('GET');
		RPC.Request();
	}
}


//------------------------------------------------------------------------------
//- METHOD "validateForm"
//------------------------------------------------------------------------------

/*
 *  :: refactoring
 *     - ValidateForm / ValidateObject Logic must be OOP conform / moved to Object(s) itself
*/

sysObjButton.prototype.validateForm = function()
{
	var ValidateResult = true;

	var ValidateFormListObjs = new Object();
	var ValidateObjectsConfig = this.JSONConfig.Attributes.ValidateObjects;

	for (i in ValidateObjectsConfig) {
		var ValidateObjectID = ValidateObjectsConfig[i];
		ValidateFormListObjs[ValidateObjectID] = true;
	}

	var ValidateObjectsDependendFormList = this.JSONConfig.Attributes.ValidateObjectsDependendFormList;
	var ValidateObjectsDependendFormField = this.JSONConfig.Attributes.ValidateObjectsDependendFormField;
	var ValidateObjectDependendValues = this.JSONConfig.Attributes.ValidateObjectsDependendValues;

	for (CheckValue in ValidateObjectDependendValues) {
		var DstFormListIDs = ValidateObjectDependendValues[CheckValue];
		var SrcFormList = sysFactory.getObjectByID(ValidateObjectsDependendFormList);
		var SrcFormField = SrcFormList.getFormFieldItemByID(ValidateObjectsDependendFormField);
		var SrcFormFieldValue = SrcFormField.getRuntimeData();
		if (SrcFormFieldValue == CheckValue) {
			if (Array.isArray(DstFormListIDs) != true) {
				DstFormListIDs = [ DstFormListIDs ];
			}
			for (i in DstFormListIDs) {
				try {
					DstFormListID = DstFormListIDs[i];
					const FormListObj = sysFactory.getObjectByID(DstFormListID);
					this.PostRequestData.merge(FormListObj.getFormFieldItemData());
					ValidateFormListObjs[DstFormListID] = true;
				}
				catch(e) {
				}
			}
		}
		//console.log('::validateForm CheckValue:%s DstFormListID:%s SrcFormList:%o SrcFormField:%o SrcFormFieldValue:%s', CheckValue, DstFormListID, SrcFormList, SrcFormField, SrcFormFieldValue);
	}

	//console.debug('::validateForm Button this:%o', this);

	//- reset all Screen Tabs "ValidateStatus"
	const ScreenTabs = this.ScreenObject.HierarchyRootObject.getObjectsByType('Tab');
	for (TabKey in ScreenTabs) {
		TabElement = ScreenTabs[TabKey];
		TabElement.setValidateStatus(true);
	}

	const FormListObjs = sysFactory.getFormFieldListObjectsByScreenObj(this.ScreenObject);

	//console.debug('::validateForm FormListObjects:%o ValidateFormListObjs:%o', FormListObjs, ValidateFormListObjs);

	for (ObjKey in FormListObjs) {

		var FormListObject = FormListObjs[ObjKey];
		var FormListValidateResult = true;
		console.debug('::validateForm FormListObjID:%s FormListObj:%o', ObjKey, FormListObject);

        var ParentObject;
		if (this.JSONConfig.Attributes.FormValidate === true &&
			FormListObject.doValidate === true
			&& ValidateFormListObjs[ObjKey] === true
		) {
			console.debug('::validateForm processing ItemID:%s', ObjKey);
			FormListValidateResult = FormListObject.validate();
            ParentObject = FormListObject.ParentObject;
            console.debug('::validateForm ParentObject:%o', ParentObject);
            if (ParentObject !== undefined && ParentObject.ObjectType == 'Tab') {
                ParentObject.setValidateStatus(FormListValidateResult);
            }
            if (ParentObject !== undefined && ParentObject.ObjectType == 'ServiceConnector') {
                ParentObject.ParentObject.setValidateStatus(FormListValidateResult);
            }
		}

		if (ParentObject !== undefined && ParentObject.ObjectType == 'Tab') {
            ParentObject.TabContainer.switchFirstTabContainingErrors();
        }
		if (ParentObject !== undefined && ParentObject.ObjectType == 'ServiceConnector') {
            ParentObject.ParentObject.TabContainer.switchFirstTabContainingErrors();
        }

		if (FormListValidateResult !== true) {
			ValidateResult = false;
		}
	}

	//- process other validate objects (non FormfieldList)
	if (ValidateResult === true) {
		//const ValidateObjects = this.ScreenObject.HierarchyRootObject.getObjectsByAttribute('Validate');

		const ValidateObjects = this.JSONConfig.Attributes.ValidateObjects;

		if (ValidateObjects !== undefined && this.JSONConfig.Attributes.FormValidate == true) {
			console.debug('::validateForm ValidateObjects:%o', ValidateObjects);

			for (ObjIndex in ValidateObjects) {

				const ValidateObjectID = ValidateObjects[ObjIndex];
				const ValidateObject = sysFactory.getObjectByID(ValidateObjectID);

				console.debug('::validate ValidateObject:%o', ValidateObject);

				if (ValidateObject !== undefined && ValidateObject.doValidate === true) {

					if (ValidateObject.ObjectType == 'FormFieldList') {
						this.PostRequestData.merge(ValidateObject.getFormFieldItemData());
					}

					if (	ValidateObject.JSONConfig !== undefined &&
							ValidateObject.JSONConfig.Attributes !== undefined &&
							ValidateObject.JSONConfig.Attributes.Validate !== undefined
					   ) {

						const ValidateObjectAttributes = ValidateObject.JSONConfig.Attributes.Validate;

						const ErrorObj = sysFactory.getObjectByID(ValidateObjectAttributes.ErrorContainer);
						console.debug('::validateForm ErrorContainer:%s ErrorObject:%o', ValidateObjectAttributes.ErrorContainer, ErrorObj);

						if (ErrorObj !== undefined) {
							ErrorObj.reset();
						}

						console.debug('::validateForm ValidateObject ValidateAttributes:%o', ValidateObjectAttributes);

						if (ValidateObjectAttributes.CheckValue === true && ValidateObjectAttributes.Operator == '==') {
							const ObjectData = ValidateObject.getObjectData();
							const CheckValue = ValidateObjectAttributes.Value;
							if (ObjectData == CheckValue) {
								ValidateResult = false;
								if (ErrorObj !== undefined) {
									ErrorObj.displayError(ValidateObjectAttributes.ErrorMessage);
								}
							}
						}

						if (ValidateObjectAttributes.Operator !== undefined && ValidateObjectAttributes.Operator == '!=') {
							const CheckProperty = ValidateObject[ValidateObjectAttributes.ObjectProperty];
							const CheckValue = ValidateObjectAttributes.Value;

							console.debug('::validateForm CheckProperty:%s CheckValue:%s', CheckProperty, CheckValue);

							if (CheckProperty != CheckValue) {
								ValidateResult = false;
								if (ErrorObj !== undefined) {
									ErrorObj.displayError(ValidateObjectAttributes.ErrorMessage);
								}
							}
						}

						if (ValidateObjectAttributes.UserFunction !== undefined) {

							console.debug('::validateForm UserFunction:%s', ValidateObjectAttributes.UserFunction);

							const ErrorMessage = sysFactory.UserFunctions[ValidateObjectAttributes.UserFunction](ValidateObjectAttributes.ObjectIDs);
							if (ErrorMessage !== false) {
								ValidateResult = false;
								if (ErrorObj !== undefined) {
									ErrorObj.displayError(ErrorMessage);
								}
							}
						}
					}
				}
			}
		}
	}


	//- add screen id to request data
	var IdObj = Object();
	IdObj['BackendServiceID'] = this.JSONConfig.Attributes.ServiceID;
	this.PostRequestData['ServiceData'] = IdObj;

	console.debug('::validate result:%s PostRequestData:%o', ValidateResult, this.PostRequestData);

	if (ValidateResult === true) {

		const Attributes = this.JSONConfig.Attributes;

		if (Attributes.OnValidateOk !== undefined) {
			if (Attributes.OnValidateOk.click !== undefined) {
				const ClickObject = sysFactory.getObjectByID(Attributes.OnValidateOk.click);
				ClickObject.EventListenerClick('ClickedBySystem');
			}
		}

		if (Attributes.POSTRequestDataTransform !== undefined) {
			this.PostRequestData.transform(Attributes.POSTRequestDataTransform);
		}

		if (Attributes.POSTRequestDataRemovePrefix !== undefined) {
			this.PostRequestData.removePrefix(Attributes.POSTRequestDataRemovePrefix);
		}

		if (this.JSONConfig.Attributes.ResetValidateOnSuccess == true) {
			for (ObjKey in FormListObjs) {
				var FormListConfigObj = FormListObjs[ObjKey];
				FormListConfigObj.clearStyle();
			}
		}

	}

	//- trigger iframe resize
	sysFactory.resizeIframe();

	return ValidateResult;
}
