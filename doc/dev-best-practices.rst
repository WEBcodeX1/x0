.. dev-best-practices

.. _dev-bestpractices:

24. Development Best Practices
==============================

This chapter establishes the **core architectural standards**,
**object-construction patterns**, and **runtime-update strategies** required to
develop robust custom *x0-system-objects* within the framework ecosystem.

24.1. Architectural Foundations
-------------------------------

The implementation of a **custom**, **deterministic** *x0-object* requires **strict
adherence** to the framework's **core structural constraints**. The following **core
principles** must be thoroughly **understood** before a developer attempts to
construct **custom objects** or **modular extensions**.

Distinct rules separate mandatory requirements (**musts**) from optional features
(**cans**). Deviating from these specifications can significantly alter **overall**
**system behavior**; therefore, all subsequent principles and sub-chapters must be
reviewed carefully.

1. **Base Class Derivation & Object Properties:** When designing custom classes,
   developers must carefully select the appropriate framework base class to derive
   from. Furthermore, the object properties within these custom classes must be
   configured precisely to **align with** the framework's **OOP model**.

2. **Object Naming Conventions (Setting ObjectIDs):** During instantiation,
   ``ObjectIDs`` must be explicitly defined as either unique or non-unique.
   Selecting non-unique IDs optimizes memory and instantiation performance, but
   directly alters how the subsequent DOM layer structures element names and how
   objects are referenced at runtime for subsequent modifications.

3. **Object Inheritance & Referencing:** Rather than requiring developers to
   explicitly map every single object instance, the *x0-system* provides smart
   routines heavily inspired by the DOM tree model to automatically manage
   complex, nested object infrastructures. Consequently, these automated routines
   strictly adhere to the framework's structural hierarchy rules.

4. **Real-Time Layout Updates:** When configured correctly, the framework handles
   real-time object redraws highly effectively. Instead of re-rendering entire
   hierarchies, the engine optimizes updates for complex structures—such as a
   *TaskContainer* managing nested *TaskLists* and individual *Tasks*—by surgically
   detaching and updating only the specific object from its representative parent
   DOM node. Furthermore, any properly constructed recursive object structure
   natively supports runtime pagination via ``sysRTPagination.js``.

5. **Declarative Object Representation:** Each object must be supplied with
   structured JSON metadata utilizing ``JSONConfig.Attributes`` (which can be
   static, fetched via AJAX from the backend, or modified at runtime). This is the
   standard mechanism for defining an object instance's behavior through the
   x0-system's declarative ``object.json`` (object definition) and
   ``skeleton.json`` (relation management) files.

6. **Data Model & Recursive Cloning:** The framework's internal object registry
   supports the full instantiation of recursive structures using ``getObjectData()``
   and ``setObjectData()``. When configured correctly, the execution engine allows
   a root instance (such as the TaskContainer from point 4) to be deeply cloned at
   runtime. *Note: This feature is currently in beta and has not achieved full test
   coverage.*

The subsequent sections analyze these structural prerequisites in depth, specifying
the exact implementation semantics required by the framework's architectural
infrastructure.

24.2. Know the Core Concept
---------------------------

Before continuing, a system developer **must** be familiar with the
*x0-core-concept*—especially how things work compared to other systems, and how
they do not.

The first and **most important** difference compared to other frameworks is that
only the **static** **system core** JavaScript files and the **object metadata**
definitions are fetched from the server. All related content and objects are then
rendered 100% inside the *x0-core* engine, which runs exclusively in the browser's
JavaScript engine and nowhere else (100% serverless).

Many other frameworks rely on heavy, multi-layer frontend-backend communication
combined with server-side string template replacements (a de facto outdated
paradigm compared to modern OOP application design). The *x0-core* does not use
*string parameter replacements* **at all**. Instead, it follows purely modern,
object-oriented (OOP) patterns. While this approach may initially look like "more
work" during application design, combining smart *x0-building-blocks* ultimately
produces far more sophisticated, nested structures **and** a much cleaner,
spaghetti-free codebase built for long-term enterprise maintainability.

24.3. Mirror DOM
----------------

The developer must be thoroughly familiar with—and 100% understand—what the
*x0-mirror-dom* is responsible for and how it is structured.

The Mirror DOM creates a 1:1 mapping between object instances and DOM object layers
across an *x0-object-instance* hierarchy (also described in the OOP model
documentation; see :ref:`dev-oopmodel`), which allows structured data storage and
programmatic object manipulation based on true OOP principles.

During *x0-init*, the relationships between object instances are established from
``skeleton.json``, building a large graph-based tree in which each object instance
holds a ``ChildObjects`` array referencing its child instances.

This architecture is exceptionally fast because it does not rely on an external
object-manager pattern. Real-time redrawing of a specific object requires only a
minimal lookup, whereas external management systems often have to re-render the
entire tree for a single object change.

Furthermore, from a scalability point of view, one might assume this concept breaks
down with a large number of objects; however, the exact opposite is true. The smart
x0 OOP model exploits JavaScript's underlying prototype design by relying on a
large set of inherited methods, which the underlying JS engine maps purely via
pointers. In practice, the x0 OOP model creates nearly zero data copies when
instantiating large numbers of object instances.

24.4. Declarative Model
-----------------------

In *x0*, everything is an **object**—and every *x0-object* instance relies on a
unified, declarative model to receive its configuration. Rather than hardcoding
parameters, this abstraction layer processes JSON-based metadata
(``JSONConfig.Attributes``) to populate each instance with well-defined
properties.

When the *x0-init* process instantiates the objects defined in ``object.json``
along with their relationships in ``skeleton.json``, it reads each object's
``Attributes``, instantiates the *x0-object* according to its ``Type``, and sets
the ``JSONConfig.Attributes`` property on the newly created instance. Afterward,
the instance's ``init()`` method is executed.

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

When the *x0-system* initializes with this config, a new ``DivUnique`` object
instance is generated, its internal ``ObjectID`` property is set to
``ExampleRowContainer``, and ``JSONConfig.Attributes`` is set as a property on
the object instance.

24.4.2. Initialization
**********************

After the object instance is populated with ``JSONConfig.Attributes``, its
``init()`` method is invoked. The main purpose of ``init()`` is to check whether
specific configuration attributes exist, assign default values where needed, and
initialize the internal properties so that the object instance is ready for use.

