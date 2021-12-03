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

function sysScreen() {

	this.ScreenID				= null;							//- ScreenID
	this.zIndex					= null;							//- Layer z-axis position
	this.LinkObj				= null;							//- Menu Link Object

	this.DBPrimaryKeyID			= null;							//- DB Primary Key Identifier
	this.DBPrimaryKeyValue		= null;							//- DB Primary Key Value

	this.SkeletonData			= null;							//- JSON Skeleton Data (configuration)

	this.HierarchyRootObject	= new sysObjDiv();				//- Base Recursive Root Object

	this.PostRequestData		= new sysRequestDataHandler();	//- Base Recursive Root Object

	this.DBResultRow			= null;							//- Database Result for (DBColumn(s))

	this.SetupClasses = {
		'TabContainer': sysTabContainer,
		'SQLText': sysObjSQLText,
		'Button': sysObjButton,
		'ButtonInternal': sysObjButtonInternal,
		'NavigateForwardBackward': sysObjNavigateForwardBackward,
		'List': sysList,
		'FormFieldList': sysFormFieldList,
		'ServiceConnector': sysServiceConnector,
		'Div': sysObjDiv,
		'FileUpload': sysFileUpload,
		'ErrorContainer': sysErrorContainer,
		'Link': sysObjLink,
		'LinkExternal': sysObjLinkExternal,
		'RowContainer': sysObjRowContainer,
		'FormulaField': sysObjFormula
	};
}


//------------------------------------------------------------------------------
//- METHOD "setup"
//------------------------------------------------------------------------------

sysScreen.prototype.setup = function(DBPrimaryKeyValue) {

	console.debug('::setup ScreenID:%s ScreenObject:%o DBPrimaryKeyValue:%s', this.ScreenID, this, DBPrimaryKeyValue);

	//- DEPRECATED, DBPrimaryKeyValue should be replaced by self-defined variables
	this.DBPrimaryKeyValue = DBPrimaryKeyValue;

	this.HierarchyRootObject.ObjectID = this.ScreenID;
	this.HierarchyRootObject.DOMStyle = 'sysScreenRoot col-lg-10 col-md-12';

	this.setupObject(this.ScreenID, this.HierarchyRootObject);

	//- dynamic update (prepare objects for rendering) formlist formitems
	// (old style, should be unneccesarry after refactoring)
	this.HierarchyRootObject.renderFormlists();

	//- connect ServiceConnector Objects
	this.HierarchyRootObject.connectServiceConnectorObjects();

	//- recursive render screen root object
	this.HierarchyRootObject.renderObject();

	//- deactivate non default tabs
	this.HierarchyRootObject.deactivateTab();

	//- deactivate non default tabs
	this.HierarchyRootObject.ActivateActiveTab();

	//- process event listeners
	this.HierarchyRootObject.processEventListener();

	//console.debug('sysScreen.setup() RootObject:%o', this.RootObject);
}


//------------------------------------------------------------------------------
//- METHOD "addConfigObjectsRecursive"
//------------------------------------------------------------------------------

