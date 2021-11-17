.. base-objects

Base Objects
============

The system Meta-Data Configuration consists of Objects-Declaration / Configuration in JSON.

* SQLText
* FormfieldList
* List
* Button
* ButtonInternal
* TabContainer
* ErrorContainer
* RowContainer
* ServiceConnector
* DIV


SQLText
-------

JSON Schema
***********

.. code-block:: javascript

	"ObjectID":
	{
		"Type": "SQLText",
		"Attributes": {
			"Style": "Style1 Style2 Style3",
			"TextID": "TXT.TEST.NR1"
		}
	}

Object Properties
*****************

+---------------------+----------------------+-------------------------------------------------+
| **Property**        | **Value(s)**         | **Description**                                 |
+=====================+======================+=================================================+
| Style               | CSS Style Classes    | Likewise HTML DIV CSS Styles                    |
+---------------------+----------------------+-------------------------------------------------+
| TextID              | String (ID)          | Backend Text ID, in DB Table "webui.text"       |
|                     |                      |                                                 |
+---------------------+----------------------+-------------------------------------------------+


Formfield
---------


FormfieldList
-------------

JSON Schema
***********

.. code-block:: javascript

	"FormfieldTest1":
	{
		"Type": "FormFieldList",
		"Attributes": {
			"Style": "DefaultFormList",
			"FormFields": [
				"FormfieldID1",
				"FormfieldID2",
				"FormfieldID3"
			]
		}
	}

Object Properties
*****************

+---------------------+----------------------+-------------------------------------------------+
| **Property**        | **Value(s)**         | **Description**                                 |
+=====================+======================+=================================================+
| Style               | CSS Style Classes    | Likewise HTML DIV CSS Styles                    |
+---------------------+----------------------+-------------------------------------------------+
| FormFields          | Array of Strings     | List of Formfields, Formfield Objects           |
|                     | (Formfield IDs)      |                                                 |
+---------------------+----------------------+-------------------------------------------------+


List
----
