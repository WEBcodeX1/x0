//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "FileUpload"                                               -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFileUpload"
//------------------------------------------------------------------------------

function sysFileUpload()
{
    this.ObjectType             = 'FileUpload';                             //- System Object Type
    this.overrideDOMObjectID    = true;                                     //- Override setting recursive ObjectID

    this.DOMType                = 'form';                                   //- Div Type
    this.DOMAttributes          = { "enctype": "multipart/form-data" };     //- Set Form Encoding

    this.FileName               = null;                                     //- Reset Filename
    this.Status                 = 'init';                                   //- Set Upload Status

    this.RuntimeGetDataFunc     = this.getD                                 //- Get Data Mechanism

    this.EventListeners         = new Object();                             //- Event Listeners
    this.ChildObjects           = new Array();                              //- Child Objects
}

sysFileUpload.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysFileUpload.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    this.DOMStyle = Attributes.Style;

    let FileSelectButtonHTML = '<input type="file" ';
    FileSelectButtonHTML += 'id="' + this.ObjectID + 'SelectButton" ';
    FileSelectButtonHTML += 'name="' + this.ObjectID + '_file" ';
    FileSelectButtonHTML += 'class="form-control">';

    let StartUploadButton = new sysObjButtonCallback();
    StartUploadButton.overrideDOMObjectID = true;
    StartUploadButton.setCallback(this);

    this.ProgressBarObj = new sysObjProgressBar();

    //- setup recursive object structure
    const ObjDefs = [
        {
            "id": "CtrRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0"
            },
            "ObjectDefs": [
                {
                    "id": "CtrColUpload",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-10 p-2 border border-2 border-right-dotted"
                    },
                    "ObjectDefs": [
                        {
                            "id": "BtnFileSelect",
                            "SysObject": new sysObjDiv(),
                            "JSONAttributes": {
                                "Style": Attributes.StyleSelectButton,
                                "Value": FileSelectButtonHTML
                            }
                        },
                        {
                            "id": this.ObjectID + "BtnStartUpload",
                            "SysObject": StartUploadButton,
                            "JSONAttributes": {
                                "Style": "w-100 btn btn-primary",
                                "FormButton": true,
                                "TextID": "TXT.SYS.FILEUPLOAD.BUTTON"
                            }
                        },
                        {
                            "id": this.ObjectID + "ProgressBar",
                            "SysObject": this.ProgressBarObj,
                            "JSONAttributes": {
                            }
                        }
                    ]
                },
                {
                    "id": this.ObjectID + "CtrColUploadStatus",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-2 p-4 text-center"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "UploadStatus",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
                                "TextID": "TXT.SYS.FILEUPLOAD.STATUS.WAITING",
                                "Style": "h2 text-body",
                                "IconStyle": "fa-solid fa-upload"
                            }
                        }
                    ]
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "processCallback"
//------------------------------------------------------------------------------

sysFileUpload.prototype.processCallback = function(FunctionID, Arguments)
{
    this.startUpload();
}


//------------------------------------------------------------------------------
//- METHOD "startUpload"
//------------------------------------------------------------------------------

sysFileUpload.prototype.startUpload = function()
{
    this.Status = 'uploading';
    const FileName = this.getData();
    const Attributes = this.JSONConfig.Attributes;

    console.debug('::sysFileupload startUpload() FileName:%s this:%o', FileName, this);

    if (FileName.length > 0)
    {
        this.FormObject = new FormData(this.getElement());
        this.FormObject.append("SessionID", sysFactory.SysSessionValue);

        let XHR = new XMLHttpRequest();
        let ThisRef = this;

        XHR.onreadystatechange = function() {
            if (XHR.readyState === 4) {
                console.debug('::FileUpload onReadyStateChange() status:%s', XHR.status);
                ThisRef.Status = (XHR.status === 200) ? 'success' : 'failed';
                ThisRef.updateUploadStatus();
            }
        }

        XHR.upload.addEventListener('progress', this.updateProgress.bind(this));
        XHR.upload.addEventListener('load', this.UploadFinished.bind(this));
        XHR.open('POST', Attributes.UploadScript);
        XHR.send(this.FormObject);
    }
}


//------------------------------------------------------------------------------
//- METHOD "updateUploadStatus"
//------------------------------------------------------------------------------

sysFileUpload.prototype.updateUploadStatus = function()
{
    const UploadStatusCtrObj = sysFactory.getObjectByID(
        this.ObjectID + 'CtrColUploadStatus'
    );

    const UploadStatusObj = sysFactory.getObjectByID(
        this.ObjectID + 'UploadStatus'
    );

    if (this.Status == 'success')
    {

    }
    else if (this.Status == 'failed')
    {

    }
}


//------------------------------------------------------------------------------
//- METHOD "updateProgress"
//------------------------------------------------------------------------------

sysFileUpload.prototype.updateProgress = function(Progress)
{
    this.ProgressBarObj.setData(
        Math.round(Progress.loaded * 100 / Progress.total)
    );
}


//------------------------------------------------------------------------------
//- METHOD "UploadFinished"
//------------------------------------------------------------------------------

sysFileUpload.prototype.UploadFinished = function(progress)
{
    this.Status = 'finished';
    this.ProgressBarObj.setData(100);

    const Attributes = this.JSONConfig.Attributes;

    if (Attributes.FireEvents !== undefined) {
        sysFactory.triggerScreenDataLoad(Attributes.FireEvents);
    }
}


//------------------------------------------------------------------------------
//- METHOD "getData"
//------------------------------------------------------------------------------

sysFileUpload.prototype.getData = function()
{
    const FileUploadElement = this.ObjectID + 'SelectButton';
    return document.getElementById(FileUploadElement).value;
}
