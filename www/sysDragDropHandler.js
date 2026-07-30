//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "DragDropHandler"                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-  Central coordinator for HTML5 drag-and-drop operations.                 -//
//-  Tracks the currently dragged object and its data payload so that        -//
//-  any registered drop-target can retrieve them on the "drop" event.       -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysDragDropHandler"
//------------------------------------------------------------------------------

function sysDragDropHandler()
{
    this.DragSourceObject = null;   //- Currently dragged source object reference
    this.DragSourceData   = null;   //- Currently dragged data payload
}


//------------------------------------------------------------------------------
//- METHOD "setDragSource"
//------------------------------------------------------------------------------

sysDragDropHandler.prototype.setDragSource = function(SourceObject, SourceData)
{
    this.DragSourceObject = SourceObject;
    this.DragSourceData   = SourceData;
}


//------------------------------------------------------------------------------
//- METHOD "getDragData"
//------------------------------------------------------------------------------

sysDragDropHandler.prototype.getDragData = function()
{
    return this.DragSourceData;
}


//------------------------------------------------------------------------------
//- METHOD "getDragSourceObject"
//------------------------------------------------------------------------------

sysDragDropHandler.prototype.getDragSourceObject = function()
{
    return this.DragSourceObject;
}


//------------------------------------------------------------------------------
//- METHOD "clearDragSource"
//------------------------------------------------------------------------------

sysDragDropHandler.prototype.clearDragSource = function()
{
    this.DragSourceObject = null;
    this.DragSourceData   = null;
}
