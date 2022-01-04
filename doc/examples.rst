.. examples

Examples
========

Hello World
-----------------------

#TODO: add all necessary steps / (config) files / SQL (DB) to reproduce a hello-world example.

Defining Source Objects / get List Detail Data
----------------------------------------------

Source-Object specs see: #TODO Link to Source-Object.

The example defines 3 Screens.

- Screen1: Dummy Screen
- Screen2: 1 List with a Context-Menu "edit" entry (right click to edit list row in Screen3)
- Screen3: 1 FormfieldList which contents will be loaded when using Screen2 List Context-Menu "edit"

SrcDataObjects Explanation
~~~~~~~~~~~~~~~~~~~~~~~~~~

With the definition of "SrcDataObjects" attribute connected to the example List "TestList1", the
hardcoded parameter "LimitRows" with value "10" will be added to the http POST request.

.. code-block:: javascript

	"SrcDataObjects":
	{
			"Dummy":
			{
					"Type": "HardcodedValues",
					"Values": {
							"LimitRows": "10"
					}
			}
	}

The request is triggered when List Connector-Object "TestList1Connector" receives "InitSystem"
event which will be raised on system initialization.

.. code-block:: javascript

	"OnEvent":
	{
		"Events": [ "InitSystem" ],
		"ServiceCall": "python/IntegrationTestGetTableData.py"
	}

With the definition of "SrcDataObjects" attribute connected to the example FormfieldList "TestFormfields1",
the Screen Global Variable with key "id" will be read out of current screen and will be added to the http POST request.

.. code-block:: javascript

	"SrcDataObjects":
		{
			"id":
			{
				"Type": "ScreenGlobalVar"
			}
		}

Within the Context-Menu you define property "DstScreenID" to switch Screen to on successful data loading.

When additional property "RowColumn" is set e.g. to "id" the selected right-clicked Row "id" column value 
will be written to the Destination Screens Global Variable which later can be referenced by "SrcDataObjects".

