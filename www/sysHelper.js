//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2021                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "Helper" Functions                                                -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Helper Functions                                                         -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- METHOD "sysMergeObjects"
//------------------------------------------------------------------------------
sysMergeObjects = function(Object1, Object2) {
    let o1 = Object.assign({}, Object1);
    let o2 = Object.assign({}, Object2);
	for (var Key in o2) {
		// if processing type Object, recurse
		if (o2[Key].constructor == Object) {
			o1[Key] = sysMergeObjects(o1[Key], o2[Key]);
		}
		else {
			// overwrite existent property
			o1[Key] = o2[Key];
		}
	}
	return o1;
}
