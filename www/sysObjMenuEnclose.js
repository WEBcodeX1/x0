//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2022                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "MenuEnclose"                                              -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjMenuEnclose"
//------------------------------------------------------------------------------

function sysObjMenuEnclose() {
	this.ChildObjects	= new Array();		//- Child Objects recursive
}

sysObjMenuEnclose.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjMenuEnclose.prototype.init = function() {

	if (this.JSONConfig !== undefined) {
		const Attributes = this.JSONConfig.Attributes;

		//- setup header div
		HeaderDiv = new sysObjDiv();
		HeaderDiv.ObjectID = this.ObjectID + 'Header';
		HeaderDiv.ObjectShortID = 'Header';
		HeaderDiv.JSONConfig = {
			"Attributes": {
				"DOMType": "header",
				"Style": Attributes.StyleHeader
			}
		};
		HeaderDiv.init();

		//- setup nav div
		NavDiv = new sysObjDiv();
		NavDiv.ObjectID = this.ObjectID + 'Nav';
		NavDiv.ObjectShortID = 'Nav';
		NavDiv.JSONConfig = {
			"Attributes": {
				"DOMType": "nav",
				"Style": Attributes.StyleNav
			}
		};
		NavDiv.init();

		//- setup ul div
		UlDiv = new sysObjDiv();
		UlDiv.ObjectID = this.ObjectID + 'Ul';
		UlDiv.ObjectShortID = 'Ul';
		UlDiv.JSONConfig = {
			"Attributes": {
				"DOMType": "ul",
				"Style": Attributes.StyleUl
			}
		};
		UlDiv.init();

		NavDiv.addObject(UlDiv);
		HeaderDiv.addObject(NavDiv);
		this.addObject(HeaderDiv);

	}
}
