//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- USER OBJECT "ExampleWizard"                                       -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "userObjExampleWizard"
//------------------------------------------------------------------------------

function userObjExampleWizard()
{
    this.DOMStyle       = 'p-2 border border-start-0 border-top-0'      //- DOM Style
    this.StepIndex      = 0;                                            //- Step Index
    this.StepCount      = 3;                                            //- Step Count
    this.ChildObjects   = new Array();                                  //- Child Objects
}

userObjExampleWizard.prototype = new sysObjDivUnique();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

userObjExampleWizard.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    //- navigation buttons
    this.NavLeftButton = new sysObjButtonCallback();
    this.NavLeftButton.setCallback(this, 'navLeft');

    this.NavRightButton = new sysObjButtonCallback();
    this.NavRightButton.setCallback(this, 'navRight');

    //- tab container reference
    this.TabContainerObj = new sysTabContainer();

    //- progress bar reference
    this.ProgressBarObj = new sysObjProgressBar();

    //- tab array

    this.Tabs = [
        'TabExamplesBasicSlidersWizardStep1',
        'TabExamplesBasicSlidersWizardStep2',
        'TabExamplesBasicSlidersWizardStep3'
    ];

    //- validate form array
    this.ValidateForm = [
        'ExamplesBasicWizardTab1Formlist',
        'ExamplesBasicWizardTab2Formlist',
        'ExamplesBasicWizardTab3Formlist'
    ];

    let ObjDefsTabs = [
        {
            "id": "ExamplesBasicWizardTabs",
            "SysObject": this.TabContainerObj,
            "JSONAttributes": {
                "Tabs": [
                    {
                        "ID": this.Tabs[0],
                        "Attributes":
                        {
                            "Default": true,
                            "TextID": "TXT.TABCONTAINER.EXAMPLES_BASIC.WIZARD.STEP1",
                            "Style": "col-md-4",
                            "IconStyle": "fa-solid fa-id-card"
                        }
                    },
                    {
                        "ID": this.Tabs[1],
                        "Attributes":
                        {
                            "TextID": "TXT.TABCONTAINER.EXAMPLES_BASIC.WIZARD.STEP2",
                            "Style": "col-md-4",
                            "IconStyle": "fa-solid fa-location-dot"
                        }
                    },
                    {
                        "ID": this.Tabs[2],
                        "Attributes":
                        {
                            "TextID": "TXT.TABCONTAINER.EXAMPLES_BASIC.WIZARD.STEP3",
                            "Style": "col-md-4",
                            "IconStyle": "fa-solid fa-file-signature"
                        }
                    }
                ]
            }
        },
        {
            "id": "ExamplesBasicWizardErrorContainer",
            "SysObject": new sysErrorContainer()
        },
        {
            "id": "ExamplesBasicWizardProgressBar",
            "SysObject": this.ProgressBarObj,
            "JSONAttributes": {
                "Value": 33
            }
        },
        {
            "id": "CtrBottom",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": "row"
            },
            "ObjectDefs": [
                {
                    "id": "CtrButtonLeft",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-3"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "BtLeft",
                            "SysObject": this.NavLeftButton,
                            "JSONAttributes": {
                                "Style": "btn btn-primary",
                                "IconStyle": "fa-solid fa-angle-left",
                                "TextID": "TXT.BUTTON.LEFT"
                            }
                        }
                    ]
                },
                {
                    "id": "CtrStepInfo",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-6"
                    }
                },
                {
                    "id": "CtrButtonRight",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-3 text-end"
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "BtRight",
                            "SysObject": this.NavRightButton,
                            "JSONAttributes": {
                                "Style": "btn btn-primary",
                                "IconStyle": "fa-solid fa-angle-right",
                                "TextID": "TXT.BUTTON.RIGHT"
                            }
                        }
                    ]
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefsTabs, this);

    let ObjDefsContentTab1 = [
        {
            "id": "ExamplesBasicWizardTab1Formlist",
            "SysObject": new sysFormfieldList(),
            "JSONAttributes": {
                "ObjectIDs": [
                    "PersonNameLabel",
                    "PersonName",
                    "PersonSurenameLabel",
                    "PersonSurename",
                    "PersonMailLabel",
                    "PersonMail",
                    "PersonAgeLabel",
                    "PersonAge",
                    "PersonLoginNameLabel",
                    "PersonLoginName",
                    "PersonLoginPasswordLabel",
                    "PersonLoginPassword"
                ],
                "Style": "border rounded border-top-0 rounded-top-0 p-2",
                "RowStyle": "row m-0 p1",
                "RowAfterElements": 4,
                "ColAfterElements": 2,
                "ColStyle": "col-md-6",
                "ErrorContainer": "ExamplesBasicWizardErrorContainer"
            }
        }
    ];

    const Tab1Obj = this.getObjectByID('TabExamplesBasicSlidersWizardStep1Content');
    sysFactory.setupObjectRefsRecursive(ObjDefsContentTab1, Tab1Obj);

    let ObjDefsContentTab2 = [
        {
            "id": "ExamplesBasicWizardTab2Formlist",
            "SysObject": new sysFormfieldList(),
            "JSONAttributes": {
                "ObjectIDs": [
                    "PersonAddressStreetLabel",
                    "PersonAddressStreet",
                    "PersonAddressStreetNrLabel",
                    "PersonAddressStreetNr",
                    "PersonTelephoneNumberTypeLabel",
                    "PersonTelephoneNumberType",
                    "PersonTelephoneNumberLabel",
                    "PersonTelephoneNumber",
                    "PersonGroupMainLabel",
                    "PersonGroupMain",
                    "ContractAcceptedLabel",
                    "ContractAccepted"
                ],
                "Style": "border rounded border-top-0 rounded-top-0 p-2",
                "RowStyle": "row m-0 p1",
                "RowAfterElements": [ 4, 2 ],
                "ColAfterElements": 2,
                "ColStyle": [
                    "col-md-6",
                    "col-md-6",
                    "col-md-12"
                ],
                "ErrorContainer": "ExamplesBasicWizardErrorContainer"
            }
        }
    ];

    const Tab2Obj = this.getObjectByID('TabExamplesBasicSlidersWizardStep2Content');
    sysFactory.setupObjectRefsRecursive(ObjDefsContentTab2, Tab2Obj);

    let ObjDefsContentTab3 = [
        {
            "id": "ExamplesBasicWizardTab3Formlist",
            "SysObject": new sysFormfieldList(),
            "JSONAttributes": {
                "ObjectIDs": [
                    "PersonNameDisplay",
                    "PersonSurenameDisplay",
                    "PersonMailDisplay",
                    "PersonAgeDisplay",
                    "PersonAddressStreetDisplay",
                    "PersonAddressStreetNrDisplay",
                    "PersonTelephoneNumberDisplay"
                ],
                "Style": "border rounded border-top-0 rounded-top-0 p-2",
                "RowStyle": "row m-0 p1",
                "RowAfterElements": [ 4, 2 ],
                "ColAfterElements": 2,
                "ColStyle": [
                    "col-md-6",
                    "col-md-6",
                    "col-md-12"
                ],
                "ErrorContainer": "ExamplesBasicWizardErrorContainer"
            }
        }
    ];

    const Tab3Obj = this.getObjectByID('TabExamplesBasicSlidersWizardStep3Content');
    sysFactory.setupObjectRefsRecursive(ObjDefsContentTab3, Tab3Obj);

    //- initially enable / disable buttons
    this.processButtonState();
}


