.. appdev-overlay

.. _appdevoverlay:

18. Overlay
===========

During ``sysFactory.prototype.init()`` (see :ref:`devoopmodel`), every screen
declared in ``skeleton.json`` is instantiated up-front — all screens are
present in the DOM. When no overlay is active, only one single base screen is
visible. *x0-overlay-mode* exploits this pre-instantiation design to allow
multiple screens to be active and visible in parallel.

When an overlay is triggered, a minimum of two screens become active
simultaneously, as the overlay screen is raised above the active base screen.
Furthermore, the architecture supports stacking: when invoking multiple
overlays (for example, via a context menu), more than two layers (> 2) can be
rendered and active in parallel. Because screens are pre-rendered in the DOM
instead of being built on demand, managing these layers never costs an
additional render pass or backend request.

The engine lives in ``sysScreenOverlay`` (``/www/sysScreenOverlay.js``) and is
exposed system-wide as the single ``sysFactory.OverlayObj`` instance,
instantiated once in the ``sysFactory`` constructor (``/www/sysFactory.js``).

18.1. The sysScreenOverlay Engine
---------------------------------

``sysFactory.OverlayObj`` provides three methods that act directly on a
target screen's ``HierarchyRootObject``, resolved via
``sysFactory.getScreenByID(ScreenID)``:

* ``activateOverlay(ScreenID, OverrideStyle)`` -- applies the overlay CSS
  class (``overlay-screen p-5 bg-secondary bg-opacity-75 shadow`` by
  default, or ``OverrideStyle`` if supplied), sets ``VisibleState`` to
  ``visible`` and raises ``DOMStyleZIndex`` to ``300`` so the overlay
  renders above the regular screen stack.
* ``closeOverlay(ScreenID)`` -- removes the overlay style class and sets
  ``VisibleState`` back to ``hidden``.
* ``activateOverlayAtPosition(ScreenID, CoordX, CoordY, Width)`` --
  absolutely positions the overlay screen at the given pixel coordinates
  (optionally constraining its width), then delegates to
  ``activateOverlay()`` with the ``overlay-positioned m-0 p-0 shadow``
  style. Used for context-anchored pop-ups such as badge or collaborator
  selectors (see 18.4).

18.2. Triggering an Overlay
---------------------------

Two purely declarative trigger mechanisms are available -- neither requires
custom JavaScript.

18.2.1. Button Action
*********************

Any ``Button``/``ButtonInternal`` object (see :ref:`systemobjects`) can
declare the ``openoverlay`` action, dispatched by
``sysButtonActionProcessor`` (``/www/sysButtonActionProcessor.js``):

.. code-block:: json

	{
		"Action": "openoverlay",
		"ScreenID": "ExamplesOverlayEditData"
	}

This resolves to ``sysFactory.OverlayObj.activateOverlay(Attributes.ScreenID)``.

18.2.2. Context Menu Item
*************************

Any *x0-context-menu* item (``List``, ``FormfieldList``, or a custom object,
see :ref:`appdevcontextmenu`) can declare ``OverlayScreenID`` on its
``ItemConfig`` to raise an overlay screen as part of its dispatched function
(see :ref:`appdevcontextmenu`, 12.3.3).

18.3. Closing an Overlay
------------------------

There is currently no declarative ``closeoverlay`` Button action; closing is
performed programmatically by the hosting object once the user's
interaction is complete, typically from a ``ButtonCallback``:

.. code-block:: javascript

	sysObjImageSelectorRow.prototype.ButtonCallback = function()
	{
	    this.ParentObject.SrcObjectRef.setImgData(this.Data);
	    sysFactory.OverlayObj.closeOverlay('ExamplesBasicOverlayImageSelector');
	}

(see ``/www/sysObjImageSelector.js``). The *x0-context-menu* engine closes
its own menu immediately after dispatching ``OverlayScreenID`` (see
:ref:`appdevcontextmenu`).

.. note::

	Additionally, developers must implement a close element including event handling;
	otherwise, users will not be able to close the overlay screen without triggering
	a specific action.

18.4. Example (Static Reference Container)
------------------------------------------

The static reference container (:ref:`appdev-static-deployment`) demonstrates
both trigger mechanisms:

