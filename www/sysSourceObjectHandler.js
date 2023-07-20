//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2021                                 -//
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

	if (this.JSONConfig.Attributes === undefined) {
		return;
	}

	var Objects = this.JSONConfig.Attributes.SrcDataObjects;
	//console.debug('::processSourceObjects Objects:%o', Objects);

	var ObjectResultData = new Object();
	// array processing
	if (Array.isArray(Objects) === true) {

		for (Index in Objects) {
			var ObjectID = Objects[Index];
			const ObjectRef = sysFactory.getObjectByID(ObjectID);
			console.debug('SourceObjectHandler Object:%o', ObjectRef);

			ObjectID = ObjectID.replace('__overlay', '');

			//- Formfields (ParentObject handling) should be generic and put somewhere else
			var ObjectRuntimeData;
			try {
				ObjectRuntimeData = ObjectRef.ParentObject.getObjectData();
			}
			catch(err) {
				ObjectRuntimeData = ObjectRef.getObjectData();
			}

			ObjectResultData[ObjectID] = ObjectRuntimeData;

			//- backward compatibility ("plain" data handling)
			if (typeof(ObjectRuntimeData) == 'object') {
				for (Key in ObjectRuntimeData) {
					ObjectResultData[Key] = ObjectRuntimeData[Key];
				}
			}
		}
	}

	else {
		for (SrcObjectID in Objects) {

			const SourceObject = Objects[SrcObjectID];
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

					/*
					case "FormfieldList":

						const ProcessObject = ScreenObj.HierarchyRootObject.getObjectByID(SrcObjectID);
						const FormfieldListResultData = ProcessObject.getFormFieldItemData();

						for (Key in FormfieldListResultData) {
							ObjectResultData[Key] = FormfieldListResultData[Key];
						}

						continue;

					case "Formfield":

						const FormfieldItem = sysFactory.getFormFieldObjectByID(SrcObjectID);
						const FormfieldResultData = FormfieldItem.getObjectData();
						ObjectResultData[SrcObjectID] = FormfieldResultData;
						//console.debug('::processSourceObjects Type:Formfield SrcObjectID:%s ResultData:%o', SrcObjectID, FormfieldResultData);

						continue;

					case "List":

						var ListObject = ScreenObj.HierarchyRootObject.getObjectByID(SrcObjectID);
						ObjectResultData[SrcObjectID] = ListObject.getObjectData();

						continue;
					*/

					case "FileUpload":

						var SrcObject = ScreenObj.HierarchyRootObject.getObjectByID(SrcObjectID);
						ObjectResultData[SrcObjectID] = SrcObject.getObjectData();

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