Currently, this mechanism is not generic: each object transforms configuration
attributes into internal class properties via hardcoded logic within this
method, with a few minor exceptions that will be discussed later.

The simple workflow in ``Div``'s ``init()`` method—from which ``DivUnique`` also
inherits—is shown below:

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

When instantiating objects programmatically without running through the
declarative *x0-init* pipeline, the implementor must perform these exact
setup steps **manually** inside the custom object.

- Assign the object's ``JSONConfig.Attributes`` metadata.
- Set the object's ``ObjectID`` property.
- Optionally set the ``overrideDOMObjectID`` property.
- Call the object's ``init()`` method.
- Connect the object to its parent via ``this.addObject(ObjectRef)``
  (which also sets ``ParentObject`` automatically).

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

Now that we have covered the basic concepts, you as a developer are ready to
explore what your first custom *x0-object*'s base structure must look like and
how its parts fit together.

Before proceeding, verify that you have a solid understanding of the following
concepts—continuing without them is not advisable:

- **Inheritance & Relationships:** The derivation and relationship between
  ``sysBaseDOMElement`` and ``sysBaseObject``.
- **Core Rendering Methods:** Familiarity with the existence of
  ``sysBaseObject.renderObject()`` and ``sysBaseObject.rerenderObject()``. A
  **deep** understanding is not required yet, as this will be covered in detail
  later.
- **Basic Object Structure:** An understanding of what a simple object's
  representation class looks like, such as ``Div`` in ``/www/sysObjDiv.js``.
- **Object Interconnection:** How objects are connected using
  ``this.addObject(Object)``. Note that for large sets of objects, this approach
  is overkill, and you will learn much more efficient methods later.
- **Declarative Configuration Model:** How object instances use data from
  statically declared configurations via ``JSONConfig.Attributes``, and how
  those settings are accessed or modified programmatically within the class.

24.5.1. Inheritance Basics
**************************

To summarize the base class inheritance hierarchy: ``sysBaseDOMElement`` is the
root base class, which is inherited by ``sysBaseObject``. ``sysBaseDOMElement``
is responsible for direct DOM manipulation, while ``sysBaseObject`` handles
interconnecting objects and provides all required methods for child classes used
by the system.

To establish interconnections between objects, ``sysBaseObject`` manages the
``ChildObjects`` array, which contains child object instance references (also
deriving from ``sysBaseObject``). Crucially for your further understanding, every
single object in the entire system derives (or rather, **must** derive) from
``sysBaseObject`` or one of the system's intermediate classes (which also inherit
from ``sysBaseObject`` in the inheritance chain).

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

As shown above, the constructor initializes the three core instance properties
(``ObjectType``, ``ChildObjects``, and ``EventListeners``) and sets ``sysBaseObject``
as the prototype. Overall, the purpose of ``Div`` and ``DivUnique`` is intentionally
minimal: they handle basic container functionality, such as applying a CSS ``Style``
or setting the DOM layer's ``innerHTML`` (``Value``).

.. code-block:: text

   +-----------------------+      +-----------------------+      +-----------------------+
   |  ::sysBaseDOMElement  | -->  |    ::sysBaseObject    | -->  |    ::sysCustomObj     |
   +-----------------------+      +-----------------------+      +-----------------------+

This is the **most common** derivation model for an *x0-custom-class*.
While it can sometimes make sense to place an intermediate class **between**
``::sysBaseObject`` and your custom class, we will revisit that pattern later—first,
let's examine the core base properties and their purpose in the next section.

24.5.3. Core Members
********************

When implementing a custom *x0-object*, certain base properties must be
initialized directly inside your class constructor.

**Static System:**

- ``this.ParentObject``: A reference to the parent *x0-object* that contains
  this instance. This is set automatically when the object is added to a parent
  via ``addObject()``. In nested *x0-custom-classes*, a class sometimes needs
  access to the parent object **before** ``addObject()`` has been called (e.g.,
  during the constructor phase). In that case, pass the parent reference and set
  ``this.ParentObject`` manually.

**Optional:**

- ``this.ChildObjects``: An ``Array`` that stores all child *x0-objects*
  attached to this instance via ``addObject()``. Why is this property optional?
  When omitted, your custom object cannot process child objects, which is only
  suitable when an object is always at the end of the object chain. Otherwise,
  forgetting to set this property will break child object handling.
- ``this.EventListeners``: An ``Object`` used to register DOM events (such as
  ``change`` or ``mousedown``) and map them to a private, self-defined callback
  function on the object. Event handling is discussed in its own chapter later.
- ``this.DOMAttributes``: An ``Object`` containing HTML **attributes** as
  key/value pairs (such as ``type``, ``title``, or ``disabled``). When no HTML
  attributes are needed, simply omit this property.
- ``this.overrideDOMObjectID``: A boolean flag (``false`` by default). When set
  to ``true``, the rendered HTML element keeps the exact ``this.ObjectID`` as
  its ``id`` instead of combining it with parent IDs.

**Mandatory:**

- ``this.ObjectType``: A unique name that identifies the class type (such as
  ``'Div'`` or ``'CustomObj'``). It must match the key used when registering the
  class in ``sysFactory.SetupClasses`` so the framework can recognize and look up
  the object via ``sysFactory.getObjectByType('CustomObj')``.
- ``this.ObjectID``: The unique identifier for the object instance. It is
  automatically assigned from your ``object.json`` configuration **or** set
  manually in code, and serves as the base for the element's HTML ``id``. It
  must be system-wide **unique**; a duplicate entry will **overwrite** an
  existing one (making it inaccessible). Calling
  ``sysFactory.getObjectByID('ObjectID')`` returns the reference to the object
  instance for direct access.

.. important::

   Properly managing ``this.ObjectID``—especially alongside
   ``this.overrideDOMObjectID`` when building complex, nested sub-objects—is a
   fundamental concept in *x0*. We will explore how IDs must be set up in
   different scenarios to avoid serious mistakes.

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

This exact recursive traversal powers *x0*'s ``renderObject()`` method (see
:ref:`oopmodel-classes` for the full implementation). However, for ``renderObject()`` to
walk a component's subtree at runtime, those parent-child links must first be established
in memory—starting with the simplest approach, direct referencing, in the next section.

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

