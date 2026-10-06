//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "ScreenOverlay" Handler                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysScreenOverlay"
//------------------------------------------------------------------------------

function sysScreenOverlay() {
    this.OverlayStyle = 'overlay-screen p-5 bg-secondary bg-opacity-75 shadow';
}


//------------------------------------------------------------------------------
//- METHOD "activateOverlay"
//------------------------------------------------------------------------------

sysScreenOverlay.prototype.activateOverlay = function(ScreenID)
{
    const ScreenObj = sysFactory.getScreenByID(ScreenID);
    const ScreenRootObj = ScreenObj.HierarchyRootObject;

    ScreenRootObj.DOMStyle = this.OverlayStyle;
    ScreenRootObj.setDOMElementStyle();
    ScreenRootObj.VisibleState = 'visible';
    ScreenRootObj.setDOMVisibleState();
    ScreenRootObj.DOMStyleZIndex = 300;
    ScreenRootObj.setDOMElementZIndex();
}


//------------------------------------------------------------------------------
//- METHOD "closeOverlay"
//------------------------------------------------------------------------------

sysScreenOverlay.prototype.closeOverlay = function(ScreenID)
{
    const ScreenObj = sysFactory.getScreenByID(ScreenID);
    const ScreenRootObj = ScreenObj.HierarchyRootObject;

    ScreenRootObj.removeDOMElementStyle(this.OverlayStyle);
    ScreenRootObj.VisibleState = 'hidden';
    ScreenRootObj.setDOMVisibleState();
}
