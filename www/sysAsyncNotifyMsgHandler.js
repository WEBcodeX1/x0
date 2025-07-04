//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM AsyncNotifyMsgHandler Methods                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Handles Async Notify Messages                                            -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

/*
 * Currently message handling is implemented by using "long polling".
 * This should be replaced by WebSockets in future releases.
*/

function sysAsyncNotifyMsgHandler()
{
    this.RPC = new sysCallXMLRPC(sysFactory.MsgServerGetURL);
    this.RPC.setRequestType('POST');
}


//------------------------------------------------------------------------------
//- METHOD "getMsg"
//------------------------------------------------------------------------------

sysAsyncNotifyMsgHandler.prototype.getMsg = function()
{
    console.debug('::getMsg SessionID:%s', sysFactory.SysSessionID);
    //- if session id exists, get next messages
    if (sysFactory.SysSessionID !== undefined && sysFactory.SysSessionID != null) {
        this.PostRequestData = {
            "session_src": sysFactory.SysSessionValue,
            "type": 'GET'
        }
        this.RPC.Request(this);
    }
}


//------------------------------------------------------------------------------
//- CALLBACK "XMLRPCAsync"
//------------------------------------------------------------------------------

sysAsyncNotifyMsgHandler.prototype.callbackXMLRPCAsync = function()
{
    console.debug('::callbackXMLRPCAsync XMLRPCResult:%o', this.XMLRPCResultData);

    try {
        const MsgArray = this.XMLRPCResultData.messages;
        if (MsgArray !== undefined && MsgArray != null) {
            for (const Message of MsgArray) {
                this.processMsg(Message);
            }
        }
    }
    catch(err) {
        console.log('::callbackXMLRPCAsync err:%s', err);
    }

    //- get/wait for next messages
    this.getMsg();
}


//------------------------------------------------------------------------------
//- METHOD "processMsg"
//------------------------------------------------------------------------------

sysAsyncNotifyMsgHandler.prototype.processMsg = function(Message)
{
    console.debug('::processMsg Message:%o', Message);

    //- incoming phone call
    if (Message['msg-type'] == 'net-phone' && Message['phonenr-src'] !== undefined) {
        sysID = 'SYS__GLOBAL_MSG';

        ActionNotifyDef = {
            "ID": sysID,
            "DisplayHeader": sysFactory.getText('TXT.SYS.INDICATOR.INCOMINGPHONECALL')
        }

        sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(ActionNotifyDef);

        const NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(sysID);

        NotifyItem.setProcessStatus(0);
        NotifyItem.setDisplayText(Message['phonenr-src']);
        NotifyItem.updateDisplay();
    }

    //- check for net messages
    if (Message['msg-type'] == 'net-message' && Message['txt-id'] !== undefined) {
        sysID = 'SYS__GLOBAL_MSG';

        ActionNotifyDef = {
            "ID": sysID,
            "DisplayHeader": sysFactory.getText('TXT.SYS.INDICATOR.NETEVENT')
        }

        sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(ActionNotifyDef);

        const NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(sysID);
        NotifyItem.setProcessStatus(1);
        NotifyItem.setDisplayText(sysFactory.getText(Message['txt-id']));
        NotifyItem.updateDisplay();
    }

    //- check for net method execution
    if (Message['msg-type'] == 'net-message' && Message['method-id'] !== undefined) {
        sysID = 'SYS__GLOBAL_MSG';

        const MethodID = Message['method-id'];
        const DstObjectID = Message['dst-object'];
        const Payload = Message['payload'];

        console.debug('::processMsg Method:%s DstObjID:%s Payload:%o', MethodID, DstObjectID, Payload);

        if (MethodID == 'set-data') {
            const DstObject = sysFactory.getObjectByID(DstObjectID);
            console.debug('::processMsg DstObj:%o', DstObject);
            DstObject.RuntimeSetDataFunc(Payload);
        }

        ActionNotifyDef = {
            "ID": sysID,
            "DisplayHeader": sysFactory.getText('TXT.SYS.INDICATOR.NETEVENT')
        }

        sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(ActionNotifyDef);
        const NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(sysID);
        NotifyItem.setProcessStatus(1);
    }

    if (Message['msg-type'] == 'sys-indicator') {
        const NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(Message['notify-id']);
        if (NotifyItem !== undefined && NotifyItem != null) {
            NotifyItem.processResult(Message['notify-status']);
        }
    }

    if (Message['fire-events'] !== undefined) {
        sysFactory.Reactor.fireEvents(Message['fire-events']);
    }

    if (Message['switch-screen-id'] !== undefined) {
        sysFactory.switchScreen(Message['switch-screen-id']);
    }
}
