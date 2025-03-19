//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "ObjectContainer"                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjObjectContainer"
//------------------------------------------------------------------------------

function sysObjObjectContainer()
{
	this.EventListeners		= new Object();
	this.ChildObjects		= new Array();
	this.RuntimeObjectRef	= new Object();
}

sysObjObjectContainer.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjObjectContainer.prototype.init = function()
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

sysObjObjectContainer.prototype.runtimeAddObject = function(ObjectRef, Object)
{
	const AddObject = this.RuntimeObjectRef[ObjectRef];
	AddObject.addObject(Object);
}
