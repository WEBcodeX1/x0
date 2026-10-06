//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "SQLText"                                                  -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjSQLText"
//------------------------------------------------------------------------------

function sysObjSQLText()
{
    this.ObjectType             = 'SQLText';            //- System Object Type
    this.TextID                 = null;                 //- Text ID
    this.EventListeners         = new Object();         //- Event Listeners
    this.ChildObjects           = new Array();          //- Child Objects
    this.IconHTMLPre            = '';                   //- Icon HTML Pre
    this.IconHTMLPost           = '';                   //- Icon HTML Post
}

//- inherit sysBaseObject
sysObjSQLText.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.init = function()
{
    if (this.JSONConfig !== undefined && this.JSONConfig.Attributes !== undefined)
    {
        const Attributes = this.JSONConfig.Attributes;

        if (Attributes.DOMType !== undefined) {
            this.DOMType = Attributes.DOMType;
        }

        const IconStyle = Attributes.IconStyle;

        if (IconStyle !== undefined) {
            this.IconHTMLPre = '<i class="' + IconStyle + '"></i> '
        };

        const IconStylePost = Attributes.IconStylePost;

        if (IconStylePost !== undefined) {
            this.IconHTMLPost = '&nbsp;<i class="' + IconStylePost + '"></i>'
        };

        this.DOMStyle = Attributes.Style;

        if (Attributes.TextID !== undefined) {
            this.TextID = Attributes.TextID;
        }
    }
    this.update();
}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------

sysObjSQLText.prototype.update = function()
{
    try {
        const TextValue = sysFactory.getText(this.TextID);
        this.DOMValue = this.IconHTMLPre + TextValue + this.IconHTMLPost;
    }
    catch(err) {
        this.DOMValue = 'TextNotFoundError'
        console.debug('::init SetText TextID:%s Error:%s', this.TextID, err);
    };
    this.setDOMElementValue();
}
