.. dev-object-modeling

.. _devobjectmodeling:

26. x0-Object Modeling
======================

The following sections establish the authoritative architectural blueprint for
designing **custom** *x0-system-objects*. They define the mandatory boilerplate,
the recursive object-linking contract, and the real-time update lifecycle that
every object -- core or custom -- must honour for seamless integration into the
*x0-core* engine.

26.1. Basic Modeling Rules
--------------------------

Before proceeding, ensure you have a **solid understanding** of the following *x0*
fundamentals:

- Base Classes / Inheritance
- Child Objects / Parent Object
- Event Handlers / Callbacks
- Building Object Structure (DOM)
- Modifying Runtime Data
- Object Realtime Updates
- Object Initialization
- Adding Context Menu Functionality

26.2. Base Classes / Inheritance
--------------------------------

The *x0-framework* follows a strict object-oriented approach. All custom *x0-system-objects*
must inherit from ``sysBaseObject`` in their prototypes.

.. code-block:: javascript

    //- Inherit sysBaseObject
    sysObjNewcomer.prototype = new sysBaseObject();

Refer to: :ref:`devoopmodel_base` for more information on the *x0* Core Base Model.

.. _devobjectmodeling-childparent:

26.3. Child Objects / Parent Object
-----------------------------------

The ``this.ChildObjects[]`` array in ``sysBaseObject.js`` is used to manage child objects
of a ``sysBaseObject`` instance. It acts as a recursive container, enabling hierarchical
object structures.

26.3.1. Initialization
**********************

In a custom object's constructor, initialize ``this.ChildObjects[]`` as an empty array:

.. code-block:: javascript

    this.ChildObjects = new Array(); //- Child Objects

26.3.2. Child-Parent Relationships
**********************************

Each child object in the array is an instance of ``sysBaseObject`` or its derived classes.
A parent-child relationship is established using the ``ParentObject`` property.

.. code-block:: javascript

    //- Do something in the ParentObject
    this.ParentObject.doSomething();

    //- Do something in the ParentObject.ParentObject
    this.ParentObject.ParentObject.doSomething();

26.3.3. Adding Child Objects
****************************

Adding objects to a parent object is straightforward:

.. code-block:: javascript

    //- add new sysObjDiv()
    let Obj1 = new sysObjDiv();
    Obj1.ObjectID = 'MyDiv1';

    //- add Obj1 to parent
    this.addObject(Obj1);

Refer to: :ref:`devoopmodel-classes-baseobj-addobject` for more details.

26.3.4. Rendering Child Objects
*******************************

To propagate changes to the DOM, render all child objects:

.. code-block:: javascript

    //- Render all ParentObject.ChildObjects[]
    this.ParentObject.renderObject();

.. _devobjectmodeling-recursivelinking:

26.3.5. Recursive Object-Linking Hierarchy (setupObjectRefsRecursive)
*********************************************************************

``addObject()`` (26.3.3) establishes a single parent-child link. Production
*x0-objects* virtually never build their internal DOM structure one call at a
time -- instead they declare the **entire** subtree as one nested, DOM-like
JavaScript structure and hand it to ``sysFactory.setupObjectRefsRecursive()``,
which recursively instantiates, initializes (``init()``) and links
(``addObject()``) every entry, descending into nested ``ObjectDefs`` exactly
as a browser would parse nested HTML tags.

The canonical, currently-shipping example of this pattern is
``/www/userObjExampleFlightData.js``'s ``userObjExampleFlightDetails``
(see :ref:`objecttype-exampleflightdetails`):

.. code-block:: javascript

    userObjExampleFlightDetails.prototype.init = function()
    {
        const Attributes = this.JSONConfig.Attributes;

        let ObjDefs = [
            {
                "id": "ColCtrLeft",
                "SysObject": new sysObjDiv(),
                "JSONAttributes": { "Style": "col-md-2 m-0 p-0" },
                "ObjectDefs": [
                    {
                        "id": this.ObjectID + "AirlineIcon",
                        "SysObject": new sysObjImage(),
                        "JSONAttributes": {
                            "Value": "/image/" + Attributes.Value.Icon,
                            "Width": "32px",
                            "Height": "32px"
                        }
                    }
                ]
            },
            {
                "id": "ColCtrMid",
                "SysObject": new sysObjDiv(),
                "JSONAttributes": { "Style": "col-md-4 m-0 p-0" },
                "ObjectDefs": [
                    {
                        "id": this.ObjectID + "AirlineName",
                        "SysObject": new sysObjDivValue(),
                        "JSONAttributes": {
                            "Style": "input-group",
                            "Value": Attributes.Value.Airline
                        }
                    }
                ]
            }
            //- further columns omitted for brevity
        ];

        sysFactory.setupObjectRefsRecursive(ObjDefs, this);
    }

