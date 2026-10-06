//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "DragDropHandler"                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysDragDropSourceHandler"
//------------------------------------------------------------------------------

function sysDragDropSourceHandler()
{
}


//------------------------------------------------------------------------------
//- METHOD "setupDrag"
//------------------------------------------------------------------------------

sysDragDropSourceHandler.prototype.setupDrag = function()
{
    var DragStartEvent = new Object();
    DragStartEvent['Type'] = 'dragstart';
    DragStartEvent['Element'] = this.onDragStart.bind(this);
    this.EventListeners['DragStart'] = DragStartEvent;
}


//------------------------------------------------------------------------------
//- METHOD "onDragStart"
//------------------------------------------------------------------------------

sysDragDropSourceHandler.prototype.onDragStart = function(Event)
{
    sysFactory.ClipboardData = this.getObjectData();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysDragDropDestinationHandler"
//------------------------------------------------------------------------------

function sysDragDropDestinationHandler()
{
}


//------------------------------------------------------------------------------
//- METHOD "setupDrop"
//------------------------------------------------------------------------------

sysDragDropDestinationHandler.prototype.setupDrop = function()
{
    var DragOverEvent = new Object();
    DragOverEvent['Type'] = 'dragover';
    DragOverEvent['Element'] = this.onDragOver.bind(this);
    this.EventListeners['DragOver'] = DragOverEvent;

    var DragLeaveEvent = new Object();
    DragLeaveEvent['Type'] = 'dragleave';
    DragLeaveEvent['Element'] = this.onDragLeave.bind(this);
    this.EventListeners['DragLeave'] = DragLeaveEvent;

    var DropEvent = new Object();
    DropEvent['Type'] = 'drop';
    DropEvent['Element'] = this.onDrop.bind(this);
    this.EventListeners['Drop'] = DropEvent;
}


//------------------------------------------------------------------------------
//- METHOD "onDragOver"
//------------------------------------------------------------------------------

sysDragDropDestinationHandler.prototype.onDragOver = function(Event)
{
    this.addDOMElementStyle('sysDragDropOver');
}


//------------------------------------------------------------------------------
//- METHOD "onDragLeave"
//------------------------------------------------------------------------------

sysDragDropDestinationHandler.prototype.onDragLeave = function(Event)
{
    this.removeDOMElementStyle('sysDragDropOver');
}


//------------------------------------------------------------------------------
//- METHOD "onDrop"
//------------------------------------------------------------------------------

sysDragDropDestinationHandler.prototype.onDrop = function(Event)
{
    this.setObjectData(sysFactory.ClipboardData, true);
    this.removeDOMElementStyle('sysDragDropOver');
}