24.6.4. overrideDOMObjectID
***************************

It is also possible to vary ``this.overrideDOMObjectID`` within a nested object chain.
Selectively setting ``this.overrideDOMObjectID`` to ``false`` or ``true`` should be
considered in specific scenarios, particularly when dynamically creating ``ObjectID``
values.

Consider the following illustration, which shows how this approach can be useful even
within a **static** *x0-object-type*:

.. code-block:: text

   +-----------------------+      +-----------------------+      +-----------------------+
   |        ``Div``        |      |        ``Div``        |      |        ``Div``        |
   +-----------------------+      +-----------------------+      +-----------------------+
   |  overrideDOMObjectID  | -->  |  overrideDOMObjectID  | -->  |  overrideDOMObjectID  |
   |        false          |      |         false         |      |         false         |
   +-----------------------+      +-----------------------+      +-----------------------+
   |     "RootObject"      |      |         "Row"         |      |         "Col1"        |
   +-----------------------+      +-----------------------+      +-----------------------+

This concept works well, provided you use a sensible naming schema for the subsequent layers.
The resulting DOM IDs are ``RootObject``, ``RootObject_Row``, and ``RootObject_Row_Col1``.

.. tip::

   Keep ``ObjectID`` names short for this approach to work cleanly, while keeping a few
   important constraints in mind.

Note that naming an ``ObjectID`` ``Row`` will likely create duplicates. However, this is
not an issue as long as the implementer is aware of the resulting consequences and limitations.

When objects with **duplicate names** act **exclusively** as presentational (CSS) elements
without containing any logical constructs (such as the ``Div`` *x0-object-type*), the implementer
can use as many of them system-wide as needed.

The only consequence is that these objects are non-unique and therefore cannot be addressed
via ``sysFactory.getObjectByID()``.

For **dynamic object creation**, consider the following illustration (only the beginning
of the object chain is shown):

.. code-block:: text

   +-----------------------+      +-----------------------+      +-----------------------+
   |     ``DivUnique``     |      |        ``Div``        |      |        ``Div``        |
   +-----------------------+      +-----------------------+      +-----------------------+
   |  overrideDOMObjectID  | -->  |  overrideDOMObjectID  | -->  |  overrideDOMObjectID  |
   |          true         |      |         false         |      |         false         |
   +-----------------------+      +-----------------------+      +-----------------------+
   |         "Row1"        |      |        "CtrRow"       |      |       "CtrCol1"       |
   +-----------------------+      +-----------------------+      +-----------------------+

As shown in the illustration above, when dynamically creating multiple row objects inside
a list-like object, use a ``DivUnique`` as the first element and include the **row index**
in the ``ObjectID`` to make it unique. Then, for container-only (CSS) objects, the ``Div``
type and a non-dynamic, simple ``ObjectID`` are sufficient.

This generates clean DOM IDs **and** improves performance because these objects are not
added to the internal system structures—avoiding significant overhead when rendering a large
number of rows.

.. important::

   When building your custom class, ``this.ObjectID`` **is** the first (root) element;
   inheriting from the appropriate *x0-object-type*—as shown in the practical example in
   the next chapter—handles this automatically.

24.6.5. Class Example
*********************

The following is a practical CustomObj example that specifically demonstrates the
``overrideDOMObjectID`` behavior from the previous chapter.

.. code-block:: javascript

   //------------------------------------------------------------------------------
   //- CONSTRUCTOR "sysObjCustomObj"
   //------------------------------------------------------------------------------

   function sysObjCustomObj(Index)
   {
      this.ObjectType    = 'CustomObj';                //- System Object Type
      this.ObjectID      = 'CustomObjRowCtr' + Index;  //- Unique ObjectID
      this.DOMStyle      = 'container-fluid';          //- CSS Style
      this.ChildObjects  = new Array();                //- Child Objects
   }

   //- inherit sysDivUnique, setting overrideDOMObjectID = true
   sysObjCustomObj.prototype = new sysObjDivUnique();


   //------------------------------------------------------------------------------
   //- METHOD "init"
   //------------------------------------------------------------------------------

   sysObjCustomObj.prototype.init = function()
   {
      //- process initialization
      const Attributes = this.JSONConfig.Attributes;

      //- declaratively define object tree
      let ObjDefs = [
         {
            "id": "CtrRow",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
               "Style": "row"
            },
            "ObjectDefs": [
               {
                  "id": "CtrCol",
                  "SysObject": new sysObjDiv(),
                  "JSONAttributes": {
                     "Style": "col col-md-12"
                  },
                  "ObjectDefs": [
                     {
                        "id": "Btn" + this.ObjectID,
                        "SysObject": new sysObjButton(),
                        "JSONAttributes": {
                           "DOMType": "button",
                           "Style": "btn",
                           "OnClick": "https://backend.com/service.py",
                           "SrcDataObjects": [ "Formlist1", "Formlist2" ]
                        }
                     }
                  ]
               }
            ]
         }
      ];

      //- build object relations
      sysFactory.setupObjectRefsRecursive(ObjDefs, this);
   }

This results in the following HTML output, assuming the constructor is called
with ``Index`` set to ``1``:

.. code-block:: html

   <div id="CustomObjRowCtr1" class="container-fluid">
     <div id="CustomObjRowCtr1_CtrRow" class="row">
       <div id="CustomObjRowCtr1_CtrRow_CtrCol" class="col col-md-12">
         <button id="BtnCustomObjRowCtr1" class="btn"></button>
       </div>
     </div>
   </div>

Short overview of **what** happens and **why**:

- ``this.ObjectType`` is set to ``'CustomObj'``; however, the class must still be
  registered with ``sysFactory`` and the object loader (see :ref:`init-object-loading`).
- ``this.ObjectID`` is set dynamically using ``Index``. The base name is set to
  ``CustomObjRowCtr`` because ``ObjectID`` values in the parent object (controller role)
  follow a ``CustomObj*`` naming pattern, avoiding naming schema conflicts.
- ``this.DOMStyle`` defines the container's CSS classes.
- ``this.ChildObjects`` must be initialized as an empty ``Array``; otherwise, child
  objects will not be processed.
