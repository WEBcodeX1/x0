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

The first and most important difference compared to other frameworks is that all related content
and objects are rendered 100% inside the *x0-core* engine, which runs exclusively in the
**browser's** JavaScript engine and **nowhere else** (100% serverless).

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

So when the *x0-init* process instantiates each object defined inside ``object.json`` and
its object relation ``skeleton.json``; a very rudimentary description: it takes the objects
``Attributes``, instaniates the *x0-object* by its ``Type`` and set the ``JSONConfig.Attributes``
property in the new created object instance. Afterwards the instance ``init()`` method is
getting executed.

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

When instantiating objects programmatically without running through the declarative *x0-init*
pipeline, the implementor must perform these exact setup steps **manually** inside the custom
object:

- assigning the object's ``JSONConfig.Attributes`` metadata
- setting the object's ``ObjectID`` property
- calling the object's ``init()`` method
- optionally setting the ``overrideDOMObjectID`` property
- connecting the object to its parent via ``this.addObject(ObjectRef)`` (which also sets ``ParentObject`` automatically)

.. code-block:: javascript

   let BtnClose = new sysObjDiv();

   BtnClose.ObjectID = 'ExampleButton';

   BtnClose.DOMAttributes = new Object();
   BtnClose.DOMAttributes['type'] = 'button';
   BtnClose.DOMAttributes['title'] = sysFactory.getText('TXT.SYS.TITLE_CLOSE');

   BtnClose.JSONConfig = {
      "Attributes":
      {
         "DOMType": "button",
         "Style": "btn btn-close"
      }
   };

   BtnClose.init();

   this.addObject(BtnClose);

24.5. Custom Class Derivation
-----------------------------

Now that we have covered the basic concepts, you as a developer are ready to explore what your
first custom *x0-object*'s base structure must look like and how its parts fit together.

Before proceeding, verify that you have a solid understanding of the following concepts—continuing
without them is not advisable:

- **Inheritance & Relationships:** The derivation and relationship between ``sysBaseDOMElement``
  and ``sysBaseObject``.
- **Core Rendering Methods:** Familiarity with the existence of ``sysBaseObject.renderObject()``
  and ``sysBaseObject.rerenderObject()``. A **deep** understanding is not required yet, as this
  will be covered in detail later.
- **Basic Object Structure:** An understanding of what a simple object's representation class
  looks like, such as ``Div`` in ``/www/sysObjDiv.js``.
- **Object Interconnection:** How objects are connected using ``this.addObject(Object)``. Note that
  for large sets of objects, this approach is overkill, and you will learn much more efficient
  methods later.
- **Declarative Configuration Model:** How object instances use data from statically declared
  configurations via ``JSONConfig.Attributes``, and how those settings are accessed or modified
  programmatically within the class.

24.5.1. Base Inheritance
************************

To summarize the base class inheritance hierarchy:
``sysBaseDOMElement`` is the root base class, which is inherited by ``sysBaseObject``.
``sysBaseDOMElement`` is responsible for direct DOM manipulation, while ``sysBaseObject`` handles
interconnecting objects and provides all required methods for child classes used by the system.

To establish interconnections between objects, ``sysBaseObject`` manages the ``ChildObjects``
array, which contains child object instance references (also deriving from ``sysBaseObject``).
Crucially for your further understanding, every single object in the entire system derives
(or rather, **must** derive) from ``sysBaseObject`` or one of the system's intermediate classes
(which also inherit from ``sysBaseObject`` in the inheritance chain).

24.5.2. Object Examples
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

As you can see,

.. _dev-object-nesting:

24.6. Object Nesting
--------------------

24.6.1. Direct Referencing
**************************

24.6.2. Hierarchical Setup
**************************

24.x. Generic Data Model
------------------------

24.x. Realtime Pagination
-------------------------
