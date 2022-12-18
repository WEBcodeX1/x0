//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "sysRequestDataHandler"                                    -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysRequestDataHandler"
//------------------------------------------------------------------------------

function sysRequestDataHandler() {
	this.reset();
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysRequestDataHandler.prototype.reset = function() {
	this.RequestData = new Object();
	this.ServiceData = new Object();
}


//------------------------------------------------------------------------------
//- METHOD "addServiceProperty"
//------------------------------------------------------------------------------

sysRequestDataHandler.prototype.addServiceProperty = function(Key, Value) {
	this.ServiceData[Key] = Value;
}


//------------------------------------------------------------------------------
//- METHOD "add"
//------------------------------------------------------------------------------

sysRequestDataHandler.prototype.add = function(DataObject, Key) {
	this.RequestData[Key] = DataObject;
}


//------------------------------------------------------------------------------
//- METHOD "merge"
//------------------------------------------------------------------------------

sysRequestDataHandler.prototype.merge = function(DataObject) {
	for (DataKey in DataObject) {
		DataItem = DataObject[DataKey];
		this.RequestData[DataKey] = DataItem;
	}
}


//------------------------------------------------------------------------------
//- METHOD "removePrefix"
//------------------------------------------------------------------------------

sysRequestDataHandler.prototype.removePrefix = function(Prefix) {
	for (DataKey in this.RequestData) {
		if (DataKey.includes(Prefix)) {
			const NewKey = DataKey.replace(Prefix, '');
			this.RequestData[NewKey] = this.RequestData[DataKey];
			delete this.RequestData[DataKey];
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "transform"
//------------------------------------------------------------------------------

sysRequestDataHandler.prototype.transform = function(TransformData) {
	for (DataKey in TransformData) {
		const DataValue = TransformData[DataKey];
		for (Key in this.RequestData) {
			if (Key == DataKey) {
				this.RequestData[DataValue] = this.RequestData[Key];
				delete this.RequestData[Key]
				break;
			}
		}
	}
}
