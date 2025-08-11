//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
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

function sysFormFieldValidate()
{
    //- validate regex
    this.ValidateRegex =
    {
        'DefaultString':              '^[a-zA-ZäöüÄÖÜß0-9 \\"\\/\\.\\-\\+:;,=<>_#&\\$\\!\\?\\(\\)]+$',
        'DefaultAtoZ':                '^[a-zA-Z]+$',
        'DefaultInteger':             '^[1-9][0-9]*$',
        'DefaultAtoZPlusNumbers':     '^[a-zA-Z0-9]+$',
        'DefaultAtoZUpper':           '^[A-Z]+$',
        'ZipCodeGerman':              '^[1-9][0-9][0-9][0-9][0-9]$',
        'UserName':                   '^[a-zA-Z0-9\\_]+$',
        'UserPass':                   '^[a-zA-Z0-9!\\?\\_#]+$',
        'UserGroup':                  '^[a-zA-Z0-9\\_]+$',
        'MailAddress':                '^[a-zA-Z0-9\\-\\.\\_]+\\@[a-zA-Z0-9\\-\\.]+$',
        'PhoneNrInternational':       '^\\+[1-9][0-9]? ?\\([1-9][0-9]{1,6}\\) ?[0-9]{4,12}$',
        'PhoneNrGerman':              '^0[1-9][0-9]{1,6} ?[0-9]{4,12}$',
        'PhoneNrAreaGerman':          '^0[1-9][0-9]{1,6}$',
        'PhoneNrCountryCode':         '^\\+[0-9][0-9]$',
        'Country':                    '^(AF|AL|DZ|AS|AD|AO|AI|AQ|AG|AR|AM|AW|AU|AT|AZ|BS|BH|BD|BB|BY|BE|BZ|BJ|BM|BT|BO|BA|BW|BR|IO|VG|BN|BG|BF|BI|KH|CM|CA|CV|KY|CF|TD|CL|CN|CX|CC|CO|KM|CK|CR|HR|CU|CW|CY|CZ|CD|DK|DJ|DM|DO|TL|EC|EG|SV|GQ|ER|EE|ET|FK|FO|FJ|FI|FR|PF|GA|GM|GE|DE|GH|GI|GR|GL|GD|GU|GT|GG|GN|GW|GY|HT|HN|HK|HU|IS|IN|ID|IR|IQ|IE|IM|IL|IT|CI|JM|JP|JE|JO|KZ|KE|KI|XK|KW|KG|LA|LV|LB|LS|LR|LY|LI|LT|LU|MO|MK|MG|MW|MY|MV|ML|MT|MH|MR|MU|YT|MX|FM|MD|MC|MN|ME|MS|MA|MZ|MM|NA|NR|NP|NL|AN|NC|NZ|NI|NE|NG|NU|KP|MP|NO|OM|PK|PW|PS|PA|PG|PY|PE|PH|PN|PL|PT|PR|QA|CG|RE|RO|RU|RW|BL|SH|KN|LC|MF|PM|VC|WS|SM|ST|SA|SN|RS|SC|SL|SG|SX|SK|SI|SB|SO|ZA|KR|SS|ES|LK|SD|SR|SJ|SZ|SE|CH|SY|TW|TJ|TZ|TH|TG|TK|TO|TT|TN|TR|TM|TC|TV|VI|UG|UA|AE|GB|US|UY|UZ|VU|VA|VE|VN|WF|EH|YE|ZM|ZW)$',
        'StreetNr':                   '^[0-9]+ ?[abcdef]*$',
        'EuroWithCents':              '^[1-9][0-9]+,[0-9][0-9]$',
        'BarcodeZebra':               '^[0-9]{20,20}$'
    };

    //- validate regex aliases
    this.ValidateRegex['Quantity'] = this.ValidateRegex['DefaultInteger'];

    //- validate functions
    this.ValidateFunc =
    {
        'Float':                       this.Float,
        'MinMax':                      this.MinMax,
        'MaxLength':                   this.MaxLength,
        'IPAddress':                   this.IPv4Address,
        'IPv4Address':                 this.IPv4Address,
        'IPv6Address':                 this.IPv6Address,
        'IPAddressSubnet':             this.IPAddressSubnet,
        'IPPort':                      this.IPPort,
        'DNSRecordName':               this.DNSRecordName,
        'DateInternational':           this.DateInternational,
        'DateGerman':                  this.DateGerman
    };
}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.validate = function()
{
    const ValidateID = this.FormObj.JSONConfig.Attributes.ValidateRef;
    const Value = this.FormObj.getObjectData();
    console.debug('::validate FormObj:%s ValidateID:%s ValidateValue:%s', this.FormObj.ObjectID, ValidateID, Value);
    return this.validateByParams(ValidateID, Value, this.FormObj);
}


