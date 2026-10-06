//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "FunctionDispatcher"                                       -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Renders Context Menu                                                     -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFunctionDispatcher"
//------------------------------------------------------------------------------

function sysFunctionDispatcher()
{
    this.Functions  = {
        "get-data": this.ObjectGetData,
        "set-data": this.ObjectSetData,
        "get-set-data": this.ObjectGetSetData,
        "remove": this.ObjectRemove,
        "remove-selected": this.ObjectRemoveSelected,
        "reset": this.ObjectReset
    }
}


//------------------------------------------------------------------------------
//- METHOD "dispatchFunction"
//------------------------------------------------------------------------------

sysFunctionDispatcher.prototype.dispatchFunction = function(FunctionID, ObjectRef, Attributes)
{
    try {
        this.Functions[FunctionID](ObjectRef, Attributes);
    }
    catch(err) {
        console.log('::functionDispatcher dispatchFunction() FunctionID:%s err:%s', FunctionID, err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "ObjectGetData"
//------------------------------------------------------------------------------

sysFunctionDispatcher.prototype.ObjectGetData = function(ObjectRef, Attributes)
{
    sysFactory.ClipboardData = ObjectRef.getObjectData();
}


//------------------------------------------------------------------------------
//- METHOD "ObjectSetData"
//------------------------------------------------------------------------------

sysFunctionDispatcher.prototype.ObjectSetData = function(ObjectRef, Attributes)
{
    ObjectRef.setObjectData(sysFactory.ClipboardData);
}


//------------------------------------------------------------------------------
//- METHOD "ObjectGetSetData"
//------------------------------------------------------------------------------

sysFunctionDispatcher.prototype.ObjectGetSetData = function(ObjectRef, Attributes)
{
    const SrcData = ObjectRef.getObjectData();
    const DstObject = sysFactory.getObjectByID(Attributes.DstObjectID);
    DstObject.setObjectData(SrcData);
}


//------------------------------------------------------------------------------
//- METHOD "ObjectRemove"
//------------------------------------------------------------------------------

sysFunctionDispatcher.prototype.ObjectRemove = function(ObjectRef, Attributes)
{
    ObjectRef.remove();
}


//------------------------------------------------------------------------------
//- METHOD "ObjectRemoveSelected"
//------------------------------------------------------------------------------

sysFunctionDispatcher.prototype.ObjectRemoveSelected = function(ObjectRef, Attributes)
{
    ObjectRef.removeSelected();
}


//------------------------------------------------------------------------------
//- METHOD "ObjectReset"
//------------------------------------------------------------------------------

sysFunctionDispatcher.prototype.ObjectReset = function(ObjectRef, Attributes)
{
    ObjectRef.reset();
}


//------------------------------------------------------------------------------
//- Setup Global "Fun" Access
//------------------------------------------------------------------------------

const FunctionDispatcher = new sysFunctionDispatcher();
