//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
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

function sysBaseObject()
{
    this.DOMType              = 'div';            //- Default DOMType 'div'
    this.ObjectID             = null;             //- Object ID
    this.ObjectType           = null;             //- Object Type
    this.ParentObject         = null;             //- Parent Object

    this.DOMObjectID          = null;             //- DOM Object ID - set recursive
    this.DOMParentID          = null;             //- Parent DOM Object ID - set recursive

    this.ChildObjects         = new Array();      //- Child Objects

    this.GetDataResult        = null;             //- Reset GetDataResult
    this.GetDataChildObjects  = new Array();      //- GetDataResult Child Objects Array
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

    if (this.overrideDOMObjectID === true) {
        this.DOMObjectID = this.ObjectID;
    }

    //- only render if dom object does not exists
    if (this.checkDOMElementExists(this.DOMObjectID) == false) {

        this.createDOMElement(this.DOMObjectID);
        this.appendDOMParentElement();

        this.setDOMAttributes();
        this.setDOMElementValue();
        this.setDOMElementStyle();
        this.setDOMElementStyleAttributes();
        this.setDOMVisibleState();
        this.processEventListener();
    }

    //console.debug(':renderObject ObjectID:%s ChildObjects:%o:', this.ObjectID, this.ChildObjects);
    for (const ChildItem of this.ChildObjects) {
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

    for (const ChildItem of this.ChildObjects) {
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

    for (const ChildItem of this.ChildObjects) {
        ChildItem.connectServiceConnectorObjects();
    }
}


//------------------------------------------------------------------------------
//- METHOD "getObjectByID"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectByID = function(ObjectID) {
    var Objects = this.getObjects();
    //console.debug('::sysBaseObject getObjectByID:%s Objects:%o', ObjectID, Objects);
    for (ObjKey in Objects) {
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
//- METHOD "getChildIndexByChildItemID"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getChildIndexByChildItemID = function(ID) {
    for (const [Index, ChildItem] of this.ChildObjects.entries()) {
        console.debug('check ChildItem.ObjectID:%s == ID:%s Index:', ChildItem.ObjectID, ID, Index);
        if (ChildItem.ObjectID == ID) {
            return Index;
        }
    };
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

    for (const ChildItem of this.ChildObjects) {
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
//- METHOD "setActivated"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setActivated = function()
{
    this.Deactivated = false;

    for (const ChildItem of this.ChildObjects) {
        ChildItem.setActivated();
    }
}


//------------------------------------------------------------------------------
//- METHOD "setDeactivated"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setDeactivated = function()
{
    this.Deactivated = true;

    for (const ChildItem of this.ChildObjects) {
        ChildItem.setDeactivated();
    }
}


//------------------------------------------------------------------------------
//- METHOD "remove"
//------------------------------------------------------------------------------

sysBaseObject.prototype.remove = function()
{
    const ChildItemIndex = this.ParentObject.getChildIndexByChildItemID(this.ObjectID);
    this.ParentObject.ChildObjects.splice(ChildItemIndex, 1);
    console.log('::remove ChildItemIndex:%s ChildObjects:%o', ChildItemIndex, this.ParentObject.ChildObjects);
    this.removeDOMElement();
}


//------------------------------------------------------------------------------
//- METHOD "removeParent"
//------------------------------------------------------------------------------

sysBaseObject.prototype.removeParent = function()
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
        console.log('::removeParent ObjectID:%s error:%s', this.ObjectID, err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "getObjectData"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectData = function()
{
    //console.debug('::BaseObject getObjectData() this:%o', this);
    return this.RuntimeGetDataFunc();
}


//------------------------------------------------------------------------------
//- METHOD "setObjectData"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setObjectData = function(Data)
{
    this.RuntimeSetDataFunc(Data);
}


//------------------------------------------------------------------------------
//- METHOD "appendObjectData"
//------------------------------------------------------------------------------

sysBaseObject.prototype.appendObjectData = function(Data)
{
    this.RuntimeAppendDataFunc(Data);
}


//------------------------------------------------------------------------------
//- METHOD "processReset"
//------------------------------------------------------------------------------

sysBaseObject.prototype.processReset = function()
{
    this.reset();
    for (const ChildItem of this.ChildObjects) {
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
    for (const ChildItem of this.ChildObjects) {
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
