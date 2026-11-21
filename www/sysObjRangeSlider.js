//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "RangeSlider"                                              -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjRangeSlider"
//------------------------------------------------------------------------------

function sysObjRangeSlider()
{
    this.ObjectType             = 'RangeSlider';            //- System Object Type
    this.overrideDOMObjectID    = true;                     //- Override setting recursive ObjectID

    this.DOMType                = 'input';                  //- Set Tag Type
    this.DOMStyle               = 'form-range';             //- Set CSS

    this.DOMAttributes          = { "type": "range" };      //- Form Type
    this.EventListeners         = new Object();             //- Event Listeners
}

sysObjRangeSlider.prototype = new sysBaseObject();

sysObjRangeSlider.prototype.reset = sysFormfieldItem.prototype.reset;
sysObjRangeSlider.prototype.displayValue = sysFormfieldItem.prototype.displayValue;

sysObjRangeSlider.prototype.RuntimeGetDataFunc = sysFormfieldItem.prototype.getValue;
sysObjRangeSlider.prototype.RuntimeSetDataFunc = sysFormfieldItem.prototype.setValue;


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjRangeSlider.prototype.init = function()
{
    //- get object config
    const Attributes = this.JSONConfig.Attributes;

    if (Attributes !== undefined && Attributes.Min !== undefined) {
        this.DOMAttributes['min'] = Attributes.Min;
    }

    if (Attributes !== undefined && Attributes.Max !== undefined) {
        this.DOMAttributes['max'] = Attributes.Max;
    }

    if (Attributes.Value !== undefined) {
        this.Value = Attributes.Value;
    }
}


//------------------------------------------------------------------------------
//- METHOD "setupOnChangeHandler"
//------------------------------------------------------------------------------

sysObjRangeSlider.prototype.setupOnChangeHandler = function(CallbackRef, ContainerRef)
{
    let EventListenerObj = new Object();
    EventListenerObj['Type'] = 'change';
    EventListenerObj['Element'] = CallbackRef.bind(ContainerRef);
    this.EventListeners['PositionChange'] = EventListenerObj;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjRangeSliderContainer"
//------------------------------------------------------------------------------

function sysObjRangeSliderContainer()
{
    this.ObjectType             = 'RangeSliderContainer';       //- System Object Type
    this.overrideDOMObjectID    = true;                         //- Override setting recursive ObjectID
    this.DOMStyle               = 'row';                        //- Set CSS

    this.RuntimeGetDataFunc     = this.getValue;                //- Runtime Get Data Function
    this.RuntimeSetDataFunc     = this.setValue;                //- Runtime Get Data Function
    this.GetDataMechanism       = 'Plain'                       //- Set Runtime Data Get Non Recursive
    this.SetDataMechanism       = 'Plain'                       //- Set Runtime Data Set Non Recursive

    this.ChildObjects           = new Array();                  //- Child Objects
}

sysObjRangeSliderContainer.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjRangeSliderContainer.prototype.init = function()
{
    //- set processing attributes from config
    let Attributes = this.JSONConfig.Attributes;

    //- define empty attributes (object) when undefined
    if (Attributes === undefined) {
        Attributes = new Object();
    }

    //- set style
    if (Attributes.Style !== undefined) {
        this.DOMStyle = Attributes.Style;
    }

    this.RangeSliderObj = new sysObjRangeSlider();
    this.RangeSliderObj.setupOnChangeHandler(this.updateCallback, this);

    this.DisplayValueObj = new sysFormfieldItemText();
    this.DisplayValueObj.Deactivated = true;

    //- default range slider width
    const RangeSliderColMd = (Attributes.UnitTextID === undefined) ? 'col-md-9' : 'col-md-5';

    let ObjDefs = [];

    const ObjDefsRangeSlider = {
        "id": "CtrColRangeSlider",
        "SysObject": new sysObjDiv(),
        "JSONAttributes": {
            "Style": "col m-0 p-0" + RangeSliderColMd
        },
        "ObjectDefs": [
            {
                "id": this.ObjectID + "Slider",
                "SysObject": this.RangeSliderObj,
                "JSONAttributes": Attributes
            }
        ]
    };

    let ObjDefsDisplayValue = {
        "id": "CtrColDisplayValue",
        "SysObject": new sysObjDiv(),
        "JSONAttributes": {
            "Style": "col col-md-3 m-0 p-0 pe-3"
        },
        "ObjectDefs": [
            {
                "id": this.ObjectID + "DisplayValue",
                "SysObject": this.DisplayValueObj,
                "JSONAttributes": {
                    "Disabled": true,
                    "Style": "form-control",
                    "Value": Attributes.Value
                }
            }
        ]
    };

    if (Attributes.UnitTextID !== undefined)
    {
        const ObjDefsMin = {
            "id": "CtrColMin",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-2 m-0 p-0 ps-4"
            },
            "ObjectDefs": [
                {
                    "id": "MinValue",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Value": Attributes.Min,
                        "Style": "text-primary-emphasis float-start"
                    }
                },
                {
                    "id": this.ObjectID + "MinUnit",
                    "SysObject": new sysObjSQLText(),
                    "JSONAttributes": {
                        "TextID": Attributes.UnitTextID,
                        "Style": "text-primary-emphasis"
                    }
                }
            ]
        };

        const ObjDefsMax = {
            "id": "CtrColMax",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-2 m-0 p-0 ps-4"
            },
            "ObjectDefs": [
                {
                    "id": "MaxValue",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Value": Attributes.Max,
                        "Style": "text-primary-emphasis float-start"
                    }
                },
                {
                    "id": this.ObjectID + "MaxUnit",
                    "SysObject": new sysObjSQLText(),
                    "JSONAttributes": {
                        "TextID": Attributes.UnitTextID,
                        "Style": "text-primary-emphasis"
                    }
                }
            ]
        };

        ObjDefs.push(ObjDefsMin);
        ObjDefs.push(ObjDefsRangeSlider);
        ObjDefs.push(ObjDefsMax);
        ObjDefs.push(ObjDefsDisplayValue);
    }
    else {
        ObjDefs.push(ObjDefsRangeSlider);
        ObjDefs.push(ObjDefsDisplayValue);
    }

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "updateCallback"
//------------------------------------------------------------------------------

sysObjRangeSliderContainer.prototype.updateCallback = function()
{
    const Attributes = this.JSONConfig.Attributes;

    this.DisplayValueObj.RuntimeSetDataFunc(
        this.RangeSliderObj.RuntimeGetDataFunc()
    );

    if (Attributes.AutoUpdateOnChange === true)
    {
        this.RangeSliderObj.RuntimeSetDataFunc(
            this.RangeSliderObj.RuntimeGetDataFunc()
        );
    }
}


//------------------------------------------------------------------------------
//- METHOD "getValue" (overloaded)
//------------------------------------------------------------------------------

sysObjRangeSliderContainer.prototype.getValue = function()
{
    return this.RangeSliderObj.RuntimeGetDataFunc();
}


//------------------------------------------------------------------------------
//- METHOD "setValue" (overloaded)
//------------------------------------------------------------------------------

sysObjRangeSliderContainer.prototype.setValue = function(Data)
{
    this.RangeSliderObj.RuntimeSetDataFunc(Data);
    this.DisplayValueObj.RuntimeSetDataFunc(Data);
}
