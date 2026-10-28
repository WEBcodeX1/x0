//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- USER SYSTEM OBJECT "ExampleCard"                                         -//
//- USER SYSTEM OBJECT "ExampleTask"                                         -//
//- USER SYSTEM OBJECT "ExampleTasklist"                                     -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "userObjExampleCard"
//------------------------------------------------------------------------------

function userObjExampleCard()
{
    this.ObjectType     = 'ExampleCard';    //- System Object Type
    this.TasklistIndex  = 0;                //- Tasklist Index
    this.ChildObjects   = new Array();      //- Child Objects

    //- Default Bootstrap DOMStyle
    this.DOMStyle = 'm-2 me-0 p-3 example-card-border rounded rounded-2'
}

//- inherit sysObjDivUnique
userObjExampleCard.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

userObjExampleCard.prototype.init = function()
{
    //- set processing attributes from config
    let Attributes = this.JSONConfig.Attributes;

    //- define empty attributes (object) when undefined
    if (Attributes === undefined) {
        Attributes = new Object();
    }

    //- set style
    if (Attributes.Style !== undefined) {
        this.DOMStyle = Attributes.Style;
    }

    //- setup select badges button
    let SelectBadgesButton = new sysObjButtonCallback();
    SelectBadgesButton.overrideDOMObjectID = true;
    SelectBadgesButton.setCallback(this, 'selectBadges');

    //- setup select colaborators button
    let SelectColaboratorsButton = new sysObjButtonCallback();
    SelectColaboratorsButton.overrideDOMObjectID = true;
    SelectColaboratorsButton.setCallback(this, 'selectColaborators');

    //- setup add tasklist button
    let AddTasklistButton = new sysObjButtonCallback();
    AddTasklistButton.overrideDOMObjectID = true;
    AddTasklistButton.setCallback(this, 'addTasklist');

    //- setup save data button
    let SaveDataButton = new sysObjButtonCallback();
    SaveDataButton.overrideDOMObjectID = true;
    SaveDataButton.setCallback(this, 'saveData');

    //- setup recursive object structure
    let ObjDefs = [
        {
            "id": "CtrRowBadges",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0"
            },
            "ObjectDefs": [
                {
                    "id": "CtrColBadgesSelect",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-1 p-0 text-start"
                    },
                    "ObjectDefs": [
                        {
                            "id": "BtSelectBadges",
                            "SysObject": SelectBadgesButton,
                            "JSONAttributes": {
                                "Style": "btn m-0 p-0 text-center",
                                "DOMValue": '<i class="fa-solid fa-flag text-primary-emphasis bg-primary bg-opacity-25 p-2 border border-5 border-primary-subtle rounded rounded-circle example-card-btn-select"></i>'
                            }
                        }
                    ]
                },
                {
                    "id": "CtrColBadges",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-9 p-0 pe-5"
                    },
                    "ObjectDefs": [
                        {
                            "id": "CtrBadges",
                            "SysObject": new sysObjDiv(),
                            "JSONAttributes": {
                                "Style": "container border border-dotted border-2 rounded h-100 p-1 ps-2"
                            }
                        }
                    ]
                },
                {
                    "id": "CtrColBtSave",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-2 p-0"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "SaveData",
                            "SysObject": SaveDataButton,
                            "JSONAttributes": {
                                "TextID": "TXT.BUTTON.EXAMPLE.CARD_TASKLISTS.SAVE_DATA",
                                "Style": "btn btn-primary btn-sm w-100",
                                "IconStyle": "fa-solid fa-floppy-disk"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "CtrRowCardName",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0"
            },
            "ObjectDefs": [
                {
                    "id": "CtrCardName",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-12 p-0 pt-3 pb-1"
                    },
                    "ObjectDefs": [
                        {
                            "id": "CardName",
                            "SysObject": new sysFormfieldItemText(),
                            "JSONAttributes": {
                                "PlaceholderTextID": "TXT.EXAMPLE.CARD_TASKLISTS.PLACEHOLDER.CARD_NAME",
                                "Style": "form-control mb-1 p-1 w-100 fw-bold"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "CtrRowCardDescription",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0"
            },
            "ObjectDefs": [
                {
                    "id": "CtrCardDescription",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-12 p-0 pt-1 pb-3"
                    },
                    "ObjectDefs": [
                        {
                            "id": "CardDescription",
                            "SysObject": new sysFormfieldItemTextarea(),
                            "JSONAttributes": {
                                "PlaceholderTextID": "TXT.EXAMPLE.CARD_TASKLISTS.PLACEHOLDER.CARD_DESCRIPTION",
                                "Style": "form-control mb-1 p-1 w-100"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "CtrRowCardProgress",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0 pb-3 align-items-center"
            },
            "ObjectDefs": [
                {
                    "id": "CtrCardProgressLeft",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-2 p-0"
                    },
                    "ObjectDefs": [
                        {
                            "id": "ProgressDescription",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
                                "TextID": "TXT.EXAMPLE.CARD_TASKLISTS.CARD.PROGRESS",
                                "Style": "text-primary-emphasis",
                                "IconStyle": "fa-solid fa-stopwatch"
                            }
                        }
                    ]
                },
                {
                    "id": "CtrCardProgressBar",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-8 p-0 pe-5"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "CardProgress",
                            "SysObject": new sysObjProgressBar()
                        }
                    ]
                },
                {
                    "id": "CtrCardProgressRight",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-2 p-0"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "AddTasklist",
                            "SysObject": AddTasklistButton,
                            "JSONAttributes": {
                                "TextID": "TXT.BUTTON.EXAMPLE.CARD_TASKLISTS.ADD_TASKLIST",
                                "Style": "btn btn-primary btn-sm w-100",
                                "IconStylePost": "fa-solid fa-plus"
                            }
                        }
                    ]
                }
            ]
        },
        {
            "id": "CtrRowCardDetails",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0"
            },
            "ObjectDefs": [
                {
                    "id": "CtrCardDetailsLeftBtn",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-1 p-0"
                    },
                    "ObjectDefs": [
                        {
                            "id": "BtSelectColaborators",
                            "SysObject": SelectColaboratorsButton,
                            "JSONAttributes": {
                                "Style": "btn m-0 p-0 text-center",
                                "DOMValue": '<i class="fa-solid fa-user text-primary-emphasis bg-primary bg-opacity-25 p-2 border border-5 border-primary-subtle rounded rounded-circle example-card-btn-select"></i>'
                            }
                        }
                    ]
                },
                {
                    "id": "CtrCardDetailsLeftColaborators",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-6 p-0"
                    },
                    "ObjectDefs": [
                        {
                            "id": "CtrColaborators",
                            "SysObject": new sysObjDiv(),
                            "JSONAttributes": {
                                "Style": "container border border-dotted border-2 rounded h-100 p-1 ps-2"
                            }
                        }
                    ]
                },
                {
                    "id": "CtrCardDetailsRight",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-5 text-end"
                    },
                    "ObjectDefs": [
                        {
                            "id": "CardDetailsRow",
                            "SysObject": new sysObjDiv(),
                            "JSONAttributes": {
                                "Style": "row m-0 p-0 align-items-center text-center"
                            },
                            "ObjectDefs": [
                                {
                                    "id": "CtrColRepliesIcon",
                                    "SysObject": new sysObjDiv(),
                                    "JSONAttributes": {
                                        "Style": "col-md-2 p-0"
                                    },
                                    "ObjectDefs": [
                                        {
                                            "id": "CardDetailRepliesIcon",
                                            "SysObject": new sysObjDiv(),
                                            "JSONAttributes": {
                                                "DOMType": "i",
                                                "Style": "text-secondary fa-solid fa-reply"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "id": "CtrColReplyCount",
                                    "SysObject": new sysObjDiv(),
                                    "JSONAttributes": {
                                        "Style": "col-md-1 p-0"
                                    },
                                    "ObjectDefs": [
                                        {
                                            "id": "CtrColReplyCount",
                                            "SysObject": new sysObjDiv(),
                                            "JSONAttributes": {
                                                "Style": "text-secondary",
                                                "Value": "0"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "id": "CtrColTasksIcon",
                                    "SysObject": new sysObjDiv(),
                                    "JSONAttributes": {
                                        "Style": "col-md-2 p-0"
                                    },
                                    "ObjectDefs": [
                                        {
                                            "id": "CardDetailTasksIcon",
                                            "SysObject": new sysObjDiv(),
                                            "JSONAttributes": {
                                                "DOMType": "i",
                                                "Style": "text-secondary fa-solid fa-list-ol"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "id": "CtrColTaskCount",
                                    "SysObject": new sysObjDiv(),
                                    "JSONAttributes": {
                                        "Style": "col-md-3 p-0"
                                    },
                                    "ObjectDefs": [
                                        {
                                            "id": "CtrColTaskCount",
                                            "SysObject": new sysObjDiv(),
                                            "JSONAttributes": {
                                                "Style": "text-secondary",
                                                "Value": "0/3"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "id": "CtrColTasklistsIcon",
                                    "SysObject": new sysObjDiv(),
                                    "JSONAttributes": {
                                        "Style": "col-md-2 p-0"
                                    },
                                    "ObjectDefs": [
                                        {
                                            "id": "CardDetailTasklistsIcon",
                                            "SysObject": new sysObjDiv(),
                                            "JSONAttributes": {
                                                "DOMType": "i",
                                                "Style": "text-secondary fa-solid fa-sitemap"
                                            }
                                        }
                                    ]
                                },
                                {
                                    "id": "CtrColTasklistCount",
                                    "SysObject": new sysObjDiv(),
                                    "JSONAttributes": {
                                        "Style": "col-md-2 p-0"
                                    },
                                    "ObjectDefs": [
                                        {
                                            "id": "CardDetailTasklistCount",
                                            "SysObject": new sysObjDiv(),
                                            "JSONAttributes": {
                                                "Style": "text-secondary",
                                                "Value": "2"
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "ButtonCallback"
//------------------------------------------------------------------------------

userObjExampleCard.prototype.ButtonCallback = function(FunctionID, FunctionArguments, EventRef)
{
    if (FunctionID == 'addTasklist') {
        this.addTasklist();
    }
    else {
        let ScreenID = undefined;

        if (FunctionID == 'selectBadges') { ScreenID = 'OverlayBadgeSelector'; }
        if (FunctionID == 'selectColaborators') { ScreenID = 'OverlayCollaboratorSelector'; }

        sysFactory.OverlayObj.activateOverlayAtPosition(
            ScreenID, EventRef.pageX, EventRef.pageY, 450
        );
    }
}


//------------------------------------------------------------------------------
//- METHOD "addTasklist"
//------------------------------------------------------------------------------

userObjExampleCard.prototype.addTasklist = function()
{
    let TasklistContainerObj = new sysObjDivUnique();
    TasklistContainerObj.ObjectID = this.ObjectID + 'CtrTasklist' + this.TasklistIndex;
    TasklistContainerObj.init();
    this.addObject(TasklistContainerObj);

    let TasklistObj = new userObjExampleTasklist(this, this.TasklistIndex);
    TasklistObj.init();
    TasklistContainerObj.addObject(TasklistObj);
    this.rerenderObject();
    this.TasklistIndex++;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "userObjExampleTasklist"
//------------------------------------------------------------------------------

function userObjExampleTasklist(ParentObject, ItemIndex)
{
    this.ObjectID       = 'ExampleTasklist' + ItemIndex     //- Tasklist Index
    this.ObjectType     = 'ExampleTasklist';                //- System Object Type
    this.ChildObjects   = new Array();                      //- Child Objects

    this.ParentObject   = ParentObject;                     //- ParentObject Reference
    this.TaskIndex      = 0;                                //- Task Index

    //- Default Bootstrap DOMStyle
    this.DOMStyle = 'm-0 mt-3 p-2 border border-4 border-opacity-50 rounded rounded-2'
}

//- inherit sysObjDivUnique
userObjExampleTasklist.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

userObjExampleTasklist.prototype.init = function()
{
    //- setup add task button
    let AddTaskButton = new sysObjButtonCallback();
    AddTaskButton.overrideDOMObjectID = true;
    AddTaskButton.setCallback(this, 'addTask');

    //- setup recursive object structure
    const ObjDefs = [
        {
            "id": "CtrTasklistRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row m-0 p-0 align-items-center"
            },
            "ObjectDefs": [
                {
                    "id": "ColTasklistNameDescr",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-2 p-1"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "TasklistNameLabel",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
                                "TextID": "TXT.EXAMPLE.CARD_TASKLISTS.TASKLIST.LABEL.NAME",
                                "Style": "text-primary-emphasis",
                                "IconStyle": "fa-solid fa-id-card"
                            }
                        }
                    ]
                },
                {
                    "id": "ColTasklistName",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-8 p-1"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "TasklistName",
                            "SysObject": new sysFormfieldItemText(),
                            "JSONAttributes": {
                                "Style": "form-control m-0 p-1 w-100 text-primary-emphasis"
                            }
                        }
                    ]
                },
                {
                    "id": "ColBtAddTask",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-2 p-1"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "BtAddTask",
                            "SysObject": AddTaskButton,
                            "JSONAttributes": {
                                "TextID": "TXT.BUTTON.EXAMPLE.CARD_TASKLISTS.ADD_TASK",
                                "Style": "btn btn-primary btn-sm w-100",
                                "IconStylePost": "fa-solid fa-plus"
                            }
                        }
                    ]
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "ButtonCallback"
//------------------------------------------------------------------------------

userObjExampleTasklist.prototype.ButtonCallback = function(FunctionID)
{
    if (FunctionID == 'addTask') {
        this.addTask();
    }
}


//------------------------------------------------------------------------------
//- METHOD "addTask"
//------------------------------------------------------------------------------

userObjExampleTasklist.prototype.addTask = function()
{
    let TaskObj = new userObjExampleTask(this, this.TaskIndex);
    TaskObj.init();
    this.addObject(TaskObj);
    this.rerenderObject();
    this.TaskIndex++;
}


//------------------------------------------------------------------------------
//- CONSTRUCTOR "userObjExampleTask"
//------------------------------------------------------------------------------

function userObjExampleTask(ParentObject, ItemIndex)
{
    this.ObjectType     = 'ExampleTask';                        //- System Object Type
    this.ParentObject   = ParentObject;                         //- Parent Object Ref

    this.TaskID         = 'ExampleTask' + ItemIndex;            // TaskID
    this.ObjectID       = ParentObject.ObjectID + this.TaskID   //- Task Index

    this.ChildObjects   = new Array();                          //- Child Objects

    //- Default Bootstrap DOMStyle
    this.DOMStyle = 'row m-0 p-0 align-items-center'
}

//- inherit sysObjDivUnique
userObjExampleTask.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

userObjExampleTask.prototype.init = function()
{
    //- setup remove button
    let RemoveButton = new sysObjButtonCallback();
    RemoveButton.overrideDOMObjectID = true;
    RemoveButton.setCallback(this, 'remove');

    //- setup add colaborators button
    let AddColaboratorsButton = new sysObjButtonCallback();
    AddColaboratorsButton.overrideDOMObjectID = true;
    AddColaboratorsButton.setCallback(this, 'addColaborators');

    //- setup recursive object structure
    const ObjDefs = [
        {
            "id": "ColBtAddColaborators",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-1 p-1 ps-2"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "BtAddColaborators",
                    "SysObject": AddColaboratorsButton,
                    "JSONAttributes": {
                        "Style": "btn m-0 p-0 text-center",
                        "DOMValue": '<i class="fa-solid fa-user text-primary-emphasis bg-primary bg-opacity-25 p-2 border border-primary-subtle rounded rounded-circle example-card-btn-select"></i>'
                    }
                }
            ]
        },
        {
            "id": "ColTaskName",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-4 p-1"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "TaskName",
                    "SysObject": new sysFormfieldItemText(),
                    "JSONAttributes": {
                        "Style": "form-control m-0 p-1 w-100 text-primary-emphasis"
                    }
                }
            ]
        },
        {
            "id": "ColTaskPriority",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-2 p-1"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "TaskPriority",
                    "SysObject": new sysFormfieldItemPulldown(),
                    "JSONAttributes": {
                        "Style": "form-select m-0 p-1 border-secondary w-100 text-primary-emphasis",
                        "Options": [
                            {
                                "TextID": "TXT.EXAMPLE.CARD_TASKLISTS.TASK.PRIORITY.HIGHEST",
                                "Value": 10,
                                "Default": true
                            },
                            {
                                "TextID": "TXT.EXAMPLE.CARD_TASKLISTS.TASK.PRIORITY.HIGHER",
                                "Value": 20
                            },
                            {
                                "TextID": "TXT.EXAMPLE.CARD_TASKLISTS.TASK.PRIORITY.HIGH",
                                "Value": 30
                            },
                            {
                                "TextID": "TXT.EXAMPLE.CARD_TASKLISTS.TASK.PRIORITY.MID",
                                "Value": 40
                            },
                            {
                                "TextID": "TXT.EXAMPLE.CARD_TASKLISTS.TASK.PRIORITY.LOW",
                                "Value": 50
                            },
                            {
                                "TextID": "TXT.EXAMPLE.CARD_TASKLISTS.TASK.PRIORITY.LOWER",
                                "Value": 60
                            },
                            {
                                "TextID": "TXT.EXAMPLE.CARD_TASKLISTS.TASK.PRIORITY.LOWEST",
                                "Value": 70
                            }
                        ]
                    }
                }
            ]
        },
        {
            "id": "ColTaskPercentage",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-2 p-1"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "TaskPercentage",
                    "SysObject": new sysFormfieldItemPulldown(),
                    "JSONAttributes": {
                        "Style": "form-select m-0 p-1 border-secondary w-100 text-primary-emphasis",
                        "Options": [
                            {
                                "Value": 0,
                                "Display": "0",
                                "Default": true
                            },
                            {
                                "Value": 10,
                                "Display": "10"
                            },
                            {
                                "Value": 20,
                                "Display": "20"
                            },
                            {
                                "Value": 30,
                                "Display": "30"
                            },
                            {
                                "Value": 40,
                                "Display": "40"
                            },
                            {
                                "Value": 50,
                                "Display": "50"
                            },
                            {
                                "Value": 60,
                                "Display": "60"
                            },
                            {
                                "Value": 70,
                                "Display": "70"
                            },
                            {
                                "Value": 80,
                                "Display": "80"
                            },
                            {
                                "Value": 90,
                                "Display": "90"
                            },
                            {
                                "Value": 100,
                                "Display": "100"
                            }
                        ]
                    }
                }
            ]
        },
        {
            "id": "ColColaborators",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-2 p-0"
            }
        },
        {
            "id": "ColBtremoveTask",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "col col-md-1 p-0 pe-2 text-end"
            },
            "ObjectDefs": [
                {
                    "id": this.ObjectID + "BtRemoveTask",
                    "SysObject": RemoveButton,
                    "JSONAttributes": {
                        "Style": "btn m-0 p-0 text-center",
                        "DOMValue": '<i class="fa-solid fa-trash text-primary-emphasis"></i>'
                    }
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "ButtonCallback"
//------------------------------------------------------------------------------

userObjExampleTask.prototype.ButtonCallback = function(FunctionID, FunctionArguments, EventRef)
{
    if (FunctionID == 'remove') {
    }
    else {
        let ScreenID = undefined;

        if (FunctionID == 'addColaborators') { ScreenID = 'OverlayCollaboratorSelector'; }

        sysFactory.OverlayObj.activateOverlayAtPosition(
            ScreenID, EventRef.pageX, EventRef.pageY, 450
        );
    }
}
