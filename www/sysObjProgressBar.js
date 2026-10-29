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
    this.ObjectType             = 'ProgressBar';                //- System Object Type
    this.overrideDOMObjectID    = true;                         //- Override setting recursive ObjectID

    this.DOMStyle               = 'progress';                   //- Default CSS

    this.RuntimeGetDataFunc     = this.getData;                 //- Get Data Function
    this.RuntimeSetDataFunc     = this.setData;                 //- Set Data Function
    this.SetDataMechanism       = 'Plain';                      //- Set Data Mechanism

    this.DOMAttributes          = { "style": "height: 30px" };  //- Only Way Setting Height
    this.ChildObjects           = new Array();                  //- Child Objects

    this.ProgressPercent        = 0;                            //- Progress Default Percentage
}

sysObjProgressBar.prototype = new sysBaseObject();

sysObjProgressBar.prototype.reset = sysFormfieldItem.prototype.reset;


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjProgressBar.prototype.init = function()
{
    //- get object config
    const Attributes = this.JSONConfig.Attributes;

    //- define progress bar root object
    this.ProgressBarObj = new sysBaseObject();
    this.ProgressBarObj.ObjectID = 'ProgressBar';

    //- set default CSS if not provided
    if (Attributes === undefined || Attributes.Style === undefined) {
        this.ProgressBarObj.DOMStyle = 'progress-bar progress-bar-striped progress-bar-animated';
    }
    else {
        this.ProgressBarObj.DOMStyle = 'progress-bar ' + Attributes.Style;
    }

    //- set progress bar percentage from attributes value
    if (Attributes !== undefined && Attributes.Value !== undefined) {
        this.ProgressPercent = Attributes.Value;
    }

    //- set height
    if (Attributes.Height !== undefined) {
        this.DOMAttributes['style'] = 'height: ' + Attributes.Height;
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
        console.log('ProgressBar exception:%o', err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysObjProgressBar.prototype.reset = function()
{
    this.render();
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


//------------------------------------------------------------------------------
//- METHOD "displayValue"
//------------------------------------------------------------------------------

sysObjProgressBar.prototype.displayValue = function()
{
    this.render();
}
