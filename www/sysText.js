//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2023                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "Text" Class                                                      -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- sysText Object                                                           -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysText"
//------------------------------------------------------------------------------

function sysText()
{
	this.Languages = ['de', 'en'];
	this.XMLRPCResultData = null;
}


//------------------------------------------------------------------------------
//- inherit from sysXMLRPCBaseSyncLoader
//------------------------------------------------------------------------------

sysText.prototype = new sysXMLRPCBaseSyncLoader();


//------------------------------------------------------------------------------
//- METHOD "getTextObjectByID"
//------------------------------------------------------------------------------
sysText.prototype.getTextObjectByID = function(TextID)
{

	var TextObj = new Object();

	var TextString = '';

	if (TextID === undefined) {
		TextID = 'TXT.SYS.OBJECT.DEFAULT.TEXT';
	}

	if (this.XMLRPCResultData[TextID] === undefined) {
		console.log('TextID not found:' + TextID);
	}
	else {
		var TextObj = new Object();
		TextObj['de'] = this.XMLRPCResultData[TextID]['value_de'];
		TextObj['en'] = this.XMLRPCResultData[TextID]['value_en'];
		return TextObj;
	}

}


//------------------------------------------------------------------------------
//- METHOD "getTextBySystemLanguage"
//------------------------------------------------------------------------------
sysText.prototype.getTextBySystemLanguage = function(TextID)
{
	return this.getTextObjectByID(TextID)[sysFactory.EnvUserLanguage];
}

