//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
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

function sysSourceObjectHandler() {
}


//------------------------------------------------------------------------------
//- METHOD "processSourceObjects"
//------------------------------------------------------------------------------

sysSourceObjectHandler.prototype.processSourceObjects = function() {

	//console.debug('::processSourceObjects Object:%s this.JSONConfig:%o', this.ObjectID, this.JSONConfig);

	const Attributes = this.JSONConfig.Attributes;

	if (Attributes === undefined) { return; }

	const SrcObjects = Attributes.SrcDataObjects;
	console.debug('::processSourceObjects SrcObjects:%o', SrcObjects);

	var ObjectResultData = new Object();

	if (Array.isArray(SrcObjects) == true) {
		for (Index in SrcObjects) {
			const ObjectID = SrcObjects[Index];
			console.debug('::processSourceObjects ObjectID:%s', ObjectID);
			const ObjectRef = sysFactory.getObjectByID(ObjectID);
			console.debug('::processSourceObjects Object:%o', ObjectRef);

			//ObjectID = ObjectID.replace('__overlay', '');

			const ObjectRuntimeData = ObjectRef.getObjectData();
			ObjectResultData[ObjectID] = ObjectRuntimeData;
		}
	}

	else {
		for (SrcObjectID in SrcObjects) {

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

						continue;

					case "HardcodedValues":

						//console.debug('::processSourceObjects Values:%o', SourceObject.Values);

						for (Key in SourceObject.Values) {
							ObjectResultData[Key] = SourceObject.Values[Key];
						}

						continue;

					case "GlobalObject":

						var SrcObject = ScreenObj.HierarchyRootObject.getObjectByID(SrcObjectID);
						ObjectResultData[SrcObjectID] = SrcObject.getObjectData();
			
						continue;

					case "ScreenGlobalVar":

						ObjectResultData[SrcObjectID] = ScreenObj.getGlobalVar(SrcObjectID);
						continue;

					case "GlobalVar":
						// implement on refactoring
						continue;

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
