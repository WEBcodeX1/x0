.. dev-best-practices

.. _devbestpractices:

29. Development Best Practices
==============================

This chapter establishes the *core architectural* **standards**, object-construction patterns,
and runtime-update strategies required to develop robust custom *x0-system-objects* within the
framework ecosystem.

29.1. Architectural Foundations
-------------------------------

The implementation of a custom, deterministic x0-object requires strict adherence to the framework's
core structural constraints. The following core principles must be thoroughly understood before a
developer attempts to construct custom objects or modular extensions.

Distinct rules separate mandatory requirements ("musts") from optional features ("cans"). Deviating
from these specifications can significantly alter overall system behavior; therefore, all subsequent
principles and sub-chapters must be reviewed carefully.

1. **Base Class Derivation & Object Properties:** When designing custom classes, developers must carefully
   select the appropriate framework base class to derive from. Furthermore, the object properties
   within these custom classes must be configured precisely to align with the framework's OOP model.

2. **Object Naming Conventions (Setting Object IDs):** During instantiation, object IDs must be explicitly
   defined as either unique or non-unique. Selecting non-unique IDs optimizes memory and instantiation
   performance, but directly alters how the subsequent DOM layer structures element names and how
   objects are referenced at runtime for subsequent modifications.

3. **Object Inheritance & Referencing:** Rather than requiring developers to explicitly map every single object
   instance, the x0-system provides smart routines heavily inspired by the DOM tree model to automatically
   manage complex, nested object infrastructures. Consequently, these automated routines strictly adhere to
   the framework's structural hierarchy rules.

4. **Real-Time Layout Updates:** When configured correctly, the framework handles real-time object
   redraws highly effectively. Instead of re-rendering entire hierarchies, the engine optimizes
   updates for complex structures—such as a TaskContainer managing nested TaskLists and individual
   Tasks—by surgically detaching and updating only the specific object from its representative
   parent DOM node.

5. **Declarative Object Representation:** Each object must be supplied with structured JSON metadata utilizing
   `JSONConfig.Attributes` (which can be static, fetched via AJAX from the backend, or modified at runtime).
   This is the standard mechanism for defining an object instance's behavior through the x0-system's declarative
   `object.json` (object definition) and `skeleton.json` (relation management) files.

6. **Data Model & Recursive Cloning:** The framework's internal object registry supports the full
   instantiation of recursive structures using `getObjectData()` and `setObjectData()`. When configured correctly,
   the execution engine allows a root instance (such as the TaskContainer from point 4) to be deeply cloned at
   runtime. *Note: This feature is currently in beta and has not achieved full test coverage.*

The subsequent sections analyze these structural prerequisites in depth, specifying the exact implementation
semantics required by the framework's architectural infrastructure.

29.2. Recommended Base Class: sysObjDivUnique
---------------------------------------------

**What it replaces:** historically, a custom container object inherited directly from
``sysBaseObject`` and, inside its own ``init()``, manually set
``this.overrideDOMObjectID = true`` whenever the object needed a stable DOM id (i.e. an
id that is *not* prefixed by its parent's DOM id during recursive rendering — see
:ref:`devoopmodel-classes` (24.1.2) for the rendering/prefixing mechanism itself).

.. code-block:: javascript

    //- OUTDATED PATTERN - do not use for new objects
    function userObjLegacyCard()
    {
        this.ChildObjects = new Array();
    }

    //- inherit sysBaseObject directly ...
    userObjLegacyCard.prototype = new sysBaseObject();

    userObjLegacyCard.prototype.init = function()
    {
        //- ... and remember to manually flag it as non-prefixed
        this.overrideDOMObjectID = true;
        //- ... rest of init logic
    }

This works, but the manual flag is an easy-to-forget, silently-failing step: omitting it
does not raise an error, it simply leaves the object with a recursively prefixed DOM id,
which breaks any code that expects to address it by its bare ``ObjectID``.

**What to use instead:** ``sysObjDivUnique`` (``/www/sysObjDiv.js``) already bakes
``this.overrideDOMObjectID = true`` into its own constructor. Inheriting from it instead
of ``sysBaseObject`` removes the manual step entirely:

