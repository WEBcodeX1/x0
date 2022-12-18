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

		//- set dom value if given
		this.DOMValue = (Attributes.Value === undefined) ? '' : Attributes.Value;

		//- set dom style
		this.DOMStyle = Attributes.Style;
	}
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
