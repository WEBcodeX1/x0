.. dev-oop-model

.. _devoopmodel:

23. OOP Model
=============

This chapter documents the architectural model of the *x0-framework*: the small set of
foundational classes that every *x0-system-object* is built upon, and the core engine
components that instantiate, connect, and drive these objects at runtime. Together they
form a **pointer-based recursive object model**: every object holds a direct reference
(``ParentObject``) to its parent and an array of direct references (``ChildObjects``) to
its children, so the entire application state at any point in time is simply one
in-memory object graph rooted at a screen's ``HierarchyRootObject``.

.. _devoopmodel_base:

23.1. Base OOP Inheritance Model
---------------------------------

The base model is composed of two layered classes plus three cooperating engine
singletons:

    1. ``sysBaseDOMElement`` (``sysBaseDOMElement.js``)
        The lowest layer. It owns no hierarchy or lifecycle logic of its own; it only
        knows how to create, locate, style and remove **one** DOM node, and how to bind
        plain DOM event listeners to it.

    2. ``sysBaseObject`` (``sysBaseObject.js``)
        Inherits from ``sysBaseDOMElement`` (``sysBaseObject.prototype = new sysBaseDOMElement()``)
        and adds everything DOM binding does not provide: parent/child object
        references, recursive rendering, recursive traversal/query helpers, the
        runtime data read/write API, and the reset/enable/disable lifecycles. Every
        concrete *x0-system-object* (``sysObjDiv``, ``sysObjButton``, ``sysList``, …,
        documented in full in :ref:`devoopmodel-classes`) inherits from
        ``sysBaseObject``, either directly or through an intermediate subclass.

    3. ``sysFactory`` (``sysFactory.js``, singleton instance ``sysFactory``)
        The application-wide registry and entry point. It does not itself inherit from
        ``sysBaseObject``; instead it *owns* the collection of ``sysScreen`` instances
        (each of which roots one ``sysBaseObject`` hierarchy) and the ``SetupClasses``
        lookup table used to instantiate concrete objects from declarative metadata.

    4. ``sysReactor`` / ``sysEvent`` (``sysReactor.js``, singleton instance ``sysFactory.Reactor``)
        A minimal publish/subscribe event bus, decoupling objects that *raise*
        application-level events (buttons, tabs) from objects that *react* to them
        (``sysServiceConnector`` instances, in particular).

    5. ``sysScreen`` / ``sysScreenOverlay`` (``sysScreen.js``, ``sysScreenOverlay.js``)
        ``sysScreen`` assembles one ``sysBaseObject`` hierarchy from declarative JSON
        metadata (the "skeleton") and owns its own local global-variable scope.
        ``sysScreenOverlay`` layers a ``sysScreen`` on top of the current screen stack
        as a positioned/modal overlay.

These components are deliberately kept small and single-purpose; their combination is
what the rest of this chapter calls the *base OOP inheritance model*.

23.2. sysBaseDOMElement — DOM Binding Layer
--------------------------------------------

Defined in ``sysBaseDOMElement.js``. This class is the structural layer that handles
*all* direct DOM interaction and browser binding on behalf of a ``sysBaseObject``
instance; no other class in the framework talks to ``document`` directly outside of a
handful of narrow exceptions inside subclasses.

23.2.1. Purpose and Position in the Chain
*******************************************

``sysBaseDOMElement`` is a mixin-style base class: it carries no notion of children,
parents, or object identity (``ObjectID``) — those are added one layer up by
``sysBaseObject``. Splitting DOM binding out of the hierarchy/lifecycle logic keeps each
layer independently reasoned about: ``sysBaseDOMElement`` deals purely with "how does a
single node look and behave in the DOM", while ``sysBaseObject`` deals purely with "how
do nodes relate to each other and to application data".

23.2.2. Constructor Properties
*******************************

    - ``DOMDivElement``: Reference to the live DOM node once created (despite the name,
      holds whatever element type ``DOMType`` specifies, not only ``div``).
    - ``DOMValue``: The HTML content applied to the node's ``innerHTML``.
    - ``DOMStyle``: The CSS class string applied to the node.

