.. dev-best-practices

.. _dev-bestpractices:

24. Development Best Practices
==============================

This chapter establishes the **core architectural standards**, **object-construction patterns**,
and **runtime-update strategies** required to develop robust custom *x0-system-objects* within the
framework ecosystem.

24.1. Architectural Foundations
-------------------------------

The implementation of a **custom**, **deterministic** *x0-object* requires **strict adherence** to the
framework's **core structural constraints**. The following **core principles** must be thoroughly **understood**
before a developer attempts to construct **custom objects** or **modular extensions**.

Distinct rules separate mandatory requirements (**musts**) from optional features (**cans**). Deviating
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
   runtime pagination via ``sysRTPagination.js``.

5. **Declarative Object Representation:** Each object must be supplied with structured JSON metadata utilizing
   ``JSONConfig.Attributes`` (which can be static, fetched via AJAX from the backend, or modified at runtime).
   This is the standard mechanism for defining an object instance's behavior through the x0-system's declarative
   ``object.json`` (object definition) and ``skeleton.json`` (relation management) files.

6. **Data Model & Recursive Cloning:** The framework's internal object registry supports the full
   instantiation of recursive structures using ``getObjectData()`` and ``setObjectData()``. When configured correctly,
   the execution engine allows a root instance (such as the TaskContainer from point 4) to be deeply cloned at
   runtime. *Note: This feature is currently in beta and has not achieved full test coverage.*

The subsequent sections analyze these structural prerequisites in depth, specifying the exact implementation
semantics required by the framework's architectural infrastructure.

24.2. Know the Core Concept
---------------------------

Before continuing, a system developer **must** be familiar with the *x0-core-concept*—especially
how things work compared to other systems, and how they do not.

The first and **most important** difference compared to other frameworks is that only the **static**
**system core** JavaScript files and the **object metadata** definitions are fetched from the server.
All related content and objects are then rendered 100% inside the *x0-core* engine, which runs exclusively
in the browser's JavaScript engine and nowhere else (100% serverless).

Many other frameworks rely on heavy, multi-layer frontend-backend communication combined with
server-side string template replacements (a de facto outdated paradigm compared to modern OOP
application design). The *x0-core* does not use *string parameter replacements* **at all**.
Instead, it follows purely modern, object-oriented (OOP) patterns. While this approach may
initially look like "more work" during application design, combining smart *x0-building-blocks*
ultimately produces far more sophisticated, nested structures **and** a much cleaner, spaghetti-free
codebase built for long-term enterprise maintainability.

24.3. Mirror DOM
----------------

The developer must be thoroughly familiar with—and 100% understand—what the *x0-mirror-dom*
is responsible for and how it is structured.

The Mirror DOM creates a 1:1 mapping between object instances and DOM object layers across an
*x0-object-instance* hierarchy (also described in the OOP model documentation; see
:ref:`dev-oopmodel`), which allows structured data storage and programmatic object manipulation
based on true OOP principles.

During *x0-init*, the relationships between object instances are established from
``skeleton.json``, building a large graph-based tree in which each object instance holds a
``ChildObjects`` array referencing its child instances.

This architecture is exceptionally fast because it does not rely on an external object-manager
pattern. Real-time redrawing of a specific object requires only a minimal lookup, whereas
external management systems often have to re-render the entire tree for a single object change.

Furthermore, from a scalability point of view, one might assume this concept breaks down with a
large number of objects; however, the exact opposite is true. The smart x0 OOP model exploits
JavaScript's underlying prototype design by relying on a large set of inherited methods, which
the underlying JS engine maps purely via pointers. In practice, the x0 OOP model creates nearly
zero data copies when instantiating large numbers of object instances.

24.4. Declarative Model
-----------------------

In *x0*, everything is an **object**—and every *x0-object* instance relies on a unified,
declarative model to receive its configuration. Rather than hardcoding parameters, this
abstraction layer processes JSON-based metadata (``JSONConfig.Attributes``) to populate
each instance with well-defined properties.

When the *x0-init* process instantiates the objects defined in ``object.json`` along with
their relationships in ``skeleton.json``, it reads each object's ``Attributes``, instantiates
the *x0-object* according to its ``Type``, and sets the ``JSONConfig.Attributes`` property on
the newly created instance. Afterward, the instance's ``init()`` method is executed.

