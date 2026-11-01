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
   parent DOM node. Furthermore, any properly constructed recursive object structure natively supports
   runtime pagination via `sysRTPagination.js`.

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

29.2. Custom Class Derivation and Skeleton Setup
-------------------------------------------------

Every custom *x0-system-object* is built by choosing exactly one of three base-class
derivation pathways, and then wiring a small, well-defined set of constructor properties
that the execution engine (``renderObject()``, ``getObjects()``, ``getObjectData()`` /
``setObjectData()``) relies on to render, address and update the instance. The choice of
pathway is not stylistic — it directly determines how the object's DOM id is composed
(see ``renderObject()``, :ref:`devoopmodel-classes` (24.1.2)) and therefore whether the
object can later be looked up with ``sysFactory.getObjectByID()``.

29.2.1. Pathway A: Direct ``sysBaseObject()`` Derivation
***********************************************************

Inheriting directly from ``sysBaseObject`` is the lowest-level pathway and is reserved
for two distinct situations, both of which are incompatible with the generic ``Div``
container classes:

1. **Non-``div`` leaf/value objects** — objects whose ``DOMType`` is a concrete HTML tag
   other than ``div`` (an image, a form input, a table row), and which expose live
   runtime data via ``RuntimeGetDataFunc``/``RuntimeSetDataFunc``. These objects
   deliberately leave ``overrideDOMObjectID`` unset and rely on the engine's *default*
   recursive prefixing; the caller is responsible for composing a globally unique
   ``ObjectID`` from the already-unique parent id:

   .. code-block:: javascript

       //- sysObjImage.js - leaf object, DOMType 'img', no overrideDOMObjectID
       function sysObjImage()
       {
           this.ObjectType             = 'Image';
           this.DOMType                = 'img';
           this.DOMAttributes          = new Object();

           this.RuntimeGetDataFunc     = this.getValue;
           this.RuntimeSetDataFunc     = this.setValue;
           this.SetDataMechanism       = 'Plain';
       }
       sysObjImage.prototype = new sysBaseObject();

       //- caller composes a unique id from its own, already-unique ObjectID
       //- (userObjExampleFlightData.js)
       "id": this.ObjectID + "AirlineIcon",
       "SysObject": new sysObjImage(),

2. **Self-contained structural/control objects without a dedicated "Unique" sibling
   class** — buttons, lists, formfield containers and similar non-``Div`` types that
   must always be addressable by a bare ``ObjectID``, and therefore manually set
   ``this.overrideDOMObjectID = true`` inside their own constructor:

   .. code-block:: javascript

       //- sysObjButton.js / sysObjList.js / sysObjFormfieldList.js
       function sysObjButton()
       {
           this.overrideDOMObjectID    = true;     //- Override recursive ObjectID
           //- ... remaining setup
       }
       sysObjButton.prototype = new sysBaseObject();

   This manual flag is an easy-to-forget, silently-failing step: omitting it does not
   raise an error, it simply leaves the object with a recursively prefixed DOM id, which
   breaks any code that expects to address it by its bare ``ObjectID``. It remains
   necessary and correct for these types precisely because no ``sysObjButtonUnique`` or
   equivalent sibling class exists — unlike the ``Div`` family below.

**Naming scheme:** composed uniqueness, either delegated to the caller (case 1) or
self-declared via the manual flag (case 2). Use Pathway A only when the object's
identity is inseparable from non-container DOM behavior; prefer Pathway B for anything
that is primarily a structural container.

29.2.2. Pathway B: ``sysObjDivUnique()`` — Recommended Default for Custom Containers
*****************************************************************************************

``sysObjDivUnique`` (``/www/sysObjDiv.js``) already bakes
``this.overrideDOMObjectID = true`` into its own constructor, removing the manual,
easy-to-forget step from Pathway A entirely whenever the custom object is, at its core, a
``div``-style container:

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

**Naming scheme:** because ``overrideDOMObjectID`` removes the recursive parent-prefix
safety net, the rendered DOM id *is* the bare ``ObjectID`` — the instance's ``ObjectID``
must still be explicitly composed to be unique across the whole screen hierarchy (for
example ``'BaseRowCtr' + this.ObjectID + '_' + RowIndex``, see 29.3), exactly as it would
for a Pathway A object with the manual flag set.

