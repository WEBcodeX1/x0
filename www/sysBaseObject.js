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
	ChildObject.ParentObject = this;
	this.ChildObjects.push(ChildObject);
}


//------------------------------------------------------------------------------
//- METHOD "renderObject"
//------------------------------------------------------------------------------

sysBaseObject.prototype.renderObject = function(Prefix)
{
	const setObjectID = (this.ObjectShortID !== undefined) ? this.ObjectShortID : this.ObjectID;

	this.DOMParentID = Prefix;

	if (this.overrideDOMObjectID !== true) {
		if (Prefix == null) {
			this.DOMObjectID = setObjectID;
		}
		else {
			this.DOMObjectID = Prefix + '_' + setObjectID;
		}
	}

	this.createDOMElement(this.DOMObjectID);
	this.appendDOMParentElement();

	this.setDOMAttributes();
	this.setDOMElementValue();
	this.setDOMElementStyle();
	this.setDOMElementStyleAttributes();

    //console.debug(':renderObject ObjectID:%s ChildObjects:%o:', this.ObjectID, this.ChildObjects);
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
//- METHOD "connectServiceConnectorObjects"
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
//- METHOD "deactivateDeactivated"
//------------------------------------------------------------------------------

sysBaseObject.prototype.deactivateDeactivated = function()
{
	//console.debug('deactivate deactivated:%s', this.Deactivated);
	if (this.Deactivated === true) {
		this.setDOMVisibleState("hidden");
	}

	for (i in this.ChildObjects) {
		const ChildItem = this.ChildObjects[i];
		ChildItem.deactivateDeactivated();
	}
}


//------------------------------------------------------------------------------
//- METHOD "setActivated"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setActivated = function()
{
	this.Deactivated = false;

	for (i in this.ChildObjects) {
		const ChildItem = this.ChildObjects[i];
		ChildItem.setActivated();
	}
}


//------------------------------------------------------------------------------
//- METHOD "setDeactivated"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setDeactivated = function()
{
	this.Deactivated = true;

	for (i in this.ChildObjects) {
		const ChildItem = this.ChildObjects[i];
		ChildItem.setActivated();
	}
}


//------------------------------------------------------------------------------
//- METHOD "setTabActivated"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setTabActivated = function()
{
	this.TabDeactivated = false;

	for (i in this.ChildObjects) {
		const ChildItem = this.ChildObjects[i];
		ChildItem.setActivated();
	}
}


//------------------------------------------------------------------------------
//- METHOD "setTabDeactivated"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setTabDeactivated = function()
{
	this.TabDeactivated = true;

	for (i in this.ChildObjects) {
		const ChildItem = this.ChildObjects[i];
		ChildItem.setActivated();
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
//- METHOD "processUpdate"
//------------------------------------------------------------------------------

sysBaseObject.prototype.processUpdate = function()
{
	this.updateValue();
	for (i in this.ChildObjects) {
		var ChildItem = this.ChildObjects[i];
		ChildItem.processUpdate();
	}
}


//------------------------------------------------------------------------------
//- METHOD "updateValue" Template Function
//------------------------------------------------------------------------------

sysBaseObject.prototype.updateValue = function()
{
}


//------------------------------------------------------------------------------
//- METHOD "updateInstanceObjectNames"
//------------------------------------------------------------------------------

sysBaseObject.prototype.updateInstanceObjectNames = function()
{
}


//------------------------------------------------------------------------------
//- METHOD "rewriteOverlayFormitemNames"
//------------------------------------------------------------------------------

sysBaseObject.prototype.rewriteOverlayFormitemNames = function()
{
}