Each ``ObjDefs`` entry is a plain object describing one DOM-equivalent node:

.. table:: setupObjectRefsRecursive ObjDefs Entry Schema
	:widths: 25 20 85

	+----------------+-------------------+------------------------------------------------------------------------------------+
	| **Key**        | **Type**          | **Description**                                                                    |
	+================+===================+====================================================================================+
	| id             | String            | Assigned verbatim to ``SysObject.ObjectID``                                        |
	+----------------+-------------------+------------------------------------------------------------------------------------+
	| SysObject      | sysBaseObject     | A freshly constructed (not yet initialized) instance                               |
	+----------------+-------------------+------------------------------------------------------------------------------------+
	| JSONAttributes | Object            | Becomes ``SysObject.JSONConfig.Attributes``                                        |
	+----------------+-------------------+------------------------------------------------------------------------------------+
	| KeyID          | String (optional) | Propagated for the KeyValue get/set data mechanism                                 |
	+----------------+-------------------+------------------------------------------------------------------------------------+
	| ObjectDefs     | Array (optional)  | Nested child entries; recursed into with ``SysObject`` as the new parent reference |
	+----------------+-------------------+------------------------------------------------------------------------------------+

This is precisely what makes recursive object-linking *DOM-like*: a single
declarative call produces an arbitrarily deep, fully initialized and linked
object tree, mirroring how a browser builds its own DOM tree from nested
markup -- without any manual, repeated ``addObject()`` bookkeeping.

.. note::

	``setupObjectRefsRecursive()`` is exhaustively documented, including a full
	line-by-line walkthrough, at :ref:`devoopmodel-classes` (24.1.5) and
	:ref:`devoopmodel` (23.4.6). For converting existing, non-*x0* HTML/Bootstrap
	markup into this structure, see :ref:`devporting` (29.2).

26.4. Object Constructors
-------------------------

.. code-block:: javascript

    //------------------------------------------------------------------------------
    //- CONSTRUCTOR "sysObjNewcomer"
    //------------------------------------------------------------------------------

    function sysObjNewcomer()
    {
        this.DOMType           = 'button'             //- Optional, default: 'div'
        this.DOMAttributes     = new Object();        //- Optional, add DOM attributes
        this.EventListeners    = new Object();        //- Optional
        this.ChildObjects      = new Array();         //- Always required
    }

    //- Inherit sysBaseObject
    sysObjNewcomer.prototype = new sysBaseObject();

    //- Inherit additional
    sysObjNewcomer.prototype.SomeOverloadedMethod = sysObjectXyz.prototype.processSourceObjects;

26.4.1. DOMType
***************

Override the ``this.DOMType`` property directly within the constructor (default: 'div').
For example, setting ``this.DOMType = 'button'`` will generate the HTML code ``<button></button>``.

26.4.2. DOMAttributes
*********************

By setting additional DOMAttributes:

.. code-block:: javascript

    this.DOMType = 'button';
    this.DOMAttributes = { "attr1": "value1", "attr2": "value2" };

The resulting HTML will be rendered as: ``<button attr1="value1" attr2="values"></button>``.

26.4.3. EventListeners
**********************

Refer to :ref:`devobjectmodeling-eventhandling`.

26.4.4. ChildObjects
********************

Refer to :ref:`devobjectmodeling-childparent`.

26.4.5. Inherit sysBaseObject
*****************************

Always inherit ``sysBaseObject``; failing to do so will cause your object to malfunction.

26.4.6. Inherit Additional Methods
**********************************

It's up to you how to intelligently prototype or decorate your object using existing
or custom object code.

.. _devobjectmodeling-eventhandling:

26.5. Event Handler / Callbacks
-------------------------------

Event handlers allow objects to process native DOM events. All event listeners
must be defined in the ``this.EventListeners[]`` array.

26.5.1. Initialize Event Listeners
**********************************