//------------------------------------------------------------------------------
//- METHOD "validateByParams"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.validateByParams = function(ValidateID, Value, FormObj)
{
    console.debug('::validate ValidateID:%s, Value:%s', ValidateID, Value);

    const RegexString = this.ValidateRegex[ValidateID];

    if (RegexString !== undefined && Value !== undefined) {
        const Regex = new RegExp(RegexString, 'g');
        return (Value.search(Regex) == -1) ? true : false;
    }

    //- system validate
    try {
        if (Value !== undefined) {
            return this.ValidateFunc[ValidateID](Value, FormObj);
        }
    }
    catch(err) {
        console.debug('::validate err:%s', err);
    }

    //- user functons validate
    try {
        if (Value !== undefined) {
            return sysFactory.UserValidate.ValidateFunc[ValidateID](Value, FormObj);
        }
    }
    catch(err) {
        console.debug('::validate err:%s', err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "MinMax"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.MinMax = function(Value, FormObj)
{
    const ErrorMsgMinValue = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.MIN-VALUE');
    const ErrorMsgMaxValue = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.MAX-VALUE');
    const ErrorMsgNotANumber = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.MINMAX-NAN');

    const CheckMinValue = FormObj.JSONConfig.Attributes.Min;
    const CheckMaxValue = FormObj.JSONConfig.Attributes.Max;

    console.debug('::validate checkMin:%s checkMax:%s Value:%s', CheckMinValue, CheckMaxValue, Value);

    if (isNaN(Value)) {
        return {
            "Error": true,
            "Message": ErrorMsgNotANumber
        };
    }

    if (Value < CheckMinValue) {
        return {
            "Error": true,
            "Message": ErrorMsgMinValue + CheckMinValue
        };
    }

    if (Value > CheckMaxValue) {
        return {
            "Error": true,
            "Message": ErrorMsgMaxValue + CheckMaxValue
        };
    }

    return false;
}


//------------------------------------------------------------------------------
//- METHOD "MaxLength"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.MaxLength = function(Value)
{
    const ErrorMsgMinValue = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.MAX-LENGTH');

    return false;
}


//------------------------------------------------------------------------------
//- METHOD "IPv4Address"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.IPv4Address = function(Value)
{
    const ErrorMsgOctetCount = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.IPv4ADDRESS-OCTET');
    const ErrorMsgInteger = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.IPv4ADDRESS-INTEGER');

    const IPArray = Value.split('.');

    console.debug('::validate IPv4Address IPArray:%o Length:%s', IPArray, IPArray.length);

    //- check correct octet count
    if (IPArray.length != 4) {
        return {
            "Error": true,
            "Message": ErrorMsgOctetCount
        };
    }

    for (Index in IPArray) {
        const IPOctet = IPArray[Index];
        const checkNumber = parseInt(IPOctet);
        console.debug('::validate IPv4Address checkNumber:%s', checkNumber);
        if (isNaN(checkNumber) || checkNumber < 1 || checkNumber > 255) {
            return {
                "Error": true,
                "Message": ErrorMsgInteger
            };
        }
    }

    return false;
}


//------------------------------------------------------------------------------
//- METHOD "IPAddressSubnet"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.IPAddressSubnet = function(Value)
{
    const ErrorMsgOctetCount = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.IPv4SUBNET-OCTET');
    const ErrorMsgBitmask = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.IPv4SUBNET-BITMASK');

    const NetArray = Value.split('.');

    //- check correct octet count
    if (NetArray.length != 4) {
        return {
            "Error": true,
            "Message": ErrorMsgOctetCount
        };
    }

    const BitMasks8Bit = [ 128, 192, 224, 240, 248, 252, 254, 255 ];

    var CheckValidBitmasks = new Array();

    for (const i of Array(8).keys()) {
        const TmpArray = new Array();

        TmpArray[0] = BitMasks8Bit[i];
        TmpArray[1] = 0;
        TmpArray[2] = 0;
        TmpArray[3] = 0;

        CheckValidBitmasks.push(TmpArray);
    }

    for (const i of Array(8).keys()) {
        const TmpArray = new Array();

        TmpArray[0] = 0;
        TmpArray[1] = BitMasks8Bit[i];
        TmpArray[2] = 0;
        TmpArray[3] = 0;

        CheckValidBitmasks.push(TmpArray);
    }

    for (const i of Array(8).keys()) {
        const TmpArray = new Array();

        TmpArray[0] = 0;
        TmpArray[1] = 0;
        TmpArray[2] = BitMasks8Bit[i];
        TmpArray[3] = 0;

        CheckValidBitmasks.push(TmpArray);
    }

    for (const i of Array(8).keys()) {
        const TmpArray = new Array();

        TmpArray[0] = 0;
        TmpArray[1] = 0;
        TmpArray[2] = 0;
        TmpArray[3] = BitMasks8Bit[i];;

        CheckValidBitmasks.push(TmpArray);
    }

    //- check subnet mask
    for (Index in CheckValidBitmasks) {
        const CheckArray = CheckValidBitmasks[Index];
        if (
            NetArray[0] == CheckArray[0] &&
            NetArray[1] == CheckArray[1] &&
            NetArray[2] == CheckArray[2] &&
            NetArray[3] == CheckArray[3]
        ) { return false; }
    }

    return {
        "Error": true,
        "Message": ErrorMsgOctetCount
    };
}


//------------------------------------------------------------------------------
//- METHOD "IPPort"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.IPPort = function(Value)
{
    const ErrorMsgPortEmpty = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.IP-PORT-EMPTY');
    const ErrorMsgPortRange = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.IP-PORT-RANGE');

    //- check empty string
    if (Value.length == 0) {
        return {
            "Error": true,
            "Message": ErrorMsgPortEmpty
        };
    }

    //- cast/check numerical value
    var Port = parseInt(Value);
    if (Port < 1 || Port > 65535) {
        return {
            "Error": true,
            "Message": ErrorMsgPortRange
        };
    }

    return false;
}


//------------------------------------------------------------------------------
//- METHOD "IPv6Address"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.IPv6Address = function(Value)
{
    const ErrorMsgQuadNibbleCount = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.IPv6ADDRESS-QUADNIBBLE-COUNT');
    const ErrorMsgQuadNibble = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.IPv4ADDRESS-QUADNIBBLE-SYNTAX');

    const IPArray = Value.split(':');

    //- check correct octet count
    if (IPArray.length != 8) {
        return {
            "Error": true,
            "Message": ErrorMsgQuadNibbleCount
        };
    }

    const checkHex = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f' ];

    for (Index in IPArray) {
        const QuadNibble = IPArray[Index];
        const QuadNibbleChars = QuadNibble.split('');
        for (QnIndex in QuadNibbleChars) {
            const Char = QuadNibbleChars[QnIndex];
            if (!checkHex.includes(Char)) {
                return {
                    "Error": true,
                    "Message": ErrorMsgQuadNibble
                };
            }
        }
    }

    return false;
}


//------------------------------------------------------------------------------
//- METHOD "DNSRecordName"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.DNSRecordName = function(Value)
{
    const ErrorMsgDNSNameLength = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.DNSNAME-LENGTH');
    const ErrorMsgDNSName = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.DNSNAME');

    const RecordNameLength = Value.length;
    console.debug('::validate DNSRecordName length:%s', RecordNameLength);

    if (RecordNameLength == 0 || RecordNameLength > 32) {
        return {
            "Error": true,
            "Message": ErrorMsgDNSNameLength
        };
    }

    const Regex = new RegExp('^[a-z0-9\\.\\-]+$', 'g');
    if (Value.search(Regex) == -1) {
        return {
            "Error": true,
            "Message": ErrorMsgDNSName
        };
    }

    if (Value.startsWith('-') || Value.endsWith('-') || Value.startsWith('.') || Value.endsWith('.')) {
        return {
            "Error": true,
            "Message": ErrorMsgDNSName
        };
    }

    return false;
}


//------------------------------------------------------------------------------
//- METHOD "DateInternational"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.DateInternational = function(Value)
{
    const ErrorMsgDateInternational = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.DATE-INTERNATIONAL-FORMAT');
    const ErrorMsgDateInternationalInvalid = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.DATE-GLOBAL-INVALIDDATE');

    const DateSplit = Value.split('-');

    const DateYear = DateSplit[0];
    const DateMonth = DateSplit[1];
    const DateDay = DateSplit[2];

    DateString = DateYear + '-' + DateMonth + '-' + DateDay;

    const DateObj = new Date(DateString);

    const CheckYear = DateObj.getFullYear();
    const CheckMonth = DateObj.getMonth();
    const CheckDay = DateObj.getDate();

    const DateValid = Date.parse(DateString);

    console.debug('CheckDate Year:%s Month:%s Day:%s CheckYear:%s CheckMonth:%s CheckDay:%s', DateYear, DateMonth, DateDay, CheckYear, CheckMonth, CheckDay);

    if (parseInt(DateYear) != CheckYear || parseInt(DateMonth) != CheckMonth+1 || parseInt(DateDay) != CheckDay) {
        return {
            "Error": true,
            "Message": ErrorMsgDateInternationalInvalid
        };
    }

    if (isNaN(DateValid) || DateYear.length != 4 || DateMonth.length != 2 || DateDay.length != 2) {
        return {
            "Error": true,
            "Message": ErrorMsgDateInternational
        };
    }

    return false;
}


//------------------------------------------------------------------------------
//- METHOD "DateGerman"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.DateGerman = function(Value)
{
    const ErrorMsgDateGerman = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.DATE-GERMAN-FORMAT');
    const ErrorMsgDateGermanInvalid = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.DATE-GLOBAL-INVALIDDATE');

    const DateSplit = Value.split('.');

    const DateYear = DateSplit[2];
    const DateMonth = DateSplit[1];
    const DateDay = DateSplit[0];

    DateString = DateYear + '-' + DateMonth + '-' + DateDay;

    const DateObj = new Date(DateString);

    const CheckYear = DateObj.getFullYear();
    const CheckMonth = DateObj.getMonth();
    const CheckDay = DateObj.getDate();

    const DateValid = Date.parse(DateString);

    console.debug('CheckDate Year:%s Month:%s Day:%s CheckYear:%s CheckMonth:%s CheckDay:%s', DateYear, DateMonth, DateDay, CheckYear, CheckMonth, CheckDay);

    if (parseInt(DateYear) != CheckYear || parseInt(DateMonth) != CheckMonth+1 || parseInt(DateDay) != CheckDay) {
        return {
            "Error": true,
            "Message": ErrorMsgDateGermanInvalid
        };
    }

    if (isNaN(DateObj) || DateYear.length != 4 || DateMonth.length != 2 || DateDay.length != 2) {
        return {
            "Error": true,
            "Message": ErrorMsgDateGerman
        };
    }

    return false;
}


//------------------------------------------------------------------------------
//- METHOD "Float"
//------------------------------------------------------------------------------

sysFormFieldValidate.prototype.Float = function(Value)
{
    const ErrorMsgFloatFormat = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.FLOAT-FORMAT-INCORRECT');

    console.debug('CheckFloat Value:%s', Value);

    if (Value.includes(',') || isNaN(parseFloat(Value)) )  {
        return {
            "Error": true,
            "Message": ErrorMsgFloatFormat
        };
    }

    return false;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysFormFieldValidate"
//------------------------------------------------------------------------------

function sysFormFieldValidateGroup()
{
    this.ValidateFunc =
    {
        'CheckUnique':               this.CheckUnique,
        'CheckNull':                 this.CheckNull,
        'CheckEmpty':                this.CheckEmpty,
        'CheckDatePeriodOneYear':    this.CheckDatePeriodOneYear,
        'CheckItemsOr':              this.CheckItemsOr,
        'CheckItemsMatch':           this.CheckItemsMatch,
        'CheckTableRows':            this.CheckTableRows,
        'MinOneItemNotNull':         this.MinOneItemNotNull,
        'DNSRecordValuePlusType':    this.DNSRecordValuePlusType
    }
}


//------------------------------------------------------------------------------
//- METHOD "validate"
//------------------------------------------------------------------------------

sysFormFieldValidateGroup.prototype.validate = function(FunctionID, FormfieldItems)
{
    try {
        //- reset form style to validated
        for (const FormItem of FormfieldItems) {
            console.debug('::validateGroup FormItem:%o', FormItem);
            FormItem.setValidateStyle(false);
        }

        try {
            const RetValue = this.ValidateFunc[FunctionID](FormfieldItems);
            console.debug('::validateGroup RetValue:%o', RetValue);
        }
        catch(err) {
        }

        try {
            const RetValue = sysFactory.UserValidate.ValidateFunc[FunctionID](FormfieldItems);
            console.debug('::User validateGroup() RetValue:%o', RetValue);
        }
        catch(err) {
        }

        //- on error set all group form fields not validated
        try {
            if (
                (typeof RetValue == 'object' && RetValue['Error'] == true) ||
                (RetValue == true)) {
                for (const FormItem of FormfieldItems) {
                    FormItem.setValidateStyle(true);
                }
            }
        }
        catch(err) {
        }

        return RetValue;
    }
    catch(err) {
        console.debug('::validateGroup err:%s', err);
        return false;
    }
}


//------------------------------------------------------------------------------
//- METHOD "CheckUnique"
//------------------------------------------------------------------------------

sysFormFieldValidateGroup.prototype.CheckUnique = function(Items)
{
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

    return (UniqueCount == FormFieldsCount ? false : true);
}


//------------------------------------------------------------------------------
//- METHOD "CheckNull"
//------------------------------------------------------------------------------

sysFormFieldValidateGroup.prototype.CheckNull = function(Items)
{
    var i=0;
    for (Index in Items) {
        var Item = Items[Index];
        var ItemData = Item.getObjectData();
        console.debug('::CheckNull Item:%o ItemData:%s', Item, ItemData);
        if (ItemData == '<NULL>') { return true; }
    }
    return false;
}


//------------------------------------------------------------------------------
//- METHOD "CheckEmpty"
//------------------------------------------------------------------------------

sysFormFieldValidateGroup.prototype.CheckEmpty = function(Items)
{
    var i=0;
    for (Index in Items) {
        var Item = Items[Index];
        var ItemData = Item.getObjectData();
        console.debug('::CheckEmpty Item:%o ItemData:%s', Item, ItemData);
        if (ItemData.length == 0) { return true; }
    }
    return false;
}


//------------------------------------------------------------------------------
//- METHOD "CheckDatePeriodOneYear"
//------------------------------------------------------------------------------

sysFormFieldValidateGroup.prototype.CheckDatePeriodOneYear = function(Items)
{
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
    return (PeriodDays > 365 ? true : false);
}


//------------------------------------------------------------------------------
//- METHOD "CheckItemsOr"
//------------------------------------------------------------------------------

sysFormFieldValidateGroup.prototype.CheckItemsOr = function(Items)
{
    const ErrorMessage = sysFactory.getText('TXT.SYS.ERROR.FORMVALIDATE.FIELDS-2ITEMS-OR-LENGTH');

    const Item1Value = Items[0].getObjectData();
    const Item2Value = Items[1].getObjectData();

    console.debug('Val1:%s Val2:%s', Item1Value.length, Item2Value.length);

    if (Item1Value.length == 0 && Item2Value.length == 0) {
        return {
            "Error": true,
            "Message": ErrorMessage
        };
    }
    return false;
}


//------------------------------------------------------------------------------
//- METHOD "CheckItemsMatch"
//------------------------------------------------------------------------------

sysFormFieldValidateGroup.prototype.CheckItemsMatch = function(Items)
{
    const Attributes1 = Items[0].JSONConfig.Attributes;
    const Attributes2 = Items[1].JSONConfig.Attributes;

    const Item1Value = Items[0].getObjectData();
    const Item2Value = Items[1].getObjectData();

    console.debug('Val1:%s Val2:%s', Item1Value.length, Item2Value.length);

    if (Item1Value != Item2Value) {
        return true;
    }

    return false;
}


//------------------------------------------------------------------------------
//- METHOD "MinOneItemNotNull"
//------------------------------------------------------------------------------

sysFormFieldValidateGroup.prototype.MinOneItemNotNull = function(Items)
{
    var ItemsNotNull = 0;

    for (Index in Items) {
        Item = Items[Index];
        const ItemValue = Items[Index].getObjectData();
        if (ItemValue.length > 0) {
            ItemsNotNull += 1;
        }
    }

    if (ItemsNotNull == 0) { return true; }

    return false;
}


//------------------------------------------------------------------------------
//- METHOD "CheckTableRows"
//------------------------------------------------------------------------------

sysFormFieldValidateGroup.prototype.CheckTableRows = function(Items)
{
    const TableData = Items[0].getObjectData();

    if (TableData.length == 0) {
        return true;
    }

    return false;
}


//------------------------------------------------------------------------------
//- METHOD "DNSRecordValuePlusType"
//------------------------------------------------------------------------------

sysFormFieldValidateGroup.prototype.DNSRecordValuePlusType = function(Items)
{
    const DNSValueTypeObj = Items[0];
    const DNSValueObj = Items[1];

    const DNSValueType = DNSValueTypeObj.getObjectData();
    const DNSValue = DNSValueObj.getObjectData();

    var ValidateID;

    if (DNSValueType == 'A') { ValidateID = 'IPv4Address'; }
    if (DNSValueType == 'AAAA') { ValidateID = 'IPv6Address'; }
    if (DNSValueType == 'CNAME') { ValidateID = 'DNSRecordName'; }
    if (DNSValueType == 'MX') { ValidateID = 'DNSRecordName'; }
    if (DNSValueType == 'TXT') { return false; }
    if (DNSValueType == 'SRV') { return false; }

    console.debug('::validateGroup ValidateID:%o ValidateValue:', ValidateID, DNSValue);

    return DNSValueObj.ValidateObj.validateByParams(ValidateID, DNSValue);
}
