.. appdev-event-system

.. _appdeveventsystem:

15. Event-System
================

15.1. Intro
-----------

*x0-events* are internally handled by the **x0::Reactor** component. This mechanism
generically and transparently processes the following subtypes:

* **Backend-Related Event Processing:** an event registration triggers a remote service
  call, bridging the event system to the backend via a ``ServiceConnector``.

* **Internal Event Processing:** an event registration triggers a
  purely client-side reaction -- no network request is ever involved, and the full
  round-trip executes synchronously within the browser.

.. image:: images/x0-event-system.png
  :alt: image - event system

15.2. Generic Implementation
----------------------------

An event exchange *always* involves an

- **x0-event-producer** object and
- **x0-event-receiver** object.

Regardless of the processing type, events are handled transparently. The sole exception
applies to the backend-related method on the receiver object type: here, a ``ServiceConnector``
configuration must be **bound** (referenced in ``skeleton.json``) to a pre-existing
object definition inside ``object.json``. This design explicitly separates the configuration
properties of the event-producer (direct ``JSONConfig``) from those of the event-receiver.

The following chapters document exactly how to complete this:

a) **Declarative Configuration** (for backend related receiver) and
b) how the **Programmatic Implementation** (in custom setup *x0-objects*) works.

15.3. Backend-Related Receiver
------------------------------

A backend configuration must always contain the ``ServiceCall`` property, which specifies
the service URL. The network request is executed by the *x0-system-call* ``sysCallXMLRPC()``.
The **request-type** is always **POST**, and the HTTP request POST payload can additionally be
configured using the internyl x0 ``SourceDataObjects`` mechanism to smartly enhance the JSON
structures sent to backend systems.

The following example demonstrates a working setup using a ``FormfieldList`` object as the
producer type; however, any *x0-producer-type* can be used (see 15.4.).

15.3.1. ServiceConnector Config
-------------------------------

First we need to define the service properties inside ``object.json`` of type ``ServiceConnector``.

.. code-block:: javascript

   "ConnectorObjectID":
   {
      "Type": "ServiceConnector",
      "Attributes":
      {
         "OnEvent":
         {
            "Events": [ "InitSystem" ],
            "ServiceCall": "/python/BackendService.py"
         }
      }
   },

15.3.2. Receiver Config
-----------------------

Afterwards a system supported object type must be added to ``object.json``, only after the next step
has been carried out, the objects are referenced and work.

.. code-block:: javascript

   "ProducerObjectID":
   {
      "Type": "FormfieldList",
      "Attributes":
      {
      }
   },

15.3.3. Object Relation
-----------------------

Now, the step of referencing the objects in ``skeleton.json`` finally

15.3.4. Summary
---------------

15.3.5. Callback Data Schema
----------------------------

15.4. System Producer Types
---------------------------

The following by FireEvents

- Button
- ButtonInternal
- Tab
- FormfieldOnChange
- ContextMenu

15.5. Built-in System Events
----------------------------

Two *x0-system-events* are dispatched automatically by the engine and require no
explicit "fire" configuration anywhere -- any object may register for them:

    - ``InitSystem``: dispatched exactly once by ``sysFactory.init()`` after every
      screen has been built and the default screen has been switched to, signalling
      that the application has reached its final running state.

    - ``SwitchScreen``: dispatched by ``sysFactory.switchScreen(ScreenID)`` every time
      the active screen changes, using the destination ``ScreenID`` as the
      ``EventSelector`` -- allowing a registration to react only to a specific screen
      becoming active.



15.6. Programmatic Registration
-------------------------------

Following a button configuration:

.. code-block:: javascript

   "OnEvent":
   {
     "Events": [
       "CustomEventName",
       {
         "EventID": "SwitchScreen",
         "EventSelector": "Screen1"
       }
     ]
   }


.. _appdevcontrolflow:




14.3. Source Data Objects
-------------------------

*x0-source-data-objects* feature is a very smart way to control **which** data will be
sent to the backend.

Just reference multiple *x0-system-objects* and its realtime data will be sent to
the backend service.

The following sub-chapters describe how to use SrcDataObjects JSON format in detail.

.. note::

    *x0-source-data-objects* are not only usable in combination with
   service connector, also buttons support the feature.

14.3.1. Global Objects Array
****************************

.. code-block:: javascript

   "SrcDataObjects":
   [
      "ObjectID1",
      "ObjectID2",
      "ObjectID3"
   ]

14.3.2. Hardcoded Values
************************

.. code-block:: javascript

   "SrcDataObjects":
   {
      "Dummy":
      {
         "Type": "HardcodedValues",
         "Values": {
            "LimitRows": 20
         }
      }
   }

14.3.3. Global Object
*********************

.. code-block:: javascript

   "SrcDataObjects":
   {
      "$ObjectID":
      {
         "Type": "GlobalObject"
      }
   }

14.3.4. Chaining Object Types
*****************************

.. code-block:: javascript

   "SrcDataObjects":
   {
      "$ObjectID":
      {
         "Type": "GlobalObject"
      },
      "Dummy":
      {
         "Type": "HardcodedValues",
         "Values": {
            "LimitRows": 10
         }
      }
   }












16. Actions
===========

*x0-actions*

The following sub-chapters describe the logical control flow of the different object
types and the order in which they are processed.

.. _appdevcontrolbutton:

16.1. Button
------------

* Backend Service Execution
* Execute Action *after* **successful** Form Validation
* Fire Events *after* **successful** Form Validation
* Execute OnResult Actions *after* **successful** Service Execution
* Fire Events *after* **successful** Service Execution

.. _appdevcontrolbuttoninternal:

16.2. ButtonInternal
--------------------

* No Backend Service Execution
* Form Validation
* Execute Action *after* **successful** Form Validation
* Fire Events *after* **successful** Form Validation
