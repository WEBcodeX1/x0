//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Menu Link"                                                -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysMenuLink"
//------------------------------------------------------------------------------

function sysMenuLink() {

	this.EventListeners		= new Object();
	this.ChildObjects		= Array();		//- child objects recursive

	this.TextID				= null;
	this.DOMStyle			= null;
	this.ScreenID			= null;
	this.ObjectID			= null;
    this.PositionTop		= null;
	this.PositionLeft		= null;

}

//- inherit sysBaseObject
sysMenuLink.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "EventListenerClick"
//------------------------------------------------------------------------------
sysMenuLink.prototype.EventListenerClick = function(Event)
{
    sysFactory.switchScreen(this.ScreenID);
    sysFactory.resizeIframe();
}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------
sysMenuLink.prototype.init = function()
{

	var PositionTop = this.PositionTop.toString() + 'px';
	var PositionLeft = this.PositionLeft.toString() + 'px';

	this.ObjectID = 'MenuButtonTable' + this.ObjectID;
	this.DOMStyle = this.DOMStyle + 'Table';
	this.DOMStyleTop = PositionTop;
	this.DOMStyleLeft = PositionLeft;

	var RowObj = new sysObjBaseDiv();
	RowObj.ObjectID = 'MenuButtonTableRow' + this.ObjectID;
	RowObj.DOMStyle = this.DOMStyle + 'TableRow';
    this.RowObj = RowObj;

	var ColObjDescription = new sysObjBaseDiv();
	ColObjDescription.ObjectID = 'MenuButtonDescriptionCol' + this.ObjectID;
	ColObjDescription.DOMStyle = this.DOMStyle + 'Description';

	var SQLTextObj = new sysObjSQLText();
	SQLTextObj.ObjectID = this.TextID;
	SQLTextObj.TextID = this.TextID;
	SQLTextObj.init();

	ColObjDescription.addObject(SQLTextObj);
	RowObj.addObject(ColObjDescription);
	//RowObj.addObject(ColObjImage);

	this.addObject(RowObj);
	this.renderObject();

}


//------------------------------------------------------------------------------
//- METHOD "addEventListenerClick"
//------------------------------------------------------------------------------
sysMenuLink.prototype.addEventListenerClick = function()
{

	//- add event listener to row element
	this.RowObj.addEventListener('mousedown',this.EventListenerClick.bind(this));

}