- The class inherits from ``sysObjDivUnique``, so no parent ``ObjectID`` prefix is
  prepended during DOM ID generation—only the exact name set in the constructor is used.
- Three child objects are added recursively: first, a ``Div`` object named ``CtrRow``;
  second, a ``Div`` object named ``CtrCol`` attached to ``CtrRow``; and third, a
  ``Button`` object attached to ``CtrCol``.
- All three child objects are connected cleanly using ``sysFactory.setupObjectRefsRecursive()``.
- The button is configured to trigger a backend service call with runtime data from the
  objects with ``ObjectID`` ``Formlist1`` and ``Formlist2`` appended to the JSON payload
  (these objects do not currently exist and are shown for demonstration purposes only).
- The objects with ``ObjectID`` ``CtrRow`` and ``CtrCol`` act as presentational containers
  only and therefore use the *x0-object-type* ``Div`` rather than ``DivUnique``.

24.7. Object Communication
--------------------------

Without communication and interaction between UI objects and backend services, a
modern web application lacks essential functionality. The *x0-core* provides
built-in mechanisms to handle both the declarative model used by shipped
*x0-system-objects* and the programmatic model used in the underlying layer
within *x0-system-objects*.

Predefined *x0-system-objects* and declarative mechanisms include:

- ``Button``
- ``ButtonInternal``
- ``ContextMenu``
- *x0-events* driven by the ``x0::reactor`` component inside ``Button`` and
  ``ContextMenu``

At a lower, programmatic abstraction level—upon which the predefined
*x0-system-objects* themselves are built—developers can also use:

- **Event Listeners:** Mechanism for binding native DOM events directly to
  object methods.
- **Button Callbacks:** Mapping user actions to internal JavaScript callback
  functions.
- **Reactor Events:** Decoupled publish/subscribe event dispatching via
  ``x0::reactor`` for cross-object communication.

24.7.1. Button Types
********************

Depending on whether an action triggers a remote backend service or an internal
client-side function, *x0* provides specialized button object types:

- ``Button``: Triggers an asynchronous backend service call (defined via
  ``OnClick``) and optionally appends runtime data from specified source
  objects (``SrcDataObjects``) to the service payload.
- ``ButtonInternal``: Executes internal framework or object-level actions
  without issuing a remote backend request.
- ``ButtonCallback``: Maps a button click directly to a custom JavaScript
  callback function on the target object instance.

.. note::

   Currently, declarative JSON configuration supports ``Button``,
   ``ButtonInternal``, and ``ContextMenu`` directly, whereas ``ButtonCallback``
   is primarily used programmatically inside custom classes.

.. warning::

   Currently, ``ButtonInternal`` has limited utility in both the declarative
   and programmatic models. For *x0* version 1.2, it is planned to refactor and
   merge the ``Action`` and ``FunctionDispatch`` subsystems into a unified,
   cleaner model.

24.7.2. Context Menu
********************

This section explains how to programmatically add context menu functionality
to your custom objects. The following code registers a right-click listener on
the object's corresponding ``div`` element, for declarative context menu configuration,
see :ref:`context-menu`.

.. important::

   Without initializing ``this.EventListeners`` in the constructor, the
   context menu will not work.

.. code-block:: javascript

   //------------------------------------------------------------------------------
   //- CONSTRUCTOR "sysObjCustomObj"
   //------------------------------------------------------------------------------

   function sysObjCustomObj()
   {
      this.EventListeners = new Object();    //- Event Listener Configuration
   }

   //------------------------------------------------------------------------------
   //- METHOD "init"
   //------------------------------------------------------------------------------

   sysObjCustomObj.prototype.init = function()
   {
      let EventListenerObj = new Object();
      EventListenerObj['Type'] = 'mousedown';
      EventListenerObj['Element'] = this.EventListenerRightClick.bind(this);
      this.EventListeners['ContextMenuOpen'] = EventListenerObj;
   };

How the listener registration works:

- ``this.EventListeners``: Must be initialized as an ``Object`` in the
  constructor so the framework can attach DOM event listeners during rendering.
- ``EventListenerObj['Type']``: Specifies the DOM event type—for example,
  ``'mousedown'`` to capture mouse button presses. Any other standard DOM
  event type is also supported here.
- ``EventListenerObj['Element']``: Holds the bound class method reference that
  will be invoked when the event occurs.
- ``this.EventListeners['ContextMenuOpen']``: Registers the listener under a
  unique key name on the object.

The listener registration always follows this same principle, whereas
implementing the context menu items themselves involves a few specific details,
covered after the example.

Finally, implement the right-click handler to instantiate and display the
``sysContextMenu``. The following example generates a context menu containing a
single ``"RemoveItem"`` entry:

.. code-block:: javascript

   //------------------------------------------------------------------------------
   //- METHOD "EventListenerRightClick"
   //------------------------------------------------------------------------------

   sysObjCustomObj.prototype.EventListenerRightClick = function(Event)
   {
      const ContextMenuItems = [
         {
            "ID": "RemoveItem",
            "TextID": "TXT.SYS.CONTEXTMENU.MENUENTRY.REMOVE_DATA",
            "IconStyle": "fa-solid fa-trash",
            "CallbackFunction": this.remove,
            "CallbackObjRef": this
         }
      ];

      //- check for right click on mousedown
      if (Event.button == 2 && ContextMenuItems !== undefined)
      {
         let ContextMenu          = new sysContextMenu();

         ContextMenu.ID           = 'CtMenu' + this.ObjectID;
         ContextMenu.ItemConfig   = ContextMenuItems;
         ContextMenu.ScreenObject = this.ScreenObject;
         ContextMenu.ParentObject = this;
         ContextMenu.pageX        = Event.pageX;
         ContextMenu.pageY        = Event.pageY;

         ContextMenu.init();
      }
   };

Key properties of the menu item definition (``ContextMenuItems``) and the
``sysContextMenu`` instance:

- ``ID``: Unique identifier for the individual menu entry.
- ``TextID``: Multilanguage text identifier from ``webui.text`` database table
  or static ``/static/meta/text-data.json`` used for the menu label display.
- ``IconStyle``: Font Awesome icon CSS classes rendered next to the menu label.
- ``Event.button == 2``: Filters the ``mousedown`` event so the context menu
  only opens on a right-click (secondary mouse button).