.. code-block:: javascript

    //- CURRENT, RECOMMENDED PATTERN (userObjExampleFlightData.js)
    function userObjExampleFlightDetails()
    {
        this.DOMStyle     = 'row m-0 p-0';
        this.ChildObjects = new Array();
    }

    //- inherit sysObjDivUnique - overrideDOMObjectID is already true
    userObjExampleFlightDetails.prototype = new sysObjDivUnique();

Every single example object currently shipped under ``/www/userObj*.js`` follows this
pattern without exception — none derive from ``sysBaseObject`` directly any longer.

.. note::

	``sysObjDivUnique`` is purpose-built for ``div``-style container objects. Other
	non-``Div`` base types without a dedicated "Unique" variant (for example
	``sysObjButtonCallback``) still require the manual
	``this.overrideDOMObjectID = true`` flag on the instance — this remains correct and
	necessary for those types. The guidance above specifically targets custom container
	objects, which should prefer ``sysObjDivUnique`` over ``sysObjDiv``/``sysBaseObject``
	plus a manual flag.

Refer to: :ref:`devoopmodel-classes` (24.2.2) for the full ``sysObjDiv`` /
``sysObjDivUnique`` / ``sysObjDivValue`` class reference, and
:ref:`objecttype-divunique` for the declarative, JSON-configured ``DivUnique``
*x0-object-type*.

29.3. Recursive Object Construction with setupObjectRefsRecursive()
-------------------------------------------------------------------

Manually calling ``addObject()`` once per child node (see
:ref:`devobjectmodeling-childparent`) does not scale once an object's internal structure
grows beyond one or two levels. Production objects instead declare their *entire*
subtree as a single, nested JSON-like structure and hand it to
``sysFactory.setupObjectRefsRecursive(ObjDefs, RefObj)`` in one call — the method
recursively instantiates, configures (``init()``), and links (``addObject()``) every
entry, descending into nested ``ObjectDefs`` the same way a browser descends into nested
HTML markup.

The following, taken as-is from ``userObjExampleEditableItemContainer.js``, shows the
pattern at production complexity — a container that must append a brand-new, fully
wired row (image, header text, content text, move-up/move-down/select-image buttons)
every time ``addItem(Data)`` is called at runtime:

.. code-block:: javascript

    userObjExampleEditableItemContainer.prototype.addItem = function(Data)
    {
        const ItemData = sysConvertSysData2KeyValue(Data);

        //- reset child objects
        this.ChildObjects.length = 0;

        const RowIndex = this.RowItems.length;

        //- base container object
        let BaseContainerObj = new sysObjDivUnique()
        BaseContainerObj.ObjectID = 'BaseRowCtr' + this.ObjectID + '_' + RowIndex;
        BaseContainerObj.init();

        //- new item object
        let ItemObj = new userObjExampleEditableItem(this, RowIndex);
        ItemObj.ScreenObject = this.ScreenObject;
        BaseContainerObj.ItemRef = ItemObj;

        //- setup recursive object structure
        let ObjDefs = [
            {
                "id": "CtrItem" + this.ObjectID + '_' + RowIndex,
                "SysObject": new sysObjDivUnique(),
                "JSONAttributes": { "Style": "" },
                "ObjectDefs": [
                    {
                        "id": this.ObjectID + '_' + RowIndex,
                        "SysObject": ItemObj,
                        "JSONAttributes": {
                            "Style": "row m-0 p-0",
                            "ImagePath": ItemData.ImagePath,
                            "HeaderText": ItemData.HeaderText,
                            "ContentText": ItemData.ContentText
                        }
                    }
                ]
            },
            {
                "id": "CtrRowSeparator" + this.ObjectID + '_' + RowIndex,
                "SysObject": new sysObjDivUnique(),
                "JSONAttributes": {
                    "DOMType": "hr",
                    "Style": "example-item-container1-hrcolor m-2"
                }
            }
        ];

        sysFactory.setupObjectRefsRecursive(ObjDefs, BaseContainerObj);

        this.RowItems.push(BaseContainerObj);
        this.redrawList();
    }

