.. appdev-event-system

8. Event-System
===============

Any object getting backend data via ServiceConnector is able to receive *x0-events*

An object can register to multiple *x0-events*.

On *x0-init* the InitSystem event is fired.

* Button
* ButtonInternal
* Link
* LinkExternal

FireEvents

Button and ButtonInternal are form centric, 

Control-Flow-Logic

7.2 Button
----------

* Backend Service Excecution
* Form Validation
* FireEvents *before* Service Excecution
* FireEvents *after* successful Service Excecution

7.2 ButtonInternal
------------------

* No Backend Service Excecution
* Form Validation
* FireEvents on successful Form Validation

7.2 Link
--------


7.2 LinkExternal
----------------

