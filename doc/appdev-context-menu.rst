.. appdev-context-menu

.. _appdevcontextmenu:

13. Context Menu
================

An *x0-context-menu* is a flexible, configurable **building block** designed to model
**highly efficient** workflows. Instead of being bound only to specific, static, pre-existing
*x0-system-objects*, it can also be bound to **custom-made** objects easily.

What makes the *x0-infrastructure* so special is its **smart OOP model**, which allows callback
functions to be bound **directly** to an *x0-object-instance* or to **global system functions**.
For example, it can utilize the *x0-clipboard*, which operates on real objects rather
than *flat*, disconnected copy/paste metadata.

This enables complex **copy/paste** operations that other systems can only dream of,
especially since operating systems like Windows or Linux handle clipboard data with a very
limited (and often insecure) approach. The *x0-context-menu* is built for next-generation
applications—object-oriented and easily extensible.

13.1. Supported System Objects
------------------------------

The following listed *x0-system-objects* support native context menu configuration via its
related JSONConfig.Attributes in ``object.json``:

- List (Header)
- List (Row)
- FormfieldList
- DynRadioList

13.1.1. List Header
*******************

13.1.2. List Row
****************

13.1.3. FormfieldList
*********************

13.1.4. DynRadioList
********************

13.2. Dispatch Mechanisms
-------------------------

- Internal Function
- CallbackFunction

13.2.1. InternalFunction
************************

``InternalFunction`` dispatches a named, built-in function against the
context menu's ``ParentObject`` via the global ``FunctionDispatcher``
(``/www/sysFunctionDispatcher.js``).

.. table:: Implemented InternalFunction Values
	:widths: 16 55 70

	+-----------------+--------------------------------------------------------+--------------------------------------------------------------------------------------------+
	| **Value**       | **Dispatched Call**                                    | **Description**                                                                            |
	+=================+========================================================+============================================================================================+
	| get-data        | ``ObjectRef.getObjectData()``                          | Reads data into ``sysFactory.ClipboardData``, see :ref:`devoopmodel-classes-getobjectdata` |
	+-----------------+--------------------------------------------------------+--------------------------------------------------------------------------------------------+
	| set-data        | ``ObjectRef.setObjectData(ClipboardData)``             | Writes ``sysFactory.ClipboardData`` back into the object                                   |
	+-----------------+--------------------------------------------------------+--------------------------------------------------------------------------------------------+
	| get-set-data    | ``DstObject.setObjectData(ObjectRef.getObjectData())`` | Copies data directly to ``DstObjectID``, no clipboard involved                             |
	+-----------------+--------------------------------------------------------+--------------------------------------------------------------------------------------------+

``get-set-data`` additionally requires a ``DstObjectID`` entry on the same
``ItemConfig`` item, resolved via ``sysFactory.getObjectByID()``.

13.2.2. CallbackFunction
************************

As an alternative (or in addition) to ``InternalFunction``, an item may supply
a ``CallbackFunction`` -- an arbitrary function reference -- invoked as
``CallbackFunction(CallbackObjRef)``. This bypasses the ``FunctionDispatcher``
entirely and is the mechanism of choice for custom, object-specific behaviour
that has no corresponding built-in function, such as toggling a custom edit
mode (see 12.4 for a complete example).

13.3. Overlay Activation
------------------------

Setting ``OverlayScreenID`` to a valid ScreenID activates the referenced
overlay screen via ``sysFactory.OverlayObj.activateOverlay()`` (see
:ref:`appdevoverlay`) before the menu is closed.

13.4. Reactor Integration
-------------------------


Setting ``FireEvents`` to an array of EventIDs fires the referenced
*x0-system-events* via ``sysFactory.Reactor.fireEvents()`` (see
:ref:`appdeveventsystem`), allowing a context menu action to notify arbitrary,
unrelated *x0-system-objects* without a direct object reference.

13.5. Declarative Config
------------------------

13.6. Programmatic Integration
------------------------------