**What this does:** each call wraps a freshly configured ``userObjExampleEditableItem``
instance (itself a non-trivial object with its own child buttons, see 29.2) inside two
``sysObjDivUnique`` layers (a row wrapper and a horizontal-rule separator), then hands
the whole three-node definition to ``setupObjectRefsRecursive()`` in one call rather than
three sequential ``addObject()`` calls.

**Why this is the effective pattern:** the ``ObjDefs`` array is plain, declarative data —
it can be constructed dynamically (as here, once per ``addItem()`` invocation, with ids
composed from the live ``RowIndex``) and handed uniformly to the exact same recursion
engine used for static, metadata-driven screens. There is no special-casing between
"objects defined once at screen load" and "objects created on demand at runtime": both
go through ``setupObjectRefsRecursive()``.

A second, simpler illustration from ``userObjExampleFlightData.js`` (the
``ExampleFlightDetails`` object, see :ref:`objecttype-exampleflightdetails`) shows the
same mechanism used for a purely static, single-instance layout:

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
            }
            //- "ColCtrMid" / "ColCtrRight" columns omitted for brevity
        ];

        sysFactory.setupObjectRefsRecursive(ObjDefs, this);
    }

Notice the deliberate mix of object types here — ``new sysObjDiv()`` for the column
wrapper, ``new sysObjImage()`` for the leaf node. The next section explains exactly why
``"ColCtrLeft"`` uses the plain, non-unique ``sysObjDiv`` while the icon uses a fully
composed, instance-unique id.

Refer to: :ref:`devoopmodel-classes` (24.1.5) and :ref:`devoopmodel` (23.4.6) for the
full method-level reference, and :ref:`devobjectmodeling-recursivelinking` (26.3.5) for
the ``ObjDefs`` entry schema table.

29.4. Intermediary Layout Layers vs. Addressable Objects
-----------------------------------------------------------

Not every node in a recursive object hierarchy needs to be individually addressable at
runtime. The *x0-framework* makes a clear, deliberate distinction between two kinds of
nodes, and conflating them is a common source of subtle bugs.

29.4.1. Addressable Objects
*****************************

An object is safely addressable via ``sysFactory.getObjectByID(ObjectID)`` only if its
declared ``ObjectID`` is **unique across the entire screen hierarchy**. The established
convention for guaranteeing this is to compose the id from the parent instance's own
(already-unique) ``ObjectID``:

.. code-block:: javascript

    "id": this.ObjectID + "AirlineIcon",   //- unique: prefixed by the instance's own id
    "id": this.ObjectID + '_' + RowIndex,  //- unique: suffixed by a per-row index

29.4.2. Intermediary Layout Layers
*************************************

In contrast, purely structural wrapper nodes — used only to apply a Bootstrap grid
class or group a handful of sibling elements — are deliberately given a short, *generic*
``id`` such as ``"ColCtrLeft"``, ``"CtrRow"`` or ``"RowSeparator"`` (see the examples in
29.3). These are intentionally **not** meant to be queried via ``getObjectByID()``: the
same literal id string is reused across every row, card, or instance in the hierarchy
(for example, every ``ExampleFlightDetails`` row on screen declares its own
``"ColCtrLeft"``).

This is safe for *rendering*, because ``renderObject()`` composes the actual DOM element
id from the recursive parent prefix (``Prefix + '_' + ObjectID`` — see
:ref:`devoopmodel-classes` (24.1.2)), so two sibling ``"ColCtrLeft"`` divs under
different parents never collide in the browser's DOM.

It is **not** safe for *lookup*, however. ``getObjects()`` (the traversal method behind
``getObjectByID()``) flattens the entire subtree into a single ``{ ObjectID: ObjectRef }``
map keyed by the plain, non-prefixed ``ObjectID`` (see :ref:`devoopmodel` (23.3.4)):

.. code-block:: javascript

    //- sysBaseObject.prototype.getObjects (www/sysBaseObject.js)
    for (const ChildItem of this.ChildObjects)
    {
        RItems = ChildItem.getObjects();
        Items[ChildItem.ObjectID] = ChildItem;
        //- ... recurses, merging into the same flat map
    }

