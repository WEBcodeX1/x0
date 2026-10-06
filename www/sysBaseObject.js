//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
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
    this.DOMParentID = Prefix;

    if (this.overrideDOMObjectID !== true) {
        if (Prefix == null) {
            this.DOMObjectID = this.ObjectID;
        }
        else {
            this.DOMObjectID = Prefix + '_' + this.ObjectID;
        }
    }
    else if (this.overrideDOMObjectID === true) {
        this.DOMObjectID = this.ObjectID;
    }

    //- only render if dom object does not exist
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

    //console.debug(':renderObject ObjectID:%s ObjectType:%s DOMStyle:%s Object:%o', this.ObjectID, this.ObjectType, this.DOMStyle, this);

    for (const ChildItem of this.ChildObjects) {
        ChildItem.renderObject(this.DOMObjectID);
    }
}


//------------------------------------------------------------------------------
//- METHOD "rerenderObject"
//------------------------------------------------------------------------------

sysBaseObject.prototype.rerenderObject = function()
{
    this.removeDOMParentElement();
    this.renderObject(this.DOMParentID);
    this.processReset();
}


//------------------------------------------------------------------------------
//- METHOD "processEventListener"
//------------------------------------------------------------------------------

sysBaseObject.prototype.processEventListener = function()
{
    if (this.EventListeners != null || this.EventListeners !== undefined)
    {
        let ListenerKeys = Object.keys(this.EventListeners);
        if (ListenerKeys.length > 0)
        {
            for (const ListenerKey in this.EventListeners)
            {
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

sysBaseObject.prototype.getObjectByID = function(ObjectID)
{
    var Objects = this.getObjects();
    //console.debug('::sysBaseObject getObjectByID:%s Objects:%o', ObjectID, Objects);
    for (const ObjKey in Objects) {
        if (ObjKey == ObjectID) {
            return Objects[ObjKey];
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "getChildObjectByIndex"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getChildObjectByIndex = function(Index)
{
    return this.ChildObjects[Index];
}


//------------------------------------------------------------------------------
//- METHOD "getObjectsByAttribute"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectsByAttribute = function(Attribute)
{
    //console.debug('::getObjectsByAttribute Attribute:%s', Attribute);
    let ResultObjects = new Array();
    let Objects = this.getObjects();
    for (const ObjKey in Objects) {
        let ProcessObject = Objects[ObjKey];
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
//- METHOD "getObjectsByType"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectsByType = function(ObjectType)
{
    let ResultObjects = new Object();
    let Objects = this.getObjects();

    for (const ObjKey in Objects)
    {
        const ObjectItem = Objects[ObjKey];
        console.debug('BaseObject::getObjectsByType Loop CheckType:%s ObjKey:%s', ObjectType, ObjKey);
        //console.debug('BaseObject::getObjectsByType Loop ObjKey:%s ObjectItem:%o', ObjKey, ObjectItem);
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

    for (const ChildItem of this.ChildObjects)
    {
        RItems = ChildItem.getObjects();
        Items[ChildItem.ObjectID] = ChildItem;
        for (const RItemKey in RItems) {
            RItem = RItems[RItemKey];
            Items[RItem.ObjectID] = RItem;
        }
    }
    return Items;
}


//------------------------------------------------------------------------------
//- METHOD "getChildIndexByChildItemID"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getChildIndexByChildItemID = function(CheckID)
{
    for (const [ObjectIndex, ChildItem] of this.ChildObjects.entries())
    {
        console.debug('check ChildItem.ObjectID:%s == CheckID:%s Index:', ChildItem.ObjectID, CheckID, ObjectIndex);
        if (ChildItem.ObjectID == CheckID) {
            return ObjectIndex;
        }
    }
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

    /*
    for (const ChildItem of this.ChildObjects) {
        ChildItem.setActivated();
    }
    */
}


//------------------------------------------------------------------------------
//- METHOD "setDeactivated"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setDeactivated = function()
{
    this.Deactivated = true;

    /*
    for (const ChildItem of this.ChildObjects) {
        ChildItem.setDeactivated();
    }
    */
}


//------------------------------------------------------------------------------
//- METHOD "remove"
//------------------------------------------------------------------------------

sysBaseObject.prototype.remove = function()
{
    const ChildItemIndex = this.ParentObject.getChildIndexByChildItemID(this.ObjectID);
    this.ParentObject.ChildObjects.splice(ChildItemIndex, 1);
    console.debug('::remove ChildItemIndex:%s ChildObjects:%o', ChildItemIndex, this.ParentObject.ChildObjects);
    this.removeDOMElement();
}


//------------------------------------------------------------------------------
//- METHOD "removeParent"
//------------------------------------------------------------------------------

sysBaseObject.prototype.removeParent = function()
{
    //console.debug('::remove ObjectID:%s DOMObjectID:%s this:%o', this.ObjectID, this.DOMObjectID, this);
    try {
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

var getObjectDataRecursiveResultData = new Object();
var getObjectDataRecursiveParentDataObject = null;

sysBaseObject.prototype.getObjectData = function()
{
    if (this.GetDataMechanism == 'Plain') {
        this.RuntimeGetDataFunc(Data);
    }
    else {
        getObjectDataRecursiveResultData = {};
        this.getObjectDataRecursive();
        console.debug('::sysBaseObject getObjectData() getObjectResultData:%o', getObjectDataRecursiveResultData);
        return getObjectDataRecursiveResultData;
    }
}


//------------------------------------------------------------------------------
//- METHOD "getObjectDataRecursive"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getObjectDataRecursive = function()
{
    if (typeof this.RuntimeGetDataFunc === 'function') {
        getObjectDataRecursiveResultData[this.ObjectID] = {
            "ObjectType": this.ObjectType,
            "ParentObject": this.ParentObject,
            "ParentDataObject": getObjectDataRecursiveParentDataObject,
            "KeyID": this.KeyID,
            "ObjectValue": this.RuntimeGetDataFunc()
        }
        getObjectDataRecursiveParentDataObject = this.ObjectID;
    }
    else {
        for (const ChildItem of this.ChildObjects) {
            ChildItem.getObjectDataRecursive();
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "getObjectDataRecursive"
//------------------------------------------------------------------------------

/*
sysBaseObject.prototype.getObjectDataRecursive = function()
{
    let Result = new Object();
    if (typeof this.RuntimeGetDataFunc === 'function') {
        Result[this.ObjectID] = this.RuntimeGetDataFunc();
    }
    else {
        let RecursiveResult = new Object();
        for (const ChildItem of this.ChildObjects) {
            let ChildResult = ChildItem.getObjectDataRecursive();
            for (const Key in ChildResult) {
                RecursiveResult[Key] = ChildResult[Key];
            }
        }
        Result[this.ObjectID] = RecursiveResult;
    }
    return Result;
}
*/


//------------------------------------------------------------------------------
//- METHOD "setObjectData"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setObjectData = function(Data)
{
    if (this.SetDataMechanism == 'Plain') {
        this.RuntimeSetDataFunc(Data);
    }
    else if (this.SetDataMechanism == 'KeyValue') {
        this.setObjectDataKeyValueRecursive(Data);
    }
}


//------------------------------------------------------------------------------
//- METHOD "setObjectDataKeyValueRecursive"
//------------------------------------------------------------------------------

sysBaseObject.prototype.setObjectDataKeyValueRecursive = function(Data)
{
    console.debug('::setObjectDataKeyValue Data:%o this.KeyID:%s this.DOMValue:%s', Data, this.KeyID, this.ObjectID, this.DOMValue);
    const KeyIDValue = this.getKeyIDValueFromData(Data, this.KeyID);
    if (KeyIDValue !== undefined && typeof this.RuntimeSetDataFunc === 'function') {
        this.RuntimeSetDataFunc(KeyIDValue);
    }
    else {
        for (const ChildItem of this.ChildObjects) {
            ChildItem.setObjectDataKeyValueRecursive(Data);
        }
    }
}


//------------------------------------------------------------------------------
//- METHOD "getKeyIDValueFromData"
//------------------------------------------------------------------------------

sysBaseObject.prototype.getKeyIDValueFromData = function(Data, CheckKeyID)
{
    for (const DataKey in Data)
    {
        const DataItem = Data[DataKey];
        if (DataItem.KeyID == CheckKeyID) {
            return DataItem.ObjectValue;
        }
    }
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
//- METHOD "enableDOMElementRecursive"
//------------------------------------------------------------------------------

sysBaseObject.prototype.enableDOMElementRecursive = function()
{
    //- do not enable deactivated objects
    if (this.Deactivated !== true) {
        this.enableDOMElement();
    }
    for (const ChildItem of this.ChildObjects) {
        ChildItem.enableDOMElementRecursive();
    }
}


//------------------------------------------------------------------------------
//- METHOD "disableDOMElementRecursive"
//------------------------------------------------------------------------------

sysBaseObject.prototype.disableDOMElementRecursive = function()
{
    this.disableDOMElement();
    for (const ChildItem of this.ChildObjects) {
        ChildItem.disableDOMElementRecursive();
    }
}
