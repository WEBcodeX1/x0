//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
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
    this.ObjectType                 = 'ListRow'                 //- System Object Type
    this.overrideDOMObjectID        = true;                     //- Set ObjectID not recursive

    this.ParentObject               = ParentObject;             //- Parent Object

    this.Index                      = RowIndex;                 //- Row Index
    this.Selected                   = false;                    //- Selected Row
    this.RowData                    = RowData;                  //- Row Data Object

    this.ColItems                   = new Array();              //- Col Item Objects

    this.RuntimeSetDataFunc         = this.setRowData;          //- Set Row RuntimeData
    this.SetDataMechanism           = 'Plain'                   //- Set Data Non-Recursive

    this.EventListeners             = new Object();             //- Event Listeners
    this.ChildObjects               = Array();                  //- Child Objects

    this.ObjectID = 'TR_'+ ParentObject.ObjectID + '_' + RowIndex;
}

sysListRow.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysListRow.prototype.init = function()
{
    let EventListenObjRightClick = new Object();
    EventListenObjRightClick['Type'] = 'mousedown';
    EventListenObjRightClick['Element'] = this.EventListenerRightClick.bind(this);
    this.EventListeners['ContextMenuOpen'] = EventListenObjRightClick;

    let EventListenObjRowSelect = new Object();
    EventListenObjRowSelect['Type'] = 'mousedown';
    EventListenObjRowSelect['Element'] = this.EventListenerSelect.bind(this);
    this.EventListeners['RowSelect'] = EventListenObjRowSelect;
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerRightClick"
//------------------------------------------------------------------------------

sysListRow.prototype.EventListenerRightClick = function(Event)
{
    let ContextMenuItems = this.ParentObject.JSONConfig.Attributes.ContextMenuItems;

    //- check for right click on mousedown
    if (Event.button == 2 && ContextMenuItems !== undefined)
    {
        let ContextMenu = new sysContextMenu();

        ContextMenu.ID             = 'CtMenu' + this.ParentObject.ObjectID;
        ContextMenu.ItemConfig     = ContextMenuItems;
        ContextMenu.ScreenObject   = this.ParentObject.ScreenObject;
        ContextMenu.ParentObject   = this;
        ContextMenu.pageX          = Event.pageX;
        ContextMenu.pageY          = Event.pageY;

        ContextMenu.init();
    }
}


//------------------------------------------------------------------------------
//- METHOD "EventListenerSelect"
//------------------------------------------------------------------------------

sysListRow.prototype.EventListenerSelect = function(Event)
{
    if (this.ParentObject.RowsSelectable == true && Event.button == 0) {
        let processed = false;
        if (this.Selected == true) {
            this.removeDOMElementStyle('bg-secondary bg-opacity-50');
            this.Selected = false;
            processed = true;
        }
        if (this.Selected == false && processed == false) {
            this.addDOMElementStyle('bg-secondary bg-opacity-50');
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
    console.debug('::addColumns ParentObjectID:%s Attributes:%o', this.ParentObject.ObjectID, Attributes);

    for (const ColumnConfig of Attributes.Columns)
    {
        const ColumnID = ColumnConfig.ID;

        let ColumnObj = undefined;

        if (ColumnConfig.ObjectInstanceOf !== undefined) {
            const RefObjectConfig = structuredClone(
                sysFactory.DataObject.XMLRPCResultData[ColumnConfig.ObjectInstanceOf]
            );
            ColumnObj = new sysFactory.SetupClasses[RefObjectConfig.Type]();
            ColumnObj.JSONConfig = {
                "Attributes": RefObjectConfig.Attributes
            };
        }
        else if (ColumnConfig.ObjectType !== undefined) {
            ColumnObj = new sysFactory.SetupClasses[ColumnConfig.ObjectType]();
            ColumnObj.JSONConfig = {
                "Attributes": ColumnConfig.ObjectAttributes
            };
        }
        else {
            ColumnObj = new sysObjDivValue();
            ColumnObj.JSONConfig = {
                "Attributes": {}
            };
        }

        let setValue = undefined;

        if (ColumnConfig.IndexGenerator === true) {
            setValue = this.Index + 1;
            console.debug('IndexGenerator this.Index:%s RuntimeData:%o', this.Index, this.ParentObject.RuntimeData);
        }
        else {
            setValue = this.RowData[ColumnID];
        }

        //- add dynamic row data to runtime data matrix
        this.ParentObject.RuntimeData[this.Index][ColumnID] = setValue;

        ColumnObj.JSONConfig.Attributes['Value'] = setValue;

        ColumnObj.ObjectID = this.ParentObject.ObjectID + ColumnID + this.Index;
        ColumnObj.KeyID = ColumnID;
        ColumnObj.init();

        this.ColItems.push(ColumnObj);
        console.debug('::addColumns Push Object:%o', ColumnObj);
    }
}


//------------------------------------------------------------------------------
//- METHOD "genGrid"
//------------------------------------------------------------------------------

sysListRow.prototype.genGrid = function()
{
    let GridGenerator = new sysGridGenerator(this.ColItems);

    GridGenerator.init(
        this.ParentObject.JSONConfig.Attributes.RowStyle,
        this.ParentObject.JSONConfig.Attributes.ColStyle,
        this.ParentObject.JSONConfig.Attributes.RowAfterElements,
        this.ParentObject.JSONConfig.Attributes.ColAfterElements
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
    for (const ColItem of this.ColItems)
    {
        MatchId = Column + this.Index;
        //console.debug('MatchId:%s ColObjectID:%s', MatchId, ColItem.ObjectID);
        if (ColItem.ObjectID == MatchId) {
            return ColItem;
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "setRowData"
//------------------------------------------------------------------------------

sysListRow.prototype.setRowData = function(Data)
{
    this.setObjectDataKeyValueRecursive(Data);
    this.ParentObject.RuntimeData[this.Index] = this.ParentObject.convertObjectDataKeyValue(Data);
}


//------------------------------------------------------------------------------
//- METHOD "remove"
//------------------------------------------------------------------------------

sysListRow.prototype.remove = function()
{
    this.ParentObject.removeRow(this.Index);
}


//------------------------------------------------------------------------------
//- METHOD "removeSelected"
//------------------------------------------------------------------------------

sysListRow.prototype.removeSelected = function()
{
    this.ParentObject.removeSelected();
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysList"
//------------------------------------------------------------------------------

function sysList()
{
    this.ObjectType             = 'List'                                //- System Object Type
    this.overrideDOMObjectID    = true;                                 //- Override setting recursive ObjectID

    this.RowCount               = 10;                                   //- Row Count (Pagination) Default

    this.DataURL                = null;                                 //- getServiceData XMLRPC URL
    this.DataURLParams          = '';                                   //- getServiceData XMLRPC URL Params

    this.RuntimeGetDataFunc     = this.getRuntimeData;                  //- Get Runtime Data
    this.RuntimeSetDataFunc     = this.appendData;                      //- Set Runtime Data
    this.GetDataMechanism       = 'Plain'                               //- Get Data Non-Recursive
    this.SetDataMechanism       = 'Plain'                               //- Set Data Non-Recursive

    this.PostRequestData        = new sysRequestDataHandler();          //- Request Data Handler

    this.RuntimeData            = new Array();                          //- Data Array
    this.RowItems               = new Array();                          //- Row Objects Array

    this.NavPageIndex           = 0;                                    //- Selected Page/Navigation Index
    this.UpdateCount            = 0;                                    //- Update Counter

    this.Columns                = new Array();                          //- Comlumns for fast query

    this.ChildObjects           = new Array();                          //- Child Objects
    this.EventListeners         = new Object();                         //- Event Listeners

    this.PaginationObject       = new sysPagination(this);              //- Pagination Processing

    this.RowsSelectable         = true;                                 //- Multi Row Selection Default
}

sysList.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- Overload single class methods
//------------------------------------------------------------------------------

sysList.prototype.processSourceObjects = sysSourceObjectHandler.prototype.processSourceObjects;


//------------------------------------------------------------------------------
//- METHOD "EventListenerRightClick"
//------------------------------------------------------------------------------

sysList.prototype.EventListenerRightClick = function(Event)
{
    let ContextMenuItems = this.JSONConfig.Attributes.HeaderContextMenuItems;

    //- check for right click on mousedown
    if (Event.button == 2 && ContextMenuItems !== undefined) {

        let ContextMenu = new sysContextMenu();

        ContextMenu.ID             = 'CtMenuHeader' + this.ObjectID;
        ContextMenu.ItemConfig     = ContextMenuItems;
        ContextMenu.ScreenObject   = this.ScreenObject;
        ContextMenu.ParentObject   = this;
        ContextMenu.pageX          = Event.pageX;
        ContextMenu.pageY          = Event.pageY;

        ContextMenu.init();
    }
}


//------------------------------------------------------------------------------
//- METHOD "getServiceData"
//------------------------------------------------------------------------------

sysList.prototype.getServiceData = function()
{
    this.resetData();
    this.removeParent();

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
    this.removeParent();
    this.setUpdateResult();
    this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysList.prototype.init = function()
{
    //console.debug('::List init ObjectID:%s', this.ObjectID);
    const Attributes = this.JSONConfig.Attributes;

    if (Attributes === undefined) {
        Attributes = new Object();
    }

    if (Attributes.RowCount !== undefined) {
        this.RowCount = Attributes.RowCount;
    }

    if (Attributes.RowsSelectable !== undefined) {
        this.RowsSelectable = Attributes.RowsSelectable;
    }

    if (Attributes.Value !== undefined) {
        this.RuntimeData = Attributes.Value;
    }

    this.DOMStyle = Attributes.Style;

    //this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "setupHeader"
//------------------------------------------------------------------------------

sysList.prototype.setupHeader = function()
{
    const Columns = this.JSONConfig.Attributes.Columns;

    let HeaderRowObj = new sysBaseObject();
    HeaderRowObj.ObjectID = this.ObjectID + 'HdrRow';
    HeaderRowObj.overrideDOMObjectID = true;
    HeaderRowObj.DOMStyle = this.JSONConfig.Attributes.HeaderRowStyle;
    HeaderRowObj.EventListeners = new Object();

    AddRootObject = HeaderRowObj;

    this.addObject(HeaderRowObj);

    let EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown';
    EventListenerObj['Element'] = this.EventListenerRightClick.bind(this);
    HeaderRowObj.EventListeners['ContextMenuOpen'] = EventListenerObj;

    for (const ColItem of Columns)
    {
        const ColumnID = ColItem.ID;
        let ColObj = new sysBaseObject();

        ColObj.ObjectID = this.ObjectID + ColumnID + 'HeaderCtr';
        ColObj.overrideDOMObjectID = true;

        if (ColItem.HeaderStyle !== undefined) {
            ColObj.DOMStyle = ColItem.HeaderStyle;
        }

        if (ColItem.HeaderTextID !== undefined)
        {
            let ColDisplayObj = new sysObjSQLText();
            ColDisplayObj.ObjectID = this.ObjectID + ColumnID + 'HeaderDisplayText';
            ColDisplayObj.overrideDOMObjectID = true;

            ColDisplayObj.JSONConfig = {
                "Attributes": {
                    "TextID": ColItem.HeaderTextID,
                    "IconStyle": ColItem.HeaderIconStyle
                }
            }

            ColDisplayObj.init();
            ColObj.addObject(ColDisplayObj);
        }

        HeaderRowObj.addObject(ColObj);
        this.Columns.push(ColumnID);
    }
}


//------------------------------------------------------------------------------
//- METHOD "resetData"
//------------------------------------------------------------------------------

sysList.prototype.resetData = function()
{
    this.RuntimeData = [];
    this.NavPageIndex = 0;
}


//------------------------------------------------------------------------------
//- METHOD "reset"
//------------------------------------------------------------------------------

sysList.prototype.reset = function()
{
    this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "setUpdateResult"
//------------------------------------------------------------------------------

sysList.prototype.setUpdateResult = function()
{
    for (const ResultKey in this.XMLRPCResultData) {
        this.RuntimeData.push(this.XMLRPCResultData[ResultKey]);
    }
    console.debug('::setUpdateResult this.RuntimeData:%o', this.RuntimeData);
}


//------------------------------------------------------------------------------
//- METHOD "checkDouble"
//------------------------------------------------------------------------------

sysList.prototype.checkDouble = function(CheckValue)
{
    for (const RowData of this.RuntimeData)
    {
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
    console.debug('::renderPage Result Data:%o Object:%o UpdateCount:%d', this.RuntimeData, this, this.UpdateCount);

    const Attributes = this.JSONConfig.Attributes;

    //- remove from parent element on update
    this.removeParent();

    //- process list header columns
    if (Attributes.DisableHeader === undefined || Attributes.DisableHeader === false) {
        this.setupHeader();
    }

    //- setup "virtual" / not direct-rendered rows for dynamic grid calculation
    this.RowItems = [];

    let RowID = 0;
    for (const RowData of this.RuntimeData)
    {
        this.addRow(RowData, RowID);
        ++RowID;
    }

    //- finally render row setup data
    this.renderRows();

    //- process navigation / pages
    if (Attributes.Navigation !== undefined) {
        this.PaginationObject.update();
    }

    //- render everything into DOM
    this.renderObject(this.DOMParentID);

    for (RowObj of this.RowItems) {
        RowObj.processReset();
    }

    //- register event listeners
    this.processEventListener();
}


//------------------------------------------------------------------------------
//- METHOD "addRow"
//------------------------------------------------------------------------------

sysList.prototype.addRow = function(RowData, Index)
{
    let RowObj = new sysListRow(this, Number(Index), RowData);

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
    this.RuntimeData.splice(Index, 1);
    this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "removeSelected"
//------------------------------------------------------------------------------

sysList.prototype.removeSelected = function()
{
    let RemoveArray = new Array();
    for (const Item of this.RowItems) {
        if (Item.Selected == true) {
            RemoveArray.push(Item.Index);
        }
    }

    for (let i = RemoveArray.length-1; i>=0; i--) {
        console.debug('Remove Row selected Index:%s', RemoveArray[i]);
        this.RowItems.splice(RemoveArray[i], 1);
        this.RuntimeData.splice(RemoveArray[i], 1);
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
    let ReturnItems = new Array();
    for (const Row of this.RowItems) {
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
    this.UpdateCount++;
    this.renderPage();
}


//------------------------------------------------------------------------------
//- METHOD "getRuntimeData"
//------------------------------------------------------------------------------

sysList.prototype.getRuntimeData = function()
{
    return this.RuntimeData;
}


//------------------------------------------------------------------------------
//- METHOD "convertObjectDataKeyValue"
//------------------------------------------------------------------------------

sysList.prototype.convertObjectDataKeyValue = function(Data)
{
    let AppendRowData = new Object();

    //- only set data where data key exists in columnIDs
    for (const DataKey in Data)
    {
        const DataItem = Data[DataKey];
        if (this.Columns.includes(DataItem.KeyID)) {
            AppendRowData[DataItem.KeyID] = DataItem.ObjectValue;
        }
    }
    return AppendRowData;
}


//------------------------------------------------------------------------------
//- METHOD "appendData"
//------------------------------------------------------------------------------

sysList.prototype.appendData = function(Data)
{
    const Attributes = this.JSONConfig.Attributes;

    console.debug('::appendData Data:%o', Data);

    const ErrorObj = sysFactory.getObjectByID(this.JSONConfig.Attributes.ErrorContainer);
    if (ErrorObj !== undefined) {
        ErrorObj.reset();
    }

    //- only set data where data key exists in columnIDs
    let AppendRowData = this.convertObjectDataKeyValue(Data);
    console.debug('::appendData AppendRowObj:%o', AppendRowData);

    const MaxRows = Attributes.DataMaxRows;
    if (this.RuntimeData.length >= MaxRows && ErrorObj !== undefined) {
        ErrorObj.displayError(sysFactory.getText('TXT.SYS.ERROR.TABLE.MAX-ROW-COUNT')) + MaxRows + '.';
        return;
    }

    const DoubleCheckColumn = Attributes.DoubleCheckColumn;
    const DisplayText = sysFactory.getText('TXT.SYS.ERROR.TABLE.DOUBLE-ENTRIES-NOTALLOWED') + DoubleCheckColumn + '.';
    if (DoubleCheckColumn !== undefined) {
        if (this.checkDouble(AppendRowData[DoubleCheckColumn]) == false) {
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
            const Result = AppendRowData[ColKey].search(Regex);
            //console.debug('::Regex Result:%s', Result);
            if (Result == -1) {
                ErrorObj.displayError(ConfigObj.ErrorMsg);
                return;
            }
        }
    }

    this.UpdateCount++;
    this.RuntimeData.push(AppendRowData);
    console.debug('::appendData this.RuntimeData:%o', this.RuntimeData);
    this.renderPage();
}
