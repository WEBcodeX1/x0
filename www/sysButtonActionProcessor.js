//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ButtonActionProcessor"                                    -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//- Single-responsibility dispatcher that maps action name strings to object -//
//- method calls.                                                            -//
//-                                                                          -//
//- Used by:                                                                 -//
//-  a) processActions() (pre-RPC)                                           -//
//-  b) callbackXMLRPCAsync() (post-RPC)                                     -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysButtonActionProcessor"
//------------------------------------------------------------------------------

function sysButtonActionProcessor()
{
}


//------------------------------------------------------------------------------
//- METHOD "executeAction"
//------------------------------------------------------------------------------

sysButtonActionProcessor.prototype.executeAction = function(Attributes)
{
    const Action = (Attributes.Action || '').toLowerCase();

    if (!Action) return;

    console.debug('::ButtonActionProcessor executeAction Action:%s Conf:%o', Action, Attributes);

    let DstObject;
    try {
        DstObject = sysFactory.getObjectByID(Attributes.DstObjectID);
    }
    catch(err) {
        DstObject = undefined;
    }

    switch (Action) {

        case 'set':
            try {
                const SrcObj = sysFactory.getObjectByID(Attributes.SrcDataObject);
                const DstObj = sysFactory.getObjectByID(Attributes.DstDataObject);
                DstObj.setObjectData(SrcObj.getObjectData());
            }
            catch(err) {
                console.log('::ButtonActionProcessor set error:%s', err);
            }
            break;

        case 'append':
            try {
                const SrcObj = sysFactory.getObjectByID(Attributes.SrcDataObject);
                const DstObj = sysFactory.getObjectByID(Attributes.DstDataObject);
                DstObj.setObjectData(SrcObj.getObjectData());
            }
            catch(err) {
                console.log('::ButtonActionProcessor append error:%s', err);
            }
            break;

        case 'enable':
            if (DstObject) {
                DstObject.VisibleState = 'visible';
                DstObject.setDOMVisibleState();
            }
            break;

        case 'disable':
            if (DstObject) {
                DstObject.VisibleState = 'hidden';
                DstObject.setDOMVisibleState();
            }
            break;

        case 'activate':
            if (DstObject) { DstObject.setActivated(); }
            break;

        case 'deactivate':
            if (DstObject) { DstObject.setDeactivated(); }
            break;

        case 'reset':
            if (DstObject) { DstObject.reset(); }
            break;

        case 'tabswitch':
            try {
                const TabContainerObj = sysFactory.getObjectByID(Attributes.TabContainer);
                TabContainerObj.switchTab(Attributes.Tab);
            }
            catch(err) {
                console.log('::ButtonActionProcessor tabswitch error:%s', err);
            }
            break;

        case 'switchscreen':
            if (Attributes.ResetAll == true) {
                const ScreenObj = sysFactory.getScreenByID(Attributes.DstScreenID);
                ScreenObj.HierarchyRootObject.processReset();
            }
            sysFactory.switchScreen(Attributes.DstScreenID);
            break;

        case 'setglobalvar':
            sysFactory.setGlobalVar(Attributes.SetVar, Attributes.SetValue);
            console.debug('::ButtonActionProcessor setGlobal Var:%s Value:%s', Attributes.SetVar, Attributes.SetValue);
            break;

        case 'openoverlay':
            sysFactory.OverlayObj.activateOverlay(Attributes.ScreenID);
            break;

        default:
            console.debug('::ButtonActionProcessor unknown action:%s', Action);
    }
};


//------------------------------------------------------------------------------
//- METHOD "executeActions"
//------------------------------------------------------------------------------

sysButtonActionProcessor.prototype.executeActions = function(ActionConf)
{
    if (!ActionConf) return;

    const Actions = Array.isArray(ActionConf) ? ActionConf : [ActionConf];

    for (const Action of Actions) {
        this.executeAction(Action);
        if (Action.FireEvents !== undefined) {
            sysFactory.Reactor.fireEvents(Action.FireEvents);
        }
    }
};


//------------------------------------------------------------------------------
//- Setup Global "ActionProcessor" Access
//------------------------------------------------------------------------------

const ActionProcessor = new sysButtonActionProcessor();