Because every occurrence of a generic id such as ``"ColCtrLeft"`` is written into the
*same* ``Items`` key during this traversal, each new occurrence silently overwrites the
previous one. Calling ``sysFactory.getObjectByID('ColCtrLeft')`` on a screen with
multiple flight rows does not raise an error — it simply returns whichever instance was
encountered last, which is rarely the one the caller intended.

.. important::

	A ``sysObjDiv`` instance whose declared ``id``/``ObjectID`` omits a component unique
	to its instance (for example, ``this.ObjectID + 'name'``) is an **intermediary
	layout layer** by design. It may be freely reused as a structural "between-layer" in
	complex, multi-dimensional object hierarchies (grid columns, rows, separators), but
	it must never be targeted with ``sysFactory.getObjectByID()``. Only objects whose id
	is composed to be instance-unique — leaf value objects, or container roots created
	via ``sysObjDivUnique`` with a genuinely unique ``ObjectID`` — are valid lookup
	targets.

29.5. Real-Time Object Updates
------------------------------

Once rendered, an object's DOM subtree does not automatically reflect later changes to
its in-memory ``ChildObjects[]``/``JSONConfig`` state — ``rerenderObject()`` (see
:ref:`devobjectmodeling-rerenderobject` (26.8.1) and :ref:`devoopmodel-classes` (24.1.2))
must be called explicitly. The example objects demonstrate two complementary update
styles.

29.5.1. Rebuild Pattern
***********************

Used when an object's *entire* internal structure must be regenerated from scratch, for
example when an editable item toggles between its display and edit representations:

.. code-block:: javascript

    //- userObjExampleEditableItem.prototype.updateEditStatus (www/userObjExampleEditableItemContainer.js)
    userObjExampleEditableItem.prototype.updateEditStatus = function()
    {
        this.ChildObjects = new Array();
        this.setupDynamicContent();
        this.rerenderObject();
    }

The same container-level variant clears and redraws every row at once, after a
reordering operation swaps two entries in ``RowItems``:

.. code-block:: javascript

    //- userObjExampleEditableItem.prototype.moveItemUp (www/userObjExampleEditableItemContainer.js)
    userObjExampleEditableItem.prototype.moveItemUp = function()
    {
        if (this.ItemIndex > 0)
        {
            const CurrentIndex = this.ItemIndex;
            const SwapIndex = this.ItemIndex-1;
            const ContainerObj = this.ContainerObjRef;
            const RowItems = ContainerObj.RowItems;
            const TmpValue = RowItems[CurrentIndex];

            RowItems[CurrentIndex] = RowItems[SwapIndex];
            RowItems[SwapIndex] = TmpValue;

            ContainerObj.ChildObjects.length = 0;
            ContainerObj.redrawList();
            ContainerObj.reindexItems();
        }
    }

    //- userObjExampleEditableItemContainer.prototype.redrawList
    userObjExampleEditableItemContainer.prototype.redrawList = function()
    {
        this.renderHeader();

        for (RowItem of this.RowItems)
        {
            this.addObject(RowItem);
            RowItem.processEventListener();
        }

        this.PaginationObject.update();
        this.rerenderObject();
    }

**What this does:** ``ChildObjects.length = 0`` discards every currently rendered row
reference without touching the underlying data (``RowItems``, the actual row objects,
survive untouched); ``redrawList()`` then re-adds them to ``ChildObjects`` in their new
order and performs a single ``rerenderObject()`` at the end.

**Why this is the effective pattern:** a single ``rerenderObject()`` call at the end
tears down and rebuilds the DOM subtree exactly once, regardless of how many rows were
reordered — avoiding the layout thrashing of removing/re-inserting individual DOM nodes
one at a time.

29.5.2. Additive Pattern
************************

Used when only a *new* node needs to be appended, with existing siblings left untouched:

