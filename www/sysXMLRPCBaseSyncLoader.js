//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- XML_RPC_HANDLER                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Synchronous/Asynchronous XRPC Handler                                    -//
//-                                                                          -//
//- RPCType          SYNC | ASYNC                                            -//
//- URL              Request URL                                             -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- Constructor "sysCallXMLRPC"
//------------------------------------------------------------------------------

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysXMLRPCBaseSyncLoader"
//------------------------------------------------------------------------------

function sysXMLRPCBaseSyncLoader() {
}


//------------------------------------------------------------------------------
//- METHOD "setLoaderObj"
//------------------------------------------------------------------------------
sysXMLRPCBaseSyncLoader.prototype.setLoaderObj = function(LoaderObject)
{
    this.LoaderObject = LoaderObject;
}


//------------------------------------------------------------------------------
//- METHOD "requestXMLRPCData"
//------------------------------------------------------------------------------
sysXMLRPCBaseSyncLoader.prototype.requestXMLRPCData = function(URL)
{
    this.DataReadyState = false;
    const RPC = new sysCallXMLRPC(URL);
    this.MergeResult = true;
    RPC.Request(this);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------
sysXMLRPCBaseSyncLoader.prototype.callbackXMLRPCAsync = function()
{
    this.DataReadyState = true;
    this.LoaderObject.checkLoaded();
}
