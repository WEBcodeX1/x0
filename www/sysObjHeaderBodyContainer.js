//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "HeaderBodyContainer"                                       -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjHeaderBodyContainer"
//------------------------------------------------------------------------------

function sysObjHeaderBodyContainer()
{
    this.overrideDOMObjectID    = true;            //- Override recursive ObjectID
    this.ChildObjects           = new Array();     //- Child Objects
}

//- inherit sysBaseObject
sysObjHeaderBodyContainer.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjHeaderBodyContainer.prototype.init = function()
{
    //- define empty attributes (object) when undefined
    const Attributes = (this.JSONConfig.Attributes !== undefined) ? this.JSONConfig.Attributes : {};

    //- set default values
    const HeaderStyle = (Attributes.HeaderStyle !== undefined) ? Attributes.HeaderStyle : 'row m-0 p-3 border border-4 border-primary-subtle rounded-top border-bottom-0 bg-primary bg-opacity-25';
    const BodyStyle = (Attributes.BodyStyle !== undefined) ? Attributes.BodyStyle : 'row m-0 p-3 border border-4 border-primary-subtle rounded-bottom bg-primary bg-opacity-25';

    //- setup recursive object structure
    const ObjDefs = [
        {
            "id": "HeaderRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": HeaderStyle
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "Header",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-12"
                    }
                }
            ]
        },
        {
            "id": "BodyRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": BodyStyle
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "Content",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-12"
                    }
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}
