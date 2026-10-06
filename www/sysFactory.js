//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- System Object "sysFactory"                                               -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFactory"
//------------------------------------------------------------------------------

function sysFactory()
{
    this.OverlayObj         = new sysScreenOverlay();           //- Overlay Object Ref
    this.Screens            = new Object();                     //- Screen Instances

    this.ClipboardData      = null;

    this.SetupClasses = {
        "TabContainer": sysTabContainer,
        "Image": sysObjImage,
        "ImageSelector": sysObjImageSelector,
        "SQLText": sysObjSQLText,
        "Button": sysObjButton,
        "ButtonInternal": sysObjButtonInternal,
        "List": sysList,
        "FormfieldList": sysFormfieldList,
        "ServiceConnector": sysServiceConnector,
        "Div": sysObjDiv,
        "DivUnique": sysObjDivUnique,
        "FileUpload": sysFileUpload,
        "ErrorContainer": sysErrorContainer,
        "FormfieldText": sysFormfieldItemText,
        "FormfieldTextarea": sysFormfieldItemTextarea,
        "FormfieldPulldown": sysFormfieldItemPulldown,
        "FormfieldDynPulldown": sysFormfieldItemDynPulldown,
        "FormfieldCheckbox": sysFormfieldItemCheckbox,
        "FormfieldLabel": sysFormfieldItemLabel,
        "FormfieldHidden": sysFormfieldItemHidden,
        "LanguageSwitch": sysObjLanguageSwitch,
        "OpenCloseContainer": sysObjOpenCloseContainer,
        "SystemSettingsContainer": sysObjSystemSettingsContainer,
        "SystemSettingsContainerGrid": sysObjSystemSettingsContainerGrid,
        "HeaderBodyContainer": sysObjHeaderBodyContainer,
        "TreeSimple": sysObjTreeSimple,
        "ProgressBar": sysObjProgressBar,
        "RangeSlider": sysObjRangeSlider,
        "RangeSliderContainer": sysObjRangeSliderContainer,
        "InfoParagraph": sysObjInfoParagraph,
        "DynRadioList": sysObjDynRadioList,
        "TimedProgress": userObjTimedProgress,
        "ExampleEditableItem": userObjExampleEditableItem,
        "ExampleEditableItemContainer": userObjExampleEditableItemContainer,
        "ExampleFlightDetails": userObjExampleFlightDetails,
        "ExampleFlightStatus": userObjExampleFlightStatus,
        "ExampleWizard": userObjExampleWizard
    };
}


//- ------------------------------------------------------
//- METHOD "init"
//- ------------------------------------------------------