.. note::

	The sibling class ``sysObjDivValue`` (also ``/www/sysObjDiv.js``) extends the same
	``overrideDOMObjectID = true`` / unique-container pattern with a wired
	``RuntimeSetDataFunc``/``RuntimeGetDataFunc`` pair (its own ``setValue``/``getValue``)
	for cases where a uniquely addressable container must also expose a single runtime
	value through 29.6.2's ``getObjectData()``/
	``setObjectData()`` model.

Refer to: :ref:`devoopmodel-classes` (24.2.2) for the full ``sysObjDiv`` /
``sysObjDivUnique`` / ``sysObjDivValue`` class reference, and
:ref:`objecttype-divunique` for the declarative, JSON-configured ``DivUnique``
*x0-object-type*.

29.2.3. Pathway C: ``sysObjDiv()`` — Non-Unique Intermediary Layout Layer
*****************************************************************************

Unlike the two pathways above, ``sysObjDiv`` is, in practice, never subclassed by custom
objects. Instead it is instantiated directly — ``new sysObjDiv()`` — inline as a generic,
disposable structural wrapper, with ``overrideDOMObjectID`` left unset:

.. code-block:: javascript

    //- userObjExampleFlightData.js - plain structural wrapper, reused per row
    "id": "ColCtrLeft",
    "SysObject": new sysObjDiv(),
    "JSONAttributes": { "Style": "col-md-2 m-0 p-0" },

**Naming scheme:** short, generic, deliberately *non-unique* ids (``"ColCtrLeft"``,
``"CtrRow"``, ``"RowSeparator"``) that are safely reused across every sibling instance in
the hierarchy, because rendering derives the actual DOM id from the recursive parent
prefix rather than from the bare ``ObjectID``. Use Pathway C exclusively for nodes that
exist only to group siblings or apply a layout/grid class, and that are never queried via
``sysFactory.getObjectByID()`` — see 29.4 for the full addressability rationale and the
lookup-collision risk this pathway deliberately accepts.

29.2.4. Mandatory and Optional Class Properties
*****************************************************

Regardless of pathway, a custom class's constructor wires the following properties into
the inherited ``sysBaseObject``/``sysBaseDOMElement`` engine. Deviating from this schema
either breaks rendering outright (mandatory properties) or silently disables a specific
engine feature (optional properties).

.. table:: Mandatory Properties
	:widths: 20 80

	+------------------------+-------------------------------------------------------------------------+
	| **Property**           | **Role**                                                                |
	+========================+=========================================================================+
	| ``ObjectType``         | Declarative type tag read by ``getObjectsByType()``, the context-menu   |
	|                        | dispatcher and JSON-schema validation; must be a stable, unique         |
	|                        | string per class (e.g. ``'Image'``, ``'DivUnique'``).                   |
	+------------------------+-------------------------------------------------------------------------+
	| ``ChildObjects``       | Must be initialized to ``new Array()`` in the constructor.              |
	|                        | ``addObject()``, ``renderObject()`` and ``getObjects()`` all iterate    |
	|                        | this array directly; an unset ``ChildObjects`` breaks rendering and     |
	|                        | traversal for the entire subtree rooted at the instance.                |
	+------------------------+-------------------------------------------------------------------------+
	| ``ObjectID``           | Assigned either by the class itself (process-wide singletons, e.g.      |
	|                        | ``sysObjAsyncNotifyIndicator``'s hardcoded                              |
	|                        | ``'SYSGlobalAsyncNotifyIndicator'``) or by                              |
	|                        | ``sysFactory.setupObjectRefsRecursive()`` from the declarative          |
	|                        | ``object.json``/``skeleton.json`` ``id`` field. Its required            |
	|                        | uniqueness scope depends entirely on the derivation pathway chosen      |
	|                        | above (29.2.1-29.2.3).                                                  |
	+------------------------+-------------------------------------------------------------------------+