24.4.1. JSON Example
********************

The following JSON config utilizes an *x0-object* of type ``DivUnique``.

.. code-block:: json

   {
      "ExampleRowContainer":
      {
         "Type": "DivUnique",
         "Attributes":
         {
            "Style": "row m-0 p-0"
         }
      }
   }

When the *x0-system* initializes with this config, a new ``DivUnique`` object instance is
generated, its internal ``ObjectID`` property is set to ``ExampleRowContainer``, and
``JSONConfig.Attributes`` is set as a property on the object instance.

24.4.2. Initialization
**********************

After the object instance is populated with ``JSONConfig.Attributes``, its ``init()`` method
is invoked. The main purpose of ``init()`` is to check whether specific configuration attributes
exist, assign default values where needed, and initialize the internal properties so that the
object instance is ready for use.

Currently, this mechanism is not generic: each object transforms configuration attributes into
internal class properties via hardcoded logic within this method, with a few minor exceptions
that will be discussed later.

The simple workflow in ``Div``'s ``init()`` method—from which ``DivUnique`` also inherits—is
shown below:

.. code-block:: javascript

   //------------------------------------------------------------------------------
   //- METHOD "init"
   //------------------------------------------------------------------------------

   sysObjDiv.prototype.init = function()
   {
      if (this.JSONConfig !== undefined)
      {
         const Attributes = this.JSONConfig.Attributes;

         //- set DOM type if given
         this.DOMType = (Attributes.DOMType === undefined) ? 'div' : Attributes.DOMType;

         //- set DOM value if value in attributes, if not set empty
         this.DOMValue = (Attributes.Value === undefined) ? '' : Attributes.Value;

         //- set DOM style
         this.DOMStyle = Attributes.Style;
      }
   }

24.4.3. Programmatic Access
***************************

When instantiating objects programmatically without running through the declarative
*x0-init* pipeline, the implementor must perform these exact setup steps **manually**
inside the custom object:

- assigning the object's ``JSONConfig.Attributes`` metadata
- setting the object's ``ObjectID`` property
- optionally setting the ``overrideDOMObjectID`` property
- calling the object's ``init()`` method
- connecting the object to its parent via ``this.addObject(ObjectRef)`` (which also sets ``ParentObject`` automatically)

.. code-block:: javascript

   let BtnExample = new sysObjDiv();

   BtnExample.ObjectID = 'ExampleButton';

   BtnExample.DOMAttributes = new Object();
   BtnExample.DOMAttributes['type'] = 'button';
   BtnExample.DOMAttributes['title'] = sysFactory.getText('TXT.SYS.TITLE_CLOSE');

   BtnExample.JSONConfig = {
      "Attributes":
      {
         "DOMType": "button",
         "Style": "btn btn-close"
      }
   };

   BtnExample.init();

   this.addObject(BtnExample);

24.5. Custom Class Derivation
-----------------------------

Now that we have covered the basic concepts, you as a developer are ready to explore
what your first custom *x0-object*'s base structure must look like and how its parts
fit together.

Before proceeding, verify that you have a solid understanding of the following
concepts—continuing without them is not advisable:

- **Inheritance & Relationships:** The derivation and relationship between
  ``sysBaseDOMElement`` and ``sysBaseObject``.
- **Core Rendering Methods:** Familiarity with the existence of
  ``sysBaseObject.renderObject()`` and ``sysBaseObject.rerenderObject()``. A **deep**
  understanding is not required yet, as this will be covered in detail later.
- **Basic Object Structure:** An understanding of what a simple object's representation
  class looks like, such as ``Div`` in ``/www/sysObjDiv.js``.
- **Object Interconnection:** How objects are connected using ``this.addObject(Object)``.
  Note that for large sets of objects, this approach is overkill, and you will learn much
  more efficient methods later.
- **Declarative Configuration Model:** How object instances use data from statically
  declared configurations via ``JSONConfig.Attributes``, and how those settings are
  accessed or modified programmatically within the class.

24.5.1. Inheritance Basics
**************************

