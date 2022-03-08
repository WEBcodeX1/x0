//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "FormFieldValidate"                                               -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- FormFieldValidate                                                        -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormFieldValidate"
//------------------------------------------------------------------------------

function sysFormFieldValidate() {

	//- validate regex
	this.ValidateRegex =
	{
		'DefaultString':			'^[a-zA-ZäöüÄÖÜß0-9 \\"\\/\\.\\-\\+:;,=<>_§#&\\$\\!\\?\\(\\)]+$',
		'DefaultAtoZ':				'^[a-zA-Z]+$',
		'DefaultInteger':			'^[0-9]+$',
		'DefaultAtoZPlusNumbers':	'^[a-zA-Z0-9]+$',
		'DefaultAtoZUpper':			'^[A-Z]+$',
		'DefaultDateInternational':	'^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$',
		'DefaultDate':				'^[0-9][0-9]\\.[0-9][0-9]\\.[0-9][0-9][0-9][0-9]$',
		'DefaultDatepicker':		'^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$',
		'ZipCode':					'^[0-9][0-9][0-9][0-9][0-9]$',
		'UserName':					'^[a-zA-Z0-9_]+$',
		'RealName':					'^[a-zA-Z0-9äöüÄÖÜ ]+$',
		'Surename':					'^[a-zA-Z0-9äöüÄÖÜ]+$',
		'UserPass':					'^[a-zA-Z0-9!?_#]+$',
		'UserGroup':				'^[a-zA-Z0-9_]+$',
		'MailAddress':				'^[a-zA-Z0-9\\-\\.]+\@[a-zA-Z0-9\\-\\.]+$',
		'PhoneNrInternational':		'^\\+[0-9][0-9] ?\\([0-9]{2,6}\\) ?[0-9]{4,12}$',
		'PhoneNr':					'^\\([0-9]{2,6}\\) ?[0-9]{4,12}$',
		'PhoneNrArea':				'^[0-9]{2,6}$',
		'PhoneNrSingle':			'^[0-9]{4,12}$',
		'Quantity':					'^[0-9]+$',
		'Country':					'^(DE|EN)$',
		'City':						'^[A-ZÄÖÜ][a-zäöüß]+$',
		'StreetNr':					'^[0-9abc]+$',
		'EuroWithCents':			'^[0-9]+,[0-9][0-9]$',
		'SPXBarcode':				'^[0-9]{20,20}+$',
		'TransparenzDBNummer':		'^vr_[0-9A-Z]+$'
	};

	//- validate functions
	this.ValidateFunc =
	{
		'IPAddress':								this.IPAddress,
		'IPAddressSubnet':							this.IPAddressSubnet,
		'IPPort':									this.IPPort,
	};

	//- validate group functions
	this.ValidateGroupFunc =
	{
		'CheckUniqueSparten':						this.CheckUniqueSparten,
		'ZielgruppeGesamt':							this.ZielgruppeGesamt,
		'CheckDatesPeriodOneYear':					this.CheckDatesPeriodOneYear,
		'CheckDatesStartEnd':						this.CheckDatesStartEnd,
		'CheckDatesStartEndVorzeitig':				this.CheckDatesStartEndVorzeitig,
		'CheckMinMax':								this.CheckMinMax,
		'CheckNull':								this.CheckNull,
		'CheckEmpty':								this.CheckEmpty,
		'CheckProjektPeriod':						this.CheckProjektPeriod,
		'CheckProjektleitungZuwendungsempofaenger':	this.CheckProjektleitungZuwendungsempofaenger
    }

}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.validate = function(ValidateID, Value) {

    console.debug('::validate ValidateID:%s, Value:%s', ValidateID, Value);

    var RegexString = this.ValidateRegex[ValidateID];

	if (RegexString !== undefined && Value !== undefined) {
		var Regex = new RegExp(RegexString, 'g');
		return Value.search(Regex);
	}

	try {
		var ValidateFunc = this.ValidateFunc[ValidateID];

		if (ValidateFunc !== undefined) {
			return ValidateFunc(Value);
		}
	}
	catch(err) {
        console.debug('::validate err:%s', err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "validateGroup"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.validateGroup = function(FunctionID, FormfieldItems, FunctionParams) {
	try {
		var ValidateFunc = this.ValidateGroupFunc[FunctionID];
    	return ValidateFunc(FormfieldItems, FunctionParams);
    }
    catch(err) {
        console.debug('::validateGroup err:%s', err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "IPAddress"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.IPAddress = function(Value) {

	var IPArray = Value.split('.');

	//- check correct octet count
	if (IPArray.length != 4) { return -1; }

	//- first octet should not start with 0
	if (parseInt(IPArray[0]) == 0) { return -1; }

	for (Index in IPArray) {
		IPOctet = IPArray[Index];
		var checkNumber = parseInt(IPOctet);
		if (checkNumber < 0 || checkNumber > 255) { return -1; }
	}

	return true;
}


//------------------------------------------------------------------------------
//- METHOD "IPAddressSubnet"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.IPAddressSubnet = function(Value) {

	var NetArray = Value.split('/');

	//- check correct octet count
	if (NetArray.length != 2) { return -1; }

	//- check correct ip address
	var IPCheck = sysFactory.ObjFormValidate.IPAddress(NetArray[0]);
	if (IPCheck == -1) { return -1; }

	//- check subnet mask
	var MaskBits = parseInt(NetArray[1]);
	if (MaskBits < 1 || MaskBits > 32) { return -1; }

	return true;
}


//------------------------------------------------------------------------------
//- METHOD "IPPort"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.IPPort = function(Value) {

	//- check empty string given
	if (Value.length == 0) { return -1; }

	//- cast/check numerical value
	var Port = parseInt(Value);
	if (Port < 1 || Port > 65535) { return -1; }

	return true;
}


//------------------------------------------------------------------------------
//- METHOD "FormItemGroupNonUnique"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.FormItemGroupNonUnique = function(Items, Params) {

	//console.debug('FormValidate GroupNonUnique Items:%o', Items);
	var UniqueElements = new Object();

	for (ItemID in Items) {
		Item = Items[ItemID];
		UniqueElements[Item.getObjectData()] = 0;
	}

	for (ItemID in Items) {
		Item = Items[ItemID];
		UniqueElements[Item.getObjectData()] += 1;
	}

	var FormFieldsCount = Object.keys(Items).length;
	var UniqueCount = Object.keys(UniqueElements).length;

	//console.debug('FormValidate UniqueElements:%o FormCount:%s UniqueCount:%s', UniqueElements, FormFieldsCount, UniqueCount);

	return (UniqueCount == FormFieldsCount ? true : false);

}


//------------------------------------------------------------------------------
//- METHOD "FormItemGroupUser1"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckUniqueSparten = function(Items, Params) {

	var NewItems = new Array();

	if (Items.ProjektNewSparte1Sonstige.getObjectData().length > 0) {
		NewItems.push(Items.ProjektNewSparte1Sonstige);
	}
	else {
		NewItems.push(Items.ProjektNewSparte1);
	}

	if (Items.ProjektNewSparte2Sonstige.getObjectData().length > 0) {
		NewItems.push(Items.ProjektNewSparte2Sonstige);
	}
	else {
		NewItems.push(Items.ProjektNewSparte2);
	}

	if (Items.ProjektNewSparte3Sonstige.getObjectData().length > 0) {
		NewItems.push(Items.ProjektNewSparte3Sonstige);
	}
	else {
		NewItems.push(Items.ProjektNewSparte3);
	}

	var Items = NewItems;
	//console.debug('FormValidate GroupNonUnique Items:%o', Items);

	var UniqueElements = new Object();

	for (ItemID in Items) {
		Item = Items[ItemID];
		UniqueElements[Item.getObjectData()] = 0;
	}

	for (ItemID in Items) {
		Item = Items[ItemID];
		UniqueElements[Item.getObjectData()] += 1;
	}

	var FormFieldsCount = Object.keys(Items).length;
	var UniqueCount = Object.keys(UniqueElements).length;

	//console.debug('::validate grouped UniqueElements:%o FormCount:%s UniqueCount:%s', UniqueElements, FormFieldsCount, UniqueCount);

	return (UniqueCount == FormFieldsCount ? true : false);

}


//------------------------------------------------------------------------------
//- METHOD "CheckMinMax"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckMinMax = function(Items, Params) {
	var i=0;
	for (Index in Items) { i++; }
	//return (Params.min < i ? false : true);
	return true;
}


//------------------------------------------------------------------------------
//- METHOD "CheckNull"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckNull = function(Items, Params) {
	var i=0;
	for (Index in Items) {
		var Item = Items[Index];
			var ItemData = Item.getObjectData();
			console.debug('::CheckNull Item:%o ItemData:%s', Item, ItemData);
			if (ItemData == '<NULL>') { return false; }
	}
	return true;
}


