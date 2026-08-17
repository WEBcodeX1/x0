//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ProgressBar"                                              -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjProgressBar"
//------------------------------------------------------------------------------

function sysObjProgressBar()
{
    this.overrideDOMObjectID    = true;             //- Override setting recursive ObjectID
    this.ObjectID               = this.ID;          //- Set Unique ID

    this.DOMStyle               = 'progress';       //- Set CSS

    this.RuntimeGetDataFunc     = this.getData;     //- Get Data Function
    this.RuntimeSetDataFunc     = this.setData;     //- Set Data Function

    this.ChildObjects           = new Array();      //- Child Objects

    this.ProgressPercent        = 0;                //- Progress Default Percentage
}

sysObjProgressBar.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjProgressBar.prototype.init = function()
{
    //- get object config
    const Attributes = this.JSONConfig.Attributes;

    //- define open/close button
    this.ProgressBarObj = new sysBaseObject();
    this.ProgressBarObj.ObjectID = 'ProgressBar';

    //- set default CSS if not provided
    if (Attributes === undefined || Attributes.Style === undefined) {
        this.ProgressBarObj.DOMStyle = 'progress-bar progress-bar-striped progress-bar-animated';
    }
    else {
        this.ProgressBarObj.DOMStyle = 'progress-bar ' + Attributes.Style;
    }

    this.addObject(this.ProgressBarObj);
}


//------------------------------------------------------------------------------
//- METHOD "render"
//------------------------------------------------------------------------------

sysObjProgressBar.prototype.render = function()
{
    try {
        this.ProgressBarObj.DOMStyleWidth = this.ProgressPercent + '%';
        this.ProgressBarObj.setDOMElementStyleAttributes();
        this.ProgressBarObj.DOMValue = Math.round(this.ProgressPercent) + '%';
        this.ProgressBarObj.setDOMElementValue();
    }
    catch(err) {
        console.debug('ProgressBar exception:%o', err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "getData"
//------------------------------------------------------------------------------

sysObjProgressBar.prototype.getData = function()
{
    return this.ProgressPercent;
}


//------------------------------------------------------------------------------
//- METHOD "setData"
//------------------------------------------------------------------------------

sysObjProgressBar.prototype.setData = function(PercentValue)
{
    this.ProgressPercent = PercentValue;
    this.render();
}
