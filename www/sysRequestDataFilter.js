//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "RequestDataFilter"                                                -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "RequestDataFilter"
//------------------------------------------------------------------------------

function RequestDataFilter(Object) {
	this.SrcObject = Object;
}


//------------------------------------------------------------------------------
//- METHOD "process"
//------------------------------------------------------------------------------

RequestDataFilter.prototype.process = function() {

	var DataType = this.SrcObject.JSONConfig.Attributes.FilterRequestDataType;

	/*
	console.log('****** Filter ******');
	console.log(DataType);
	console.log(this.SrcObject);
	*/

	if (DataType !== undefined) {
		this.getLastElement();
		this.attachFilteredData();
		this.removeElements();
	}

}


//------------------------------------------------------------------------------
//- METHOD "getLastElement"
//------------------------------------------------------------------------------

RequestDataFilter.prototype.getLastElement = function() {
	var FoundElement = true;
	var Counter = 1;

	while (FoundElement == true) {
		if (this.SrcObject.PostRequestData.RequestData[Counter] === undefined) {
			FoundElement = false;
			this.LastElement = Counter-1;
		}
		Counter += 1;
	}
}


//------------------------------------------------------------------------------
//- METHOD "removeElements"
//------------------------------------------------------------------------------

RequestDataFilter.prototype.removeElements = function() {
	var Counter = 1;

	while (Counter <= this.LastElement) {
		delete this.SrcObject.PostRequestData.RequestData[Counter];
		Counter += 1;
	}
}


//------------------------------------------------------------------------------
//- METHOD "attachFilteredData"
//------------------------------------------------------------------------------

RequestDataFilter.prototype.attachFilteredData = function() {
	var DataColumn = this.SrcObject.JSONConfig.Attributes.FilterRequestDataColumn;
	var DataRow = this.SrcObject.JSONConfig.Attributes.FilterRequestDataRow;

	var ResultObject = this.SrcObject.PostRequestData.RequestData;

	if (DataRow == 'Last') {
		ResultObject[DataColumn] = ResultObject[this.LastElement][DataColumn];
	}
	else {
		ResultObject[DataColumn] = ResultObject[DataRow][DataColumn];
	}
}
