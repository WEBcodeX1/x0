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
------------------------------------------------

