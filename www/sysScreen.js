//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "Screen" Processing                                               -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Classes                                                                   //
//- ::sysScreen                                                              -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysScreen"
//------------------------------------------------------------------------------

function sysScreen(IsOverlay)
{
	this.ScreenID				= null;							//- ScreenID
	this.SkeletonData			= null;							//- JSON Skeleton Data (configuration)

	this.HierarchyRootObject	= new sysObjDiv();				//- Base Recursive Root Object

	this.PostRequestData		= new sysRequestDataHandler();	//- Base Recursive Root Object

	this.GlobalVars				= new Object();					//- GLobal Variables

	this.IsOverlay				= IsOverlay;

	this.setStyle();
}


//------------------------------------------------------------------------------
//- METHOD "setStyle"
//------------------------------------------------------------------------------

sysScreen.prototype.setStyle = function(Style)
{
	if (Style === undefined) {
		const DefaultStyle = sysFactory.DefaultStyleScreen;
		this.CSSStyle = (DefaultStyle !== undefined) ? DefaultStyle : 'sysScreenRoot col-10';
	}
	else {
		this.CSSStyle = Style;
	}
}


//------------------------------------------------------------------------------
//- METHOD "setup"
//------------------------------------------------------------------------------

sysScreen.prototype.setup = function()
{
	//console.debug('::setup ScreenID:%s', this.ScreenID);

	const iOv = this.IsOverlay;

	this.HierarchyRootObject.ObjectID = (iOv !== true) ? this.ScreenID : this.ScreenID + '__overlay';
	this.HierarchyRootObject.DOMStyle = this.CSSStyle;

	this.setupObject(this.ScreenID, this.HierarchyRootObject);

	//- connect ServiceConnector Objects
	this.HierarchyRootObject.connectServiceConnectorObjects();

	//console.debug('HierarchyRoot:%o', this.HierarchyRootObject);

	//- render screen root object (recurse)
	this.HierarchyRootObject.renderObject();

	//- process object reset (recurse)
	this.HierarchyRootObject.processReset();

	//- process event listeners
	this.HierarchyRootObject.processEventListener();

	//console.debug('sysScreen.setup() RootObject:%o', this.RootObject);
}


//------------------------------------------------------------------------------
//- METHOD "addConfigObjectsRecursive"
//------------------------------------------------------------------------------

