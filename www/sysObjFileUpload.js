//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "FileUpload"                                  -//
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
	this.DOMType				= 'form';
	this.DOMAttributes			= { 'enctype': 'multipart/form-data' };
    this.EventListeners			= new Object();
	this.ChildObjects			= new Array();
	this.FileName				= null;
	this.Status					= null;
	this.RuntimeSetDataFunc		= this.UploadFinished;
}

sysFileUpload.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysFileUpload.prototype.init = function()
{
	var Attributes = this.JSONConfig.Attributes;

	this.DOMStyle = Attributes.Style;
	this.DOMType = 'form';

	//console.log('::init Attributes:%o', Attributes);

	var SQLTextObj = new sysObjSQLText();
	SQLTextObj.ObjectID = 'SQLText';
	SQLTextObj.TextID = Attributes.TextID;
	SQLTextObj.JSONConfig = { "Attributes": { "Style": Attributes.StyleDescription } };
	SQLTextObj.init();
	this.addObject(SQLTextObj);

	var FileSelectButtonHTML = '<input ';
	FileSelectButtonHTML += 'type="file" ';
	FileSelectButtonHTML += 'id="' + this.ObjectID + '_select" ';
	FileSelectButtonHTML += 'name="' + this.ObjectID + '_file">';

	var FileSelectButton = new sysBaseObject();
	FileSelectButton.ObjectID = this.ObjectID + 'FileButton';
	FileSelectButton.DOMStyle = Attributes.StyleSelectButton;
	FileSelectButton.DOMValue = FileSelectButtonHTML;
	this.addObject(FileSelectButton);

	var ProgressContainer = new sysBaseObject();
	ProgressContainer.ObjectID = this.ObjectID + 'Progress';
	ProgressContainer.DOMStyle = Attributes.StyleProgressContainer;
	this.addObject(ProgressContainer);

	var ProgressBar = new sysBaseObject();
	ProgressBar.ObjectID = this.ObjectID + 'ProgressBar';
	ProgressBar.DOMStyle = Attributes.ProgressBarStyle;
	ProgressContainer.addObject(ProgressBar);

	var ProgressPercentage = new sysBaseObject();
	ProgressPercentage.ObjectID = this.ObjectID + 'ProgressPercentage';
	ProgressPercentage.DOMStyle = Attributes.ProgressBarPercentageStyle;
	ProgressContainer.addObject(ProgressPercentage);

	var UploadButton = new sysObjButtonInternal();
	UploadButton.ObjectID = this.ObjectID + 'UploadButton';
	UploadButton.JSONConfig = { "Attributes": {
			"Style": Attributes.StyleUploadButton,
			"TextID": "SYSTEM.UPLOAD.BUTTON",
			"Action": "upload"
		}
	};
	UploadButton.ScreenObject = this.ScreenObject;
	UploadButton.init();

	//- set callback function for upload button
	var EventListenerObj = new Object();
	EventListenerObj['Type'] = 'mousedown';
	EventListenerObj['Element'] = this.startUpload.bind(this);

	UploadButton.EventListeners['UploadButtonCallback'] = EventListenerObj;

	this.addObject(UploadButton);
}


//------------------------------------------------------------------------------
//- METHOD "startUpload"
//------------------------------------------------------------------------------

sysFileUpload.prototype.startUpload = function()
{
	if (this.getObjectData().length > 0) {
		this.FormObject = new FormData(this.getDOMelement());
		this.FormObject.append("SessionID", sysFactory.SysSessionValue);

		this.appendUserData();

		var XHR = new XMLHttpRequest();
		XHR.upload.addEventListener('progress', this.updateProgress.bind(this));
		XHR.upload.addEventListener('load', this.UploadFinished.bind(this));
		XHR.open('POST', this.JSONConfig.Attributes.UploadScript);
		XHR.send(this.FormObject);
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateProgress"
//------------------------------------------------------------------------------

sysFileUpload.prototype.updateProgress = function(progress)
{
	console.debug('::updateProgress progress:%o', progress);
	try {
		this.ProgressPercent = Math.round(progress.loaded * 100 / progress.total);
	}
	catch(err) {
		this.ProgressPercent = 0;
	}
	this.renderProgressBar();
}


//------------------------------------------------------------------------------
//- METHOD "UploadFinished"
//------------------------------------------------------------------------------

sysFileUpload.prototype.UploadFinished = function(progress)
{
	this.Status = 'uploaded';
	this.ProgressPercent = 100;
	this.renderProgressBar();
}


//------------------------------------------------------------------------------
//- METHOD "renderProgressBar"
//------------------------------------------------------------------------------

sysFileUpload.prototype.renderProgressBar = function()
{
	var ProgressBarElement = sysFactory.getObjectByID(this.ObjectID + 'ProgressBar');
	var ProgressPercentageElement = sysFactory.getObjectByID(this.ObjectID + 'ProgressPercentage');
	ProgressBarElement.DOMStyleWidth = this.ProgressPercent + '%'
	ProgressPercentageElement.DOMValue = Math.round(this.ProgressPercent) + '%';
	ProgressPercentageElement.setDOMElementValue();
}


//------------------------------------------------------------------------------
//- METHOD "getObjectData"
//------------------------------------------------------------------------------

sysFileUpload.prototype.getObjectData = function()
{
	const FileUploadElement = this.ObjectID + '_select';
	return document.getElementById(FileUploadElement).value;
}


//------------------------------------------------------------------------------
//- METHOD "appendUserData"
//------------------------------------------------------------------------------

sysFileUpload.prototype.appendUserData = function()
{
	const Attributes = this.JSONConfig.Attributes;

	if (Attributes.UserIDColumn !== undefined) {
		this.FormObject.append("UserID", this.ScreenObject.getDBColumnValue(Attributes.UserIDColumn));
	}
	if (Attributes.FileNr !== undefined) {
		this.FormObject.append("FileNr", Attributes.FileNr);
	}
}
