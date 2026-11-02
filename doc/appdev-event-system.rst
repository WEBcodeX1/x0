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

a) **Declarative Configuration** and
b) how the **Programmatic Implementation** works.

15.3. Backend-Related Receiver
------------------------------

A backend configuration must always contain the ``ServiceCall`` property, which specifies
the service URL. The network request is executed by the *x0-system-call* ``sysCallXMLRPC()``.
The **request-type** is always **POST**, and the HTTP request POST payload can additionally be
configured to contain dynamic JSON system data.

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

15.3.2. Producer Config
-----------------------

First we need to define the service properties inside ``object.json`` of type ``ServiceConnector``.

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



15.4. System Producer Types
---------------------------

15.5. System Producer Types
---------------------------

.. table::
   :widths: 20 95 35

   +-------------------+-------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------------+
   | **Source**        |                                                                                                             | **Reference**                              |
   +===================+=====================================================================================================================================+============================================+
   | Button            | Attributes.FireEvents, after successful Form Validation (and per-Action FireEvents in OnResult, after successful Service Execution) | see 16.1, :ref:`objecttype-button`         |
   +-------------------+-------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------------+
   | ButtonInternal    | Attributes.FireEvents, after successful Form Validation                                                                             | see 16.2, :ref:`objecttype-buttoninternal` |
   +-------------------+-------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------------+
   | Tab               | Tab-level FireEvents, on tab switch                                                                                                 | :ref:`objecttype-tabcontainer`             |
   +-------------------+-------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------------+
   | FormfieldOnChange | OnChange.FireEvents, on matching form value change                                                                                  | :ref:`appdevforms` (17.3.6)                |
   +-------------------+-------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------------+
   | NotifyIndicator   | Notify.OnSuccess.FireEvents, on successful async backend notification                                                               | :ref:`appdev-backend-notify`               |
   +-------------------+-------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------------+
   | ContextMenu       | ItemConfig.FireEvents, on context menu item click                                                                                   | :ref:`appdevcontextmenu`                   |
   +-------------------+-------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------------+


15.2.1. System Registration
---------------------------

Any *x0-system-object* supporting (documented later on) firing events can be configured via its
declarative JSON in ``object.json``.

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



.. table:: Declarative Event Registration Schema (OnEvent)
   :widths: 16 14 90

   +---------------+----------+------------------------------------------------------------------------------------------------------------------------------------------------------+
   | **Property**  | **Type** | **Description**                                                                                                                                      |
   +===============+==========+======================================================================================================================================================+
   | Events        | Array    | Entries are either plain ``EventID`` strings or ``{ EventID, EventSelector }`` objects                                                               |
   +---------------+----------+------------------------------------------------------------------------------------------------------------------------------------------------------+
   | EventID       | String   | Identifier matched against the ID of a dispatched event                                                                                              |
   +---------------+----------+------------------------------------------------------------------------------------------------------------------------------------------------------+
   | EventSelector | String   | Optional discriminator; several registrations may share one ``EventID`` while reacting only to a specific selector value (e.g. one per ``ScreenID``) |
   +---------------+----------+------------------------------------------------------------------------------------------------------------------------------------------------------+


15.2.2. Programmatic Registration
---------------------------------

15.3.1. Built-in System Events
******************************

Two *x0-system-events* are dispatched automatically by the engine and require no
explicit "fire" configuration anywhere -- any object may register for them:

    - ``InitSystem``: dispatched exactly once by ``sysFactory.init()`` after every
      screen has been built and the default screen has been switched to, signalling
      that the application has reached its final running state.
    - ``SwitchScreen``: dispatched by ``sysFactory.switchScreen(ScreenID)`` every time
      the active screen changes, using the destination ``ScreenID`` as the
      ``EventSelector`` -- allowing a registration to react only to a specific screen
      becoming active.

15.4. Backend-Related Events
----------------------------

.. _appdevcontrolflow:

16. Control Flow Items
======================

The next sub-chapters describe the logical control-flow and in which order they are processed.

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
