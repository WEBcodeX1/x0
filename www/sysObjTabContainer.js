//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
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
    this.ObjectID                 = null;                            //- ObjectID
    this.TabID                    = null;                            //- TabID

    this.DOMType                  = 'li'                             //- Set DOM Element Type
    this.DOMStyle                 = 'nav-item'                       //- Set DOM Element Type

    this.ContentObj               = new sysBaseObject();             //- Tab Content Container

    this.Default                  = false;                           //- false | true

    this.TextID                   = null;                            //- TextID

    this.Active                   = false;                           //- false | true

    this.TabContainer             = null;                            //- TabContainer Object

    this.ValidateStatus           = null;                            //- Child Form Validate Status

    this.StyleActive              = null;                            //- Active Style
    this.StyleInactive            = null;                            //- Inactive Style

    this.EventListeners           = new Object();                    //- Event Listeners

    this.ChildObjects             = new Array();                     //- Child Objects

    this.PostRequestData          = new sysRequestDataHandler();     //- POST Request Data
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
//- METHOD "fireEvents"
//------------------------------------------------------------------------------

sysTab.prototype.fireEvents = function()
{
    if (this.FireEvents !== undefined) {
        sysFactory.Reactor.fireEvents(this.FireEvents);
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
    this.ChildObjects                = new Array();                //- Child Objects

    this.Tabs                        = new Object();               //- Tab Objects
    this.ChildObjects                = new Array();                //- Child Objects recursive

    this.ContentContainer            = new sysBaseObject();        //- Tab Content Container
    this.TabsContainer               = new sysBaseObject();        //- Tabs Container
}

sysTabContainer.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysTabContainer.prototype.init = function()
{
    //- set tabs container object ids and css style
    this.TabsContainer.ObjectID = this.ObjectID + 'TabsContainer';
    this.TabsContainer.DOMType = 'ul';
    this.TabsContainer.DOMStyle = 'nav nav-tabs';
    this.addObject(this.TabsContainer);

    //- set content container object ids
    this.ContentContainer.ObjectID = this.ObjectID + 'ContentContainer';
    this.ContentContainer.ObjectShortID = this.ObjectID + 'Ctnt';
    this.addObject(this.ContentContainer);

    //- set config object attributes
    this.ContainerAttributes = this.JSONConfig.Attributes;

    //- connect tab container object for switching tabs from "outside"
    this.TabContainerObject = this;

    //console.debug('::init TabContainer ObjectUD:%s', this.ObjectID);

    //- add tabs from configurtaion
    this.addTabs();
}


//------------------------------------------------------------------------------
//- METHOD "addTabs"
//------------------------------------------------------------------------------

sysTabContainer.prototype.addTabs = function()
{
    var Tabs = this.ContainerAttributes.Tabs;

    for (const TabItem of Tabs) {

        TabID = TabItem.ID;

        console.debug('TabID:%s', TabID);

        var TabElement = new sysTab();
        const TabAttributes = TabItem.Attributes;

        TabElement.TabID       = TabID;
        TabElement.ObjectID    = TabID;
        TabElement.Default     = TabAttributes.Default;
        TabElement.TextID      = TabAttributes.TextID;
        TabElement.FireEvents  = TabAttributes.FireEvents;
        TabElement.Index       = TabItem.Index;

        TabElement.TabContainer = this;

        TabElement.ContentObj.ObjectID = TabID + 'Content';

        if (TabAttributes.Default == true) {
            TabElement.Active = true;
            this.setGlobalCurrentTab(TabID, TabElement);
        }
        if (TabAttributes.Default == false || TabAttributes.Default === undefined) {
            TabElement.Active = false;
        }

        this.Tabs[TabID] = TabElement;

        this.appendTabObject(TabElement);
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
    TabElement.SQLTextObj = new sysObjSQLText();
    TabElement.SQLTextObj.ObjectID = TabElement.TabID + 'Text';
    TabElement.SQLTextObj.TextID = TabElement.TextID;
    TabElement.SQLTextObj.DOMStyle = 'nav-link';
    TabElement.SQLTextObj.DOMType = 'a';
    TabElement.SQLTextObj.init();

    TabElement.addObject(TabElement.SQLTextObj);

    this.TabsContainer.addObject(TabElement);
    this.ContentContainer.addObject(TabElement.ContentObj);

    var EventListenerObj = new Object();

    EventListenerObj['Type'] = 'mousedown';
    EventListenerObj['Element'] = TabElement.EventListenerClick.bind(TabElement);

    TabElement.EventListeners["TabClick"] = EventListenerObj;
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
    console.debug('::switchTab TabID:%s', TabID);

    for (const ProcessTabID in this.Tabs) {

        TabElement = this.Tabs[ProcessTabID];
        console.debug('TabElement:%o TabID:%s', TabElement, ProcessTabID);

        if (TabElement.TabID == TabID) {

            //console.debug('Switching active tab:%s', this.ObjectID);
            //console.debug('::switchTab TabKey:%s Active==True', TabKey);

            this.setGlobalCurrentTab(TabID, TabElement);

            TabElement.Active = true;
            TabElement.SQLTextObj.DOMStyle = 'nav-link active';
            TabElement.SQLTextObj.setDOMElementStyle();

            TabElement.ContentObj.setActivated();
            TabElement.ContentObj.VisibleState = 'visible';
            TabElement.ContentObj.setDOMVisibleState();

            //- fire events
            TabElement.fireEvents();
        }
        else {
            TabElement.Active = false;
            TabElement.SQLTextObj.DOMStyle = 'nav-link';
            TabElement.SQLTextObj.setDOMElementStyle();

            TabElement.ContentObj.setDeactivated();
            TabElement.ContentObj.VisibleState = 'hidden';
            TabElement.ContentObj.setDOMVisibleState();
        }
    }

}


//------------------------------------------------------------------------------
//- METHOD "loadAll"
//------------------------------------------------------------------------------

sysTabContainer.prototype.loadAll = function()
{
    for (const TabID in this.Tabs) {
        TabElement = this.Tabs[TabID];
        TabElement.fireEvents();
        /*
        TabElement.processService();
        */
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
    const ActiveTabID = this.getActiveTabID();
    console.debug('ActiveTabID:%s', ActiveTabID);
    this.switchTab(ActiveTabID);
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
    const DefaultTabID = this.getDefaultTabID();
    console.debug('DefaultTabID:%s', DefaultTabID);
    this.switchTab(DefaultTabID);
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
