//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "TabContainer"                                             -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Tab Container and Tab Handling                                           -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysTab"
//------------------------------------------------------------------------------

function sysTab()
{

	this.ObjectID										= null;							//- ObjectID
	this.TabID											= null;							//- TabID

	this.Default										= false;						//- false | true

	this.TextID											= null;							//- TextID

	this.Active											= false;						//- false | true

	this.StyleRemove									= null;							//- Remove Style
	this.Style											= null;							//. Set Style

	this.TabContainer									= null;							//- TabContainer Object

	this.ValidateStatus									= null;							//- Child Form Validate Status

	this.PositionLeft									= null;							//- Left Tab Start Position
	this.Width											= null;							//- Tab Width (Pixel)

	this.StyleActive									= null;							//- Active Style
	this.StyleInactive									= null;							//- Inactive Style

	this.ObjLeft										= null;							//- System Object Left Tab Part
	this.ObjMiddle										= null;							//- System Object Middle Tab Part
	this.ObjRight										= null;							//- System Object Right Tab Part
	this.ObjText										= null;							//- System Object SQL Text Tab Part

	this.UpdateDynPulldowns								= new Array();					//- Update DynPulldowns on Tab Switch
	this.UpdateFormFieldValues							= new Array();					//- Update FormField Values

	this.UpdateElements									= new Array();					//- Upadte Elements
																						//- should replace UpdateDynPulldowns and UpdateFormFieldValues

	this.ChildObjects									= new Array();					//- Child Objects

	this.PostRequestData								= new sysRequestDataHandler();	//- Base Recursive Root Object

}


sysTab.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------

sysTab.prototype.EventListenerClick = function(Event)
{
	//console.debug('::EventListenerClick sysTab TabID:' + this.TabID);
	this.TabContainer.switchTab(this.TabID);
}


//------------------------------------------------------------------------------
//- METHOD "resetPulldownFormListStatus"
//------------------------------------------------------------------------------

sysTab.prototype.resetPulldownFormListStatus = function()
{
}


//------------------------------------------------------------------------------
//- METHOD "addPulldownFormList"
//------------------------------------------------------------------------------

sysTab.prototype.addPulldownFormList = function(FormListID, Type)
{
    this.PDFormListsToActivateDeactivate[Type].push(FormListID);
    //console.log('::addPulldownFormList TabID:%s FormListID:%s Type:%s this.ActivateDeactivate:%o', this.ID, FormListID, Type, this.PDFormListsToActivateDeactivate);
}


//------------------------------------------------------------------------------
//- METHOD "removePulldownFormList"
//------------------------------------------------------------------------------

sysTab.prototype.removePulldownFormList = function(FormListID, Status, Type)
{
    var ArrayIndex = this.PDFormListsToActivateDeactivate[Type].indexOf(FormListID);
	delete this.PDFormListsToActivateDeactivate[Type][ArrayIndex];
}


//------------------------------------------------------------------------------
//- METHOD "updateDynPulldowns"
//------------------------------------------------------------------------------

