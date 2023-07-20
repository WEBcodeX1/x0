//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2021                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- System Object Factory                                                    -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- Main
//------------------------------------------------------------------------------

function sysFactory()
{
	this.OverlayObj			= new sysScreenOverlay(this);	//- Overlay Object Ref
	this.Screens			= new Object();					//- Screen Instances (Refs)

	this.OverlayRefCount	= 0;

	this.SetupClasses = {
		"TabContainer": sysTabContainer,
		"SQLText": sysObjSQLText,
		"Button": sysObjButton,
		"ButtonInternal": sysObjButtonInternal,
		"NavigateForwardBackward": sysObjNavigateForwardBackward,
		"List": sysList,
		"FormfieldList": sysFormfieldList,
		"ServiceConnector": sysServiceConnector,
		"Div": sysObjDiv,
		"FileUpload": sysFileUpload,
		"ErrorContainer": sysErrorContainer,
		"Link": sysObjLink,
		"LinkExternal": sysObjLinkExternal,
		"RowContainer": sysObjRowContainer,
		"FormulaField": sysObjFormula,
		"MenuEnclose": sysObjMenuEnclose,
		"FormfieldText": sysFormfieldItemText
	};
}


//- ------------------------------------------------------
//- METHOD "init"
//- ------------------------------------------------------

