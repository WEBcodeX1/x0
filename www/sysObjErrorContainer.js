//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ErrorContainer"                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Container for displaying Error Messages                                  -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysErrorContainer"
//------------------------------------------------------------------------------

function sysErrorContainer()
{
    this.EventListeners		= new Object();
	this.ChildObjects		= new Array();
}

sysErrorContainer.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysErrorContainer.prototype.init = function()
{
	console.debug('Init Error Container');
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysErrorContainer.prototype.reset = function()
{
	this.DOMStyle = '';
	this.DOMValue = '';
	this.setDOMElementStyle();
	this.setDOMElementValue();
}


//------------------------------------------------------------------------------
//- METHOD "displayError"
//------------------------------------------------------------------------------

sysErrorContainer.prototype.displayError = function(ErrorMsg, ErrorDetailMsg)
{
	var ErrorDisplayMsg = ErrorMsg;

	if (ErrorDetailMsg !== undefined) {
		ErrorMsg = ErrorMsg.replace(/\.$/, '');
		ErrorDisplayMsg = ErrorMsg + ' (' + ErrorDetailMsg + ').';
	}

	this.DOMStyle = 'alert alert-danger';
	this.DOMValue = '<i class="fa-solid fa-triangle-exclamation fa-lg"></i> ' + ErrorDisplayMsg;
	this.setDOMElementStyle();
	this.setDOMElementValue();
}