//------------------------------------------------------------------------------
//- METHOD "CheckEmpty"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckEmpty = function(Items, Params) {
	var i=0;
	for (Index in Items) {
		var Item = Items[Index];
			var ItemData = Item.getObjectData();
			console.debug('::CheckEmpty Item:%o ItemData:%s', Item, ItemData);
			if (ItemData.length == 0) { return false; }
	}
	return true;
}


//------------------------------------------------------------------------------
//- METHOD "ProjektNewZielgruppeGesamt"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.ZielgruppeGesamt = function(Items, Params) {
	var ZielgruppeCount = Items.ProjektNewZielgruppeGesamt.getObjectData();
	console.debug('::validate grouped Ziegruppe Count:%s', ZielgruppeCount);
	return (ZielgruppeCount == 0 ? false : true);
}


//------------------------------------------------------------------------------
//- METHOD "CheckDatesPeriodOneYear"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckDatesPeriodOneYear = function(Items) {
	try {
		var BeginnTag = Items.ProjektNewDauerProjektbeginnTag.getObjectData();
		var BeginnMonat = Items.ProjektNewDauerProjektbeginnMonat.getObjectData();
		var BeginnJahr = Items.ProjektNewDauerProjektbeginnJahr.getObjectData();

		var EndeTag = Items.ProjektNewDauerProjektendeTag.getObjectData();
		var EndeMonat = Items.ProjektNewDauerProjektendeMonat.getObjectData();
		var EndeJahr = Items.ProjektNewDauerProjektendeJahr.getObjectData();

		var DateBeginn = new Date(BeginnMonat+"/"+BeginnTag+"/"+BeginnJahr);
		var DateEnd = new Date(EndeMonat+"/"+EndeTag+"/"+EndeJahr);

		var ZeitspanneTime = DateEnd.getTime()-DateBeginn.getTime();
		var ZeitspanneDays = ZeitspanneTime / (1000*3600*24);
	}
	catch(err) {
		ZeitspanneDays = 1000;
		console.debug('::CheckDatesPeriodOneYear err:%s', err);
	}
	console.debug('::validate grouped CheckDatesPeriodOneYear BT:%s BM:%s MJ:%s ET:%s EM:%s EJ:%s DateBeginn:%s DateEnd:%s Zeitspanne:%s', BeginnTag, BeginnMonat, BeginnJahr, EndeTag, EndeMonat, EndeJahr, DateBeginn, DateEnd, ZeitspanneDays);
	return (ZeitspanneDays > 365 ? false : true);    
}