(``DOMObjectID``, ``DOMParentID``, ``DOMType`` and ``DOMAttributes`` are referenced by
these methods but are actually owned by ``sysBaseObject`` / concrete subclasses, since
they depend on the object's position in the hierarchy.)

23.2.3. Element Lifecycle Methods
***********************************

    - ``createDOMElement()``: Creates the DOM node via ``document.createElement(this.DOMType)``,
      assigns it the id ``this.DOMObjectID``, and stores the reference on ``this.DOMDivElement``.
    - ``appendDOMParentElement()``: Appends ``this.DOMDivElement`` under ``this.DOMParentID``
      (or ``document.body`` if no parent id is set — i.e. for a screen's root object).
    - ``removeDOMParentElement()``: The inverse of the above; detaches the node from its
      parent container (or ``document.body``).
    - ``removeDOMElement()``: Removes the node directly by its own id, independent of its
      parent, via ``document.getElementById(...).remove()``.
    - ``checkDOMElementExists(ElementID)``: Returns ``true``/``false`` depending on whether
      an element with the given id is currently present in the document. This is the guard
      ``sysBaseObject.renderObject()`` uses to avoid re-creating nodes that already exist.

23.2.4. Attribute, Style and Value Methods
*********************************************

    - ``setDOMAttribute(Attribute, Value)`` / ``removeDOMAttribute(Attribute)``: Set/remove
      a single HTML attribute on the node.
    - ``setDOMAttributes()``: Iterates ``this.DOMAttributes`` and applies each entry via
      ``setDOMAttribute()``.
    - ``setDOMElementValue()``: Applies ``this.DOMValue`` to the node's ``innerHTML``, if set.
    - ``setDOMElementStyle()``: Applies ``this.DOMStyle`` as the node's full ``class`` attribute
      (replacing any existing classes).
    - ``addDOMElementStyle(StyleClass)`` / ``removeDOMElementStyle(StyleClass)``: Add/remove
      one or more (space-separated) individual CSS classes without touching the rest of the
      node's class list.
    - ``checkDOMHasStyle(StyleClass)``: Returns whether the node currently carries a given class.
    - ``getDOMStyleClasses()`` / ``setDOMStyleClasses(ClassNames)``: Read/replace the node's
      full ``className`` string by resolving the live DOM element and accessing its
      ``className`` property directly.
    - ``setDOMElementStyleAttributes()`` / ``setDOMElementZIndex()``: Apply the inline style
      properties ``top``/``left``/``width``/``height``/``zIndex`` from the corresponding
      ``DOMStyleTop``/``DOMStyleLeft``/``DOMStyleWidth``/``DOMStyleHeight``/``DOMStyleZIndex``
      properties — used by position-aware components such as ``sysScreenOverlay`` and
      ``sysContextMenu``.

23.2.5. Visibility and Enable/Disable Methods
*************************************************

    - ``setDOMVisibleState()``: Applies ``this.VisibleState`` (``'visible'`` or ``'hidden'``)
      to the node by removing or setting the inline ``display`` style.
    - ``switchDOMVisibleState()``: Toggles ``VisibleState`` based on the node's current
      visibility and re-applies it.
    - ``getDOMVisibleState()``: Returns the node's current ``display`` style value.
    - ``enableDOMElement()`` / ``disableDOMElement()``: Toggle the DOM ``disabled``
      property and the corresponding ``'disabled'`` HTML attribute (the latter via
      ``sysFactory.getObjectByID(this.ObjectID)`` so the attribute change is itself
      routed back through the object API rather than touching the DOM node twice).

23.2.6. Value Retrieval and Event Binding
*********************************************

    - ``getDOMValue()``: Returns the node's current ``innerHTML``.
    - ``getDOMElement()`` / ``getElement()``: Resolve and return the live DOM node for
      ``this.DOMObjectID`` (``getDOMElement()`` is a thin alias for ``getElement()``).
    - ``DOMaddEventListener(Type, Destination)``: Registers a native
      ``addEventListener(Type, Destination)`` on the node — this is the low-level
      primitive that ``sysBaseObject.processEventListener()`` drives recursively for
      every configured entry in an object's ``EventListeners``.

23.3. sysBaseObject — Root Primitive Lifecycle and Object Abstraction
------------------------------------------------------------------------

Defined in ``sysBaseObject.js``. ``sysBaseObject`` is the root primitive from which every
concrete *x0-system-object* is derived (``sysObjSomething.prototype = new sysBaseObject()``,
see :ref:`devoopmodel-classes-baseobj-addobject`). It turns the single-node DOM binding
provided by ``sysBaseDOMElement`` into a recursive tree abstraction with its own
lifecycle: construction, hierarchy assembly, rendering, data exchange, reset and removal.

23.3.1. Constructor Properties
*******************************

    - ``DOMType``: Defaults to ``'div'``; overridden by subclasses that render as a
      different element (``'button'``, ``'img'``, ``'input'``, ``'form'``, …).
    - ``ObjectID`` / ``ObjectType``: The object's unique logical identifier and its
      declared type name (matching a key of ``sysFactory.SetupClasses``).
    - ``ParentObject``: Back-reference to the parent object in the hierarchy, set by
      ``addObject()``.
    - ``DOMObjectID`` / ``DOMParentID``: The *actual*, rendering-time DOM element ids,
      computed recursively during ``renderObject()`` (see 23.3.3).
    - ``ChildObjects``: Array holding direct child object references — the core
      structure that makes the whole model recursive.

23.3.2. Inheritance
*********************

.. code-block:: javascript

    //- inherit sysBaseDOMElement
    sysBaseObject.prototype = new sysBaseDOMElement();

Every method described in section 23.2 (sysBaseDOMElement) is therefore available,
unmodified, on every ``sysBaseObject`` instance and every object derived from it.

.. _devoopmodel-base-hierarchy:

23.3.3. Hierarchy Construction and Recursive Rendering
**********************************************************

    - ``addObject(ChildObject)``: Sets ``ChildObject.ParentObject = this`` and pushes
      ``ChildObject`` onto ``this.ChildObjects``. This is the single primitive operation
      that builds the entire object graph; every higher-level instantiation mechanism
      (``sysFactory.setupObjectRefsRecursive()``, ``sysScreen.setupObject()``) ultimately
      calls it. Refer to :ref:`devoopmodel-classes-baseobj-addobject`.
    - ``renderObject(Prefix)``: Computes ``this.DOMObjectID`` — either ``this.ObjectID``
      directly (if ``overrideDOMObjectID === true``, used by objects that must keep a
      stable, non-prefixed id) or the recursively prefixed form ``Prefix + '_' + this.ObjectID``.
      It then renders the node *only if it does not already exist*
      (``checkDOMElementExists()``), applying attributes, value, style, visibility and
      event listeners in a fixed order, and finally **recurses into every entry of
      ``ChildObjects``**, passing its own freshly computed ``DOMObjectID`` down as the
      next ``Prefix``. This single recursive call is what turns one ``renderObject()``
      invocation on a screen's root object into a full top-down render of the entire
      hierarchy in one pass.
    - ``rerenderObject()``: Removes the current DOM subtree (``removeDOMParentElement()``),
      re-renders it from scratch (``renderObject(this.DOMParentID)``), and runs
      ``processReset()`` across the freshly rendered subtree — the standard way to fully
      refresh a subtree after its underlying configuration changed.
    - ``processEventListener()``: Recursively walks ``ChildObjects`` and, for every entry
      in an object's own ``EventListeners``, binds it to the DOM via
      ``DOMaddEventListener()`` (see 23.2.6). Because this is a separate recursive pass
      from ``renderObject()``, an object's DOM node always exists by the time its
      listeners are attached.
    - ``connectServiceConnectorObjects()``: Recursively walks ``ChildObjects`` and calls
      ``connect()`` on every object whose ``ObjectType == 'ServiceConnector'``, wiring
      ``sysServiceConnector`` instances into ``sysFactory.Reactor`` (see 23.5 and 23.7).

**Real-time rendering implications.** Because ``ChildObjects`` is a plain array of direct
object references rather than an indirection through IDs or a lookup table, traversal
during ``renderObject()``, ``processEventListener()``, ``processReset()`` and the data API
(23.3.6) is a simple, allocation-free recursive walk. Combined with the guard in
``renderObject()`` that skips any node whose DOM element already exists, repeated calls to
``renderObject()`` on a parent after a targeted subtree change (e.g. after ``add()``/``remove()``
on a list row) only ever create the newly added nodes, instead of re-creating the whole
tree — which is what makes high-frequency, real-time UI redrawing (live lists, async
notification indicators, dynamic radio lists) tractable without a virtual-DOM diffing layer.

23.3.4. Traversal and Query Methods
***************************************

    - ``getObjects()``: Recursively flattens the entire subtree into a single
      ``{ ObjectID: ObjectRef, … }`` map.
    - ``getObjectByID(ObjectID)``: Resolves ``getObjects()`` and returns the single
      matching entry.
    - ``getChildObjectByIndex(Index)``: Direct, non-recursive access into
      ``this.ChildObjects``.
    - ``getChildIndexByChildItemID(CheckID)``: Returns the array index of the direct
      child whose ``ObjectID`` matches ``CheckID`` — used internally by `remove()`
      (see 23.3.7).
    - ``getObjectsByAttribute(Attribute)``: Recursively collects every object in the
      subtree whose ``JSONConfig.Attributes`` declares the given attribute key.
    - ``getObjectsByType(ObjectType)``: Recursively collects every object in the subtree
      whose ``ObjectType`` matches.
    - ``getObjectCount()``: Returns ``this.ChildObjects.length`` (direct children only,
      non-recursive).

23.3.5. Activation State and Enable/Disable
***********************************************

    - ``setActivated()`` / ``setDeactivated()``: Set the ``Deactivated`` flag on the
      object itself (both intentionally operate non-recursively; the recursive descent
      into ``ChildObjects`` is present in the source but commented out, i.e. activation
      state is deliberately a per-object flag rather than propagated automatically).
    - ``enableDOMElementRecursive()`` / ``disableDOMElementRecursive()``: Recursively
      enable/disable every node in the subtree via ``sysBaseDOMElement.enableDOMElement()``/
      ``disableDOMElement()``. ``enableDOMElementRecursive()`` additionally skips any node
      whose own ``Deactivated`` flag is ``true``, so a subtree can contain nodes that stay
      disabled even when their container is otherwise re-enabled.

23.3.6. Runtime Data API
****************************

    - ``getObjectData()`` / ``setObjectData(Data)``: The object's public, uniform
      read/write API, dispatching to either a direct, non-recursive function pointer
      (``RuntimeGetDataFunc`` / ``RuntimeSetDataFunc`` under the ``'Plain'`` mechanism) or
      a recursive traversal (``getObjectDataRecursive()`` / ``setObjectDataKeyValueRecursive()``
      under the ``KeyValue``/unset mechanisms), depending on the object's own
      ``GetDataMechanism`` / ``SetDataMechanism`` configuration.
    - This dispatch pattern is what allows a single call such as
      ``sysFactory.getObjectByID('MyForm').getObjectData()`` to transparently read either
      one scalar value or an entire, deeply nested subtree of form field values, without
      the caller needing to know which strategy the target object implements.
    - The full mechanics of ``GetDataMechanism``/``SetDataMechanism``, ``KeyID``-based
      recursive dispatch, and the exact traversal implementations
      (``getObjectDataRecursive()``, ``setObjectDataKeyValueRecursive()``,
      ``getKeyIDValueFromData()``) are documented in detail in
      :ref:`devoopmodel-classes-getobjectdata` and :ref:`devoopmodel-classes-getobjectdatarecursive`.

23.3.7. Removal Semantics
*****************************

    - ``remove()``: Detaches *only this object* from its parent's ``ChildObjects`` (via
      ``getChildIndexByChildItemID()`` + ``splice()``) and removes its own DOM node.
      Refer to :ref:`devoopmodel-classes-baseobj-remove`.
    - ``removeParent()``: Removes this object's own DOM subtree entirely
      (``removeDOMParentElement()``) and discards *its own* ``ChildObjects`` array,
      effectively pruning everything below this object rather than just this object
      itself. Refer to :ref:`devoopmodel-classes-baseobj-removeparent`.

23.3.8. Reset Lifecycle
****************************

    - ``reset()``: An intentionally empty template method on ``sysBaseObject`` itself —
      every concrete subclass that needs reset behaviour (form fields, open/close
      containers, tab containers, lists, …) overrides it with its own logic.
    - ``processReset()``: Calls ``this.reset()`` and then recurses into every entry of
      ``ChildObjects``, so a single call on a screen's root object resets every object in
      the hierarchy in one pass. This is invoked automatically at the end of
      ``sysScreen.setup()`` and ``rerenderObject()``.

23.4. sysFactory — Object Factory and Application Registry
--------------------------------------------------------------

Defined in ``sysFactory.js`` (singleton instance ``sysFactory``). Acts as the single,
global entry point for object instantiation, screen management, global variables and
localized text, and holds the ``SetupClasses`` registry mapping declarative ``Type``
strings to the actual JavaScript constructors the engine is allowed to instantiate from
metadata.

23.4.1. SetupClasses Registry
*********************************

The constructor populates ``this.SetupClasses`` with one entry per instantiable system
object type (e.g. ``"Button": sysObjButton``, ``"List": sysList``,
``"ServiceConnector": sysServiceConnector``, …). This table is the single point of
indirection between the declarative JSON metadata describing a screen (``Type: "Button"``)
and the concrete constructor function invoked at setup time — see 23.6.2 for how
``sysScreen.setupObject()`` uses it.

23.4.2. init()
******************

``sysFactory.init()`` is the application bootstrap sequence:

    1. Binds every configured ``sysVarUserFunctions`` entry onto ``this.UserFunctions``.
    2. Iterates the loaded skeleton metadata (``this.DataSkeleton.XMLRPCResultData``) and
       calls ``addScreen(ScreenID, SkeletonData)`` once per screen.
    3. Builds the dedicated menu screen (``this.MenuScreen``) the same way, but outside
       the regular screen registry's iteration.
    4. Switches to the configured default screen (``switchScreen(this.DisplayDefaultScreen)``).
    5. Fires the ``'InitSystem'`` event through the reactor
       (``this.Reactor.dispatchEvent('InitSystem')``), letting any registered
       ``ServiceConnector`` react to application startup.
    6. Starts the asynchronous notification poller (``this.sysGlobalAsyncNotifyHandler.getMsg()``).

23.4.3. Screen and Object Registry Methods
**********************************************

    - ``addScreen(ScreenID, SkeletonData)``: Creates a new ``sysScreen``, assigns its
      ``ScreenID``/``SkeletonData``/optional ``JSONConfig`` (from ``this.ScreenConfig``),
      registers it in ``this.Screens``, and calls ``ScreenObj.setup()`` to fully build and
      render it (see 23.6).
    - ``getScreens()`` / ``getScreenByID(ScreenID)``: Read access to the screen registry.
    - ``getObjectByID(ObjectID)``: Searches *every* screen's ``HierarchyRootObject`` in
      turn and returns the first match — this is the mechanism that lets any part of the
      application resolve an object by id without knowing which screen it belongs to.
    - ``getObjectsByAttribute(Attribute)``: Per-screen variant returning a
      ``{ ScreenID: [...] }`` map of matching objects.
    - ``getObjectsByType(ScreenID, Type)``: Delegates to the given screen's root object's
      own ``getObjectsByType()``.

23.4.4. Screen Switching
*****************************

    - ``switchScreen(ScreenID)``: Switches every non-menu screen to the background
      (``switchScreensToBackground()``), updates ``this.CurrentScreenID``, switches the
      target screen to the foreground (``switchScreenToForeground()``), and fires the
      ``'SwitchScreen'`` event (with ``ScreenID`` as the event selector) through the reactor.
    - ``switchScreensToBackground()`` / ``switchScreenToForeground(ScreenObj)``: Internal
      helpers that toggle a screen's root object ``VisibleState`` and re-apply it via
      ``setDOMVisibleState()``. Only the DOM visibility is toggled — the hierarchy itself
      remains fully instantiated and in memory, so switching screens is a cheap,
      style-only operation rather than a teardown/rebuild.

23.4.5. Global Variables, Text and Error State
****************************************************

    - ``getGlobalVar(Key)`` / ``setGlobalVar(Key, Value)``: Read/write the
      application-wide global variable store (``this.ObjGlobalData``), distinct from a
      screen's own local ``GlobalVars`` (see 23.6.4).
    - ``resetErrorContainer()``: Resets every ``ErrorContainer``-typed object on the
      current screen via ``getObjectsByType()``.
    - ``getText(TextID)``: Resolves a localized string for ``this.EnvUserLanguage`` via
      ``this.ObjText.getTextObjectByID(TextID)``.
    - ``updateLanguageObjectsGlobal()``: Iterates every screen, finds every ``'SQLText'``-typed
      object, and calls its ``update()`` method — the mechanism behind runtime language
      switching (``sysObjLanguageSwitch``).

23.4.6. setupObjectRefsRecursive(ObjDefs, RefObj)
*******************************************************

The programmatic (non-skeleton-driven) counterpart to ``sysScreen.setupObject()``: given
an array of object definitions (each specifying ``id``, ``SysObject``, ``JSONAttributes``,
an optional ``KeyID``, and optionally nested ``ObjectDefs``), it assigns the object's
identity and configuration, calls its ``init()``, adds it to ``RefObj`` via ``addObject()``,
and recurses into any nested ``ObjectDefs``, using the just-created object as the new
parent reference. This is the method used to build ad-hoc object hierarchies outside of
the declarative skeleton/metadata pipeline (e.g. grid generation via ``sysGridGenerator``).

23.5. sysReactor / sysEvent — Event Reactor
----------------------------------------------

Defined in ``sysReactor.js`` (singleton instance ``sysFactory.Reactor``). Implements the
framework's internal publish/subscribe event system, decoupling the objects that trigger
application-level events from the objects that must react to them.

23.5.1. sysEvent
*********************

A lightweight data holder with three properties: ``ID`` (the event identifier),
``CallbackFunction`` (invoked on dispatch) and ``EventSelector`` (an optional
discriminator allowing several distinct registrations to share the same ``ID`` while
still being addressed individually, e.g. one ``'SwitchScreen'`` event per ``ScreenID``).

23.5.2. sysReactor Core Methods
*************************************

    - ``registerEvent(Attributes, CallbackFunction)``: Reads ``Attributes.OnEvent.Events``
      — an array whose entries are either plain ``EventID`` strings or
      ``{ EventID, EventSelector }`` objects — and pushes one ``sysEvent`` per entry onto
      ``this.Events``, each bound to the supplied ``CallbackFunction``.
    - ``dispatchEvent(EventID, EventSelector)``: Scans ``this.Events`` for an entry whose
      ``ID``/``EventSelector`` pair matches and invokes its ``CallbackFunction``.
    - ``fireEvents(FireEvents)``: Iterates an array of plain ``EventID`` values and calls
      ``sysFactory.Reactor.dispatchEvent(EventID)`` for each — the convenience entry point
      used by ``sysObjButton.processActions()`` and ``sysTab.fireEvents()`` to raise one or
      more events as a side effect of a user interaction.

23.5.3. Role in the Model
*******************************

The reactor is deliberately the *only* indirection between "something happened"
(a button click, a tab switch, application startup) and "something should now fetch or
refresh data" (a ``sysServiceConnector``). Because registration and dispatch are both
keyed purely by string identifiers rather than object references, the UI objects that
raise events never need a direct reference to the objects that consume them, keeping the
object graph itself acyclic and strictly hierarchical (parent/child only), while
cross-cutting application behaviour is layered on top through the reactor.

23.6. sysScreen — Screen Lifecycle and Hierarchy Assembly
--------------------------------------------------------------

Defined in ``sysScreen.js``. A ``sysScreen`` instance owns exactly one
``sysBaseObject`` hierarchy (rooted at ``HierarchyRootObject``, a plain ``sysObjDiv``)
built from declarative JSON "skeleton" metadata, plus its own request-data container and
local global-variable scope.

23.6.1. Constructor Properties
************************************

    - ``ScreenID``: The screen's identifier, also used as ``HierarchyRootObject.ObjectID``.
    - ``SkeletonData``: The screen's raw hierarchy metadata (which object ids nest under
      which parent ids).
    - ``HierarchyRootObject``: The ``sysObjDiv`` root of the screen's entire recursive
      object tree.
    - ``PostRequestData``: A ``sysRequestDataHandler`` instance for screen-level requests
      (see 23.8.2).
    - ``GlobalVars``: The screen's own local global-variable store, distinct from
      ``sysFactory``'s application-wide store (23.4.5).