.. table:: Conditionally Mandatory Properties
	:widths: 20 80

	+---------------------------+-----------------------------------------------------------------------+
	| **Property**              | **Required when...**                                                  |
	+===========================+=======================================================================+
	| ``overrideDOMObjectID``   | The instance must be addressable by a bare, non-prefixed              |
	|                           | ``ObjectID`` — set ``true`` manually for Pathway A (29.2.1, case 2)   |
	|                           | or inherited from ``sysObjDivUnique``/``sysObjDivValue`` for Pathway  |
	|                           | B. Left unset for Pathway C and for Pathway A leaf objects that rely  |
	|                           | on default recursive prefixing.                                       |
	+---------------------------+-----------------------------------------------------------------------+
	| ``EventListeners``        | The object registers its own DOM event bindings (``mousedown``,       |
	|                           | ``click``, ...). Must be ``new Object()`` keyed by a listener name;   |
	|                           | ``processEventListener()`` guards against ``null``/``undefined`` and  |
	|                           | simply skips objects that never set it.                               |
	+---------------------------+-----------------------------------------------------------------------+
	| ``KeyID``                 | The object participates in the ``KeyValue`` data-model dispatch       |
	|                           | (29.6.2) — read by                                                    |
	|                           | ``getKeyIDValueFromData()``/``setObjectDataKeyValueRecursive()`` to   |
	|                           | match the instance against its corresponding ``Data`` entry.          |
	+---------------------------+-----------------------------------------------------------------------+
	| ``RuntimeGetDataFunc`` /  | The object exposes a single runtime value to the recursive data       |
	| ``RuntimeSetDataFunc``    | model (``sysObjImage``'s ``getValue``/``setValue``, a Formfield's own |
	|                           | accessor). Paired with ``GetDataMechanism``/``SetDataMechanism`` —    |
	|                           | see 29.6.2 for the full ``Plain``/``KeyValue`` dispatch table.        |
	+---------------------------+-----------------------------------------------------------------------+
	| ``JSONConfig``            | Never set inside the constructor itself — assigned externally by      |
	|                           | ``sysFactory.setupObjectRefsRecursive()`` (or ``sysScreen`` at        |
	|                           | screen load) *before* ``init()`` runs. Custom ``init()``              |
	|                           | implementations read declarative configuration exclusively through    |
	|                           | ``this.JSONConfig.Attributes`` — see 29.6.1.                          |
	+---------------------------+-----------------------------------------------------------------------+

Purely presentational properties — ``DOMType`` (default ``'div'``, overridden only for
non-``div`` leaf tags such as ``'img'``), ``DOMStyle``, ``DOMValue`` and
``DOMAttributes`` — remain optional and default to ``null``/unset via
``sysBaseDOMElement``. Conversely, ``ParentObject``, ``DOMObjectID`` and ``DOMParentID``
must **never** be assigned manually in custom code: all three are populated recursively
by ``addObject()``/``renderObject()`` at link- and render-time respectively.

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
order, delegates page-boundary visibility to ``this.PaginationObject.update()`` (29.5.3),
and performs a single ``rerenderObject()`` at the end.

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

29.5.3. Pagination Integration
*******************************

Any recursive object structure that exposes a ``RowItems[]`` array and a ``RowCount``
property (29.1, point 4) is eligible to delegate page-boundary visibility to
``sysPagination`` (``/www/sysRTPagination.js``), instantiated once per container as
``this.PaginationObject = new sysPagination(this)``. ``sysObjList``, ``sysObjImageSelector``
and ``userObjExampleEditableItemContainer`` (29.5.1) are the framework's current adopters
of this mechanism.

.. code-block:: javascript

    //- sysPagination.prototype.update (www/sysRTPagination.js)
    sysPagination.prototype.update = function()
    {
        for (const RowItem of this.ParentObject.RowItems)
        {
            RowItem.VisibleState = 'hidden';
            RowItem.setDOMVisibleState();
        }

        const RowCount = this.ParentObject.RowCount;
        const StartPos = ((this.CurrentPage+1)*RowCount)-RowCount;
        const EndPos = ((this.CurrentPage+1)*RowCount)-1;

        for (let i=StartPos; i<=EndPos; i++)
        {
            try {
                const RowItem = this.ParentObject.RowItems[i];
                RowItem.VisibleState = 'visible';
                RowItem.setDOMVisibleState();
            }
            catch(err) {
            }
        }

        this.render();
    }

**What this does:** rather than destroying and recreating off-page rows,
``update()`` toggles each ``RowItem``'s ``VisibleState`` and re-renders only the
navigation controls (``render()``) — the page-item buttons, the left/right navigation
arrows, and the current-page/page-count indicator.

**Why this is the effective pattern:** combined with the Rebuild Pattern (29.5.1), a
container's ``RowItems`` remain a single, stable in-memory collection regardless of how
many pages it spans; pagination is reduced to a pure visibility concern, layered
transparently on top of the same ``redrawList()``/``rerenderObject()`` lifecycle already
established for non-paginated containers.

29.6. Declarative Object Representation & Data Model
------------------------------------------------------

Beyond base-class selection, naming, referencing and real-time updates (29.1, points
1-4), two further structural prerequisites govern how an *x0-object* receives its
configuration and exposes its runtime state: declarative attribute injection, and the
recursive data model exposed through ``getObjectData()``/``setObjectData()``.

