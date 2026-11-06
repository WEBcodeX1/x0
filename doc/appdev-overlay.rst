.. appdev-overlay

.. _appdevoverlay:

18. Overlay
===========

During *x0-init* (see :ref:`devarchitecture`), every screen declared in
``skeleton.json`` is instantiated up-front—all screens are present in the
DOM. When no overlay is active, only a single base screen is visible.
The *x0-overlay-mode* exploits this pre-instantiation design to allow multiple
screens to be active and visible in parallel.

When an overlay is triggered, a minimum of two screens become active
simultaneously, as the overlay screen is layered above the active base screen.
Furthermore, the architecture supports stacking: when invoking multiple
overlays (for example, via a context menu), more than two layers can be
rendered and active in parallel. Because screens are pre-rendered in the DOM
instead of being built on demand, managing these layers requires minimal overhead;
the *x0-core* intelligently updates only the necessary objects using an
event-driven on-demand model.

18.1. Open Overlay
------------------


18.1.1. Button
**************


.. code-block:: json

   {
      "Action": "openoverlay",
      "ScreenID": "OverlayScreenID"
   }


18.1.2. Context Menu Item
*************************

Any *x0-context-menu* item (see :ref:`appdevcontextmenu`) can declare ``OverlayScreenID``
on its ``ItemConfig`` to open an overlay screen.

18.2. Close Overlay
-------------------

There is currently no declarative ``closeoverlay`` Button action; closing is
performed programmatically by the related object once the user's interaction is
complete, typically from a ``ButtonCallback`` *x0-object-type*:

.. code-block:: javascript

   sysObjCustomObject.prototype.ButtonCallback = function()
   {
       sysFactory.OverlayObj.closeOverlay('OverlayScreenID');
   }