To summarize the base class inheritance hierarchy:
``sysBaseDOMElement`` is the root base class, which is inherited by ``sysBaseObject``.
``sysBaseDOMElement`` is responsible for direct DOM manipulation, while ``sysBaseObject``
handles interconnecting objects and provides all required methods for child classes used by
the system.

To establish interconnections between objects, ``sysBaseObject`` manages the ``ChildObjects``
array, which contains child object instance references (also deriving from ``sysBaseObject``).
Crucially for your further understanding, every single object in the entire system derives
(or rather, **must** derive) from ``sysBaseObject`` or one of the system's intermediate
classes (which also inherit from ``sysBaseObject`` in the inheritance chain).

24.5.2. Base Derivation
***********************

Let's take a look at the ``Div`` object's constructor (this object is part of the
*x0-framework's* early implementation stage).

.. code-block:: javascript

   //------------------------------------------------------------------------------
   //- CONSTRUCTOR "sysObjDiv"
   //------------------------------------------------------------------------------

   function sysObjDiv()
   {
      this.ObjectType             = 'Div';            //- System Object Type
      this.ChildObjects           = new Array();      //- Child Objects
      this.EventListeners         = new Object();     //- Event Listeners
   }

   //- inherit sysBaseObject
   sysObjDiv.prototype = new sysBaseObject();

As shown above, the constructor initializes the three core instance properties (``ObjectType``,
``ChildObjects``, and ``EventListeners``) and sets ``sysBaseObject`` as the prototype.
Overall, the purpose of ``Div`` and ``DivUnique`` is intentionally minimal: they handle basic
container functionality, such as applying a CSS ``Style`` or setting the DOM layer's
``innerHTML`` (``Value``).

.. code-block:: text

   +-----------------------+      +-----------------------+      +-----------------------+
   |  ::sysBaseDOMElement  | -->  |    ::sysBaseObject    | -->  |    ::sysCustomObj     |
   +-----------------------+      +-----------------------+      +-----------------------+

This is the **most common** derivation model for an *x0-custom-class*. While it can sometimes
make sense to place an intermediate class **between** ``::sysBaseObject`` and your custom
class, we will revisit that pattern later—first, let's examine the core base properties and
their purpose in the next section.

24.5.3. Core Members
********************

When implementing a custom *x0-object*, certain base properties must be initialized directly
inside your class constructor.

**Static System:**

- ``this.ParentObject``: A reference to the parent *x0-object* that contains this instance.
  This is set automatically when the object is added to a parent via ``addObject()``.
  In nested *x0-custom-classes*, a class sometimes needs access to the parent object **before**
  ``addObject()`` has been called (e.g., during the constructor phase). In that case, pass
  the parent reference and set ``this.ParentObject`` manually.

**Optional:**

- ``this.ChildObjects``: An ``Array`` that stores all child *x0-objects* attached to this
  instance via ``addObject()``. Why is this property optional? When omitted, your custom
  object cannot process child objects, which is only suitable when an object is always at
  the end of the object chain. Otherwise, forgetting to set this property will break child
  object handling.
- ``this.EventListeners``: An ``Object`` used to register DOM events (such as ``change`` or
  ``mousedown``) and map them to a private, self-defined callback function on the object.
  Event handling is discussed in its own chapter later.
- ``this.DOMAttributes``: An ``Object`` containing HTML **attributes** as key/value pairs
  (such as ``type``, ``title``, or ``disabled``). When no HTML attributes are needed, simply
  omit this property.
- ``this.overrideDOMObjectID``: A boolean flag (``false`` by default). When set to ``true``,
  the rendered HTML element keeps the exact ``this.ObjectID`` as its ``id`` instead of
  combining it with parent IDs.

**Mandatory:**

- ``this.ObjectType``: A unique name that identifies the class type (such as ``'Div'`` or
  ``'CustomObj'``). It must match the key used when registering the class in
  ``sysFactory.SetupClasses`` so the framework can recognize and look up the object via
  ``sysFactory.getObjectByType('CustomObj')``.
- ``this.ObjectID``: The unique identifier for the object instance. It is automatically
  assigned from your ``object.json`` configuration **or** set manually in code, and serves
  as the base for the element's HTML ``id``. It must be system-wide **unique**; a
  duplicate entry will **overwrite** an existing one (making it inaccessible). Calling
  ``sysFactory.getObjectByID('ObjectID')`` returns the reference to the object instance for
  direct access.

.. important::
   Properly managing ``this.ObjectID``—especially alongside ``this.overrideDOMObjectID``
   when building complex, nested sub-objects—is a fundamental concept in *x0*. We will
   explore how IDs must be set up in different scenarios to avoid serious mistakes.

.. _dev-object-nesting:

24.6. Object Nesting
--------------------

Nesting objects—much like nodes in the browser DOM—is a fundamental process in *x0*, where a
single composite component commonly spans many chained hierarchy levels. Because even simple
objects often require multiple nested layers, the following sections explain how to construct
and manage these hierarchies effectively.

In addition, we will cover naming conventions—especially how ``this.ObjectID`` is handled in
nested hierarchies, and when to select ``Div`` versus ``DivUnique``—in the subsections below.

24.6.1. Recursion HowTo
***********************

First, let's take a brief look at *x0-object-recursion*: how does *x0* handle recursive
traversal, and why is it so fast?

The engine applies a classic recursive tree-traversal design pattern—conceptually similar to
recursive Python generators, where Python's built-in ``__iter__`` method is overridden to
iterate over a private ``self._child_elements`` list of child object references that all
inherit the same base traversal methods:

.. code-block:: python

    def __iter__(self):
        return iter(self._child_elements)

    def iterate(self):
        yield self
        for x in self:
            for y in x.iterate():
                yield y

Because every object inherits these methods via its prototype/class chain and holds direct
references to its children in ``self._child_elements`` (equivalent to ``this.ChildObjects`` in
*x0*), each node knows how to traverse its own subtree without requiring an external manager
or lookup loop. Pre-linking object references statically at instantiation time allows the
engine to walk large object graphs with minimal overhead.

This exact recursive pattern is used inside *x0*'s ``renderObject()`` method (see
:ref:`oopmodel-classes` for the full implementation). This leads directly to the next
question: how do you efficiently connect and set up multiple nested object instances?

