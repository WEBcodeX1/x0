.. appdev-global-css

.. _appdevglobalcss:

8. Styling
==========

Runtime objects accept CSS class names through their ``Style`` metadata
attribute. List-like objects additionally accept row and column style
attributes; see :ref:`appdevgridsystem`. The framework includes Bootstrap
styles and Font Awesome assets, while ``www/static/globalstyles.css`` defines
the project-specific selectors listed below.

.. code-block:: json

   {
     "SaveButton": {
       "Type": "Button",
       "Attributes": {
         "Style": "btn btn-primary me-2",
         "TextID": "TXT.BUTTON.SAVE"
       }
     }
   }

Bootstrap classes can be combined with project-specific classes. Consult the
bundled Bootstrap stylesheet for the supported Bootstrap class names; avoid
assuming that a class shown in an example is defined by x0.

8.1. Project CSS Selectors
--------------------------

* ``required`` — adds a red asterisk before required form controls.
* ``menu-absolute-pos`` and ``screen-absolute-pos`` — default absolute
  positioning for the menu and screen.
* ``overlay-screen`` and ``overlay-positioned`` — full-screen and positioned
  overlay styling.
* ``notifyindicator-item`` — positions asynchronous notification items.
* ``context-menu`` — positions the context-menu container.
* ``treeitem-selected`` and ``treeitem-selected-hilite`` — selection marker
  and highlight for the simple tree.
* ``border-dotted`` and ``border-right-dotted`` — dotted border utilities
  used by image/file-selection layouts.
* ``example-item-container1``, ``example-item-container1-image``, and
  ``example-item-container1-hrcolor`` — styling for the editable-item example.
* ``example-card-border`` — styling for the card-task-list example.
* ``dragdrop-over`` — hover-state styling hook. Its presence does not by
  itself enable drag-and-drop event handling.

8.2. Customizing Styles
-----------------------

Add application-specific rules to ``www/static/globalstyles.css`` and apply
their class names through the object's ``Style`` attribute. Keep shared
presentation rules in the stylesheet rather than duplicating inline styles
throughout metadata. Prefer Bootstrap utilities for standard layout and
spacing, and use custom selectors only for application-specific behavior.