.. code-block:: javascript

    //- userObjExampleCard.prototype.addTasklist (www/userObjExampleCardTasklists.js)
    userObjExampleCard.prototype.addTasklist = function()
    {
        let TasklistContainerObj = new sysObjDivUnique();
        TasklistContainerObj.ObjectID = this.ObjectID + 'CtrTasklist' + this.TasklistIndex;
        TasklistContainerObj.init();
        this.addObject(TasklistContainerObj);

        let TasklistObj = new userObjExampleTasklist(this, this.TasklistIndex);
        TasklistObj.init();
        TasklistContainerObj.addObject(TasklistObj);
        this.rerenderObject();
        this.TasklistIndex++;
    }

**Why this is the effective pattern:** because ``renderObject()`` only ever creates DOM
nodes that do not yet exist (``checkDOMElementExists()`` guards every node creation, see
:ref:`devoopmodel-classes` (24.1.2)), calling ``rerenderObject()`` here is safe even
though it conceptually "re-renders" the whole card — existing tasklists are left
untouched, and only the newly appended ``TasklistContainerObj``/``TasklistObj`` pair is
actually created.

.. note::

	Choose the *rebuild* pattern (29.5.1) whenever the relative order or composition of
	*existing* children changes. Choose the *additive* pattern (29.5.2) whenever only new
	children are appended and existing ones are structurally unaffected — it avoids the
	unnecessary teardown/recreation of every already-rendered node.

29.6. Recent Architectural Evolution
------------------------------------

The patterns documented above reflect the framework's 1.1.0-rc1 engine revision (see
``CHANGELOG.md``), which reworked core object construction and introduced the full set
of ``/www/userObj*.js`` reference objects (``ExampleEditableItem``, ``ExampleFlightData``,
``ExampleTimedProgress``, ``ExampleWizard``, ``ExampleCardTasklists``,
``ExamplePeopleSelector``) alongside a dedicated function dispatcher for declarative
context-menu actions. Together with ``sysObjDivUnique`` (29.2), these establish the
current baseline for custom object development. For the full, exhaustive treatment of
each related engine subsystem, see:

- :ref:`devobjectmodeling` — the complete boilerplate blueprint for custom
  *x0-system-objects*, including the realtime update lifecycle (26.8).
- :ref:`appdevcontextmenu` — the declarative, ``ItemConfig``-driven function dispatcher.
- :ref:`appdevoverlay` — the generic, ``object.json``/``skeleton.json``-driven overlay
  architecture.

29.7. Application Porting
-----------------------------

The remainder of this chapter explains how to port an existing web application,
particularly its DOM/HTML structure, into the *x0-framework*, applying the same
principles established above. It focuses on transforming frameworks like Bootstrap into
*x0-format* while leveraging the framework's object-oriented principles.

29.7.1. Introduction
************************

Porting a web application into *x0* involves converting static HTML and dynamically
referenced JavaScript components into reusable and modular *x0-objects*. This ensures
that the application benefits from the framework's robust event handling, runtime data
manipulation, and hierarchical object model.

Key processes include:

1. Converting HTML DOM elements into ``sysBaseObject``-derived objects (preferring
   ``sysObjDivUnique`` for container nodes, see 29.2).
2. Using JSON configuration for object initialization and styling.
3. Structuring the application into reusable components.

For additional modeling references, see: :ref:`devobjectmodeling`.

29.7.2. Modern Approach
***************************

The *modern approach* to porting focuses on recursive object referencing and
modularization, as introduced in 29.3. This method ensures scalability and
maintainability by leveraging the ``sysFactory.setupObjectRefsRecursive()`` function.

29.7.2.1. Recursive Referencing
###################################

Using ``sysFactory.setupObjectRefsRecursive()`` allows you to:

- Define hierarchical object structures in JSON format.
- Automatically initialize, configure, and render objects recursively.
- Simplify the process of converting nested DOM elements into *x0-objects*.

29.7.2.2. Example: Recursive Object Definition
###################################################

The following example demonstrates how to structure a Bootstrap-formatted
component into a recursive *x0-object* hierarchy:

