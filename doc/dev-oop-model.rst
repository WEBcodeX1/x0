.. dev-oop-model

.. _devoopmodel:

17. OOP Model
=============

The Object-Oriented Programming (OOP) model section is structured into the
following components:

- Base OOP Inheritance Model
- Complete *x0-system* Class Reference

.. _devoopmodel_base:

17.1. Base OOP Inheritance Model
--------------------------------

This documentation section outlines the inheritance and interaction model between
the foundational components of the x0 JavaScript framework: `sysBaseObject`, `sysFactory`,
and `sysReactor`. These components enable object-oriented design, event management,
and object instantiation across the framework.

17.1.1. Core Base Object
************************

Defined in `sysBaseObject.js`.

- Purpose

`sysBaseObject` serves as the foundational class for all objects in the x0 framework.
It provides core functionalities like DOM manipulation, child-parent relationships,
and object lifecycle management.

- Key Features

    1. Inheritance:
        * Inherits from sysBaseDOMElement to provide DOM-related functionality.
    2. Child-Parent Relationships:
        * Supports hierarchical object structures with methods to add, render, and manage child objects.
    3. Lifecycle Management:
        * Methods for initialization, rendering, event processing, and removal of objects.

- Core Methods

    - addObject(ChildObject): Adds a child object to the ChildObjects array and establishes a parent-child relationship.
    - renderObject(Prefix): Renders the object and its children recursively by creating and appending DOM elements.
    - processEventListener(): Sets up event listeners for the object and its children.
    - connectServiceConnectorObjects(): Establishes connections for objects of type ServiceConnector.
    - getObjectByID(ObjectID): Searches for and returns an object by its ObjectID.
    - remove(): Removes the object from its parent's child list and deletes its DOM element.
    - removeParent(): see x.x.x

17.1.2. Object Factory
**********************

Defined in `sysFactory.js`.

- Purpose

`sysFactory` acts as the central factory for creating, managing, and interacting
with *x0-system-objects*. It provides utility methods for object instantiation,
screen management, and event handling.

- Key Features

    1. Object Instantiation:
        * Creates and initializes objects based on predefined configurations.
    2. Screen Management:
        * Manages multiple screens within the application.
    3. Utility Methods:
        * Provides methods for fetching objects by ID, attribute, or type.

- Core Methods

    - setupObjectRefsRecursive(ObjDefs, RefObj): Recursively sets up objects and their relationships based on hierarchical definitions.
    - addScreen(ScreenID, SkeletonData): Creates a new screen object and adds it to the factory's screen registry.
    - getObjectByID(ObjectID): Retrieves an object by its ObjectID.
    - switchScreen(ScreenID): Activates a specific screen and deactivates all others.

17.1.3. Event Reactor
*********************

Defined in `sysReactor.js`.

- Purpose

sysReactor is responsible for managing and dispatching events within the system.
It allows objects to register and respond to events dynamically.

- Key Features

    1. Event Registration:
       * Allows objects to register events with specific attributes and types.
    2. Event Dispatching:
       * Dispatches events to the appropriate objects based on event IDs.
    3. Dynamic Interaction:
       * Supports various event types, including ServiceConnector and custom types.

- Core Methods

    - registerEvent(Attributes, ProcessObject, Type): Registers an event with the reactor by associating it with an object and attributes.
    - dispatchEvent(EventID): Dispatches an event to its associated object and processes it based on its type.
    - fireEvents(FireEvents): Fires a list of events by dispatching them sequentially.

- Relationships and Interactions

    1. Objects and Factory:
        Objects (sysBaseObject instances) are created and initialized using sysFactory.setupObjectRefsRecursive.
        The factory manages object hierarchies and facilitates inter-object communication.

    2. Objects and Reactor:
        Objects register events with the sysReactor and respond to dispatched events.
        The reactor interacts with various object types, including ServiceConnector for backend service calls.

    3. Event Flow:
        Events are registered with the reactor using registerEvent.
        When an event is triggered, dispatchEvent identifies the target object and invokes the appropriate handler.

