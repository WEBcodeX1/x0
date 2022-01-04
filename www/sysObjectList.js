//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
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

function sysListRow(ConfigObject)
{
	this.ScreenObject		= null;
	this.SourceObject		= null;

	this.ContextMenuItems	= null;

	this.Index				= 0;

	this.SetupData			= null;

	this.ColItems			= new Array();
	this.ChildObjects		= new Array();

	this.ObjectRef			= new Object();
	this.FormItems			= new Array();
}

sysListRow.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "EventListenerRightClick"
//------------------------------------------------------------------------------

sysListRow.prototype.EventListenerRightClick = function(Event)
{
	var ContextMenuItems = this.SourceObject.JSONConfig.Attributes.ContextMenuItems;

	//- check for right click on mousedown
	if (Event.button == 2 && ContextMenuItems !== undefined) {

		var ContextMenu = new sysContextMenu();

		ContextMenu.ID 					= this.SourceObject.ObjectID;
		ContextMenu.ItemConfig 			= this.ContextMenuItems;
		ContextMenu.ScreenObject 		= this.ScreenObject;
		ContextMenu.SourceObject 		= this.SourceObject;
		ContextMenu.pageX 				= Event.pageX;
		ContextMenu.pageY 				= Event.pageY;

		ContextMenu.RowData 			= this.SetupData;
		ContextMenu.RowDataIndex 		= this.Index;

		ContextMenu.RowObject 			= this;

		ContextMenu.init();
	}
}


//------------------------------------------------------------------------------
//- METHOD "addColumns"
//------------------------------------------------------------------------------

/*

	:: REFACTORING

	- complete dynamic column objects need refactoring/cleanup
	  (objects should be addable in a generic way) / serialization

	- links/button logic must be handled in single class

*/

