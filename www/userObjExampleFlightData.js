//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- USER OBJECT "ExampleFlightDetails"                                       -//
//- USER OBJECT "ExampleFlightStatus"                                        -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "userObjExampleFlightDetails"
//------------------------------------------------------------------------------

function userObjExampleFlightDetails()
{
    this.DOMStyle               = 'row m-0 p-0';        //- Bootstrap Row Style
    this.ChildObjects           = new Array();          //- Child Objects
}

userObjExampleFlightDetails.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

userObjExampleFlightDetails.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    let ObjDefs = [
        {
            "id": "ColCtrLeft",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col-md-2 m-0 p-0"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "AirlineIcon",
                    "SysObject": new sysObjImage(),
                    "JSONAttributes": {
                        "Value": "/image/" + Attributes.Value.Icon,
                        "Width": "32px",
                        "Height": "32px"
                    }
                }
            ]
        },
        {
            "id": "ColCtrMid",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col-md-4 m-0 p-0"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "AirlineName",
                    "SysObject": new sysObjDivValue(),
                    "JSONAttributes": {
                        "Style": "input-group",
                        "Value": Attributes.Value.Airline
                    }
                }
            ]
        },
        {
            "id": "ColCtrRight",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col-md-6 m-0 p-0"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "FlightNr",
                    "SysObject": new sysObjDivValue(),
                    "JSONAttributes": {
                        "DOMType": "span",
                        "Style": "badge bg-info",
                        "Value": Attributes.Value.FlightNr
                    }
                },
                {
                    "id": this.ObjectID + "Airport",
                    "SysObject": new sysObjDivValue(),
                    "JSONAttributes": {
                        "DOMType": "span",
                        "Style": "badge text-bg-light border border-dark",
                        "Value": Attributes.Value.Airport
                    }
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "userObjExampleFlightStatus"
//------------------------------------------------------------------------------

function userObjExampleFlightStatus()
{
    this.ChildObjects           = new Array();      //- Child Objects
}

userObjExampleFlightStatus.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

userObjExampleFlightStatus.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;
    const Alert = Attributes.Value.Alert;

    this.DOMStyle = 'row m-0 p-0 align-items-center border border-2 border-opacity-50 rounded-pill border-' + Alert;

    let ObjDefs = [
        {
            "id": "ColCtrCircle",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col-md-1 m-0 p-2"
            },
            "ObjectDefs": [
                {
                    "id": "Circle",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "DOMType": "i",
                        "Style": "fa-solid fa-circle text-" + Alert
                    }
                }
            ]
        },
        {
            "id": "ColCtrStatus",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col-md-5 m-0 p-2"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "StatusType",
                    "SysObject": new sysObjDivValue(),
                    "JSONAttributes": {
                        "Value": Attributes.Value.Type,
                        "Style": "text-opacity-75 text-" + Alert
                    }
                }
            ]
        },
        {
            "id": "ColCtrTime",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col-md-6 m-0 p-2"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "Time",
                    "SysObject": new sysObjDivValue(),
                    "JSONAttributes": {
                        "Value": Attributes.Value.Time,
                        "Style": "text-" + Alert + " fw-bold"
                    }
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}
