//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM RUNTIME OBJECT "Pagination"                                       -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysPagination"
//------------------------------------------------------------------------------

function sysPagination(ParentObject)
{
	this.ChildObjects 		= new Array();		//- Child Objects
	this.ParentObject 		= ParentObject;		//- Parent Object
	this.CurrentPage		= 0;				//- Current Page
	this.PageCount			= 0;				//- Page Count
}

sysPagination.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "setPageCount"
//------------------------------------------------------------------------------

sysPagination.prototype.setPageCount = function()
{
	const Parent = this.ParentObject;
	this.PageCount = Math.ceil(Parent.RowItems.length / Parent.DisplayRows);
}


//------------------------------------------------------------------------------
//- METHOD "render"
//------------------------------------------------------------------------------

sysPagination.prototype.render = function()
{
	this.ChildObjects = new Array();

	this.DOMStyle = 'row allign-items-center m-1';
	this.ObjectID = 'nav-row';

	this.setPageCount();

	if (this.DOMParentID !== null) {
		this.removeParent();
	}

	var NavLeftButton = new sysObjButtonCallback();
	NavLeftButton.setCallback(this, 'navLeft');

	var NavRightButton = new sysObjButtonCallback();
	NavRightButton.setCallback(this, 'navRight');

	const ButtonLeftObjs = {
		"id": "bt-left-ct",
		"SysObject": new sysObjDiv(),
		"JSONAttributes": {
			"DOMType": "li",
			"Style": "page-item"
		},
		"ObjectDefs": [
			{
				"id": "bt-left",
				"SysObject": NavLeftButton,
				"JSONAttributes": {
					"DOMType": "a",
					"Style": "page-link",
					"IconStyle": "fa-solid fa-angle-left",
					"TextID": "TXT.BUTTON.LEFT"
				}
			}
		]
	};

	const ButtonRightObjs = {
		"id": "bt-right-ct",
		"SysObject": new sysObjDiv(),
		"JSONAttributes": {
			"DOMType": "li",
			"Style": "page-item"
		},
		"ObjectDefs": [
			{
				"id": "button-right",
				"SysObject": NavRightButton,
				"JSONAttributes": {
					"DOMType": "a",
					"Style": "page-link",
					"IconStylePost": "fa-solid fa-angle-right",
					"TextID": "TXT.BUTTON.RIGHT"
				}
			}
		]
	};

	PageItems = [];

	PageItems.push(ButtonLeftObjs);

	for (let i=0; i<this.PageCount; i++) {

		const NavIndex = (i+1);
		var NavIndexButton = new sysObjButtonCallback();
		NavIndexButton.setCallback(this, 'navIndex', i);

		console.log('i:%s current:%s', i, this.CurrentPage);
		var NavHilite = '';
		if (i == this.CurrentPage) { NavHilite = ' active'; }

		var PageItemTpl =  {
			"id": "bt-page-item-" + NavIndex,
			"SysObject": new sysObjDiv(),
			"JSONAttributes": {
				"DOMType": "li",
				"Style": "page-item"
			},
			"ObjectDefs": [
				{
					"id": "button-right",
					"SysObject": NavIndexButton,
					"JSONAttributes": {
						"DOMType": "a",
						"Style": "page-link" + NavHilite,
						"DOMValue": NavIndex
					}
				}
			]
		};

		PageItems.push(PageItemTpl);

	}

	PageItems.push(ButtonRightObjs);

	ObjDef = [
		{
			"id": "pages-sum-col",
			"SysObject": new sysObjDiv(),
			"JSONAttributes": {
				"Style": "col"
			},
			"ObjectDefs": [
				{
					"id": "pages-sum-txt",
					"SysObject": new sysObjDiv(),
					"JSONAttributes": {
						"DOMType": "p",
						"Style": "text-body-secondary mb-0",
						"Value": (this.CurrentPage+1) + '/' + this.PageCount
					}
				}
			]
		},
		{
			"id": "col-nav-ct",
			"SysObject": new sysObjDiv(),
			"JSONAttributes": {
				"Style": "col-auto"
			},
			"ObjectDefs": [
				{
					"id": "col-nav-ct2",
					"SysObject": new sysObjDiv(),
					"JSONAttributes": {
						"DOMType": "ul",
						"Style": "pagination mb-0"
					},
					"ObjectDefs": PageItems
				}
			]
		}
	];

	sysFactory.setupObjectRefsRecursive(ObjDef, this);
	this.ParentObject.addObject(this);

	if (this.DOMParentID !== null) {
		this.renderObject(this.DOMParentID);
	}
}


//------------------------------------------------------------------------------
//- METHOD "update"
//------------------------------------------------------------------------------

sysPagination.prototype.update = function()
{
	for (const RowItem of this.ParentObject.RowItems) {
		RowItem.VisibleState = 'hidden';
		RowItem.setDOMVisibleState();
	}

	const RowCount = this.ParentObject.DisplayRows;
	const StartPos = ((this.CurrentPage+1)*RowCount)-RowCount;
	const EndPos = ((this.CurrentPage+1)*RowCount)-1;

	console.debug('RowCount:%s StartPos:%s EndPos:%s', RowCount, StartPos, EndPos);

	for (let i=StartPos; i<=EndPos; i++) {
		try {
			const RowItem = this.ParentObject.RowItems[i];
			RowItem.VisibleState = 'visible';
			RowItem.setDOMVisibleState();
		}
		catch(err) {
		}
	}

	this.render();
}


//------------------------------------------------------------------------------
//- METHOD "processCallback"
//------------------------------------------------------------------------------

sysPagination.prototype.processCallback = function(Function, Arguments)
{
	if (Function == 'navLeft') { this.navigateLeft(); }
	if (Function == 'navRight') { this.navigateRight(); }
	if (Function == 'navIndex') { this.navigateIndex(Arguments); }
}


//------------------------------------------------------------------------------
//- METHOD "navigateLeft"
//------------------------------------------------------------------------------

sysPagination.prototype.navigateLeft = function()
{
	if (this.CurrentPage > 0) { this.CurrentPage -= 1; }
	this.ParentObject.NavPageIndex = this.CurrentPage;
	this.update();
}


//------------------------------------------------------------------------------
//- METHOD "navigateRight"
//------------------------------------------------------------------------------

sysPagination.prototype.navigateRight = function()
{
	if (this.CurrentPage < (this.PageCount-1)) { this.CurrentPage += 1; }
	this.ParentObject.NavPageIndex = this.CurrentPage;
	this.update();
}


//------------------------------------------------------------------------------
//- METHOD "navigateIndex"
//------------------------------------------------------------------------------

sysPagination.prototype.navigateIndex = function(PageNr)
{
	this.CurrentPage = PageNr;
	this.ParentObject.NavPageIndex = PageNr;
	this.update();
}
