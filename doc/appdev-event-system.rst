.. appdev-event-system

7. Events / Actions
===================

+!Reactor!, Objects OnEvent Property.

* Button
* ButtonInternal


7.2 Button
----------

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

7.3 ButtonInternal
------------------

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


7.4 ErrorContainer
------------------

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