- ``ContextMenu.ID``: Sets a unique DOM ID for the popup menu by combining a
  prefix with ``this.ObjectID``, preventing collisions across multiple
  instances.
- ``ContextMenu.ItemConfig``: Passes the array of menu entry definitions to
  the menu instance.
- ``ContextMenu.ScreenObject``: This reference **must** be a valid ScreenObject
  reference, otherwise context menu rendering fails.
- ``ContextMenu.ParentObject``: Links the context menu to its owning parent
  object.
- ``ContextMenu.pageX`` & ``ContextMenu.pageY``: Positions the context menu at
  the exact cursor coordinates where the right-click occurred.
- ``ContextMenu.init()``: Initializes and renders the context menu immediately
  at the specified coordinates.

To register functionality, a distinction must be made between two different
types:

1. **Custom Function Callbacks** inside the custom object
2. **Internal Function Dispatching**, using the x0-system's internal
   ``sysFunctionDispatcher``

**Custom Function Callbacks:**

- ``CallbackFunction``: A reference to the callback method executed when the
  user selects the entry.
- ``CallbackObjRef``: Because JavaScript detaches methods from their original
  object when passed as references (losing the ``this`` context), this object
  reference is passed as a parameter so the callback function can access the
  target object internally.

**Function Dispatching:**

- ``InternalFunction``: Maps a fixed, system-internal function inside
  ``sysFunctionDispatcher``, function reference: :ref:`contextmenu-functions`.

24.7.3. Button Callback
***********************

``ButtonCallback`` is the simplest abstraction model for executing custom
client-side logic inside a custom class design. Under the hood, it utilizes the
event listener mechanism described in the next section, but encapsulates the
wiring so you do not have to manage raw DOM event bindings manually.

If this lightweight callback model is not sufficient—for instance, when you
need to listen for non-click DOM events such as ``keyup``, ``change``, or
``mouseover``—you can fall back to registering custom ``EventListeners``
directly.

In the example below, a ``ButtonCallback`` is created inside a custom object's
``init()`` method and bound to the system's fixed ``this.ButtonCallback()``
method:

.. code-block:: javascript

   //------------------------------------------------------------------------------
   //- METHOD "init"
   //------------------------------------------------------------------------------

   sysObjCustomObj.prototype.init = function()
   {
      let BtnAction = new sysObjButtonCallback();
      BtnAction.ObjectID = 'BtnCallback';
      BtnAction.JSONConfig = {
         "Attributes": {
            "Style": "btn btn-sm btn-primary",
            "TextID": "TXT.BUTTON"
         }
      };

      //- bind callback target and callback identifier passed as FunctionID parameter
      BtnAction.setCallback(this, 'click');

      BtnAction.init();
      this.addObject(BtnAction);
   };

   //------------------------------------------------------------------------------
   //- METHOD "ButtonCallback"
   //------------------------------------------------------------------------------

   sysObjCustomObj.prototype.ButtonCallback = function(FunctionID)
   {
      if (FunctionID == 'click')
      {
         console.log('Button click');
      }
   };

The following is a detailed description of how ``ButtonCallback`` processes
the click logic:

- ``BtnAction.setCallback(this, 'click')``: Registers the owning custom object
  (``this``) as the callback target and assigns a string identifier
  (``'click'``) to distinguish between multiple callback buttons on the same
  parent object.
- ``this.ButtonCallback(FunctionID)``: The fixed handler method invoked on the
  target object whenever any bound ``ButtonCallback`` is clicked, receiving
  the configured ``FunctionID`` string so you can dispatch different actions
  via ``if`` or ``switch`` statements.

24.7.4. Event Listeners
***********************

When predefined triggers such as ``Button``, ``ContextMenu``, or
``ButtonCallback`` do not cover your interaction requirements, *x0* lets you
bind native browser DOM events directly to methods on your custom object via
``this.EventListeners``.

The following excerpt from ``sysObjContextMenu.js`` demonstrates how three event
listeners—``click``, ``mouseover``, and ``mouseout``—are registered:

.. code-block:: javascript

   //- add click event listener
   let EventListenerObj = new Object();
   EventListenerObj['Type'] = 'click';
   EventListenerObj['Element'] = ItemObj.EventListenerClick.bind(ItemObj);
   ItemDisplayObj.EventListeners["ItemClick"] = EventListenerObj;

   //- mouseover / mouseout event handler
   let EventMouseOver = new Object();
   EventMouseOver['Type'] = 'mouseover';
   EventMouseOver['Element'] = ItemObj.setHilite.bind(ItemObj);
   ItemDisplayObj.EventListeners["MouseOver"] = EventMouseOver;

   let EventMouseOut = new Object();
   EventMouseOut['Type'] = 'mouseout';
   EventMouseOut['Element'] = ItemObj.removeHilite.bind(ItemObj);
   ItemDisplayObj.EventListeners["MouseOut"] = EventMouseOut;

.. important::

   The *x0* event listener concept enables runtime-based processing of
   nested structures when calling ``sysBaseObject.renderObject()``. Inside
   this method, ``this.processEventListener()`` is executed recursively.

.. important::

   This OOP-based event handling concept reduces complexity in nested abstraction
   models, as demonstrated in the next chapter.

24.7.5. Data Abstraction
************************

Any *x0-object* exposes ``getObjectData()`` and ``setObjectData()`` methods to
provide a standardized interface for reading and writing internal object state.

Currently, this feature is hardcoded on a per-object basis and is not yet
standardized. Therefore, detailed documentation is omitted here until the
generic data model redesign is complete (see :ref:`generic-data-model`).

.. code-block:: javascript

   let RefObj1 = sysFactory.getObjectByID('TestObject1');
   let RefObj2 = sysFactory.getObjectByID('TestObject2');

   RefObj2.setObjectData(RefObj1.getObjectData());

24.7.6. Direct Communication
****************************

When all other mechanisms fail, the implementor can fall back on **direct
communication** as a last resort:

- Get direct object references via ``sysFactory.getObjectByID(ObjectID)``.
- Directly manipulate the object's members or call member functions.

.. code-block:: javascript

   const RefObj1 = sysFactory.getObjectByID('TestObject1');
   const RefObj2 = sysFactory.getObjectByID('TestObject2');

   RefObj2.Member = RefObj1.Member;

