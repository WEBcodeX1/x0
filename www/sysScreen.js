//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM Object "sysScreen"                                                -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysScreen"
//------------------------------------------------------------------------------

function sysScreen()
{
    this.ScreenID                = null;                           //- ScreenID
    this.SkeletonData            = null;                           //- JSON Skeleton Data (configuration)

    this.HierarchyRootObject     = new sysObjDiv();                //- Base Recursive Root Object

    this.PostRequestData         = new sysRequestDataHandler();    //- Base Recursive Root Object

    this.GlobalVars              = new Object();                   //- Global Variables

    this.setStyle();
}


//------------------------------------------------------------------------------
//- METHOD "setStyle"
//------------------------------------------------------------------------------

sysScreen.prototype.setStyle = function(Style)
{
    this.CSSStyle = (Style === undefined) ? sysFactory.DefaultStyleScreen : Style;
}


//------------------------------------------------------------------------------
//- METHOD "updateStyle"
//------------------------------------------------------------------------------

sysScreen.prototype.updateStyle = function(Style)
{
    this.HierarchyRootObject.DOMStyle = Style;
    this.HierarchyRootObject.setDOMElementStyle();
}


//------------------------------------------------------------------------------
//- METHOD "setup"
//------------------------------------------------------------------------------

sysScreen.prototype.setup = function()
{
    //- set object id, style
    this.HierarchyRootObject.ObjectID = this.ScreenID;
    this.HierarchyRootObject.DOMStyle = this.CSSStyle;

    //- recursive setup object hierarchy
    this.setupObject(this.ScreenID, this.HierarchyRootObject);

    //- connect ServiceConnector Objects
    this.HierarchyRootObject.connectServiceConnectorObjects();

    //- render screen root object (recurse)
    this.HierarchyRootObject.renderObject();

    //- process object reset (recurse)
    this.HierarchyRootObject.processReset();

    //- process event listeners
    this.HierarchyRootObject.processEventListener();

    //- debug output
    console.debug('::sysScreen setup() ScreenID:%s RootObject:%o', this.ScreenID, this.HierarchyRootObject);
}


//------------------------------------------------------------------------------
//- METHOD "addConfigObjectsRecursive"
//------------------------------------------------------------------------------

sysScreen.prototype.setupObject = function(ObjectID, HierarchyObject, HierarchyLevel=0)
{
    const SkeletonData = this.getSkeletonObjectsByObjectRefId(ObjectID);
    console.debug('::setupObject ObjectID:%s SkeletonData:%o', ObjectID, SkeletonData);

    for (const ObjectItem of SkeletonData)
    {
        const Key = Object.keys(ObjectItem)[0];
        const SkeletonItem = ObjectItem[Key];
        let JSONConfig = sysFactory.DataObject.XMLRPCResultData[Key];

        //console.debug('::setupObject ParamObjectID:%s ProcessObjectKey:%s JSONConfig:%o', ObjectID, Key, JSONConfig);

        try {
            if (JSONConfig !== undefined && JSONConfig.InstanceOf !== undefined) {
                JSONConfig = this.configObjectInstance(JSONConfig);
            }

            //console.debug('::setupObject ProcessSkeletonObjectKey:%s SkeletonItem:%o JSONConfig:%o', Key, SkeletonItem, JSONConfig);

            let AddHierarchyObject = new sysFactory.SetupClasses[JSONConfig.Type]();

            AddHierarchyObject.JSONConfig = JSONConfig;

            AddHierarchyObject.ObjectID = Key;
            AddHierarchyObject.ObjectType = JSONConfig.Type;
            AddHierarchyObject.Level = HierarchyLevel;
            AddHierarchyObject.ScreenObject = this;

            AddHierarchyObject.ParentID = SkeletonItem.ElementID === undefined ? SkeletonItem.RefID : SkeletonItem.ElementID;

            console.debug('::setupObject ObjectID:%s ParentID:%s', Key, AddHierarchyObject.ParentID);

            AddHierarchyObject.init();

            if (SkeletonItem.ElementID !== undefined && SkeletonItem.ElementID != null) {
                let AddObject = sysFactory.getObjectByID(SkeletonItem.ElementID);
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
            console.log('::setupObject ObjectID:%s err:%s', Key, err);
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

    if (ObjectId == 'sysMenu') {
        SkeletonComplete['sysMenu'] = sysFactory.DataMenu.XMLRPCResultData;
    }

    console.debug('SkeletonComplete:%o', SkeletonComplete);

    for (ScreenID in SkeletonComplete)
    {
        const SkeletonScreen = SkeletonComplete[ScreenID];

        for (ObjectIndex in SkeletonScreen)
        {
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
//- METHOD "configObjectInstance"
//------------------------------------------------------------------------------

sysScreen.prototype.configObjectInstance = function(JSONConfig)
{
    const JSONConfigRef = sysFactory.DataObject.XMLRPCResultData[JSONConfig.InstanceOf];
    const AttributesOverwrite = JSONConfig.AttributesOverwrite;

    console.debug('AttributesOverwrite:%o', AttributesOverwrite);

    if (AttributesOverwrite !== undefined) {
        for (AttrOverwriteKey in AttributesOverwrite)
        {
            if (AttrOverwriteKey in JSONConfigRef.Attributes) {
                JSONConfigRef.Attributes[AttrOverwriteKey] = AttributesOverwrite[AttrOverwriteKey];
                console.debug('AttributesOverwrite:%o JSONConfigRef:%o', AttributesOverwrite, JSONConfigRef);
            }
        }
    }
    return sysMergeObjects(JSONConfig, JSONConfigRef);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysScreen.prototype.callbackXMLRPCAsync = function()
{
    //- set global vars from backend result
    this.setGlobalVars(this.XMLRPCResultData);
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

sysScreen.prototype.mergeGlobalVars = function(Items)
{
    for (Key in Items) {
        const Value = Items[Key];
        this.setGlobalVar(Key, Value);
    };
}
