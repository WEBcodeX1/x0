//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "BaseDOMFormElement"                                       -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysBaseDOMFormElement"
//------------------------------------------------------------------------------

function sysBaseDOMFormElement() {
}

//- inherit sysBaseDOMElement
sysBaseDOMFormElement.prototype = new sysBaseDOMElement();


//------------------------------------------------------------------------------
//- METHOD "DOMPulldownAddOption"
//------------------------------------------------------------------------------

sysBaseDOMFormElement.prototype.DOMPulldownAddOption = function(Var, Value) {

	var PulldownObj = document.getElementById(this.DOMObjectID);
	var PulldownOption = document.createElement("option");

	PulldownOption.text = Var;
	PulldownOption.value = Value;
	PulldownObj.options.add(PulldownOption);

}


//------------------------------------------------------------------------------
//- METHOD "DOMPulldownReset"
//------------------------------------------------------------------------------

sysBaseDOMFormElement.prototype.DOMPulldownReset = function() {

	var PulldownObj = document.getElementById(this.DOMObjectID);
	var PulldownObjItemCount = PulldownObj.length;

	for (var i=0; i<PulldownObjItemCount; i++) {
		PulldownObj.options.remove(i);
	}

}


//------------------------------------------------------------------------------
//- METHOD "DOMPulldownSetValue"
//------------------------------------------------------------------------------

sysBaseDOMFormElement.prototype.DOMPulldownSetValue = function() {

	//console.debug('DomPulldownSetValue Value:' + this.DOMValue);
	if (this.DOMValue !== undefined) {
		//- cast to string
		var SetValue = this.DOMValue.toString();

		//- get pulldown dom object
		var PulldownObj = document.getElementById(this.ObjectID);

		//- iterate on pulldown options, compare values
		for (var i=0; i < PulldownObj.options.length; i++) {
			if (PulldownObj.options[i].value == SetValue) {
				PulldownObj.selectedIndex = i;
			}
		}
	}

}


//------------------------------------------------------------------------------
//- METHOD "DOMPulldownGetValue"
//------------------------------------------------------------------------------

sysBaseDOMFormElement.prototype.DOMPulldownGetValue = function() {

	//- get pulldown dom object
	var PulldownObj = document.getElementById(this.ObjectID);

	try {
		return PulldownObj.options[PulldownObj.selectedIndex].value;
	}
	catch(err) {
		console.debug('::DOMPulldownGetValue error:%s DOMObjectID:%o', err, this.ObjectID);
	}

}


//------------------------------------------------------------------------------
//- METHOD "DOMCheckboxGetChecked"
//------------------------------------------------------------------------------

sysBaseDOMFormElement.prototype.DOMCheckboxGetChecked = function() {
	const CheckboxObj = document.getElementById(this.ObjectID);
	return CheckboxObj.checked;
}


//------------------------------------------------------------------------------
//- METHOD "DOMCheckboxSetChecked"
//------------------------------------------------------------------------------

sysBaseDOMFormElement.prototype.DOMCheckboxSetChecked = function() {
	const CheckboxObj = document.getElementById(this.ObjectID);
	CheckboxObj.checked = (this.DOMValue == 'True') ? true : false;
}

//------------------------------------------------------------------------------
//- METHOD "setDOMFormElement"
//------------------------------------------------------------------------------

sysBaseDOMFormElement.prototype.setDOMFormElementValue = function()
{
	if (this.DOMValue !== undefined && this.DOMValue != null) {
		try {
			const divElement = document.getElementById(this.ObjectID);
			//console.debug('::setDOMFormElementValue ObjectID:%s Value:%s DIVElement:%o', this.ObjectID, this.DOMValue, divElement);
			divElement.value = this.DOMValue;
		}
		catch(err) {
			console.debug('::setDOMFormElementValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.ObjectID, err);
		}
	}
}


//------------------------------------------------------------------------------
//- METHOD "getDOMFormElement"
//------------------------------------------------------------------------------

sysBaseDOMFormElement.prototype.getDOMFormElementValue = function()
{
    try {
        return document.getElementById(this.ObjectID).value;
    }
    catch(err) {
		console.debug('::getDOMFormElementValue DOMObjectID:%s ObjectID:%s err:%s', this.DOMObjectID, this.ObjectID, err);
    }
}


//------------------------------------------------------------------------------
//- METHOD "DOMFormElementAddStyle"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.DOMFormElementAddStyle = function(StyleClass)
{
	try {
		const FormElement = document.getElementById(this.ObjectID);
		FormElement.classList.add('class', StyleClass);
	}
	catch(err) {
		console.debug('::DOMFormElementAddStyle err:%s ObjectID:%s DOMObjectID:%o', err, this.ObjectID, this.DOMObjectID);
	}
}


//------------------------------------------------------------------------------
//- METHOD "DOMFormElementRemoveStyle"
//------------------------------------------------------------------------------

sysBaseDOMElement.prototype.DOMFormElementRemoveStyle = function(StyleClass)
{
	try {
		var FormElement = document.getElementById(this.ObjectID);

		if (FormElement.classList.contains(StyleClass)) {
			FormElement.classList.remove(StyleClass);
		}
	}
	catch(err) {
		console.debug('DOMFormElementRemoveStyle err:%s ObjectID:%s DOMObjectID:%o', err, this.ObjectID, this.DOMObjectID);
	}
}
