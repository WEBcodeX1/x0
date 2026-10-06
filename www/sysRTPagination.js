//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
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
    this.ChildObjects         = new Array();        //- Child Objects
    this.ParentObject         = ParentObject;       //- Parent Object
    this.CurrentPage          = 0;                  //- Current Page
    this.PageCount            = 0;                  //- Page Count
}

sysPagination.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "setPageCount"
//------------------------------------------------------------------------------

sysPagination.prototype.setPageCount = function()
{
    const Parent = this.ParentObject;
    this.PageCount = Math.ceil(Parent.RowItems.length / Parent.RowCount);
}


//------------------------------------------------------------------------------
//- METHOD "render"
//------------------------------------------------------------------------------

sysPagination.prototype.render = function()
{
    this.ChildObjects = new Array();

    this.DOMStyle = 'row allign-items-center m-0 p-1';
    this.ObjectID = this.ParentObject.ObjectID + 'PaginatioMainRow';

    this.setPageCount();

    if (this.DOMParentID !== null) {
        this.removeParent();
    }

    let NavLeftButton = new sysObjButtonCallback();
    NavLeftButton.setCallback(this, 'navLeft');

    let NavRightButton = new sysObjButtonCallback();
    NavRightButton.setCallback(this, 'navRight');

    const ButtonLeftObjs = {
        "id": "BtLeftCt",
        "SysObject": new sysObjDiv(),
        "JSONAttributes": {
            "DOMType": "li",
            "Style": "page-item"
        },
        "ObjectDefs": [
            {
                "id": this.ObjectID + "BtLeft",
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
        "id": "BtRightCt",
        "SysObject": new sysObjDiv(),
        "JSONAttributes": {
            "DOMType": "li",
            "Style": "page-item"
        },
        "ObjectDefs": [
            {
                "id": this.ObjectID + "BtRight",
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

    let PageItems = [];

    PageItems.push(ButtonLeftObjs);

    for (let i=0; i<this.PageCount; ++i)
    {
        const NavIndex = (i+1);
        let NavIndexButton = new sysObjButtonCallback();
        NavIndexButton.setCallback(this, 'navIndex', i);

        console.debug('this.CurrentPage:%s i:%s', i, this.CurrentPage);

        let NavHilite = '';
        if (i == this.CurrentPage) { NavHilite = ' active'; }

        let PageItemTpl =  {
            "id": "BtPageItemCtr" + NavIndex,
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "DOMType": "li",
                "Style": "page-item"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "BtPageItem" + NavIndex,
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

    let ObjDefs = [
        {
            "id": this.ObjectID + "PagesSumCol",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "PagesSumTxt",
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
            "id": "ColNavCtr",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col-auto"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "ColNavPaginationCtr",
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

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
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
    for (const RowItem of this.ParentObject.RowItems)
    {
        RowItem.VisibleState = 'hidden';
        RowItem.setDOMVisibleState();
    }

    const RowCount = this.ParentObject.RowCount;
    const StartPos = ((this.CurrentPage+1)*RowCount)-RowCount;
    const EndPos = ((this.CurrentPage+1)*RowCount)-1;

    console.debug('RowCount:%s StartPos:%s EndPos:%s', RowCount, StartPos, EndPos);

    for (let i=StartPos; i<=EndPos; i++)
    {
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

sysPagination.prototype.processCallback = function(FunctionID, Arguments)
{
    if (FunctionID == 'navLeft') { this.navigateLeft(); }
    if (FunctionID == 'navRight') { this.navigateRight(); }
    if (FunctionID == 'navIndex') { this.navigateIndex(Arguments); }
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
