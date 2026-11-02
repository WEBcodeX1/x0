.. appdev-context-menu

.. _appdevcontextmenu:

12. Context Menu
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

12.1. Supported System Objects
******************************

- List (Header)
- List (Row)
- FormfieldList
- DynRadioList

12.2. JSON Config
*****************


12.3. Dispatch Mechanisms
*************************

- Internal Function
- CallbackFunction


12.3.1. InternalFunction
########################

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

12.3.2. CallbackFunction
########################

As an alternative (or in addition) to ``InternalFunction``, an item may supply
a ``CallbackFunction`` -- an arbitrary function reference -- invoked as
``CallbackFunction(CallbackObjRef)``. This bypasses the ``FunctionDispatcher``
entirely and is the mechanism of choice for custom, object-specific behaviour
that has no corresponding built-in function, such as toggling a custom edit
mode (see 12.4 for a complete example).

12.3.3. OverlayScreenID
#######################

Setting ``OverlayScreenID`` to a valid ScreenID activates the referenced
overlay screen via ``sysFactory.OverlayObj.activateOverlay()`` (see
:ref:`appdevoverlay`) before the menu is closed.

12.3.4. Reactor Integration
###########################

Setting ``FireEvents`` to an array of EventIDs fires the referenced
*x0-system-events* via ``sysFactory.Reactor.fireEvents()`` (see
:ref:`appdeveventsystem`), allowing a context menu action to notify arbitrary,
unrelated *x0-system-objects* without a direct object reference.




12.4. Developer Guide: Implementing a Context Menu on a Custom Object
*********************************************************************

Because every object added to a screen's hierarchy automatically receives a
``this.ScreenObject`` reference from ``sysScreen.prototype.setupObject`` prior
to ``init()`` being called, the two-phase pattern below works unmodified on
any custom *x0-object-type*, independent of whether it is instantiated
declaratively (via metadata) or programmatically.

12.4.1. Step1 - Event Registration
##################################

Register a ``mousedown`` listener under the reserved
``EventListeners['ContextMenuOpen']`` key, typically from the object's
``init()`` method. This is the exact pattern implemented by
``sysListRow.prototype.init``:

.. code-block:: javascript

	sysListRow.prototype.init = function()
	{
	    let EventListenObjRightClick = new Object();
	    EventListenObjRightClick['Type'] = 'mousedown';
	    EventListenObjRightClick['Element'] = this.EventListenerRightClick.bind(this);
	    this.EventListeners['ContextMenuOpen'] = EventListenObjRightClick;
	}

12.4.2. Step2 - Runtime Instantiation
#####################################

Inside the bound handler, verify the click was a right-click
(``Event.button == 2``) and that ``ContextMenuItems`` is actually defined,
then instantiate, configure and initialize a ``sysContextMenu``:

.. code-block:: javascript

	sysListRow.prototype.EventListenerRightClick = function(Event)
	{
	    let ContextMenuItems = this.ParentObject.JSONConfig.Attributes.ContextMenuItems;

	    //- check for right click on mousedown
	    if (Event.button == 2 && ContextMenuItems !== undefined)
	    {
	        let ContextMenu = new sysContextMenu();

	        ContextMenu.ID             = 'CtMenu' + this.ParentObject.ObjectID;
	        ContextMenu.ItemConfig     = ContextMenuItems;
	        ContextMenu.ScreenObject   = this.ParentObject.ScreenObject;
	        ContextMenu.ParentObject   = this;
	        ContextMenu.pageX          = Event.pageX;
	        ContextMenu.pageY          = Event.pageY;

	        ContextMenu.init();
	    }
	}

``ContextMenu.ParentObject`` is the pivotal binding: it becomes the
``ObjectRef`` passed to ``FunctionDispatcher`` (12.3.1) and the
``this``-context implicitly available to any ``CallbackFunction`` (12.3.2).
Setting it to ``this`` binds the menu to the current object; a container may
instead set it to itself (as ``sysList.prototype.setupHeader`` does for its
header menu) to expose container-wide actions.

``userObjExampleEditableItemContainer.js`` (``userObjExampleEditableItem``)
demonstrates that this pattern is not limited to built-in *x0-object-types*: a
project-specific, card-style object implements the identical two-phase
registration, but supplies a dynamically assembled, mode-dependent
``ContextMenuItems`` array using ``CallbackFunction``/``CallbackObjRef`` items
(``enableEditMode``, ``remove``, ``disableEditMode``) instead of
``InternalFunction``, proving that the context-menu engine imposes no
restriction on how a hosting object determines its own menu content.
