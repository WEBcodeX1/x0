//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- System Object Factory                                                    -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//
//------------------------------------------------------------------------------
//- Main
//------------------------------------------------------------------------------

function sysFactory()
{
    this.OverlayObj         = new sysScreenOverlay(this);      //- Overlay Object Ref
    this.Screens            = new Object();                    //- Screen Instances (Refs)

    this.OverlayRefCount    = 0;
    this.ClipboardData      = null;

    this.SetupClasses = {
        "TabContainer": sysTabContainer,
        "SQLText": sysObjSQLText,
        "Button": sysObjButton,
        "ButtonInternal": sysObjButtonInternal,
        "List": sysList,
        "FormfieldList": sysFormfieldList,
        "ServiceConnector": sysServiceConnector,
        "Div": sysObjDiv,
        "FileUpload": sysFileUpload,
        "ErrorContainer": sysErrorContainer,
        "Link": sysObjLink,
        "LinkExternal": sysObjLinkExternal,
        "FormfieldText": sysFormfieldItemText,
        "FormfieldTextarea": sysFormfieldItemTextarea,
        "FormfieldPulldown": sysFormfieldItemPulldown,
        "FormfieldDynPulldown": sysFormfieldItemDynPulldown,
        "FormfieldCheckbox": sysFormfieldItemCheckbox,
        "FormfieldLabel": sysFormfieldItemLabel,
        "FormfieldHidden": sysFormfieldItemHidden,
        "DynRadioList": sysObjDynRadioList
    };

    this.SetupClassesRT = {
        "FormSectionHeader": sysFormSectionHeader
    }
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

    //--------------------------------------------------------
    //- Setup Menu "Screen"
    //--------------------------------------------------------
    var MenuScreen = new sysScreen();

    const DefaultStyle = sysFactory.DefaultStyleMenu;

    MenuScreen.ScreenID = 'sysMenu';
    MenuScreen.SkeletonData = this.DataMenu.XMLRPCResultData;
    MenuScreen.setStyle(DefaultStyle);
    MenuScreen.setup();

    //- ------------------------------------------------------
    //- Raise InitSystem Event
    //- ------------------------------------------------------
    this.Reactor.dispatchEvent('InitSystem');

    //- ------------------------------------------------------
    //- Start processing async Messages
    //- ------------------------------------------------------
    this.sysGlobalAsyncNotifyHandler.getMsg();
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
    //console.debug('::getObjectByID this.Screens:%o', this.Screens);
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

            //- set global CurrentScreenID
            this.CurrentScreenID = ScreenID;

            //- switch selected screen to foreground
            this.switchScreenToForeground(ScreenObj);

            //- trigger global screen data load
            this.triggerScreenDataLoad(ScreenID);
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
//- METHOD "switchScreensToBackground"
//------------------------------------------------------------------------------

sysFactory.prototype.switchScreensToBackground = function()
{
    for (ScreenKey in this.Screens) {
        ScreenObj = this.Screens[ScreenKey];
        ScreenObj.HierarchyRootObject.VisibleState = 'hidden';
        ScreenObj.HierarchyRootObject.setDOMVisibleState();
    }    
}


//------------------------------------------------------------------------------
//- METHOD "switchScreenToForeground"
//------------------------------------------------------------------------------

sysFactory.prototype.switchScreenToForeground = function(ScreenObj)
{
    ScreenObj.HierarchyRootObject.VisibleState = 'visible';
    ScreenObj.HierarchyRootObject.setDOMVisibleState();
}


//------------------------------------------------------------------------------
//- METHOD "getObjectsByType"
//------------------------------------------------------------------------------

sysFactory.prototype.getObjectsByType = function(ScreenID, Type)
{
    console.debug('::getObjectsByType ScreenID:%s Type:%s', ScreenID, Type);
    var DstScreenObject = sysFactory.getScreenByID(ScreenID);
    var RootObj = DstScreenObject.HierarchyRootObject;
    return RootObj.getObjectsByType(Type);
}


//------------------------------------------------------------------------------
//- METHOD "getObjectContainingTabData"
//------------------------------------------------------------------------------

sysFactory.prototype.getObjectContainingTabData = function(CheckObjectID)
{
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
//- Function "initOnChangeObjects"
//------------------------------------------------------------------------------

sysFactory.prototype.initOnChangeObjects = function()
{
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

sysFactory.prototype.resetErrorContainer = function()
{
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

sysFactory.prototype.getText = function(TextID)
{
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


//------------------------------------------------------------------------------
//- METHOD "setupObjectRefsRecursive"
//------------------------------------------------------------------------------

sysFactory.prototype.setupObjectRefsRecursive = function(ObjDefs, RefObj)
{
    for (const ObjItem of ObjDefs) {

        CurrentObject = ObjItem['SysObject'];
        CurrentObject.ObjectID = ObjItem['id']
        CurrentObject.JSONConfig = { "Attributes": ObjItem['JSONAttributes'] };

        try {
            CurrentObject.init();
        }
        catch(err) {
        }

        RefObj.addObject(ObjItem['SysObject']);

        if (ObjItem['ObjectDefs'] !== undefined) {
            sysFactory.setupObjectRefsRecursive(ObjItem['ObjectDefs'], ObjItem['SysObject']);
        }

    }
}
