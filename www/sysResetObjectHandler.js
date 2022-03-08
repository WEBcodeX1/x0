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

	const Objects = this.JSONConfig.Attributes.ResetObjects;
	//console.debug('ResetObjectHandler Objects:%o', Objects);

	if (Objects != null && Objects !== undefined) {

		for (ResetObjectID in Objects) {

			//console.debug('ResetObjectHandler ObjectID:%s', ResetObjectID);

			const ScreenID = Objects[ResetObjectID];
			const ScreenObj = (ScreenID != null && ScreenID !== undefined) ? sysFactory.getScreenByID(ScreenID): sysFactory.getScreenByID(sysFactory.CurrentScreenID);

			try {
				ScreenObj.HierarchyRootObject.getObjectByID(ResetObjectID).reset();
			}
			catch(err) {
				console.debug('::ResetObjectHandler err:%s', err);
			}
		}

	}

}
