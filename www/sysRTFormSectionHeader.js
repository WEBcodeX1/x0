//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "FormSectionHeader"                                        -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormSectionHeader"
//------------------------------------------------------------------------------

function sysFormSectionHeader(ParentObject, Attributes)
{
    this.ChildObjects    = new Array();      //- Child Objects
    this.ParentObject    = ParentObject      //- Parent Object
    this.Attributes      = Attributes        //- Section Attributes
}

sysFormSectionHeader.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysFormSectionHeader.prototype.init = function()
{
    this.ContainerObj = new sysObjDiv();

    ObjDef = [
        {
            "id": "section",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": this.Attributes.Style
            },
            "ObjectDefs": [
                {
                    "id": "card-body",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "card-body pb-0"
                    },
                    "ObjectDefs": [
                        {
                            "id": "head",
                            "SysObject": new sysObjDiv(),
                            "JSONAttributes": {
                                "DOMType": "h3",
                                "Style": "fs-5 mb-1"
                            },
                            "ObjectDefs": [
                                {
                                    "id": "headtxt",
                                    "SysObject": new sysObjSQLText(),
                                    "JSONAttributes": {
                                        "IconStyle": this.Attributes.HeaderIcon,
                                        "TextID": this.Attributes.HeaderTextID
                                    }
                                }
                            ]
                        },
                        {
                            "id": "subhead",
                            "SysObject": new sysObjDiv(),
                            "JSONAttributes": {
                                "DOMType": "p",
                                "Style": "text-body-secondary mb-1"
                            },
                            "ObjectDefs": [
                                {
                                    "id": "subheadtxt",
                                    "SysObject": new sysObjSQLText(),
                                    "JSONAttributes": {
                                        "TextID": this.Attributes.SubHeaderTextID
                                    }
                                }
                            ]
                        }
                    ]
                },
                {
                    "id": "card-body2",
                    "SysObject": this.ContainerObj,
                    "JSONAttributes": {
                        "Style": "card-body mt-n8 pt-0"
                    }
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDef, this);
}