23.6.2. setup() and setupObject() — Dynamic Child Instantiation
*********************************************************************

``setup()`` is the single entry point that turns a screen's metadata into a fully live,
rendered object hierarchy:

    1. Assigns ``ObjectID``/``DOMStyle`` on ``HierarchyRootObject``.
    2. Recursively builds the hierarchy via ``setupObject(this.ScreenID, this.HierarchyRootObject)``.
    3. Connects every ``ServiceConnector`` descendant (``connectServiceConnectorObjects()``).
    4. Renders the whole tree in one pass (``HierarchyRootObject.renderObject()``).
    5. Resets the whole tree (``HierarchyRootObject.processReset()``).
    6. Attaches all event listeners (``HierarchyRootObject.processEventListener()``).

``setupObject(ObjectID, HierarchyObject, HierarchyLevel=0)`` is the recursive core that
dynamically instantiates each child object at runtime:

    - Resolves the list of skeleton entries whose ``RefID`` matches ``ObjectID`` via
      ``getSkeletonObjectsByObjectRefId()``.
    - For each entry, looks up its declarative ``JSONConfig`` from
      ``sysFactory.DataObject.XMLRPCResultData``; if the config declares ``InstanceOf``,
      resolves and merges the referenced base configuration via ``configObjectInstance()``
      (23.6.3) first.
    - Instantiates the concrete object via ``new sysFactory.SetupClasses[JSONConfig.Type]()``
      — the point where the ``SetupClasses`` registry (23.4.1) turns a declarative
      ``Type`` string into a live JavaScript instance — and assigns ``JSONConfig``,
      ``ObjectID``, ``ObjectType``, ``Level`` (the recursion depth) and ``ScreenObject``.
    - Calls the new object's own ``init()``.
    - Attaches it to its parent via ``addObject()`` — either the object resolved by
      ``SkeletonItem.ElementID`` (an explicit, non-adjacent parent elsewhere in the
      hierarchy) or the structurally passed-in ``HierarchyObject`` (the adjacent parent).
    - Recurses into ``setupObject(Key, AddHierarchyObject, HierarchyLevel + 1)`` using the
      just-created object as the new traversal root, so the entire skeleton is walked and
      instantiated top-down in a single recursive pass.

