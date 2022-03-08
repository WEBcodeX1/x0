//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 -2021                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- System Object Loader                                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//

//------------------------------------------------------------------------------
//- Main
//------------------------------------------------------------------------------

function sysObjectLoader(FactoryObj) {

	this.Objects	= new Array();		//- Loader Objects
	this.Factory	= FactoryObj;		//- Factory Reference

}


//------------------------------------------------------------------------------
//- METHOD "add"
//------------------------------------------------------------------------------

sysObjectLoader.prototype.add = function(Object)
{
	this.Objects.push(Object);
}


//------------------------------------------------------------------------------
//- METHOD "checkLoaded"
//------------------------------------------------------------------------------

sysObjectLoader.prototype.checkLoaded = function()
{
	LoadedCount = 0;

	for (var ObjIndex in this.Objects) {
		if (this.Objects[ObjIndex].DataReadyState) {
			LoadedCount++;
		}
	}

	if (LoadedCount == this.Objects.length) {
		this.Factory.init();
	}
}
