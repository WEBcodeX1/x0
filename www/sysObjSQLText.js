//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "SQLText"                                                  -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjSQLText"
//------------------------------------------------------------------------------

function sysObjSQLText() {
	this.TextID				= null;
	this.EventListeners		= new Object();
	this.ChildObjects		= new Array();
	this.IconHTMLPre = '';
	this.IconHTMLPost = '';
}

//- inherit sysBaseObject
sysObjSQLText.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.init = function() {

	if (this.JSONConfig !== undefined && this.JSONConfig.Attributes !== undefined) {

		const Attributes = this.JSONConfig.Attributes;

		if (Attributes.DOMType !== undefined) {
			this.DOMType = Attributes.DOMType;
		}

		const IconStyle = Attributes.IconStyle;

		if (IconStyle !== undefined) {
			this.IconHTMLPre = '<i class="' + IconStyle + '"></i> '
		};

		const IconStylePost = Attributes.IconStylePost;

		if (IconStylePost !== undefined) {
			this.IconHTMLPost = '<i class="' + IconStylePost + '"></i> '
		};

		this.DOMStyle = Attributes.Style;

		if (Attributes.TextID !== undefined) {
			this.TextID = Attributes.TextID;
		}
	}

	this.update();

}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.update = function() {

	try {
		const TextValue = sysFactory.getText(this.TextID);
		this.DOMValue = this.IconHTMLPre + TextValue + this.IconHTMLPost;
	}
	catch(err) {
		this.DOMValue = 'NoTextError'
		console.debug('::init SetText TextID:%s Error:%s', this.TextID, err);
	};

}