In the constructor, initialize ``this.EventListeners[]`` as an empty array:

.. code-block:: javascript

    this.EventListeners = new Array(); //- Array of EventListener Objects

26.5.2. Adding Event Listeners
******************************

Add event listeners by defining their type and callback function:

.. code-block:: javascript

    let EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown'; //- Event Type 'mousedown'
    EventListenerObj['Element'] = this.EventListenerCallback.bind(this); //- Callback Method
    this.EventListeners['ListenerID'] = EventListenerObj; //- Add Listener with ListenerID

26.5.3. Activating Event Listeners
**********************************

To activate added event listeners:

.. code-block:: javascript

    this.processEventListener();

26.5.4. sysObjButtonCallback Object
***********************************

The ``sysObjButtonCallback`` *x0-object* abstracts common button interactions.
It simplifies event handling for buttons.

Refer to: :ref:`devoopmodel-classes-buttoncallback`.

26.6. Building DOM Object Structure
-----------------------------------

For small, single-node objects, build the structure directly via ``addObject()``
calls (26.3.3). For any multi-node subtree, declare it as one nested ``ObjDefs``
structure and build it in a single, recursive call via
``sysFactory.setupObjectRefsRecursive()`` -- see :ref:`devobjectmodeling-recursivelinking`
(26.3.5).

Refer to: :ref:`devporting` for detailed instructions on porting existing,
non-*x0* HTML/Bootstrap markup into this structure.

26.7. Modifying Runtime Data
----------------------------

The following methods enable runtime data updates for *x0-objects*:

- **XML-RPC Async Call**: Fetches data asynchronously from remote services.
- **RuntimeSetData(data)**: Updates the object's current data.
- **RuntimeAppendData(data)**: Appends new data to the existing dataset.

26.8. Object Realtime Updates
-----------------------------

Once an object has been rendered (26.3.4), simply mutating its ``ChildObjects[]``
array or ``JSONConfig.Attributes`` has **no visible effect** -- the DOM subtree
must be explicitly refreshed or torn down. The *x0-framework* provides three
complementary mechanisms, all inherited from ``sysBaseObject`` (``/www/sysBaseObject.js``).

.. _devobjectmodeling-rerenderobject:

26.8.1. rerenderObject()
*************************

``rerenderObject()`` is the standard mechanism for applying a data-driven
layout change: it tears down the object's existing DOM subtree and rebuilds it
from the current, in-memory ``ChildObjects[]``/``JSONConfig`` state in a
single call.

.. code-block:: javascript

    sysBaseObject.prototype.rerenderObject = function()
    {
        this.removeDOMParentElement();
        this.renderObject(this.DOMParentID);
        this.processReset();
    }

Its three steps are:

    1. ``removeDOMParentElement()`` -- detaches the object's current root DOM
       node (and, with it, every descendant node) from its parent element.
    2. ``renderObject(this.DOMParentID)`` -- recreates the DOM subtree at the
       same mount point, recursively rendering whatever is now present in
       ``this.ChildObjects[]``.
    3. ``processReset()`` -- recursively invokes every descendant's ``reset()``
       template hook (26.9), so objects such as formfields re-apply their
       default/initial state against the freshly created DOM nodes.

**The canonical update pattern** is to clear and rebuild ``ChildObjects[]``
before calling ``rerenderObject()``:

.. code-block:: javascript

    //- userObjExampleEditableItem.prototype.updateEditStatus (/www/userObjExampleEditableItemContainer.js)
    userObjExampleEditableItem.prototype.updateEditStatus = function()
    {
        this.ChildObjects = new Array();
        this.setupDynamicContent();
        this.rerenderObject();
    }

The same pattern recurs throughout the codebase whenever an object must
re-derive its entire child structure at runtime, for example:

    - ``sysObjSystemSettingsContainerGrid.prototype.ButtonCallback``
      (``/www/sysObjSystemSettingsContainerGrid.js``) empties
      ``this.ContainerObj.ChildObjects``, regenerates the grid cells
      (``genGrid()``), and calls ``this.ContainerObj.rerenderObject()`` -- the
      mechanism behind the zero-backend, runtime 3-/6-column grid swap
      documented at :ref:`appdevgridsystem` (9.4).
    - ``sysObjLanguageSwitch.prototype.ButtonCallback``
      (``/www/sysObjLanguageSwitch.js``) re-initializes a pulldown object's
      options and calls ``PulldownObj.rerenderObject()``.
    - ``sysObjImage.prototype.setValue`` (``/www/sysObjImage.js``) updates the
      ``src`` attribute and calls ``this.rerenderObject()`` on just the image
      node (a single-node subtree is a valid, minimal use of the mechanism).

