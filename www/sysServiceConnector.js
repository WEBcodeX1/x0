//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "ServiceConnector"                                                -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "ServiceConnector"
//------------------------------------------------------------------------------

function sysServiceConnector() {
	this.ChildObjects 		= new Array();
	this.PostRequestData	= new sysRequestDataHandler();
}

sysServiceConnector.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysServiceConnector.prototype.init = function()
{
}


//------------------------------------------------------------------------------
//- METHOD "connect"
//------------------------------------------------------------------------------

sysServiceConnector.prototype.connect = function()
{
	const DstObject = this.getChildObjectByIndex(0);
	console.debug('::connect ChildObjects:%o DstObject:%o', this.ChildObjects, DstObject);
	try {
		DstObject.ServiceConnector = this;
		sysFactory.Reactor.registerEvent(this.JSONConfig.Attributes, DstObject, 'ServiceConnector');
	}
	catch(err) {
		console.debug('::connect err:%s', err);
	}
}
