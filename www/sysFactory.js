//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- System Object Factory                                                    -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- Main
//------------------------------------------------------------------------------

function sysFactory() {
	this.Screens			= new Object();			//- Screen Instances (references)
}


//- ------------------------------------------------------
//- METHOD "init"
//- ------------------------------------------------------

sysFactory.prototype.init = function() {

	//- ------------------------------------------------------
	//- loop on skeleton, create screen object, add to this.Screens
	//- ------------------------------------------------------
	//console.debug(this.DataSkeleton);

	//- ------------------------------------------------------
	//- Setup Base Divs for User Content
	//- ------------------------------------------------------
	userInitLayerContent();

	const SkeletonData = this.DataSkeleton.XMLRPCResultData;

	for(SkeletonKey in SkeletonData) {

		//- add screen object
		ScreenObj = this.addScreen(
			SkeletonKey,
			SkeletonData[SkeletonKey]
		)

		ScreenObj.setup();
	}

	//- ------------------------------------------------------
	//- Initialize Dyn Pulldown Tab Switch Behaviour
	//- ------------------------------------------------------
	this.initDynPulldownTabSwitchBehaviour();

	//- ------------------------------------------------------
	//- Deactivate all Objects flagged Deactivated = true
	//- ------------------------------------------------------
	this.deactivateObjects();

	//- ------------------------------------------------------
	//- Initialize Dependend Pulldowns
	//- ------------------------------------------------------
	this.initDependendPulldowns();

	//- ------------------------------------------------------
	//- Add OnTabSwitchElements (Global) to Tabs
	//- ------------------------------------------------------
	this.addOnTabSwitchElements();

	//- ------------------------------------------------------
	//- Switch to Default Screen
	//- ------------------------------------------------------
	this.switchScreen(this.DisplayDefaultScreen);

	//- ------------------------------------------------------
	//- Deactivate dependend on Global Variables objects
	//- ------------------------------------------------------
	this.deactivateGlobalDependendObjects();

	//--------------------------------------------------------
	//- Setup Menu "Screen"
	//--------------------------------------------------------
	var MenuScreen = new sysScreen();

	MenuScreen.ScreenID = 'sysMenu';
	MenuScreen.SkeletonData = this.DataMenu.XMLRPCResultData;

	MenuScreen.setup();

	//--------------------------------------------------------
	//- Resize Iframe when run in external mode (e.g. WP)
	//--------------------------------------------------------
	this.resizeIframe();

	//- ------------------------------------------------------
	//- Raise InitSystem Event
	//- ------------------------------------------------------
	this.Reactor.dispatchEvent('InitSystem');

	//- ------------------------------------------------------
	//- Start processing async Messages
	//- ------------------------------------------------------
	this.sysGlobalAsyncNotifyHandler.getMsg();

}


//- ------------------------------------------------------
//- METHOD "resizeIframe"
//- ------------------------------------------------------