24.8. Complex Objects
---------------------

Now that we have covered the most important best practices, this section
demonstrates how to extend ``CustomObj`` from the previous chapters into
multiple interacting classes. At the end of this chapter, we also point to
several built-in example implementations that are worth exploring.

24.8.1. Modified Row Class
**************************

Building on the previous example, this object has been renamed to fit our needs.
It represents a dynamic row component controlled by a container object (discussed
below).

Take a closer look at the modifications we made—most importantly, changing the
``ObjectType``, setting the ``DOMStyle`` CSS class to ``row``, and updating the
naming scheme. A detailed explanation follows after the class definition.

.. code-block:: javascript

   //------------------------------------------------------------------------------
   //- CONSTRUCTOR "sysObjCustomObjRow"
   //------------------------------------------------------------------------------

   function sysObjCustomObjRow(ParentRef, Index)
   {
      this.ObjectType    = 'CustomObjRow';                      //- System Object Type
      this.ObjectID      = ParentRef.ObjectID + 'Row' + Index;  //- Unique ObjectID
      this.DOMStyle      = 'row';                               //- CSS Style
      this.ChildObjects  = new Array();                         //- Child Objects
   }

   //- inherit sysDivUnique
   sysObjCustomObjRow.prototype = new sysObjDivUnique();


   //------------------------------------------------------------------------------
   //- METHOD "init"
   //------------------------------------------------------------------------------

   sysObjCustomObjRow.prototype.init = function()
   {
      //- process initialization
      const Attributes = this.JSONConfig.Attributes;

      //- declaratively define object tree
      let ObjDefs = [
         {
            "id": "CtrCol1",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
               "Style": "col col-md-9"
            },
            "ObjectDefs": [
               {
                  "id": "Col1Value",
                  "SysObject": new sysObjDivValue(),
                  "JSONAttributes": {
                    "Style": "text-primary-emphasis",
                    "Value": Attributes.Value
                  }
               }
            ]
         },
         {
            "id": "CtrCol2",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
               "Style": "col col-md-3"
            },
            "ObjectDefs": [
               {
                  "id": "Btn" + this.ObjectID,
                  "SysObject": new sysObjButton(),
                  "JSONAttributes": {
                     "DOMType": "button",
                     "Style": "btn",
                     "OnClick": "https://backend.com/service.py",
                     "SrcDataObjects": [ "Formlist1", "Formlist2" ]
                  }
               }
            ]
         }
      ];

      //- build object relations
      sysFactory.setupObjectRefsRecursive(ObjDefs, this);
   }

Below is a detailed explanation of what was modified and why:

- In the constructor, the parent object's reference (the row controller) is passed
  and used to build a system-wide unique name. The controller object is
  referenced in ``sysFactory.SetupClasses`` so that it can be used either
  declaratively in ``object.json`` or programmatically by setting a custom ``ObjectID``.
  When instantiating two objects with different names, the naming scheme in the
  subordinate objects must also match, which is guaranteed by using ``ParentRef.ObjectID``.
- ``ParentRef`` must be used in the constructor because the parent object has not
  called ``this.addObject()`` at this point, which would otherwise set
  ``this.ParentObject`` automatically.
- By setting ``this.DOMStyle`` to ``row``, the CSS of ``sysObjCustomObjRow``'s
  inherited root object (``DivUnique``) is set to ``row``, saving one child object's
  declarative configuration.
- Inside the ``ObjDefs`` configuration, the first two objects in the hierarchy,
  ``"CtrCol1"`` and ``"CtrCol2"``, are set to type ``Div``. Why does this work?
  Even though the ``ObjectID``s of ``"CtrCol1"`` and ``"CtrCol2"`` are statically
  set (making those specific object references unresolvable later), the parent
  object's ``ObjectID`` is already system-wide **unique**. Because of their
  ``Div`` type, their resulting DOM ``id``s are calculated using the parent's
  already-unique ``Prefix``, ensuring the layout works as intended.
- **Why use container objects?** Instead of *directly* applying the layout style
  to the button (e.g., ``"Style": "col col-md-3 btn"``), we wrap it in a container.
  Mixing layout and component classes directly on a button breaks Bootstrap's CSS.
  As a rule of thumb, abstracting objects so each has its own logical CSS and
  purpose is good practice.
- The button's object type (``Button``) internally has ``overrideDOMObjectID`` set to
  ``true``, making it mandatory to assign a system-wide unique ``ObjectID``. By
  combining ``"Btn"`` with the already unique row root ID (``"Btn" + this.ObjectID``),
  the button becomes unique and addressable via ``sysFactory.getObjectByID()``.
- Finally, by setting the column value via ``this.JSONConfig.Attributes.Value``,
  we have a ready-to-use row-processing class. It generates a simple two-column row
  consisting of a value in the left column and a button (currently without callback
  functionality) in the right column. How to implement the callback will be covered
  in the next subchapters.

24.8.2. Controller Object
*************************

The controller object is quite simple and requires no declarative object definitions
at all. Take a look—we will also provide a detailed explanation afterward.

.. code-block:: javascript

   //------------------------------------------------------------------------------
   //- CONSTRUCTOR "sysObjCustomObj"
   //------------------------------------------------------------------------------

   function sysObjCustomObj()
   {
      this.ObjectType    = 'CustomObj';           //- System Object Type
      this.DOMStyle      = 'container-fluid';     //- CSS Style
      this.ChildObjects  = new Array();           //- Child Objects
   }

   //- inherit sysDivUnique
   sysObjCustomObj.prototype = new sysObjDivUnique();


   //------------------------------------------------------------------------------
   //- METHOD "init"
   //------------------------------------------------------------------------------

   sysObjCustomObj.prototype.init = function()
   {
      //- process initialization
      const Attributes = this.JSONConfig.Attributes;

      //- get row data array from config
      const RowData = this.JSONConfig.Attributes.RowData;

      //- instantiate row objects
      let i = 0;
      for (const RowValue of RowData) {
         let RowObj = new sysObjCustomObjRow(this, i);

         RowObj.JSONConfig = {
            "Attributes": {
               "Value": RowData[i]
            }
         };

         this.addObject(RowObj);
         i++;
      }
   }

Below is a detailed explanation of how the controller works:

