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
	const Attributes = this.JSONConfig.Attributes;
	if (Attributes.Static === true) {
		this.Value = Attributes.ReplaceValue;
		this.updateValue();
	}	
}


//------------------------------------------------------------------------------
//- METHOD "updateValue"
//------------------------------------------------------------------------------

sysObjLinkExternal.prototype.updateValue = function()
{
	const Attributes = this.JSONConfig.Attributes;

	var link_content = Attributes.LinkURL;
	var link_display = (Attributes.LinkDisplay === undefined) ? Attributes.LinkURL : Attributes.LinkDisplay;

	var open_in_tab = '';

	for (ReplaceVar in Attributes.ReplaceVars) {
		const ReplaceColumn = Attributes.ReplaceVars[ReplaceVar];
		link_content = link_content.replace('%'+ReplaceVar, this.ScreenObject.getDBColumnValue(ReplaceColumn));
		link_content = link_content.replace('%'+ReplaceVar, this.ScreenObject.getDBColumnValue(ReplaceColumn));
	}

	console.debug('::updateValue ReplaceStatic:%o', Attributes.ReplaceStatic);

	for (ReplaceVar in Attributes.ReplaceStatic) {
		/* crappy workaround */
		this.Value = 'dummy';
		/* crappy workaround */
		const Value = Attributes.ReplaceStatic[ReplaceVar];
		link_content = link_content.replace('%'+ReplaceVar, Value);
		link_display = link_display.replace('%'+ReplaceVar, Value);
	}

	link_content = link_content.replace('%value', this.Value);
	link_display = link_display.replace('%value', this.Value);

	//- replace session id
	link_content = link_content.replace('%session_id', sysFactory.SysSessionValue);

	if (Attributes.OpenInTab === true) {
		 open_in_tab = ' target="_blank" rel="noopener noreferrer"';
	}

	if (this.Value.length == 0) {
		this.DOMValue = Attributes.DisplayTextNoData;
	}
	else {
		this.DOMValue = '<a href="'+link_content+'"'+open_in_tab+'>'+link_display+'</a>';
	}

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


//------------------------------------------------------------------------------
//- METHOD "updateDynValue"
//------------------------------------------------------------------------------

sysObjLinkExternal.prototype.updateDynValue = function(ResultObject)
{
	console.debug('::updateDynValue ResultObject:%o', ResultObject);
	const StaticObject = this.JSONConfig.Attributes.ReplaceStatic;
	if (StaticObject === undefined) {
		this.JSONConfig.Attributes.ReplaceStatic = new Object();
	}

	for (ObjectKey in ResultObject) {
		ObjectValue = ResultObject[ObjectKey];
		this.JSONConfig.Attributes.ReplaceStatic[ObjectKey] = ObjectValue;
	}

	this.updateValue();
}
