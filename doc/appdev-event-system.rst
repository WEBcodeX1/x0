.. appdev-event-system

.. _appdeveventsystem:

9. Event-System
===============

Any *x0-system-object* getting backend data via *x0-service-connector* method
is able to receive *x0-system-events*.

Any *x0-system-object* is able to register to multiple *x0-events*. On *x0-init*
(initial page load) the ``InitSystem`` *x0-system-event* gets fired.

.. note::

    Some *x0-object-types*, e.g. List will be removed from DOM completely and get
    re-rendered on ``RuntimeSetDataFunc()`` invocation.

.. image:: images/x0-event-system.png
  :alt: image - event system

The following *x0-object-types* support raising events.

* Button
* ButtonInternal
* Link

.. _appdevcontrolflow:

10. Control Flow Items
======================

The next sub-chapters describe the logical control-flow and in which order
they are processed.

.. _appdevcontrolbutton:

10.1. Button
------------

* Backend Service Execution
* Execute Action **after** successful Form Validation 
* Fire Events **after** successful Form Validation
* Execute OnResult Actions **after** successful Service Execution
* Fire Events **after** successful Service Execution

.. _appdevcontrolbuttoninternal:

10.2. ButtonInternal
--------------------

* No Backend Service Execution
* Form Validation
* Execute Action **after** successful Form Validation 
* Fire Events **after** successful Form Validation

.. _appdevcontrollink:

10.3. Link
----------

* Set Screen CSS Style
* Switch Screen
* Open Screen Overlay
* Fire Events

.. _appdevcontrollinkext:

10.4. LinkExternal
------------------

* Open External Link Only in current Browser Window
* Open External Link Only in new Browser Tab