sysScreen.prototype.setupObject = function(ObjectID, HierarchyObject, HierarchyLevel=0) {

	const SkeletonData = this.getSkeletonObjectsByObjectRefId(ObjectID);
	//console.debug('::setupObject ObjectID:%s SkeletonData:%o', ObjectID, SkeletonData);

	for (ObjectIndex in SkeletonData) {
		const ObjectItem = SkeletonData[ObjectIndex];
		const Key = Object.keys(ObjectItem)[0];
		const SkeletonItem = ObjectItem[Key];
		var JSONConfig = sysFactory.DataObject.XMLRPCResultData[Key];

		//console.debug('::setupObject ParamObjectID:%s ProcessObjectKey:%s', ObjectID, Key);

		try {

			if (JSONConfig.RefID !== undefined) {
				var JSONConfigRef = sysFactory.DataObject.XMLRPCResultData[JSONConfig.RefID];
				JSONConfig = sysMergeObjects(JSONConfig, JSONConfigRef);
				this.processOverwriteAtttributes(JSONConfig);
				this.processRepolaceAtttributes(JSONConfig, JSONConfigRef);
			}

			//console.debug('::setupObject ProcessSkeletonObjectKey:%s SkeletonItem:%o JSONConfig:%o', Key, SkeletonItem, JSONConfig);

			var AddHierarchyObject = new this.SetupClasses[JSONConfig.Type]();

			AddHierarchyObject.JSONConfig	= JSONConfig;

			AddHierarchyObject.ObjectID		= Key;
			AddHierarchyObject.ObjectType	= JSONConfig.Type;
			AddHierarchyObject.Level		= HierarchyLevel;
			AddHierarchyObject.ScreenObject = this;

			AddHierarchyObject.ParentID		= SkeletonItem.ElementID === undefined ? SkeletonItem.RefID : SkeletonItem.ElementID;

			//console.debug('::setupObject ObjectID:%s ParentID:%s', Key, AddHierarchyObject.ParentID);

			if (JSONConfig.RefID !== undefined) {
				AddHierarchyObject.updateInstanceObjectNames();
			}

			AddHierarchyObject.init();

			if (SkeletonItem.ElementID !== undefined && SkeletonItem.ElementID != null) {
				var AddObject = this.HierarchyRootObject.getObjectByID(SkeletonItem.ElementID);
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

sysScreen.prototype.processOverwriteAtttributes = function(JSONConfig) {
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
//- METHOD "processRepolaceAtttributes"
//------------------------------------------------------------------------------

sysScreen.prototype.processRepolaceAtttributes = function(JSONConfig, JSONConfigRef) {
	const AttributesReplace = JSONConfig.AttributesReplace;
	//console.debug('processReplaceAtttributes AttributesReplace:%o JSONConfig:%o JSONConfigRef:%o', AttributesReplace, JSONConfig, JSONConfigRef);
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

sysScreen.prototype.getSkeletonObjectsByObjectRefId = function(ObjectId) {
	var RefObjects = new Array();

	for (ObjectIndex in this.SkeletonData) {
		const ObjectItem = this.SkeletonData[ObjectIndex];
		const ObjectKey = Object.keys(ObjectItem)[0];
		//console.debug('::getSkeletonObjectsByObjectRefId ObjectId:%s ObjectKey:%s', ObjectId, ObjectKey);
		const ProcessObj = ObjectItem[ObjectKey];
		if (ProcessObj.RefID == ObjectId) {
			var AddObject = new Object();
			AddObject[ObjectKey] = ProcessObj;
			RefObjects.push(AddObject);
		}
	}

	return RefObjects;
}


//------------------------------------------------------------------------------
//- METHOD "triggerGlobalDataLoad"
//------------------------------------------------------------------------------

sysScreen.prototype.triggerGlobalDataLoad = function() {
	var MenuItem = this.LinkObj.MenuItem;
	//console.debug('::triggerGlobalDataLoad LinkObj MenuItem:%o', MenuItem);

	if (MenuItem.TabContainersLoadAll !== undefined) {
		for (Index in MenuItem.TabContainersLoadAll) {
			const TabContainerID = MenuItem.TabContainersLoadAll[Index];
			//console.debug('::triggerGlobalDataLoad Index:%s TabContainerID:%s', Index, TabContainerID);
			const TabContainer = this.HierarchyRootObject.getObjectByID(TabContainerID);
			//console.debug('::triggerGlobalDataLoad TabContainer:%o', TabContainer);
			if (TabContainer !== undefined) {
				TabContainer.loadAll();
			}
		}
	}

	if (MenuItem.ServiceURL !== undefined) {
		this.PostRequestData.addServiceProperty('BackendServiceID', MenuItem.ServiceID);
		this.PostRequestData.add(this.DBPrimaryKeyValue, 'DBPrimaryKeyValue');
		RPC = new sysCallXMLRPC(MenuItem.ServiceURL);
		RPC.Request(this);
	}
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysScreen.prototype.callbackXMLRPCAsync = function()
{
	sysFactory.updateServiceDBColumnObjects(this.HierarchyRootObject, this);
}


//------------------------------------------------------------------------------
//- METHOD "getDBColumnValue"
//------------------------------------------------------------------------------

sysScreen.prototype.getDBColumnValue = function(id)
{
	return this.XMLRPCResultData[0][id];
}
