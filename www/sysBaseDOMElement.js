//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2021                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "BaseDOMElement"                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysBaseDOMElement"
//------------------------------------------------------------------------------

function sysBaseDOMElement()
{
	this.DOMDivElement	= null;

	this.DOMValue		= null;
	this.DOMStyle		= null;
}


//------------------------------------------------------------------------------
//- METHOD "createDOMElement"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.createDOMElement = function()
{
	var Element = document.createElement(this.DOMType);
	Element.setAttribute('id', this.DOMObjectID);
	this.DOMDivElement = Element;
}


//------------------------------------------------------------------------------
//- METHOD "setDOMAttribute"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.setDOMAttribute = function(Attribute, Value)
{
	try {
		var divElement = document.getElementById(this.DOMObjectID);
		divElement.setAttribute(Attribute, Value);
	}
	catch(err) {
		console.debug('::setDOMAttribute DOMObjectID:%s err:%s', this.DOMObjectID, err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "appendDOMParentElement"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.appendDOMParentElement = function()
{
	//console.log('::appendDOMParentElement DOMObjectID:%s ObjectID:%s DOMParentID:%s', this.DOMObjectID, this.ObjecttID, this.DOMParentID);
	try {
        if (this.DOMParentID == null || this.DOMParentID === undefined) {
			document.body.appendChild(this.DOMDivElement);
		}
		else {
			var parentElement = document.getElementById(this.DOMParentID);
			parentElement.appendChild(this.DOMDivElement);
		}
    }
	catch(err) {
		console.debug('::appendDOMParentElement err:%s', err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "removeDOMParentElement"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.removeDOMParentElement = function()
{
	//console.log('::removeDOMParentElement DOMParentID:%s', this.DOMParentID);
	if (this.DOMParentID == null || this.DOMParentID === undefined) {
		document.body.removeChild(this.DOMDivElement);
	}
	else {
		//console.log('::removeDOMParentElement DOMParentID:%s', this.DOMParentID);
		var parentElement = document.getElementById(this.DOMParentID);
		parentElement.removeChild(this.DOMDivElement);
	}
}


//------------------------------------------------------------------------------
//- METHOD "removeDOMElement"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.removeDOMElement = function()
{
	try {
		document.body.remove(document.getElementById(this.DOMDivElement));
	}
	catch(err) {
		console.debug('::removeDOMElement failed err:%s', err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "setDOMElementValue"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.setDOMElementValue = function()
{
	//console.debug('::setDOMElementValue this:%o', this);
	if (this.DOMValue != null && this.DOMValue !== undefined) {
		var divElement = document.getElementById(this.DOMObjectID);
		if (divElement != null && divElement !== undefined) {
			divElement.innerHTML = this.DOMValue;
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "setDOMElementStyle"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.setDOMElementStyle = function()
{
	try {
		if (this.DOMStyle !== undefined && this.DOMStyle != null) {
			// set main object style class (this.DOMStyle)
			const Element = document.getElementById(this.DOMObjectID);
			Element.setAttribute('class', this.DOMStyle);
		}
	}
	catch(err) {
		console.debug('::setDOMElementStyle err:%s', err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "setDOMElementStyleAttributes"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.setDOMElementStyleAttributes = function()
{
	const divElement = document.getElementById(this.DOMObjectID);

	//console.debug('set Style Attributes: Element:%o, DOMObjectID:%s Top:%s Left:%s', divElement, this.DOMObjectID, this.DOMStyleTop, this.DOMStyleLeft);

	if (divElement !== undefined && divElement != null) {
		if (this.DOMStyleZIndex != null) {		divElement.style.zIndex			= this.DOMStyleZIndex; }
		if (this.DOMStyleTop != null) {			divElement.style.top			= this.DOMStyleTop; }
		if (this.DOMStyleLeft != null) {		divElement.style.left			= this.DOMStyleLeft; }
		if (this.DOMStyleWidth != null) {		divElement.style.width			= this.DOMStyleWidth; }
		if (this.DOMStyleHeight != null) {		divElement.style.height			= this.DOMStyleHeight; }
	}
}


//------------------------------------------------------------------------------
//- METHOD "setDOMElementZIndex"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.setDOMElementZIndex = function()
{
	const divElement = document.getElementById(this.DOMObjectID);    
	if (divElement !== undefined && divElement != null && this.DOMStyleZIndex != null) {
		divElement.style.zIndex = this.DOMStyleZIndex;
	}
}


//------------------------------------------------------------------------------
//- METHOD "setDOMAttributes"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.setDOMAttributes = function()
{
	const divElement = document.getElementById(this.DOMObjectID);

	//console.debug('set Style Attributes: Element:%o, DOMObjectID:%s Top:%s Left:%s', divElement, this.DOMObjectID, this.DOMStyleTop, this.DOMStyleLeft);

	for (AttrKey in this.DOMAttributes) {
		AttrValue = this.DOMAttributes[AttrKey];
		this.setDOMAttribute(AttrKey, AttrValue);
	}
}


//------------------------------------------------------------------------------
//- METHOD "addDOMElementStyle"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.addDOMElementStyle = function(StyleClass)
{
	try {
		//const Element = document.getElementById(this.DOMObjectID);
		const Element = this.getElement();
		//console.debug('addDOMElementStyle ObjectID:%s DOMObjectID:%s', this.ObjectID, this.DOMObjectID);
		if (Element !== undefined && Element != null) {
			Element.classList.add(StyleClass);
		}
	}
	catch(err) {
		console.debug('addDOMElementStyle err:%s ObjectID:%s DOMObjectID:%s', err, this.ObjectID, this.DOMObjectID);
	}
}


//------------------------------------------------------------------------------
//- METHOD "removeDOMElementStyle"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.removeDOMElementStyle = function(StyleClass)
{

	try {
		//const Element = document.getElementById(this.DOMObjectID);
		const Element = this.getElement();

		if (Element !== undefined && Element != null && Element.classList.contains(StyleClass)) {
			Element.classList.remove(StyleClass);
		}
	}

	catch(err) {
		console.debug('removeDOMElementStyle err:%s ObjectID:%s DOMObjectID:%s', err, this.ObjectID, this.DOMObjectID);
	}
}


//------------------------------------------------------------------------------
//- METHOD "addDOMElementStyleSysObject"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.addDOMElementStyleSysObject = function(StyleClass)
{
	try {
		const SysObject = sysFactory.getObjectByID(this.ObjectID);
		const Element = document.getElementById(SysObject.DOMObjectID);
		if (Element !== undefined && Element != null) {
			Element.classList.add(StyleClass);
		}
	}
	catch(err) {
		console.debug('addDOMElementStyleSysObject err:%s ObjectID:%s', err, this.ObjectID);
	}
}


//------------------------------------------------------------------------------
//- METHOD "checkDOMHasStyle"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.checkDOMHasStyle = function(StyleClass)
{
	const Element = document.getElementById(this.DOMObjectID);
	if (Element !== undefined) {
		return (Element.classList.contains(StyleClass)) ? true:false;
	}
}


//------------------------------------------------------------------------------
//- METHOD "getDOMStyleClasses"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.getDOMStyleClasses = function()
{
	const Element = this.getSysElement();
	if (Element !== undefined && Element != null) { return Element.className; }
}


//------------------------------------------------------------------------------
//- METHOD "setDOMStyleClasses"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.setDOMStyleClasses = function(ClassNames)
{
	const Element = this.getSysElement();
	if (Element !== undefined && Element != null) { Element.className = ClassNames; }
}


//------------------------------------------------------------------------------
//- METHOD "checkDOMElementExists"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.checkDOMElementExists = function(ElementID)
{
	const Element = document.getElementById(ElementID);
	return (Element == null || Element === undefined) ? false: true;
}


//------------------------------------------------------------------------------
//- METHOD "setDOMVisibleState"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.setDOMVisibleState = function(VisibleState)
{
	if (VisibleState == 'visible' || VisibleState == 'hidden') {
		const Element = this.getElement();
		//console.debug('::setDOMVisibleState ObjectID:%s DOMObjectID:%s Element:%o', this.ObjectID, this.DOMObjectID, Element);
		try {
			if (VisibleState == 'visible') {
				Element.style.removeProperty('display');
				//Element.style.display = 'block';
			}
			if (VisibleState == 'hidden') {
				Element.style.display = 'none';
			}
		}
		catch(err) {
			//console.debug('::setDOMVisibleState err:%s SetState:%s ObjectID:%s', err, VisibleState, this.ObjectID);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "switchDOMVisibleState"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.switchDOMVisibleState = function()
{
	const VisibleState = this.getElement().style.visibility;
	//console.log('VisibleState:' + VisibleState);
	try {
		if (VisibleState == "hidden") {
			this.setDOMVisibleState("visible");
		}
		if (VisibleState == '' || VisibleState == 'visible') {
			this.setDOMVisibleState("hidden");
		}
	}
	catch(err) {
		console.debug('::switchDOMVisibleState err:%s', err);
	}
	
}


//------------------------------------------------------------------------------
//- METHOD "getDOMVisibleState"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.getDOMVisibleState = function()
{
	return document.getElementById(this.DOMObjectID).style.display;
}


//------------------------------------------------------------------------------
//- METHOD "enableDOMElement"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.enableDOMElement = function()
{
	document.getElementById(this.DOMObjectID).disabled = false;
}


//------------------------------------------------------------------------------
//- METHOD "disableDOMElement"
//------------------------------------------------------------------------------

sysBaseDOMElement.disableDOMElement = function()
{
	document.getElementById(this.DOMObjectID).disabled = true;
}


//------------------------------------------------------------------------------
//- METHOD "getDOMValue"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.getDOMValue = function()
{
	try {
		const Element = this.getDOMelement();

		if (this.DIVType == 'FormFieldContainer') {
			return Element.value;
		}
		//console.debug('::getDOMValue Element:%o Element innerHTML:%s', Element, Element.innerHTML);
		return (Element == null) ? '': Element.innerHTML;
	}
	catch(err) {
		console.debug('::getDOMValue err:%s', err);
	}
}


//------------------------------------------------------------------------------
//- METHOD "DOMaddEventListener"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.DOMaddEventListener = function(Type, Destination)
{
	try {
		const ElementID = this.DOMObjectID;
		const Element = document.getElementById(ElementID);
		Element.addEventListener(Type, Destination);
	}
	catch(err) {
		console.debug('::addEventListener err:%s ObjectID:%s DOMObjectID:%s', err, this.ObjectID, this.DOMObjectID);
	}
}


//------------------------------------------------------------------------------
//- METHOD "getDOMelement"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.getDOMelement = function()
{
	return this.getElement();
}


//------------------------------------------------------------------------------
//- METHOD "getElement"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.getElement = function()
{
	const ElementID = (this.DIVType == 'FormFieldContainer') ? this.ObjectID: this.DOMObjectID;
	return document.getElementById(ElementID);
}
