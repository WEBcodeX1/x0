//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
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
	const JSONConfig = this.JSONConfig.Attributes.OnChange;

	console.debug('::processOnChangeItem this:%o JSONConfig:%o', this, JSONConfig);

	if (JSONConfig !== undefined) {
		const OnChangeConfig = Array.isArray(JSONConfig) ? JSONConfig : [ JSONConfig ];

		for (i in OnChangeConfig) {
			const OnChangeElement = OnChangeConfig[i];

			//console.debug('::processOnChangeItem OnChangeElement:%o', OnChangeElement);

			if (OnChangeElement.UpdateFormfield !== undefined) {
				try {
					const ObjectID = (this.InstancePrefix === undefined) ? OnChangeElement.UpdateFormfield : this.InstancePrefix + OnChangeElement.UpdateFormfield;
					const DestinationObject = sysFactory.getObjectByID(ObjectID);
					const FormElementValue = this.FormItemGetValue();
					const CurrentLength = FormElementValue.length;
					const TextPre = sysFactory.getText(OnChangeElement.TextPreID);
					const TextPost = sysFactory.getText(OnChangeElement.TextPostID);
					const Value = TextPre + (OnChangeElement.MaxLength - CurrentLength) + TextPost;

					//console.debug('DestinationObject:%o', DestinationObject);
					DestinationObject.ParentObject.Value = Value;
					DestinationObject.ParentObject.FormItemSetValue();

					//console.log('::processOnChangeItem FooterObject:%o CurrentLength:%s CharsLeft:%s', ListAdditionalFooterObj, CurrentLength, CharsLeft);
				}
				catch (err) {
					console.debug('FormfieldOnChangeHandler UpdateFormfield err:%s', err);
				}
			}

			if (OnChangeElement.OnChecked == true) {
				//console.debug('::processOnChangeItem OnChangeElement:%o', OnChangeElement);
				try {
					const ObjectID = (this.InstancePrefix === undefined) ? OnChangeElement.ObjectID : this.InstancePrefix + OnChangeElement.ObjectID;
					const DstObj = sysFactory.getObjectByID(ObjectID);
					const Value = this.RuntimeGetDataFunc();
					console.debug('::processOnChangeItem OnValue ObjectID:%s', ObjectID);
					//console.debug('::processOnChangeItem OnValue Object Runtime Data:%s OnChangeValue:%s', FormValue, OnChangeElement.OnValue);
					if (Value == true) {
						DstObj.setActivated();
						DstObj.VisibleState = 'visible';
						DstObj.setDOMVisibleState();
					}
					else {
						DstObj.VisibleState = 'hidden';
						DstObj.setDOMVisibleState();
						DstObj.setDeactivated();
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
					const FormValue = this.RuntimeGetDataFunc();
					//console.debug('::processOnChangeItem OnValue Object Runtime Data:%s OnChangeValue:%s', FormValue, OnChangeElement.OnValue);
					if (FormValue == OnChangeElement.OnValue) {
						DstObj.setActivated();
						DstObj.VisibleState = 'visible';
						DstObj.setDOMVisibleState();
					}
					else {
						DstObj.VisibleState = 'hidden';
						DstObj.setDOMVisibleState();
						DstObj.setDeactivated();
					}
				}
				catch (err) {
					console.debug('FormfieldOnChangeHandler OnChange err:%s', err);
				}
			}

			if (OnChangeElement.ActivateOnValues !== undefined) {

				const ObjectID = (this.InstancePrefix === undefined) ? OnChangeElement.ObjectID : this.InstancePrefix + OnChangeElement.ObjectID;
				var DstObj = sysFactory.getObjectByID(ObjectID);
				const FormValue = this.RuntimeGetDataFunc();
				//console.debug('::processOnChangeItem ActivateOnValues ObjectID:%s DstObj:%o FormValue:', ObjectID, DstObj, FormValue);
				var ActiveOnValues = OnChangeElement.ActivateOnValues;
				for (i in ActiveOnValues) {
					if (ActiveOnValues[i] == FormValue) {
						//console.debug('::processOnChangeItem enable()');
						DstObj.setActivated();
						DstObj.VisibleState = 'visible';
						DstObj.setDOMVisibleState();
					}
				}
				var DeactivateOnValues = OnChangeElement.DeactivateOnValues;
				for (i in DeactivateOnValues) {
					if (DeactivateOnValues[i] == FormValue) {
						//console.debug('::processOnChangeItem disable()');
						DstObj.VisibleState = 'hidden';
						DstObj.setDOMVisibleState();
						DstObj.setDeactivated();
					}
				}
			}

			if (OnChangeElement.EnableOnValues !== undefined) {

				const ObjectID = (this.InstancePrefix === undefined) ? OnChangeElement.ObjectID : this.InstancePrefix + OnChangeElement.ObjectID;
				var DstObj = sysFactory.getObjectByID(ObjectID);
				const FormValue = this.RuntimeGetDataFunc();
				//console.debug('::processOnChangeItem EnableOnValues ObjectID:%s DstObj:%o FormValue:', ObjectID, DstObj, FormValue);
				var EnableValues = OnChangeElement.EnableOnValues;
				for (i in EnableValues) {
					if (EnableValues[i] == FormValue) {
						//console.debug('::processOnChangeItem enable()');
						DstObj.enableDOMElement();
					}
				}
				var DisableValues = OnChangeElement.DisableOnValues;
				for (i in DisableValues) {
					if (DisableValues[i] == FormValue) {
						//console.debug('::processOnChangeItem disable()');
						DstObj.disableDOMElement();
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
	}

	//- reset all error container
	sysFactory.resetErrorContainer();

	//- trigger iframe resize
	sysFactory.resizeIframe();
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
		DisableObject.setDOMVisibleStateRecursive('hidden');
		DisableObject.setDeactivated();
	}

	if (ResultValue !== undefined) {
		const EnableObjects = this.Config.EnableOnValue[ResultValue];
		for (Index in EnableObjects) {
			console.debug('::EnableObject ObjectID:%s', EnableObjects[Index]);
			const EnableObject = sysFactory.getObjectByID(EnableObjects[Index]);
			EnableObject.setActivated();
			EnableObject.setDOMVisibleStateRecursive('visible');
		}
	}

}