This is the mechanism by which the declarative, data-driven screen metadata becomes the
concrete, pointer-based object graph that ``sysBaseObject``'s rendering and traversal
methods (23.3.3, 23.3.4) operate on at runtime.

23.6.3. configObjectInstance(JSONConfig)
**********************************************

Resolves ``JSONConfig.InstanceOf`` against ``sysFactory.DataObject.XMLRPCResultData``,
applies any ``AttributesOverwrite`` onto the referenced configuration's ``Attributes``,
and deep-merges the two configurations via ``sysMergeObjects()`` (23.9). This is what
allows a skeleton entry to say "instantiate this object like that other, already-defined
object, but override these specific attributes" instead of repeating a full object
definition.

23.6.4. Global Variables and Backend Callback
****************************************************

    - ``setGlobalVar(Key, Value)`` / ``getGlobalVar(Key)``: Read/write a single
      screen-local global variable.
    - ``setGlobalVars(GlobalVars)`` / ``getGlobalVars()``: Bulk replace/read the entire
      local global-variable store.
    - ``mergeGlobalVars(Items)``: Merges a set of key/value pairs into the existing store
      one key at a time via ``setGlobalVar()``.
    - ``callbackXMLRPCAsync()``: Populates the screen's global variables directly from a
      backend response (``setGlobalVars(this.XMLRPCResultData)``).

