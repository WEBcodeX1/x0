.. examples

19. Examples
============

Use the following URL to start the example applications. Actually 7 Examples exist.

https://127.0.0.1?appid=example1

.. note::

	In Multi-VHost-Configurations the 127.0.0.1 URL is bound to the first Array[0] defined
	virtual host in app-config.json configuration file.

19.1 Dynamic Table / File Upload Column
---------------------------------------

#TODO: add all necessary steps / (config) files / SQL (DB) to reproduce a hello-world example.

19.2 Basic Menu / Screen
------------------------

The example shows a simple Menu / Screen mapping with 2 links. Each link points to a screen.

* Link1 points to Screen1 / Link click switches over to Screen1
* Link2 points to Screen2 / Link click switches over to Screen2

19.2.1 menu.json
~~~~~~~~~~~~~~~~

.. literalinclude:: ../example/basic_menu_screen/static/menu.json
   :linenos:

19.2.2 skeleton.json
~~~~~~~~~~~~~~~~~~~~

.. literalinclude:: ../example/basic_menu_screen/static/skeleton.json
   :linenos:

19.2.3 object.json
~~~~~~~~~~~~~~~~~~

.. literalinclude:: ../example/basic_menu_screen/static/object.json
   :linenos:

19.2.4 DOM state
~~~~~~~~~~~~~~~~

19.2.5 Explanation
~~~~~~~~~~~~~~~~~~

19.2.6 Online Link
~~~~~~~~~~~~~~~~~~

https://x0-test.webcodex.de/examples/basic_menu_screen/


19.3 Hello World
----------------

19.3.1 Defining Source Objects / get List Detail Data
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Source-Object specs see: #TODO Link to Source-Object.

The example defines 2 Screens.

- Screen1: 1 List with a Context-Menu "edit" entry (right click to edit list row in Screen3)
- Screen2: 1 FormfieldList which contents will be loaded when using Screen2 List Context-Menu "edit"

19.3.2 SrcDataObjects / Events
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

With the definition of "SrcDataObjects" attribute connected to the example List "TestList1", the
hardcoded parameter "LimitRows" with value "10" will be added to the http POST request.

.. code-block:: javascript
	:linenos:

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
	:linenos:

	"OnEvent":
	{
		"Events": [ "InitSystem" ],
		"ServiceCall": "python/IntegrationTestGetTableData.py"
	}

With the definition of "SrcDataObjects" attribute connected to the example FormfieldList "TestFormfields1",
the Screen Global Variable with key "id" will be read out of current screen and will be added to the http POST request.

.. code-block:: javascript
	:linenos:

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
	:linenos:

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
	:linenos:

	"OnEvent":
	{
		"Events": [ "InitSystem" ],
		"ServiceCall": "python/IntegrationTestGetTableData.py"
	}

19.4.1 menu.json
~~~~~~~~~~~~~~~~

.. literalinclude:: ../example/list_detail_switch_screen/static/menu.json
   :linenos:

19.4.2 skeleton.json
~~~~~~~~~~~~~~~~~~~~

.. literalinclude:: ../example/list_detail_switch_screen/static/skeleton.json
   :linenos:

19.4.3 object.json
~~~~~~~~~~~~~~~~~~

.. literalinclude:: ../example/list_detail_switch_screen/static/object.json
   :linenos:
