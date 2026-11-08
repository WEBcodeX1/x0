.. dev-best-practices

.. _devbestpractices:

29. Development Best Practices
==============================

This chapter establishes the *core architectural* **standards**, object-construction patterns,
and runtime-update strategies required to develop robust custom *x0-system-objects* within the
framework ecosystem.

29.1. Architectural Foundations
-------------------------------

The implementation of a custom, deterministic *x0-object* requires strict adherence to the framework's
core structural constraints. The following core principles must be thoroughly understood before a
developer attempts to construct **custom objects** or **modular extensions**.

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

29.2. Understanding the Core Concept
------------------------------------

Before continuing, a system developer **must** be familiar with the *x0-core-concept*—especially
how things work compared to other systems, and how they do not.

The first and most important difference compared to other frameworks is that all related content
and objects are rendered 100% inside the *x0-core* engine, which runs exclusively in the
**browser's** JavaScript engine and **nowhere else** (100% serverless).

Many other frameworks rely on heavy, multi-layer frontend-backend communication combined with
server-side string template replacements (a programming paradigm from the 19th century).
The *x0-core* does not use *string parameter replacements* **at all**. Instead, it follows purely
modern, object-oriented (OOP) patterns. While this approach may initially look like "more work"
during application design, combining smart *x0-building-blocks* ultimately produces far more
sophisticated, nested structures **and** a much cleaner, spaghetti-free codebase built for
long-term enterprise maintainability.

29.2.1. Shadow DOM
******************

The developer must be thoroughly familiar with—and 100% understand—what the *x0-shadow-dom*
is responsible for and how it is structured.

The Shadow DOM creates a 1:1 mapping between object instances and DOM object layers across an
*x0-object-instance* hierarchy (also described in the OOP model documentation; see
:ref:`devoopmodel`), which allows structured data storage and programmatic object manipulation
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

29.2.2. Declarative OOP Model
*****************************

In combination with the *x0-shadow-dom*, the declarative OOP model (for a single object instance
or multiple instances) integrates the metadata already declared in ``object.json`` **directly**
(also zero-copy) into an object instance's configuration space (``JSONConfig.Attributes``).

Furthermore, this declarative model is not limited to *x0-init*. Its generic design also makes
it usable for the programmatic approach (especially for **runtime** requirements) covered in this
best-practices guide. On top of that, this enables **multi-dimensional**, **runtime** JSON ODM
(Object Document Mapping) of declarative configurations into complex, nested object
hierarchies—a primary *x0* feature also covered later in this best-practices guide.

29.3. Custom Class Derivation
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

29.3.1. Base Class Inheritance
******************************

29.4. Object Chaining Rules
---------------------------