sysFactory.prototype.resizeIframe = function()
{
	if (this.ParentWindowURL !== undefined) {
		const CurrentHeight = document.getElementsByTagName('html')[0].scrollHeight;
		//console.debug('::resizeIframe Current Height:%s', CurrentHeight);
		try {
			window.parent.postMessage(
				{
					'task': 'resize_iframe',
					'iframe_id': 'inneriframe',
					'iframe_height': CurrentHeight
				},
				this.ParentWindowURL
			);
		}
		catch(err) {
			console.debug('::resizeIframe err:%s', err);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "moveAdminContentRight"
//------------------------------------------------------------------------------

sysFactory.prototype.moveAdminContentRight = function() {
	if (this.AdminInterface == true) {
		const Elements = document.getElementsByClassName('sysScreenRoot');
		for (ElementIndex in Elements) {;
			ProcessElement = Elements[ElementIndex];
			if (ProcessElement.nodeName == 'DIV') {
				console.debug('::Menu Set layer Style Left:%spx right Element:%o', sysFactory.SysScreenRootLeftPx, ProcessElement);
				ProcessElement.style.left = sysFactory.SysScreenRootLeftPx+'px';
			}
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "addScreen"
//------------------------------------------------------------------------------

sysFactory.prototype.addScreen = function(ScreenID, SkeletonData) {

	//console.debug('::addScreen ScreenID:%s SkeletonData:%o', ScreenID, SkeletonData);

	var ScreenObj = new sysScreen();

	//LinkObj = this.ObjMenu.getLinkObjByScreenID(ScreenID);

	ScreenObj.ScreenID = ScreenID;
	ScreenObj.SkeletonData = SkeletonData;
	//ScreenObj.LinkObj = LinkObj;

    //console.log('::addScreen add LinkObject:%o to ScreenObj:%o', LinkObj, ScreenObj);

	this.Screens[ScreenID] = ScreenObj;

	return this.Screens[ScreenID];

}


//------------------------------------------------------------------------------
//- METHOD "getScreens"
//------------------------------------------------------------------------------

sysFactory.prototype.getScreens = function() {
	return this.Screens;
}


//------------------------------------------------------------------------------
//- METHOD "getScreenByID"
//------------------------------------------------------------------------------

sysFactory.prototype.getScreenByID = function(ScreenID) {
	return this.Screens[ScreenID];
}


//------------------------------------------------------------------------------
//- METHOD "getLastScreenObject"
//------------------------------------------------------------------------------

/*
 * Very fast hack/workaround for getting the last screen object
*/

sysFactory.prototype.getLastScreenObject = function() {
	for (ScreenID in this.Screens) {
        ScreenObj = this.Screens[ScreenID];
    }
    return ScreenObj;
}


//------------------------------------------------------------------------------
//- METHOD "getObjectByID"
//------------------------------------------------------------------------------

sysFactory.prototype.getObjectByID = function(ObjectID) {
	for (ScreenID in this.Screens) {
		var ScreenObj = this.Screens[ScreenID];
		var ResultObj = ScreenObj.HierarchyRootObject.getObjectByID(ObjectID);
		if (ResultObj !== undefined && ResultObj != null) {
			return ResultObj;
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "getObjectsByAttribute"
//------------------------------------------------------------------------------

sysFactory.prototype.getObjectsByAttribute = function(Attribute) {
	var ResultObjects = new Object();
	for (ScreenID in this.Screens) {
		ScreenObj = this.Screens[ScreenID];
		ResultObjects[ScreenID] = ScreenObj.HierarchyRootObject.getObjectsByAttribute(Attribute);
	}
	return ResultObjects;
}


//------------------------------------------------------------------------------
//- METHOD "initDependendPulldowns"
//------------------------------------------------------------------------------

sysFactory.prototype.initDependendPulldowns = function() {

	for (ScreenID in this.Screens) {
		const FormFieldItems = this.getObjectsByType(ScreenID, 'FormField');
		//- deactivate objects (recursion not required)
		for (FormID in FormFieldItems) {
			const FormItem =  FormFieldItems[FormID];
			//console.log('initDependendPulldowns FormItem:%o', FormItem);
			const FormObject = this.getFormFieldObjectByID(FormItem.ObjectID);
			//console.log('initDependendPulldowns FormObject:%o', FormFieldObject);
			if (FormObject !== undefined) {
				FormObject.initReferencedPulldowns();
			}
		}
		//console.log('::initDependendPulldowns FormFieldItems:%o', FormFieldItems);
		//- activate "RootPulldown"s default EnableOnValues recursive
		for (FormID in FormFieldItems) {
			const FormItem =  FormFieldItems[FormID];
			//console.log('initDependendPulldowns FormItem:%o', FormItem);
			const FormObject = this.getFormFieldObjectByID(FormItem.ObjectID);
			//console.info('initDependendPulldowns FormObject:%o', FormObject);
			if (FormObject !== undefined && FormObject.JSONConfig.Attributes.Type == 'pulldown' && FormObject.JSONConfig.Attributes.RootPulldown == true) {
				sysFactory.initReferencedPulldownsActivate(FormObject);
			}
		}
    }
}


//------------------------------------------------------------------------------
//- METHOD "deactivateGlobalDependendObjects"
//------------------------------------------------------------------------------

sysFactory.prototype.deactivateGlobalDependendObjects = function() {

	const DependendObjects = this.getObjectsByAttribute('DependOnGlobal');
	const ProcessObjects = DependendObjects[this.ActualScreenID];
	//console.debug('::deactivateGlobalDependendObjects ProcessObjects:%o CurrentScreen:%s', ProcessObjects, this.ActualScreenID);

	for (ObjIndex in ProcessObjects) {

		const ProcessObject = ProcessObjects[ObjIndex];
		const ProcessObjectAttributes = ProcessObject.JSONConfig.Attributes.DependOnGlobal;

		//console.debug('::deactivateGlobalDependendObjects ProcessObjectAttributes:%o', ProcessObjectAttributes);

		if (ProcessObjectAttributes.Operator == '==') {
			const XMLData = this.ObjGlobalData.XMLRPCResultData;
			var CheckProperty;
			for (RowIndex in XMLData) {
				const Row = XMLData[RowIndex];
				if (Row.id == ProcessObjectAttributes.Var) {
					CheckProperty = Row.Value;
				}
			}

			const CheckValue = ProcessObjectAttributes.Value;
			//console.debug('::deactivateGlobalDependendObjects CheckProperty:%s CheckValue:%s', CheckProperty, CheckValue);

			var ValidateStatus = true;

			if (CheckProperty !== undefined && CheckProperty == CheckValue) {

				ProcessObject.Deactivated = true;
				ProcessObject.DependendDeactivated = true;
				ProcessObject.deactivate();

				ValidateStatus = false;
			}

			ProcessObject.setValidate(ValidateStatus);

		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "initReferencedPulldownsActivate"
//------------------------------------------------------------------------------

sysFactory.prototype.initReferencedPulldownsActivate = function(PulldownItem) {
	const Default = PulldownItem.getDefault();
	if (Default !== undefined) {
		//const selectedValue = this.getRuntimeData();
		const ProcessElements = PulldownItem.JSONConfig.Attributes.OnChange.ObjectsEnableOnValues[Default];
		for (Index in ProcessElements) {
			const ProcessObj = sysFactory.getObjectByID(ProcessElements[Index]);
			if (ProcessObj !== undefined) {
				ProcessObj.Deactivated = false;
				ProcessObj.activate();

				try {
					ProcessObj.setValidate(true);
				}
				catch(err) {
				}

				//console.debug('::initReferencedPulldownsActivate ProcessObj:%o', ProcessObj);

				if (ProcessObj.JSONConfig.Attributes.Type == 'pulldown') {
					this.initReferencedPulldownsActivate(ProcessObj);
				}
			}
			else {
				console.debug('::initReferencedPulldownsActivate ProcessObjID:%s not found!', ProcessElements[Index]);
			}
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "initDynPulldownTabSwitchBehaviour"
//------------------------------------------------------------------------------

sysFactory.prototype.initDynPulldownTabSwitchBehaviour = function() {

	for (ScreenID in this.Screens) {
		const ScreenObject = this.getScreenByID(ScreenID);
		const RootObj = ScreenObject.HierarchyRootObject;
		const FormLists = RootObj.getObjectsByType('FormFieldList');
		for (ObjKey in FormLists) {
			var FormListObj = FormLists[ObjKey];
			//console.log('::initDynPulldownTabSwitchBehaviour FormListObj:%o', FormListObj);
			FormListObj.setupTabSwitchBehaviour();
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "deactivateObjects"
//------------------------------------------------------------------------------

sysFactory.prototype.deactivateObjects = function() {
	for (ScreenID in this.Screens) {
		const ScreenObj = this.Screens[ScreenID];
		var Items = ScreenObj.HierarchyRootObject.getObjectsByAttribute('Deactivated');
		for (ObjectKey in Items) {
			Item =  Items[ObjectKey];
			Item.deactivate();
			Item.Deactivated = true;
			try {
				Item.setValidate(false);
			}
			catch(err) {
			}
		}
    }
}


//------------------------------------------------------------------------------
//- METHOD "switchScreen"
//------------------------------------------------------------------------------

sysFactory.prototype.switchScreen = function(ScreenID) {

	console.debug('::switchScreen ScreenID:%s Current ScreenID:%s', ScreenID, this.ActualScreenID);

	if (ScreenID !== undefined) {

		try {
			//- get screen object by screen id
			const ScreenObj = this.getScreenByID(ScreenID);

			//- switch all screens to background
			this.switchScreensToBackground();

			//- hilite link
			//ScreenObj.LinkObj.Hilite();

			//- set global ActualScreenID
			this.ActualScreenID = ScreenID;

			//- update form data
			this.updateFormData(ScreenObj);

			//- trigger global screen data load
			//ScreenObj.triggerGlobalDataLoad();

			//- switch selected screen to foreground
			this.switchScreenToForeground(ScreenObj);
		}
		catch(err) {
			console.debug('::switchScreen err:%s', err);
		}
	}

}


//------------------------------------------------------------------------------
//- METHOD "updateFormData"
//------------------------------------------------------------------------------

sysFactory.prototype.updateFormData = function(ScreenObj) {

		//- trigger dynamic pull down update
		this.processDynPulldown(ScreenObj);

		//- update dynamic form field refs
		this.updateFormItemRefValues(ScreenObj);
}


//------------------------------------------------------------------------------
//- METHOD "updateFormItemRefValues"
//------------------------------------------------------------------------------

sysFactory.prototype.updateFormItemRefValues = function(ScreenObj) {

	var Objects = sysFactory.getFormFieldListObjectsByScreenObj(ScreenObj);

	/*
	console.log('### updateFormItemRefValues ### Objects:%o', Objects);
	*/

	for (ObjectKey in Objects) {
		var FormFields = Objects[ObjectKey].FormFieldItems;
		for (FormfieldKey in FormFields) {
			FormFields[FormfieldKey].updateRefValue();
		}
	}

}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldValueByID"
//------------------------------------------------------------------------------

sysFactory.prototype.getFormFieldValueByID = function(ScreenID, FormFieldContainer, FormFieldID) {

	var DstScreenObject = sysFactory.getScreenByID(ScreenID);
	var FormListObjs = DstScreenObject.HierarchyRootObject.getObjectsByType('FormFieldList');

	for (ObjKey in FormListObjs) {
		if (ObjKey == FormFieldContainer) {
			var FormFields = FormListObjs[ObjKey].FormFieldItems;
			for (FormfieldKey in FormFields) {
				if (FormfieldKey == FormFieldID) {
					return FormFields[FormfieldKey].getDOMValue();
				}
			}
		}
	}

	return 'NotFound';
}


//------------------------------------------------------------------------------
//- METHOD "switchScreensToBackground"
//------------------------------------------------------------------------------

sysFactory.prototype.switchScreensToBackground = function() {
	for (ScreenKey in this.Screens) {
		ScreenObj = this.Screens[ScreenKey];
		ScreenObj.HierarchyRootObject.setDOMVisibleState('hidden');
		//ScreenObj.LinkObj.DeHilite();
	}	
}


//------------------------------------------------------------------------------
//- METHOD "switchScreenToForeground"
//------------------------------------------------------------------------------

sysFactory.prototype.switchScreenToForeground = function(ScreenObj) {
	//ScreenObj.HierarchyRootObject.setZIndex(1);
	ScreenObj.HierarchyRootObject.setDOMVisibleState('visible');
}


//------------------------------------------------------------------------------
//- METHOD "getObjectsByType"
//------------------------------------------------------------------------------

sysFactory.prototype.getObjectsByType = function(ScreenID, Type) {
	//console.log('::getObjectsByType ScreenID:%s Type:%s', ScreenID, Type);
	var DstScreenObject = sysFactory.getScreenByID(ScreenID);
	var RootObj = DstScreenObject.HierarchyRootObject;
	return RootObj.getObjectsByType(Type);
}


//------------------------------------------------------------------------------
//- METHOD "processDynPulldown"
//------------------------------------------------------------------------------

/*
 * check if needed after refactoring
*/
sysFactory.prototype.processDynPulldown = function(ScreenObj) {

	var FormListObjs = ScreenObj.HierarchyRootObject.getObjectsByType('FormFieldList');

	for (ObjKey in FormListObjs) {
		var FormList = FormListObjs[ObjKey];
		try {
            FormList.processSwitchScreen();
        }
        catch(err) {
            console.log('::processDynPulldown err%s:', err);
        }
	}
}


//------------------------------------------------------------------------------
//- METHOD "clearFormStylesByScreenID"
//------------------------------------------------------------------------------

sysFactory.prototype.clearFormStylesByScreenID = function(ScreenID) {

	var FormListObjs = this.getObjectsByType(ScreenID, 'FormFieldList');

	for (ObjKey in FormListObjs) {
		var FormListObj = FormListObjs[ObjKey];
		FormListObj.clearStyle();
	}

}


//------------------------------------------------------------------------------
//- METHOD "resetFormValuesByScreenID"
//------------------------------------------------------------------------------

sysFactory.prototype.resetFormValuesByScreenID = function(ScreenID) {

	var FormListObjs = this.getObjectsByType(ScreenID, 'FormFieldList');

	for (ObjKey in FormListObjs) {
		var FormListConfigObj = FormListObjs[ObjKey];
		FormListConfigObj.ConnectorObject.resetFormElementsDefault();
	}

}


//------------------------------------------------------------------------------
//- METHOD "disableFormValuesByScreenID"
//------------------------------------------------------------------------------

sysFactory.prototype.disableFormValuesByScreenID = function(ScreenID) {

	var FormListObjs = this.getObjectsByType(ScreenID, 'FormFieldList');

	for (ObjKey in FormListObjs) {
		var FormListConfigObj = FormListObjs[ObjKey];
		FormListConfigObj.ConnectorObject.disable();
	}

}


//------------------------------------------------------------------------------
//- METHOD "enableFormValuesByScreenID"
//------------------------------------------------------------------------------

sysFactory.prototype.enableFormValuesByScreenID = function(ScreenID) {

	var FormListObjs = this.getObjectsByType(ScreenID, 'FormFieldList');

	for (ObjKey in FormListObjs) {
		var FormListConfigObj = FormListObjs[ObjKey];
		FormListConfigObj.ConnectorObject.enable();
	}

}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldListObjectsByScreenObj"
//------------------------------------------------------------------------------

sysFactory.prototype.getFormFieldListObjectsByScreenObj = function(ScreenObject) {

	var RootObject = ScreenObject.HierarchyRootObject;
	var FormListObjects = RootObject.getObjectsByType('FormFieldList');

	var ReturnObjects = new Object();

	for (ObjectKey in FormListObjects) {
		ReturnObjects[ObjectKey] = FormListObjects[ObjectKey];
	}

	//console.log('Factory::getFormFieldListObjectsByScreenObj ReturnObjects:%s', ReturnObjects);
	return ReturnObjects;

}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldListObjectByID"
//------------------------------------------------------------------------------

sysFactory.prototype.getFormFieldListObjectByID = function(ScreenObject, ObjectID) {

	var FormListObjects = this.getFormFieldListObjectsByScreenObj(ScreenObject);

	for (ObjectKey in FormListObjects) {
		if (ObjectKey == ObjectID) {
			return FormListObjects[ObjectKey];
		}
	}

}


//------------------------------------------------------------------------------
//- METHOD "getFormFieldObjectByID"
//------------------------------------------------------------------------------

sysFactory.prototype.getFormFieldObjectByID = function(ObjectID) {
	for (ScreenObjKey in this.Screens) {

		var ScreenObj = this.Screens[ScreenObjKey];
		var FormObjects = this.getFormFieldListObjectsByScreenObj(ScreenObj);

		for (FormListObjKey in FormObjects) {
			var FormListObj = FormObjects[FormListObjKey];
			//console.log(FormListObj);
			var FormFieldObj = FormListObj.getFormFieldItemByID(ObjectID);
			if (FormFieldObj !== undefined) { return FormFieldObj; }
		}
			
	}
}


//------------------------------------------------------------------------------
//- METHOD "getObjectContainingTabData"
//------------------------------------------------------------------------------

sysFactory.prototype.getObjectContainingTabData = function(CheckObjectID) {

    for (ScreenID in this.Screens) {
        var ScreenObj = this.Screens[ScreenID];
        for (ObjectID in ScreenObj.SkeletonData) {
            if (ObjectID == CheckObjectID) {
                return ScreenObj.SkeletonData[ObjectID];
            }
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "updateServiceDBColumnObjects"
//------------------------------------------------------------------------------

sysFactory.prototype.updateServiceDBColumnObjects = function(ObjectRef, XMLResultRef) {

	const DBColumnObjects = ObjectRef.getObjectsByAttribute('DBColumn');
	console.debug('::callbackXMLRPCAsync DBColumnObjects:%o', DBColumnObjects);

	for (i in DBColumnObjects) {
		try {
			var SetObject = DBColumnObjects[i];
			//console.debug('::callbackXMLRPCAsync SetObject:%o', SetObject);
			var RowData = XMLResultRef.XMLRPCResultData[0];
			var DBValue = RowData[SetObject.JSONConfig.Attributes.DBColumn];
			//console.debug('::callbackXMLRPCAsync DBValue:%s DBColumn:%s', DBValue, SetObject.JSONConfig.Attributes.DBColumn);

			if (DBValue == null) { DBValue = ''; }

			SetObject.reset();
			SetObject.Value = DBValue;
			SetObject.updateValue();

			if (SetObject.ObjectType == 'FormField') {
				//console.debug('::callbackXMLRPCAsync triggering FormItem OnChange');
				SetObject.processOnChangeItem();
			}
			/* be sure to activate deactivate object */
			if (SetObject.Deactivated === true && SetObject.Value.length > 0) {
				//console.debug('::callbackXMLRPCAsync triggering FormItem OnChange');
				SetObject.Deactivated = false;
				SetObject.activate();
				SetObject.enable();
			}
		}
		catch(e) {
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "addOnTabSwitchElements"
//------------------------------------------------------------------------------

sysFactory.prototype.addOnTabSwitchElements = function() {
	for (ScreenID in this.Screens) {
		const ScreenObj = this.Screens[ScreenID];
		const UpdateElements = ScreenObj.HierarchyRootObject.getObjectsByAttribute('UpdateOnTabSwitchGlobal');
		//console.debug('::addOnTabSwitchElements ScreenID:%s UpdateElements:%o', ScreenID, UpdateElements);
		for (Index in UpdateElements) {
			const Element = UpdateElements[Index];
			try {
				const ElementAttributes = Element.JSONConfig.Attributes.UpdateOnTabSwitchGlobal;
				const TabContainer = this.getObjectByID(ElementAttributes.TabContainer);
				TabContainer.addUpdateOnSwitchElement(ElementAttributes.Tab, Element);
			}
			catch(e) {
			}
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "getGlobalVar"
//------------------------------------------------------------------------------

sysFactory.prototype.getGlobalVar = function(VarName) {
	const XMLData = this.ObjGlobalData.XMLRPCResultData;
	for (RowIndex in XMLData) {
		const Row = XMLData[RowIndex];
		if (Row.id == VarName) { return Row.Value; }
	}
}


//------------------------------------------------------------------------------
//- Function "handleParentMessage"
//------------------------------------------------------------------------------

sysFactory.prototype.handleParentMessage = function(event) {
	var accepted_origin = sysFactory.ParentWindowURL;
	if (event.origin == accepted_origin) {
		console.debug('::handleParentMessage Event:%o', event);
		if (event.data['task'] == 'add_style') {
			const AddClass = event.data['class'];
			document.getElementById('body').classList.add(AddClass);
			
		}
		if (event.data['task'] == 'remove_style') {
			const RemoveClass = event.data['class'];
			document.getElementById('body').classList.r(AddClass);
		}
	} else {
		console.log('handleParentMessage Unknown origin:%s', event.origin);
	}
}


//------------------------------------------------------------------------------
//- Function "resetErrorContainer"
//------------------------------------------------------------------------------

sysFactory.prototype.resetErrorContainer = function() {
	const ErrorContainerItems = this.getObjectsByType(this.ActualScreenID, 'ErrorContainer');
	for (Index in ErrorContainerItems) {
		const ErrorContainerItem = ErrorContainerItems[Index];
		ErrorContainerItem.reset();
	}
}