//------------------------------------------------------------------------------
//- METHOD "CheckDatesStartEnd"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckDatesStartEnd = function(Items) {
	try {
		var BeginnTag = Items.ProjektNewDauerProjektbeginnTag.getObjectData();
		var BeginnMonat = Items.ProjektNewDauerProjektbeginnMonat.getObjectData();
		var BeginnJahr = Items.ProjektNewDauerProjektbeginnJahr.getObjectData();

		var EndeTag = Items.ProjektNewDauerProjektendeTag.getObjectData();
		var EndeMonat = Items.ProjektNewDauerProjektendeMonat.getObjectData();
		var EndeJahr = Items.ProjektNewDauerProjektendeJahr.getObjectData();

		var DateBeginn = new Date(BeginnMonat+"/"+BeginnTag+"/"+BeginnJahr);
		var DateEnd = new Date(EndeMonat+"/"+EndeTag+"/"+EndeJahr);
	}
	catch(err) {
		console.debug('::CheckDatesStartEnd err:%s', err);
		return false;
	}
	console.debug('::validate grouped CheckDatesStartEnd BT:%s BM:%s MJ:%s ET:%s EM:%s EJ:%s DateBeginn:%s DateEnd:%s', BeginnTag, BeginnMonat, BeginnJahr, EndeTag, EndeMonat, EndeJahr, DateBeginn, DateEnd);
	return (DateBeginn.getTime() > DateEnd.getTime() ? false : true);
}