sysFactory.prototype.init = function()
{
    //- ------------------------------------------------------
    //- loop on skeleton, add screen objects to this.Screens
    //- ------------------------------------------------------
    //console.debug('Skeleton Data:%o', this.DataSkeleton);

    //- ------------------------------------------------------
    //- Set User Functions
    //- ------------------------------------------------------

    for (const UserFunctionID of sysVarUserFunctions) {
        console.debug('Setting User Functions. FunctionID:%s', UserFunctionID);
        this.UserFunctions[UserFunctionID] = window[UserFunctionID];
    }

    //- ------------------------------------------------------
    //- Add all System Screens
    //- ------------------------------------------------------
    const SkeletonData = this.DataSkeleton.XMLRPCResultData;

    for(SkeletonKey in SkeletonData)
    {
        this.addScreen(
            SkeletonKey,
            SkeletonData[SkeletonKey]
        )
    }

    //- ------------------------------------------------------
    //- Init (activate/deactivate) OnChange references
    //- ------------------------------------------------------
    //this.initOnChangeObjects();

    //--------------------------------------------------------
    //- Setup Menu "Screen"
    //--------------------------------------------------------
    this.MenuScreen = new sysScreen();

    const DefaultStyle = sysFactory.DefaultStyleMenu;

    this.MenuScreen.ScreenID = 'sysMenu';
    this.MenuScreen.SkeletonData = this.DataMenu.XMLRPCResultData;
    this.MenuScreen.setStyle(DefaultStyle);
    this.MenuScreen.setup();

    this.Screens[this.MenuScreen.ScreenID] = this.MenuScreen;

    //- ------------------------------------------------------
    //- Switch to Default Screen
    //- ------------------------------------------------------
    this.switchScreen(this.DisplayDefaultScreen);

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
    ScreenObj.setup();
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
    for (ScreenID in this.Screens)
    {
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

    if (ScreenID !== undefined)
    {
        try {
            //- get screen object by screen id
            const ScreenObj = this.getScreenByID(ScreenID);

            //- switch all screens to background
            this.switchScreensToBackground();

            //- set global CurrentScreenID
            this.CurrentScreenID = ScreenID;

            //- switch selected screen to foreground
            this.switchScreenToForeground(ScreenObj);

            //- fire "SwitchScreen" event
            this.Reactor.dispatchEvent('SwitchScreen',  ScreenID);
        }
        catch(err) {
            console.debug('::switchScreen err:%s', err);
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "switchScreensToBackground"
//------------------------------------------------------------------------------

sysFactory.prototype.switchScreensToBackground = function()
{
    for (ScreenKey in this.Screens)
    {
        //- exclude menu layer hiding
        if (ScreenKey != this.MenuScreen.ScreenID) {
            ScreenObj = this.Screens[ScreenKey];
            ScreenObj.HierarchyRootObject.VisibleState = 'hidden';
            ScreenObj.HierarchyRootObject.setDOMVisibleState();
        }
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
    const ScreenObject = sysFactory.getScreenByID(ScreenID);
    const RootObj = ScreenObject.HierarchyRootObject;
    return RootObj.getObjectsByType(Type);
}


//------------------------------------------------------------------------------
//- METHOD "getGlobalVar"
//------------------------------------------------------------------------------

sysFactory.prototype.getGlobalVar = function(Key) {
    return (Key === undefined || Key == null) ? null : this.ObjGlobalData[Key];
}


//------------------------------------------------------------------------------
//- METHOD "setGlobalVar"
//------------------------------------------------------------------------------

sysFactory.prototype.setGlobalVar = function(Key, Value) {
    this.ObjGlobalData[Key] = Value;
}


//------------------------------------------------------------------------------
//- Function "initOnChangeObjects"
//------------------------------------------------------------------------------

sysFactory.prototype.initOnChangeObjects = function()
{
    for (const ScreenID in this.Screens)
    {
        const Formlists = this.getObjectsByType(ScreenID, 'FormfieldList');
        //console.debug('Formlists:%o', Formlists);
        for (Key in Formlists)
        {
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
        for (const ErrorContainerItem of ErrorContainerItems) {
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
        console.debug('Text not found for given TextID:%s', TextID);
    }
    return RetValue;
}


//------------------------------------------------------------------------------
//- METHOD "updateLanguageObjectsGlobal"
//------------------------------------------------------------------------------

sysFactory.prototype.updateLanguageObjectsGlobal = function()
{
    for (const ScreenID in this.Screens)
    {
        console.debug('updateSQLObjects ScreenID:%s', ScreenID);
        const TextObjects = this.getObjectsByType(ScreenID, 'SQLText');
        console.debug('updateSQLObjects TxtObjects:%o', TextObjects);
        for (const TextObjID in TextObjects) {
            const TextObj = TextObjects[TextObjID];
            TextObj.update();
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "setupObjectRefsRecursive"
//------------------------------------------------------------------------------

sysFactory.prototype.setupObjectRefsRecursive = function(ObjDefs, RefObj)
{
    for (const ObjItem of ObjDefs)
    {
        CurrentObject = ObjItem['SysObject'];
        CurrentObject.ObjectID = ObjItem['id']
        CurrentObject.JSONConfig = { "Attributes": ObjItem['JSONAttributes'] };

        if (ObjItem['id'] !== undefined) {
            CurrentObject.KeyID = ObjItem['KeyID'];
        }

        try {
            CurrentObject.init();
        }
        catch(err) {
            console.log('::sysFactory setupObjectRefsRecursive() err:%s', err);
        }

        console.debug('::sysFactory setupObjectRefsRecursive() ObjectID:%s JSONConfig:%o', CurrentObject.ObjectID, CurrentObject.JSONConfig);

        RefObj.addObject(ObjItem['SysObject']);

        if (ObjItem['ObjectDefs'] !== undefined) {
            sysFactory.setupObjectRefsRecursive(ObjItem['ObjectDefs'], ObjItem['SysObject']);
        }
    }
}