* **Menu -> Examples -> Overlay** opens the ``ExamplesOverlay`` screen
  (``/static/meta/skeleton.json``, ``/static/meta/object.json``). Its
  ``ExamplesOverlayList`` list declares an **Edit in Overlay** context-menu
  entry (``InternalFunction: "get-set-data"``,
  ``OverlayScreenID: "ExamplesOverlayEditData"``,
  ``DstObjectID: "ExamplesOverlayEditOverlayDataFormWorker"``): selecting it
  copies the row's data into the overlay's form and raises the
  ``ExamplesOverlayEditData`` screen above the active one, with no network
  round-trip involved.
* **Menu -> Examples -> Editable Templates**, the ``ExampleCardTasklist``
  user object (``/www/userObjExampleCardTasklists.js``) opens its badge and
  collaborator pickers via
  ``activateOverlayAtPosition(ScreenID, EventRef.pageX, EventRef.pageY, 450)``,
  anchoring the ``OverlayBadgeSelector``/``OverlayCollaboratorSelector``
  screens at the triggering click position
  (:ref:`BadgeSelector <objecttype-badgeselector>`,
  :ref:`ExamplePeopleSelector <objecttype-examplepeopleselector>`).

The legacy ``/example/screen_overlay`` application is intentionally **not**
referenced here: it predates the current engine, relies on the removed
``Link`` object type and a non-existent ``OverlayID`` attribute, and no
longer runs against the current codebase.

19. Object Instancing
=====================

In addition to overlay-mode screens, ``object.json`` allows an entry to be
declared as a runtime *instance* of another, already-defined object instead
of repeating its full definition. This is resolved by
``sysScreen.prototype.configObjectInstance()`` (``/www/sysScreen.js``)
during ``setupObject()`` (see :ref:`devoopmodel`, 23.6.2/23.6.3).

19.1. InstanceOf
----------------

Declaring ``InstanceOf`` on an object resolves the referenced object's full
configuration from ``sysFactory.DataObject.XMLRPCResultData`` and
deep-merges it into the instance's own configuration via
``sysMergeObjects()`` (see :ref:`devoopmodel`, 23.9): matching keys from the
referenced object overwrite the instance's own, array-valued attributes are
appended rather than replaced, and nested ``Attributes`` objects are merged
recursively.

.. code-block:: json

	"ExamplesCopyPasteDestinationFormList":
	{
		"InstanceOf": "ExamplesCopyPasteFormSource"
	}

(from ``/static/meta/object.json``) instantiates a full copy of the
``ExamplesCopyPasteFormSource`` ``FormfieldList`` definition, including its
``ContextMenuItems``, without repeating a single attribute.

19.2. AttributesOverwrite
-------------------------

Declaring ``AttributesOverwrite`` alongside ``InstanceOf`` overrides
individual keys of the referenced object's ``Attributes`` before the merge
takes place -- only keys already present on the referenced object are
honoured:

.. code-block:: json

	"ExamplesOverlayFormlist":
	{
		"InstanceOf": "ExamplesCopyPasteFormSource",
		"AttributesOverwrite": {
			"ObjectIDs": [
				"WorkerNameLabel", "WorkerName",
				"WorkerSurenameLabel", "WorkerSurename",
				"TeamGroupLabel", "TeamGroup"
			]
		}
	}

(from ``/static/meta/object.json``) instantiates the same
``ExamplesCopyPasteFormSource`` ``FormfieldList``, but renders only the
worker name/surname/team-group fields instead of the full source field set.

.. note::

	``InstanceOf``/``AttributesOverwrite`` is declared purely inside
	``object.json``. An object's position in the hierarchy is still governed
	by the regular ``RefID``/``ElementID`` mechanism inside
	``skeleton.json`` (see :ref:`appdevconfig`, 7.4.2/7.5) -- the two
	concepts are independent and freely combinable.

**Related Documentation:**

* :ref:`systemobjects` - System object catalogue
* :ref:`appdevcontextmenu` - ``OverlayScreenID`` context-menu dispatch
* :ref:`appdevconfig` - ``object.json``/``skeleton.json`` schema fundamentals
* :ref:`appdev-static-deployment` - Static reference container used throughout this chapter
