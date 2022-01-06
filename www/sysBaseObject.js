//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "BaseObject"                                               -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysBaseObject"
//------------------------------------------------------------------------------

function sysBaseObject() {

	this.DOMType			= 'div';				//- Default DOMType 'div'
	this.ObjectID			= null;					//- Object ID
	this.ObjectType			= null;					//- Object Type
	this.ParentObject		= null;					//- Parent Object

	this.DOMObjectID		= null;					//- DOM Object ID - set recursive
	this.DOMParentID		= null;					//- Parent DOM Object ID - set recursive

	this.ChildObjects		= new Array();			//- Child Objects
}

//- inherit sysBaseDOMElement
sysBaseObject.prototype = new sysBaseDOMElement();


//------------------------------------------------------------------------------
//- METHOD "addObject"
//------------------------------------------------------------------------------

sysBaseObject.prototype.addObject = function(ChildObject)
{
    var ObjectID = ChildObject.ObjectID;
	ChildObject.ParentObject = this;
	this.ChildObjects.push(ChildObject);
}


//------------------------------------------------------------------------------
//- METHOD "renderObject"
//------------------------------------------------------------------------------

sysBaseObject.prototype.renderObject = function(Prefix)
{
	if (Prefix == null) {
		this.DOMObjectID = this.ObjectID;
	}
	else {
		this.DOMObjectID = Prefix + '_' + this.ObjectID;
		this.DOMParentID = Prefix;
	}

    this.createDOMElement(this.DOMObjectID);
    this.appendDOMParentElement();

    this.setDOMElementValue();
    this.setDOMElementStyle();
    this.setDOMElementStyleAttributes();

    //console.log(':renderObject ObjectID:%s ChildObjects:%o:', this.ObjectID, this.ChildObjects);
	for (i in this.ChildObjects) {
		var ChildItem = this.ChildObjects[i];
		ChildItem.renderObject(this.DOMObjectID);
	}
}


//------------------------------------------------------------------------------
//- METHOD "processEventListener"
//------------------------------------------------------------------------------

sysBaseObject.prototype.processEventListener = function()
{
	//console.log('### PROCESS EVENT LISTENER ### DOMObjectID:'+this.DOMObjectID)
	if (this.EventListeners != null || this.EventListeners !== undefined) {
		var ListenerKeys = Object.keys(this.EventListeners);

		if (ListenerKeys.length > 0) {
			for (ListenerKey in this.EventListeners) {
				EventListener = this.EventListeners[ListenerKey];
				this.DOMaddEventListener(EventListener.Type, EventListener.Element);
			}
		}
	}

	for (i in this.ChildObjects) {
		var ChildItem = this.ChildObjects[i];
		ChildItem.processEventListener();
	}
}


//------------------------------------------------------------------------------
//- METHOD "ActivateActiveTab"
//------------------------------------------------------------------------------

sysBaseObject.prototype.ActivateActiveTab = function()
{

	if (this.ObjectType == 'TabContainer') {
		this.activateActiveTab();
	}

	for (i in this.ChildObjects) {
		var ChildItem = this.ChildObjects[i];
		ChildItem.ActivateActiveTab();
	}

}


//------------------------------------------------------------------------------
//- METHOD "deactivateTab"
//------------------------------------------------------------------------------

sysBaseObject.prototype.deactivateTab = function()
{

	if (this.ObjectType == 'Tab') {
		this.deactivate();
	}

	for (i in this.ChildObjects) {
		var ChildItem = this.ChildObjects[i];
		ChildItem.deactivateTab();
	}

}


//------------------------------------------------------------------------------
//- METHOD "renderFormlists"
//------------------------------------------------------------------------------

sysBaseObject.prototype.renderFormlists = function()
{

	if (this.ObjectType == 'FormFieldList') {
		this.render();
	}

	for (i in this.ChildObjects) {
		var ChildItem = this.ChildObjects[i];
		ChildItem.renderFormlists();
	}

}


//------------------------------------------------------------------------------
//- METHOD "renderFormlists"
//------------------------------------------------------------------------------

sysBaseObject.prototype.connectServiceConnectorObjects = function()
{

	if (this.ObjectType == 'ServiceConnector') {
		this.connect();
	}

	for (i in this.ChildObjects) {
		var ChildItem = this.ChildObjects[i];
		ChildItem.connectServiceConnectorObjects();
	}

}


