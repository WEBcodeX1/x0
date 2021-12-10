//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "LinkExternal"                                             -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjLinkExternal"
//------------------------------------------------------------------------------

function sysObjLinkExternal() {
}

sysObjLinkExternal.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjLinkExternal.prototype.init = function()
{
	this.updateValue();
}


//------------------------------------------------------------------------------
//- METHOD "updateValue"
//------------------------------------------------------------------------------

sysObjLinkExternal.prototype.updateValue = function()
{
	const Attributes = this.JSONConfig.Attributes;

	var LinkContent = Attributes.LinkURL+'?a=1';
	var LinkDisplay = (Attributes.LinkDisplay === undefined) ? Attributes.LinkURL : Attributes.LinkDisplay;

	if (Attributes.LinkDisplayOnValueUndefined === true && this.Value === undefined) {
		LinkDisplay = Attributes.LinkDisplayOnValueUndefined;
	}

	var TabParams = '';

	if (Attributes.OpenInTab === true) {
		TabParams = ' target="_blank" rel="noopener noreferrer"';
	}

	if (Attributes.ReplaceSessionID === true) {
		LinkContent += '&session_id=', sysFactory.SysSessionValue;
	}

	for (ReplaceKey in Attributes.ReplaceVars) {
		const DBColumn = Attributes.ReplaceVars[ReplaceKey];
		LinkContent += (DBColumn == '$VALUE') ? this.Value : '&'+ReplaceKey+'='+this.ScreenObject.getDBColumnValue(DBColumn);
	}

	this.DOMValue = '<a href="'+LinkContent+'"'+TabParams+'>'+LinkDisplay+'</a>';
	this.setDOMElementValue();
}


//------------------------------------------------------------------------------
//- METHOD "getObjectData"
//------------------------------------------------------------------------------

sysObjLinkExternal.prototype.getObjectData = function()
{
	return this.Value;
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysObjLinkExternal.prototype.reset = function()
{
	this.DOMValue = ''
	this.setDOMElementValue();
}
