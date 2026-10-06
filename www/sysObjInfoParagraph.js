//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "InfoParagraph"                                            -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjInfoParagraph"
//------------------------------------------------------------------------------

function sysObjInfoParagraph()
{
    this.overrideDOMObjectID    = true;             //- Override recursive ObjectID
    this.DOMType                = 'div';            //- DOM Type
    this.ChildObjects           = new Array();      //- Child Objects
}

//- inherit sysBaseObject
sysObjInfoParagraph.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjInfoParagraph.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    this.DOMStyle = (Attributes.Style !== undefined) ? Attributes.Style : 'row m-0 p-3 border border-5 border-info-light rounded border-top-0 border-bottom-0 border-end-0 bg-info bg-opacity-25 shadow';

    //- generate text objects
    let TextObjectDefs = new Array();
    let TextObjectIndex = 1;
    for (const TextConfig of Attributes.Text)
    {
        let TextObj = new sysObjSQLText();
        const TextObjDef = {
            "id": this.ObjectID + 'Text' + TextObjectIndex,
            "SysObject": TextObj,
            "JSONAttributes": {
                "TextID": TextConfig.ID,
                "Style": TextConfig.Style,
                "IconStyle": TextConfig.IconStyle
            }
        }
        TextObjectDefs.push(TextObjDef);
        ++TextObjectIndex;
    }

    //- setup recursive object structure
    const ObjDefs = [
        {
            "id": "ParagraphCol",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-12"
            },
            "ObjectDefs": TextObjectDefs
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}