//------------------------------------------------------------------------------
//- METHOD "getObjectByID"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectByID = function(ObjectID) {
	var Objects = this.getObjects();
	for (ObjKey in Objects) {
		//console.log('getObjectByID Elements ObjektID:%s', ObjKey);
		if (ObjKey == ObjectID) {
			return Objects[ObjKey];
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "getChildObjectByIndex"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getChildObjectByIndex = function(Index) {
	return this.ChildObjects[Index];
}


//------------------------------------------------------------------------------
//- METHOD "getObjectsByAttribute"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectsByAttribute = function(Attribute) {
	//console.debug('::getObjectsByAttribute Attribute:%s', Attribute);
	var ResultObjects = new Array();
	var Objects = this.getObjects();
	for (ObjKey in Objects) {
		var ProcessObject = Objects[ObjKey];
		if (ProcessObject.JSONConfig !== undefined && ProcessObject.JSONConfig.Attributes !== undefined) {
			//console.debug('::getObjectsByAttribute ProcessObject JSONConfig:%o', ProcessObject.JSONConfig.Attributes);
			if (ProcessObject.JSONConfig.Attributes.hasOwnProperty(Attribute) && ProcessObject.JSONConfig.Attributes[Attribute] !== undefined) {
				ResultObjects.push(ProcessObject);
			}
		}
	}
	return ResultObjects;
}


//------------------------------------------------------------------------------
//- METHOD "getObjectByType"
//------------------------------------------------------------------------------
sysBaseObject.prototype.getObjectsByType = function(ObjectType) {

	var ResultObjects = new Object();

	var Objects = this.getObjects();
	for (ObjKey in Objects) {
		var ObjectItem = Objects[ObjKey];
		//console.log('BaseObject::getObjectsByType Loop ObjectItem:', ObjectItem);
		if (ObjectItem.ObjectType == ObjectType) {
			ResultObjects[ObjKey] = Objects[ObjKey];
		}
	}

	return ResultObjects;
}


//------------------------------------------------------------------------------
//- METHOD "getObjects"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjects = function()
{
	var Items = new Object();

	for (i in this.ChildObjects) {
		var ChildItem = this.ChildObjects[i];
		RItems = ChildItem.getObjects();
		Items[ChildItem.ObjectID] = ChildItem;
		for (RItemKey in RItems) {
			RItem = RItems[RItemKey];
			Items[RItem.ObjectID] = RItem;
		}
	}

	return Items;
}


//------------------------------------------------------------------------------
//- METHOD "getObjectCount"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectCount = function()
{
	return this.ChildObjects.length;
}


//------------------------------------------------------------------------------
//- METHOD "activate"
//------------------------------------------------------------------------------
sysBaseObject.prototype.activate = function()
{
	//console.log('::activate Type:%s ObjectID:%s', this.Type, this.ObjectID);

	//- if set deactivated, do not set visible
	if (this.Deactivated == false || this.Deactivated === undefined) {
		this.setDOMVisibleState("visible");
	}
	for (i in this.ChildObjects) {
		const ChildItem = this.ChildObjects[i];
		ChildItem.activate();
	}
}


//------------------------------------------------------------------------------
//- METHOD "activateForce"
//------------------------------------------------------------------------------
sysBaseObject.prototype.activateForce = function()
{
	this.setDOMVisibleState("visible");
	for (i in this.ChildObjects) {
		const ChildItem = this.ChildObjects[i];
		ChildItem.activate();
	}
}


//------------------------------------------------------------------------------
//- METHOD "deactivate"
//------------------------------------------------------------------------------

sysBaseObject.prototype.deactivate = function()
{
	this.setDOMVisibleState("hidden");
	for (i in this.ChildObjects) {
		const ChildItem = this.ChildObjects[i];
		ChildItem.deactivate();
	}
}


//------------------------------------------------------------------------------
//- METHOD "toggle"
//------------------------------------------------------------------------------

sysBaseObject.prototype.toggle = function()
{
	this.switchDOMVisibleState();

	for (i in this.ChildObjects) {
		var ChildItem = this.ChildObjects[i];
		ChildItem.toggle();
	}
}


//------------------------------------------------------------------------------
//- METHOD "setZIndex"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setZIndex = function(ZIndex)
{
	this.DOMStyleZIndex = ZIndex;
	this.setDOMElementStyleAttributes();

	for (i in this.ChildObjects) {
		var ChildItem = this.ChildObjects[i];
		ChildItem.setZIndex(ZIndex);
	}
}


//------------------------------------------------------------------------------
//- METHOD "remove"
//------------------------------------------------------------------------------

sysBaseObject.prototype.remove = function()
{
	//console.log('::remove ObjectID:%s DOMObjectID:%s this:%o', this.ObjectID, this.DOMObjectID, this);
	try{
		if (this.checkDOMElementExists(this.DOMObjectID)) {
			this.removeDOMParentElement()
		}
		delete this.ChildObjects;
        this.ChildObjects = new Array();
	}
	catch(err) {
		console.log('::remove ObjectID:%s error:%s', this.ObjectID, err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "getObjectData"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectData = function()
{
	return this.RuntimeGetDataFunc();
}


//------------------------------------------------------------------------------
//- METHOD "getObjectDataStringified"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectDataStringified = function()
{
	return JSON.stringify(this.RuntimeGetDataFunc());
}


//------------------------------------------------------------------------------
//- METHOD "processReset"
//------------------------------------------------------------------------------

sysBaseObject.prototype.processReset = function()
{
	this.reset();
	for (i in this.ChildObjects) {
		var ChildItem = this.ChildObjects[i];
		ChildItem.processReset();
	}
}


//------------------------------------------------------------------------------
//- METHOD "reset" Template Function
//------------------------------------------------------------------------------

sysBaseObject.prototype.reset = function()
{
}


//------------------------------------------------------------------------------
//- METHOD "updateInstanceObjectNames"
//------------------------------------------------------------------------------

sysBaseObject.prototype.updateInstanceObjectNames = function()
{
}


//------------------------------------------------------------------------------
//- METHOD "setValidate"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setValidate = function(validate)
{
    this.doValidate = validate;
}