23.6.5. Style Methods
****************************

    - ``setStyle(Style)``: Sets ``this.CSSStyle`` (defaulting to
      ``sysFactory.DefaultStyleScreen``), used once during construction/setup.
    - ``updateStyle(Style)``: Applies a new style directly to the root object's DOM node
      at runtime (``HierarchyRootObject.DOMStyle = Style; HierarchyRootObject.setDOMElementStyle()``).

23.7. sysScreenOverlay — Modal Overlay Management
------------------------------------------------------

Defined in ``sysScreenOverlay.js`` (singleton instance ``sysFactory.OverlayObj``). Reuses
an existing, already-instantiated ``sysScreen`` as a modal or positioned overlay, by
manipulating its root object's style/visibility/z-index rather than creating any
additional hierarchy.

    - ``activateOverlay(ScreenID, OverrideStyle)``: Applies ``this.OverlayStyle`` (or
      ``OverrideStyle``) to the target screen's root object, makes it visible, and raises
      it to ``DOMStyleZIndex = 300`` above the regular screen stack.
    - ``closeOverlay(ScreenID)``: Removes the overlay style class and hides the screen
      root object again.
    - ``activateOverlayAtPosition(ScreenID, CoordX, CoordY, Width)``: Sets explicit
      ``DOMStyleLeft``/``DOMStyleTop``/``DOMStyleWidth`` on the root object before
      delegating to ``activateOverlay()`` with the ``'overlay-positioned'`` style variant —
      used for context-anchored overlays rather than screen-centered modals.

