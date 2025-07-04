//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "Reactor"                                                         -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysEvent"
//------------------------------------------------------------------------------

function sysEvent(ID, Object, Type, Attributes) {
    this.ID = ID;
    this.ObjectRef = Object;
    this.Type = Type;
    this.Attributes = Attributes;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysReactor"
//------------------------------------------------------------------------------

function sysReactor() {
    this.Events = new Array();
}


//------------------------------------------------------------------------------
//- METHOD "registerEvent"
//------------------------------------------------------------------------------

sysReactor.prototype.registerEvent = function(Attributes, ProcessObject, Type) {

    //console.debug('::registerEvent Attributes:%o ProcessObject:%o, Type:%s', Attributes, ProcessObject, Type);

    const EAttributes = Attributes.OnEvent;

    if (EAttributes !== undefined) {
        for (EventKey in EAttributes.Events) {
            const EventID = EAttributes.Events[EventKey];
            const EventAttributes = EAttributes.Attributes;
            const EventType = EAttributes.Type;

            if (EventType !== undefined) {
                Type = EventType;
            }

            const Event = new sysEvent(EventID, ProcessObject, Type, EventAttributes);
            this.Events.push(Event);
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "dispatchEvent"
//------------------------------------------------------------------------------

sysReactor.prototype.dispatchEvent = function(EventID) {

    console.debug('Reactor Dispatch Event. EventID:%s Events Object::%o', EventID, this.Events);

    for (EventKey in this.Events) {

        var EventObj = this.Events[EventKey];

        if (EventObj.ID == EventID) {

            const ProcessObj = EventObj.ObjectRef;

            var Attributes;
            try {
                Attributes = ProcessObj.ServiceConnector.JSONConfig.Attributes;
            }
            catch(err) {
                Attributes = ProcessObj.JSONConfig.Attributes;
            }

            //console.debug('Reactor Dispatch Event. EventObject:%o ProcessObj:%o', EventObj, ProcessObj);

            switch (EventObj.Type) {

                case "ServiceConnector":

                    console.debug('Reactor Dispatch Event. ServiceConnector Object:%o', ProcessObj.ServiceConnector);

                    ProcessObj.processSourceObjects();
                    ProcessObj.DataURL = Attributes.OnEvent.ServiceCall;

                    //- add backend service identifier
                    ProcessObj.PostRequestData.addServiceProperty(
                        'BackendServiceID',
                        Attributes.OnEvent.ServiceID
                    );
                    ProcessObj.getServiceData();
    
                    continue;

                case "Dynpulldown":

                    //console.debug('Reactor Dispatch Event. Dynpulldown:%o', ProcessObj);
                    ProcessObj.getDynPulldownData();

                    continue;

                case "SetObjectPropertyValues":

                    //console.debug('Reactor Dispatch Event. SetObjectPropertyValues:%o', ProcessObj);
                    var s = new setObjectPropertyValues(EventObj);

                    continue;

            }

        }

    }

}


//------------------------------------------------------------------------------
//- METHOD "fireEvents"
//------------------------------------------------------------------------------

sysReactor.prototype.fireEvents = function(FireEvents) {
    //console.log('Reactor Fire Events. Events Array:%o', FireEvents);
    for (EventKey in FireEvents) {
        var Event = FireEvents[EventKey];
        sysFactory.Reactor.dispatchEvent(Event);
    }
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "setObjectPropertyValues"
//------------------------------------------------------------------------------

function setObjectPropertyValues(EventObj) {
    this.EventObj = EventObj;
    this.callService();
}


//------------------------------------------------------------------------------
//- METHOD "callService"
//------------------------------------------------------------------------------

setObjectPropertyValues.prototype.callService = function()
{
    const Attributes = this.EventObj.Attributes;

    for (Index in Attributes.DstProperties) {

        const DstProperty = Attributes.DstProperties[Index];
        const DstObject = sysFactory.getObjectByID(DstProperty.ObjectID);

        try {
            DstObject.ParentObject.disable();
        }
        catch(err) {
            console.debug('Dst Object disable() failed. ObjectID:%s Object:%o', DstProperty.ObjectID, DstObject);
        }

        if (DstProperty.SetStyle !== undefined) {
            DstObject.addDOMElementStyle(DstProperty.SetStyle);
        }

    }

    RPC = new sysCallXMLRPC(this.EventObj.Attributes.ServiceURL);
    RPC.Request(this);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

setObjectPropertyValues.prototype.callbackXMLRPCAsync = function()
{
    const Attributes = this.EventObj.Attributes;

    for (Index in Attributes.DstProperties) {

        const DstProperty = Attributes.DstProperties[Index];
        const DstObject = sysFactory.getObjectByID(DstProperty.ObjectID);

        DstObject[DstProperty.PropertyName] = this.XMLRPCResultData[DstProperty.PropertyName];

        if (DstProperty.SetStyle !== undefined) {
            DstObject.removeDOMElementStyle(DstProperty.SetStyle);
        }

        try {
            DstObject.ParentObject.enable();
        }
        catch(err) {
            console.debug('Dst Object enable() failed. ObjectID:%s Object:%o', DstProperty.ObjectID, DstObject);
        }

        DstObject.getDOMelement().focus();
    }
}
