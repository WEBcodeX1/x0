//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "NavigateForwardBackward"                                  -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjWizardNavigateForwardBackward"
//------------------------------------------------------------------------------

function sysObjNavigateForwardBackward() {
    this.EventListeners		= new Object();
	this.ChildObjects		= new Array();
}

sysObjNavigateForwardBackward.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------
sysObjNavigateForwardBackward.prototype.init = function() {

	var Attributes = this.JSONConfig.Attributes;

	this.DOMStyle = Attributes.Style;

	//console.log('::init Attributes:%o', Attributes);

    var ButtonGlobalAttributes = Attributes.AttributesButtonGlobal;
	var ButtonBackwardAttributes = Attributes.AttributesButtonBackward;
	var ButtonForwardAttributes = Attributes.AttributesButtonForward;

    //console.debug('::init Merged ObjectID:%s ABackward:%o AForward:%o', this.ObjectID, ButtonBackwardAttributes, ButtonForwardAttributes);

	if (ButtonBackwardAttributes !== undefined) {
        var ButtonBackwardMergedAttributes = sysMergeObjects(ButtonGlobalAttributes, ButtonBackwardAttributes);
		//console.debug('::init Merged Button Backward ObjectID:%o AGlobal:%o ABackward:%o AMerged:%o', this.ObjectID, ButtonGlobalAttributes, ButtonBackwardAttributes, ButtonBackwardMergedAttributes);
        var ButtonBack = new sysObjButtonInternal();
		ButtonBack.ObjectID = this.ObjectID + 'BtBack';
        ButtonBack.JSONConfig = { "Attributes": ButtonBackwardMergedAttributes };
        ButtonBack.ScreenObject = this.ScreenObject;
        ButtonBack.init();
        this.addObject(ButtonBack);
	}

	if (ButtonForwardAttributes !== undefined) {
        var ButtonForwardMergedAttributes = sysMergeObjects(ButtonGlobalAttributes, ButtonForwardAttributes);
		//console.debug('::init Merged Button Forward ObjectID:%o AGlobal:%o ABackward:%o AMerged:%o', this.ObjectID, ButtonGlobalAttributes, ButtonForwardAttributes, ButtonForwardMergedAttributes);
		var ButtonForward = new sysObjButtonInternal();
		ButtonForward.ObjectID = this.ObjectID + 'BtForward';
        ButtonForward.JSONConfig = { "Attributes": ButtonForwardMergedAttributes };
        ButtonForward.ScreenObject = this.ScreenObject;
        ButtonForward.init();
        this.addObject(ButtonForward);
	}
}