.. note::

	A full source-level walkthrough of ``renderObject()``/``rerenderObject()``
	is available at :ref:`devoopmodel-classes` (24.1.2) and :ref:`devoopmodel`.

26.8.2. remove()
****************

Inherited from ``sysBaseObject``, this method removes the object from
``ParentObject.ChildObjects[]`` and deletes its corresponding DOM node. Use
``remove()`` -- rather than ``rerenderObject()`` -- when a single child
instance must disappear without rebuilding its siblings.

Refer to: :ref:`devoopmodel-classes-baseobj-remove`.

26.8.3. removeParent()
**********************

Also inherited from ``sysBaseObject``, this method removes the parent
object's own DOM subtree and resets its ``ChildObjects[]`` to an empty array,
without detaching the parent object itself from its own ``ParentObject``.

Refer to: :ref:`devoopmodel-classes-baseobj-removeparent` for further details.

26.9. Object Loading / Initialization
-------------------------------------

Objects registered with the *x0-core* system expose the following properties:

26.9.1. init()
**************

The ``init()`` method is called during x0 system initialization (on page load).
Use this method to define initialization logic.

26.9.2. JSONConfig.Attributes
*****************************

The object's JSON configuration is processed during system initialization and applies
throughout its lifecycle. Use ``JSONConfig.Attributes`` to define configuration data.

26.9.3. reset()
***************

A template hook (empty by default on ``sysBaseObject``) invoked recursively by
``processReset()`` -- itself called once during ``sysScreen.setup()`` and
again by every ``rerenderObject()`` call (26.8.1). Override ``reset()`` to
re-apply an object's default/initial runtime state whenever its DOM subtree
has just been (re)created.

26.10. Adding Context Menu Functionality
----------------------------------------