23.8. sysServiceConnector and sysRequestDataHandler — Backend Data Binding
-------------------------------------------------------------------------------

Defined in ``sysServiceConnector.js`` and ``sysRequestDataHandler.js`` respectively.
Together they form the bridge between the event reactor (23.5) and a data-bearing
object's runtime data API (23.3.6).

23.8.1. sysServiceConnector
*********************************

Inherits from ``sysBaseObject`` (``ObjectType: 'ServiceConnector'``), but is always used
as a thin, non-visual wrapper around exactly one data-bearing child object:

    - ``connect()``: Invoked recursively by ``sysBaseObject.connectServiceConnectorObjects()``
      (23.3.3) for every ``ServiceConnector``-typed object in a screen's hierarchy.
      Resolves the connector's single child (``getChildObjectByIndex(0)``), stores a back
      reference on it (``DstObject.ServiceConnector = this``), and registers this
      connector's ``EventCallback`` with ``sysFactory.Reactor`` for the events declared in
      ``JSONConfig.Attributes``.
    - ``EventCallback(EventConfig)``: Invoked by the reactor when a matching event fires.
      Resolves any configured source objects (``processSourceObjects()``), sets
      ``DataURL`` from ``Attributes.OnEvent.ServiceCall``, records the backend service
      identifier on ``PostRequestData`` (``addServiceProperty('BackendServiceID', ...)``),
      and triggers the connected child object's data retrieval.

