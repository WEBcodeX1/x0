//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
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

function sysObjLink() {

	this.EventListeners		= new Object(); 		//- event listeners
	this.ChildObjects		= Array();				//- child objects recursive

	this.ScreenID			= null;
	this.TextID				= null;
	this.RaiseEvents		= null;
	this.ActiveOnFormID		= null;
	this.ScreenOverlayID	= null;

	this.DOMType			= 'button'				//- Set DOM Element Type

	this.LinkHilteStyle 	= 'sysMenuLinkHilite';

}

sysObjLink.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjLink.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	console.debug('set Attributes:%o', Attributes);

	this.DOMStyle			= Attributes.Style;

	this.ScreenID			= Attributes.ScreenID;
	this.TextID				= Attributes.TextID;
	this.FireEvents			= Attributes.FireEvents;
	this.ActiveOnFormID		= Attributes.ActiveOnFormID;
	this.ScreenOverlayID	= Attributes.ScreenOverlayID;

	var SQLTextObj = new sysObjSQLText();
	SQLTextObj.ObjectID = 'SQLText';
	SQLTextObj.TextID = this.TextID;
	SQLTextObj.init();
	this.addObject(SQLTextObj);

	var EventConfig = new Object();
	EventConfig['Type'] = 'mousedown';
	EventConfig['Element'] = this.EventListener.bind(this);

	this.EventListeners["sysLink"] = EventConfig;
}


//------------------------------------------------------------------------------
//- METHOD "EventListener"
//------------------------------------------------------------------------------

sysObjLink.prototype.EventListener = function(Event)
{
	console.debug('Link EventListener ScreenID:%s ScreenOverlayID:%s', this.ScreenID, this.ScreenOverlayID);

	var SwitchScreen = true;

	if (this.ActiveOnFormID !== undefined && this.ActiveOnFormID != null) {

		const FormItem = sysFactory.getFormFieldObjectByID(this.ActiveOnFormID);
		const FormValue = FormItem.getDOMValue();
		//console.log('FormValue:%s', FormValue);
		if (FormValue === undefined || FormValue.length == 0) {
			SwitchScreen = false;
			const sysID = 'SYS__GLOBAL_MSG';

			ActionNotifyDef = {
				"ID": sysID,
				"DisplayHeader": 'Bearbeitung'
			}

			const AsyncNotifyObj = new sysObjAsyncNotify();
			sysFactory.GlobalAsyncNotifyIndicator.addMsgItem(ActionNotifyDef);

			var NotifyItem = sysFactory.GlobalAsyncNotifyIndicator.getMsgItemByName(sysID);

			NotifyItem.setProcessStatus(0);
			NotifyItem.setDisplayText('Kein Datensatz (bearbeiten) ausgewaehlt');
			NotifyItem.updateDisplay();
		}
	}

	if (SwitchScreen === true && this.ScreenID !== undefined) {
		sysFactory.switchScreen(this.ScreenID);
	}

	if (this.ScreenOverlayID !== undefined) {
		sysFactory.OverlayObj.setupOverlay(this.ScreenOverlayID);
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