//------------------------------------------------------------------------------
//- METHOD "CheckDatesStartEndVorzeitig"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckDatesStartEndVorzeitig = function(Items) {
	try {
		var BeginnTag = Items.ProjektNewDVorzeitigerMassnahmenbeginnTag.getObjectData();
		var BeginnMonat = Items.ProjektNewDVorzeitigerMassnahmenbeginnMonat.getObjectData();
		var BeginnJahr = Items.ProjektNewDVorzeitigerMassnahmenbeginnJahr.getObjectData();

		var EndeTag = Items.ProjektNewDauerProjektbeginnTag.getObjectData();
		var EndeMonat = Items.ProjektNewDauerProjektbeginnMonat.getObjectData();
		var EndeJahr = Items.ProjektNewDauerProjektbeginnJahr.getObjectData();

		var DateBeginn = new Date(BeginnMonat+"/"+BeginnTag+"/"+BeginnJahr);
		var DateEnd = new Date(EndeMonat+"/"+EndeTag+"/"+EndeJahr);
	}
	catch(err) {
		console.debug('::CheckDatesStartEndVorzeitig err:%s', err);
		return false;
	}
	console.debug('::validate grouped CheckDatesStartEndVorzeitig BT:%s BM:%s MJ:%s ET:%s EM:%s EJ:%s DateBeginn:%s DateEnd:%s', BeginnTag, BeginnMonat, BeginnJahr, EndeTag, EndeMonat, EndeJahr, DateBeginn, DateEnd);
	return (DateBeginn.getTime() > DateEnd.getTime() ? false : true);
}


//------------------------------------------------------------------------------
//- METHOD "CheckProjektPeriod"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckProjektPeriod = function(Items) {
	try {
		var BeginnTag = Items.ProjektNewDauerProjektbeginnTag.getObjectData();
		var BeginnMonat = Items.ProjektNewDauerProjektbeginnMonat.getObjectData();
		var BeginnJahr = Items.ProjektNewDauerProjektbeginnJahr.getObjectData();

		var EndeTag = Items.ProjektNewDauerProjektendeTag.getObjectData();
		var EndeMonat = Items.ProjektNewDauerProjektendeMonat.getObjectData();
		var EndeJahr = Items.ProjektNewDauerProjektendeJahr.getObjectData();

		var DateBeginn = new Date(BeginnMonat+"/"+BeginnTag+"/"+BeginnJahr);
		var DateEnd = new Date(EndeMonat+"/"+EndeTag+"/"+EndeJahr);
		var ZeitspanneTime = DateEnd.getTime()-DateBeginn.getTime();
		var ZeitspanneDays = ZeitspanneTime / (1000*3600*24);
	}
	catch(err) {
		ZeitspanneDays = 10;
		console.debug('::CheckProjektPeriod err:%s', err);
		return false;
	}
	console.debug('::validate grouped CheckProjektPeriod BT:%s BM:%s MJ:%s ET:%s EM:%s EJ:%s DateBeginn:%s DateEnd:%s', BeginnTag, BeginnMonat, BeginnJahr, EndeTag, EndeMonat, EndeJahr, DateBeginn, DateEnd);
	return (ZeitspanneDays > 30 ? true : false);
}


//------------------------------------------------------------------------------
//- METHOD "CheckProjektleitungZuwendungsempofaenger"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckProjektleitungZuwendungsempofaenger = function(Items) {
	const ProjektleitungID = Items.ProjektNewProjektleitungZuwendungsempfängerAuswahlProjektleitung.getObjectData();
	const ZuwendungsempfaengerID = Items.ProjektNewProjektleitungZuwendungsempfängerAuswahlZuwendungsempfänger.getObjectData();
	return (ProjektleitungID != ZuwendungsempfaengerID ? true : false);
}
