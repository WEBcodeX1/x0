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
    this.overrideDOMObjectID    = true;                 //- Override setting recursive ObjectID
    this.ObjectID               = this.ID;              //- Set Unique ID

    this.DOMType                = 'input';              //- Set Tag Type
    this.DOMStyle               = 'form-range';         //- Set CSS

    this.DOMAttributes          = { "type": "range" };  //- Form Type
}

sysObjRangeSlider.prototype = new sysBaseObject();

sysObjRangeSlider.prototype.getData = sysFormfieldItem.prototype.FormItemGetValue;
sysObjRangeSlider.prototype.setData = sysFormfieldItem.prototype.FormItemSetValue;


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjRangeSlider.prototype.init = function()
{
    //- set runtime get/set data references
    this.RuntimeGetDataFunc = this.getData;
    this.RuntimeSetDataFunc = this.setData;

    //- get object config
    const Attributes = this.JSONConfig.Attributes;

    if (Attributes !== undefined && Attributes.Min !== undefined) {
        this.DOMAttributes['min'] = Attributes.Min;
    }

    if (Attributes !== undefined && Attributes.Max !== undefined) {
        this.DOMAttributes['max'] = Attributes.Max;
    }
}
