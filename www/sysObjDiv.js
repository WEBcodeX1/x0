//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Div"                                                      -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

/*
 * # REFACTORING #
 * 
 * - add processing of "DOMAttributes" (see example object "ProjektNewFormfieldsAntragabschlussVorschau"
 * 
*/


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjDiv"
//------------------------------------------------------------------------------

function sysObjDiv() {
	this.ChildObjects	= new Array();		//- Child Objects recursive
}

//- inherit sysBaseObject
sysObjDiv.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjDiv.prototype.init = function() {

	if (this.JSONConfig !== undefined) {
		const Attributes = this.JSONConfig.Attributes;

		//- set dom type if given
		this.DOMType = (Attributes.DOMType === undefined) ? 'div' : Attributes.DOMType;
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateDynValue"
//------------------------------------------------------------------------------

/*
 * # REFACTORING #
 * 
 * not needed anymore, moved to sysObjLinkExternal
 * 
*/

sysObjDiv.prototype.updateDynValue = function(ResultObject) {
	const Attributes = this.JSONConfig.Attributes;
	const Replaceparams = Attributes.ReplaceParams;
    var ReplaceString = Attributes.Value;
    for (i in Replaceparams) {
		var ReplaceParam = Replaceparams[i];
        ReplaceString = ReplaceString.replace('%session_id', sysFactory.SysSessionValue);
        ReplaceString = ReplaceString.replace('%'+ReplaceParam, ResultObject[ReplaceParam]);
	}
	this.DOMValue = ReplaceString;
	this.setDOMElementValue();
}


//------------------------------------------------------------------------------
//- METHOD "updateValue"
//------------------------------------------------------------------------------

sysObjDiv.prototype.updateValue = function() {
	//console.debug('::updateValue this.Value:%s', this.Value);
	const Attributes = this.JSONConfig.Attributes;
	const Replaceparams = Attributes.ReplaceParams;
    var ReplaceString = Attributes.Value;
    for (i in Replaceparams) {
		var ReplaceParam = Replaceparams[i];
        ReplaceString = ReplaceString.replace('%session_id', sysFactory.SysSessionValue);
        ReplaceString = ReplaceString.replace('%'+ReplaceParam, this.Value);
	}
	this.DOMValue = ReplaceString;
	this.setDOMElementValue();
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysObjDiv.prototype.reset = function() {

	try {
		const Attributes = this.JSONConfig.Attributes;
		if (Attributes.Reset !== undefined) {
			this.DOMValue = '';
			this.setDOMElementValue();
		}
	}
	catch(err) {
	}
}