29.6.1. Declarative Attributes via JSONConfig.Attributes
***********************************************************

Every *x0-object* instance is configured through a single ``this.JSONConfig.Attributes``
object rather than through constructor arguments. This object is populated identically
regardless of its origin — a static ``object.json`` definition, an AJAX-fetched backend
response, or a runtime mutation — and is read by the object's own ``init()`` method:

.. code-block:: javascript

    //- sysObjImage.prototype.init (www/sysObjImage.js)
    sysObjImage.prototype.init = function()
    {
        if (this.JSONConfig !== undefined)
        {
            const Attributes = this.JSONConfig.Attributes;

            if (Attributes.Value !== undefined) {
                this.DOMAttributes['src'] = Attributes.Value;
            }
            //- ... remaining attribute assignments
        }
    }

Because ``init()`` only ever reads from ``this.JSONConfig.Attributes``, the object
implementation itself remains entirely decoupled from *where* that configuration
originated. Refer to :ref:`appdevconfig-metadata` (7.4) for the full ``object.json``
(object definition) / ``skeleton.json`` (hierarchy and relation management) schema
reference.

29.6.2. Recursive Data Model: getObjectData() / setObjectData()
*********************************************************************

``sysBaseObject`` exposes a uniform, recursive data-access pair —
``getObjectData()``/``setObjectData()`` — that lets a caller read or write an entire
object subtree's runtime state without manually traversing ``ChildObjects``. Each object
type opts into one of two dispatch mechanisms by declaring a ``SetDataMechanism`` (and,
symmetrically, a ``GetDataMechanism``) in its constructor:

