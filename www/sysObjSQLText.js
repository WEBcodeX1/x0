//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
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
	this.Language			= 'de';
	this.TextID				= null;
	this.EventListeners		= new Object();
	this.ChildObjects		= new Array();
}

//- inherit sysBaseObject
sysObjSQLText.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.init = function() {

	if (this.JSONConfig !== undefined && this.JSONConfig.Attributes !== undefined) {
		this.DOMStyle = this.JSONConfig.Attributes.Style;

		if (this.JSONConfig.Attributes.TextID !== undefined) {
			this.TextID = this.JSONConfig.Attributes.TextID;
		}
	}

	this.update();

}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.update = function() {

	this.setTextObj();

	try {
		this.DOMValue = this.TextObject[this.Language];
	}
	catch(err) {
		this.DOMValue = 'NoTextError'
		console.debug('::init SetText TextID:%s Error:%s', this.TextID, err);
	};

}


//------------------------------------------------------------------------------
//- METHOD "setTextObj"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.setTextObj = function() {
    //console.log('::setTextObj this.TextID:%s', this.TextID);
	this.TextObject = sysFactory.ObjText.getTextObjectByID(this.TextID);
}


//------------------------------------------------------------------------------
//- METHOD "getText"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.getText = function() {
	return this.TextObject[this.Language];
}


//------------------------------------------------------------------------------
//- METHOD "switchLanguage"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.switchLanguage = function(Language) {
	//- remove element from parent element

	//- set object value to actual language text

	//- add updated element to parent element
}