- We do not need to set ``ObjectID`` in the constructor because this is the root
  object registered in ``sysFactory.SetupClasses``. As a result, it is instantiated
  either during *x0-init* or programmatically, where a unique ID is already
  enforced.
- Because its name must be unique, the class inherits from ``DivUnique``.
- ``this.ChildObjects`` holds the child instances; each row object is appended to
  it via ``this.addObject(RowObj)``.
- A ``JSONConfig`` object containing an ``Attributes`` property is dynamically
  constructed and assigned to each row object so it can access its value during
  initialization.
- The display data must be provided as a simple array, such as
  ``[ 'value1', 'value2', 'value3' ]`` in ``JSONConfig.Attributes.RowData``.

The following example demonstrates how to set up and render this object
programmatically:

.. code-block:: javascript

   let ExampleObj = new sysObjCustomObj();
   ExampleObj.ObjectID = 'ExampleCustomObj';

   ExampleObj.JSONConfig = {
      "Attributes": {
          "RowData": [ 'Value1', 'Value2', 'Value3' ]
      }
   };

   ExampleObj.renderObject();

.. important::

   When creating objects dynamically, it is mandatory to call ``renderObject()``
   or ``rerenderObject()`` at the appropriate point in the lifecycle. Based on
   the previous chapters, you should already know when and where to do so.

24.8.3. Dynamic Content
***********************

Building on what you have learned about the *x0-system* design and structure,
combining those concepts with this chapter on dynamic content will enable you to
design sophisticated class abstractions—including event handling and real time
modifiable structures. Afterward, learning how to paginate your custom *x0-objects*
and handle smart data input and output represents the pinnacle of mastering the
framework.

Let's replace the current static ``Button`` implementation with a
``ButtonCallback`` to handle the logic inside a custom class method.

Note that the ``ButtonCallback`` must be instantiated externally—before the
``ObjDefs`` definition—and the callback itself is activated via
``setCallback(this.ParentObject)``. In addition, the ``ObjectID`` of the left
column has been extended to ``this.ObjectID + "Col1Value"`` so that it can be
referenced later via ``sysFactory.getObjectByID()``. Finally, note that the
following snippet is only an excerpt based on the previous example (with the
constructor omitted).

.. code-block:: javascript

   //------------------------------------------------------------------------------
   //- METHOD "init"
   //------------------------------------------------------------------------------

   sysObjCustomObjRow.prototype.init = function()
   {
      //- process initialization
      const Attributes = this.JSONConfig.Attributes;

      //- setup callback button instance
      let CallbackButton = new sysObjButtonCallback();
      CallbackButton.setCallback(this);

      //- declaratively define object tree
      let ObjDefs = [
         {
            "id": "CtrCol1",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
               "Style": "col col-md-9"
            },
            "ObjectDefs": [
               {
                  "id": this.ObjectID + "Col1Value",
                  "SysObject": new sysObjDivValue(),
                  "JSONAttributes": {
                    "Style": "text-primary-emphasis",
                    "Value": Attributes.Value
                  }
               }
            ]
         },
         {
            "id": "CtrCol2",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": {
               "Style": "col col-md-3"
            },
            "ObjectDefs": [
               {
                  "id": "Btn" + this.ObjectID,
                  "SysObject": new sysObjButton(),
                  "JSONAttributes": {
                     "DOMType": "button",
                     "Style": "btn"
                  }
               }
            ]
         }
      ];

      //- build object relations
      sysFactory.setupObjectRefsRecursive(ObjDefs, this);
   }

Note that the callback method name is static, fixed by the system, and always
references ``ButtonCallback()``.

.. code-block:: javascript

   //------------------------------------------------------------------------------
   //- METHOD "init"
   //------------------------------------------------------------------------------

   sysObjCustomObjRow.prototype.ButtonCallback = function()
   {
      const randomAscii = String.fromCharCode(Math.floor(Math.random() * 94) + 33);
      this.DOMValue = randomAscii;
      this.setDOMElementValue();
      this.rerenderObject();
   }

24.8.4. JSON Configuration
**************************

When designing your objects, always keep in mind that they must be populated from
``JSONConfig.Attributes``, which always takes place during *x0-init*. Currently,
it follows a fairly loose approach without strict underlying rules—a concept that
will remain supported and will not be discontinued in upcoming releases. As a result,
implementers have nearly 100% freedom in how they handle internal data manipulation.

However, note that the *x0-system* (currently experimental) already offers smart
methods to manage runtime data more effectively and will be extended with generic
data handling in the future (ODM, Object Document Mapping), which is especially
useful for deeply nested objects (see :ref:`generic-data-model`).

.. important::

   When your custom object acts as a data container for transfers to the backend,
   its corresponding internal ``getObjectData()`` routine **must** properly handle
   and return the correct data (see :ref:`runtime-data-model`).

24.8.5. Referenced Examples
***************************

The following examples provide an **in-depth** look at how the *x0-framework* handles
dynamic content at a **granular level**, allowing you to explore the behavior both
live in the runnable *x0-static* Docker environment and by inspecting the underlying
source code:

- ``/www/sysObjDynRadioList.js``: A dynamic radio button list that can be modified
  at runtime (add/remove), viewable at **"Examples" / "Basic Examples"** menu, under
  the **"Combinded Objects"** tab.
- ``/www/userObjExampleEditableItemContainer.js``: An advanced editable list of
  extended, nested row items, viewable at **"Examples" / "Editable Templates"** menu,
  under the **"Editable Order Remark List"** subsection.

.. important::

   The second ``EditableItemContainer`` example **clearly demonstrates** how to model
   dynamic content **efficiently** using the ``sysFactory.setupObjectRefsRecursive()``
   abstraction mechanism.

.. note::

   These examples also demonstrate how to use the ``ContextMenu`` and ``Button``
   *x0-object* types **together**.

24.9. Realtime Pagination
-------------------------

Thanks to the smart *x0-mirror-dom* realtime object model, even
**runtime-modifiable** objects can be paginated. Specifically, pagination is
not limited to static content such as plain lists—it can be applied to **any**
nested object hierarchy, opening up a completely new approach to broad, dynamic
application design.