.. code-block:: javascript

	"ContextMenuItems": {
		"Edit": {
			"TextID": "TXT.CONTEXTMENU.EDIT",
			"Icon": "Edit",
			"DstScreenID": "Screen3",
			"RowColumn": "id",
			"FireEvents": [ "GetFormfieldData" ]
		}

The request is triggered when FormfieldList Connector-Object "TestFormfields1Connector" receives "GetFormfieldData"
event which will be raised by Context-Menu "FireEvents" data.

.. code-block:: javascript

	"OnEvent":
	{
		"Events": [ "InitSystem" ],
		"ServiceCall": "python/IntegrationTestGetTableData.py"
	}

Example Configuration
~~~~~~~~~~~~~~~~~~~~~

menu.json

.. code-block:: javascript

	{
		"BasicRoot":
		{
			"TextID": "TXT.MENU.BASICEXAMPLE.ROOT",
			"RefID": "MenuRoot"
		},
		"Screen1":
		{
			"TextID": "TXT.MENU.BASICEXAMPLE.SCREEN1",
			"ScreenID": "Screen1",
			"RefID": "BasicRoot",
			"IconStyle": "Search"
		},
		"Screen2":
		{
			"TextID": "TXT.MENU.BASICEXAMPLE.SCREEN2",
			"ScreenID": "Screen2",
			"RefID": "BasicRoot",
			"IconStyle": "Search"
		},
		"Screen3":
		{
			"TextID": "TXT.MENU.BASICEXAMPLE.SCREEN3",
			"ScreenID": "Screen3",
			"RefID": "BasicRoot",
			"IconStyle": "Search"
		}
	}

object.json

.. code-block:: javascript

	{
		"Div1":
		{
			"Type": "Div",
			"Attributes": {
				"Style": "sysClass1"
			}
		},

		"TestFormfields1Connector":
		{
			"Type": "ServiceConnector",
			"Attributes":
			{
				"OnEvent":
				{
					"Events": [ "GetFormfieldData" ],
					"ServiceCall": "python/IntegrationTestGetTableDetailData.py"
				}
			}
		},

		"TestFormfields1":
		{
			"Type": "FormFieldList",
			"Attributes": {
				"FormFields": [
					"Formfield1",
					"Formfield2",
					"Formfield3"
				],
				"SrcDataObjects":
				{
					"id":
					{
						"Type": "ScreenGlobalVar"
					}
				}
			}
		},

		"Formfield1":
		{
			"Type": "FormField",
			"Attributes":
			{
				"Type": "text",
				"DBColumn": "id",
				"ValidateRef": "DefaultString",
				"ValidateNullable": false,
				"Style": "FormFieldBorder",
				"StyleOnFocus": "FormFieldBorderOnFocus",
				"StyleValidateOk": "FormFieldBorderValidateOk",
				"StyleValidateFail": "FormFieldBorderValidateFail"
			}
		},

		"Formfield2":
		{
			"Type": "FormField",
			"Attributes":
			{
				"Type": "text",
				"DBColumn": "col1",
				"ValidateRef": "DefaultString",
				"ValidateNullable": false,
				"Style": "FormFieldBorder",
				"StyleOnFocus": "FormFieldBorderOnFocus",
				"StyleValidateOk": "FormFieldBorderValidateOk",
				"StyleValidateFail": "FormFieldBorderValidateFail"
			}
		},

		"Formfield3":
		{
			"Type": "FormField",
			"Attributes":
			{
				"Type": "text",
				"DBColumn": "col2",
				"ValidateRef": "DefaultString",
				"ValidateNullable": false,
				"Style": "FormFieldBorder",
				"StyleOnFocus": "FormFieldBorderOnFocus",
				"StyleValidateOk": "FormFieldBorderValidateOk",
				"StyleValidateFail": "FormFieldBorderValidateFail"
			}
		},

		"TestList1Connector":
		{
			"Type": "ServiceConnector",
			"Attributes":
			{
				"OnEvent":
				{
					"Events": [ "InitSystem" ],
					"ServiceCall": "python/IntegrationTestGetTableData.py"
				}
			}
		},

		"TestList1":
		{
			"Type": "List",
			"Attributes":
			{
				"Style": "sysList",
				"HeaderRowStyle": "row sysListHeader",
				"RowCount": 5,
				"SrcDataObjects":
				{
					"Dummy":
					{
						"Type": "HardcodedValues",
						"Values": {
							"LimitRows": "10"
						}
					}
				},
				"Columns":
				{
					"id":
					{
						"visible": false
					},
					"col1":
					{
						"HeaderTextID": "TXT.TABLE.HEADER.COL1",
						"sortable": true,
						"HeaderStyle": "col-md-8"
					},
					"col2":
					{
						"HeaderTextID": "TXT.TABLE.HEADER.COL2",
						"sortable": false,
						"HeaderStyle": "col-md-4"
					}
				},
				"ContextMenuItems": {
					"Edit": {
						"TextID": "TXT.CONTEXTMENU.EDIT",
						"Icon": "Edit",
						"DstScreenID": "Screen3",
						"RowColumn": "id",
						"FireEvents": [ "GetFormfieldData" ]
					}
				},
				"CellGroupRowStyle": "row sysListContent",
				"RowAfterElements": 2,
				"ElementsEnclosedByDivStyle": [
					"col-md-8",
					"col-md-4"
				]
			}
		}
	}

.. code-block:: javascript

	skeleton.json

	{
		"Screen1":
		[
			{
				"Div1":
				{
					"RefID": "Screen1"
				}
			}
		],
		"Screen2":
		[
			{
				"TestList1Connector":
				{
					"RefID": "Screen2"
				}
			},
			{
				"TestList1":
				{
					"RefID": "TestList1Connector"
				}
			}
		],
		"Screen3":
		[
			{
				"TestFormfields1Connector":
				{
					"RefID": "Screen3"
				}
			},
			{
				"TestFormfields1":
				{
					"RefID": "TestFormfields1Connector"
				}
			}
		]

	}
