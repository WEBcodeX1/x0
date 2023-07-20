//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2021                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Link"                                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjLink"
//------------------------------------------------------------------------------

function sysObjLink()
{
	this.EventListeners				= new Object(); 		//- event listeners
	this.ChildObjects				= Array();				//- child objects recursive

	this.ScreenID					= null;
	this.TextID						= null;
	this.FireEvents					= null;
	this.ScreenOverlayID			= null;
	this.ScreenOverlayAttributes	= null;

	this.DOMType					= 'button'				//- Set DOM Element Type

	this.LinkHilteStyle 			= 'sysMenuLinkHilite';
}

sysObjLink.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjLink.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	console.debug('set Link Attributes:%o', Attributes);

	this.DOMStyle = Attributes.Style;

	this.ScreenID = Attributes.ScreenID;
	this.TextID	= Attributes.TextID;
	this.FireEvents	= Attributes.FireEvents;
	this.ScreenOverlayID= Attributes.ScreenOverlayID;
	this.ScreenOverlayAttributes = Attributes.ScreenOverlayAttributes;

	if (Attributes.ShowLink === undefined && Attributes.ShowLink !== true) {
		this.SQLTextObj = new sysObjSQLText();
		this.SQLTextObj.ObjectID = 'SQLText';
		this.SQLTextObj.TextID = this.TextID;
		this.SQLTextObj.init();
		this.addObject(this.SQLTextObj);
	}

	var EventConfig = new Object();
	EventConfig['Type'] = 'mousedown';
	EventConfig['Element'] = this.EventListener.bind(this);
	this.EventListeners['sysLink'] = EventConfig;
}


//------------------------------------------------------------------------------
//- METHOD "EventListener"
//------------------------------------------------------------------------------

sysObjLink.prototype.EventListener = function(Event)
{
	console.debug('Link EventListener ScreenID:%s ScreenOverlayID:%s', this.ScreenID, this.ScreenOverlayID);

	var SwitchScreen = true;

	if (SwitchScreen === true && this.ScreenID !== undefined) {
		sysFactory.switchScreen(this.ScreenID);
	}

	if (this.ScreenOverlayID !== undefined) {
		sysFactory.OverlayObj.setupOverlay(this.ScreenOverlayID, this.ScreenOverlayAttributes);
	}

	if (this.FireEvents !== undefined) {
		sysFactory.Reactor.fireEvents(this.FireEvents);
	}

}


//------------------------------------------------------------------------------
//- METHOD "Hilite"
//------------------------------------------------------------------------------

sysObjLink.prototype.Hilite = function(Event)
{
	//console.debug('::Hilite Style:%s', this.LinkHilteStyle);
	this.addDOMElementStyle(this.LinkHilteStyle);
}


//------------------------------------------------------------------------------
//- METHOD "DeHilite"
//------------------------------------------------------------------------------

sysObjLink.prototype.DeHilite = function(Event)
{
	//console.debug('::DeHilite Style:%s', this.LinkHilteStyle);
	this.removeDOMElementStyle(this.LinkHilteStyle);
}
