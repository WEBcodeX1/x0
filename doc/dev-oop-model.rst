.. dev-oop-model

.. _devoopmodel:

21. OOP Model
=============

.. _devoopmodel_base:

21.1. Base OOP Inheritance Model
--------------------------------

This documentation section outlines the inheritance and interaction model between
the foundational components of the x0 JavaScript framework: `sysBaseObject`, `sysFactory`,
and `sysReactor`. These components enable object-oriented design, event management,
and object instantiation across the framework.

21.2. Core Base Object
----------------------

Defined in `sysBaseObject.js`.

21.2.1. Purpose
***************

`sysBaseObject` serves as the foundational class for all objects in the x0 framework.
It provides core functionalities like DOM manipulation, child-parent relationships,
and object lifecycle management.

21.2.1. Key Features
********************

    1. Inheritance:
        * Inherits from sysBaseDOMElement to provide DOM-related functionality.
    2. Child-Parent Relationships:
        * Supports hierarchical object structures with methods to add, render, and manage child objects.
    3. Lifecycle Management:
        * Methods for initialization, rendering, event processing, and removal of objects.

21.2.1. Core Methods
********************

    - addObject(ChildObject):
        * Adds a child object to the ChildObjects array and establishes a parent-child relationship.
    - renderObject(Prefix):
        * Renders the object and its children recursively by creating and appending DOM elements.
    - processEventListener():
        * Sets up event listeners for the object and its children.
    - connectServiceConnectorObjects():
        * Establishes connections for objects of type ServiceConnector.
    - getObjectByID(ObjectID):
        * Searches for and returns an object by its ObjectID.
    - remove():
        * Removes the object from its parent's child list and deletes its DOM element.
    - removeParent():
        * See: :ref:``

21.3. Object Factory
--------------------

Defined in `sysFactory.js`.

21.3.1. Purpose
***************

`sysFactory` acts as the central factory for creating, managing, and interacting
with *x0-system-objects*. It provides utility methods for object instantiation,
screen management, and event handling.

21.3.2. Key Features
********************

    1. Object Instantiation:
        * Creates and initializes objects based on predefined configurations.
    2. Screen Management:
        * Manages multiple screens within the application.
    3. Utility Methods:
        * Provides methods for fetching objects by ID, attribute, or type.

21.3.3. Core Methods
********************

    - setupObjectRefsRecursive(ObjDefs, RefObj):
        * Recursively sets up objects and their relationships based on hierarchical definitions.
    - addScreen(ScreenID, SkeletonData):
        * Creates a new screen object and adds it to the factory's screen registry.
    - getObjectByID(ObjectID):
        * Retrieves an object by its ObjectID.
    - switchScreen(ScreenID):
        * Activates a specific screen and deactivates all others.

21.4. Event Reactor
-------------------

Defined in `sysReactor.js`.

21.4.1. Purpose
***************

sysReactor is responsible for managing and dispatching events within the system.
It allows objects to register and respond to events dynamically.

21.4.2. Key Features
********************

    1. Event Registration:
        * Allows objects to register events with specific attributes and types.
    2. Event Dispatching:
        * Dispatches events to the appropriate objects based on event IDs.
    3. Dynamic Interaction:
        * Supports various event types, including ServiceConnector and custom types.

21.4.3. Core Methods
********************

    - registerEvent(Attributes, ProcessObject, Type):
        * Registers an event with the reactor by associating it with an object and attributes.
    - dispatchEvent(EventID):
        * Dispatches an event to its associated object and processes it based on its type.
    - fireEvents(FireEvents):
        * Fires a list of events by dispatching them sequentially.

21.4.4. Relationships and Interactions
**************************************

    1. Objects and Factory:
        Objects (sysBaseObject instances) are created and initialized using sysFactory.setupObjectRefsRecursive.
        The factory manages object hierarchies and facilitates inter-object communication.

    2. Objects and Reactor:
        Objects register events with the sysReactor and respond to dispatched events.
        The reactor interacts with various object types, including ServiceConnector for backend service calls.

    3. Event Flow:
        Events are registered with the reactor using registerEvent.
        When an event is triggered, dispatchEvent identifies the target object and invokes the appropriate handler.

21.4.5. Example Workflow
************************

Scenario: Creating and Managing a Screen with Dynamic Objects

    1. Factory Initialization:
        Use sysFactory.addScreen to create a new screen and add it to the factory.

    2. Object Setup:
        Define object hierarchies using ObjDefs and pass them to sysFactory.setupObjectRefsRecursive.

    3. Event Registration:
        Register events for objects using sysReactor.registerEvent.

    4. Event Dispatching:
        Trigger events using sysReactor.dispatchEvent, which invokes the respective handlers.

21.4.6. Conclusion
******************

The x0 framework's base OOP inheritance model, with `sysBaseObject`, `sysFactory`,
and `sysReactor`, provides a robust foundation for building dynamic, event-driven
applications. By leveraging these components, developers can create modular,
maintainable, and scalable systems.