//------------------------------------------------------------------------------
//- METHOD "processCallback"
//------------------------------------------------------------------------------

userObjExampleWizard.prototype.processCallback = function(FunctionID, Arguments)
{
    //- validate form
    const ValidateFormID = this.ValidateForm[this.StepIndex];
    const Result = this.getObjectByID(ValidateFormID).validate();

    if (Result == true)
    {
        //- navigate right / left
        if (FunctionID == 'navLeft' && this.StepIndex > 0)
        {
            this.StepIndex--;
        }

        if (FunctionID == 'navRight' && this.StepCount-1 > this.StepIndex)
        {
            this.StepIndex++;
        }

        //- enable / disable nav buttons
        this.processButtonState();

        //- switch to tab
        const TabID = this.Tabs[this.StepIndex];
        this.TabContainerObj.switchTab(TabID);

        //- calculate progress percentage
        const PercentageCompleted = (100/this.StepCount)*(this.StepIndex+1);
        this.ProgressBarObj.RuntimeSetDataFunc(PercentageCompleted);
    }
}


//------------------------------------------------------------------------------
//- METHOD "processButtonState"
//------------------------------------------------------------------------------

userObjExampleWizard.prototype.processButtonState = function()
{
    //- disable enable left button
    if (this.StepIndex == 0) {
        this.NavLeftButton.disable();
    }
    else {
        this.NavLeftButton.enable();
    }

    //- disable enable left button
    if (this.StepIndex == (this.StepCount-1)) {
        this.NavRightButton.disable();
    }
    else {
        this.NavRightButton.enable();
    }
}
