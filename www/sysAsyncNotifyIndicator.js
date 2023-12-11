//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2023                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "AsyncNotifyIndicator"                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Renders Notification Layer                                               -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjAsyncNotifyIndicator"
//------------------------------------------------------------------------------

function sysObjAsyncNotifyIndicator() {

	this.EventListeners	= new Object();
	this.ChildObjects	= new Array();

	this.Items			= new Object();

	this.ObjectID 		= 'SYSGlobalAsyncNotifyIndicator';

	this.zIndex			= 10;

	this.init();

}

sysObjAsyncNotifyIndicator.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicator.prototype.init = function()
{
	this.renderObject();
}


//------------------------------------------------------------------------------
//- METHOD "addMsgItem"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicator.prototype.addMsgItem = function(Config)
{
	var IndicatorItem = new sysObjAsyncNotifyIndicatorItem(Config, this);
	//console.debug('::addMsgItem Config:%o Item:%o', Config, IndicatorItem);
	this.Items[Config.ID] = IndicatorItem;
	this.zIndex += 1;
}


//------------------------------------------------------------------------------
//- METHOD "getMsgItemByName"
//------------------------------------------------------------------------------

sysObjAsyncNotifyIndicator.prototype.getMsgItemByName = function(ID)
{
	return this.Items[ID];
}
