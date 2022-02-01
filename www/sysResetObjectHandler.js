//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "sysResetObjectHandler"                                    -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysResetObjectHandler"
//------------------------------------------------------------------------------

function sysResetObjectHandler() {
}


//------------------------------------------------------------------------------
//- METHOD "processResetObjects"
//------------------------------------------------------------------------------

sysResetObjectHandler.prototype.processResetObjects = function() {

	var Objects = this.JSONConfig.Attributes.ResetObjects;
	//console.log('ResetObjectHandler Objects:%o', Objects);

	if (Objects != null && Objects !== undefined) {

		for (ResetObjectID in Objects) {

			//console.log('ResetObjectHandler');
			//console.log(ResetObjectIndex);

			//var ResetObjectID = Objects[ResetObjectIndex];
			console.log('ResetObjectHandler ObjectID:%s', ResetObjectID);

			var ScreenID = Objects[ResetObjectID];
			//console.log(ScreenID);

			var ScreenObj = (ScreenID != null && ScreenID !== undefined) ? sysFactory.getScreenByID(ScreenID): sysFactory.getScreenByID(sysFactory.CurrentScreenID);
			//console.log(ScreenObj);

			var TmpObject = ScreenObj.HierarchyRootObject.getObjectByID(ResetObjectID);
			//console.log(TmpObject);
			//console.log(TmpObject.ObjectType);

			var ObjectType = TmpObject.ObjectType;

			switch (ObjectType) {

				case "List":
					TmpObject.BaseObject.reset();
					break;

				case "TabContainer":
					TmpObject.TabContainerObject.reset();
					break;

				case "FormFieldList":
					TmpObject.BaseObject.reset();
					break;

			}

		}

	}

}
