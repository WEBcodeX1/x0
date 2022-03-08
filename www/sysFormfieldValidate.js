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
		'DefaultString':					'^[a-zA-ZäöüÄÖÜß0-9 \\"\\/\\.\\-\\+:;,=<>_§#&\\$\\!\\?\\(\\)]+$',
		'DefaultAtoZ':						'^[a-zA-Z]+$',
		'DefaultInteger':					'^[0-9]+$',
		'DefaultAtoZPlusNumbers':			'^[a-zA-Z0-9]+$',
		'DefaultAtoZUpper':					'^[A-Z]+$',
		'DefaultDateInternational':			'^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$',
		'DefaultDate':						'^[0-9][0-9]\\.[0-9][0-9]\\.[0-9][0-9][0-9][0-9]$',
		'DefaultDatepicker':				'^[0-9][0-9][0-9][0-9]\\-[0-9][0-9]\\-[0-9][0-9]$',
		'ZipCode':							'^[0-9][0-9][0-9][0-9][0-9]$',
		'UserName':							'^[a-zA-Z0-9_]+$',
		'RealName':							'^[a-zA-Z0-9äöüÄÖÜ ]+$',
		'Surename':							'^[a-zA-Z0-9äöüÄÖÜ]+$',
		'UserPass':							'^[a-zA-Z0-9!?_#]+$',
		'UserGroup':						'^[a-zA-Z0-9_]+$',
		'MailAddress':						'^[a-zA-Z0-9\\-\\.]+\@[a-zA-Z0-9\\-\\.]+$',
		'PhoneNrInternational':				'^\\+[0-9][0-9] ?\\([0-9]{2,6}\\) ?[0-9]{4,12}$',
		'PhoneNr':							'^\\([0-9]{2,6}\\) ?[0-9]{4,12}$',
		'PhoneNrArea':						'^[0-9]{2,6}$',
		'PhoneNrSingle':					'^[0-9]{4,12}$',
		'Quantity':							'^[0-9]+$',
		'Country':							'^(DE|EN)$',
		'City':								'^[A-ZÄÖÜ][a-zäöüß]+$',
		'StreetNr':							'^[0-9][0-9abc]+$',
		'EuroWithCents':					'^[0-9]+,[0-9][0-9]$',
		'SPXBarcode':						'^[0-9]{20,20}+$'
	};

	//- validate functions
	this.ValidateFunc =
	{
		'IPAddress':						this.IPAddress,
		'IPAddressSubnet':					this.IPAddressSubnet,
		'IPPort':							this.IPPort,
	};

	//- validate group functions
	this.ValidateGroupFunc =
	{
		'CheckUnique':						this.CheckUnique,
		'CheckMinMax':						this.CheckMinMax,
		'CheckNull':						this.CheckNull,
		'CheckEmpty':						this.CheckEmpty,
		'CheckDatePeriodOneYear':			this.CheckDatePeriodOneYear,
		'CheckItemsOr':						this.CheckItemsOr,
		'CheckTableRows':					this.CheckTableRows,
		'MinOneItemNotNull':				this.MinOneItemNotNull
    }

}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.validate = function(ValidateID, Value)
{
	console.debug('::validate ValidateID:%s, Value:%s', ValidateID, Value);

	const RegexString = this.ValidateRegex[ValidateID];

	if (RegexString !== undefined && Value !== undefined) {
		const Regex = new RegExp(RegexString, 'g');
		return (Value.search(Regex) == -1) ? false : true;
	}

	try {
		return this.ValidateFunc[ValidateID]();
	}
	catch(err) {
		console.debug('::validate err:%s', err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "validateGroup"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.validateGroup = function(FunctionID, FormfieldItems)
{
	try {
		return this.ValidateGroupFunc[FunctionID](
			FormfieldItems
		);
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
	if (IPArray.length != 4) { return false; }

	//- first octet should not start with 0
	if (parseInt(IPArray[0]) == 0) { return false; }

	for (Index in IPArray) {
		IPOctet = IPArray[Index];
		var checkNumber = parseInt(IPOctet);
		if (checkNumber < 0 || checkNumber > 255) { false; }
	}

	return true;
}


//------------------------------------------------------------------------------
//- METHOD "IPAddressSubnet"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.IPAddressSubnet = function(Value) {

	var NetArray = Value.split('/');

	//- check correct octet count
	if (NetArray.length != 2) { return false; }

	//- check correct ip address
	var IPCheck = sysFactory.ObjFormValidate.IPAddress(NetArray[0]);
	if (IPCheck == -1) { return false; }

	//- check subnet mask
	var MaskBits = parseInt(NetArray[1]);
	if (MaskBits < 1 || MaskBits > 32) { return false; }

	return true;
}


//------------------------------------------------------------------------------
//- METHOD "IPPort"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.IPPort = function(Value) {

	//- check empty string given
	if (Value.length == 0) { return false; }

	//- cast/check numerical value
	var Port = parseInt(Value);
	if (Port < 1 || Port > 65535) { return false; }

	return true;
}


//------------------------------------------------------------------------------
//- METHOD "CheckUnique"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckUnique = function(Items) {

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
//- METHOD "CheckMinMax"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckMinMax = function(Items) {
	var i=0;
	for (Index in Items) { i++; }
	//return (Params.min < i ? false : true);
	return true;
}


//------------------------------------------------------------------------------
//- METHOD "CheckNull"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckNull = function(Items) {
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

sysFormFieldValidate.prototype.CheckEmpty = function(Items) {
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
//- METHOD "CheckDatePeriodOneYear"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckDatePeriodOneYear = function(Items) {
	try {
		const ItemStartDay = Items[0];
		const ItemStartMonth = Items[1];
		const ItemStartYear = Items[2];

		const ItemEndDay = Items[3];
		const ItemEndMonth = Items[4];
		const ItemEndYear = Items[5];

		var BeginDay = ItemStartDay.getObjectData();
		var BeginMonth = ItemStartMonth.getObjectData();
		var BeginYear = ItemStartYear.getObjectData();

		var EndDay = ItemEndDay.getObjectData();
		var EndMonth = ItemEndMonth.getObjectData();
		var EndYear = ItemEndYear.getObjectData();

		var DateBeginn = new Date(BeginMonth+"/"+BeginDay+"/"+BeginYear);
		var DateEnd = new Date(EndMonth+"/"+EndDay+"/"+EndYear);

		var PeriodTime = DateEnd.getTime()-DateBeginn.getTime();
		var PeriodDays = PeriodTime / (1000*3600*24);
	}
	catch(err) {
		PeriodDays = 1000;
		console.debug('::CheckDatePeriodOneYear err:%s', err);
	}
	console.debug('::validate grouped CheckDatePeriodOneYear BT:%s BM:%s MJ:%s ET:%s EM:%s EJ:%s DateBeginn:%s DateEnd:%s Period:%s', BeginDay, BeginMonth, BeginYear, EndDay, EndMonth, EndYear, DateBeginn, DateEnd, PeriodDays);
	return (PeriodDays > 365 ? false : true);    
}


//------------------------------------------------------------------------------
//- METHOD "CheckItemsOr"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckItemsOr = function(Items) {

	var ErrorStatus = false;

	const ErrorText = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.FIELD-OR');
	const ErrorMessage = ErrorText + ' (' + Items[0].ObjectID + ', ' + Items[1].ObjectID + ')';

	const Item1Value = Items[0].ParentObject.getObjectData();
	const Item2Value = Items[1].ParentObject.getObjectData();

	console.debug('Val1:%s Val2:%s', Item1Value.length, Item2Value.length);

	if (Item1Value.length > 0 && Item2Value.length > 0) {
		ErrorStatus = false;
	}
	else if (Item1Value.length == 0 && Item2Value.length == 0) {
		ErrorStatus = false;
	}
	else {
		ErrorStatus = true;
	}

	const ReturnObject = {
		"Error": ErrorStatus,
		"Message": ErrorMessage
	};

	return ReturnObject;
}