sysScreen.prototype.setupObject = function(ObjectID, HierarchyObject, HierarchyLevel=0)
{
	const SkeletonData = this.getSkeletonObjectsByObjectRefId(ObjectID);
	//console.debug('::setupObject ObjectID:%s SkeletonData:%o', ObjectID, SkeletonData);

	for (ObjectIndex in SkeletonData) {
		const ObjectItem = SkeletonData[ObjectIndex];
		const Key = Object.keys(ObjectItem)[0];
		const SkeletonItem = ObjectItem[Key];
		var JSONConfig = sysFactory.DataObject.XMLRPCResultData[Key];

		//console.debug('::setupObject ParamObjectID:%s ProcessObjectKey:%s JSONConfig:%o', ObjectID, Key, JSONConfig);

		try {

			if (JSONConfig !== undefined && JSONConfig.RefID !== undefined) {
				var JSONConfigRef = sysFactory.DataObject.XMLRPCResultData[JSONConfig.RefID];
				JSONConfig = sysMergeObjects(JSONConfig, JSONConfigRef);
				this.processOverwriteAtttributes(JSONConfig);
				this.processReplaceAtttributes(JSONConfig, JSONConfigRef);
			}

			//console.debug('::setupObject ProcessSkeletonObjectKey:%s SkeletonItem:%o JSONConfig:%o', Key, SkeletonItem, JSONConfig);

			var AddHierarchyObject = new sysFactory.SetupClasses[JSONConfig.Type]();

			AddHierarchyObject.JSONConfig	= JSONConfig;

			AddHierarchyObject.ObjectID		= (this.IsOverlay !== true) ? Key : Key + '__overlay';;
			AddHierarchyObject.ObjectType	= JSONConfig.Type;
			AddHierarchyObject.Level		= HierarchyLevel;
			AddHierarchyObject.ScreenObject = this;

			AddHierarchyObject.ParentID		= SkeletonItem.ElementID === undefined ? SkeletonItem.RefID : SkeletonItem.ElementID;

			//console.debug('::setupObject ObjectID:%s ParentID:%s', Key, AddHierarchyObject.ParentID);

			if (JSONConfig.InstancePrefix !== undefined && JSONConfig.RefID !== undefined) {
				AddHierarchyObject.updateInstanceObjectNames();
			}

			if (this.IsOverlay === true) {
				AddHierarchyObject.rewriteOverlayFormitemNames();
			}

			AddHierarchyObject.init();

			if (SkeletonItem.ElementID !== undefined && SkeletonItem.ElementID != null) {
				//var AddObject = this.HierarchyRootObject.getObjectByID(SkeletonItem.ElementID);
				var AddObject = sysFactory.getObjectByID(SkeletonItem.ElementID);
				//console.debug('::setupObject AddObject:%o', AddObject);
				AddObject.addObject(AddHierarchyObject);
			}
			else {
				//console.debug('::setupObject AddHierarchyObject:%o', HierarchyObject);
				HierarchyObject.addObject(AddHierarchyObject);
			}

			HierarchyLevel +=1;
			this.setupObject(Key, AddHierarchyObject, HierarchyLevel);
			HierarchyLevel -=1;
		
		}
		catch(err) {
			console.debug('::setupObject ObjectID:%s err:%s', Key, err);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "processOverwriteAtttributes"
//------------------------------------------------------------------------------

sysScreen.prototype.processOverwriteAtttributes = function(JSONConfig)
{
	const AttributesOverwrite = JSONConfig.AttributesOverwrite;
	//console.debug('processOverwriteAtttributes JSONConfig:%o', JSONConfig);
	if (AttributesOverwrite !== undefined) {
		for (ConfigKey in AttributesOverwrite) {
			const ConfigValue = AttributesOverwrite[ConfigKey];
			//console.debug('::processOverwriteAtttributes ConfigKey:%s ConfigValue:%o', ConfigKey, ConfigValue);
			JSONConfig.Attributes[ConfigKey] = ConfigValue;
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "processReplaceAtttributes"
//------------------------------------------------------------------------------

sysScreen.prototype.processReplaceAtttributes = function(JSONConfig, JSONConfigRef)
{
	const AttributesReplace = JSONConfig.AttributesReplace;
	if (AttributesReplace !== undefined) {
		for (Index in AttributesReplace) {
			const Config = AttributesReplace[Index];
			const Source = Config.DataSrc;
			//console.debug('::processReplaceAtttributes Config:%o Source:%o', Config, Source);
			if (Source.length == 1) {
				JSONConfig.Attributes[Source[0]] = Config.Data;
			}
			if (Source.length == 2) {
				JSONConfig.Attributes[Source[0]][Source[1]] = Config.Data;
			}
			//console.debug('::processReplaceAtttributes replaced JSONConfig:%o', JSONConfig.Attributes);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "getSkeletonObjectsByObjectRefID"
//------------------------------------------------------------------------------

sysScreen.prototype.getSkeletonObjectsByObjectRefId = function(ObjectId)
{
	var RefObjects = new Array();

	var SkeletonComplete = sysFactory.DataSkeleton.XMLRPCResultData;

	//console.debug('SkeletonComplete:%o', SkeletonComplete);

	if (ObjectId == 'sysMenu') {
		SkeletonComplete['sysMenu'] = sysFactory.DataMenu.XMLRPCResultData;
	}

	for (ScreenID in SkeletonComplete) {

		const SkeletonScreen = SkeletonComplete[ScreenID];

		for (ObjectIndex in SkeletonScreen) {

			const ObjectItem = SkeletonScreen[ObjectIndex];
			const ObjectKey = Object.keys(ObjectItem)[0];
			const ProcessObj = ObjectItem[ObjectKey];

			if (ProcessObj.RefID == ObjectId) {
				var AddObject = new Object();
				AddObject[ObjectKey] = ProcessObj;
				RefObjects.push(AddObject);
			}
		}
	}

	return RefObjects;
}


//------------------------------------------------------------------------------
//- METHOD "triggerGlobalDataLoad"
//------------------------------------------------------------------------------

sysScreen.prototype.triggerGlobalDataLoad = function()
{
	const Config = this.JSONConfig;

	console.debug('::triggerGlobalDataLoad JSONConfig:%o', Config);

	//- fire all tab related events, load all service connected object data
	if (Config !== undefined && Config.TabContainersLoadAll !== undefined) {
		for (Index in MenuItem.TabContainersLoadAll) {
			const TabContainerID = this.TabContainersLoadAll[Index];
			//console.debug('::triggerGlobalDataLoad Index:%s TabContainerID:%s', Index, TabContainerID);
			const TabContainer = this.HierarchyRootObject.getObjectByID(TabContainerID);
			//console.debug('::triggerGlobalDataLoad TabContainer:%o', TabContainer);
			if (TabContainer !== undefined) {
				TabContainer.loadAll();
			}
		}
	}

	//- request global screen data load (into screen global vars)
	if (Config !== undefined && Config.OnScreenSwitch !== undefined) {
		RPC = new sysCallXMLRPC(
			Config.OnScreenSwitch.ScriptURL,
			Config.OnScreenSwitch.ScriptParams
		);
		RPC.Request(this);
	}
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysScreen.prototype.callbackXMLRPCAsync = function()
{
	//- set global vars from backend result
	this.setGlobalVars(this.XMLRPCResultData);

	//- call updateValue() function on all objects recursive
	this.HierarchyRootObject.processUpdate();
}


//------------------------------------------------------------------------------
//- METHOD "setGlobalVar"
//------------------------------------------------------------------------------

sysScreen.prototype.setGlobalVar = function(Key, Value)
{
	//console.debug('setGlobalVar Key:%s Value:%s', Key, Value);
	this.GlobalVars[Key] = Value;
}


//------------------------------------------------------------------------------
//- METHOD "setGlobalVars"
//------------------------------------------------------------------------------

sysScreen.prototype.setGlobalVars = function(GlobalVars)
{
	this.GlobalVars = GlobalVars;
}


//------------------------------------------------------------------------------
//- METHOD "getGlobalVar"
//------------------------------------------------------------------------------

sysScreen.prototype.getGlobalVar = function(Key)
{
	return this.GlobalVars[Key];
}


//------------------------------------------------------------------------------
//- METHOD "getGlobalVars"
//------------------------------------------------------------------------------

sysScreen.prototype.getGlobalVars = function()
{
	return this.GlobalVars;
}


//------------------------------------------------------------------------------
//- METHOD "mergeGlobalVars"
//------------------------------------------------------------------------------

sysScreen.prototype.mergeGlobalVars = function(VarObj)
{
	for (Key in VarObj) {
		const Value = VarObj[Key];
		this.setGlobalVar(Key, Value);
	};
}
