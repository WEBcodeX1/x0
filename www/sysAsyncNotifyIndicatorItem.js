//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "AsyncNotifyIndicatorItem"                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Async Notify Indicator Item                                              -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjAsyncNotifyIndicatorItem"
//------------------------------------------------------------------------------

function sysObjAsyncNotifyIndicatorItem(NotifyConfig, ParentRef) {

	this.EventListeners	= new Object();
	this.ChildObjects	= new Array();

	this.ParentObj		= ParentRef;										// Async Indicator Object Ref

	this.ObjectID		= 'IndicatorItem' + this.ParentObj.zIndex;			// ObjectID
	this.DOMStyle		= 'sysIndicatorItem row IndicatorLoading';			// Base Indicator Item Style

	this.NotifyConfig	= NotifyConfig;										// Notify Config
	this.ID				= NotifyConfig.ID;									// Unique Name
	this.DisplayHeader	= NotifyConfig.DisplayHeader;						// Display Header
	this.DisplayText	= '';												// Display Text

	this.ProcessStatus	= -1;												// -1: processing, 0: processed ok

	this.init();

}

sysObjAsyncNotifyIndicatorItem.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.init = function()
{
	//console.debug('::init IndicatorItem');

	this.DOMStyleZIndex = this.ParentObj.zIndex;
	this.setDOMElementZIndex();

	var HeaderObj = new sysBaseObject();
	HeaderObj.ObjectID = 'Header';
	HeaderObj.DOMStyle = 'sysIndicatorItemHeader';
	HeaderObj.DOMValue = this.DisplayHeader;

	this.ResultObj = new sysBaseObject();
	this.ResultObj.ObjectID = 'Result';
	this.ResultObj.DOMStyle = 'sysIndicatorItemResult';

	this.addObject(HeaderObj);
	this.addObject(this.ResultObj);

	this.ParentObj.addObject(this);

	this.renderObject(this.ParentObj.DOMObjectID);
	//console.debug('::init IndicatorItem rendered Parent DOMObjectID:%s', this.ParentObj.DOMObjectID);

	this.DOMaddEventListener('mousedown', this.close.bind(this));
}


//------------------------------------------------------------------------------
//- METHOD "setProcessStatus"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.setProcessStatus = function(Status)
{
	this.ProcessStatus = Status;
}


//------------------------------------------------------------------------------
//- METHOD "setDisplayText"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.setDisplayText = function(Text)
{
	this.DisplayText = Text;
}


//------------------------------------------------------------------------------
//- METHOD "updateDisplay"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.updateDisplay = function()
{
	this.updateDisplayText();
	this.updateProcessStatus();
}


//------------------------------------------------------------------------------
//- METHOD "processResult"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.processResult = function(status)
{

	var UpdateDisplayText = '';

	if (status == 'SUCCESS') {
		this.setProcessStatus(0);
		UpdateDisplayText = 'Aktion erfolgreich';
	}
	else if (status == 'ERROR') {
		this.setProcessStatus(1);
		UpdateDisplayText = 'Fehler aufgetreten';
	}
	else {
		this.setProcessStatus(2);
		UpdateDisplayText = 'Unbekannter Fehler aufgetreten';
	}

	this.setDisplayText(UpdateDisplayText);
	this.updateDisplay();

	//- on success, update given system object and switch screen if defined
	if (status == 'SUCCESS') {

		if (this.NotifyConfig.OnSuccess !== undefined) {
			//console.log(this.NotifyConfig.OnSuccess.FireEvents);
			sysFactory.Reactor.fireEvents(this.NotifyConfig.OnSuccess.FireEvents);
		}

	}

}


//------------------------------------------------------------------------------
//- METHOD "updateProcessStatus"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.updateProcessStatus = function()
{
	if (this.ProcessStatus == 0)  { this.addDOMElementStyle('IndicatorSuccess'); }
	if (this.ProcessStatus >  0)  { this.addDOMElementStyle('IndicatorError'); }
}


//------------------------------------------------------------------------------
//- METHOD "updateDisplayText"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.updateDisplayText = function()
{
	this.ResultObj.DOMValue = this.DisplayText;
	this.ResultObj.setDOMElementValue();
}


//------------------------------------------------------------------------------
//- METHOD "close"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.close = function()
{
	this.remove();
	this.ParentObj.zIndex -= 1;
}
