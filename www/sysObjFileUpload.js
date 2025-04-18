//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
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
	this.DOMType				= 'form';
	this.DOMAttributes			= { 'enctype': 'multipart/form-data' };
	this.EventListeners			= new Object();
	this.ChildObjects			= new Array();
	this.FileName				= null;
	this.Status					= null;
	this.RuntimeSetDataFunc		= this.UploadFinished;

	this.overrideDOMObjectID	= true;
}

sysFileUpload.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysFileUpload.prototype.init = function()
{
	const Attributes = this.JSONConfig.Attributes;

	this.DOMStyle = Attributes.Style;

	//console.log('::init Attributes:%o', Attributes);

	var SQLTextObj = new sysObjSQLText();
	SQLTextObj.ObjectID = 'SQLText';
	SQLTextObj.TextID = Attributes.TextID;

	SQLTextObj.JSONConfig = {
		"Attributes": {
			"Style": Attributes.StyleDescription,
			"IconStyle": "fa-solid fa-upload"
		}
	};

	SQLTextObj.init();
	this.addObject(SQLTextObj);

	var FileSelectButtonHTML = '<input ';
	FileSelectButtonHTML += 'type="file" ';
	FileSelectButtonHTML += 'id="' + this.ObjectID + '_select" ';
	FileSelectButtonHTML += 'name="' + this.ObjectID + '_file" ';
	FileSelectButtonHTML += 'class="form-control">';

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
	ProgressBar.DOMStyle = Attributes.StyleProgressBar;
	ProgressContainer.addObject(ProgressBar);

	var ProgressPercentage = new sysBaseObject();
	ProgressPercentage.ObjectID = this.ObjectID + 'ProgressPercentage';
	ProgressPercentage.DOMStyle = Attributes.StyleProgressBarPercentage;
	ProgressContainer.addObject(ProgressPercentage);

	var UploadButton = new sysObjButtonInternal();
	UploadButton.ObjectID = this.ObjectID + 'UploadButton';

	UploadButton.JSONConfig = {
		"Attributes": {
			"FormButton": true,
			"Style": 'w-100 ' + Attributes.StyleUploadButton,
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
	const FileName = this.getObjectData();
	if (FileName.length > 0) {
		this.FormObject = new FormData(this.getDOMelement());
		this.FormObject.append("SessionID", sysFactory.SysSessionValue);

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
	try {
		console.debug('::updateProgress progress:%o', progress);
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

	const Attributes = this.JSONConfig.Attributes;

	if (Attributes.ScreenDataLoad !== undefined) {
		sysFactory.triggerScreenDataLoad(Attributes.ScreenDataLoad);
	}
}


//------------------------------------------------------------------------------
//- METHOD "renderProgressBar"
//------------------------------------------------------------------------------

sysFileUpload.prototype.renderProgressBar = function()
{
	try {
		const ProgressBarElement = sysFactory.getObjectByID(this.ObjectID + 'ProgressBar');
		const ProgressPercentageElement = sysFactory.getObjectByID(this.ObjectID + 'ProgressPercentage');
		ProgressBarElement.DOMStyleWidth = this.ProgressPercent + '%'
		ProgressBarElement.setDOMElementStyleAttributes();
		ProgressPercentageElement.DOMValue = Math.round(this.ProgressPercent) + '%';
		ProgressPercentageElement.setDOMElementValue();
	}
	catch(err) {
		console.debug('FileUpload Progress Bar exception:%o', err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "getObjectData"
//------------------------------------------------------------------------------

sysFileUpload.prototype.getObjectData = function()
{
	const FileUploadElement = this.ObjectID + '_select';
	return document.getElementById(FileUploadElement).value;
}