.. table:: Data Mechanism Dispatch
	:widths: 20 80

	+---------------+----------------------------------------------------------------------+
	| **Mechanism** | **Behavior**                                                         |
	+===============+======================================================================+
	| ``Plain``     | Delegates directly to the object's own ``RuntimeSetDataFunc``/       |
	|               | ``RuntimeGetDataFunc`` (e.g. ``sysObjImage``'s ``setValue``). Used   |
	|               | for leaf, single-value objects.                                      |
	+---------------+----------------------------------------------------------------------+
	| ``KeyValue``  | Recurses into ``ChildObjects``, matching each descendant's ``KeyID`` |
	|               | against the corresponding entry of the supplied ``Data`` structure   |
	|               | (``sysObjFormfieldList``, keyed by the declarative ``object.json``   |
	|               | ``$ObjectID`` -- see :ref:`appdevformobjects`).                      |
	+---------------+----------------------------------------------------------------------+

.. code-block:: javascript

    //- sysObjImage.js - single-value leaf object
    this.RuntimeSetDataFunc     = this.setValue;
    this.SetDataMechanism       = 'Plain';

    //- sysObjFormfieldList.js - recursive container
    this.SetDataMechanism       = 'KeyValue'

``getObjectData()`` recursively walks every descendant exposing a ``RuntimeGetDataFunc``
and assembles a flat result map, keyed by ``ObjectID``, where each entry records its
``ObjectType``, ``ParentObject``, ``KeyID`` and current ``ObjectValue``:

.. code-block:: javascript

    //- sysBaseObject.prototype.getObjectDataRecursive (www/sysBaseObject.js)
    getObjectDataRecursiveResultData[this.ObjectID] = {
        "ObjectType": this.ObjectType,
        "ParentObject": this.ParentObject,
        "ParentDataObject": getObjectDataRecursiveParentDataObject,
        "KeyID": this.KeyID,
        "ObjectValue": this.RuntimeGetDataFunc()
    }

This result is structurally identical to what ``setObjectData()`` expects under the
``KeyValue`` mechanism, which allows an entire subtree's state — such as the TaskContainer
referenced in 29.1, point 6 — to be captured with a single ``getObjectData()`` call and
subsequently re-applied, in full or in part, with a single ``setObjectData(Data)`` call.

.. important::

	This recursive data model is currently in **beta** (29.1, point 6) and has not
	achieved full test coverage. Object types that do not explicitly declare a
	``SetDataMechanism``/``GetDataMechanism`` in their constructor do not participate in
	the ``Plain``/``KeyValue`` dispatch; verify the target object's source before relying
	on ``getObjectData()``/``setObjectData()`` in new custom objects.

29.7. Recent Architectural Evolution
--------------------------------------

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

29.8. Application Porting
-----------------------------

The remainder of this chapter explains how to port an existing web application,
particularly its DOM/HTML structure, into the *x0-framework*, applying the same
principles established above. It focuses on transforming frameworks like Bootstrap into
*x0-format* while leveraging the framework's object-oriented principles.

29.8.1. Introduction
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

29.8.2. Modern Approach
***************************

The *modern approach* to porting focuses on recursive object referencing and
modularization, as introduced in 29.3. This method ensures scalability and
maintainability by leveraging the ``sysFactory.setupObjectRefsRecursive()`` function.

29.8.2.1. Recursive Referencing
###################################

``sysFactory.setupObjectRefsRecursive()`` provides the following capabilities:

- Hierarchical object structures are defined declaratively, in JSON format.
- Every object in the structure is automatically instantiated, configured and rendered
  in a single recursive pass.
- Nested DOM elements are converted into *x0-objects* without manual, per-node
  bookkeeping.

29.8.2.2. Example: Recursive Object Definition
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
into an *x0-object* hierarchy.

**What this does:** three structural wrapper nodes (``"container"``, ``"row"``,
``"col"``) enclose a single leaf ``sysObjButton`` instance, and the whole definition is
handed to ``setupObjectRefsRecursive()`` in one call rather than four sequential
``addObject()`` invocations.

**Why this is the effective pattern:** ``"container"``, ``"row"`` and ``"col"`` are
intermediary layout layers (29.4.2) by design — they are reused verbatim across
every instance of this component and must never be targeted with
``getObjectByID()``. Only ``"btn"`` would typically be composed as an
instance-unique, addressable id in a production object.

29.8.3. Simple Referencing
*******************************

The *simple referencing* approach is ideal for small or isolated components.
It does not require deep nesting or complex hierarchies.

29.8.3.1. Example: Simple Object Initialization
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

**What this does:** the button is added directly to ``this`` object, without an
intervening ``ObjDefs`` structure or a recursive call.

**Why this is the effective pattern:** for a single, isolated node, the overhead of a
declarative ``ObjDefs`` structure outweighs its benefit; the trade-off is reduced
flexibility when the component later needs to scale into a larger, nested hierarchy.

29.8.4. Combining Modern and Simple Approaches
***************************************************

In practice, combining the modern and simple referencing techniques is frequently
necessary:

- Use recursive referencing for defining the application's primary structure.
- Use simple referencing for dynamically adding or modifying objects at runtime.

29.8.4.1. Example: Combined Approach
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

**What this does:** the main structure (``"mainContainer"``/``"header"``) is
established declaratively at initialization via ``setupObjectRefsRecursive()``, while
``DynamicBtn`` is appended afterward, at runtime, via a direct ``addObject()`` call.

**Why this is the effective pattern:** this combination maximizes the flexibility of
the *x0-framework* — the static backbone of a screen is declared once, recursively,
while individual nodes that are created conditionally or in response to runtime events
are added incrementally, without re-declaring or re-processing the entire hierarchy.

29.8.5. Porting-Specific Best Practices
********************************************

Beyond the general guidance already established in 29.2-29.6, porting an existing
application into the *x0-framework* imposes the following additional,
porting-specific constraints:

1. **Modularize Components:** The application must be decomposed into reusable
   components, preferring ``sysObjDivUnique`` over ``sysBaseObject`` plus a manual
   override flag (29.2), with attributes and styles supplied through JSON
   configuration rather than inline markup.

2. **Leverage Recursive Referencing:** Complex hierarchies must be constructed via
   ``sysFactory.setupObjectRefsRecursive()`` (29.3) rather than hardcoded, per-node
   ``addObject()`` sequences.

3. **Optimize Event Handling:** Native DOM events must be registered through
   ``this.EventListeners[]``, with reusable callbacks defined for recurring
   interaction patterns rather than duplicated inline handlers.

4. **Test Incrementally:** Each component must be verified independently, using the
   browser's developer tools to isolate DOM and JavaScript faults, before it is
   integrated into the broader application.

5. **Document Components:** Each reusable component must be documented with its JSON
   configuration schema and its expected runtime behavior.

29.9. Additional Resources
------------------------------

For more information, see:

- :ref:`devobjectmodeling` for object modeling and hierarchy design.
- :ref:`devoopmodel-classes` for the full class/method reference.
- ``sysFactory.js`` for details on ``setupObjectRefsRecursive()``.
- ``/www/userObj*.js`` for the complete, currently-maintained reference implementations.

Adherence to this guide enables the efficient construction of new custom objects, their
structured real-time update, and the principled porting of existing web applications
into the *x0-framework*.
