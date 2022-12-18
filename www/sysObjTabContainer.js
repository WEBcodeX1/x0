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

	this.DOMType										= 'li'							//- Set DOM Element Type

	this.Default										= false;						//- false | true

	this.TextID											= null;							//- TextID

	this.Active											= false;						//- false | true

	this.TabContainer									= null;							//- TabContainer Object

	this.ValidateStatus									= null;							//- Child Form Validate Status

	this.StyleActive									= null;							//- Active Style
	this.StyleInactive									= null;							//- Inactive Style

	this.EventListeners									= new Object();					//- Event Listeners

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
	if (this.TabContainer.ContainerAttributes.Clickable !== false) {
		this.TabContainer.switchTab(this.TabID);
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
//- METHOD "switchStyle"
//------------------------------------------------------------------------------

sysTab.prototype.switchStyle = function()
{

	const SwitchObject1 = sysFactory.getObjectByID(this.SwitchStyleObject1ID);
	const SwitchObject2 = sysFactory.getObjectByID(this.SwitchStyleObject2ID);

	//- remove style
	this.removeDOMElementStyle(this.StyleRemove);
	SwitchObject1.removeDOMElementStyle(this.StyleRemove);
	SwitchObject2.removeDOMElementStyle(this.StyleRemove + 'Text');

	//- set style
	this.DOMStyle = this.Style;
	this.setDOMElementStyle();

	SwitchObject1.DOMStyle = this.Style;
	SwitchObject1.setDOMElementStyle();

	SwitchObject2.DOMStyle = this.Style + 'Text';
	SwitchObject2.setDOMElementStyle();

}


//------------------------------------------------------------------------------
//- METHOD "processService"
//------------------------------------------------------------------------------

sysTab.prototype.processService = function()
{
	if (this.ServiceURL !== undefined) {
		//const ScreenObject = sysFactory.getScreenByID(sysFactory.CurrentScreenID);
		this.PostRequestData.addServiceProperty('BackendServiceID', this.ServiceID);
		RPC = new sysCallXMLRPC(this.ServiceURL);
		RPC.Request(this);
	}
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysTab.prototype.callbackXMLRPCAsync = function()
{
	const DBColumnObjects = this.getObjectsByAttribute('DBColumn');
	//console.debug('::callbackXMLRPCAsync DBColumnObjects:%o', DBColumnObjects);

	for (i in DBColumnObjects) {
		const DstObject = DBColumnObjects[i];
		DstObject.updateDBValue(this.XMLRPCResultData[0]);
	}
}


//------------------------------------------------------------------------------
//- METHOD "setValidateStatus"
//------------------------------------------------------------------------------

sysTab.prototype.setValidateStatus = function(Status)
{
	this.ValidateStatus = Status;
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

	//- setup container divs
	NavDiv = new sysObjDiv();
	NavDiv.ObjectID = 'Nav';
	NavDiv.JSONConfig = {
		"Attributes": {
			"DOMType": "nav",
			"Style": "nav"
		}
	};
	NavDiv.init();

	this.NavListDiv = new sysObjDiv();
	this.NavListDiv.ObjectID = 'Ul';
	this.NavListDiv.JSONConfig = {
		"Attributes": {
			"DOMType": "ul",
			"Style": "ul"
		}
	};
	this.NavListDiv.init();

	//- connect objects
	NavDiv.addObject(this.NavListDiv);
	this.addObject(NavDiv);

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

	for (TabKey in Tabs) {

		TabConfigElement = Tabs[TabKey];

		var TabElement = new sysTab();
		var TabAttributes = TabConfigElement.Attributes;

		TabElement.TabID				= TabKey;
		TabElement.ObjectID				= TabKey+'Container';
		TabElement.Default				= TabAttributes.Default;
		TabElement.TextID				= TabAttributes.TextID;
		TabElement.ServiceURL			= TabAttributes.ServiceURL;
		TabElement.ServiceID			= TabAttributes.ServiceID;
		TabElement.FireEvents			= TabAttributes.FireEvents;
		TabElement.StyleActive			= this.ContainerAttributes.StyleActive;
		TabElement.StyleInactive		= this.ContainerAttributes.StyleInactive;
		TabElement.Index				= TabConfigElement.Index;

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

		this.Tabs[TabKey] = TabElement;

		if (TabElement.Index !== undefined) {
			this.TabsOrdered[TabElement.Index-1] = TabElement;
		}

		this.appendTabObject(TabElement);

        this.NavListDiv.addObject(TabElement);
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
	TabContentObj = new sysObjDiv();
	TabContentObj.ObjectID = TabElement.TabID;
	TabContentObj.ObjectType = 'TabContent';

	/*
		// MISSING: get style(s) from JSON config, issue #121
	*/
	TabContentObj.init();

	ButtonObj = new sysObjDiv();
	ButtonObj.ObjectID = TabElement.TabID + 'li';
	ButtonObj.DOMType = 'button';
	ButtonObj.DOMStyle = TabElement.Style;
	ButtonObj.init();

	var SQLTextObj = new sysObjSQLText();
	SQLTextObj.ObjectID = TabElement.ObjectID + 'text';
	SQLTextObj.TextID = TabElement.TextID;
	SQLTextObj.DOMStyle = TabElement.Style + 'Text';
	SQLTextObj.DOMType = 'span';
	SQLTextObj.init();

	TabElement.TabContentObj = TabContentObj;

	this.addObject(TabContentObj);

	var EventListenerObj = new Object();

	EventListenerObj['Type'] = 'mousedown';
	EventListenerObj['Element'] = TabElement.EventListenerClick.bind(TabElement);

	TabElement.EventListeners["clickTab"] = EventListenerObj;

	ButtonObj.addObject(SQLTextObj);
	TabElement.addObject(ButtonObj);

	TabElement.SwitchStyleObject1ID = ButtonObj.ObjectID;
	TabElement.SwitchStyleObject2ID = SQLTextObj.ObjectID;
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
	//console.debug('::switchTab TabID:%s', TabID);

	var Tabs = this.Tabs;

	for (TabKey in Tabs) {
		var TabElement = Tabs[TabKey];

		if (TabElement.Active == true) {

			//console.debug('::switchTab TabKey:%s Active==True', TabKey);

			TabElement.Active = false;
			TabElement.StyleRemove = TabElement.StyleActive;
			TabElement.Style = TabElement.StyleInactive;

		}

		if (TabElement.TabID == TabID) {

			//console.debug('Switching active tab:%s', this.ObjectID);
			//console.debug('::switchTab TabKey:%s Active==True', TabKey);

			this.setGlobalCurrentTab(TabID, TabElement);

			TabElement.Active = true;
			TabElement.StyleRemove = TabElement.StyleInactive;
			TabElement.Style = TabElement.StyleActive;

			TabElement.TabContentObj.setTabActivated();
			TabElement.TabContentObj.setDOMVisibleState('visible');
			TabElement.TabContentObj.Deactivated = false;

			//- fire events
			TabElement.fireEvents();

			//- trigger service data load
			TabElement.processService();

			//- deactivate all objects in state "Deactivated"
			TabElement.TabContentObj.deactivateDeactivated();

			//- trigger iframe resize
			sysFactory.resizeIframe();
		}
		else {
			TabElement.TabContentObj.Deactivated = true;
			TabElement.TabContentObj.setTabDeactivated();
			TabElement.TabContentObj.setDOMVisibleState('hidden');
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
		//console.debug('::loadAll Index:%s TabElement:%o', Index, TabElement);

		//- fire events
		TabElement.fireEvents();

		//- trigger service data load
		TabElement.processService();
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
//- METHOD "switchActiveTab"
//------------------------------------------------------------------------------

sysTabContainer.prototype.switchActiveTab = function()
{
	this.switchTab(this.getActiveTabID());
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
	//console.debug('::reset');
	this.switchDefaultTab();
}


//------------------------------------------------------------------------------
//- METHOD "switchFirstTabContainingErrors"
//------------------------------------------------------------------------------

sysTabContainer.prototype.switchFirstTabContainingErrors = function()
{
	for (TabKey in this.Tabs) {
		TabElement = this.Tabs[TabKey];
		if (TabElement.ValidateStatus === false) {
			this.switchTab(TabKey);
			break;
		}
	}
}
