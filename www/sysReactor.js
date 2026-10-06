//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
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

function sysEvent(EventID, CallbackFunction, EventSelector)
{
    this.ID                 = EventID;
    this.CallbackFunction   = CallbackFunction;
    this.EventSelector      = EventSelector;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysReactor"
//------------------------------------------------------------------------------

function sysReactor()
{
    this.Events = new Array();
}


//------------------------------------------------------------------------------
//- METHOD "registerEvent"
//------------------------------------------------------------------------------

sysReactor.prototype.registerEvent = function(Attributes, CallbackFunction)
{
    //console.debug('::registerEvents Attributes:%o);

    const EventAttributes = Attributes.OnEvent;
    const Events = Attributes.OnEvent.Events;

    for (const EventItem of Events)
    {
        let EventID = undefined;
        let EventSelector = undefined;

        try {
            EventID = EventItem['EventID'];
            EventSelector = EventItem['EventSelector'];
        }
        catch {
            EventID = EventItem;
        }

        this.Events.push(
            new sysEvent(EventID, CallbackFunction, EventSelector)
        );
    }
}


//------------------------------------------------------------------------------
//- METHOD "dispatchEvent"
//------------------------------------------------------------------------------

sysReactor.prototype.dispatchEvent = function(EventID, EventSelector)
{
    console.debug('Reactor Dispatch Event. EventID:%s Events Object::%o', EventID, this.Events);

    for (const EventObj of this.Events)
    {
        if (EventObj.ID == EventID && EventObj.EventSelector == EventSelector)
        {
            EventObj.CallbackFunction();
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "fireEvents"
//------------------------------------------------------------------------------

sysReactor.prototype.fireEvents = function(FireEvents)
{
    console.debug('Reactor Fire Events. Events Array:%o', FireEvents);
    if (FireEvents !== undefined) {
        for (const EventID of FireEvents) {
            sysFactory.Reactor.dispatchEvent(EventID);
        }
    }
}
