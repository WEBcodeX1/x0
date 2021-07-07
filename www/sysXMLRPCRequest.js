//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- XML_RPC_HANDLER                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Synchronous/Asynchronous XRPC Handler                                    -//
//-                                                                          -//
//- RPCType          SYNC | ASYNC                                            -//
//- URL              Request URL                                             -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- Constructor "sysCallXMLRPC"
//------------------------------------------------------------------------------

function sysCallXMLRPC(URL, URLParams = '')
{
	this.RandURLOption		= '?a__=';

	this.RPCType			= 'ASYNC';					//- ASYNC | SYNC

	this.RequestType		= 'POST';					//- POST | GET
	this.RequestCache		= false;					//- Cache Request

	this.HTTPAuthBasic		= false;					//- HTTP Basic Authentication
	this.HTTPAuthBasicUser	= '';						//- HTTP Basic Authentication Username
	this.HTTPAuthBasicPass	= '';						//- HTTP Basic Authentication Password

	this.URL				= URL;						//- URL
	this.URLParams			= URLParams;				//- URL Params
	this.URLRandIndicator	= this.RandURLOption + '1';	//- Random URL Part

	this.PostData			= new Object();				//- Post Request Data Object
}


//------------------------------------------------------------------------------
//- METHOD "setRequestType"
//------------------------------------------------------------------------------

sysCallXMLRPC.prototype.setRequestType = function(Type)
{
	this.RequestType = Type;
}


//------------------------------------------------------------------------------
//- METHOD "setRequestBasicAuth"
//------------------------------------------------------------------------------

sysCallXMLRPC.prototype.setRequestBasicAuth = function(Username, Password)
{
	this.HTTPAuthBasic = true;
	this.HTTPAuthBasicUser = Username;
	this.HTTPAuthBasicPass = Password;
}


//------------------------------------------------------------------------------
//- METHOD "Request"
//------------------------------------------------------------------------------

sysCallXMLRPC.prototype.Request = function(RequestObject)
{
	//console.debug('::sysCallXMLRPC RequestObject RequestObject:', RequestObject);

	if (RequestObject !== undefined &&
		RequestObject.JSONConfig !== undefined &&
		RequestObject.JSONConfig.Attributes !== undefined) {

		var DBPrimaryKeyID = RequestObject.JSONConfig.Attributes.DBPrimaryKeyID;

		//console.debug('::Request DBPrimaryKeyID:%s', DBPrimaryKeyID);

		if (DBPrimaryKeyID != null && DBPrimaryKeyID !== undefined) {
			var DBPrimaryKeyValue = RequestObject.ScreenObject.DBPrimaryKeyValue;
			//console.debug('::Request DBPrimaryKeyValue:%s', DBPrimaryKeyValue);
            if (DBPrimaryKeyValue != null) {
                RequestObject.PostRequestData.add(DBPrimaryKeyValue, 'DBPrimaryKeyValue');
            }
		}
	}

	if (RequestObject !== undefined &&
		RequestObject.PostRequestData !== undefined) {
		this.PostData = RequestObject.PostRequestData;
        //console.log('::Request postRequestData:%o', RequestObject.PostRequestData);
	}

	var HeaderContentType = null;
	var HeaderAccept = null;

	//------------------------------------------------------------------------------
	//- REQUEST
	//------------------------------------------------------------------------------

	if (this.RPCType == 'ASYNC') {

		var request = new XMLHttpRequest();

		//- set callback function
		request.onreadystatechange = function() {

			//- if valid request, evaluate result json object
			if (request.readyState == 4 && request.status == 200) {

				if (this.RequestType == 'GET') {
					console.debug('::sysCallXMLRPC RequestObject ResponseText:%s', request.responseText);
				}

				var ResultData = '';

				if (request.responseText.length > 0) {
					ResultData = JSON.parse(request.responseText);
				}

				if (RequestObject !== undefined) {
					if (RequestObject.MergeResult == true) {
						RequestObject.XMLRPCResultData = sysMergeObjects(ResultData, RequestObject.XMLRPCResultData);
					}
					else {
						RequestObject.XMLRPCResultData = ResultData;
					}
					RequestObject.callbackXMLRPCAsync();
				}
			}
		}

		//------------------------------------------------------------------------------
		//- CACHED REQUEST
		//------------------------------------------------------------------------------

		if (this.RequestCache == false) {
			var RandomNrObject;
			RandomNrObject = new sysRandomNr();
			RandomNrObject.generate(10);
			this.URLRandIndicator = this.RandURLOption + RandomNrObject.number;
		}

		//------------------------------------------------------------------------------
		//- PREPARE REQUEST
		//------------------------------------------------------------------------------

		var RequestURL = '';

		if (this.RequestType == 'GET') {
			RequestURL = this.URL + this.URLRandIndicator;

			if (sysFactory.SysSessionValue != null) {
				RequestURL += '&' + sysFactory.SysSessionID + '=' + sysFactory.SysSessionValue;
			}

			RequestURL += this.URLParams;

			HeaderContentType = 'text/plain; charset=UTF-8';
			HeaderAccept = 'application/json';
		}

		if (this.RequestType == 'POST') {
			RequestURL = this.URL + this.URLRandIndicator;

            //console.log('::sysCallXMLRPC SessionID:%s', sysFactory.SysSessionValue);

            if (sysFactory.SysSessionValue != null) {
				var SessionData = new Object();
				SessionData['ID'] = sysFactory.SysSessionID;
				SessionData['Value'] = sysFactory.SysSessionValue;
				this.PostData['SessionData'] = SessionData;
			}

			HeaderContentType = 'application/json; charset=UTF-8';
			HeaderAccept = 'application/json';
		}

		request.open(this.RequestType, RequestURL);

		request.setRequestHeader('Upgrade-Insecure-Requests', 1);
		request.setRequestHeader('Cache-Control', 'max-age=0');
		request.setRequestHeader('Content-Type', HeaderContentType);
		request.setRequestHeader('Accept', HeaderAccept);


		//------------------------------------------------------------------------------
		//- AUTHENTICATION
		//------------------------------------------------------------------------------

		if (this.HTTPAuthBasic == true) {
			var Base64Object;
			Base64Object = new sysBase64();
			Base64Object.encode( this.HTTPAuthBasicUser + ':' + this.HTTPAuthBasicPass);
			request.setRequestHeader('Authorization', 'Basic ' + Base64Object.encoded);
		}

		//------------------------------------------------------------------------------
		//- SEND REQUEST
		//------------------------------------------------------------------------------

		if (this.RequestType == 'GET') {
			request.send();
		}

		if (this.RequestType == 'POST') {
			request.send(JSON.stringify(this.PostData));
		}
	}

	//------------------------------------------------------------------------------
	//- SYNCHRONOUS REUQEST
	//------------------------------------------------------------------------------

	if (this.RPCType == 'SYNC') {
		console.log('Synchronous XMLRPC Requests are currently deprecated.');
	}
}