23.8.2. sysRequestDataHandler
***********************************

A small, dependency-free data container used wherever outgoing request data needs to be
accumulated and shaped before a backend call — used as ``PostRequestData`` by
``sysObjButton``, ``sysScreen``, ``sysServiceConnector`` and ``sysFormfieldList`` alike:

    - ``reset()``: Clears ``RequestData`` and ``ServiceData`` back to empty objects (also
      called from the constructor).
    - ``addServiceProperty(Key, Value)``: Adds a property to ``ServiceData`` (metadata
      about the call itself, e.g. the backend service id).
    - ``add(DataObject, Key)``: Adds a single key/value pair to ``RequestData``.
    - ``merge(DataObject)``: Merges every key/value pair of ``DataObject`` into
      ``RequestData``.
    - ``removePrefix(Prefix)``: Strips a common prefix from every key currently in
      ``RequestData``.
    - ``transform(TransformData)``: Renames keys in ``RequestData`` according to a
      ``{ oldKey: newKey }`` mapping.

23.9. sysHelper — Shared Utility Functions
-----------------------------------------------

Defined in ``sysHelper.js``. A small set of standalone, module-level functions (not
attached to any prototype) used across the engine wherever plain-object data needs to be
merged or reshaped:

    - ``sysMergeObjects(Object1, Object2)``: Deep-merges two plain objects — nested
      objects are merged recursively, arrays are concatenated, and scalar values in
      ``Object2`` overwrite those in ``Object1``. Used by ``sysScreen.configObjectInstance()``
      (23.6.3) to combine an ``InstanceOf``-referenced configuration with its overrides.
    - ``sysConvertSysData2KeyValue(Data)``: Converts an array of ``{ KeyID, ObjectValue }``
      entries (as produced by the recursive data getter, see
      :ref:`devoopmodel-classes-getobjectdatarecursive`) into a flat
      ``{ KeyID: ObjectValue, … }`` object.
    - ``sysConvertSysDataArray2Object(Data)``: Converts an array of ``{ KeyID, … }``
      entries into an object keyed by ``KeyID``.

