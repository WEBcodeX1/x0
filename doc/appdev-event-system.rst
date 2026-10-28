.. appdev-event-system

.. _appdeveventsystem:

15. Event-System
================

15.1. Intro
-----------
Any *x0-system-object* getting backend data via *x0-service-connector* method
is able to receive *x0-system-events*.

Any *x0-system-object* is able to register to multiple *x0-events*.
During x0-init (initial page load), the ``InitSystem`` *x0-system-event* is triggered /
fired.

Object references should be resolved through the object hierarchy rather than
retained as DOM nodes, since runtime updates can replace rendered elements.

.. image:: images/x0-event-system.png
  :alt: image - event system

15.2. Raising Events
--------------------

The following *x0-object-types* support raising events.

* Button
* ButtonInternal

.. _appdevcontrolflow:

16. Control Flow Items
======================

The next sub-chapters describe the logical control-flow and in which order
they are processed.

.. _appdevcontrolbutton:

16.1. Button
------------

* Backend Service Execution
* Execute Action **after** successful Form Validation 
* Fire Events **after** successful Form Validation
* Execute OnResult Actions **after** successful Service Execution
* Fire Events **after** successful Service Execution

.. _appdevcontrolbuttoninternal:

16.2. ButtonInternal
--------------------

* No Backend Service Execution
* Form Validation
* Execute Action **after** successful Form Validation 
* Fire Events **after** successful Form Validation

Navigation and overlay actions are available through the supported button
action processor; ``Link`` and ``LinkExternal`` are not registered runtime
object types.