sysListRow.prototype.addColumns = function()
{
	//console.debug('::addColumns this.SetupData:%o', this.SetupData);

	var Attributes;

	try {
		Attributes = this.SourceObject.JSONConfig.Attributes;
	}
	catch(err) {
		Attributes = {};
	}

	//console.debug('::addColumns ObjectID:%s Attributes:%o', this.SourceObject.ObjectID, Attributes);

	var Columns = (this.DynamicRow === true) ? Attributes.AddRowColumns : Attributes.Columns;

	for (ColumnKey in Columns) {

		var ColumnItem = new sysBaseObject();
		ColumnConfig = Columns[ColumnKey];

		if (this.DynamicRow === true && ColumnConfig.RefID !== undefined) {
			ColumnConfig = Attributes.Columns[ColumnKey];
		}

		//console.log('::addColumns Processing ColumnKey:%s ColumConfig:%o', ColumnKey, ColumnConfig);

		if (ColumnConfig.visible != false && ColumnConfig.DBPrimaryKey != true) {

			ColumnItem.ObjectID = 'Column' + ColumnKey + '_' + this.Index;

			try {

				var DisplayColumn = true;

				if (ColumnConfig.Attributes !== undefined && ColumnConfig.Attributes.DependsOn !== undefined) {
					DisplayColumn = false;
					const DependsOn = ColumnConfig.Attributes.DependsOn;
					if (DependsOn.Column !== undefined) {
						var ColumnValue = Number(parseInt(this.SetupData[DependsOn.Column]));
						//console.debug('Check Column:%s Value:%s DependsOnValue:%s', ColumnKey, ColumnValue, DependsOn.Value);
						if (DependsOn.Operator == '>') {
							if (ColumnValue > DependsOn.Value) {
								DisplayColumn = true
							}
						}
						if (DependsOn.Operator == '<') {
							if (ColumnValue < DependsOn.Value) {
								DisplayColumn = true
							}
						}
						if (DependsOn.Operator == '==') {
							if (ColumnValue == DependsOn.Value) {
								DisplayColumn = true
							}
						}
					}
				}

				//console.log('::addColumns Column Attributes:%o', ColumnItem.Attributes);
				if (ColumnConfig.Attributes !== undefined && ColumnConfig.Attributes.Action == 'ExternalLink') {

					/*
					 * ::Refactoring
					 * merge with sysObjLinkExternal
					*/

					var LinkContent = ColumnConfig.Attributes.LinkURL;
					var LinkDisplay = ColumnConfig.Attributes.LinkDisplay;
					const LinkPrefix = ColumnConfig.Attributes.LinkPrefix
					const LinkPrefixDisplay = (LinkPrefix === undefined) ? '' : LinkPrefix;
					const ReplaceValues = ColumnConfig.Attributes.ReplaceValues;
					for (Index in ReplaceValues) {
						const ReplaceItem = ReplaceValues[Index];
						const ReplaceVar = ReplaceItem.ReplaceVar;
						const ReplaceColumn = ReplaceItem.ReplaceColumn;
						const ReplaceGlobalRow = ReplaceItem.ReplaceGlobalRow;
						const ReplaceValue = (ReplaceGlobalRow !== undefined) ? this.SourceObject.ScreenObject.getDBColumnValue(ReplaceGlobalRow) : this.SetupData[ReplaceColumn];
						LinkContent = LinkContent.replace(ReplaceVar, ReplaceValue);
						LinkDisplay = LinkDisplay.replace(ReplaceVar, ReplaceValue);
					}

					LinkContent = LinkContent.replace('%session_id', sysFactory.SysSessionValue);
					if (DisplayColumn === true) {
						if (LinkDisplay === undefined || LinkDisplay == 'undefined') { LinkDisplay = ''; }
						ColumnItem.DOMValue = LinkPrefixDisplay+'<a href="'+LinkContent+'" target="_blank" rel="noopener noreferrer">'+LinkDisplay+'</a>';
					}
				}
				else if (ColumnConfig.Attributes !== undefined && ( ColumnConfig.Attributes.ObjectType == 'ButtonInternal' || ColumnConfig.Attributes.ObjectType == 'Button' )) {
					if (DisplayColumn === true) {

						var Button;

						if (ColumnConfig.Attributes.ObjectType == 'ButtonInternal') {
							Button = new sysObjButtonInternal();
						}

						if (ColumnConfig.Attributes.ObjectType == 'Button') {
							Button = new sysObjButton();
						}

						Button.ObjectID = ColumnItem.ObjectID + 'Button';
						Button.JSONConfig = { "Attributes": ColumnConfig.Attributes.ButtonAttributes };
						Button.ScreenObject = this.SourceObject.ScreenObject;
						Button.SourceObject = this.SourceObject;
						//Button.DBPrimaryKeyValue = this.DBPrimaryKeyValue;
						Button.ParentRow = this;
						Button.init();

						// -> BEGIN: change
						ColumnItem.addObject(Button);
						//ColumnItem = Button;
						// -> END: change
					}
				}
				else if (ColumnConfig.Attributes !== undefined && ColumnConfig.Attributes.ObjectType == 'FileUpload') {
					var FileUpload = new sysFileUpload();
					FileUpload.ObjectID = ColumnItem.ObjectID + 'FileUpload';
					FileUpload.JSONConfig = { "Attributes": ColumnConfig.Attributes.UploadAttributes };
					FileUpload.ScreenObject = this.SourceObject.ScreenObject;
					FileUpload.init();

					// -> BEGIN: change
					ColumnItem.addObject(FileUpload);
					//ColumnItem = FileUpload;
					// -> END: change

					this.ObjectRef[ColumnKey] = FileUpload;
				}
				else if (ColumnConfig.Attributes !== undefined && ColumnConfig.Attributes.ObjectType == 'Formfield') {

					var FormItem = new sysFormFieldItem();
					FormItem.JSONConfig = { "Attributes": ColumnConfig.Attributes.FormfieldAttributes };

					FormItem.ObjectID = this.SourceObject.ObjectID + ColumnItem.ObjectID + 'Formfield';
					//FormItem.ObjectType = FormItem.JSONConfig.Attributes.Type;
					FormItem.ObjectType = 'FormField';
					FormItem.TableColumn = ColumnKey;
					FormItem.ScreenObject = this.SourceObject.ScreenObject;
					FormItem.ParentObject = ColumnItem;
					FormItem.Index = 1;
					FormItem.JSONConfig.Attributes.Value = this.SetupData[ColumnKey];
					FormItem.init();

					//- workaround, should be generic for all types
					if (ColumnConfig.disabled === true) { FormItem.Disabled = true; }

					FormItem.generateHTML();

					const FormulaRefObjects = this.SourceObject.RealtimeEventListeners[ColumnKey];
					//console.debug('::FormulaRefObjects:%o', FormulaRefObjects);
					if (FormulaRefObjects !== undefined) {
						for (Index in FormulaRefObjects) {
							FormItem.setupEventListenerFormula(FormulaRefObjects[Index]);
						}
					}

					ColumnItem = FormItem;
					//ColumnItem.addObject(FormItem);

					this.ObjectRef[ColumnKey] = FormItem;
					this.FormItems.push(FormItem);
				}
				else {
					ColumnItem.DOMValue = this.SetupData[ColumnKey];
				}
			}
			catch(err) {
				ColumnItem.DOMValue = 'Error';
				console.debug('::addColumns err:%s', err);
			}
			//console.log('::addColumns Push ColItem DOMValue:%o', ColumnItem);
			this.ColItems.push(ColumnItem);
		}
	}
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
//- METHOD "updateRemovedRowEventListeners"
//------------------------------------------------------------------------------

sysListRow.prototype.updateRemovedRowEventListeners = function()
{
	var FormItems = new Array();
	for (ItemKey in this.FormItems) {
		FormItem = this.FormItems[ItemKey];
		if (Object.keys(FormItem.EventListeners).length > 0) {
			FormItem.setValue(0);
			FormItems.push(FormItem);
		}
	}
	return FormItems;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysList"
//------------------------------------------------------------------------------

function sysList()
{
	this.PrimaryKeyColumn		= null;									//- Primary Key Column

	this.DisplayRows			= 10;									//- Display Row Count

	this.Navigation				= true;									//- Navigation active|inactive
	this.NavigationPosition		= 0										//- Navigation Position

	this.DataURL				= null;									//- getData XMLRPC URL
	this.DataURLParams			= '';									//- getData XMLRPC URL Params

	this.RuntimeGetDataFunc		= this.getObjectData					//- Get Runtime Data

	this.PostRequestData		= new sysRequestDataHandler();			//- Request Data Handler

	this.Data					= new Array();							//- Data Array
	this.RowItems				= new Array();							//- Row Objects
	this.RowItemsStyleClasses	= new Array();							//- Row Objects added Style Classes

	this.RowItemIndex			= 0;									//- Row Item Index
	this.NavPageIndex			= 0;									//- Selected Page/Navigation Index
	this.UpdateCount			= 0;									//- Update Counter

	this.ChildObjects			= new Array();							//- Child Objects

	this.ElementStyles			= this.ElementsEnclosedByGenerator();	//- CellEnclosedBy Generator

	this.RealtimeEventListeners = new Object();							//- Realtime Event Listeners
	this.ColumnGenerators 		= new Object();							//- Column Generators Object
	
	this.doValidate				= true;									//- Default Validate

}

//- inherit sysBaseObject
sysList.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "processSourceObjects"
//------------------------------------------------------------------------------

sysList.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;


//------------------------------------------------------------------------------
//- METHOD "setRealtimeEventListener"
//------------------------------------------------------------------------------

sysList.prototype.setRealtimeEventListener = function(ColumnID, RefObject)
{
	if (this.RealtimeEventListeners[ColumnID] === undefined) {
		this.RealtimeEventListeners[ColumnID] = new Array();
	}
	this.RealtimeEventListeners[ColumnID].push(RefObject);
}


//------------------------------------------------------------------------------
//- METHOD "appendData"
//------------------------------------------------------------------------------

sysList.prototype.appendData = function(DataObj)
{
	console.debug('::appendData Data:%o', DataObj);
	/*
	const RegexTemplate = {
		'link': '^https?:\\/\\/([\w\d\\-]+\\.)+\w{2,}(\\/.+)?$'
	};
	*/

	const RegexTemplate = {
		'link': '^(http|https):\\/\\/.+$'
	};

	const ErrorObj = sysFactory.getObjectByID(this.JSONConfig.Attributes.ErrorContainer);
	if (ErrorObj !== undefined) {
		ErrorObj.reset();
	}

	const MaxRows = this.JSONConfig.Attributes.DataMaxRows;
    if (this.Data.length >= MaxRows && ErrorObj !== undefined) {
		ErrorObj.displayError('Maximalanzahl Zeilen von ' + MaxRows + ' erlaubt');
		return;
	}

	const DoubleCheckColumn = this.JSONConfig.Attributes.DoubleCheckColumn;
	if (DoubleCheckColumn !== undefined) {
		if (this.checkDouble(DataObj[DoubleCheckColumn]) == false) {
			if (ErrorObj !== undefined) {
				ErrorObj.displayError('Doppelte Einträge sind nicht erlaubt');
			}
			return;
		}
	}

	const ValidateRegex = this.JSONConfig.Attributes.ValidateColumnRegEx;
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
	//console.debug('::appendData this.Data:%o', this.Data);

	this.Data.push(DataObj);

	this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "removeData"
//------------------------------------------------------------------------------

sysList.prototype.removeData = function(Position)
{
	//console.debug('::removeData at Position:%s Data:%o RowItems:%o', Position, this.Data, this.RowItems);

	const ErrorObj = sysFactory.getObjectByID(this.JSONConfig.Attributes.ErrorContainer);
	if (ErrorObj !== undefined) {
		ErrorObj.reset();
	}

	//console.log('######## CHILD OBJECTS:%o', this.ChildObjects);

	const RowObject = this.RowItems[Position];

	if (RowObject !== undefined) {
		const UpdateFormItems = RowObject.updateRemovedRowEventListeners();

		this.Data.splice(Position, 1);
		this.RowItems.splice(Position, 1);

		for (Index in UpdateFormItems) {
			const FormItem = UpdateFormItems[Index];
			FormItem.updateEventListenerFormula(1);
		}
	}

	this.UpdateCount++;
	
	this.updateDynamicRowNumbering();

	this.renderPage();

}


//------------------------------------------------------------------------------
//- METHOD "updateDynamicRowNumbering"
//------------------------------------------------------------------------------

sysList.prototype.updateDynamicRowNumbering = function()
{
	const Columns = this.JSONConfig.Attributes.AddRowColumns;

	for (DataIndex in this.Data) {

		const DataRow = this.Data[DataIndex];
		for (ColumnKey in Columns) {
			if (Columns[ColumnKey].Generator !== undefined) {
				try {
					const SetValue = Columns[ColumnKey].Generator.Prefix + (Number(DataIndex)+1) + Columns[ColumnKey].Generator.Postfix;
					this.Data[DataIndex][ColumnKey] = SetValue;
				}
				catch(err) {
					console.debug('::updateDynamicRowNumbering err:%s', err);
				}
			}
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "checkColumnValue"
//------------------------------------------------------------------------------

sysList.prototype.checkColumnValueSetStyle = function(Config)
{
	//- set column value in this.Data
	for (Index in this.Data) {
		var Row = this.Data[Index];
		try {
			const RowColValue = Row[Config.DstObjectColumn];
			if (RowColValue == Config.FormfieldValue) {
				Row[Config.SetValueColumn] = Config.SetValue;
				this.RowItemsStyleClasses[Index] = Config.AddRowStyle;
			}
		}
		catch(err) {
			console.debug('::checkColumnValueSetStyle err:%s', err);
		}
	}

	//- set runtime row style
	for (RowIndex in this.RowItems) {
		const Row = this.RowItems[RowIndex];
		//console.debug('RowObject:%o', Row);
		const ColObject = Row.getColumnById(Config.DstObjectColumn);
		const ColObjectValue = ColObject.getDOMValue();
		//console.debug('ColObject:%o ColObjectValue:%s CheckValue:%s', ColObject, ColObjectValue, Config.FormfieldValue);
		if (ColObjectValue == Config.FormfieldValue) {
			Row.addDOMElementStyleSysObject(Config.AddRowStyle);
		}
	}

}


//------------------------------------------------------------------------------
//- METHOD "removeMultiData"
//------------------------------------------------------------------------------

sysList.prototype.removeMultiData = function(IndexArray)
{

}


//------------------------------------------------------------------------------
//- METHOD "getData"
//------------------------------------------------------------------------------

sysList.prototype.getData = function()
{
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
	this.resetData();
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
	var Attributes = this.JSONConfig.Attributes;

	if (Attributes.RowCount != null && Attributes !== undefined) {
		this.DisplayRows = Attributes.RowCount;
	}

	//----------------------------------------------------------------------
	//- add style generators
	//----------------------------------------------------------------------

	this.RowObjects = this.RowObjectGenerator(Attributes.RowAfterElements);


	//----------------------------------------------------------------------
	//- set root object attributes
	//----------------------------------------------------------------------

	this.DOMStyle = Attributes.Style;
	this.DOMStyles = Attributes.AdditionalStyles;

    this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "RowObjectGenerator"
//------------------------------------------------------------------------------

sysList.prototype.RowObjectGenerator = function*(CfgRowAfterElements)
{

	/*
	 * :: refactoring
	 * 
	 * row object generation should be "once" not "twice" (procedure)
	*/

	if (CfgRowAfterElements === undefined) {
		while(true) {
			yield null;
		}
	}
	else {
		var RowCounter = 0;

		var RowObject = new sysBaseObject();
		RowObject.ObjectID = this.ObjectID + '_Row' + RowCounter;
		RowObject.DOMStyle = this.JSONConfig.Attributes.CellGroupRowStyle;
		RowObject.EventListeners = new Object();

		const RowItem = this.RowItems[this.RowItemIndex];

		var EventListenerObj = new Object();
		EventListenerObj['Type'] = 'mousedown';
		EventListenerObj['Element'] = RowItem.EventListenerRightClick.bind(RowItem);

		RowObject.EventListeners["ContextMenuOpen"] = EventListenerObj;

		this.RowParentObject.addObject(RowObject);
		this.ElementParentObject = RowObject;

		const RowAfterElements = (Array.isArray(CfgRowAfterElements)) ? CfgRowAfterElements : [ CfgRowAfterElements ];
		const RowAfterElementsGen = this.RowAfterElementsGenerator(RowAfterElements);

		var RowAfterElementCount = RowAfterElementsGen.next().value;

		var Step = 0;
		RowCounter = 1;

		//console.debug('::RowObjectGenerator RowAfterElements:%o RowAfterElementCount:%s', RowAfterElements, RowAfterElementCount);

		while(true) {

			if (Step >= RowAfterElementCount) {

				var RowObject = new sysBaseObject();
				RowObject.ObjectID = this.ObjectID + '_Row' + RowCounter;
				RowObject.DOMStyle = this.JSONConfig.Attributes.CellGroupRowStyle;
				RowObject.EventListeners = new Object();

				const RowItem = this.RowItems[this.RowItemIndex];

				var EventListenerObj = new Object();
				EventListenerObj['Type'] = 'mousedown';
				EventListenerObj['Element'] = RowItem.EventListenerRightClick.bind(RowItem);

				RowObject.EventListeners["ContextMenuOpen"] = EventListenerObj;

				this.RowParentObject.addObject(RowObject);
				this.ElementParentObject = RowObject;

				RowAfterElementCount = RowAfterElementsGen.next().value;
				//console.debug('::RowObjectGenerator RowAfterElementCount:%s', RowAfterElementCount);
				Step = 0;
				RowCounter += 1;
			}
			Step += 1;
			yield null;
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "RowAfterElementsGenerator"
//------------------------------------------------------------------------------

sysList.prototype.RowAfterElementsGenerator = function*(RowAfterElementsArray)
{
	while(true) {
		for (Index in RowAfterElementsArray) {
			yield RowAfterElementsArray[Index];
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "ElementsEnclosedByGenerator"
//------------------------------------------------------------------------------

sysList.prototype.ElementsEnclosedByGenerator = function*()
{
	const Attributes = this.JSONConfig.Attributes;
	while(true) {
		for (Index in Attributes.ElementsEnclosedByDivStyle) {
			yield Attributes.ElementsEnclosedByDivStyle[Index];
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "setupHeader"
//------------------------------------------------------------------------------

sysList.prototype.setupHeader = function()
{
	var Columns = this.JSONConfig.Attributes.Columns;
	var AddRootObject = this;

	if (this.JSONConfig.Attributes.HeaderRowStyle !== undefined) {
		var HeaderRowObj = new sysBaseObject();
		HeaderRowObj.ObjectID = this.ObjectID+'HdrRow';
		HeaderRowObj.DOMStyle = this.JSONConfig.Attributes.HeaderRowStyle;
		AddRootObject = HeaderRowObj;
		this.addObject(HeaderRowObj);
	}

	for (ColumnKey in Columns) {

		ColItem = Columns[ColumnKey];

		if (ColItem.visible != false) {
			var ColObj = new sysBaseObject();

			ColObj.ObjectID = this.ObjectID+'Hdr' + ColumnKey;
			if (ColItem.HeaderStyle !== undefined) {
				ColObj.DOMStyle = ColItem.HeaderStyle;
			}
			if (ColItem.AdditionalHeaderStyles !== undefined) {
				ColObj.DOMStyles = ColItem.AdditionalHeaderStyles;
			}

			var ColDisplayObj = new sysObjSQLText();
			ColDisplayObj.ObjectID = ColObj.ObjectID+'Display';
			ColDisplayObj.TextID = ColItem.HeaderTextID;
			//console.log(ColItem.HeaderTextID);
			ColDisplayObj.init();

			ColObj.addObject(ColDisplayObj);
			AddRootObject.addObject(ColObj);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "setupNavigation"
//------------------------------------------------------------------------------

sysList.prototype.setupNavigation = function()
{
	var RowContainer = new sysObjRowContainer();

	const NavLeftID = this.ObjectID + 'NavLeft';
	const NavSpacerID = this.ObjectID +  'NavSpacer';
	const NavRightID = this.ObjectID+'NavRight';

	RowContainer.JSONConfig = {
		"Attributes": {
			"Style": "row",
			"Columns": [
				{
					"ObjectID": NavLeftID,
					"Style": "col-6 pl-0"
				},
				{
					"ObjectID": NavRightID,
					"Style": "col-6 text-right pr-0"
				}
			]
		}
	}

	RowContainer.init();

	var NavLeftButton = new sysObjButtonCallback();
	NavLeftButton.setCallback(this, 'navLeft');

	NavLeftButton.JSONConfig = {
		"Attributes": {
			"Style": "sysButton",
			"TextID": "TXT.BUTTON.LEFT"
		}
	}

	NavLeftButton.init();

	RowContainer.runtimeAddObject(NavLeftID, NavLeftButton);

	var NavRightButton = new sysObjButtonCallback();
	NavRightButton.setCallback(this, 'navRight');

	NavRightButton.JSONConfig = {
		"Attributes": {
			"Style": "sysButton",
			"TextID": "TXT.BUTTON.RIGHT"
		}
	}

	NavRightButton.init();

	RowContainer.runtimeAddObject(NavRightID, NavRightButton);

	this.addObject(RowContainer);
}


//------------------------------------------------------------------------------
//- METHOD "processCallback"
//------------------------------------------------------------------------------

sysList.prototype.processCallback = function(Function)
{
	if (Function == 'navLeft') { this.navigateLeft(); }
	if (Function == 'navRight') { this.navigateRight(); }
}


//------------------------------------------------------------------------------
//- METHOD "navigateLeft"
//------------------------------------------------------------------------------

sysList.prototype.navigateLeft = function()
{
	if (this.NavPageIndex > 0) { this.NavPageIndex -= 1; }
	this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "navigateRight"
//------------------------------------------------------------------------------

sysList.prototype.navigateRight = function()
{
	const MaxPages = Math.ceil(this.RowItems.length/this.DisplayRows)-1;

	if (this.NavPageIndex < MaxPages) { this.NavPageIndex += 1; }
	this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "resetData"
//------------------------------------------------------------------------------

sysList.prototype.resetData = function()
{
	this.Data = [];
	this.RowItemsStyleClasses = [];

	this.NavPageIndex	= 0;
	this.RowItemIndex	= 0;
}


//------------------------------------------------------------------------------
//- METHOD "setUpdateResult"
//------------------------------------------------------------------------------

sysList.prototype.setUpdateResult = function()
{
	for (ResultKey in this.XMLRPCResultData) {
		this.Data.push(this.XMLRPCResultData[ResultKey]);
	}

	//console.debug('::setUpdateResult this.Data:%o', this.Data);
}


//------------------------------------------------------------------------------
//- METHOD "checkDouble"
//------------------------------------------------------------------------------

sysList.prototype.checkDouble = function(CheckValue)
{
	for (RowID in this.Data) {
		var RowData = this.Data[RowID];
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
	//console.log('::renderPage Result Data:%o Object:%o UpdateCount:%d', this.Data, this, this.UpdateCount);

	const Attributes = this.JSONConfig.Attributes;

	if (this.UpdateCount > 0) {
		this.remove();
	}

	if (Attributes.DisableHeader === undefined || Attributes.DisableHeader === false) {
		this.setupHeader();
	}

	this.RowItems = [];

	for (RowID in this.Data) {
		var RowData = this.Data[RowID];
		this.addRow(RowData, RowID, false);
	}

	//console.log('::renderPage List RowItems:%o', this.RowItems);
	
	PageSize = this.DisplayRows;
	PageIndex = this.NavPageIndex+1;

	PageBeginRow = (PageIndex*PageSize)-PageSize;
	PageEndRow = (PageBeginRow+PageSize)-1;
	
	for (this.RowItemIndex in this.RowItems) {
		const RowItem = this.RowItems[this.RowItemIndex];

		if (Attributes.Navigation !== undefined) {
			if (this.RowItemIndex >= PageBeginRow && this.RowItemIndex <= PageEndRow) {
				this.addRowObject(RowItem);
			}
		}
		else {
			this.addRowObject(RowItem);
		}
		//console.debug('::renderPage addRowObject RowItem:%o Index:%s', RowItem, this.RowItemIndex);
    }

	if (Attributes.Navigation !== undefined) {
		this.setupNavigation();
	}

	if (this.UpdateCount > 0) {
		//console.debug('############# renderObject() DOMObjectID:%s DOMParentID:%s ChildObjects:%o', this.DOMObjectID, this.DOMParentID, this.ChildObjects);
		this.renderObject(this.DOMParentID);
	}

	//- register event listeners
    this.processEventListener();

	//- danymically adjust iframe size
	sysFactory.resizeIframe();

	//- move to global inherited function for all object types
	if (this.FocusObjectID !== undefined) {
		try {
			document.getElementById(this.FocusObjectID).focus();
		}
		catch(err) {
			console.debug('::FocusObjectID err:%s', err);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "addRowObject"
//------------------------------------------------------------------------------

sysList.prototype.addRowObject = function(RowItem)
{
	const RowAfterElements = this.JSONConfig.Attributes.RowAfterElements;
	//console.debug('::addRowObject RowAfterElements:%s', RowAfterElements);

	if (RowAfterElements === undefined) {

		var DynamicRowStyle = '';
		if (this.RowItemsStyleClasses[this.RowItemIndex] !== undefined) {
			DynamicRowStyle = ' ' + this.RowItemsStyleClasses[this.RowItemIndex];
		}

		var RowObj = new sysBaseObject();
		RowObj.ObjectID = this.ObjectID + '_Row' + this.RowItemIndex;
		RowObj.DOMStyle = this.JSONConfig.Attributes.RowStyle + DynamicRowStyle;
		RowObj.EventListeners = new Object();

		var EventListenerObj = new Object();
		EventListenerObj['Type'] = 'mousedown';
		EventListenerObj['Element'] = RowItem.EventListenerRightClick.bind(RowItem);
		RowObj.EventListeners["ContextMenuOpen"] = EventListenerObj;

		this.addObject(RowObj);
		this.ElementParentObject = RowObj;
	}
	else {
		this.RowParentObject = this;
	}
	//console.debug('::renderPage loopX x:%s RowItem:%o', x, RowItem);

	for (y in RowItem.ColItems) {
		this.RowObjects.next();
		var ColItem = RowItem.ColItems[y];
		ColItem.DOMStyle = this.ElementStyles.next().value;
		//console.debug('::renderPage loopY y:%s ColItem:%o', y, ColItem.DOMValue);
		this.ElementParentObject.addObject(ColItem);
	}
}


//------------------------------------------------------------------------------
//- METHOD "addRow"
//------------------------------------------------------------------------------

sysList.prototype.addRow = function(RowData, Index, RowDynamic)
{
	var RowObj = new sysListRow();

	RowObj.ObjectID = this.ObjectID + '_Row' + Index;

	RowObj.ContextMenuItems = this.JSONConfig.Attributes.ContextMenuItems;
	RowObj.ScreenObject = this.ScreenObject;
	RowObj.SourceObject = this;
	RowObj.SetupData = RowData;
	RowObj.Index = Number(Index);
	RowObj.DynamicRow = RowDynamic;

	RowObj.addColumns();

    //console.log('Push Row Obj:%o', RowObj);
	this.RowItems.push(RowObj);

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
//- METHOD "addDynamicRow"
//------------------------------------------------------------------------------

sysList.prototype.addDynamicRow = function()
{
	const AddRowColumns = this.JSONConfig.Attributes.AddRowColumns;
	//console.debug('::addDynamicRow AddRowColumns:%o', AddRowColumns);
	var RowData = new Object();

	//const DataIndex = this.Data.length;

	for (ColumnKey in AddRowColumns) {
		const ColConfig = AddRowColumns[ColumnKey];
		if (ColConfig.Value !== undefined) {
			RowData[ColumnKey] = ColConfig.Value;
		}
	}

	//console.debug('::addDynamicRow RowData:%o', RowData);

	this.syncRealtimeData();

	this.Data.push(RowData);
	
	//console.debug('::addDynamicRow Data:%o', this.Data);

	this.updateDynamicRowNumbering();

	this.renderPage();

}


//------------------------------------------------------------------------------
//- METHOD "syncRealtimeData"
//------------------------------------------------------------------------------

sysList.prototype.syncRealtimeData = function()
{
	for (DataIndex in this.Data) {
		//console.debug('::addDynamicRow Data Index:%s', DataIndex);
		const ColItems = this.RowItems[DataIndex].ColItems;
		for (ColIndex in ColItems) {
			const ColumnObject = ColItems[ColIndex];
			if (ColumnObject.ObjectType == 'FormField') {
				//console.debug('ColObject Object:%o', ColumnObject);			
				const SetData = ColumnObject.getRuntimeData();
				console.debug('::addDynamicRow SetData:%s TableColumn:%s', SetData, ColumnObject.TableColumn);
				this.Data[DataIndex][ColumnObject.TableColumn] = SetData;
			}
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateOnTabSwitch"
//------------------------------------------------------------------------------

sysList.prototype.updateOnTabSwitch = function(Columns, Result)
{
	console.debug('::updateOnTabSwitch Result:%o', Result);
	for (Jahr in Result) {
		const JahrValue = Result[Jahr];
		const ColumnID = Columns[Jahr];
		if (JahrValue === false) {
			this.JSONConfig.Attributes.Columns[ColumnID]['disabled'] = true;
		}
		else {
			this.JSONConfig.Attributes.Columns[ColumnID]['disabled'] = false;
		}
	}
	this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "getObjectData"
//------------------------------------------------------------------------------

sysList.prototype.getObjectData = function()
{
	this.syncRealtimeData();
	return this.Data;
}


//------------------------------------------------------------------------------
//- METHOD "getRuntimeData"
//------------------------------------------------------------------------------

//- SHOULD BE: generic way in all objects via this.RuntimeGetDataFunc
sysList.prototype.getRuntimeData = function()
{
	return this.getObjectData();
}
