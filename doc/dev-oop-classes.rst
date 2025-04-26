.. dev-oop-classes

.. _devoopmodel-classes:

22. Class Reference
===================

22.1. sysBaseObject.addObject
-----------------------------

The sysBaseObject.addObject() method is responsible for adding a child object to the ChildObjects array of a sysBaseObject instance. It also establishes the parent-child relationship by setting the ParentObject property of the child object. Below is a detailed explanation:
Implementation
JavaScript

sysBaseObject.prototype.addObject = function(ChildObject) {
    ChildObject.ParentObject = this; // Set the ParentObject reference
    this.ChildObjects.push(ChildObject); // Add the child object to the ChildObjects array
};

Key Features

    Parent-Child Relationship:
        The method ensures that the ChildObject has a reference to its parent object via the ParentObject property.

    Dynamic Hierarchy:
        By pushing the ChildObject into the ChildObjects array, this method allows the creation of dynamic, hierarchical structures within the x0-framework.

    Recursiveness:
        Since ChildObject can itself be an instance of sysBaseObject or its derived classes, the method supports recursive structures (e.g., trees or nested components).

    Usage:
        The method is used to organize objects in a parent-child relationship, making it easier to manage and traverse object hierarchies.

Example Usage
JavaScript

const parentObject = new sysBaseObject();
const childObject = new sysBaseObject();

parentObject.addObject(childObject);

console.log(parentObject.ChildObjects); // Outputs: [childObject]
console.log(childObject.ParentObject);  // Outputs: parentObject

Use Cases

    Building hierarchical UI components or layouts.
    Managing nested data structures in an application.
    Creating parent-child relationships between objects dynamically.

This method is a fundamental part of the sysBaseObject class, enabling the x0-framework to handle complex object relationships with ease.

22.2. sysBaseObject.renderObject
--------------------------------

The sysBaseObject.renderObject() method is responsible for rendering a sysBaseObject instance and its child objects into the Document Object Model (DOM). Below is a detailed description of its functionality:
Method Implementation
JavaScript

sysBaseObject.prototype.renderObject = function(Prefix) {
    // Determine or generate the DOM Object ID
    const setObjectID = (this.ObjectShortID !== undefined) ? this.ObjectShortID : this.ObjectID;
    this.DOMParentID = Prefix;

    if (this.overrideDOMObjectID !== true) {
        this.DOMObjectID = (Prefix == null) ? setObjectID : Prefix + '_' + setObjectID;
    } else {
        this.DOMObjectID = this.ObjectID;
    }

    // Render only if the DOM object does not exist
    if (this.checkDOMElementExists(this.DOMObjectID) == false) {
        this.createDOMElement(this.DOMObjectID);
        this.appendDOMParentElement();

        this.setDOMAttributes();
        this.setDOMElementValue();
        this.setDOMElementStyle();
        this.setDOMElementStyleAttributes();
        this.setDOMVisibleState();
        this.processEventListener();
    }

    // Render all child objects recursively
    for (const ChildItem of this.ChildObjects) {
        ChildItem.renderObject(this.DOMObjectID);
    }
};

Key Features

    DOM Object ID Generation:
        The method generates a unique DOMObjectID for the object based on its ObjectID and an optional Prefix.
        If overrideDOMObjectID is true, the ObjectID is used directly as the DOMObjectID.

    Conditional Rendering:
        Ensures that the object is rendered only if its corresponding DOM element does not already exist.

    DOM Element Creation and Configuration:
        Creates the required DOM element using createDOMElement() and appends it to the parent DOM element through appendDOMParentElement().
        Configures the DOM element by setting attributes, values, styles, and visibility using various helper methods:
            setDOMAttributes()
            setDOMElementValue()
            setDOMElementStyle()
            setDOMElementStyleAttributes()
            setDOMVisibleState()

    Event Listener Processing:
        Attaches event listeners to the DOM element using processEventListener().

    Recursive Rendering:
        Iterates over the ChildObjects array and invokes renderObject() on each child, propagating the rendering process recursively.

Use Cases

    Dynamically rendering UI components and their nested child elements into the browser's DOM.
    Managing hierarchical structures where parent and child relationships need to be reflected in the DOM.

Example Usage
JavaScript

const parentObject = new sysBaseObject();
const childObject = new sysBaseObject();

parentObject.addObject(childObject);
parentObject.renderObject('parentDOM');

In this example, the parentObject and its childObject will be rendered into the DOM under the element with ID parentDOM.
Conclusion

The renderObject() method is a fundamental part of the sysBaseObject class, enabling dynamic and recursive rendering of object hierarchies in the x0-framework. It ensures efficient DOM manipulation and encapsulates all rendering logic for both parent and child objects.

22.3. sysBaseObject.remove
--------------------------

22.4. sysBaseObject.removeParent
--------------------------------

22.1.1. Purpose
***************

The removeParent() method is used to remove an object's parent relationship and its
associated DOM elements. This ensures that the object is detached from its parent both
logically (in the object hierarchy) and visually (in the DOM).

22.1.2. Method Signature
************************

.. code-block:: javascript

    sysBaseObject.prototype.removeParent = function()

22.1.3. How It Works
********************

    * DOM Element Removal:
        Checks if the DOM element associated with the object exists.
        If it exists, the DOM parent element is removed using removeDOMParentElement().

    * Child Objects Reset:
        Deletes the ChildObjects array to ensure all child references are cleared.
        Resets ChildObjects to an empty array to maintain consistency.

    * Error Handling:
        Catches and logs any errors that occur during the removal process.

22.1.4. Usage Example
*********************

Suppose you have a hierarchical structure of objects (e.g., a parent object with multiple children).
If you need to remove a parent object along with its DOM representation, you can call the removeParent() method.

.. code-block:: javascript

    // Example: Removing a parent object from the hierarchy
    const parentObject = sysFactory.getObjectByID('parent-id');
    parentObject.removeParent();

22.1.5. Code Walkthrough
************************

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

22.1.6. Key Points
******************

    1. DOM Management:
        Ensures that any associated DOM elements are properly removed to avoid memory leaks.

    2. Child Object Cleanup:
        Clears references to child objects to maintain a clean state.

    3. Error Resilience:
        Handles potential errors gracefully, ensuring that the application remains stable.

22.1.7. When to Use
*******************

    - Use removeParent() when you need to:
        Detach an object and its associated DOM element from the object hierarchy.
        Clean up resources associated with an object.

22.x. sysFactory.setupObjectRefsRecursive
-----------------------------------------

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






