//------------------------------------------------------------------------------
//- METHOD "MinOneItemNotNull"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.MinOneItemNotNull = function(Items) {

	var ErrorStatus = false;

	var ErrorMessage = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.MINITEMNOTNULL');

	var ItemsNotNull = 0;

	for (Index in Items) {
		Item = Items[Index];
		const ItemValue = Items[Index].ParentObject.getObjectData();
		if (ItemValue.length > 0) {
			ItemsNotNull += 1;
		}
	}

	if (ItemsNotNull == 0) {

		ErrorStatus = false;
		var ErrorMessageAppend = ' (';

		for (Index in Items) {
			Item = Items[Index];
			ErrorMessageAppend += Items[Index].ObjectID + ', ';
		}

		ErrorMessageAppend = ErrorMessageAppend.replace(/, $/g, '');

		ErrorMessageAppend += ')';
		ErrorMessage += ErrorMessageAppend;
	}

	if (ItemsNotNull > 0) {
		ErrorStatus = true;
	}

	const ReturnObject = {
		"Error": ErrorStatus,
		"Message": ErrorMessage
	};

	return ReturnObject;
}

//------------------------------------------------------------------------------
//- METHOD "CheckTableRows"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.CheckTableRows = function(Items) {

	var ErrorStatus = false;

	const ErrorMessage = sysFactory.getText('TXT.SYS.ERROR.TABLE-NO-ROWS');

	const TableData = Items[0].getObjectData();

	if (TableData.length == 0) {
		ErrorStatus = false;
	}
	else {
		ErrorStatus = true;
	}

	const ReturnObject = {
		"Error": ErrorStatus,
		"Message": ErrorMessage
	};

	return ReturnObject;
}
