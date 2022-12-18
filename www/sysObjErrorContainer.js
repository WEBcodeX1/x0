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

sysErrorContainer.prototype.displayError = function(ErrorMsg)
{
	this.DOMStyle = 'um-field-error';
	this.DOMValue = '<span class="um-field-arrow"><i class="um-faicon-caret-up"></i></span>' + ErrorMsg;
	this.setDOMElementStyle();
	this.setDOMElementValue();
}
