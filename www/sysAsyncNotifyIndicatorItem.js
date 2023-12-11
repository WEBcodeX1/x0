//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2023                                 -//
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

function sysObjAsyncNotifyIndicatorItem(NotifyConfig, ParentRef)
{
	this.EventListeners	= new Object();
	this.ChildObjects	= new Array();

	this.ParentObj		= ParentRef;										// Async Indicator Object Ref

	this.ObjectID		= 'IndicatorItem' + this.ParentObj.zIndex;			// ObjectID
	this.DOMStyle		= 'sysIndicatorItem IndicatorLoading';				// Base Indicator Item Style

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

	var BtnEnclose = new sysBaseObject();
	BtnEnclose.ObjectID = 'enclose';

	var BtnClose = new sysBaseObject();
	BtnClose.ObjectID = 'btnclose';
	BtnClose.DOMType = 'button';
	BtnClose.DOMStyle = 'btn-close';
	BtnClose.DOMAttributes = new Object();	
	BtnClose.DOMAttributes['type'] = 'button';
	BtnClose.DOMAttributes['title'] = 'Notifikation schließen';

	BtnEnclose.addObject(BtnClose);
	this.addObject(BtnEnclose);

	var RowContainer = new sysBaseObject();
	RowContainer.ObjectID = 'rowcontainer';
	RowContainer.DOMStyle = 'row';

	var IconEnclose = new sysBaseObject();
	IconEnclose.ObjectID = 'iconenclose';
	IconEnclose.DOMStyle = 'col-1';

	this.IconObj = new sysBaseObject();
	this.IconObj.ObjectID = 'icon';
	this.IconObj.DOMStyle = 'fa fa-spinner fa-spin';

	var ResultEnclose = new sysBaseObject();
	ResultEnclose.ObjectID = 'resultenclose';
	ResultEnclose.DOMStyle = 'col-11';

	this.ResultObj = new sysBaseObject();
	this.ResultObj.ObjectID = 'result';
	this.ResultObj.DOMStyle = 'sysIndicatorItemResult';
	this.ResultObj.DOMValue = 'Die Daten werden zum Server gesendet und verarbeitet.';

	IconEnclose.addObject(this.IconObj);
	RowContainer.addObject(IconEnclose);
	ResultEnclose.addObject(this.ResultObj);
	RowContainer.addObject(ResultEnclose);

	this.addObject(RowContainer);

	this.ParentObj.addObject(this);

	this.renderObject(this.ParentObj.DOMObjectID);

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
		UpdateDisplayText = 'Die durchgeführte Aktion "' + this.ID + '" war erfolgreich.';
	}
	else if (status == 'ERROR') {
		this.setProcessStatus(1);
		UpdateDisplayText = 'Bei der Aktion "' + this.ID + '" ist ein Fehler aufgetreten.';
	}
	else {
		this.setProcessStatus(2);
		UpdateDisplayText = 'Es ist ein Systemfehler aufgetreten.';
	}

	this.setDisplayText(UpdateDisplayText);
	this.updateDisplay();

	//- on success, update given system object and switch screen if defined
	if (status == 'SUCCESS') {
		if (this.NotifyConfig.OnSuccess !== undefined && this.NotifyConfig.OnSuccess.FireEvents !== undefined) {
			//console.log(this.NotifyConfig.OnSuccess.FireEvents);
			sysFactory.Reactor.fireEvents(
				this.NotifyConfig.OnSuccess.FireEvents
			);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateProcessStatus"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicatorItem.prototype.updateProcessStatus = function()
{
	if (this.ProcessStatus == 0)  {
		this.addDOMElementStyle('IndicatorSuccess');
		this.IconObj.DOMStyle = 'fa fa-check';
		this.IconObj.setDOMElementStyle();
	}
	if (this.ProcessStatus == 1)  {
		this.addDOMElementStyle('IndicatorWarning');
		this.IconObj.DOMStyle = 'fa fa-exclamation';
		this.IconObj.setDOMElementStyle();
	}
	if (this.ProcessStatus == 2)  {
		this.addDOMElementStyle('IndicatorError');
		this.IconObj.DOMStyle = 'fa fa-bug';
		this.IconObj.setDOMElementStyle();	
	}
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
