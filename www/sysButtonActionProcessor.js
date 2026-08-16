//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ButtonActionProcessor"                                    -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//- Single-responsibility dispatcher that maps action name strings to object -//
//- method calls. Used by processActions() (pre-RPC) and                    -//
//- callbackXMLRPCAsync() (post-RPC) so both paths share one code path.     -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysButtonActionProcessor"
//------------------------------------------------------------------------------

function sysButtonActionProcessor() {}


//------------------------------------------------------------------------------
//- METHOD "executeAction"
//------------------------------------------------------------------------------

sysButtonActionProcessor.prototype.executeAction = function(ActionConf)
{
    const Action = (ActionConf.Action || '').toLowerCase();

    if (!Action) return;

    console.debug('::ButtonActionProcessor executeAction Action:%s Conf:%o', Action, ActionConf);

    let DstObject;
    try {
        DstObject = sysFactory.getObjectByID(ActionConf.DstObjectID);
    }
    catch(e) {
        DstObject = undefined;
    }

    switch (Action) {

        case 'set':
            try {
                const SrcObj = sysFactory.getObjectByID(ActionConf.SrcDataObject);
                const DstObj = sysFactory.getObjectByID(ActionConf.DstDataObject);
                DstObj.RuntimeSetDataFunc(SrcObj.RuntimeGetDataFunc());
            }
            catch(e) {
                console.debug('::ButtonActionProcessor set error:%s', e);
            }
            break;

        case 'append':
            try {
                const SrcObj = sysFactory.getObjectByID(ActionConf.SrcDataObject);
                const DstObj = sysFactory.getObjectByID(ActionConf.DstDataObject);
                DstObj.RuntimeAppendDataFunc(SrcObj.RuntimeGetDataFunc());
            }
            catch(e) {
                console.debug('::ButtonActionProcessor append error:%s', e);
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
                const TabContainerObj = sysFactory.getObjectByID(ActionConf.TabContainer);
                TabContainerObj.switchTab(ActionConf.Tab);
            }
            catch(e) {
                console.debug('::ButtonActionProcessor tabswitch error:%s', e);
            }
            break;

        case 'switchscreen':
            //- handled by processActions (supports ResetAll); skip here
            break;

        case 'setglobalvar':
            sysFactory.setGlobalVar(ActionConf.SetVar, ActionConf.SetValue);
            console.debug('::ButtonActionProcessor setGlobal Var:%s Value:%s', ActionConf.SetVar, ActionConf.SetValue);
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
    for (const A of Actions) {
        this.executeAction(A);
        if (A.FireEvents !== undefined) {
            sysFactory.Reactor.fireEvents(A.FireEvents);
        }
    }
};


//------------------------------------------------------------------------------
//- SINGLETON "sysButtonActions"
//------------------------------------------------------------------------------

const sysButtonActions = new sysButtonActionProcessor();
