.. logic-objects

Control-Logic defining Objects
==============================

The following Object-Types ... .

* ServiceConnector
* Button
* ButtonInternal
* ErrorContainer


ServiceConnector
----------------

A Service Connector Object will be connected / put "in front of" an Object capable of loading
Service Data when Event(s) will be raised. This is done in skeleton.json (see Example below
Object Property Definition).

If put e.g. in front of a List Type Object, the List will be "filled" with Backend Data on
Event(s) occurence.

Object Properties
*****************

+---------------------+----------------------+-------------------------------------------------+
| **Property**        | **Value(s)**         | **Description**                                 |
+=====================+======================+=================================================+
| OnEvent             | JS Object            | Event Properties                                |
+---------------------+----------------------+-------------------------------------------------+

Event Properties
****************

+---------------------+----------------------+-------------------------------------------------+
| **Property**        | **Value(s)**         | **Description**                                 |
+=====================+======================+=================================================+
| Events              | Array of Strings     | Listen to given Events                          |
+---------------------+----------------------+-------------------------------------------------+
| ServiceCall         | Backend Script       | Call Backend Script on raised Event(s)          |
+---------------------+----------------------+-------------------------------------------------+

JSON Example (object.json)
**************************

.. code-block:: javascript

	"ContactSearchListConnector":
	{
		"Type": "ServiceConnector",
		"Attributes":
		{
			"OnEvent":
			{
				"Events": [ "TestEvent" ],
				"ServiceCall": "python/getData.py"
			}
		}
	}

JSON Example (skeleton.json)
****************************

The following Example maps a Service Connector Object to a Parent Tab Container Object and a FormfieldList
Object Type to the Service Connector Object.

When the Event "TestEvent" defined in the Example above will be raised, data from python/getData.py Backend
Script will be loaded into the FormfieldList Object.

.. code-block:: javascript

	"Screen1":
	[
		{
			"TabContainer1":
			{
				"RefID": "Tab1"
			}
		},
		{
			"ServiceConnector1":
			{
				"RefID": "TabContainer1",
				"ElementID": "Tab1"
			}
		},
		{
			"Formfields1":
			{
				"RefID": "ServiceConnector1"
			}
		}
	]

Button
------

Object Properties
*****************

Button Object Type calls Backend Script with optional Data (Source Objects) and reacts to Status Code / Data.

This Data can be "sent" to other Object-Types on Success.

+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| **Property**        | **Type**  | **Value(s)**   | **Description**                          | **Optional** | **Default**  |
+=====================+===========+================+==========================================+==============+==============+
| Style               | Strings   | CSS Classes    | Likewise HTML DIV CSS Styles             |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| Deactivated         | Bool      | true | false   |                                          |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| TextID              | String    |                | Backend Text ID                          |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| OnClick             | String    |                | Backend Script to call on Button press   |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| FormValidate        | Bool      | true | false   | Actually must be set true to validate    |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| ValidateObjects     | JS Array  | ObjectIDs      | All Objects to validate                  |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| FireEvents          | JS Array  | Events         | Events to raise                          |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| SrcDataObjects      | JS Objects|                | Object Data sent to Backend              |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| OnResult            | JS Objects|                | List of Objcts defining Result Handling  |              |              |
|                     |           |                | see:                                     |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+

.. warning::

	FormValidate Property makes no sense anymore. Should be sufficent if ValidateObjects JS Array is given containing all
	Objects to validate.

.. warning::

	SrcDataObjects will be refactored to plain JS Array, actually a List of Objects is used which is too complex to handle.

.. warning::

	OnResult should be a JS Array of Objects due to order processing.


JSON Structure Example
**********************

.. code-block:: javascript

	"Button1":
	{
		"Type": "Button",
		"Attributes": {
			"Style": "sysButton sysButtonAssign",
			"Deactivated": true,
			"TextID": "TXT.BUTTON1",
			"OnClick": "python/BackendScript.py",
			"FormValidate": true,
			"FireEvents": [ "Event1" ],
			"OnResult": {
				"setResultValues": {
					"DstObjectID": "DstObjectID",
					"ResultKey": "id",
					"ServiceKey": "id"
				}
			},
			"SrcDataObjects": {
				"FormfieldID": {
					"Type": "Formfield"
				}
			}
		}
	}

ButtonInternal
--------------

Object Properties
*****************

+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| **Property**        | **Type**  | **Value(s)**   | **Description**                          | **Optional** | **Default**  |
+=====================+===========+================+==========================================+==============+==============+
| Style               | Strings   | CSS Classes    | Likewise HTML DIV CSS Styles             |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| TextID              | String    |                | Backend Text ID                          |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+
| FireEvents          | JS Array  | Events         | Events to raise                          |              |              |
+---------------------+-----------+----------------+------------------------------------------+--------------+--------------+

JSON Structure Example (simple)
*******************************

.. code-block:: javascript

	"ButtonSubmit":
	{
		"Type": "ButtonInternal",
		"Attributes":
		{
			"Style": "sysButton",
			"TextID": "TXT.BUTTON1",
			"FireEvents": [ "ContactSearch" ]
		}
	}


ErrorContainer
--------------

Actually ErrorContainer Object Type is an Attribute-less Object to view Error Output (e.g. on
Validation).

.. warning::

	Therefor it could also be a simple DIV Type. This should be discussed for later released.


JSON Structure Example
**********************

.. code-block:: javascript

	"ErrorContainerID":
	{
		"Type": "ErrorContainer",
		"Attributes": {
		}
	}
