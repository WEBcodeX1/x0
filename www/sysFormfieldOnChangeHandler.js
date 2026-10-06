//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "FormFieldOnChangeHandler" Object                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- FormFieldOnChangeHandler Object                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormFieldOnChangeHandler"
//------------------------------------------------------------------------------

function sysFormFieldOnChangeHandler()
{
}


//------------------------------------------------------------------------------
//- METHOD "processOnChangeItem"
//------------------------------------------------------------------------------

sysFormFieldOnChangeHandler.prototype.processOnChangeItem = function()
{
    const OnChangeAttributes = this.JSONConfig.Attributes.OnChange;

    console.debug('::processOnChangeItem this:%o OnChangeAttributes:%o', this, OnChangeAttributes);

    if (OnChangeAttributes !== undefined)
    {
        const OnChangeConfig = Array.isArray(OnChangeAttributes) ? OnChangeAttributes : [ OnChangeAttributes ];

        for (OnChangeElement of OnChangeConfig)
        {
            //console.debug('::processOnChangeItem OnChangeElement:%o', OnChangeElement);
            if (OnChangeElement.UpdateFormLength !== undefined)
            {
                try {
                    const ObjectID = OnChangeElement.UpdateFormfield;
                    const DestinationObject = sysFactory.getObjectByID(ObjectID);
                    const ElementValue = this.RuntimeGetDataFunc();
                    const CurrentLength = FormElementValue.length;
                    const TextPre = sysFactory.getText(OnChangeElement.TextPreID);
                    const TextPost = sysFactory.getText(OnChangeElement.TextPostID);
                    const Value = TextPre + (OnChangeElement.MaxLength - CurrentLength) + TextPost;

                    //console.debug('DestinationObject:%o', DestinationObject);
                    DestinationObject.Value = Value;
                    DestinationObject.RuntimeSetDataFunc();
                }
                catch (err) {
                    console.debug('FormfieldOnChangeHandler UpdateFormfield err:%s', err);
                }
            }

            if (OnChangeElement.ActivateOnValues !== undefined)
            {
                const ObjectID = OnChangeElement.ObjectID;
                var DestinationObject = sysFactory.getObjectByID(ObjectID);
                const FormValue = this.RuntimeGetDataFunc();
                //console.debug('::processOnChangeItem ActivateOnValues ObjectID:%s DestinationObject:%o FormValue:', ObjectID, DestinationObject, FormValue);
                for (const ActivateValue of OnChangeElement.ActivateOnValues)
                {
                    if (ActivateValue == FormValue) {
                        //console.debug('::processOnChangeItem enable()');
                        DestinationObject.setActivated();
                        DestinationObject.VisibleState = 'visible';
                        DestinationObject.setDOMVisibleState();
                    }
                }
                for (const DeactivateValue of OnChangeElement.DeactivateOnValues)
                {
                    if (DeactivateValue == FormValue) {
                        //console.debug('::processOnChangeItem disable()');
                        DestinationObject.VisibleState = 'hidden';
                        DestinationObject.setDOMVisibleState();
                        DestinationObject.setDeactivated();
                    }
                }
            }

            if (OnChangeElement.EnableOnValues !== undefined)
            {
                const ObjectID = OnChangeElement.ObjectID;
                const DestinationObject = sysFactory.getObjectByID(ObjectID);
                console.debug('::processOnChangeItem DestinationObject:%s', ObjectID);
                const FormValue = this.RuntimeGetDataFunc();
                //console.debug('::processOnChangeItem EnableOnValues ObjectID:%s DestinationObject:%o FormValue:', ObjectID, DestinationObject, FormValue);

                for (const EnableValue of OnChangeElement.EnableOnValues)
                {
                    if (EnableValue == FormValue) {
                        console.debug('::processOnChangeItem enable() DestinationObject:%o', DestinationObject);
                        DestinationObject.enableDOMElementRecursive();
                    }
                }

                for (const DisableValue of OnChangeElement.DisableOnValues)
                {
                    if (DisableValue == FormValue) {
                        console.debug('::processOnChangeItem disable() DestinationObject:%o', DestinationObject);
                        DestinationObject.disableDOMElementRecursive();
                    }
                }
            }

            if (OnChangeElement.FireEvents !== undefined)
            {
                const FireEvents = OnChangeElement.FireEvents;
                //console.log('Formfield On Change Handler FireEvents:%o', FireEvents);
                if (FireEvents !== undefined) {
                    sysFactory.Reactor.fireEvents(FireEvents);
                }
            }
        }
    }

    //- reset all error container
    sysFactory.resetErrorContainer();
}
