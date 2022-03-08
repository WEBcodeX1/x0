//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM Base64 Methods                                                    -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- encode / decode Base64                                                   -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysBase64"
//------------------------------------------------------------------------------

function sysBase64() {

	//- key string
	this.keyStr =	"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef" +
			"ghijklmnopqrstuvwxyz0123456789+/" +
			"=";

	//- reset encoded/decoded strings
	this.encoded = null;
	this.decoded = null;

}


//------------------------------------------------------------------------------
//- METHOD "encode"
//------------------------------------------------------------------------------

sysBase64.prototype.encode = function(string)
{
	this.encoded = '';

	var chr1, chr2, chr3 = '';
	var enc1, enc2, enc3, enc4 = '';

	var i = 0;

	do {

		chr1 = string.charCodeAt(i++);
		chr2 = string.charCodeAt(i++);
		chr3 = string.charCodeAt(i++);

		enc1 = chr1 >> 2;
		enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
		enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
		enc4 = chr3 & 63;

		if (isNaN(chr2)) { enc3 = enc4 = 64;}
		else if (isNaN(chr3)) { enc4 = 64; }

		this.encoded = this.encoded +
		this.keyStr.charAt(enc1) +
		this.keyStr.charAt(enc2) +
		this.keyStr.charAt(enc3) +
		this.keyStr.charAt(enc4);

		chr1 = chr2 = chr3 = '';
		enc1 = enc2 = enc3 = enc4 = '';

	} while (i < string.length);

	return this.encoded;

}
