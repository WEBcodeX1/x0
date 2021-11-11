//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX 2011 - 2021                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "TooltipHandler"                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Renders Tooltip Layer and handles logic/movement                         -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysTootipHandler"
//------------------------------------------------------------------------------

function sysTooltipHandler() {
	this.DOMObjectID	= 'SYSGlobalTooltips';	// DOM Object ID
}


//------------------------------------------------------------------------------
//- METHOD "initLayer"
//------------------------------------------------------------------------------

sysTooltipHandler.prototype.initLayer = function()
{

    /*
	//- Construct DIV html
	var tmpdiv;

	tmpdiv = document.createElement('div');

	tmpdiv.setAttribute('id', this.DOMObjectID);

	tmpdiv.style.left			= '0px';
	tmpdiv.style.top			= '0px';
	tmpdiv.style.width			= '800px';
	tmpdiv.style.zIndex			= 20;
	tmpdiv.style.transition		= 'all .5s';

	tmpdiv.style.position		= 'absolute';

	tmpdiv.style.padding		= '0px';

	tmpdiv.style.opacity		= 0.9;

    tmpdiv.setAttribute('class', 'tooltip');

    tmpdiv.innerHTML			= '';

	//- Append DIV to DOM body
	document.body.appendChild(tmpdiv);
    */
}