Realtime pagination is provided by the ``sysPagination`` class
(``/www/sysRTPagination.js``; see :ref:`oopmodel-classes` for the full method
reference). Because all data is already held in memory on the client side,
switching pages updates the visible child objects immediately without issuing
backend requests, while preserving the live state of objects on hidden pages.

24.9.1. Setup / Configuration
*****************************

In your custom object's constructor, add the following properties:

- Set ``this.PaginationObject = new sysPagination(this)`` to implement pagination logic.
- Set ``this.RowCount = 10`` to configure the number of rows processed per page (set to 10 in this example).

24.9.2. Data Structures
***********************

In addition, your custom object must properly **manage** the ``this.RowItems``
array for pagination to work.

- **Constructor:**

  In the custom class constructor, initialize ``this.RowItems = new Array();``.

- **Use Hierarchical Object Connection:**

  Whenever possible, call ``sysFactory.setupObjectRefsRecursive()`` without passing
  ``this`` as the second parameter. Instead, point it to a dynamically created
  **container object**, as shown in the following code example (taken from
  ``userObjExampleEditableItemContainer.js``), and append (push) each container
  object to ``this.RowItems``.

.. code-block:: javascript

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
         "JSONAttributes": {
            "Style": ""
         },
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
      }
   ];

   sysFactory.setupObjectRefsRecursive(ObjDefs, BaseContainerObj);

   //- push to navigation array
   this.RowItems.push(BaseContainerObj);

- **Manually Add Objects:**

  Manually add objects using ``this.addObject()``, and remember to update
  registered event listeners if your objects use event handling.

.. code-block:: javascript

   for (const RowItem of this.RowItems)
   {
      this.addObject(RowItem);
      RowItem.processEventListener();
   }

- **Refresh Pagination:**

  Finally, remember to refresh the pagination calculation.

.. code-block:: javascript

   this.PaginationObject.update();

24.9.3. Referenced Examples
***************************

The following examples illustrate how pagination works in practice:

- ``/www/sysObjList.js``: Nearly every ``List`` inside the *x0-static* Docker
  environment uses pagination.
- ``/www/userObjExampleEditableItemContainer.js``: An advanced editable list of
  extended, nested row items, accessible via the **"Examples" / "Editable Templates"**
  menu under the **"Editable Order Remark List"** subsection.

24.10. Grid Integration
-----------------------



.. _runtime-data-model:

24.11. Runtime Data Model
-------------------------



24.11.x. Class Members
**********************

24.11.x. getObjectData()
************************

24.11.x. setObjectData()
************************

24.11.x. callbackXMLRPCAsync
****************************

24.12. Class Registration
-------------------------

Once you have built your custom object(s), they still need to be registered so
the *x0-core* system can recognize and instantiate them.

When using the database backend, register them as described in the following
section.

24.12.1. User Registration
**************************

The detailed process of the custom registration process is described here:
:ref:`custom-object-registration`.

24.12.2. sysFactory
*******************

The *x0-static* component does not yet support dynamic custom object
registration. Instead, custom classes must be manually added to
``this.SetupClasses`` inside ``/www/sysFactory.js`` so they can be instantiated
from declarative metadata or used inside other custom objects.

.. important::

   Only modify ``/www/sysFactory.js`` directly when database-backed user
   registration is unavailable (such as in the standalone *x0-static* component.

.. _init-object-loading:

24.12.3. Object Loading
***********************

When registering objects in the database backend, dynamic object loading is
handled automatically. Because the *x0-static* component does not support this
mechanism, implementation files must be added to the loader manually.

- **Static Docker Container:**

For the *x0-static* Docker container, include your class's implementation file
in ``/static/system/index.html`` so it is loaded during *x0-init*:

.. code-block:: html

   <script type="text/javascript" src="/userObjCustomClass.js"></script>

- **System Core Classes:**

If you have developed an internal *x0-core* class, register its script tag in
``/python/Index.py`` as follows:

.. code-block:: html

   <script type="text/javascript" src="/sysObjInternalClass.js"></script>

.. warning::

   Pay close attention to the exact position where you add your entry. If done
   incorrectly, dependent classes will not work.

24.13. Object Instantiation
---------------------------

The *x0-system* currently supports instantiating objects during the *x0-init*
phase. This is limited to statically defined, declarative configuration. After
an object has  been initialized, rendered, and modified—often with extensive user
input data,  particularly in nested structures—the system is currently unable to
clone  the object into a new instance containing those exact modifications.

Nevertheless, the *x0-system* can instantiate complex, nested objects during
the *x0-init* phase. Object cloning remains a highly desirable capability for
enhanced, data-centric browser applications. This mechanism is currently in
development, though it requires a fundamental redesign of the base system
(see the next chapter).

.. note::

   This feature is planned for *x0* version 1.2, at which point the developer
   documentation will also include precise implementation instructions.

.. _generic-data-model:

24.14. Generic Data Model
-------------------------

The object instantiation process described in the previous chapter requires a
clean **document relation layer**. While this is partially prepared in *x0*
version 1.1, the current implementation lacks a truly generic design. Furthermore,
the integration process relies on modifications across multiple subsystems and
related layers before it can run smoothly and in a completely generic manner.

Specifically, the **document relation layer** refers to the *x0-mirror-dom*,
in particular to how **nested** data structures are defined. When combining or
chaining *x0-objects* together, it is critical not only to **set** nested data,
but also to **get** data in a generic internal format. The ideal goal is to get
or set data from any sub-object anywhere within the *x0-object-graph*.

This generic data model follows a well-established design pattern—**Object-Document
Mapping** (``ODM``)—which maps a class hierarchy to data from existing, nested,
declarative JSON **documents**. Following this exact concept, the *x0* system in
version 1.2 will map existing JSON data generically **into** an *x0-object*
hierarchy and, conversely, **get** recursive data from *x0-objects* as JSON for
direct data exchange with modern NoSQL databases.

Currently, the *x0* data model is hardcoded for each individual object. While
this approach works functionally, it results in code bloat and unnecessary
complexity. Furthermore, leaving this architecture as is will drastically hinder
the future scaling of the *x0-system*.

.. note::

   As with object cloning, *x0* version 1.2 will also include precise
   implementation instructions for this feature.

.. note::

   Porting the SQL-based backend to a MongoDB backend is also planned in an
   upcoming release to store the system's configuration for multi-vhost setups.
