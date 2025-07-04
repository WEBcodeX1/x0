//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
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

function sysFormFieldOnChangeHandler() {
}


//------------------------------------------------------------------------------
//- METHOD "checkLengthMismatch"
//------------------------------------------------------------------------------

sysFormFieldOnChangeHandler.prototype.checkLengthMismatch = function(Length, CheckLength, ValidateProperties)
{
    if (ValidateProperties.DataLengthIgnore !== undefined) {
        const DataLengthParams = ValidateProperties.DataLengthIgnore;
        if (
            (DataLengthParams.gt == true && Length > CheckLength) ||
            (DataLengthParams.lt == true && Length < CheckLength)
        ) {
            if (DataLengthParams.reset == true) {
                this.reset();
            }
            return false;
        }
        return true;
    }
}


//------------------------------------------------------------------------------
//- METHOD "processOnChangeItem"
//------------------------------------------------------------------------------

sysFormFieldOnChangeHandler.prototype.processOnChangeItem = function()
{
    const JSONConfig = this.JSONConfig.Attributes.OnChange;

    console.debug('::processOnChangeItem this:%o JSONConfig:%o', this, JSONConfig);

    if (JSONConfig !== undefined) {
        const OnChangeConfig = Array.isArray(JSONConfig) ? JSONConfig : [ JSONConfig ];

        for (OnChangeElement of OnChangeConfig) {

            //console.debug('::processOnChangeItem OnChangeElement:%o', OnChangeElement);

            if (OnChangeElement.UpdateFormLength !== undefined) {
                try {
                    const ObjectID = (this.InstancePrefix === undefined) ? OnChangeElement.UpdateFormfield : this.InstancePrefix + OnChangeElement.UpdateFormfield;
                    const DestinationObject = sysFactory.getObjectByID(ObjectID);
                    const FormElementValue = this.FormItemGetValue();
                    const CurrentLength = FormElementValue.length;
                    const TextPre = sysFactory.getText(OnChangeElement.TextPreID);
                    const TextPost = sysFactory.getText(OnChangeElement.TextPostID);
                    const Value = TextPre + (OnChangeElement.MaxLength - CurrentLength) + TextPost;

                    //console.debug('DestinationObject:%o', DestinationObject);
                    DestinationObject.ParentObject.Value = Value;
                    DestinationObject.ParentObject.FormItemSetValue();

                    //console.log('::processOnChangeItem FooterObject:%o CurrentLength:%s CharsLeft:%s', ListAdditionalFooterObj, CurrentLength, CharsLeft);
                }
                catch (err) {
                    console.debug('FormfieldOnChangeHandler UpdateFormfield err:%s', err);
                }
            }

            if (OnChangeElement.ActivateOnValues !== undefined) {

                const ObjectID = (this.InstancePrefix === undefined) ? OnChangeElement.ObjectID : this.InstancePrefix + OnChangeElement.ObjectID;
                var DstObj = sysFactory.getObjectByID(ObjectID);
                const FormValue = this.RuntimeGetDataFunc();
                //console.debug('::processOnChangeItem ActivateOnValues ObjectID:%s DstObj:%o FormValue:', ObjectID, DstObj, FormValue);
                for (const ActivateValue of OnChangeElement.ActivateOnValues) {
                    if (ActivateValue == FormValue) {
                        //console.debug('::processOnChangeItem enable()');
                        DstObj.setActivated();
                        DstObj.VisibleState = 'visible';
                        DstObj.setDOMVisibleState();
                    }
                }
                for (const DeactivateValue of OnChangeElement.DeactivateOnValues) {
                    if (DeactivateValue == FormValue) {
                        //console.debug('::processOnChangeItem disable()');
                        DstObj.VisibleState = 'hidden';
                        DstObj.setDOMVisibleState();
                        DstObj.setDeactivated();
                    }
                }
            }

            if (OnChangeElement.EnableOnValues !== undefined) {

                const ObjectID = (this.InstancePrefix === undefined) ? OnChangeElement.ObjectID : this.InstancePrefix + OnChangeElement.ObjectID;
                var DstObj = sysFactory.getObjectByID(ObjectID);
                console.debug('::processOnChangeItem DstObj:%s', ObjectID);
                const FormValue = this.RuntimeGetDataFunc();
                //console.debug('::processOnChangeItem EnableOnValues ObjectID:%s DstObj:%o FormValue:', ObjectID, DstObj, FormValue);
                for (const EnableValue of OnChangeElement.EnableOnValues) {
                    if (EnableValue == FormValue) {
                        console.debug('::processOnChangeItem enable() DstObj:%o', DstObj);
                        DstObj.enableDOMElement();
                    }
                }
                for (const DisableValue of OnChangeElement.DisableOnValues) {
                    if (DisableValue == FormValue) {
                        console.debug('::processOnChangeItem disable() DstObj:%o', DstObj);
                        DstObj.disableDOMElement();
                    }
                }
            }

            if (OnChangeElement.FireEvents !== undefined) {
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
