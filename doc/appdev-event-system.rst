.. appdev-event-system

.. _appdeveventsystem:

15. Event System
================

15.1. Introduction
------------------

*x0-events* are handled internally by the **x0::Reactor** component (``sysReactor.js``).
This mechanism processes the following subtypes in a generic way:

* **Backend-Related Event Processing:** An event execution triggers a remote service
  call, bridging the event system to the backend via a ``ServiceConnector``.

* **Internal Event Processing:** An event execution triggers a
  purely client-side reaction without any network request.

.. image:: images/x0-event-system.png
  :alt: image - event system

15.2. Generic Implementation
----------------------------

An event exchange *always* involves an

- **x0-event-producer** and
- **x0-event-receiver** object.

Regardless of the processing type, events are handled transparently. The sole exception
applies to the backend-related method on the receiver object type: here, a ``ServiceConnector``
configuration must be **bound** (referenced in ``skeleton.json``) to a pre-existing
object definition inside ``object.json``. This design explicitly separates the configuration
properties of the event producer (direct ``JSONConfig``) from those of the event receiver.

The following chapters document the **Declarative Configuration** (for backend-related
receivers). The **Programmatic Implementation** (for custom-setup *x0-objects*) can be
found in the system developer's guide (see: ).

.. important::
   The illustration above shows the *x0-object-type* ``List`` with the name **List1**,
   which has two connected events: **InitSystem** and **BtnClick**. Whenever either event
   is triggered, the list is populated (updated) with data from the **Backend.py** service
   call.

15.3. Backend Data
------------------

To populate an *x0-object* with data from an asynchronous backend service call, a
special *x0-object* of type ``ServiceConnector`` is used.

In addition to the ``Events`` array, a backend configuration must always contain the
``ServiceCall`` property, which specifies the service URL. The network request is executed
by the *x0-system-call* ``sysCallXMLRPC()``. The **request type** here is always **POST**,
and the HTTP POST payload can be configured using the internal x0 ``SourceDataObjects``
mechanism to smartly append structures (e.g., to provide filtering parameters) to the
backend service calls.

The following example demonstrates a working setup using a ``FormfieldList`` object as the
receiver type; however, any *x0-producer-type* can trigger events for it (see 15.4).

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
            "Events": [ "InitSystem", "CustomEvent2" ],
            "ServiceCall": "/python/BackendService.py"
         }
      }
   }

15.3.2. Receiver Config
-----------------------

Afterwards, a system-supported object type must be added to ``object.json``. Note
that the configuration of two form fields has also been included to demonstrate a correct
``FormfieldList`` setup.

.. important::
   Please note: The ``FormfieldList`` object will only receive data once these objects
   are **connected** inside ``skeleton.json``, which is described in the next step (15.3.3).

.. code-block:: javascript

   "ReceiverObjectID":
   {
      "Type": "FormfieldList",
      "Attributes":
      {
         "ObjectIDs": [
            "FormfieldLabel1",
            "Formfield1"
         ],
         "Style": "border rounded p-2",
         "RowStyle": "row m-0 p1",
         "RowAfterElements": 2,
         "ColAfterElements": 1,
         "ColStyle": [
            "col-md-6",
            "col-md-6"
         ]
      }
   },

   "FormfieldLabel1":
   {
      "Type": "FormfieldLabel",
      "Attributes": {
         "Style": "p-1 w-100 text-primary-emphasis",
         "IconStyle": "fa-solid fa-id-card",
         "TextID": "TXT.FORMLABEL1"
      }
   },

   "Formfield1":
   {
      "Type": "FormfieldText",
      "Attributes": {
         "Style": "form-control border-secondary m-1 p-2 w-100 text-primary-emphasis"
      }
   }

15.3.3. Object Relation
-----------------------

Finally, with the following setup in ``skeleton.json``, the receiver object receives
data during system initialization / page load (the **InitSystem** event) **and** when another
producer object triggers the **CustomEvent2** event (e.g., via a button click).

.. code-block:: javascript

   {
      "Screen1":
      [
         {
            "ConnectorObjectID":
            {
               "RefID": "Screen1"
            }
         },
         {
            "ReceiverObjectID":
            {
               "RefID": "ConnectorObjectID"
            }
         }
      ]
   }

15.3.5. Callback Data Schema
----------------------------

Currently, it remains unclear how a) the data from the backend must be structured,
and b) how this data will be mapped to individual form fields inside the FormfieldList
or other *x0-object-types*.

In detail, when a *x0-event* is received and the object is connected to the
corresponding ``ServiceConnector``, an asynchronous ``sysXMLRPCRequest.js`` call is
triggered. Upon successful data retrieval, the object instance's static method
``callbackXMLRPCAsync()`` is invoked with the JSON data resulting from this service call.

This JSON data must conform to the object's internal data schema. To provide a generic
approach for most *x0-object-types*, this structure is a key/value-based object
(for the ``FormfieldList`` type) or an array of multiple key/value-based objects
(for the ``List`` type).

Furthermore, the choice of the redraw algorithm is handled by the object itself. For
example, when a ``List`` receives a list of updated rows, the entire object is
rerendered. However, if it receives a single-row update, only the existing DOM column
values are updated. Consequently, a ``FormfieldList`` typically only needs to update
the existing DOM without triggering a full redraw.

15.4. System Producer Types
---------------------------

The following *x0-object-types* can trigger events. For detailed information on
their configuration, please refer to the documentation under :ref:`systemobjects`.

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

14.3.3. GlobalVar
*****************

Use the ``GlobalVar`` SrcDataObject type to include individual application-wide
global variables in a backend request:

.. code-block:: javascript

   "SrcDataObjects":
   {
      "MyGlobalKey":
      {
         "Type": "GlobalVar"
      }
   }

The key ``MyGlobalKey`` is both the name under which the value is looked up in the
global store and the key under which it is sent to the backend.

14.3.4. ScreenGlobalVar
***********************

Use the ``ScreenGlobalVar`` SrcDataObject type to forward a screen-level variable
to the backend. Specify the source screen with ``ScreenID``:

.. code-block:: javascript

   "SrcDataObjects":
   {
      "MyScreenKey":
      {
         "Type": "ScreenGlobalVar",
         "ScreenID": "Screen1"
      }
   }

The value stored under ``MyScreenKey`` in ``Screen1``'s global store is sent to
the backend under the same key name.

14.3.5. Chaining Object Types
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

.. _appdevactions:

16. Actions
===========

*x0-actions* are only valid for *x0-object-types* of the **button** kind.

.. warning::
   They are a legacy feature and are planned to be merged into the generic
   event system in x0 version 1.2.

The following sub-chapters describe the logical control flow of the different object
types and the order in which they are processed.

.. _appdevactionbutton:

16.1. Button
------------

* Backend Service Execution
* Execute Action *after* **successful** Form Validation
* Fire Events *after* **successful** Form Validation
* Execute OnResult Actions *after* **successful** Service Execution
* Fire Events *after* **successful** Service Execution

.. _appdevactionbuttoninternal:

16.2. ButtonInternal
--------------------

* No Backend Service Execution
* Form Validation
* Execute Action *after* **successful** Form Validation
* Fire Events *after* **successful** Form Validation
