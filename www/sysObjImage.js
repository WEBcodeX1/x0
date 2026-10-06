//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Image"                                                      -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjDiv"
//------------------------------------------------------------------------------

function sysObjImage()
{
    this.ObjectType             = 'Image';          //- System Object Type
    this.DOMType                = 'img';            //- DOMType
    this.DOMAttributes          = new Object();     //- DOMAttributes

    this.RuntimeGetDataFunc     = this.getValue;    //- Runtime Get Data Function
    this.RuntimeSetDataFunc     = this.setValue;    //- Runtime Set Data Function
    this.SetDataMechanism       = 'Plain';          //- Set Data Mechanism
}

//- inherit sysBaseObject
sysObjImage.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjImage.prototype.init = function()
{
    if (this.JSONConfig !== undefined)
    {
        const Attributes = this.JSONConfig.Attributes;

        //- set image source from value
        if (Attributes.Value !== undefined) {
            this.DOMAttributes['src'] = Attributes.Value;
            this.Value = Attributes.Value;
        }

        //- set image width
        if (Attributes.Width !== undefined) {
            this.DOMAttributes['width'] = Attributes.Width;
        }

        //- set image height
        if (Attributes.Height !== undefined) {
            this.DOMAttributes['height'] = Attributes.Height;
        }

        //- set DOM style
        if (Attributes.Style !== undefined) {
            this.DOMStyle = Attributes.Style;
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "getValue"
//------------------------------------------------------------------------------

sysObjImage.prototype.getValue = function()
{
    return this.Value;
}


//------------------------------------------------------------------------------
//- METHOD "setValue"
//------------------------------------------------------------------------------

sysObjImage.prototype.setValue = function(ImgPath)
{
    this.Value = ImgPath;
    this.DOMAttributes['src'] = ImgPath;
    this.rerenderObject();
}
