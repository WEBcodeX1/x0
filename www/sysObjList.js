//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "List"                                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysListRow"
//------------------------------------------------------------------------------

function sysListRow(ParentObject, RowIndex, RowData)
{
	this.EventListeners			= new Object(); 		//- Event Listeners
	this.ChildObjects			= Array();				//- Child Objects

	this.ParentObject			= ParentObject;			//- Parent Object

	this.Index					= RowIndex;				//- Row Index
	this.Selected				= false;				//- Selected Row

	this.RowData				= RowData;				//- Row Data Array

	this.ColItems				= new Array();			//- Col Item Objects

	this.overrideDOMObjectID	= true;					//- Set ObjectID not recursive

	this.GetDataResult			= null;					//- Reset GetDataResult
	this.GetDataChildObjects	= new Array();			//- GetDataResult Child Objects Array

	this.ObjectID				= 'TR_'+ ParentObject.ObjectID + '_' + RowIndex;
}

sysListRow.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysListRow.prototype.init = function()
{
	var EventListenerObj = new Object();
	EventListenerObj['Type'] = 'mousedown';
	EventListenerObj['Element'] = this.EventListenerRightClick.bind(this);
	this.EventListeners['ContextMenuOpen'] = EventListenerObj;

	var EventListenerObj = new Object();
	EventListenerObj['Type'] = 'mousedown';
	EventListenerObj['Element'] = this.EventListenerSelect.bind(this);
	this.EventListeners['RowSelect'] = EventListenerObj;
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerRightClick"
//------------------------------------------------------------------------------

sysListRow.prototype.EventListenerRightClick = function(Event)
{
	var ContextMenuItems = this.ParentObject.JSONConfig.Attributes.ContextMenuItems;

	//- check for right click on mousedown
	if (Event.button == 2 && ContextMenuItems !== undefined) {

		var ContextMenu = new sysContextMenu();

		ContextMenu.ID 					= 'CtMenu_' + this.ParentObject.ObjectID;
		ContextMenu.ItemConfig 			= ContextMenuItems;
		ContextMenu.ScreenObject 		= this.ParentObject.ScreenObject;
		ContextMenu.ParentObject 		= this;
		ContextMenu.pageX 				= Event.pageX;
		ContextMenu.pageY 				= Event.pageY;

		ContextMenu.RowData 			= this.RowData;
		ContextMenu.RowDataIndex 		= this.Index;

		ContextMenu.RowObject 			= this;

		ContextMenu.init();
	}
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerSelect"
//------------------------------------------------------------------------------

sysListRow.prototype.EventListenerSelect = function(Event)
{
	if (this.ParentObject.RowsSelectable == true && Event.button == 0) {
		var processed = false;
		if (this.Selected == true) {
			this.removeDOMElementStyle('text-bg-secondary');
			this.Selected = false;
			processed = true;
		}
		if (this.Selected == false && processed == false) {
			this.addDOMElementStyle('text-bg-secondary');
			this.Selected = true;
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "addColumns"
//------------------------------------------------------------------------------

sysListRow.prototype.addColumns = function()
{
	const Attributes = this.ParentObject.JSONConfig.Attributes;
	console.log('::addColumns ObjectID:%s Attributes:%o', this.ParentObject.ObjectID, Attributes);

	for (const ColConfigItem of Attributes.Columns) {

		const ColumnKey = ColConfigItem.ID;
		var ColumnItem = new sysBaseObject();
		//const ColumnConfig = Attributes.Columns[ColumnKey];

		//console.log('::addColumns Processing ColumnKey:%s ColumConfig:%o', ColumnKey, ColumnConfig);
		try {
			ColumnItem.ObjectID = ColumnKey + this.Index;

			const ColAttributes = ColConfigItem.Attributes;

			if (ColAttributes !== undefined) {
				var ColumnObj = new sysFactory.SetupClasses[ColAttributes.ObjectType]();

				ColumnObj.ObjectID = 'sysObj_' + this.ParentObject.ObjectID + this.Index;

				ColumnObj.JSONConfig = {
					"Attributes": ColConfigItem.Attributes
				};

				ColumnObj.ScreenObject = this.ParentObject.ScreenObject;
				ColumnObj.ParentObject = this.ParentObject;
				ColumnObj.ParentRow = this;

				ColumnObj.init();
				ColumnItem.addObject(ColumnObj);
			}
			else if(ColConfigItem.IndexGenerator === true) {
				const setValue = this.Index+1;
				ColumnItem.DOMValue = setValue;
				this.ParentObject.Data[this.Index][ColumnKey] = setValue;
				this.RowData[ColumnKey] = setValue;
			}
			else {
				ColumnItem.DOMValue = this.RowData[ColumnKey];
			}
		}
		catch(err) {
			ColumnItem.DOMValue = 'Error';
			console.debug('::addColumns err:%s', err);
		}
		//console.log('::addColumns Push ColItem DOMValue:%o', ColumnItem);

		ColumnItem.VisibleState = ColConfigItem.VisibleState;

		this.ColItems.push(ColumnItem);
	}
}


//------------------------------------------------------------------------------
//- METHOD "genGrid"
//------------------------------------------------------------------------------

sysListRow.prototype.genGrid = function()
{
	var GridGenerator = new sysGridGenerator(this.ColItems);

	GridGenerator.init(
		this.ParentObject.JSONConfig.Attributes.RowStyle,
		this.ParentObject.JSONConfig.Attributes.ColStyle,
		this.ParentObject.JSONConfig.Attributes.RowAfterElements,
		undefined
	);

	const RowItems = GridGenerator.generate();
	console.debug('::genGrid RowItems:%o', RowItems);

	for (const RowItem of RowItems) {
		this.addObject(RowItem);
	}

	this.ParentObject.addObject(this);
}


//------------------------------------------------------------------------------
//- METHOD "getColumnById"
//------------------------------------------------------------------------------

sysListRow.prototype.getColumnById = function(Column)
{
	for (Index in this.ColItems) {
		const ColItem = this.ColItems[Index];
		MatchId = 'Column' + Column + '_' + this.Index;
		//console.debug('MatchId:%s ColObjectID:%s', MatchId, ColItem.ObjectID);
		if (ColItem.ObjectID == MatchId) {
			return ColItem;
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "remove"
//------------------------------------------------------------------------------

sysListRow.prototype.remove = function()
{
	this.ParentObject.removeRow(this.Index);
}


//------------------------------------------------------------------------------
//- METHOD "updateIndex"
//------------------------------------------------------------------------------

sysListRow.prototype.updateIndex = function(UpdateIndex)
{
	this.Index = UpdateIndex;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysList"
//------------------------------------------------------------------------------

function sysList()
{
	this.DisplayRows			= 10;											//- Display Row Count Default

	this.DataURL				= null;											//- getServiceData XMLRPC URL
	this.DataURLParams			= '';											//- getServiceData XMLRPC URL Params

	this.RuntimeGetDataFunc		= this.getRuntimeData;							//- Get Runtime Data
	this.RuntimeSetDataFunc		= this.appendData;								//- Set Runtime Data
	this.RuntimeAppendDataFunc	= this.appendData;								//- Append Runtime Data

	this.PostRequestData		= new sysRequestDataHandler();					//- Request Data Handler

	this.ServiceData			= new Array();									//- Data Array
	this.RowItems				= new Array();									//- Row Objects Array

	this.NavPageIndex			= 0;											//- Selected Page/Navigation Index
	this.UpdateCount			= 0;											//- Update Counter

	this.Columns				= new Array();									//- Comlumns for fast query

	this.ChildObjects			= new Array();									//- Child Objects

	this.PaginationObject		= new sysPagination(this);						//- Pagination Processing

	this.RowsSelectable			= true;											//- Multi Row Selection Default

	this.GetDataResult			= null;											//- Reset GetDataResult
	this.GetDataResultChildren	= new Array();									//- GetDataResult Child Objects Array
}

sysList.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "processSourceObjects"
//------------------------------------------------------------------------------

sysList.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;


//------------------------------------------------------------------------------
//- METHOD "getServiceData"
//------------------------------------------------------------------------------

sysList.prototype.getServiceData = function()
{
	this.resetData();
	this.remove();

	RPC = new sysCallXMLRPC(this.DataURL, this.DataURLParams);
	RPC.Request(this);
}


//------------------------------------------------------------------------------
//- METHOD "callbackXMLRPCAsync"
//------------------------------------------------------------------------------

sysList.prototype.callbackXMLRPCAsync = function()
{
	this.update();
}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------

sysList.prototype.update = function()
{
	this.UpdateCount++;
	this.remove();
	this.setUpdateResult();
	this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysList.prototype.reset = function()
{
	this.resetData();
	this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysList.prototype.init = function()
{
	//console.debug('::List init ObjectID:%s', this.ObjectID);
	const Attributes = this.JSONConfig.Attributes;

	if (Attributes !== undefined && Attributes.RowCount != null) {
		this.DisplayRows = Attributes.RowCount;
	}

	if (Attributes !== undefined && Attributes.RowsSelectable != null) {
		this.RowsSelectable = Attributes.RowsSelectable;
	}

	this.DOMStyle = Attributes.Style;

    this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "setupHeader"
//------------------------------------------------------------------------------

sysList.prototype.setupHeader = function()
{
	const Columns = this.JSONConfig.Attributes.Columns;

	var HeaderRowObj = new sysBaseObject();
	HeaderRowObj.ObjectID = this.ObjectID+'HdrRow';
	HeaderRowObj.DOMStyle = this.JSONConfig.Attributes.HeaderRowStyle;
	AddRootObject = HeaderRowObj;

	this.addObject(HeaderRowObj);

	for (const ColItem of Columns) {

		const ColumnKey = ColItem.ID;
		var ColObj = new sysBaseObject();

		ColObj.ObjectID = this.ObjectID+'Hdr' + ColumnKey;

		if (ColItem.HeaderStyle !== undefined) {
			ColObj.DOMStyle = ColItem.HeaderStyle;
		}

		var ColDisplayObj = new sysObjSQLText();
		ColDisplayObj.ObjectID = ColObj.ObjectID + '_txt';

		ColDisplayObj.JSONConfig = {
			"Attributes": {
				"TextID": ColItem.HeaderTextID,
				"IconStyle": ColItem.HeaderIconStyle
			}
		}

		ColDisplayObj.init();

		ColObj.addObject(ColDisplayObj);
		HeaderRowObj.addObject(ColObj);

		ColObj.VisibleState = ColItem.VisibleState;

		this.Columns.push(ColumnKey);
	}
}


//------------------------------------------------------------------------------
//- METHOD "resetData"
//------------------------------------------------------------------------------

sysList.prototype.resetData = function()
{
	this.ServiceData = [];
	this.NavPageIndex	= 0;
}


//------------------------------------------------------------------------------
//- METHOD "setUpdateResult"
//------------------------------------------------------------------------------

sysList.prototype.setUpdateResult = function()
{
	for (ResultKey in this.XMLRPCResultData) {
		this.ServiceData.push(this.XMLRPCResultData[ResultKey]);
	}

	//console.debug('::setUpdateResult this.ServiceData:%o', this.ServiceData);
}


//------------------------------------------------------------------------------
//- METHOD "checkDouble"
//------------------------------------------------------------------------------

sysList.prototype.checkDouble = function(CheckValue)
{
	for (RowID in this.ServiceData) {
		var RowData = this.ServiceData[RowID];
		if (RowData[this.JSONConfig.Attributes.DoubleCheckColumn] == CheckValue) {
			return false;
		}
	}
	return true;
}


//------------------------------------------------------------------------------
//- METHOD "renderPage"
//------------------------------------------------------------------------------

sysList.prototype.renderPage = function()
{
	console.log('::renderPage Result Data:%o Object:%o UpdateCount:%d', this.ServiceData, this, this.UpdateCount);

	const Attributes = this.JSONConfig.Attributes;

	if (this.UpdateCount > 0) {
		this.remove();
	}

	if (Attributes.DisableHeader === undefined || Attributes.DisableHeader === false) {
		this.setupHeader();
	}

	this.RowItems = [];

	for (RowID in this.ServiceData) {
		var RowData = this.ServiceData[RowID];
		this.addRow(RowData, RowID);
	}

	this.renderRows();

	if (this.UpdateCount > 0) {
		if (Attributes.Navigation !== undefined) {
			this.PaginationObject.update();
		}
		//console.debug('############# renderObject() DOMObjectID:%s DOMParentID:%s ChildObjects:%o', this.DOMObjectID, this.DOMParentID, this.ChildObjects);
		this.renderObject(this.DOMParentID);
	}

	//- register event listeners
	this.processEventListener();

	//- danymically adjust iframe size
	sysFactory.resizeIframe();
}


//------------------------------------------------------------------------------
//- METHOD "addRow"
//------------------------------------------------------------------------------

sysList.prototype.addRow = function(RowData, Index)
{
	var RowObj = new sysListRow(this, Number(Index), RowData);

	RowObj.init();
	RowObj.addColumns();

	this.RowItems.push(RowObj);
}


//------------------------------------------------------------------------------
//- METHOD "removeRow"
//------------------------------------------------------------------------------

sysList.prototype.removeRow = function(Index)
{
	console.debug('Remove Row Index:%s', Index);
	this.RowItems.splice(Index, 1);
	this.ServiceData.splice(Index, 1);
	this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "removeSelectedRows"
//------------------------------------------------------------------------------

sysList.prototype.removeSelectedRows = function()
{
	var RemoveArray = new Array();
	for (const Item of this.RowItems) {
		if (Item.Selected == true) {
			RemoveArray.push(Item.Index);
		}
	}

	for (var i = RemoveArray.length-1; i>=0; i--) {
		console.debug('Remove Row selected Index:%s', RemoveArray[i]);
		this.RowItems.splice(RemoveArray[i], 1);
		this.ServiceData.splice(RemoveArray[i], 1);
	}

	this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "renderRows"
//------------------------------------------------------------------------------

sysList.prototype.renderRows = function()
{
	for (const Item of this.RowItems) {
		Item.genGrid();
	}
}


//------------------------------------------------------------------------------
//- METHOD "getColumnItems"
//------------------------------------------------------------------------------

sysList.prototype.getColumnItems = function(ColumnID)
{
	//console.debug('::getColumnItems ColumnID:%s RowItems:%o', ColumnID, this.RowItems);
	var ReturnItems = new Array();
	for (Index in this.RowItems) {
		const Row = this.RowItems[Index];
		const ColumnObject = Row.ObjectRef[ColumnID];
		//console.debug('::getColumnItems ColumnObject:%o', ColumnObject);
		if (ColumnObject !== undefined) {
			ReturnItems.push(ColumnObject);
		}
	}
	return ReturnItems;
}


//------------------------------------------------------------------------------
//- METHOD "getRowByIndex"
//------------------------------------------------------------------------------

sysList.prototype.getRowByIndex = function(Index)
{
	return this.RowItems[Index];
}


//------------------------------------------------------------------------------
//- METHOD "updateRow"
//------------------------------------------------------------------------------

sysList.prototype.updateRow = function(Index, Data)
{
	console.debug('::updateRow Index:%s Data:%o', Index, Data);
	this.ServiceData[(Index-1)] = Data;
	this.UpdateCount++;
	this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "getObjectData"
//------------------------------------------------------------------------------

sysList.prototype.getRuntimeData = function()
{
	return this.ServiceData;
}


//------------------------------------------------------------------------------
//- METHOD "appendData"
//------------------------------------------------------------------------------

sysList.prototype.appendData = function(DataObj)
{
	console.debug('::appendData Data:%o', DataObj);

	const Attributes = this.JSONConfig.Attributes;

	const ErrorObj = sysFactory.getObjectByID(this.JSONConfig.Attributes.ErrorContainer);
	if (ErrorObj !== undefined) {
		ErrorObj.reset();
	}

	const MaxRows = Attributes.DataMaxRows;
	if (this.ServiceData.length >= MaxRows && ErrorObj !== undefined) {
		ErrorObj.displayError(sysFactory.getText('TXT.SYS.ERROR.TABLE.MAX-ROW-COUNT')) + MaxRows + '.';
		return;
	}

	const DoubleCheckColumn = Attributes.DoubleCheckColumn;
	const DisplayText = sysFactory.getText('TXT.SYS.ERROR.TABLE.DOUBLE-ENTRIES-NOTALLOWED') + DoubleCheckColumn + '.';
	if (DoubleCheckColumn !== undefined) {
		if (this.checkDouble(DataObj[DoubleCheckColumn]) == false) {
			if (ErrorObj !== undefined) {
				ErrorObj.displayError(DisplayText);
			}
			return;
		}
	}

	const ValidateRegex = Attributes.ValidateColumnRegEx;
	if (ValidateRegex !== undefined) {
		for (ColKey in ValidateRegex) {
			const ConfigObj = ValidateRegex[ColKey];
			const Regex = new RegExp(RegexTemplate[ConfigObj.RegexTemplate], 'g');
			const Result = DataObj[ColKey].search(Regex);
			//console.debug('::Regex Result:%s', Result);
			if (Result == -1) {
				ErrorObj.displayError(ConfigObj.ErrorMsg);
				return;
			}
		}
	}

	this.UpdateCount++;
	console.debug('::appendData this.ServiceData:%o', this.ServiceData);

	var AppendRowObj = new Object();

	for (const FormItemID in DataObj) {
		const FormItemValue = DataObj[FormItemID];
		if (this.Columns.includes(FormItemID)) {
			AppendRowObj[FormItemID] = FormItemValue;
		}
	}

	console.debug('::appendData AppendRowObj:%o', AppendRowObj);

	this.ServiceData.push(AppendRowObj);
	this.addRow(AppendRowObj, this.RowItems.length+1);
	this.renderPage();
}
