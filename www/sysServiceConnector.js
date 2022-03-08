//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
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
	this.ObjectShortID		= 'SC';
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
		sysFactory.Reactor.registerEvent(this.JSONConfig.Attributes, DstObject);
	}
	catch(err) {
		console.debug('::connect err:%s', err);
	}
}
