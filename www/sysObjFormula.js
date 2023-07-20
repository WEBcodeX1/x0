//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2021                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Formula"                                                  -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjFormulaContainer"
//------------------------------------------------------------------------------

function sysObjFormula()
{
	this.ChildObjects		= new Array();				//- Child Objects Array
    this.RuntimeGetDataFunc	= this.getRuntimeData		//- Runtime Get Data Mapping
}

sysObjFormula.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjFormula.prototype.init = function()
{

	var Attributes = this.JSONConfig.Attributes;
	this.DOMStyle = Attributes.Style;

	this.FormItem = new sysFormFieldItem();

	this.FormItem.JSONConfig = {
		"Attributes": {
			"Type": "text",
			"Disabled": true,
			"Style": "FormFieldBorder",
			"StyleOnFocus": "FormFieldBorderOnFocus",
			"Value": 0
		}
	};

	this.FormItem.ObjectID = this.ObjectID + 'Formula';
	this.FormItem.ObjectType = "FormField";
	this.FormItem.ParentObject = this;
	this.FormItem.Index = 1;
	this.FormItem.init();
	this.FormItem.generateHTML();
	this.addObject(this.FormItem);

	this.registerEventListeners();

}


//------------------------------------------------------------------------------
//- METHOD "updateValues"
//------------------------------------------------------------------------------

sysObjFormula.prototype.updateValues = function(debug)
{
	//console.debug('::updateValues');
	const ObjRefs = this.JSONConfig.Attributes.ObjectRefs;
	var ResultValue = 0;
	for (ObjIndex in ObjRefs) {
		const ObjectRef = ObjRefs[ObjIndex];
		if (ObjectRef.Type == 'List') {
			const List = sysFactory.getObjectByID(ObjectRef.ObjectID);
			const Result = List.getObjectData();
			console.debug('FormulaHandler Column:%s ObjectID:%s Result:%o', ObjectRef.Column, ObjectRef.ObjectID, Result);
			for (Index in Result) {
				const Row = Result[Index];
				if (Row[ObjectRef.Column] !== undefined && Row[ObjectRef.Column].length > 0) {
					if (ObjectRef.Operator == '+') {
						ResultValue += parseFloat(Row[ObjectRef.Column]);
					}
					if (ObjectRef.Operator == '-') {
						ResultValue -= parseFloat(Row[ObjectRef.Column]);
					}
					//console.debug('ResultValue:%s', ResultValue);
					ResultValue = Number(ResultValue.toFixed(2));
				}
			}
		}
	}
	console.debug('Set ResultValue:%s FormObject:%s', ResultValue, this.FormItem.ObjectID);
	this.FormItem.setValue(ResultValue);
}


//------------------------------------------------------------------------------
//- METHOD "addEventListeners"
//------------------------------------------------------------------------------

sysObjFormula.prototype.registerEventListeners = function()
{
	const ObjRefs = this.JSONConfig.Attributes.ObjectRefs;
	for (Index in ObjRefs) {
		const ObjectRef = ObjRefs[Index];
		if (ObjectRef.Type == 'List') {
			const List = sysFactory.getObjectByID(ObjectRef.ObjectID);
			//console.debug('FormulaHandler ObjRefs.Column:%s', ObjectRef.Column);
			List.setRealtimeEventListener(ObjectRef.Column, this);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "getRuntimeData"
//------------------------------------------------------------------------------

sysObjFormula.prototype.getRuntimeData = function()
{
	return this.FormItem.RuntimeGetDataFunc();
}
