//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
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
    this.ObjectType         = 'ServiceConnector'                //- Object Type
    this.PostRequestData    = new sysRequestDataHandler();      //- POST Request Data Container
    this.ChildObjects       = new Array();                      //- Child Objects
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
        sysFactory.Reactor.registerEvent(
            this.JSONConfig.Attributes, this.EventCallback
        );
    }
    catch(err) {
        console.debug('::connect err:%s', err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "EventCallback"
//------------------------------------------------------------------------------

sysServiceConnector.prototype.EventCallback = function(EventConfig)
{
    const Attributes = this.JSONConfig.Attributes;

    this.processSourceObjects();
    this.DataURL = Attributes.OnEvent.ServiceCall;

    //- add backend service identifier
    this.PostRequestData.addServiceProperty(
        'BackendServiceID',
        Attributes.OnEvent.ServiceID
    );

    ProcessObj.getServiceData();
}
