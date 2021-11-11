//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "FormFieldOnChangeHandler" Object                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- FormFieldOnChangeHandler Object                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormFieldOnChangeHandler"
//------------------------------------------------------------------------------

function sysFormFieldOnChangeHandler() {
}


//------------------------------------------------------------------------------
//- METHOD "checkLengthMismatch"
//------------------------------------------------------------------------------

sysFormFieldOnChangeHandler.prototype.checkLengthMismatch = function(Length, CheckLength, ValidateProperties)
{
	if (ValidateProperties.DataLengthIgnore !== undefined) {
		const DataLengthParams = ValidateProperties.DataLengthIgnore;
		if (
			(DataLengthParams.gt == true && Length > CheckLength) ||
			(DataLengthParams.lt == true && Length < CheckLength)
		) {
			if (DataLengthParams.reset == true) {
				this.reset();
			}
			return false;
		}
		return true;
	}
}


//------------------------------------------------------------------------------
//- METHOD "processOnChangeItem"
//------------------------------------------------------------------------------

sysFormFieldOnChangeHandler.prototype.processOnChangeItem = function()
{

	//console.log('::processOnChangeItem Processing OnChange Item:%o', this);

	const JSONConfig = this.JSONConfig.Attributes.OnChange;
    const OnChangeConfig = Array.isArray(JSONConfig) ? JSONConfig : [ JSONConfig ];

	for (i in OnChangeConfig) {
		const OnChangeElement = OnChangeConfig[i];

		//console.debug('::processOnChangeItem OnChangeElement:%o', OnChangeElement);

		if (OnChangeElement.DeactivateRefObjects !== undefined) {
			const ValidateFunction = sysFactory.UserFunctions[OnChangeElement.DeactivateRefObjectFunction];
			const Result = ValidateFunction(this.getRuntimeData());
			const DeactivateObjects = OnChangeElement.DeactivateRefObjects;
			for (Index in DeactivateObjects) {
				try {
					ObjectID = DeactivateObjects[Index];
					DestinationObject = sysFactory.getObjectByID(ObjectID);
					//console.debug('DeactivateRefObjects ObjectID:%s Result:%s DestinationObject:%o', ObjectID, Result, DestinationObject);
					if (Result === false) {
						DestinationObject.deactivate();
						DestinationObject.Deactivated = true;
						try {
							DestinationObject.setValidate(false);
						}
						catch(err) {
						}
					}
					if (Result === true) {
						DestinationObject.Deactivated = false;
						DestinationObject.activate();
						try {
							DestinationObject.setValidate(true);
						}
						catch(err) {
						}
					}
				}
				catch (err) {
					console.debug('DeactivateRefObjects DstObj:%s err:%s', ObjectID, err);
				}
			}
		}

		if (OnChangeElement.UpdateFormfield !== undefined) {
			try {
				const ObjectID = (this.InstancePrefix === undefined) ? OnChangeElement.UpdateFormfield : this.InstancePrefix + OnChangeElement.UpdateFormfield;
				const DestinationObject = sysFactory.getObjectByID(ObjectID);
				const FormElementValue = this.getDOMFormElementValue();
				const CurrentLength = FormElementValue.length;
				const CharsLeft = (OnChangeElement.MaxLength - CurrentLength);
				const Value = OnChangeElement.UpdateTextPrefix + CharsLeft + OnChangeElement.UpdateTextPostfix;
				DestinationObject.DOMValue = Value;
				DestinationObject.setDOMElementValue();

				//console.log('::processOnChangeItem FooterObject:%o CurrentLength:%s CharsLeft:%s', ListAdditionalFooterObj, CurrentLength, CharsLeft);
			}
			catch (err) {
				console.debug('FormfieldOnChangeHandler UpdateFormfield err:%s', err);
			}
		}

		if (OnChangeElement.OnChecked === true) {
			//console.debug('::processOnChangeItem OnChangeElement:%o', OnChangeElement);
			try {
				const ObjectID = (this.InstancePrefix === undefined) ? OnChangeElement.ObjectID : this.InstancePrefix + OnChangeElement.ObjectID;
				const DstObj = sysFactory.getObjectByID(ObjectID);
				const Value = this.getRuntimeData();
				console.debug('::processOnChangeItem OnValue ObjectID:%s', ObjectID);
				//console.debug('::processOnChangeItem OnValue Object Runtime Data:%s OnChangeValue:%s', FormValue, OnChangeElement.OnValue);
				if (Value === true) {
					DstObj.enable();
				}
				else {
					DstObj.disable();
				}
			}
			catch (err) {
				console.debug('FormfieldOnChangeHandler OnChecked err:%s', err);
			}
		}

		if (OnChangeElement.OnValue !== undefined) {
			console.debug('::processOnChangeItem OnChangeElement:%o', OnChangeElement);
			try {
				const ObjectID = (this.InstancePrefix === undefined) ? OnChangeElement.ObjectID : this.InstancePrefix + OnChangeElement.ObjectID;
				console.debug('::processOnChangeItem OnValue Prefix:%s ObjectID:%s EObjectID:%s', this.InstancePrefix, ObjectID, OnChangeElement.ObjectID);
				const DstObj = sysFactory.getObjectByID(ObjectID);
				const FormValue = this.getRuntimeData();
				//console.debug('::processOnChangeItem OnValue Object Runtime Data:%s OnChangeValue:%s', FormValue, OnChangeElement.OnValue);
				if (FormValue == OnChangeElement.OnValue) {
					DstObj.enable();
				}
				else {
					DstObj.disable();
				}
			}
			catch (err) {
				console.debug('FormfieldOnChangeHandler OnChange err:%s', err);
			}
		}

		if (OnChangeElement.ActivateOnValues !== undefined) {

			const ObjectID = (this.InstancePrefix === undefined) ? OnChangeElement.ObjectID : this.InstancePrefix + OnChangeElement.ObjectID;
			var DstObj = sysFactory.getObjectByID(ObjectID);
			var FormValue = this.getRuntimeData();
			//console.debug('::processOnChangeItem ActivateOnValues FormValue:', FormValue);
			var ActiveOnValues = OnChangeElement.ActivateOnValues;
			for (i in ActiveOnValues) {
				if (ActiveOnValues[i] == FormValue) {
					//console.debug('::processOnChangeItem enable()');
					DstObj.Deactivated = false;
					DstObj.activate();
					DstObj.enable();
				}
			}
			var DeactivateOnValues = OnChangeElement.DeactivateOnValues;
			for (i in DeactivateOnValues) {
				if (DeactivateOnValues[i] == FormValue) {
					//console.debug('::processOnChangeItem disable()');
					DstObj.disable();
					DstObj.deactivate();
					DstObj.Deactivated = true;
				}
			}
		}

		if (OnChangeElement.ObjectsEnableOnValues !== undefined) {
			this.processObjectsEnableOnValues(OnChangeElement);
		}

		if (OnChangeElement.EnableDependOnValues !== undefined) {

			const EnableDependOnValues = OnChangeElement.EnableDependOnValues;

			for (DependID in EnableDependOnValues) {
				const DependItem = EnableDependOnValues[DependID];
				if (DependItem.DependOn !== undefined) {
					const DependOnActivate = DependItem.DependOnActivate;
					for (DisableID in DependOnActivate) {
						const DisableArray = DependOnActivate[DisableID];
						for (Index in DisableArray) {
							console.debug('::DisableObject ObjectID:%s', DisableArray[Index]);
							const DisableObject = sysFactory.getObjectByID(DisableArray[Index]);
							DisableObject.setValidate(false);
							DisableObject.Deactivated = true;
							DisableObject.deactivate();
						}
					}
				}
				else {
					for (Index in DependItem) {
						const DisableObject = sysFactory.getObjectByID(DependItem[Index]);
						DisableObject.setValidate(false);
						DisableObject.Deactivated = true;
						DisableObject.deactivate();
					}
				}
			}

			for (DependValue in EnableDependOnValues) {
				const DependItem = EnableDependOnValues[DependValue];
				if (this.getRuntimeData() == DependValue) {
					if (DependItem.DependOn !== undefined) {
						const DependendObject = sysFactory.getObjectByID(DependItem.DependOn);
						const DependendObjectValue = DependendObject.getRuntimeData();
						const ActivateArray = DependItem.DependOnActivate[DependendObjectValue];
						for (Index in ActivateArray) {
							const EnableObject = sysFactory.getObjectByID(ActivateArray[Index]);
							EnableObject.setValidate(true);
							EnableObject.Deactivated = false;
							EnableObject.activate();
						}
						
					}
					else {
						for (Index in DependItem) {
							const EnableObject = sysFactory.getObjectByID(DependItem[Index]);
							EnableObject.setValidate(true);
							EnableObject.Deactivated = false;
							EnableObject.activate();
						}
					}
				}
			}
		}

		if (OnChangeElement.GroupId !== undefined) {

			var ListObj = sysFactory.getObjectByID(OnChangeElement.ListObject);

			//console.debug('::processOnChangeItem GroupId:%s ListObj:%o FormListObjectID:%s', OnChangeElement.GroupId, ListObj,  OnChangeElement.ListObject);

			//var GroupId = sysFactory.getObjectByID(OnChangeElement.GroupId);

			var ListAttributes = ListObj.JSONConfig.Attributes;
			var GroupOperator = ListAttributes.GroupOperator;
			var DstObj = ListObj.getFormFieldItemByID(ListAttributes.GroupOperatorDstObject);
			var FormFields = ListAttributes.GroupOperatorFormFields;

			//console.debug('::processOnChangeItem GroupId:%s ListAttributes:%o FormFields:%o', OnChangeElement.GroupId, ListAttributes, FormFields);

			if (GroupOperator == 'sum') {
				var sum = 0;
				try {
					for (ArrayIndex in FormFields) {
						//console.log('::processOnChangeItem ArrayIndex:%s', ArrayIndex);
						FormFieldId = FormFields[ArrayIndex];
						var FormFieldItem = ListObj.getFormFieldItemByID(FormFieldId);
						var FormFieldValue = FormFieldItem.getRuntimeData();
						//console.debug('::processOnChangeItem FormFieldItem:%o FormFieldValue:%s', FormFieldItem, FormFieldValue);
						sum += +FormFieldValue;
					}
				}
				catch(err) {
					sum = 0;
				}
				DstObj.Value = sum;
				DstObj.updateValue();
			}
		}

		if (OnChangeElement.FireEvents !== undefined) {
			var FireEvents = OnChangeElement.FireEvents;
			//console.log('Formfield On Change Handler FireEvents:%o', FireEvents);
			if (FireEvents !== undefined) {
				sysFactory.Reactor.fireEvents(FireEvents);
			}
		}

		if (OnChangeElement.EnableObjectsDependOnBackendService !== undefined) {
			console.debug('::EnableObjectsDependOnBackendService called');
			const Config = OnChangeElement.EnableObjectsDependOnBackendService;
			var O = new EnableObjectHandler(Config, this);
			O.callService();
		}

	}

	//- reset all error container
	sysFactory.resetErrorContainer();

	//- trigger iframe resize
	sysFactory.resizeIframe();

}


