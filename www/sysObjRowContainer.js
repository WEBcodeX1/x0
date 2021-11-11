//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjRowContainer"
//------------------------------------------------------------------------------

function sysObjRowContainer()
{
    this.EventListeners		= new Object();
	this.ChildObjects		= new Array();
	this.RuntimeObjectRef	= new Object();
}

sysObjRowContainer.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjRowContainer.prototype.init = function()
{
	var Attributes = this.JSONConfig.Attributes;
	this.DOMStyle = Attributes.Style;

	const Columns = Attributes.Columns;

	for (Index in Columns) {

		const Column = Columns[Index];
		//console.debug('sysObjContainer ::init Column:%o', Column);

		var ColumnObject = new sysBaseObject();
		ColumnObject.ObjectID = Column.ObjectID;
		ColumnObject.DOMStyle = Column.Style;

		this.RuntimeObjectRef[Column.ObjectID] = ColumnObject;

		this.addObject(ColumnObject);
	}
}


//------------------------------------------------------------------------------
//- METHOD "runtimeAddObject"
//------------------------------------------------------------------------------

sysObjRowContainer.prototype.runtimeAddObject = function(ObjectRef, Object)
{
	const AddObject = this.RuntimeObjectRef[ObjectRef];
	AddObject.addObject(Object);
}
