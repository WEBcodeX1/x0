//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Div"                                                      -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjDiv"
//------------------------------------------------------------------------------

function sysObjDiv()
{
    this.ObjectType             = 'Div';            //- System Object Type
    this.ChildObjects           = new Array();      //- Child Objects
    this.EventListeners         = new Object();     //- Event Listeners
}

//- inherit sysBaseObject
sysObjDiv.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjDiv.prototype.init = function()
{
    if (this.JSONConfig !== undefined)
    {
        const Attributes = this.JSONConfig.Attributes;

        //- set DOM type if given
        this.DOMType = (Attributes.DOMType === undefined) ? 'div' : Attributes.DOMType;

        //- set DOM value if value in attributes, if not set empty
        this.DOMValue = (Attributes.Value === undefined) ? '' : Attributes.Value;

        //- set DOM style
        this.DOMStyle = Attributes.Style;
    }
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjDivUnique"
//------------------------------------------------------------------------------

function sysObjDivUnique()
{
    this.ObjectType             = 'DivUnique';      //- System Object Type
    this.overrideDOMObjectID    = true;             //- Override recursive ObjectID

    this.ChildObjects           = new Array();      //- Child Objects
    this.EventListeners         = new Object();     //- Event Listeners
}

//- inherit sysObjDiv methods
sysObjDivUnique.prototype = new sysBaseObject();
sysObjDivUnique.prototype.init = sysObjDiv.prototype.init;


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjDivValue"
//------------------------------------------------------------------------------

function sysObjDivValue()
{
    this.ObjectType             = 'DivValue';       //- System Object Type
    this.overrideDOMObjectID    = true;             //- Override recursive ObjectID

    this.RuntimeSetDataFunc     = this.setValue;    //- Set RuntimeData Function
    this.RuntimeGetDataFunc     = this.getValue;    //- Get RuntimeData Function

    this.ChildObjects           = new Array();      //- Child Objects
    this.EventListeners         = new Object();     //- Event Listeners
}

//- inherit sysObjDiv methods
sysObjDivValue.prototype = new sysBaseObject();
sysObjDivValue.prototype.init = sysObjDiv.prototype.init;


//------------------------------------------------------------------------------
//- METHOD "setValue"
//------------------------------------------------------------------------------

sysObjDivValue.prototype.setValue = function(Data)
{
    this.Value = Data;
    this.DOMValue = Data;
    this.setDOMElementValue();
}


//------------------------------------------------------------------------------
//- METHOD "getValue"
//------------------------------------------------------------------------------

sysObjDivValue.prototype.getValue = function()
{
    return this.getDOMValue();
}
