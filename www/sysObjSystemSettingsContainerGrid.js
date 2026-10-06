//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2026                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM OBJECT "SystemSettingsContainerGrid"                                           -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysObjSystemSettingsContainerGrid"
//------------------------------------------------------------------------------

function sysObjSystemSettingsContainerGrid()
{
    this.ObjectType             = 'SystemSettingsContainerGrid';    //- System Object Type
    this.overrideDOMObjectID    = true;                             //- Override setting recursive ObjectID

    this.SettingItems           = new Array();                      //- Setting Item Instances
    this.ColItems               = new Array();                      //- All Column Items

    this.selectedGridVariant    = 0;                                //- Default Grid Variant

    this.EventListeners         = new Object();                     //- Event Listeners
    this.ChildObjects           = new Array();                      //- Child Objects
}

sysObjSystemSettingsContainerGrid.prototype = new sysBaseObject();


//------------------------------------------------------------------------------
//- METHOD "init"
//------------------------------------------------------------------------------

sysObjSystemSettingsContainerGrid.prototype.init = function()
{
    const Attributes = this.JSONConfig.Attributes;

    let SettingIndex = 0;
    for (const SettingAttributes of Attributes.Settings)
    {
        const SettingItem = new sysObjSystemSettingsContainerItem(
            this.ObjectID, SettingIndex, SettingAttributes, true
        )
        SettingItem.init();
        this.SettingItems.push(SettingItem);
        this.ColItems = this.ColItems.concat(SettingItem.ChildObjects);

        ++SettingIndex;
    }

    console.debug('SysSettingsGrid ColItems.length:%s', this.ColItems.length);

    this.buildRuntimeGridSelector();

    this.ContainerObj = new sysObjDiv();
    this.ContainerObj.overrideDOMObjectID = true;
    this.ContainerObj.ObjectID = this.ObjectID + "GridContainer";
    this.ContainerObj.init();

    this.addObject(this.ContainerObj);
    this.genGrid();
}


//------------------------------------------------------------------------------
//- METHOD "buildRuntimeGridSelector"
//------------------------------------------------------------------------------

sysObjSystemSettingsContainerGrid.prototype.buildRuntimeGridSelector = function()
{
    const Attributes = this.JSONConfig.Attributes;

    let GridSelectorButton = new sysObjButtonCallback();
    GridSelectorButton.ObjectID = this.ObjectID + 'GridSelectorButton';
    GridSelectorButton.overrideDOMObjectID = true;
    GridSelectorButton.setCallback(this);

    let SelectorOptions = new Array();
    let OptionIndex = 0;

    for (const Variant of Attributes.GridGenerator.Variants)
    {
        SelectorOptions.push(
            {
                "Display": Variant.RowAfterElements,
                "Value": OptionIndex
            }
        );
        ++OptionIndex;
    }

    let ObjDefs = [
        {
            "id": "GridSelectorRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
                "Style": Attributes.GridStyles.SelectorRowStyle
            },
            "ObjectDefs": [
                {
                    "id": "GridSelectorDescriptionCtr",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-3",
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "GridSelectorText",
                            "SysObject": new sysObjSQLText(),
                            "JSONAttributes": {
                                "Style": "text-primary-emphasis",
                                "IconStyle": "fa-solid fa-table-cells",
                                "TextID": "TXT.SYS.BUTTON.SYSSETTINGCONTAINER_GRID.SELECTGRID"
                            }
                        }
                    ]
                },
                {
                    "id": "GridSelectorPulldownCtr",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-6",
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "GridSelectorPulldown",
                            "SysObject": new sysFormfieldItemPulldown(),
                            "JSONAttributes": {
                                "Style": "form-select mb-1 p-1 w-100 h-100 text-primary-emphasis",
                                "Options": SelectorOptions
                            }
                        }
                    ]
                },
                {
                    "id": "RuntimeGridSelectorButtonCtr",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": {
                        "Style": "col col-md-3",
                    },
                    "ObjectDefs": [
                        {
                            "id": this.ObjectID + "GridSelectorUpdateButton",
                            "SysObject": GridSelectorButton,
                            "JSONAttributes": {
                                "Style": "btn btn-light w-100 text-primary-emphasis",
                                "IconStyle": "fa-solid fa-rotate-right",
                                "TextID": "TXT.SYS.BUTTON.SYSSETTINGCONTAINER_GRID.UPDATEGRID"
                            }
                        }
                    ]
                },
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);
}


//------------------------------------------------------------------------------
//- METHOD "genGrid"
//------------------------------------------------------------------------------

sysObjSystemSettingsContainerGrid.prototype.genGrid = function()
{
    console.debug('::genGrid source ColItems:%o', this.ColItems);

    const Attrributes = this.JSONConfig.Attributes;
    const GridVariants = Attrributes.GridGenerator.Variants;

    var GridGenerator = new sysGridGenerator(this.ColItems);

    GridGenerator.init(
        Attrributes.GridGenerator.RowStyles,
        GridVariants[this.selectedGridVariant].ColStyles,
        GridVariants[this.selectedGridVariant].RowAfterElements,
        GridVariants[this.selectedGridVariant].ColAfterElements
    );

    const RowItems = GridGenerator.generate();
    console.debug('::genGrid RowItems:%o', RowItems);

    for (const RowItem of RowItems) {
        this.ContainerObj.addObject(RowItem);
    }
}


//------------------------------------------------------------------------------
//- METHOD "processCallback"
//------------------------------------------------------------------------------

sysObjSystemSettingsContainerGrid.prototype.processCallback = function(FunctionID, Arguments)
{
    const SelectorPD = this.getObjectByID(this.ObjectID + 'GridSelectorPulldown');
    this.selectedGridVariant = SelectorPD.RuntimeGetDataFunc();
    this.ContainerObj.ChildObjects.length = 0;
    this.genGrid();
    this.ContainerObj.rerenderObject();
}