.. code-block:: javascript

    const ObjDefs = [
        {
            "id": "container",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": { "Style": "container-fluid" },
            "ObjectDefs": [
                {
                    "id": "row",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": { "Style": "row" },
                    "ObjectDefs": [
                        {
                            "id": "col",
                            "SysObject": new sysObjDiv(),
                            "JSONAttributes": { "Style": "col-md-4" },
                            "ObjectDefs": [
                                {
                                    "id": "btn",
                                    "SysObject": new sysObjButton(),
                                    "JSONAttributes": {
                                        "Style": "btn btn-primary",
                                        "TextID": "TXT.BUTTON.CLICK_ME"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    // Initialize and render objects recursively
    sysFactory.setupObjectRefsRecursive(ObjDefs, this);

This example converts a Bootstrap container, row, and column with a button
into an *x0-object* hierarchy. Note that ``"container"``, ``"row"`` and ``"col"`` are
intermediary layout layers (29.4.2); only ``"btn"`` would typically be composed as an
instance-unique, addressable id in a production object.

29.7.3. Simple Referencing
*******************************

The *simple referencing* approach is ideal for small or isolated components.
It does not require deep nesting or complex hierarchies.

29.7.3.1. Example: Simple Object Initialization
####################################################

Here is an example of defining and adding a single object without recursion:

.. code-block:: javascript

    const Btn = new sysObjButton();
    Btn.ObjectID = "SimpleButton";
    Btn.JSONConfig = {
        "Attributes": {
            "Style": "btn btn-secondary",
            "TextID": "TXT.BUTTON.SUBMIT"
        }
    };

    this.addObject(Btn);

In this case, the button is directly added to ``this`` object.
This method is straightforward but less flexible for scaling or reusing components.

29.7.4. Combining Modern and Simple Approaches
***************************************************

In practice, you may need to combine modern and simple referencing techniques.
For example:

- Use recursive referencing for defining the application's primary structure.
- Use simple referencing for dynamically adding or modifying objects at runtime.

29.7.4.1. Example: Combined Approach
#########################################

.. code-block:: javascript

    // Define the main structure recursively
    const ObjDefs = [
        {
            "id": "mainContainer",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": { "Style": "container" },
            "ObjectDefs": [
                {
                    "id": "header",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": { "Style": "header" }
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);

    // Add a dynamic object later using simple referencing
    const DynamicBtn = new sysObjButton();
    DynamicBtn.ObjectID = "DynamicButton";
    DynamicBtn.JSONConfig = {
        "Attributes": {
            "Style": "btn btn-warning",
            "TextID": "TXT.BUTTON.DYNAMIC"
        }
    };

    this.addObject(DynamicBtn);

This approach maximizes the flexibility of the *x0-framework*,
combining the strengths of both methods.

29.7.5. Porting-Specific Best Practices
********************************************

Follow these additional best practices when porting applications into *x0*, on top of
the general guidance in 29.2-29.5:

1. **Modularize Components**:
   - Break down the application into reusable components, preferring ``sysObjDivUnique`` over ``sysBaseObject`` plus a manual override flag (29.2).
   - Use JSON configurations to define attributes and styles.

2. **Leverage Recursive Referencing**:
   - Use ``sysFactory.setupObjectRefsRecursive()`` for defining complex hierarchies (29.3).
   - Avoid hardcoding child object structures.

3. **Optimize Event Handling**:
   - Use ``this.EventListeners[]`` for native DOM events.
   - Define reusable callbacks for common interactions.

4. **Test Incrementally**:
   - Test each component independently before integrating it into the application.
   - Use the browser's developer tools for debugging DOM and JavaScript issues.

5. **Document Components**:
   - Provide clear documentation for each reusable component, including its JSON configuration and expected behavior.

29.8. Additional Resources
------------------------------

For more information, see:

- :ref:`devobjectmodeling` for object modeling and hierarchy design.
- :ref:`devoopmodel-classes` for the full class/method reference.
- ``sysFactory.js`` for details on ``setupObjectRefsRecursive()``.
- ``/www/userObj*.js`` for the complete, currently-maintained reference implementations.

By following this guide, you can efficiently build new custom objects, update them in
real time, and port existing web applications into the *x0-framework*.
