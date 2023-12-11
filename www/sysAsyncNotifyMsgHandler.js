//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2023                                 -//
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
 * Actually message handling is implemented by using "Long Polling".
 * This should be replaced by WebSockets in future releases.
*/

function sysAsyncNotifyMsgDelHandler(MsgHandlerRef)
{
	this.MsgHandlerRef = MsgHandlerRef;

	this.RPC = new sysCallXMLRPC(sysFactory.MsgServerDelURL);
	this.RPC.setRequestType('POST');
	this.PostRequestData = {
		"session_src": sysFactory.SysSessionValue
	}
	this.RPC.Request(this);
}

sysAsyncNotifyMsgDelHandler.prototype.callbackXMLRPCAsync = function()
{
	this.MsgHandlerRef.getMsg();
}


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
	if (sysFactory.SysSessionID != null && sysFactory.SysSessionID !== undefined) {
		this.PostRequestData = {
			"session_src": sysFactory.SysSessionValue
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
		const MsgArray = this.XMLRPCResultData.Result.messages;
		for (MessageIndex in MsgArray) {
			const Message = MsgArray[MessageIndex];
			this.processMsg(Message);
		}
		var Del = new sysAsyncNotifyMsgDelHandler(this);
	}
	catch(err) {
		console.log('::callbackXMLRPCAsync err:%s', err);
	}

	//- get/wait for next messages
	//this.getMsg();
}


//------------------------------------------------------------------------------
//- METHOD "processMsg"
//------------------------------------------------------------------------------

/*
 * msgserver now is able to handle json messages with substructures not only strings
 * in json which makes parsing obsolete
*/

sysAsyncNotifyMsgHandler.prototype.processMsg = function(Message)
{
	//- check for global message
	const sysTextObj = sysFactory.ObjText;
	const RegexPhone = /^SYS__PHONE_CALL\-([0-9]+)$/g;
	const RegexPhoneResult = RegexPhone.exec(Message);

	var sysID;

	console.debug('::processMsg Message:%o', Message);

	//- incoming phone call
	if (RegexPhoneResult) {
		sysID = 'SYS__GLOBAL_MSG';

		ActionNotifyDef = {
			"ID": sysID,
			"DisplayHeader": sysTextObj.getTextBySystemLanguage('TXT.SYS.INDICATOR.INCOMINGPHONECALL')
		}

		//const AsyncNotifyObj = new sysObjAsyncNotify();
		sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(ActionNotifyDef);

		const CallingPhoneNr = RegexPhoneResult[1]
		const NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(sysID);

		NotifyItem.setProcessStatus(0);
		NotifyItem.setDisplayText(CallingPhoneNr);
		NotifyItem.updateDisplay();

		sysFactory.switchScreen('ShipmentHistory');
		console.debug(sysFactory.getObjectByID('ShipmentHistoryTabContainer'));

		const PhoneFormList = sysFactory.getObjectByID('ShipmentHistoryReceiverPhoneFormfields');
		const PhoneTabContainer = sysFactory.getObjectByID('ShipmentHistoryTabContainer').TabContainerObject;
		const PhoneFormItem = PhoneFormList.getFormFieldItemByID('ShipmentHistoryReceiverPhoneNr');

		PhoneFormItem.setValue(CallingPhoneNr.slice(1));
		PhoneTabContainer.switchTab('TabShipmentHistoryReceiverPhone');

		sysFactory.Reactor.fireEvents(['ShipmentHistoryPhoneSearch']);

		return;
	}

	//- check for global message
	const RegexGlobal = /^SYS__GLOBAL_MSG\-(.+)$/g;
	const RegexGlobalResult = RegexGlobal.exec(Message);

	if (RegexGlobalResult) {
		sysID = 'SYS__GLOBAL_MSG';

		ActionNotifyDef = {
			"ID": sysID,
			"DisplayHeader": sysTextObj.getTextBySystemLanguage('TXT.SYS.INDICATOR.SYSTEMMSG')
		}

		//var AsyncNotifyObj = new sysObjAsyncNotify();
		sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(ActionNotifyDef);

		const NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(sysID);
		NotifyItem.setProcessStatus(1);
		NotifyItem.setDisplayText(RegexGlobalResult[1]);
		NotifyItem.updateDisplay();

		return;
	}

	//- check for net events
	const RegexNetEvent = /^SYS__NET_EVENT\-(.+)$/g;
	const RegexNetEventResult = RegexNetEvent.exec(Message);

	if (RegexNetEventResult) {
		sysID = 'SYS__GLOBAL_MSG';

		ActionNotifyDef = {
			"ID": sysID,
			"DisplayHeader": sysTextObj.getTextBySystemLanguage('TXT.SYS.INDICATOR.NETEVENT')
		}

		//var AsyncNotifyObj = new sysObjAsyncNotify();
		sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(ActionNotifyDef);

		const NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(sysID);
		NotifyItem.setProcessStatus(1);
		NotifyItem.setDisplayText(RegexNetEventResult[1]);
		NotifyItem.updateDisplay();

		sysFactory.Reactor.fireEvents([RegexNetEventResult[1]]);
		return;
	}

	//- update action notifier with id contained in msg
	const RegexNotify = /^SYS__(.+)__(SUCCESS|ERROR)/g;
	const RegexNotifyResult = RegexNotify.exec(Message);

	if (RegexNotifyResult) {
		const NotifyID = RegexNotifyResult[1];
		const NotifyStatus = RegexNotifyResult[2];

		//- get notify item from global async indicator
		const NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(NotifyID);

		//- start processing result
		if (NotifyItem != null && NotifyItem !== undefined) {
			NotifyItem.processResult(NotifyStatus);
		}
	}

	/*
	//- check for encrypted messages
	const RegexEncryptedMsg = /^b'(.+)'$/g;
	const RegexEncryptedMsgResult = RegexEncryptedMsg.exec(Message);
	*/

	/* try catch block for old style non object oriented messages */
	try {
		var EncMsgHandler = sysEncryptionMsgHandler(Message);
	}
	catch(err) {
	}
}


//------------------------------------------------------------------------------
//- class "sysEncryptionMsgHandler"
//------------------------------------------------------------------------------

function sysEncryptionMsgHandler(Message)
{
	var CallURL;

	if (Message.type == 10) {
		this.PostRequestData = {
			"message": Message.data,
			"source": Message.session_src
		}
		//CallURL = sysFactory.AddEncryptedMsgURL;
		CallURL = '/python/addEncryptedMessage.py';
	}

	if (Message.type == 20) {
		this.PostRequestData = {
			"ContactID": Message.session_src,
			"ContactRequestHash": Message.contactrequest_hash
		}
		//CallURL = sysFactory.AddContactRequestMsgURL;
		CallURL = '/python/addContactRequestMessage.py';
	}

	if (Message.type == 30) {
		this.PostRequestData = {
			"ContactID": Message.session_src,
			"ContactRequestHash": Message.contactrequest_hash,
			"ContactPublicKey": Message.public_key
		}
		CallURL = '/python/approoveContact.py';
	}

	var RPC = new sysCallXMLRPC(CallURL);
	RPC.setRequestType('POST');
	RPC.Request(this);
}


//------------------------------------------------------------------------------
//- CALLBACK "XMLRPCAsync"
//------------------------------------------------------------------------------

sysEncryptionMsgHandler.prototype.callbackXMLRPCAsync = function() {
}