//------------------------------------------------------------------------------
//- METHOD "processObjectsEnableOnValuesActivate"
//------------------------------------------------------------------------------
//- activate related formlist objects
//------------------------------------------------------------------------------

sysFormFieldOnChangeHandler.prototype.processObjectsEnableOnValuesActivate = function(OnChangeElement, SelectedFormValue)
{
	for (Key in OnChangeElement.ObjectsEnableOnValues) {
		var ListElements = OnChangeElement.ObjectsEnableOnValues[Key];
		if (SelectedFormValue == Key) {
			for (i in ListElements) {
				try {
					var ListElement = ListElements[i];
					var ListObj = sysFactory.getObjectByID(ListElement);
					//console.debug('::processObjectsEnableOnValues Activate ListElement:%s', ListElement);

					try {
						ListObj.setValidate(true);
					}
					catch(err) {
						console.debug('::processObjectsEnableOnValues Activate err:%s ObjectID:%s', err, ListElement);
					}

					ListObj.Deactivated = false;
					ListObj.activate();

					// recurse on single list element
					var PulldownFormItems = ListObj.getFormFieldItemsByType('pulldown');
					for (i in PulldownFormItems) {
						var FormItem = PulldownFormItems[i];
						//console.log('::processObjectsEnableOnValues Activate FormItem:%o', FormItem);
						FormItem.setupOnChangeConfig();
						try {
							const RefOnChangeElement = FormItem.OnChangeElements[0];
						}
						catch(err) {
							console.debug('::processObjectsEnableOnValues Activate RefOnChangeElement=undefined');
						}
						//console.log('::processObjectsEnableOnValues Activate RefOnChangeElement:%o', RefOnChangeElement);
						if (RefOnChangeElement !== undefined &&
							RefOnChangeElement.PulldownRef !== undefined &&
							RefOnChangeElement.PulldownRef.PulldownID == this.ObjectID &&
							RefOnChangeElement.PulldownRef.PulldownValue == SelectedFormValue) {
							//console.log('::processObjectsEnableOnValues Activate RecurseOnItem:%o', FormItem);
							FormItem.processObjectsEnableOnValuesActivate(RefOnChangeElement, FormItem.getRuntimeData());
						}
					}
				}
				catch(err) {
					console.debug('::processObjectsEnableOnValues Activate Error:%s', err);
				}
			}
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "processObjectsEnableOnValuesDeactivate"
//------------------------------------------------------------------------------
//- deactivate related formlist objects
//------------------------------------------------------------------------------

sysFormFieldOnChangeHandler.prototype.processObjectsEnableOnValuesDeactivate = function(OnChangeElement)
{
	//console.log('::processObjectsEnableOnValues Deactivate OnChangeElement:%o SelectedFormValue:%s', OnChangeElement, SelectedFormValue);
	sysFactory.currentTabObject.resetPulldownFormListStatus();
	for (Key in OnChangeElement.ObjectsEnableOnValues) {

		var ListElements = OnChangeElement.ObjectsEnableOnValues[Key];

		for (i in ListElements) {
			try {
				const ListElement = ListElements[i];

				const ListObj = sysFactory.getObjectByID(ListElement);
				//console.debug('::processObjectsEnableOnValuesDeactivate ObjectsEnableOnValues ListElementID:%s', ListElement);

				//- do not validate deactivated form lists
				try {
					ListObj.setValidate(false);
				}
				catch(err) {
					console.debug('::processObjectsEnableOnValuesDeactivate err:%s ObjectID:%s', err, ListElement);
				}

				ListObj.Deactivated = true;
				ListObj.deactivate();
				ListObj.setDOMElementStyleAttributes();

				// recurse on single list element
				var PulldownFormItems = ListObj.getFormFieldItemsByType('pulldown');
				//console.debug('::processObjectsEnableOnValuesDeactivate ListObj:%o PulldownFormItems:%o', ListObj, PulldownFormItems);

				for (i in PulldownFormItems) {
					const FormItem = PulldownFormItems[i];
					//console.debug('::processObjectsEnableOnValuesDeactivate FormItem:%o', FormItem);
					FormItem.processObjectsEnableOnValuesDeactivate(FormItem.JSONConfig.Attributes.OnChange);
				}
			}
			catch(err) {
				console.debug('::processObjectsEnableOnValues Deactivate Error:%s', err);
			}
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "processObjectsEnableOnValues"
//------------------------------------------------------------------------------

sysFormFieldOnChangeHandler.prototype.processObjectsEnableOnValues = function(OnChangeElement)
{
    try {
        var FormValue = this.getRuntimeData();
        this.processObjectsEnableOnValuesDeactivate(OnChangeElement);
        this.processObjectsEnableOnValuesActivate(OnChangeElement, FormValue);
    }
    catch (err) {
        console.debug('::processObjectsEnableOnValues error:%s', err);
    }

}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "MatchHandler"
//------------------------------------------------------------------------------

function MatchHandler()
{
	this.MatchItems = Array(); //- MatchItems
}


//------------------------------------------------------------------------------
//- METHOD "addMatchItem"
//------------------------------------------------------------------------------

MatchHandler.prototype.addMatchItem = function(Item)
{
	this.MatchItems.push(Item);
	Item.process();
}


//------------------------------------------------------------------------------
//- METHOD "checkResult"
//------------------------------------------------------------------------------

MatchHandler.prototype.checkResult = function()
{
	var CountPositive = 0;
	for (Index in this.MatchItems) {
		CountPositive += this.MatchItems[Index].MatchResult ? 1 : 0;
	}
	//console.log(CountPositive);
	return CountPositive == this.MatchItems.length ? true : false;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "MatchHandler"
//------------------------------------------------------------------------------

function MatchHandlerItem(TableCol, Attributes)
{
	this.TableCol		= TableCol;					//- Table Column Object
	this.Type			= Attributes.Type;			//- Match Type
	this.Match			= Attributes.Match;			//- Match
	this.Operator		= Attributes.Operator;		//- Match Operator
	this.Value			= Attributes.Value;			//- Compare Value

	this.MatchResult	= false;					//- Match Result
}


//------------------------------------------------------------------------------
//- METHOD "process"
//------------------------------------------------------------------------------

MatchHandlerItem.prototype.process = function()
{
	var TableColValue = this.TableCol.FormFieldItem.getRuntimeData();

	if (this.Match == 'length' && this.Operator == '>') {
		this.MatchResult = TableColValue.length > this.Value ? true : false;
	}

	if (this.Match == 'string' && this.Operator == '==') {
		this.MatchResult = TableColValue == this.Value ? true : false;
	}
}




//------------------------------------------------------------------------------
//- CONSTRUCTOR "EnableObjectHandler"
//------------------------------------------------------------------------------

function EnableObjectHandler(Config, PulldownRefObject)
{
	this.Config = Config;
	this.PulldownRefObject = PulldownRefObject;
}


//------------------------------------------------------------------------------
//- METHOD "callService"
//------------------------------------------------------------------------------

EnableObjectHandler.prototype.callService = function()
{
	//console.debug('Config:%o', this.Config);

	this.PostRequestData = {}

	const ServiceObj = {
		"BackendServiceID": this.Config.ServiceID
	}

	const RequestObj = {
		"PulldownValue": this.PulldownRefObject.getRuntimeData()
	}

	this.PostRequestData['RequestData'] = RequestObj;
	this.PostRequestData['ServiceData'] = ServiceObj;

	RPC = new sysCallXMLRPC(this.Config.ServiceURL);
	RPC.Request(this);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

EnableObjectHandler.prototype.callbackXMLRPCAsync = function()
{

	var ResultValue;
	try {
		ResultValue = this.XMLRPCResultData[0]['ResultValue'];
	}
	catch(e) {
	}

	const DisableObjects = this.Config.Disable;
	for (Index in DisableObjects) {
		console.debug('::DisableObject ObjectID:%s', DisableObjects[Index]);
		const DisableObject = sysFactory.getObjectByID(DisableObjects[Index]);
		try {
			DisableObject.setValidate(false);
		}
		catch(e) {
		}
		DisableObject.Deactivated = true;
		DisableObject.deactivate();
	}

	if (ResultValue !== undefined) {
		const EnableObjects = this.Config.EnableOnValue[ResultValue];
		for (Index in EnableObjects) {
			console.debug('::EnableObject ObjectID:%s', EnableObjects[Index]);
			const EnableObject = sysFactory.getObjectByID(EnableObjects[Index]);
			try {
				EnableObject.setValidate(true);
			}
			catch(e) {
			}
			EnableObject.Deactivated = false;
			EnableObject.activate();
		}
	}

}