sysFactory.prototype.init = function()
{
	//- ------------------------------------------------------
	//- loop on skeleton, create screen object, add to this.Screens
	//- ------------------------------------------------------
	//console.debug('Skeleton Data:%o', this.DataSkeleton);

	//- ------------------------------------------------------
	//- Set User Functions
	//- ------------------------------------------------------

	for (Index in sysVarUserFunctions) {
		UserFunctionID = sysVarUserFunctions[Index];
		console.debug('Setting User Functions. FunctionID:%s', UserFunctionID);
		this.UserFunctions[UserFunctionID] = window[UserFunctionID];
	}

	//- ------------------------------------------------------
	//- Add all System Screens
	//- ------------------------------------------------------
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
	//- Init (activate/deactivate) OnChange references
	//- ------------------------------------------------------
	this.initOnChangeObjects();

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

	const DefaultStyle = sysFactory.DefaultStyleMenu;
	const MenuStyle = (DefaultStyle !== undefined) ? DefaultStyle : 'col-lg-2 col-md-12';

	MenuScreen.ScreenID = 'sysMenu';
	MenuScreen.SkeletonData = this.DataMenu.XMLRPCResultData;
	MenuScreen.setStyle(MenuStyle);
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
//- METHOD "addScreen"
//------------------------------------------------------------------------------

sysFactory.prototype.addScreen = function(ScreenID, SkeletonData) {

	//console.debug('::addScreen ScreenID:%s SkeletonData:%o', ScreenID, SkeletonData);

	var ScreenObj = new sysScreen();

	ScreenObj.ScreenID = ScreenID;
	ScreenObj.SkeletonData = SkeletonData;

	try {
		ScreenObj.JSONConfig = this.ScreenConfig[ScreenID];
	}
	catch(err) {
	}

	//console.debug('::addScreen add LinkObject:%o to ScreenObj:%o', LinkObj, ScreenObj);

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
		const ScreenObj = this.Screens[ScreenID];
		const ResultObj = ScreenObj.HierarchyRootObject.getObjectByID(ObjectID);
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
//- METHOD "deactivateGlobalDependendObjects"
//------------------------------------------------------------------------------

sysFactory.prototype.deactivateGlobalDependendObjects = function()
{
	const DependendObjects = this.getObjectsByAttribute('DependOnGlobal');
	const ProcessObjects = DependendObjects[this.CurrentScreenID];
	//console.debug('::deactivateGlobalDependendObjects ProcessObjects:%o CurrentScreen:%s', ProcessObjects, this.CurrentScreenID);

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

			if (CheckProperty !== undefined && CheckProperty == CheckValue) {
				ProcessObject.Deactivated = true;
			}
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "switchScreen"
//------------------------------------------------------------------------------

sysFactory.prototype.switchScreen = function(ScreenID)
{
	console.debug('::switchScreen ScreenID:%s Current ScreenID:%s', ScreenID, this.CurrentScreenID);

	if (ScreenID !== undefined) {

		try {
			//- get screen object by screen id
			const ScreenObj = this.getScreenByID(ScreenID);

			//- switch all screens to background
			this.switchScreensToBackground();

			//- set global ActualScreenID
			this.CurrentScreenID = ScreenID;

			//- => rename, name is misleading. shoud be "UpdateRefDeactivated"
			//this.updateFormData(ScreenObj);

			//- switch selected screen to foreground
			this.switchScreenToForeground(ScreenObj);

			//- trigger global screen data load
			this.triggerScreenDataLoad(ScreenID);

			//- deactivate deactivated objects
			ScreenObj.HierarchyRootObject.deactivateDeactivated();
		}
		catch(err) {
			console.debug('::switchScreen err:%s', err);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "triggerScreenDataLoad"
//------------------------------------------------------------------------------

sysFactory.prototype.triggerScreenDataLoad = function(ScreenID)
{
	if (ScreenID !== undefined) {
		try {
			//- get screen object by screen id
			const ScreenObj = this.getScreenByID(ScreenID);

			//- trigger global screen data load
			ScreenObj.triggerGlobalDataLoad();
		}
		catch(err) {
			console.debug('::triggerScreenDataLoad err:%s', err);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateFormData"
//------------------------------------------------------------------------------

sysFactory.prototype.updateFormData = function(ScreenObj) {

	//- trigger dynamic pull down update
	//this.processDynPulldown(ScreenObj);

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
//- METHOD "switchScreensToBackground"
//------------------------------------------------------------------------------

sysFactory.prototype.switchScreensToBackground = function() {
	for (ScreenKey in this.Screens) {
		ScreenObj = this.Screens[ScreenKey];
		ScreenObj.HierarchyRootObject.setDOMVisibleState('hidden');
	}	
}


//------------------------------------------------------------------------------
//- METHOD "switchScreenToForeground"
//------------------------------------------------------------------------------

sysFactory.prototype.switchScreenToForeground = function(ScreenObj) {
	ScreenObj.HierarchyRootObject.setDOMVisibleState('visible');
}


//------------------------------------------------------------------------------
//- METHOD "getObjectsByType"
//------------------------------------------------------------------------------

sysFactory.prototype.getObjectsByType = function(ScreenID, Type) {
	console.debug('::getObjectsByType ScreenID:%s Type:%s', ScreenID, Type);
	var DstScreenObject = sysFactory.getScreenByID(ScreenID);
	var RootObj = DstScreenObject.HierarchyRootObject;
	return RootObj.getObjectsByType(Type);
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
//- METHOD "getGlobalVar"
//------------------------------------------------------------------------------

sysFactory.prototype.getGlobalVar = function(Key) {
	return (Key === undefined || Key == null) ? null : this.ObjGlobalData[Key];
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
//- Function "initOnChangeObjects"
//------------------------------------------------------------------------------

sysFactory.prototype.initOnChangeObjects = function() {
	for (ScreenID in this.Screens) {
		const Formlists = this.getObjectsByType(ScreenID, 'FormfieldList');
		//console.debug('Formlists:%o', Formlists);
		for (Key in Formlists) {
			console.debug('Formlist Key:%s', Key);
			Formlists[Key].initOnChangeItems();
		}
	}
}


//------------------------------------------------------------------------------
//- Function "resetErrorContainer"
//------------------------------------------------------------------------------

sysFactory.prototype.resetErrorContainer = function() {
	try {
		const ErrorContainerItems = this.getObjectsByType(this.CurrentScreenID, 'ErrorContainer');
		for (Index in ErrorContainerItems) {
			const ErrorContainerItem = ErrorContainerItems[Index];
			ErrorContainerItem.reset();
		}
	}
	catch(err) {
	}
}


//------------------------------------------------------------------------------
//- METHOD "getText"
//------------------------------------------------------------------------------

sysFactory.prototype.getText = function(TextID) {
	var RetValue;
	try {
		const TextObj = this.ObjText.getTextObjectByID(TextID);
		RetValue = TextObj[this.EnvUserLanguage];
	}
	catch(err) {
		RetValue = 'Missing Text with ID:' + TextID;
		console.debug('Text not found for given TextID:' + TextID);
	}
	return RetValue;
}