sysTab.prototype.updateDynPulldowns = function()
{
    //console.debug('::updateDynPulldowns Pulldowns:%o', this.UpdateDynPulldowns);
	for (i in this.UpdateDynPulldowns) {
		this.UpdateDynPulldowns[i].updateValue();
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateDynFormValues"
//------------------------------------------------------------------------------

sysTab.prototype.updateDynFormValues = function()
{
	for (i in this.UpdateFormFieldValues) {
        try {
			var FormFieldItem = this.UpdateFormFieldValues[i];
			var SourceConfig = FormFieldItem.UpdateOnTabSwitch;
			var SourceFormListObject = sysFactory.getObjectByID(SourceConfig.SourceFormFieldList);
			var SourceFormFieldItem = SourceFormListObject.getFormFieldItemByID(SourceConfig.SourceFormField);
			FormFieldItem.setValue(SourceFormFieldItem.getObjectData());
		}
		catch(err) {
            console.log('::updateDynFormValues err:%s', err);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateOnSwitchElements"
//------------------------------------------------------------------------------

sysTab.prototype.updateOnSwitchElements = function()
{
	console.debug('::updateOnSwitchElements Elements:%o', this.UpdateElements);
	for (i in this.UpdateElements) {
		try {
			const UpdateElement = this.UpdateElements[i];
			const Attributes = UpdateElement.JSONConfig.Attributes.UpdateOnTabSwitchGlobal;

			const CheckFunction = Attributes.CheckFunction;
			const CheckFunctionParams = Attributes.CheckFunctionParams;
			const CheckResult = sysFactory.UserFunctions[CheckFunction](CheckFunctionParams);

			const UpdateFunctionParams = Attributes.UpdateFunctionParams;
			UpdateElement.updateOnTabSwitch(UpdateFunctionParams, CheckResult);
		}
		catch(e) {
			console.debug('::updateOnSwitchElements Error:%s', e);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "fireEvents"
//------------------------------------------------------------------------------

sysTab.prototype.fireEvents = function()
{
	if (this.FireEvents !== undefined) {
		sysFactory.Reactor.fireEvents(this.FireEvents);
	}
}


//------------------------------------------------------------------------------
//- METHOD "addOnChangeElement"
//------------------------------------------------------------------------------

sysTab.prototype.addOnChangeElement = function(Element)
{
	this.UpdateElements.push(Element);
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerMouseover"
//------------------------------------------------------------------------------

sysTab.prototype.EventListenerMouseover = function()
{
    /*
	//console.log('Event Hoover', this);
	var TooltipElement = document.getElementById('SYSGlobalTooltips');

	if (this.TooltipSite != null) {
		TooltipElement.innerHTML = '<object type="text/html data="'+this.TooltipSite+'" width="200" height="200" style="overflow:auto"></object>';
	}

	if (this.TooltipText != null) {
		TooltipElement.innerHTML = this.TooltipText;
	}

	if (this.TooltipSite == null && this.TooltipText == null) {
		TooltipElement.innerHTML = '';
	}

	var FormElement = document.getElementById(this.DOMObjectID);
	var x1pos = FormElement.getBoundingClientRect().x;
	var y1pos = FormElement.getBoundingClientRect().y;
	var x2pos = x1pos+FormElement.getBoundingClientRect().width;
	var y2pos = y1pos+FormElement.getBoundingClientRect().height-14;
	//console.log('DIV Layer coordinates x1:%s y1:%s', x1pos, y1pos);
	TooltipElement.style.transform = 'translate3d('+x2pos+'px, '+y2pos+'px, 0)';
    */
}


//------------------------------------------------------------------------------
//- METHOD "switchStyle"
//------------------------------------------------------------------------------
sysTab.prototype.switchStyle = function()
{

	//- remove style
	this.ObjLeft.removeDOMElementStyle(this.StyleRemove + 'Left');
	this.ObjMiddle.setDOMElementStyle(this.StyleRemove + 'Middle');
	this.ObjRight.setDOMElementStyle(this.StyleRemove + 'Right');
	this.ObjText.setDOMElementStyle(this.StyleRemove + 'Text');

	//- set style
	this.ObjLeft.DOMStyle	= this.Style + 'Left';
	this.ObjMiddle.DOMStyle	= this.Style + 'Middle';
	this.ObjRight.DOMStyle	= this.Style + 'Right';
	this.ObjText.DOMStyle	= this.Style + 'Text';

	this.ObjLeft.setDOMElementStyle();
	this.ObjMiddle.setDOMElementStyle();
	this.ObjRight.setDOMElementStyle();
	this.ObjText.setDOMElementStyle();

}


//------------------------------------------------------------------------------
//- METHOD "setValidateStatus"
//------------------------------------------------------------------------------
sysTab.prototype.setValidateStatus = function(Status)
{
	this.ValidateStatus = Status;
}


//------------------------------------------------------------------------------
//- METHOD "processService"
//------------------------------------------------------------------------------
sysTab.prototype.processService = function()
{
	if (this.ServiceURL !== undefined) {
		const ScreenObject = sysFactory.getScreenByID(sysFactory.ActualScreenID);
		this.PostRequestData.addServiceProperty('BackendServiceID', this.ServiceID);
		this.PostRequestData.add(ScreenObject.DBPrimaryKeyValue, 'DBPrimaryKeyValue');
		RPC = new sysCallXMLRPC(this.ServiceURL);
		RPC.Request(this);
	}
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------
sysTab.prototype.callbackXMLRPCAsync = function()
{
	sysFactory.updateServiceDBColumnObjects(this, this);
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysTabContainer"
//------------------------------------------------------------------------------

function sysTabContainer()
{
	this.Tabs			= new Object();		//- Tab Objects
	this.TabsOrdered	= new Array();		//- ordered Tab Objects
	this.ChildObjects	= new Array();		//- Child Objects recursive

	this.StyleActive	= null;				//- Style Ref Active
	this.StyleInactive	= null;				//- Style Ref Inactive
}

sysTabContainer.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysTabContainer.prototype.init = function()
{

	//- set config object attributes
	this.ContainerAttributes = this.JSONConfig.Attributes;

	//- connect tab container object for switching tabs from "outside"
	this.TabContainerObject = this;

	//console.debug('::init TabContainer ObjectUD:%s', this.ObjectID);

	//- setup container elements
	this.ContainerTable = new sysBaseObject();
	this.ContainerTable.ObjectID = 'Tabs';
	this.ContainerTable.DOMStyle = 'sysTabTable';
	this.ContainerTable.DOMStyleTop = this.ContainerAttributes.PositionTop + 'px';
	this.ContainerTable.DOMStyleLeft = this.ContainerAttributes.PositionLeft + 'px';

	this.ContainerTableRow = new sysBaseObject();
	this.ContainerTableRow.ObjectID = 'Row';
	this.ContainerTableRow.DOMStyle = 'sysTabTableRow';

	//- connect base elements
	this.ContainerTable.addObject(this.ContainerTableRow);

	this.addObject(this.ContainerTable);
	//this.addObject(this.ContainerContent);

	//- set base attributes
	this.StyleActive = this.ContainerAttributes.StyleActive;
	this.StyleInactive = this.ContainerAttributes.StyleInactive;

	//- add tabs from configurtaion
	this.addTabs();

}


//------------------------------------------------------------------------------
//- METHOD "addTabs"
//------------------------------------------------------------------------------

sysTabContainer.prototype.addTabs = function()
{

	var Tabs = this.ContainerAttributes.Tabs;
	var TabLeftPosition = 0;

	for (TabKey in Tabs) {

		TabConfigElement = Tabs[TabKey];

		var TabElement = new sysTab();
		var TabAttributes = TabConfigElement.Attributes;

		TabElement.TabID				= TabKey;
		TabElement.ObjectID				= TabKey;
		TabElement.ObjectType			= 'Tab';
		TabElement.Default				= TabAttributes.Default;
		TabElement.TextID				= TabAttributes.TextID;
		TabElement.Width				= TabAttributes.Width;
		TabElement.TooltipText			= TabAttributes.TooltipText;
		TabElement.TooltipSite			= TabAttributes.TooltipSite;
		TabElement.ServiceURL			= TabAttributes.ServiceURL;
		TabElement.ServiceID			= TabAttributes.ServiceID;
		TabElement.FireEvents			= TabAttributes.FireEvents;
		TabElement.StyleActive			= this.ContainerAttributes.StyleActive;
		TabElement.StyleInactive		= this.ContainerAttributes.StyleInactive;
		TabElement.DOMStyle				= TabAttributes.Style;
		TabElement.Index				= TabConfigElement.Index;

		TabElement.PositionLeft			= TabLeftPosition;

		TabElement.TabContainer			= this;

		if (TabAttributes.Default == true) {
			TabElement.Active	= true;
			TabElement.Style	= this.ContainerAttributes.StyleActive;
            this.setGlobalCurrentTab(TabKey, TabElement);
		}
		if (TabAttributes.Default == false || TabAttributes.Default === undefined) {
			TabElement.Active	= false;
			TabElement.Style	= this.ContainerAttributes.StyleInactive;
		}

		TabLeftPosition += TabElement.Width+4;

		this.Tabs[TabKey] = TabElement;

		if (TabElement.Index !== undefined) {
			this.TabsOrdered[TabElement.Index-1] = TabElement;
		}

		this.appendTabObject(TabElement);

        this.addObject(TabElement);
	}

}


//------------------------------------------------------------------------------
//- METHOD "getTabByTabId"
//------------------------------------------------------------------------------

sysTabContainer.prototype.getTabByTabID = function(TabID)
{
	return this.Tabs[TabID];
}


//------------------------------------------------------------------------------
//- METHOD "appendTabObject"
//------------------------------------------------------------------------------

sysTabContainer.prototype.appendTabObject = function(TabElement)
{

	var TabLeft = new sysBaseObject();
	TabLeft.ObjectID = 'TabLeft' + TabElement.ObjectID;
	TabLeft.DOMStyle = TabElement.Style + 'Left';
	TabLeft.DOMValue = '<img border="0" src="/images/spacer.png" width="4" height="4">';
	TabLeft.DOMStyleLeft = TabElement.PositionLeft + 'px';

	var TabMiddle = new sysBaseObject();
	TabMiddle.ObjectID = 'TabMiddle' + TabElement.ObjectID;
	TabMiddle.DOMStyle = TabElement.Style + 'Middle';
	TabMiddle.DOMStyleLeft = TabElement.PositionLeft + 4 + 'px';
	TabMiddle.DOMStyleWidth = TabElement.Width + 'px';

	var TabRight = new sysBaseObject();
	TabRight.ObjectID = 'TabRight' + TabElement.ObjectID;
	TabRight.DOMStyle = TabElement.Style + 'Right';
	TabRight.DOMValue = '<img border="0" src="/images/spacer.png" width="4" height="4">';
	TabRight.DOMStyleLeft = TabElement.PositionLeft + TabElement.Width + 'px';

	var SQLTextObj = new sysObjSQLText();
	SQLTextObj.ObjectID = 'SQLText'  + TabElement.ObjectID;
	SQLTextObj.TextID = TabElement.TextID;
	SQLTextObj.DOMStyle = TabElement.Style + 'Text';
	SQLTextObj.init();

	TabMiddle.addObject(SQLTextObj);

	//- add tab elements to container table row element
	this.ContainerTableRow.addObject(TabLeft);
	this.ContainerTableRow.addObject(TabMiddle);
	this.ContainerTableRow.addObject(TabRight);

	//- add event listener to sql text element (destination tab element)
	var EventListenerObj = new Object();
	EventListenerObj['Type'] = 'mousedown';
	EventListenerObj['Element'] = TabElement.EventListenerClick.bind(TabElement);

	SQLTextObj.EventListeners["ClickTab"] = EventListenerObj;

	//- add tooltip event listener
	EventListenerObj = new Object();
	EventListenerObj['Type'] = 'mouseover';
	EventListenerObj['Element'] = TabElement.EventListenerMouseover.bind(TabElement);

	SQLTextObj.EventListeners["HooverTab"] = EventListenerObj;

	//- connect container element to root object
	TabElement.ObjLeft		= TabLeft;
	TabElement.ObjMiddle	= TabMiddle;
	TabElement.ObjRight		= TabRight;
	TabElement.ObjText		= SQLTextObj;

}


//------------------------------------------------------------------------------
//- METHOD "setGlobalCurrentTab"
//------------------------------------------------------------------------------

sysTabContainer.prototype.setGlobalCurrentTab = function(TabID, TabElement)
{
	sysFactory.currentTabID = TabID;
	sysFactory.currentTabContainerObject = this;
	sysFactory.currentTabObject = TabElement;
}


//------------------------------------------------------------------------------
//- METHOD "switchTab"
//------------------------------------------------------------------------------

sysTabContainer.prototype.switchTab = function(TabID)
{
	var Tabs = this.Tabs;

	//- do not process click on active tab
	for (TabKey in Tabs) {
		var TabElement = Tabs[TabKey];
		if (TabElement.TabID == TabID && TabElement.Active == true) { return; }
	}

	for (TabKey in Tabs) {
		var TabElement = Tabs[TabKey];

		if (TabElement.Active == true) {
			TabElement.Active = false;
			TabElement.StyleRemove = TabElement.StyleActive;
			TabElement.Style = TabElement.StyleInactive;
            
			TabElement.deactivate();
		}

		if (TabElement.TabID == TabID) {
			//console.debug('Switching active tab in container:%s', this.ObjectID);

			this.setGlobalCurrentTab(TabID, TabElement);
			TabElement.Active = true;
			TabElement.StyleRemove = TabElement.StyleInactive;
			TabElement.Style = TabElement.StyleActive;

			TabElement.activate();

			//- fire events
			TabElement.fireEvents();

			//- trigger service data load
			TabElement.processService();

			//- update dynamic pulldowns
			TabElement.updateDynPulldowns();

            //- update dynamic form field values
			TabElement.updateDynFormValues();

			//- update on tab switch elements
			TabElement.updateOnSwitchElements();

			//- trigger iframe resize
			sysFactory.resizeIframe();

		}

		TabElement.switchStyle();
	}

}


//------------------------------------------------------------------------------
//- METHOD "loadAll"
//------------------------------------------------------------------------------

sysTabContainer.prototype.loadAll = function()
{
	const TabsOrdered = this.TabsOrdered;
	for (Index in TabsOrdered) {
		const TabElement = TabsOrdered[Index];
		console.debug('::loadAll Index:%s TabElement:%o', Index, TabElement);

		//- fire events
		TabElement.fireEvents();

		//- trigger service data load
		TabElement.processService();

		//- update dynamic pulldowns
		TabElement.updateDynPulldowns();

		//- update dynamic form field values
		TabElement.updateDynFormValues();
	}
}


//------------------------------------------------------------------------------
//- METHOD "addUpdateOnTabSwitchElement"
//------------------------------------------------------------------------------

sysTabContainer.prototype.addUpdateOnTabSwitchElement = function(TabID, Element)
{
	try {
		var Tab = this.getTabByTabID(TabID);
        //console.log('::addUpdateOnTabSwitchElement TabID:%s Element:%o', TabID, Element);
		if (Element.Type == 'dynpulldown') {
			Tab.UpdateDynPulldowns.push(Element);
        }
		if (Element.Type == 'text') {
			Tab.UpdateFormFieldValues.push(Element);
        }
	}
	catch(err) {
        console.log('::addUpdateOnTabSwitchElement err:%s', err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "addUpdateOnSwitchElement"
//------------------------------------------------------------------------------

sysTabContainer.prototype.addUpdateOnSwitchElement = function(TabID, Element)
{
	try {
		const Tab = this.getTabByTabID(TabID);
        //console.log('::addUpdateOnTabSwitchElement TabID:%s Element:%o', TabID, Element);
		Tab.UpdateElements.push(Element);
	}
	catch(err) {
        console.log('::addUpdateOnSwitchElement err:%s', err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "getActiveTabID"
//------------------------------------------------------------------------------

sysTabContainer.prototype.getActiveTabID = function()
{
	for (TabKey in this.Tabs) {
		TabElement = this.Tabs[TabKey];
		if (TabElement.Active == true) { return TabKey; }
	}
}


//------------------------------------------------------------------------------
//- METHOD "activateActivaTab"
//------------------------------------------------------------------------------

sysTabContainer.prototype.activateActiveTab = function()
{
	this.getTabByTabID(this.getActiveTabID()).activate();
}


//------------------------------------------------------------------------------
//- METHOD "getDefaultTabID"
//------------------------------------------------------------------------------

sysTabContainer.prototype.getDefaultTabID = function()
{
    for (TabKey in this.Tabs) {
		TabElement = this.Tabs[TabKey];
		if (TabElement.Default == true) { return TabKey; }
    }
}


//------------------------------------------------------------------------------
//- METHOD "switchDefaultTab"
//------------------------------------------------------------------------------

sysTabContainer.prototype.switchDefaultTab = function()
{
	this.switchTab(this.getDefaultTabID());
}


//------------------------------------------------------------------------------
//- METHOD "resset"
//------------------------------------------------------------------------------

sysTabContainer.prototype.reset = function()
{
	this.switchDefaultTab();
}


//------------------------------------------------------------------------------
//- METHOD "setValidateStatus"
//------------------------------------------------------------------------------
sysTabContainer.prototype.switchFirstTabContainingErrors = function()
{
	for (TabKey in this.Tabs) {
		TabElement = this.Tabs[TabKey];
		if (TabElement.ValidateStatus == false) {
            this.switchTab(TabKey);
            break;
        }
    }
}
