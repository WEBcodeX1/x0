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
	/*
	this.ChildObjects		= new Array();
	this.DOMAttributes		= new Array();
	*/
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

	var TabParams = '';

	var DoNotSetDOMValue = false;

	if (Attributes.OpenInTab === true) {
		TabParams = ' target="_blank" rel="noopener noreferrer"';
		//TabParams = '_blank" rel="noopener noreferrer';
	}

	if (Attributes.ReplaceSessionID === true) {
		LinkContent += '&session_id='+sysFactory.SysSessionValue;
	}

	for (ReplaceKey in Attributes.ReplaceDBVars) {
		const DBColumn = Attributes.ReplaceVars[ReplaceKey];
		LinkContent += (DBColumn == '$VALUE') ? this.Value : '&'+ReplaceKey+'='+this.ScreenObject.getDBColumnValue(DBColumn);
	}

	for (ReplaceKey in Attributes.ReplaceGlobalVars) {
		const ReplaceValue = Attributes.ReplaceGlobalVars[ReplaceKey];
		LinkContent += '&'+ReplaceKey+'='+sysFactory.getGlobalVar(ReplaceValue);
	}

	if (Attributes.ScreenGlobalVars !== undefined) {
		const ScreenGlobalVars = sysFactory.getScreenByID(Attributes.ScreenGlobalVars);
		//console.debug('ScreenObj:%o', ScreenGlobalVars);
		for (ReplaceKey in Attributes.ReplaceScreenGlobalVars) {
			const ReplaceVar = Attributes.ReplaceScreenGlobalVars[ReplaceKey];
			const ReplaceValue = ScreenGlobalVars.getGlobalVar(ReplaceVar);
			console.debug('Replace Value:%s', ReplaceValue);
			if (ReplaceValue === undefined || ReplaceValue == null) {
				DoNotSetDOMValue = true;
				LinkDisplay = Attributes.LinkDisplayOnValueUndefined;
				break;
			}
			LinkContent += '&'+ReplaceKey+'='+ReplaceValue;
		}
	}

	if (DoNotSetDOMValue === true) {
		LinkContent = '#';
		TabParams = '';
	}

	console.debug('DoNotSetDOMValue:%s', DoNotSetDOMValue);

	/*
	this.DOMType = 'button';
	this.DOMValue = LinkDisplay;
	this.DOMStyle = Attributes.Style;
	this.DOMAttributes['href'] = LinkContent;
	this.DOMAttributes['target'] = TabParams;
	*/

	this.DOMValue = '<a href="'+LinkContent+'"'+TabParams+' class="'+Attributes.Style+'">'+LinkDisplay+'</a>';
	console.debug('Link DOM Value:%s', this.DOMValue);
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