24.6.2. Direct Referencing
**************************

In the earliest development stages of *x0*, direct referencing was the only way to connect
objects. With a large number of objects, this approach does not scale well and quickly loses
clarity. Compare this to the browser DOM: in a debugger view, you can easily inspect layer
connections and immediately see how elements behave, including their events and CSS styles.
A similar capability was added to *x0* later, enabling a much cleaner setup method and
providing an as-is tree view of the interconnected objects (described in the next section).

However, the hierarchical approach can introduce unnecessary overhead when you only need to
connect two or three objects. In such simple cases, hierarchical referencing should be
avoided—let's take a look at how the direct method works instead.

.. important::
   Once a component spans more than two or three objects, consider the direct-referencing
   pattern shown below an **antipattern** that **must** be replaced by *x0*'s hierarchical
   setup functionality described in the next section (:ref:`hierarchical-object-setup`).

.. code-block:: javascript

   this.ObjectID = 'ExampleCustomObject';
   this.overrideDOMObjectID = true;

   let CtrRow = new sysObjDivUnique();
   CtrRow.ObjectID = 'ContainerRow';

   CtrRow.JSONConfig = {
      "Attributes":
      {
         "Style": "row"
      }
   };

   CtrRow.init();

   let CtrColLeft = new sysObjDivUnique();
   CtrColLeft.ObjectID = 'ContainerColLeft';

   CtrColLeft.JSONConfig = {
      "Attributes":
      {
         "Style": "col col-md-4"
      }
   };

   CtrColLeft.init();

   let CtrColRight = new sysObjDivUnique();
   CtrColRight.ObjectID = 'ContainerColRight';

   CtrColRight.JSONConfig = {
      "Attributes":
      {
         "Style": "col col-md-8"
      }
   };

   CtrColRight.init();

   let BtnExample = new sysObjDivUnique();
   BtnExample.ObjectID = 'ExampleButton';

   BtnExample.JSONConfig = {
      "Attributes":
      {
         "DOMType": "button",
         "Style": "btn btn-close"
      }
   };

   BtnExample.init();

   //- connect col right / left to row
   CtrRow.addObject(CtrColLeft);
   CtrRow.addObject(CtrColRight);

   //- connect button to col right
   CtrColRight.addObject(BtnExample);

   //- connect row to our custom object
   this.addObject(CtrRow);

