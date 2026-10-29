.. appdev-context-menu

.. _appdevcontextmenu:

12. Context Menu
================

The *x0 Context Menu* engine (``sysContextMenu`` / ``sysContextMenuItem``,
``www/sysObjContextMenu.js``) is fully decoupled from any specific
*x0-object-type*. It is not a feature bolted onto a fixed set of widgets, but a
generic, reusable component: **any** *x0-system-object* -- including a custom
user-defined class deriving from ``sysBaseObject`` -- can register a
``mousedown`` listener and instantiate a ``sysContextMenu`` to present a
right-click menu bound to itself. The sections below first list the
*x0-object-types* that ship with this capability out-of-the-box, document the
declarative ``ItemConfig`` schema shared by all of them, and finally provide an
implementation blueprint for wiring a context menu into a custom object.

12.1. Out-of-the-Box Supported Objects
***************************************

.. table:: Out-of-the-Box Context Menu Support
	:widths: 20 20 25 60

	+-----------------+------------------------+---------------------------------+---------------------------------------------------------------------------------------------------------------+
	| **Object Type** | **Attribute**          | **ParentObject** / Scope        | **Notes**                                                                                                     |
	+=================+========================+=================================+===============================================================================================================+
	| List            | ContextMenuItems       | Row (``sysListRow``)            | Declarative, per-row actions, see :ref:`objecttype-list`                                                      |
	+-----------------+------------------------+---------------------------------+---------------------------------------------------------------------------------------------------------------+
	| List            | HeaderContextMenuItems | List itself (header)            | Declarative, list-wide actions, e.g. ``remove-selected``                                                      |
	+-----------------+------------------------+---------------------------------+---------------------------------------------------------------------------------------------------------------+
	| FormfieldList   | ContextMenuItems       | FormfieldList itself            | Declarative, see :ref:`objecttype-formfieldlist`                                                              |
	+-----------------+------------------------+---------------------------------+---------------------------------------------------------------------------------------------------------------+
	| DynRadioList    | (hardcoded)            | Row (``sysObjDynRadioListRow``) | Built-in single Remove item, gated by constructor flag ``CtxtMenuActive``, see :ref:`objecttype-dynradiolist` |
	+-----------------+------------------------+---------------------------------+---------------------------------------------------------------------------------------------------------------+

:ref:`objecttype-list` is the only *x0-object-type* exposing two independent
context menus: a per-row menu (``Attributes.ContextMenuItems``, bound in
``sysListRow.prototype.init``) whose ``ParentObject`` is the clicked row --
suitable for row-scoped actions such as ``remove`` or ``get-data`` -- and a
header menu (``Attributes.HeaderContextMenuItems``, bound in
``sysList.prototype.setupHeader``) whose ``ParentObject`` is the ``List``
itself -- suitable for list-wide actions such as ``remove-selected`` or
``reset``. :ref:`objecttype-formfieldlist` exposes a single
``Attributes.ContextMenuItems`` binding on the object itself. The
:ref:`objecttype-dynradiolist` context menu is the one exception to the
declarative pattern described below: its single "Remove" item is hardcoded in
``sysObjDynRadioListRow.prototype.EventListenerRightClick`` and only activated
when the row is constructed with the internal ``CtxtMenuActive`` flag set to
``true``; it does not read an ``Attributes.ContextMenuItems`` JSON definition.

12.2. Global Item Attributes
*****************************

Every entry of an ``ItemConfig`` array (the value assigned to
``ContextMenuItems`` / ``HeaderContextMenuItems``) supports the following
display attributes, plus exactly one of the dispatch mechanisms documented in
12.3.

.. table:: Context Menu Item Global Attributes
	:widths: 30 20 90

	+--------------+---------------+--------------------------------------------+
	| **Property** | **Type**      | **Description**                            |
	+==============+===============+============================================+
	| TextID       | TextID-String | TextID referenced in "webui.text" DB Table |
	+--------------+---------------+--------------------------------------------+
	| IconStyle    | CSS-String    | CSS Style Classes, space separated         |
	+--------------+---------------+--------------------------------------------+

12.3. Dispatch Mechanisms
***************************

On click, ``sysContextMenuItem.prototype.EventListenerClick`` evaluates each of
the following ``ItemConfig`` keys independently; an item may combine several of
them, and the menu is closed after processing regardless of which mechanism
fired.

12.3.1. InternalFunction
#########################

``InternalFunction`` dispatches a named, built-in function against the
context menu's ``ParentObject`` via the global ``FunctionDispatcher``
(``www/sysFunctionDispatcher.js``).

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
	| remove          | ``ObjectRef.remove()``                                 | Removes the object, see :ref:`devoopmodel-classes-baseobj-remove`                          |
	+-----------------+--------------------------------------------------------+--------------------------------------------------------------------------------------------+
	| remove-selected | ``ObjectRef.removeSelected()``                         | Removes all currently selected rows (``List``-level action)                                |
	+-----------------+--------------------------------------------------------+--------------------------------------------------------------------------------------------+
	| reset           | ``ObjectRef.reset()``                                  | Resets the object to its initial state                                                     |
	+-----------------+--------------------------------------------------------+--------------------------------------------------------------------------------------------+

``get-set-data`` additionally requires a ``DstObjectID`` entry on the same
``ItemConfig`` item, resolved via ``sysFactory.getObjectByID()``.

12.3.2. CallbackFunction / CallbackObjRef
###########################################

As an alternative (or in addition) to ``InternalFunction``, an item may supply
a ``CallbackFunction`` -- an arbitrary function reference -- invoked as
``CallbackFunction(CallbackObjRef)``. This bypasses the ``FunctionDispatcher``
entirely and is the mechanism of choice for custom, object-specific behaviour
that has no corresponding built-in function, such as toggling a custom edit
mode (see 12.4 for a complete example).

12.3.3. OverlayScreenID
#########################

Setting ``OverlayScreenID`` to a valid ScreenID activates the referenced
overlay screen via ``sysFactory.OverlayObj.activateOverlay()`` (see
:ref:`appdevoverlay`) before the menu is closed.

12.3.4. FireEvents
#####################

Setting ``FireEvents`` to an array of EventIDs fires the referenced
*x0-system-events* via ``sysFactory.Reactor.fireEvents()`` (see
:ref:`appdeveventsystem`), allowing a context menu action to notify arbitrary,
unrelated *x0-system-objects* without a direct object reference.

12.4. Developer Guide: Implementing a Context Menu on a Custom Object
************************************************************************

Because every object added to a screen's hierarchy automatically receives a
``this.ScreenObject`` reference from ``sysScreen.prototype.setupObject`` prior
to ``init()`` being called, the two-phase pattern below works unmodified on
any custom *x0-object-type*, independent of whether it is instantiated
declaratively (via metadata) or programmatically.

**Phase 1 -- Event Registration**

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

**Phase 2 -- Runtime Evaluation and Instantiation**

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
