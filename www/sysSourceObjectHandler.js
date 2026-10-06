//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "sysSourceObjectHandler"                                   -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysSourceObjectHandler"
//------------------------------------------------------------------------------

function sysSourceObjectHandler()
{
}


//------------------------------------------------------------------------------
//- METHOD "processSourceObjects"
//------------------------------------------------------------------------------

sysSourceObjectHandler.prototype.processSourceObjects = function() {

    const Attributes = this.JSONConfig.Attributes;

    if (Attributes === undefined) { return; }

    const SrcObjects = Attributes.SrcDataObjects;
    console.debug('::processSourceObjects SrcObjects:%o', SrcObjects);

    var ObjectResultData = new Object();

    if (Array.isArray(SrcObjects) == true)
    {
        for (const ObjectID of SrcObjects)
        {
            const ObjectRef = sysFactory.getObjectByID(ObjectID);
            const ObjectRuntimeData = ObjectRef.getObjectData();
            ObjectResultData[ObjectID] = ObjectRuntimeData;
        }
    }

    else {
        for (SrcObjectID in SrcObjects)
        {
            const SourceObject = SrcObjects[SrcObjectID];
            const ScreenID = SourceObject.ScreenID;
            const ScreenObj = (ScreenID != null && ScreenID !== undefined) ? sysFactory.getScreenByID(ScreenID): this.ScreenObject;
            const SrcObjectType = SourceObject.Type;

            //console.debug('::processSourceObjects SrcObjectID:%s ScreenID:%s Type:%s ScreenObject:%o', SrcObjectID, ScreenID, SrcObjectType, ScreenObj);

            try {
                switch (SrcObjectType) {

                    case "SourceObject":
                        ObjectResultData['SourceObjectSelectedColumnId'] = SourceObject.FilterColumn;
                        ObjectResultData['SourceObjectSelectedColumnValue'] = ScreenObj.SourceObjectFilter[SourceObject.FilterColumn];
                        break;

                    case "HardcodedValues":
                        //console.debug('::processSourceObjects Values:%o', SourceObject.Values);
                        for (Key in SourceObject.Values) {
                            ObjectResultData[Key] = SourceObject.Values[Key];
                        }
                        break;

                    case "GlobalObject":
                        var SrcObject = ScreenObj.HierarchyRootObject.getObjectByID(SrcObjectID);
                        ObjectResultData[SrcObjectID] = SrcObject.getObjectData();
                        break;

                    case "ScreenGlobalVar":
                        ObjectResultData[SrcObjectID] = ScreenObj.getGlobalVar(SrcObjectID);
                        break;

                    case "GlobalVar":
                        ObjectResultData[SrcObjectID] = sysFactory.getGlobalVar(SrcObjectID)
                        break;
                }
            }
            catch(err) {
                console.log('::processSourceObjects SrcObjectID:%s err:%s', SrcObjectID, err);
            }
        }
    }
    //console.debug('::processSourceObjects ObjectResultData:%o', ObjectResultData);
    this.PostRequestData.merge(ObjectResultData);
}
