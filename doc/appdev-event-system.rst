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

Regardless of the processing type, events are handled transparently, with the sole
exception that a ``ServiceConnector`` must be **bound** (referenced in ``skeleton.json``)
to a pre-existing object definition inside ``object.json``.

The following chapters document exactly how to complete this a) declarative configuration
and b) how the programmatic implementation works.

15.3. Backend-Related Event Processing
--------------------------------------


15.5. Declarative Configurable Objects
--------------------------------------

Several *x0-object-types* can raise ("fire") one or more *x0-events* as a pure,
zero-latency client-side side effect of their own processing, with no backend
involvement whatsoever. The table below is the complete inventory of currently active
fire-triggers:

.. table:: Non-Backend-Related (Internal) Fire-Trigger Inventory
	:widths: 20 95 35

	+-------------------+-------------------------------------------------------------------------------------------------------------------------------------+--------------------------------------------+
	| **Source**        | **Trigger Condition**                                                                                                               | **Reference**                              |
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