- Example Workflow

Scenario: Creating and Managing a Screen with Dynamic Objects

    1. Factory Initialization:
        Use sysFactory.addScreen to create a new screen and add it to the factory.

    2. Object Setup:
        Define object hierarchies using ObjDefs and pass them to sysFactory.setupObjectRefsRecursive.

    3. Event Registration:
        Register events for objects using sysReactor.registerEvent.

    4. Event Dispatching:
        Trigger events using sysReactor.dispatchEvent, which invokes the respective handlers.

- Conclusion

The x0 framework's base OOP inheritance model, with `sysBaseObject`, `sysFactory`,
and `sysReactor`, provides a robust foundation for building dynamic, event-driven
applications. By leveraging these components, developers can create modular,
maintainable, and scalable systems.

17.2. Class Reference
---------------------

17.2.1. sysBaseObject.removeParent
**********************************

- Purpose

The removeParent() method is used to remove an object's parent relationship and its
associated DOM elements. This ensures that the object is detached from its parent both
logically (in the object hierarchy) and visually (in the DOM).

- Method Signature

.. code-block:: javascript

    sysBaseObject.prototype.removeParent = function()

- How It Works

    * DOM Element Removal:
        Checks if the DOM element associated with the object exists.
        If it exists, the DOM parent element is removed using removeDOMParentElement().

    * Child Objects Reset:
        Deletes the ChildObjects array to ensure all child references are cleared.
        Resets ChildObjects to an empty array to maintain consistency.

    * Error Handling:
        Catches and logs any errors that occur during the removal process.

- Usage Example

Suppose you have a hierarchical structure of objects (e.g., a parent object with multiple children).
If you need to remove a parent object along with its DOM representation, you can call the removeParent() method.

.. code-block:: javascript

    // Example: Removing a parent object from the hierarchy
    const parentObject = sysFactory.getObjectByID('parent-id');
    parentObject.removeParent();

- Code Walkthrough

.. code-block:: javascript

    sysBaseObject.prototype.removeParent = function() {
        try {
            // Check if the DOM element for this object exists
            if (this.checkDOMElementExists(this.DOMObjectID)) {
                // Remove the parent DOM element
                this.removeDOMParentElement();
            }

            // Clear child objects
            delete this.ChildObjects;
            this.ChildObjects = new Array();
        } catch (err) {
            // Log any errors that occur during the removal process
            console.log('::removeParent ObjectID:%s error:%s', this.ObjectID, err);
        }
    };

- Key Points

    1. DOM Management:
        Ensures that any associated DOM elements are properly removed to avoid memory leaks.

    2. Child Object Cleanup:
        Clears references to child objects to maintain a clean state.

    3. Error Resilience:
        Handles potential errors gracefully, ensuring that the application remains stable.

- When to Use

    - Use removeParent() when you need to:
        Detach an object and its associated DOM element from the object hierarchy.
        Clean up resources associated with an object.

17.2.x.sysFactory.setupObjectRefsRecursive
******************************************

The sysFactory.setupObjectRefsRecursive function is a utility method in the x0 framework designed to create and configure hierarchical object structures. It recursively processes object definitions, initializes objects, and establishes parent-child relationships.

- Purpose

The purpose of setupObjectRefsRecursive is to:

    * Dynamically create and initialize objects based on a predefined hierarchy (ObjDefs).
    * Assign configuration attributes to each object.
    * Establish parent-child relationships between objects.
    * Allow nested objects to be recursively processed and added to their respective parents.

- Function Signature

.. code-block:: javascript

    sysFactory.prototype.setupObjectRefsRecursive = function(ObjDefs, RefObj)

- Parameters:

    - ObjDefs:
        An array of object definitions, where each definition specifies the id, SysObject, JSONAttributes, and optionally nested ObjectDefs.

    - RefObj:
        The parent object to which the processed objects will be added as children.

- Example:

.. code-block:: javascript

    [
        {
            "id": "parent-object",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": { "Style": "container" },
            "ObjectDefs": [
                {
                    "id": "child-object",
                    "SysObject": new sysObjButton(),
                    "JSONAttributes": { "Style": "btn btn-primary" }
                }
            ]
        }
    ]

- How It Works

    1. Iterate Through ObjDefs:
        The function loops through each object definition in the ObjDefs array.

    2. Initialize Objects:
        For each object:
            The specified SysObject is initialized.
            The ObjectID is assigned from the id field in the object definition.
            Configuration attributes (JSONAttributes) are added to the object's JSONConfig.

    3. Call init Method:
        Attempts to call the init method on the object to perform any additional setup.

    4. Add to Parent:
        The initialized object is added to the parent (or reference) object (RefObj) using the addObject method.

    5. Process Nested Objects:
        If the current object contains additional nested objects (ObjectDefs), the function recursively calls itself, passing the nested definitions and the current object as the new parent.

- Code Walkthrough

.. code-block:: javascript

    sysFactory.prototype.setupObjectRefsRecursive = function(ObjDefs, RefObj) {
        for (const ObjItem of ObjDefs) {
            // Get the SysObject and configure it
            CurrentObject = ObjItem['SysObject'];
            CurrentObject.ObjectID = ObjItem['id'];
            CurrentObject.JSONConfig = { "Attributes": ObjItem['JSONAttributes'] };

            // Initialize the object
            try {
                CurrentObject.init();
            } catch (err) {
                console.debug("Error initializing object:", err);
            }

            // Add the object to the parent (reference) object
            RefObj.addObject(ObjItem['SysObject']);

            // Recursively process nested objects
            if (ObjItem['ObjectDefs'] !== undefined) {
                sysFactory.setupObjectRefsRecursive(ObjItem['ObjectDefs'], ObjItem['SysObject']);
            }
        }
    }

- Example Usage

    Scenario:
    You want to create a parent container with a button and a nested text field.

- Object Definitions:

.. code-block:: javascript

    const ObjDefs = [
        {
            "id": "container",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": { "Style": "container-fluid" },
            "ObjectDefs": [
                {
                    "id": "button",
                    "SysObject": new sysObjButton(),
                    "JSONAttributes": {
                        "Style": "btn btn-primary",
                        "TextID": "TXT.BUTTON.SUBMIT"
                    }
                },
                {
                    "id": "text-field",
                    "SysObject": new sysFormfieldItemText(),
                    "JSONAttributes": {
                        "Style": "form-control",
                        "Type": "text"
                    }
                }
            ]
        }
    ];

#TODO: add ref to x0-porting

- Call the Method:

.. code-block:: javascript

    const ParentObject = new sysObjDiv(); // Assume this is the parent object
    sysFactory.setupObjectRefsRecursive(ObjDefs, ParentObject);

- Result:

    A container (sysObjDiv) is created with a button (sysObjButton) and a text field (sysFormfieldItemText) nested inside it.
    Each object is initialized, configured, and added to its parent.

- Key Features

    1. Recursive Object Setup:
        Automatically handles deeply nested object hierarchies.
        No need for manual setup of parent-child relationships.

    2. Dynamic Initialization:
        Calls the init method on each object, enabling custom initialization logic.

    3. Flexible Configuration:
        Supports passing attributes (JSONAttributes) as configuration for each object.

    4. Error Handling:
        Catches initialization errors without disrupting the overall process.

- Important Notes

    * Object Definitions:
        Ensure that each object definition specifies the correct SysObject type and necessary attributes.

    * Initialization:
        Custom initialization logic for each object should be implemented in its init method.

    * Parent-Child Relationship:
        The method relies on the addObject function to establish the parent-child hierarchy. Ensure this function is implemented in the objects.

    * Performance:
        For deeply nested hierarchies, the recursive nature of the function may impact performance. Optimize object definitions to minimize unnecessary nesting.

- Conclusion

The setupObjectRefsRecursive method is a powerful utility for dynamically creating and configuring hierarchical object structures in the x0 framework. By leveraging this method, developers can efficiently build complex UI components with minimal manual effort.