23.10. Relationships and Interactions
------------------------------------------

    1. Base Layer:
        ``sysBaseDOMElement`` provides single-node DOM binding; ``sysBaseObject`` builds the
        recursive parent/child tree and lifecycle on top of it. Every concrete
        *x0-system-object* is a ``sysBaseObject`` subclass (:ref:`devoopmodel-classes`).

    2. Factory and Screens:
        ``sysFactory`` owns the collection of ``sysScreen`` instances. Each ``sysScreen``
        turns declarative skeleton metadata into a live ``sysBaseObject`` hierarchy via
        ``setupObject()``, using ``sysFactory.SetupClasses`` to resolve declarative ``Type``
        strings to concrete constructors.

    3. Objects and Reactor:
        ``sysServiceConnector`` objects register themselves with ``sysFactory.Reactor``
        during ``connectServiceConnectorObjects()``. UI objects (``sysObjButton``,
        ``sysTab``) fire events through the same reactor as a side effect of user
        interaction, without ever holding a direct reference to the connectors that react
        to them.

    4. Event Flow:
        An event is registered with the reactor using ``registerEvent()``; when later
        dispatched via ``dispatchEvent()`` (directly, or indirectly through
        ``fireEvents()``), the reactor invokes the registered ``CallbackFunction`` —
        typically a ``sysServiceConnector.EventCallback()``, which in turn triggers its
        connected object's backend data retrieval.

    5. Data Flow Back to the UI:
        Once backend data arrives, it is written back into the object graph through the
        runtime data API (``setObjectData()``, 23.3.6), and any resulting DOM changes
        are applied through the same rendering/reset primitives described in 23.3.3 and
        23.3.8 — the same mechanisms used for the initial screen build.

23.11. Example Workflow
-----------------------------

Scenario: Creating and Managing a Screen with Dynamic, Service-Connected Objects

    1. Factory Initialization:
        ``sysFactory.addScreen()`` creates a ``sysScreen`` and immediately calls its
        ``setup()``, which recursively instantiates, renders and resets the entire
        declared hierarchy (23.6.2).

    2. Service Connection:
        Any ``ServiceConnector``-typed object in that hierarchy registers itself with
        ``sysFactory.Reactor`` during the same ``setup()`` call, via
        ``connectServiceConnectorObjects()``.

    3. Event Registration and Dispatch:
        A user interaction (e.g. a button click) calls ``processActions()``/``fireEvents()``,
        which dispatches one or more events through the reactor.

    4. Backend Round-Trip:
        The matching ``sysServiceConnector.EventCallback()`` fires, issues the configured
        backend call, and on response writes the result back into its connected object via
        ``setObjectData()``.

    5. Re-Render:
        Any DOM changes implied by the new data are applied immediately through the
        connected object's own render/update logic — no full-screen re-render is required,
        since the pointer-based tree allows any single object to be targeted directly.

23.12. Conclusion
-----------------------

The x0 framework's base OOP model — ``sysBaseDOMElement`` for DOM binding,
``sysBaseObject`` for the recursive parent/child tree and lifecycle, ``sysFactory`` for
object instantiation and screen management, ``sysReactor`` for decoupled event flow, and
``sysScreen``/``sysScreenOverlay``/``sysServiceConnector`` for assembling and connecting
screens to backend data — provides a small, consistently layered foundation. Because
every relationship in this model is a direct object reference rather than an indirection
through a lookup structure, the resulting object graph can be traversed, rendered,
reset and queried efficiently and predictably, even under frequent, partial, real-time
updates.
