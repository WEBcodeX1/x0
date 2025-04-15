//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
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
	for (const Key in o2) {
		// if processing type Object, recurse
		if (o2[Key].constructor == Object) {
			o1[Key] = sysMergeObjects(o1[Key], o2[Key]);
		}
		else {
			if (Array.isArray(o1[Key]) && Array.isArray(o2[Key])) {
				// append all array elements from o2 to o1
				o2[Key].forEach(item => o1[Key].push(item));
			}
			else {
				// overwrite existent property
				o1[Key] = o2[Key];
			}
		}
	}
	return o1;
}
