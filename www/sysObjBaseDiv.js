//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2023                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "BaseDiv"                                                  -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjBaseDiv"
//------------------------------------------------------------------------------

function sysObjBaseDiv() {
	this.ChildObjects = Object(); //- recursive child menu items
}

//- inherit sysBaseObject
sysObjBaseDiv.prototype = new sysBaseObject();