The context-menu Event Registration / Runtime Instantiation blueprint --
including the canonical ``sysListRow.prototype`` code reference -- is
documented in full at :ref:`appdevcontextmenu` (12.4, "Developer Guide:
Implementing a Context Menu on a Custom Object"). The mechanism applies
unmodified to any custom *x0-object-type*.

26.11. Object Registration
--------------------------

After object-modeling has been finished, it must be added to the *x0-system*.
Two registration paths exist, depending on the deployment:

26.11.1. Core / Static-Container Registration
*********************************************

Core *x0-system-objects* are registered in ``sysFactory.js`` by adding them to
``sysFactory.SetupClasses``:

.. code-block:: javascript

    this.SetupClasses = {
            "NewObjectType": sysNewObjectType,
    }

The corresponding ``.js`` file must additionally be included as a
``<script>`` tag in ``/python/Index.py`` (as is the case for every
``/www/userObj*.js`` example object shipped with the static reference
container).

26.11.2. Database-Driven, Per-Application Registration
******************************************************

The database-backed, multi-vhost-capable deployment (see :ref:`appdevconfig`)
registers custom objects per-application, without modifying ``Index.py`` or
``sysFactory.js``: a ``setup_class`` configuration row generates a
``sysVarUserSetupClasses['NewObjectType'] = sysNewObjectType;`` entry, and a
``template_file`` configuration row generates the matching ``<script>`` tag.
Both are emitted by ``/python/Index.py`` directly from the application's
database configuration. At system start, ``sysInitOnLoad.js`` merges this
registry into the core one:

.. code-block:: javascript

    sysFactory.SetupClasses = Object.assign(
        sysFactory.SetupClasses,
        sysVarUserSetupClasses
    );

This is the canonical mechanism for extending a given *x0-application* with
custom object types, as several independent *x0-applications* can be served
in parallel by the same database-driven system, each with its own
object-type registry.

26.12. Additional Examples
--------------------------

Check additional realtime processing code in the following system files:

- ``sysRTPagination.js``
- ``sysRTFormSectionHeader.js``

26.13. Building an Object Like sysObjDynRadioList.js
----------------------------------------------------

This section explains how to create a dynamic system object similar to
``sysObjDynRadioList.js`` in the *x0-framework*. It focuses on the structure,
methods, and key principles used in ``sysObjDynRadioList``.

26.13.1. Overview
*****************

The ``sysObjDynRadioList`` is a **dynamic object** designed to manage a list of
**radio buttons**, with rows that can be added or removed at runtime. Each row
includes a **radio button**, an **input field**, and **associated controls**.

26.13.2. Key Components
***********************

    1. Base Object Inheritance:
        Inherits from ``sysBaseObject`` for core functionality.
    2. Dynamic Rows:
        Rows are represented by ``sysObjDynRadioListRow``, which also inherits from ``sysBaseObject``.
    3. Callbacks and Events:
        Used for adding/removing rows and handling user interactions.
    4. JSON Configuration:
        Utilized for defining object attributes and styles.

26.13.3. Step-by-Step Guide
***************************

Following, a Step-by-Step Guide, guiding you through the creation process.

26.13.4. Create the Base Class
******************************

Start by defining your main object, inheriting from sysBaseObject:

.. code-block:: javascript

    function sysObjDynRadioList() {
        this.ObjectType     = 'DynRadioList'; // System Object Type
        this.EventListeners = new Object();
        this.ChildObjects   = new Array();    // Child Objects
        this.RowIndex       = 0;              // Tracks row indices
    }

    // Inherit from sysBaseObject
    sysObjDynRadioList.prototype = new sysBaseObject();

26.13.5. Initialize the Object
******************************

Define the init method to set up the object structure and default components:

.. code-block:: javascript

    sysObjDynRadioList.prototype.init = function() {
        this.DOMType = 'div';
        this.DOMStyle = 'container-fluid';

        // Add an "Add Row" button
        let AddButton = new sysObjButtonCallback();
        AddButton.setCallback(this, 'add');

        let AddButtonJSONAttributes = {
            "DOMType": "a",
            "Style": "col-md-1 btn btn-primary btn-sm",
            "IconStyle": "fa-solid fa-plus",
            "TextID": "TXT.SYS.BUTTON.ADD"
        };

        this.addObject(
            new sysObjDynRadioListRow(
                this,                   // Parent Object
                false,                  // Context Menu disabled
                AddButton,              // Button Reference
                AddButtonJSONAttributes // Button Attributes
            )
        );
    };

26.13.6. Define the Row Class
*****************************

Each row in the list is represented by ``sysObjDynRadioListRow``. This class manages its
elements (radio button, input field, and optional remove button). Unlike the
parent list, a row calls its own ``init()`` directly from the constructor, and
overrides ``overrideDOMObjectID`` to keep a stable, non-prefixed DOM id:

.. code-block:: javascript

    function sysObjDynRadioListRow(ParentObject, CtxtMenu, ButtonRef, ButtonJSONAttr, SetRemoveCallback) {
        this.ObjectType          = 'DynRadioListRow';
        this.overrideDOMObjectID = true;

        this.EventListeners = new Object();
        this.ChildObjects   = new Array();
        this.ParentObject   = ParentObject;

        this.Index = this.ParentObject.RowIndex;
        this.CtxtMenuActive = CtxtMenu;
        this.ButtonRef = ButtonRef;
        this.ButtonJSONAttr = ButtonJSONAttr;
        this.SetRemoveCallback = SetRemoveCallback;

        this.init();
    }

    // Inherit from sysBaseObject
    sysObjDynRadioListRow.prototype = new sysBaseObject();

    // Alias the inherited remove() so the row's own remove() (26.13.8)
    // can still reach the base DOM-removal logic.
    sysObjDynRadioListRow.prototype.removeBase = sysBaseObject.prototype.remove;

.. code-block:: javascript

    sysObjDynRadioListRow.prototype.init = function() {
        this.DOMStyle = 'row';
        this.ObjectID = 'CtrRow' + this.ParentObject.ObjectID + this.Index;
        this.RadioGroupID = 'RadioGrp' + this.ParentObject.ObjectID;

        // Add objects (radio button, input field, etc.)
        this.addObjects(this.ButtonRef, this.ButtonJSONAttr);

        // Set up callback for removing the row
        if (this.SetRemoveCallback === true) {
            this.ButtonRef.setCallback(this, 'remove');
        }

        // Add context menu listener if enabled
        if (this.CtxtMenuActive == true) {
            let EventListenerObj = {
                'Type': 'mousedown',
                'Element': this.EventListenerRightClick.bind(this)
            };
            this.EventListeners['ContextMenuOpen'] = EventListenerObj;
        }
    };

26.13.7. Add Rows Dynamically
*****************************

The add method in ``sysObjDynRadioList`` creates new rows dynamically:

.. code-block:: javascript

    sysObjDynRadioList.prototype.add = function() {
        this.RowIndex += 1;

        let RemoveButton = new sysObjButtonCallback();
        let RemoveButtonJSONAttributes = {
            "DOMType": "a",
            "Style": "col-md-1 btn btn-primary btn-sm",
            "IconStyle": "fa-solid fa-minus",
            "TextID": "TXT.SYS.BUTTON.REMOVE"
        };

        this.addObject(
            new sysObjDynRadioListRow(
                this,                       // Parent Object
                true,                       // Context Menu enabled
                RemoveButton,               // Button Reference
                RemoveButtonJSONAttributes, // Button Attributes
                true                        // Enable remove callback
            )
        );

        // Render only the newly added row's subtree
        this.renderObject(this.DOMParentID);
    };

.. note::

	``sysObjDynRadioList`` intentionally calls ``renderObject()`` here instead
	of ``rerenderObject()`` (26.8.1): ``renderObject()`` only ever creates DOM
	nodes that do not yet exist (26.3.4), so re-invoking it after ``addObject()``
	appends just the new row without tearing down and rebuilding the rows
	already on screen.

26.13.8. Handle Row Removal
***************************

The remove method in sysObjDynRadioListRow is used to remove a row, via the
``removeBase()`` alias established in 26.13.6:

.. code-block:: javascript

    sysObjDynRadioListRow.prototype.remove = function() {
        this.removeBase(); // Call inherited sysBaseObject.remove()
    };

In the parent object, the remove method manages the array of rows:

.. code-block:: javascript

    sysObjDynRadioList.prototype.remove = function(RowIndex) {
        this.RowItems[RowIndex].remove();
    };

26.13.9. Define Object Structure
********************************

Use ``sysFactory.setupObjectRefsRecursive()`` (26.3.5) to define the DOM
structure for each row in a single, declarative call:

.. code-block:: javascript

    sysObjDynRadioListRow.prototype.addObjects = function(ButtonRef, ButtonJSONAttributes) {
        let ObjDefs = [
            {
                "id": this.Index + "ColCtr",
                "SysObject": new sysObjDiv(),
                "JSONAttributes": { "Style": "col-md-11" },
                "ObjectDefs": [
                    {
                        "id": this.Index + "BaseCtr",
                        "SysObject": new sysObjDiv(),
                        "JSONAttributes": { "Style": "input-group" },
                        "ObjectDefs": [
                            {
                                "id": this.Index + "RadioCtr",
                                "SysObject": new sysObjDiv(),
                                "JSONAttributes": {
                                    "Style": "input-group-text",
                                    "Value": '<input type="radio" id="' + this.ObjectID + '-root" name="' + this.RadioGroupID + '" class="form-check-input mt-0">'
                                }
                            },
                            {
                                "id": this.ObjectID + this.Index + "InputText",
                                "SysObject": new sysFormfieldItemText(),
                                "JSONAttributes": {
                                    "Style": "form-control",
                                    "Type": "text"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "id": this.ObjectID + this.Index + "ColBtn",
                "SysObject": ButtonRef,
                "JSONAttributes": ButtonJSONAttributes
            }
        ];

        sysFactory.setupObjectRefsRecursive(ObjDefs, this);
    };

26.13.10. Conclusion
********************

By following this guide, you can create dynamic objects similar to sysObjDynRadioList.js.
The key is leveraging the x0 system's object-oriented framework, callbacks, and
JSON-based DOM configuration. You can extend this structure further based on
your application's specific requirements.

**Related Documentation:**

* :ref:`devoopmodel_base` - Core sysBaseObject/sysBaseDOMElement model
* :ref:`devoopmodel-classes` - Full class/method reference (renderObject, rerenderObject, setupObjectRefsRecursive)
* :ref:`devporting` - Porting non-*x0* HTML/Bootstrap markup into recursive object hierarchies
* :ref:`appdevcontextmenu` - Context-menu implementation blueprint
* :ref:`appdevconfig` - ``object.json``/``skeleton.json`` and database-driven object registration
