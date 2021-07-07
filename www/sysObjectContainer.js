//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "Container"                                                -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysContainer"
//------------------------------------------------------------------------------

function sysContainer() {

	this.RootObject		= null;
	this.ContainerElements	= Object();

}


//------------------------------------------------------------------------------
//- METHOD "process"
//------------------------------------------------------------------------------

sysContainer.prototype.process = function() {

	this.RootObject = new sysObjBaseDiv();
	this.RootObject.ObjectID = 'sysContainer';
	this.RootObject.DOMStyle = 'sysContainer';

	this.setupContainerElements();
	this.addElements();
	this.connectContainerElements();

	this.RootObject.addObject(this.getFirstContainerElement());

}


//------------------------------------------------------------------------------
//- METHOD "setupContainerElements"
//------------------------------------------------------------------------------

sysContainer.prototype.setupContainerElements = function() {
	var IndexGenerator = this.ElementIndexGenerator();

	var ContainerElements = this.ConfigObject.Object.Attributes.ContainerElements;

	for (ElementKey in ContainerElements) {
		Element = ContainerElements[ElementKey];
		ElementIndex = IndexGenerator.next().value;
		var tmpObject = new sysObjBaseDiv();
		tmpObject.ObjectID = ElementKey;
		tmpObject.DOMStyle = Element.Style;
		this.ContainerElements[ElementIndex] = tmpObject;
	}
}


//------------------------------------------------------------------------------
//- METHOD "addElements"
//------------------------------------------------------------------------------

sysContainer.prototype.addElements = function() {
	var IndexGenerator = this.ElementIndexGenerator();
	var ParentElement = this.getLastContainerElement();

	var Elements = this.ConfigObject.Object.Attributes.Elements;

	for (ElementKey in Elements) {
		Element = Elements[ElementKey];
		var tmpObject = new sysObjBaseDiv();
		tmpObject.ObjectID = ElementKey;
		tmpObject.DOMStyle = Element.Style;
		ParentElement.addObject(tmpObject);
		
	}
}


//------------------------------------------------------------------------------
//- METHOD "connectContainerElements"
//------------------------------------------------------------------------------

sysContainer.prototype.connectContainerElements = function() {

	var IndexGenerator = this.ElementReverseIndexGenerator();

	for (Index of IndexGenerator) {

		var ChildElement = this.ContainerElements[Index];
		var ParentElement = this.ContainerElements[Index-1];

		ParentElement.addObject(ChildElement);
	}

}


//------------------------------------------------------------------------------
//- METHOD "ElementIndexGenerator"
//------------------------------------------------------------------------------

sysContainer.prototype.ElementIndexGenerator = function*() {
	Index = 0;
	while(true) { yield Index++; }
}


//------------------------------------------------------------------------------
//- METHOD "ElementReverseIndexGenerator"
//------------------------------------------------------------------------------

sysContainer.prototype.ElementReverseIndexGenerator = function*() {
	var ObjKeys = Object.keys(this.ContainerElements);
	var Index = ObjKeys.length-1;
	while(Index > 0) { yield Index--; }
}


//------------------------------------------------------------------------------
//- METHOD "getFirstContainerElement"
//------------------------------------------------------------------------------

sysContainer.prototype.getFirstContainerElement = function() {
	return this.ContainerElements[0];
}


//------------------------------------------------------------------------------
//- METHOD "getLastContainerElement"
//------------------------------------------------------------------------------

sysContainer.prototype.getLastContainerElement = function() {
	var ObjKeys = Object.keys(this.ContainerElements);
	LastElementIndex = ObjKeys.length-1;
	var Element = this.ContainerElements[LastElementIndex];
	return Element;
}
