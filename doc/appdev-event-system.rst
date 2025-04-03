.. appdev-event-system

8. Event-System / Actions
=========================

+!Reactor!, Objects OnEvent Property.

* Button
* ButtonInternal


7.2 Button
----------





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
