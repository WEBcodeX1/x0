.. appdev-backend

7. Backend / Services
=====================


7.1 ServiceConnector
--------------------

With help of a Service Connector Object you load backend data into already loaded
System Obejcts (after initial app-rendering took place).

You can trigger data load on System Event occurence, see: #TODO: link to Raising Events.


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

Example (object.json)
*********************

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

7.2 SrcDataObjects
------------------

7.3 Global Data
---------------

7.4 Authentication
------------------