We have used ``DivUnique`` specifically here and will discuss the ``ObjectID``
consequences. The resulting HTML will look like:

.. code-block:: html

   <div id="ExampleCustomObject">
     <div id="ContainerRow" class="row">
       <div id="ContainerColLeft" class="col col-md-4"></div>
       <div id="ContainerColRight" class="col col-md-8">
        <button id="ExampleButton" class="btn btn-close"></button>
       </div>
     </div>
   </div>

Now look at the resulting DOM output when the root object leaves
``this.overrideDOMObjectID = false`` and all child containers use ``Div`` instead of
``DivUnique``:

.. code-block:: html

   <div id="ExampleCustomObject">
     <div id="ExampleCustomObject_ContainerRow" class="row">
       <div id="ExampleCustomObject_ContainerRow_ContainerColLeft" class="col col-md-4"></div>
       <div id="ExampleCustomObject_ContainerRow_ContainerColRight" class="col col-md-8">
        <button id="ExampleCustomObject_ContainerRow_ContainerColRight_ExampleButton" class="btn btn-close"></button>
       </div>
     </div>
   </div>

Combining both aspects—first, wiring up verbose individual connections for a relatively simple
component, and second, dealing with long, unpredictable auto-prefixed DOM IDs when using
``Div`` (or ``this.overrideDOMObjectID = false``)—can easily create the false impression that
*x0* is overly complicated.

Therefore, the first rule is: use ``this.overrideDOMObjectID = true`` and ``DivUnique``
whenever possible, while keeping in mind that **you** are responsible for assigning a unique
``ObjectID``—especially when building dependent sub-objects such as dynamic rows that include
a ``RowID`` or index.

Combined with *x0*'s hierarchical setup functions (described in the next section), the first
issue—verbose object connections and lack of clarity—is turned into a major strength. We will
also cover the specific cases where leaving ``this.overrideDOMObjectID = false`` supports
simplicity in the overall process of designing object hierarchies.

.. _hierarchical-object-setup:

24.6.3. Hierarchical Setup
**************************

Since *x0* version 1.0 introduced ``sysFactory.setupObjectRefsRecursive(ObjDefs, RefObj)``, it
is also possible to build an object tree from nested declarative object definitions in a
clean, structured way. Look at the **transformed** example from the previous section:

.. code-block:: javascript

   this.ObjectID = 'ExampleCustomObject';
   this.overrideDOMObjectID = true;

   let ObjDefs =
   [
      {
         "id": "ContainerRow",
         "SysObject": new sysObjDivUnique(),
         "JSONAttributes": {
            "Style": "row"
         },
         "ObjectDefs": [
            {
               "id": "ContainerColLeft",
               "SysObject": new sysObjDivUnique(),
               "JSONAttributes": {
                  "Style": "col col-md-4"
                }
            },
            {
               "id": "ContainerColRight",
               "SysObject": new sysObjDivUnique(),
               "JSONAttributes": {
                  "Style": "col col-md-8"
               },
               "ObjectDefs": [
                  {
                     "id": "ExampleButton",
                     "SysObject": new sysObjDivUnique(),
                     "JSONAttributes": {
                        "DOMType": "button",
                        "Style": "btn btn-close"
                     }
                  }
               ]
            }
         ]
      }
   ];

   sysFactory.setupObjectRefsRecursive(ObjDefs, this);

As you can see at first glance, this structure is far cleaner and offers several key
advantages:

- **Inline instantiation:** Object instances (such as ``new sysObjDiv()``) are created
  directly inside the nested definition tree.
- **Visual clarity:** You can immediately see parent-child connections and nesting levels.
- **Flexible attachment:** The second parameter of ``setupObjectRefsRecursive()`` (``RefObj``)
  lets you attach the entire subtree directly to any target parent object.

This approach also lets you compose and combine multiple ``ObjDefs`` arrays programmatically,
making it easy to maintain clarity even in complex components whose content or child object
types change dynamically at runtime.

24.x. Event Listeners
---------------------

24.x. Intermediate Classes
--------------------------

24.x. Complex Objects
---------------------

24.x. Generic Data Model
------------------------

24.x. Realtime Pagination
-------------------------
