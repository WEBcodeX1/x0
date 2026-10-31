.. dev-oop-classes

.. _devoopmodel-classes:

24. Class Reference
===================

This section provides a comprehensive reference for all JavaScript classes
in the *x0-framework*. Each class is documented with its constructor,
properties, methods, and inheritance relationships, reflecting the current
state of the engine source tree under ``www/``.

24.1. Core Framework Classes
----------------------------

This section contains the most important and fundamental classes of the x0-framework.
These classes provide essential functionality that forms the backbone of the entire system.

.. _devoopmodel-classes-baseobj-addobject:

24.1.1. sysBaseObject.addObject
*******************************

The ``sysBaseObject.addObject()`` method is responsible for adding a child object to the
``ChildObjects`` array of a ``sysBaseObject`` instance. It also establishes the parent-child
relationship by setting the ``ParentObject`` property of the child object.

This method is a fundamental part of the ``sysBaseObject`` class, enabling the *x0-framework*
to handle complex object relationships with ease.

24.1.1.1. Implementation
########################

.. code-block:: javascript

    sysBaseObject.prototype.addObject = function(ChildObject)
    {
        ChildObject.ParentObject = this;
        this.ChildObjects.push(ChildObject);
    }

24.1.1.2. Key Features
######################

    1. Parent-Child Relationship:
        The method ensures that the ChildObject has a reference to its parent object via the ParentObject property.

    2. Dynamic Hierarchy:
        By pushing the ChildObject into the ChildObjects array, this method allows the creation of dynamic, hierarchical structures within the x0-framework.

    3. Recursiveness:
        Since ChildObject can itself be an instance of sysBaseObject or its derived classes, the method supports recursive structures (e.g., trees or nested components).

    4. Usage:
        The method is used to organize objects in a parent-child relationship, making it easier to manage and traverse object hierarchies.

24.1.1.3. Example Usage
#######################

.. code-block:: javascript

    const parentObject = new sysBaseObject();
    const childObject = new sysBaseObject();

    parentObject.addObject(childObject);

    console.log(parentObject.ChildObjects); // Outputs: [childObject]
    console.log(childObject.ParentObject);  // Outputs: parentObject

24.1.1.4. Use Cases
###################

    - Building hierarchical UI components or layouts.
    - Managing nested data structures in an application.
    - Creating parent-child relationships between objects dynamically.

24.1.2. sysBaseObject.renderObject / rerenderObject
***************************************************

The ``sysBaseObject.renderObject()`` method is responsible for rendering a sysBaseObject
instance and its child objects into the Document Object Model (DOM). ``rerenderObject()``
is a thin convenience wrapper that removes the existing DOM subtree and renders it again,
useful after large data-driven layout changes.

24.1.2.1. Method Implementation
###############################

.. code-block:: javascript

    sysBaseObject.prototype.renderObject = function(Prefix)
    {
        this.DOMParentID = Prefix;

        if (this.overrideDOMObjectID !== true) {
            if (Prefix == null) {
                this.DOMObjectID = this.ObjectID;
            }
            else {
                this.DOMObjectID = Prefix + '_' + this.ObjectID;
            }
        }
        else if (this.overrideDOMObjectID === true) {
            this.DOMObjectID = this.ObjectID;
        }

        //- only render if dom object does not exist
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

        for (const ChildItem of this.ChildObjects) {
            ChildItem.renderObject(this.DOMObjectID);
        }
    }


    sysBaseObject.prototype.rerenderObject = function()
    {
        this.removeDOMParentElement();
        this.renderObject(this.DOMParentID);
        this.processReset();
    }

24.1.2.2. Key Features
######################

    1. DOM Object ID Generation:
        The method generates a unique ``DOMObjectID`` for the object by concatenating the
        optional recursive ``Prefix`` with the object's own ``ObjectID``. When
        ``overrideDOMObjectID`` is ``true`` (used by objects that must keep a stable,
        non-prefixed DOM id, e.g. ``sysObjButtonCallback`` or ``sysObjDivUnique``), the
        ``ObjectID`` is used directly as the ``DOMObjectID``.
        The ``Prefix`` argument is only ever supplied internally during recursion and
        should not be passed on the initial, outside call.

    2. Conditional Rendering:
        Ensures that the object is rendered only if its corresponding DOM element does not already exist.

    3. DOM Element Creation and Configuration:
        - Creates the required DOM element using ``createDOMElement()`` and appends it to the parent DOM element through ``appendDOMParentElement()``.
        - Configures the DOM element by setting attributes, values, styles, and visibility using various helper methods:
            * setDOMAttributes()
            * setDOMElementValue()
            * setDOMElementStyle()
            * setDOMElementStyleAttributes()
            * setDOMVisibleState()

    4. Event Listener Processing:
        Attaches event listeners to the DOM element using processEventListener().

    5. Recursive Rendering:
        Iterates over the ChildObjects array and invokes renderObject() on each child, propagating the rendering process recursively.

    6. rerenderObject():
        Removes the current DOM subtree (``removeDOMParentElement()``), calls ``renderObject()``
        again using the previously stored ``DOMParentID``, and finally runs ``processReset()``
        recursively across the freshly rendered subtree.

24.1.2.3. Use Cases
###################

    Dynamically rendering UI components and their nested child elements into the browser's DOM.
    Managing hierarchical structures where parent and child relationships need to be reflected in the DOM.
    Fully refreshing a subtree (``rerenderObject()``) after its underlying configuration changed.

24.1.2.4. Example Usage
#######################

.. code-block:: javascript

    var Object1 = new sysBaseObject();
    Object1.ObjectID = 'BaseObject';

    var childObject = new sysBaseObject();
    Object1.addObject(childObject);
    //- Now Object1.ChildObjects[0] = childObjectRef

    Object1.renderObject();
    //- this.createDOMElement(this.DOMObjectID);
    //- this.appendDOMParentElement();
    //- => recursive renders 2 DOM divs

24.1.2.5. Conclusion
####################

The ``renderObject()`` method is a fundamental part of the ``sysBaseObject`` class, enabling dynamic
and recursive rendering of object hierarchies in the *x0-framework*. It ensures efficient DOM manipulation
and encapsulates all rendering logic for both parent and child objects, while ``rerenderObject()``
provides a convenient full-refresh counterpart.

.. _devoopmodel-classes-baseobj-remove:

24.1.3. sysBaseObject.remove
****************************

The ``remove()`` method detaches a single object from its parent's ``ChildObjects`` array
and removes its DOM representation. Unlike ``removeParent()``, which also clears the
object's own children, ``remove()`` only removes the object itself.

24.1.3.1. Method Implementation
###############################

.. code-block:: javascript

    sysBaseObject.prototype.remove = function()
    {
        const ChildItemIndex = this.ParentObject.getChildIndexByChildItemID(this.ObjectID);
        this.ParentObject.ChildObjects.splice(ChildItemIndex, 1);
        this.removeDOMElement();
    }

24.1.3.2. How It Works
######################

    1. Locate Index:
        Resolves this object's position inside ``ParentObject.ChildObjects`` via
        ``getChildIndexByChildItemID(this.ObjectID)``.

    2. Splice from Parent:
        Removes the entry at that index from ``ParentObject.ChildObjects``, breaking the
        logical parent-child link.

    3. Remove DOM Node:
        Calls ``removeDOMElement()`` to remove the corresponding DOM node from the document.

24.1.3.3. Usage Example
#######################

.. code-block:: javascript

    // Remove a single row object from a dynamic list
    const RowObj = sysFactory.getObjectByID('ListRow42');
    RowObj.remove();

24.1.3.4. When to Use
#####################

    - Removing a single dynamically created object (e.g. a list row, a dynamic radio
      list entry, or a context menu item) without affecting its siblings.
    - Use :ref:`devoopmodel-classes-baseobj-removeparent` instead when the object's own
      children must also be discarded.

.. _devoopmodel-classes-baseobj-removeparent:

24.1.4. sysBaseObject.removeParent
**********************************

24.1.4.1. Purpose
#################

The ``removeParent()`` method is used to remove an object's parent relationship and its
associated DOM elements. This ensures that the object is detached from its parent both
logically (in the object hierarchy) and visually (in the DOM).

24.1.4.2. Method Signature
##########################

.. code-block:: javascript

    sysBaseObject.prototype.removeParent = function()

24.1.4.3. How It Works
######################

    * DOM Element Removal:
        Checks if the DOM element associated with the object exists.
        If it exists, the DOM parent element is removed using removeDOMParentElement().

    * Child Objects Reset:
        Deletes the ChildObjects array to ensure all child references are cleared.
        Resets ChildObjects to an empty array to maintain consistency.

    * Error Handling:
        Catches and logs any errors that occur during the removal process.

24.1.4.4. Usage Example
#######################

Suppose you have a hierarchical structure of objects (e.g., a parent object with multiple children).
If you need to remove a parent object along with its DOM representation, you can call the removeParent() method.

.. code-block:: javascript

    // Example: Removing a parent object from the hierarchy
    const parentObject = sysFactory.getObjectByID('parent-id');
    parentObject.removeParent();

24.1.4.5. Code Walkthrough
##########################

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

24.1.4.6. Key Points
####################

    1. DOM Management:
        Ensures that any associated DOM elements are properly removed to avoid memory leaks.

    2. Child Object Cleanup:
        Clears references to child objects to maintain a clean state.

    3. Error Resilience:
        Handles potential errors gracefully, ensuring that the application remains stable.

24.1.4.7. When to Use
#####################

    - Use removeParent() when you need to:
        Detach an object and its associated DOM element from the object hierarchy.
        Clean up resources associated with an object.

24.1.5. sysFactory.setupObjectRefsRecursive
*******************************************

The ``sysFactory.setupObjectRefsRecursive()`` method is a utility method in the *x0-framework*
designed to create and configure hierarchical object structures. It recursively processes
object definitions, initializes objects, and establishes parent-child relationships.

24.1.5.1. Purpose
#################

The purpose of ``setupObjectRefsRecursive`` is to:

    * Dynamically create and initialize objects based on a predefined hierarchy (ObjDefs).
    * Assign configuration attributes to each object.
    * Propagate an optional ``KeyID`` used by key-value driven recursive data dispatch
      (see :ref:`devoopmodel-classes-getobjectdata`).
    * Establish parent-child relationships between objects.
    * Allow nested objects to be recursively processed and added to their respective parents.

24.1.5.2. Function Signature
############################

.. code-block:: javascript

    sysFactory.prototype.setupObjectRefsRecursive = function(ObjDefs, RefObj)

24.1.5.3. Parameters
####################

    - ObjDefs:
        An array of object definitions, where each definition specifies the id, SysObject, JSONAttributes, optional KeyID, and optionally nested ObjectDefs.

    - RefObj:
        The parent object to which the processed objects will be added as children.

24.1.5.4. Example
#################

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

24.1.5.5. How It Works
######################

    1. Iterate Through ObjDefs:
        The function loops through each object definition in the ObjDefs array.

    2. Initialize Objects:
        For each object:
            The specified SysObject is initialized.
            The ObjectID is assigned from the id field in the object definition.
            Configuration attributes (JSONAttributes) are added to the object's JSONConfig.
            If a ``KeyID`` is present in the definition, it is assigned to the object for
            later use by the ``KeyValue`` recursive get/set data mechanism.

    3. Call init Method:
        Attempts to call the init method on the object to perform any additional setup.

    4. Add to Parent:
        The initialized object is added to the parent (or reference) object (RefObj) using the addObject method.

    5. Process Nested Objects:
        If the current object contains additional nested objects (ObjectDefs), the function recursively calls itself, passing the nested definitions and the current object as the new parent.

24.1.5.6. Code Walkthrough
##########################

.. code-block:: javascript

    sysFactory.prototype.setupObjectRefsRecursive = function(ObjDefs, RefObj)
    {
        for (const ObjItem of ObjDefs)
        {
            CurrentObject = ObjItem['SysObject'];
            CurrentObject.ObjectID = ObjItem['id']
            CurrentObject.JSONConfig = { "Attributes": ObjItem['JSONAttributes'] };

            if (ObjItem['id'] !== undefined) {
                CurrentObject.KeyID = ObjItem['KeyID'];
            }

            try {
                CurrentObject.init();
            }
            catch(err) {
                console.log('::sysFactory setupObjectRefsRecursive() err:%s', err);
            }

            RefObj.addObject(ObjItem['SysObject']);

            if (ObjItem['ObjectDefs'] !== undefined) {
                sysFactory.setupObjectRefsRecursive(ObjItem['ObjectDefs'], ObjItem['SysObject']);
            }
        }
    }

24.1.5.7. Example Usage
#######################

- Scenario:

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

24.1.5.8. Key Features
######################

    1. Recursive Object Setup:
        Automatically handles deeply nested object hierarchies.
        No need for manual setup of parent-child relationships.

    2. Dynamic Initialization:
        Calls the init method on each object, enabling custom initialization logic.

    3. Flexible Configuration:
        Supports passing attributes (JSONAttributes) and an optional KeyID as configuration for each object.

    4. Error Handling:
        Catches initialization errors without disrupting the overall process.

24.1.5.9. Important Notes
#########################

    * Object Definitions:
        Ensure that each object definition specifies the correct SysObject type and necessary attributes.

    * Initialization:
        Custom initialization logic for each object should be implemented in its init method.

    * Parent-Child Relationship:
        The method relies on the addObject function to establish the parent-child hierarchy. Ensure this function is implemented in the objects.

    * Performance:
        For deeply nested hierarchies, the recursive nature of the function may impact performance. Optimize object definitions to minimize unnecessary nesting.

24.1.5.10. Conclusion
#####################

The setupObjectRefsRecursive method is a powerful utility for dynamically creating and
configuring hierarchical object structures in the *x0-framework*. By leveraging this method,
developers can efficiently build complex UI components with minimal manual effort.


.. _devoopmodel-classes-getobjectdata:

24.1.6. sysBaseObject.getObjectData / setObjectData
***************************************************

These two wrapper methods provide the primary public API for reading and writing an object's
internal data. They forward to a per-object function-pointer (``RuntimeGetDataFunc`` /
``RuntimeSetDataFunc``, and for append operations ``RuntimeAppendDataFunc``) so each object
type can implement its own data model while exposing a uniform interface to callers.

Each object declares how it wants to be read/written via two configuration flags set in its
constructor: ``GetDataMechanism`` and ``SetDataMechanism``.

24.1.6.1. Method Signatures
###########################

.. code-block:: javascript

    sysBaseObject.prototype.getObjectData = function()
    sysBaseObject.prototype.setObjectData = function(Data)

24.1.6.2. GetDataMechanism / SetDataMechanism
#############################################

``getObjectData()`` behaviour by ``GetDataMechanism``:

``'Plain'``
    Invokes ``this.RuntimeGetDataFunc()`` directly and returns its result (used e.g. by
    ``sysObjList`` / ``sysObjRangeSliderContainer``).

*(unset)*
    Falls back to the recursive traversal implemented by ``getObjectDataRecursive()``
    (see 24.1.7.1, "getObjectDataRecursive").

``setObjectData(Data)`` behaviour by ``SetDataMechanism``:

``'Plain'``
    Invokes ``this.RuntimeSetDataFunc(Data)`` directly (used e.g. by ``sysObjDiv``,
    ``sysObjImage``, ``sysObjProgressBar``).

``'KeyValue'``
    Delegates to ``setObjectDataKeyValueRecursive(Data)``, which walks the subtree looking
    for the child object whose ``KeyID`` matches an entry in ``Data`` (see 24.1.7.2,
    "setObjectDataKeyValueRecursive").

24.1.6.3. Example Usage
#######################

.. code-block:: javascript

    // Read a single object's value (Plain mechanism, or recursive fallback)
    var value = sysFactory.getObjectByID('MyProgressBar').getObjectData();

    // Write a single object's value (Plain mechanism)
    sysFactory.getObjectByID('MyProgressBar').setObjectData(75);

    // Write into a subtree addressed by KeyID (KeyValue mechanism)
    sysFactory.getObjectByID('MyFormfieldList').setObjectData([
        { "KeyID": "FirstName", "ObjectValue": "Jane" },
        { "KeyID": "LastName",  "ObjectValue": "Doe"  }
    ]);

.. _devoopmodel-classes-getobjectdatarecursive:

24.1.7. sysBaseObject.getObjectDataRecursive / setObjectDataKeyValueRecursive
*****************************************************************************

These are the helper methods that implement the recursive, non-``'Plain'`` traversal paths
used internally by ``getObjectData()`` and ``setObjectData(Data)`` respectively.

24.1.7.1. getObjectDataRecursive
################################

Walks the ``ChildObjects`` tree depth-first and populates two module-level accumulators,
``getObjectDataRecursiveResultData`` and ``getObjectDataRecursiveParentDataObject``:

- If the node defines a ``RuntimeGetDataFunc``, an entry keyed by the node's ``ObjectID`` is
  recorded, capturing ``ObjectType``, ``ParentObject``, the previously visited parent's
  ``ObjectID`` (``ParentDataObject``), the node's ``KeyID``, and the actual value returned by
  ``RuntimeGetDataFunc()`` (``ObjectValue``).
- If the node has no ``RuntimeGetDataFunc`` (pure container, e.g. a plain ``sysObjDiv`` used
  only for layout), it is skipped but its children are still visited recursively.

.. code-block:: javascript

    sysBaseObject.prototype.getObjectDataRecursive = function()
    {
        if (typeof this.RuntimeGetDataFunc === 'function') {
            getObjectDataRecursiveResultData[this.ObjectID] = {
                "ObjectType": this.ObjectType,
                "ParentObject": this.ParentObject,
                "ParentDataObject": getObjectDataRecursiveParentDataObject,
                "KeyID": this.KeyID,
                "ObjectValue": this.RuntimeGetDataFunc()
            }
            getObjectDataRecursiveParentDataObject = this.ObjectID;
        }
        else {
            for (const ChildItem of this.ChildObjects) {
                ChildItem.getObjectDataRecursive();
            }
        }
    }

24.1.7.2. setObjectDataKeyValueRecursive
########################################

Used when ``SetDataMechanism == 'KeyValue'``. Resolves the incoming ``Data`` array to the
``KeyID`` configured on the current node via ``getKeyIDValueFromData(Data, this.KeyID)``: if a
matching entry is found and the node exposes a ``RuntimeSetDataFunc``, that function is
invoked directly with the resolved value; otherwise the search recurses into
``ChildObjects``.

.. code-block:: javascript

    sysBaseObject.prototype.setObjectDataKeyValueRecursive = function(Data)
    {
        const KeyIDValue = this.getKeyIDValueFromData(Data, this.KeyID);
        if (KeyIDValue !== undefined && typeof this.RuntimeSetDataFunc === 'function') {
            this.RuntimeSetDataFunc(KeyIDValue);
        }
        else {
            for (const ChildItem of this.ChildObjects) {
                ChildItem.setObjectDataKeyValueRecursive(Data);
            }
        }
    }


    sysBaseObject.prototype.getKeyIDValueFromData = function(Data, CheckKeyID)
    {
        for (const DataKey in Data)
        {
            const DataItem = Data[DataKey];
            if (DataItem.KeyID == CheckKeyID) {
                return DataItem.ObjectValue;
            }
        }
    }

24.1.7.3. Backward Compatibility
################################

Objects that leave ``GetDataMechanism`` / ``SetDataMechanism`` unset continue to use the
recursive traversal path; existing callers that invoke ``getObjectData()`` /
``setObjectData(Data)`` without any extra arguments are unaffected by which mechanism the
target object declares, since the dispatch happens transparently inside the object itself.

.. _devoopmodel-classes-buttoncallback:

24.1.8. sysObjButtonCallback
****************************

The file ``sysObjButtonCallback.js`` defines a system object called ``sysObjButtonCallback``,
which extends the functionality of a button element with generic callback capabilities,
decoupled from backend service calls.

This object is designed to create buttons with custom in-page callbacks, making it easier to
handle button-specific actions in a modular and object-oriented way.

24.1.8.1. Key Features and Methods
##################################

    1. Constructor (``sysObjButtonCallback``):
        Initializes the object with:
            * ``ObjectType``: Set to ``'ButtonCallback'``.
            * ``overrideDOMObjectID``: Set to ``true``, so the DOM id is not prefixed recursively.
            * ``DOMType``: Set to 'button', indicating it represents a button element.
            * ``DOMAttributes``: An object for storing HTML attributes for the button.
            * ``EventListeners``: An object to store event listeners.
            * ``ChildObjects``: An array for managing child objects.

    2. Inheritance:
        - Inherits from ``sysBaseObject``.
        - Re-uses the following methods directly from ``sysObjButton.prototype``:
            * ``init``: Initializes the button (style, SQL text child object, event listener).
            * ``enable`` / ``disable``: Toggle the enabled/disabled visual and behavioural state.
            * ``addEventListenerClick``: Registers the ``mousedown`` click handler.

    3. setCallback Method:
        Allows you to define a callback by setting:
            * ``CBObject``: The object that will process the callback (stored as ``CallbackObject``).
            * ``CBFunction``: The function to be called (stored as ``CallbackFunction``).
            * ``CBArgs``: Additional arguments for the callback (stored as ``CallbackArguments``).

    4. EventListenerClick Method:
        Handles the click event by invoking ``this.CallbackObject.ButtonCallback(this.CallbackFunction, this.CallbackArguments, Event)``,
        i.e. it delegates to a ``ButtonCallback()`` method that must be implemented on the
        configured ``CallbackObject`` (as implemented, for example, by ``sysPagination``,
        ``sysObjDynRadioList``, ``sysObjBadgeSelector``, and ``sysObjSystemSettingsContainerGrid``).

24.1.9. sysBaseDOMElement
*************************

Defined in ``sysBaseDOMElement.js``, which defines a base system object for handling DOM elements:

24.1.9.1. Key Methods and Their Purpose
#######################################

    1. createDOMElement:
        Creates a new DOM element based on the DOMType property and assigns it an ID.

    2. setDOMAttribute:
        Sets a specific attribute and its value for the DOM element.

    3. removeDOMAttribute:
        Removes a specific attribute from the DOM element.

    4. appendDOMParentElement:
        Appends the DOM element to either the body or a specified parent element.

    5. removeDOMParentElement:
        Removes the DOM element from its parent element (or body if no parent is defined).

    6. removeDOMElement:
        Deletes the DOM element from the document.

    7. setDOMElementValue:
        Updates the inner HTML of the DOM element based on the DOMValue property.

    8. setDOMElementStyle:
        Sets the CSS class of the DOM element using the DOMStyle property.

    9. setDOMElementStyleAttributes:
        Configures specific style attributes (e.g., top, left, width, height, z-index) for the DOM element.

    10. setDOMElementZIndex:
        Sets the z-index style property for the DOM element.

    11. setDOMAttributes:
        Applies multiple attributes to the DOM element based on the DOMAttributes property.

    12. addDOMElementStyle:
        Adds one or more CSS classes to the DOM element.

    13. removeDOMElementStyle:
        Removes specific CSS classes from the DOM element.

    14. checkDOMHasStyle:
        Checks if the DOM element has a specific CSS class.

    15. getDOMStyleClasses:
        Retrieves all CSS classes assigned to the DOM element.

    16. setDOMStyleClasses:
        Sets the CSS classes for the DOM element, replacing existing ones.

    17. checkDOMElementExists:
        Verifies if a DOM element with a specific ID exists in the document.

    18. setDOMVisibleState:
        Applies the current ``VisibleState`` ('visible' or 'hidden') to the DOM element.

    19. switchDOMVisibleState:
        Toggles the visibility state of the DOM element between visible and hidden.

    20. getDOMVisibleState:
        Retrieves the current ``display`` style value of the DOM element.

    21. enableDOMElement:
        Enables the DOM element (removes the ``disabled`` attribute and property).

    22. disableDOMElement:
        Disables the DOM element (sets the ``disabled`` attribute and property).

    23. getDOMValue:
        Retrieves the inner HTML content of the DOM element.

    24. DOMaddEventListener:
        Adds an event listener to the DOM element for a specified event type.

    25. getDOMElement:
        Retrieves the DOM element itself (alias for ``getElement()``).

    26. getElement:
        Helper method to fetch the DOM element using ``this.DOMObjectID``.

24.1.10. sysReactor / sysEvent
******************************

Defined in ``sysReactor.js``, this pair of classes implements the x0-framework's internal
publish/subscribe event system, used to decouple objects (e.g. a ``sysServiceConnector``)
from the objects that should react to application-level events.

**sysEvent** is a lightweight data holder:

- ``ID``: the event identifier (``EventID``).
- ``CallbackFunction``: the function invoked when the event is dispatched.
- ``EventSelector``: an optional discriminator so multiple distinct events can share the same ``EventID``.

**sysReactor** manages a flat list of registered ``sysEvent`` instances:

- ``registerEvent(Attributes, CallbackFunction)``: Reads ``Attributes.OnEvent.Events``
  (an array of either plain ``EventID`` strings or ``{ EventID, EventSelector }`` objects) and
  pushes one ``sysEvent`` per entry, bound to the supplied ``CallbackFunction``.
- ``dispatchEvent(EventID, EventSelector)``: Looks up the first registered ``sysEvent`` whose
  ``ID``/``EventSelector`` pair matches and invokes its ``CallbackFunction``.
- ``fireEvents(FireEvents)``: Iterates an array of ``EventID`` values and calls
  ``sysFactory.Reactor.dispatchEvent(EventID)`` for each, used by ``sysObjButton.processActions()``
  and ``sysTab.fireEvents()`` to raise one or more events as a side effect of a user action.

24.1.11. sysServiceConnector
****************************

Defined in ``sysServiceConnector.js``. A ``sysServiceConnector`` bridges a declarative
``OnEvent`` configuration to a concrete child object that should receive backend service
data whenever a matching application event fires.

**Key Properties:**

- ``ObjectType``: ``'ServiceConnector'``.
- ``PostRequestData``: A ``sysRequestDataHandler`` instance used to accumulate request metadata.
- ``ChildObjects``: The (typically single) data-bearing object this connector feeds.

**Key Methods:**

- ``init()``: Placeholder, performs no setup of its own.
- ``connect()``: Retrieves the first child object (``getChildObjectByIndex(0)``), stores a back
  reference on it (``DstObject.ServiceConnector = this``), and registers ``EventCallback`` with
  ``sysFactory.Reactor`` for the events declared in ``JSONConfig.Attributes``. This method is
  invoked recursively for the whole screen hierarchy via
  ``sysBaseObject.connectServiceConnectorObjects()``.
- ``EventCallback(EventConfig)``: Invoked by the reactor when a matching event fires; calls
  ``processSourceObjects()``, sets ``DataURL`` from ``Attributes.OnEvent.ServiceCall``, records
  the backend service identifier on ``PostRequestData``, and triggers the child object's data
  retrieval.

24.2. UI Object Classes
-----------------------

The following classes represent user interface components and widgets that extend
the base functionality to provide specific UI elements.

24.2.1. sysObjButton
********************

Defined in ``sysObjButton.js``. Creates interactive button elements with event handling,
form validation, and service connectivity capabilities.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Properties:**

- ``ObjectType``: ``'Button'``.
- ``overrideDOMObjectID``: ``true``.
- ``DOMType``: Set to 'button' (may be switched to ``'input'`` for form buttons).
- ``DOMAttributes``: Object for storing HTML attributes for the button.
- ``PostRequestData``: Instance of ``sysRequestDataHandler`` for POST requests.
- ``CallURL``: URL for the backend service call.
- ``CallService``: Boolean flag indicating whether a service call is configured.
- ``FormValidate``: Boolean flag for form validation.
- ``ValidateResultError``: Tracks the outcome of the last ``validateForm()`` run.
- ``EventListeners`` / ``ChildObjects``: Standard object bookkeeping.

**Key Methods:**

- ``init()``: Reads ``JSONConfig.Attributes`` to configure style, DOM type, disabled state and
  an attached ``sysObjSQLText`` label child, then registers the click listener.
- ``enable()`` / ``disable()``: Toggle the ``Disabled`` flag and update the button's CSS style accordingly.
- ``addEventListenerClick()``: Registers a ``mousedown`` listener bound to ``EventListenerClick``.
- ``EventListenerClick(Event)``: Resets ``PostRequestData``, runs ``validateForm()``, and on
  success calls ``processActions()``, ``processSourceObjects()`` and ``callService()``.
- ``callService()``: Issues the configured XML-RPC call via ``sysCallXMLRPC`` using ``CallURL``.
- ``addNotifyHandler()``: Registers a message with the global async notify indicator for this action.
- ``validateForm()``: Runs configured form-list and object validations, merging failing
  form data into ``PostRequestData`` and updating ``ValidateResultError``.
- ``processActions()``: Delegates to the action processor and fires any configured
  ``FireEvents`` through ``sysFactory.Reactor``.
- ``callbackXMLRPCAsync()``: Processes the backend response, running ``OnResult`` actions and
  updating the related async notify indicator's status.
- ``processSourceObjects()``: Inherited from ``sysSourceObjectHandler``, resolves configured
  source object references prior to the service call.

24.2.2. sysObjDiv / sysObjDivUnique / sysObjDivValue
****************************************************

Defined in ``sysObjDiv.js``. Creates div container elements for layout and grouping, with two
specialized variants.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**sysObjDiv** (``ObjectType`` ``'Div'``):

- ``init()``: Applies ``DOMType`` (defaults to ``'div'``), ``DOMValue`` (defaults to empty
  string) and ``DOMStyle`` from ``JSONConfig.Attributes``.

**sysObjDivUnique** (``ObjectType`` ``'DivUnique'``, ``overrideDOMObjectID`` ``true``):

- Re-uses ``sysObjDiv.prototype.init`` as-is; used whenever a div needs a stable, non-prefixed
  DOM id (e.g. as a base class for row/selector widgets such as ``sysObjImageSelectorRow``).

**sysObjDivValue** (``ObjectType`` ``'DivValue'``, ``overrideDOMObjectID`` ``true``):

- Adds ``RuntimeGetDataFunc`` / ``RuntimeSetDataFunc`` pointing at its own ``getValue`` /
  ``setValue``, turning a plain div into a data-bearing object whose inner HTML reflects
  ``setValue(Data)``.

24.2.3. sysObjTabContainer
**************************

Defined in ``sysObjTabContainer.js``. Implements tabbed interface functionality built from two
cooperating classes.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**sysTab:**

- ``EventListenerClick()``: Switches the global current tab and fires any configured events.
- ``fireEvents()``: Dispatches the tab's configured ``FireEvents`` via ``sysFactory.Reactor``.

**sysTabContainer:**

- ``init()``: Builds the tab header/body skeleton from configuration.
- ``addTabs()``: Creates one ``sysTab`` per configured entry.
- ``appendTabObject(TabElement, TabAttributes)``: Attaches a tab's content object to the container.
- ``getTabByTabID(TabID)``: Retrieves a tab by its identifier.
- ``setGlobalCurrentTab(TabID, TabElement)``: Stores which tab is currently active.
- ``switchTab(TabID)``: Switches to the specified tab, updating visibility and active styling.
- ``getActiveTabID()`` / ``switchActiveTab()``: Read/apply the currently active tab.
- ``getDefaultTabID()`` / ``switchDefaultTab()``: Read/apply the configured default tab.
- ``reset()``: Restores the container to its default tab.

24.2.4. sysObjSQLText
*********************

Defined in ``sysObjSQLText.js``. Displays text content resolved via ``sysFactory.getText()``
from the loaded language/metadata definitions.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Methods:**

- ``init()``: Resolves the configured ``TextID`` through ``sysFactory.getText()`` and renders
  the resulting localized string, optionally with leading/trailing icon styles.
- ``update()``: Re-resolves and re-renders the text, used by
  ``sysFactory.updateLanguageObjectsGlobal()`` after a runtime language switch.

24.2.5. sysObjLanguageSwitch
****************************

Defined in ``sysObjLanguageSwitch.js``. Provides a pulldown selector and update button
to switch ``sysFactory.EnvUserLanguage`` at runtime and refresh all ``sysObjSQLText``
objects.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Methods:**

- ``init()``: Builds the language pulldown and its associated update button.
- ``getLanguageOptions()``: Builds the list of selectable language options.
- ``ButtonCallback(FunctionID, Arguments)``: Applies the selected language and triggers
  ``sysFactory.updateLanguageObjectsGlobal()``.

24.2.6. sysObjImage
*******************

Defined in ``sysObjImage.js``. Renders an ``<img>`` element whose source can be read and
updated at runtime, demonstrating that the framework's object/DOM binding is not limited to
``div`` elements.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Properties:**

- ``DOMType``: ``'img'``.
- ``RuntimeGetDataFunc`` / ``RuntimeSetDataFunc``: Bound to ``getValue`` / ``setValue``.
- ``SetDataMechanism``: ``'Plain'``.

**Key Methods:**

- ``init()``: Applies the configured image path and styling.
- ``getValue()`` / ``setValue(ImgPath)``: Read/update the ``src`` attribute.

24.2.7. sysObjProgressBar
*************************

Defined in ``sysObjProgressBar.js``. Renders a Bootstrap progress bar whose fill percentage is
exposed through the standard data API.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Properties:**

- ``RuntimeGetDataFunc`` / ``RuntimeSetDataFunc``: Bound to ``getData`` / ``setData``.
- ``SetDataMechanism``: ``'Plain'``.

**Key Methods:**

- ``init()`` / ``render()``: Build and (re-)draw the progress bar markup.
- ``reset()``: Resets the bar to its initial state.
- ``getData()`` / ``setData(PercentValue)``: Read/update the current percentage value.
- ``displayValue()``: Updates the textual percentage label.

24.2.8. sysObjRangeSlider / sysObjRangeSliderContainer
******************************************************

Defined in ``sysObjRangeSlider.js``. Provides an HTML range input together with a linked,
read-only display element.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>` (``sysObjRangeSliderContainer`` inherits from ``sysObjDivUnique``)

**sysObjRangeSlider:**

- ``init()``: Configures the underlying ``<input type="range">`` element.
- ``setupOnChangeHandler(CallbackRef, ContainerRef)``: Wires the slider's ``change`` event to
  update the paired display container.
- ``reset()`` / ``displayValue()`` / ``RuntimeGetDataFunc`` / ``RuntimeSetDataFunc``: Re-uses
  ``sysFormfieldItem.prototype.reset`` / ``displayValue`` / ``getValue`` / ``setValue`` directly,
  since a range input behaves like any other form field for data purposes.

**sysObjRangeSliderContainer:**

- ``init()``: Builds the slider together with its display value element.
- ``updateCallback()``: Synchronizes the display element whenever the slider changes.
- ``getValue()`` / ``setValue(Data)``: Read/update both the slider and its display counterpart
  (used as ``RuntimeGetDataFunc`` / ``RuntimeSetDataFunc`` with ``GetDataMechanism`` /
  ``SetDataMechanism`` both set to ``'Plain'``).

24.2.9. sysObjImageSelector / sysObjBadgeSelector
*************************************************

Defined in ``sysObjImageSelector.js`` and ``sysObjBadgeSelector.js``. Both provide a
row-based, click-to-select UI pattern on top of ``sysObjDivUnique``.

**Inherits from:** ``sysObjDivUnique``

**sysObjImageSelectorRow / sysObjImageSelector:**

- ``init()``: Builds the selectable image rows from configuration.
- ``processRows()``: (Re-)builds the row collection.
- ``setSrcObjectRef(ObjectRef)``: Associates the selector with the data-bearing object it feeds.
- ``ButtonCallback()``: Handles row selection.

**sysObjBadgeSelectorRow / sysObjBadgeSelector:**

- ``init()``: Builds the selectable badge rows from configuration.
- ``setSrcObjectRef(ObjectRef)``: Associates the selector with the data-bearing object it feeds.
- ``ButtonCallback(FunctionID)``: Handles badge selection.

24.2.10. sysObjTreeSimple
*************************

Defined in ``sysObjTreeSimple.js``. Renders an expandable/collapsible tree of nodes and leaf
items using Bootstrap list-group styling.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Properties:**

- ``LastSelectedItem``: Reference to the most recently selected leaf item.

**Key Methods:**

- ``init()``: Reads the configured ``TreeItems`` and builds the root level recursively.
- ``addTreeItems(RootObj, NodeItem, ChildItems)``: Recursively instantiates ``sysObjTreeSimpleNode``
  (expandable branches) or ``sysObjTreeSimpleItem`` (selectable leaves) per configured ``Type``.
- ``sysObjTreeSimpleNode.toggleVisibleState()``: Expands/collapses a branch.
- ``sysObjTreeSimpleItem.setHilite()`` / ``removeHilite()`` / ``clickItem()``: Manage leaf
  selection highlighting and click behaviour.

24.2.11. sysObjHeaderBodyContainer / sysObjSystemSettingsContainer(Grid)
************************************************************************

Defined in ``sysObjHeaderBodyContainer.js``, ``sysObjSystemSettingsContainer.js`` and
``sysObjSystemSettingsContainerGrid.js``. Layout containers used to build structured
header/body panels and system-settings grids.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

- ``sysObjHeaderBodyContainer.init()``: Creates separate header and body container divs.
- ``sysObjSystemSettingsContainerItem.init()`` / ``ButtonCallback()``: Builds and handles a
  single settings row/entry.
- ``sysObjSystemSettingsContainer.init()``: Builds a plain list of settings items.
- ``sysObjSystemSettingsContainerGrid.init()`` / ``buildRuntimeGridSelector()`` / ``genGrid()``
  / ``ButtonCallback()``: Builds the same kind of settings items laid out on the CSS Grid
  System (see :ref:`appdevgridsystem`).

24.2.12. sysErrorContainer
**************************

Defined in ``sysObjErrorContainer.js``. Displays validation/service error messages inline.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Methods:**

- ``init()``: Builds the (initially empty/hidden) error message container.
- ``reset()``: Clears any previously displayed error.
- ``displayError(ErrorMsg, ErrorDetailMsg)``: Displays a short message and an optional detail message.

24.3. Form Component Classes
----------------------------

These classes handle form elements, validation, and user input processing.

24.3.1. sysFormfieldItem
************************

Defined in ``sysObjFormfieldItem.js`` as ``sysFormfieldItem`` (no ``Obj`` infix). Base class
for all concrete form field components.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Methods:**

- ``FormItemInit()`` / ``FormItemInitFinish()``: Shared initialization steps run by every
  concrete subclass's own ``init()``.
- ``setupOnChangeEventListener()``: Wires the field's ``change``/``input`` listener via
  ``sysFormFieldOnChangeHandler``.
- ``setupAttributes(Attributes)``: Applies shared configuration (style, required, globals, etc.).
- ``getValue()`` / ``setValue(Value)``: Read/update the field's current value (used as
  ``RuntimeGetDataFunc`` / ``RuntimeSetDataFunc`` by default).
- ``displayValue()``: Refreshes how the current value is displayed.
- ``reset()``: Restores the field to its initial/default value.
- ``focus()``: Focuses the underlying DOM input element.
- ``validate()``: Runs the field's configured validation and applies the resulting style.
- ``setValidateStyle(Result)`` / ``clearStyle()``: Apply/clear validation feedback styling.
- ``processOnChangeItem``: Inherited from ``sysFormFieldOnChangeHandler``.
- ``processSourceObjects``: Inherited from ``sysSourceObjectHandler``.

24.3.2. sysFormfieldItemText
****************************

Text input field component for single-line text entry. Adds its own ``init()`` on top of
``sysFormfieldItem``.

24.3.3. sysFormfieldItemTextarea
********************************

Multi-line text input component for longer text content. Adds its own ``init()`` on top of
``sysFormfieldItem``.

24.3.4. sysFormfieldItemPulldown / sysFormfieldItemDynPulldown
**************************************************************

Dropdown/select components for choosing from predefined or dynamically loaded options.

**sysFormfieldItemPulldown:**

- ``init()``: Builds the ``<select>`` element and its static ``<option>`` list.
- ``reset()``: Restores the default selected option.
- ``getValue()`` / ``setValue(Value)``: Read/update the selected option.
- ``generateOptions()``: (Re-)builds the option elements.
- ``update()``: Refreshes the pulldown's option list in place.
- ``getDefault()``: Returns the configured default option value.

**sysFormfieldItemDynPulldown** (extends the above by reusing ``generateOptions``,
``setValue``, ``getValue`` and ``getDefault`` from ``sysFormfieldItemPulldown``):

- ``init()``: Fetches the options list from a backend service instead of static configuration.
- ``getDynPulldownData()``: Issues the XML-RPC call that retrieves the option list.
- ``callbackXMLRPCAsync()``: Processes the backend response and populates the options.

24.3.5. sysFormfieldItemCheckbox / sysFormfieldItemLabel / sysFormfieldItemHidden
*********************************************************************************

Additional concrete form field types built on ``sysFormfieldItem``.

**sysFormfieldItemCheckbox:**

- ``init()``: Builds the ``<input type="checkbox">`` element.
- ``update()``: Refreshes the checked state from configuration/data.
- ``getChecked()`` / ``setChecked(Value)``: Read/update the checked state (used as
  ``RuntimeGetDataFunc`` / ``RuntimeSetDataFunc``).
- ``reset()``: Restores the default checked state.

**sysFormfieldItemLabel:**

- ``init()``: Renders a non-editable label, typically backed by a ``sysObjSQLText`` child.
- ``reset()``: Restores the label's initial text.

**sysFormfieldItemHidden:**

- ``init()``: Builds a hidden ``<input type="hidden">`` carrying a value without a visible widget.

24.3.6. sysFormFieldValidate
****************************

Defined in ``sysFormfieldValidate.js``. Provides comprehensive, per-field validation
functionality.

**Key Methods:**

- ``validate()``: Entry point that resolves and invokes the field's configured validator(s).
- ``validateByParams(ValidateID, Value, FormObj)``: Dispatches to the named validator below.
- ``MinMax(Value, FormObj)``: Validates numeric min/max ranges.
- ``IPv4Address(Value)`` / ``IPv4SubnetMask(Value)`` / ``IPPort(Value)`` / ``IPv6Address(Value)``:
  Network-related format validators.
- ``DNSRecordName(Value)``: Validates DNS record name syntax.
- ``DateInternational(Value)`` / ``DateGerman(Value)``: Locale-specific date format validators.
- ``Float(Value)``: Validates floating point number format.

24.3.7. sysFormFieldValidateGroup
*********************************

Defined in ``sysFormfieldValidate.js``. Complements ``sysFormFieldValidate`` with validations
that span *multiple* related form fields at once.

**Key Methods:**

- ``validate(FunctionID, FormfieldItems)``: Entry point that dispatches to one of the group
  check functions below by name.
- ``CheckDiffer(Items)`` / ``CheckItemsMatch(Items)``: Ensure a set of fields differ from /
  match one another.
- ``CheckNull(Items)`` / ``CheckEmpty(Items)``: Ensure fields are null/empty (or not).
- ``CheckDatePeriodOneYear(Items)`` / ``CheckDatePeriodOneYearDP(Items)``: Validate that a
  date range does not exceed one year.
- ``CheckItemsOr(Items)``: At least one of the supplied items must be valid/non-empty.
- ``MinOneItemNotNull(Items)``: At least one of the supplied items must carry a value.
- ``CheckTableRows(Items)``: Validates rows of a tabular form section as a group.
- ``DNSRecordValuePlusType(Items)``: Cross-validates a DNS record's value against its type.

24.3.8. sysFormfieldList
************************

Defined in ``sysObjFormfieldList.js``. Groups a set of ``sysFormfieldItem`` children into a
single ``<form>`` element, addressed as a whole via the ``KeyValue`` recursive data mechanism
(see :ref:`devoopmodel-classes-getobjectdata`) and backed by its own
``sysFormFieldValidateGroup`` instance for cross-field validation.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Properties:**

- ``FormfieldItems``: The list of form field objects contained in this form.
- ``PostRequestData``: A ``sysRequestDataHandler`` instance for the form's own request data.
- ``SetDataMechanism``: ``'KeyValue'``.
- ``DOMType``: ``'form'``.
- ``ValidateGroupObj``: A ``sysFormFieldValidateGroup`` instance for group-level validation.

**Key Methods:**

- ``processSourceObjects``: Inherited from ``sysSourceObjectHandler``.
- ``init()``: Builds the enclosing ``<form>`` element and its configured field items.
- ``reset()``: Restores every contained form field to its default value.
- ``setupFormObject(ObjectID, InstanceObjectID, JSONConfig)``: Instantiates and configures a single field within the form.
- ``EventListenerRightClick(Event)``: Opens the form's context menu, if configured.
- ``genGrid(Attributes)``: Lays the form's fields out on the CSS Grid System.
- ``getServiceData()``: Requests the form's backing data from the configured backend service.
- ``callbackXMLRPCAsync()``: Processes the backend response and populates the form.
- ``validate()``: Runs per-field validation together with the configured group validations.

24.4. System Utility Classes
----------------------------

These classes provide core system functionality and utilities.

24.4.1. sysFactory
******************

Defined in ``sysFactory.js``. Central factory class managing screens, objects, navigation,
global variables and localized text, and holding the registry of all ``SetupClasses`` the
engine can instantiate from metadata.

**Key Methods:**

- ``init()``: Bootstraps the application: registers user functions, builds all screens from
  the skeleton metadata, builds the menu screen, switches to the default screen, fires the
  ``InitSystem`` event and starts the async notification poller.
- ``addScreen(ScreenID, SkeletonData)``: Creates and sets up a new ``sysScreen`` instance.
- ``getScreens()`` / ``getScreenByID(ScreenID)``: Retrieve all screens / a single screen.
- ``getObjectByID(ObjectID)``: Searches every screen's hierarchy for an object by ``ObjectID``.
- ``getObjectsByAttribute(Attribute)``: Returns, per screen, all objects configured with a given attribute.
- ``getObjectsByType(ScreenID, Type)``: Returns all objects of a given ``ObjectType`` within a screen.
- ``switchScreen(ScreenID)``: Hides all screens, shows the requested one, and fires ``SwitchScreen``.
- ``switchScreensToBackground()`` / ``switchScreenToForeground(ScreenObj)``: Internal helpers used by ``switchScreen()``.
- ``getGlobalVar(Key)`` / ``setGlobalVar(Key, Value)``: Read/write the shared global variable store.
- ``resetErrorContainer()``: Resets all ``ErrorContainer`` objects on the current screen.
- ``getText(TextID)``: Resolves a localized text string for the current ``EnvUserLanguage``.
- ``updateLanguageObjectsGlobal()``: Refreshes every ``sysObjSQLText`` object across all screens after a language switch.
- ``setupObjectRefsRecursive(ObjDefs, RefObj)``: Creates hierarchical object structures (see 24.1.5, "sysFactory.setupObjectRefsRecursive").

24.4.2. sysCallXMLRPC
*********************

Defined in ``sysXMLRPCRequest.js`` (the exported class is named ``sysCallXMLRPC``). Handles
XML-RPC/REST communication with backend services.

**Key Methods:**

- ``sysCallXMLRPC(URL, URLParams = '')``: Constructor, stores the target ``URL`` and optional query parameters.
- ``setRequestType(Type)``: Sets the HTTP request method (e.g. ``'GET'`` or ``'POST'``).
- ``setRequestBasicAuth(Username, Password)``: Configures HTTP Basic authentication for the request.
- ``Request(RequestObject)``: Executes the configured request and routes the result back to ``RequestObject.callbackXMLRPCAsync()``.

24.4.3. sysGridGenerator
************************

Defined in ``sysGridGenerator.js``. Generates CSS Grid System layouts programmatically from a
list of source objects.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Methods:**

- ``sysGridGenerator(SourceObjects)``: Constructor, accepts the objects to lay out on the grid.
- ``init()``: Initializes the grid generator with its column/row configuration.
- ``fillGap()``: Fills any remaining, unoccupied grid cells.
- ``generate()``: Produces the full grid layout.
- ``ColIndexGenerator()`` / ``RowIndexGenerator()``: Generator functions yielding successive column/row indices.
- ``ColStyleGenerator()`` / ``RowStyleGenerator()``: Generator functions yielding the corresponding CSS Grid style classes.

24.4.4. sysText
***************

Defined in ``sysText.js``. Manages internationalization and text resources.

**Inherits from:** ``sysXMLRPCBaseSyncLoader``

**Key Properties:**

- ``Languages``: Supported language codes (e.g. ``['de', 'en']``).
- ``PDLanguagesDisplay``: Nested mapping of language display names per language.
- ``XMLRPCResultData``: The loaded raw text metadata.

**Key Methods:**

- ``getTextObjectByID(TextID)``: Retrieves the raw, multi-language text object for a given ``TextID``.
- ``getTextBySystemLanguage(TextID)``: Returns the text value for ``sysFactory.EnvUserLanguage``.

24.4.5. sysRequestDataHandler
*****************************

Defined in ``sysRequestDataHandler.js``. A small, dependency-free data container used to
accumulate and transform outgoing request data (e.g. used as ``PostRequestData`` by
``sysObjButton``, ``sysScreen`` and ``sysServiceConnector``).

**Key Methods:**

- ``reset()``: Clears ``RequestData`` and ``ServiceData`` back to empty objects (also called from the constructor).
- ``addServiceProperty(Key, Value)``: Adds a property to ``ServiceData``.
- ``add(DataObject, Key)``: Adds a single key-value pair to ``RequestData``.
- ``merge(DataObject)``: Merges all key-value pairs of ``DataObject`` into ``RequestData``.
- ``removePrefix(Prefix)``: Strips a common prefix from every key in ``RequestData``.
- ``transform(TransformData)``: Renames keys in ``RequestData`` according to a mapping object.

24.4.6. sysHelper Functions
***************************

Defined in ``sysHelper.js``. A small collection of standalone, module-level utility functions
(not attached to any prototype) used across the engine:

- ``sysMergeObjects(Object1, Object2)``: Deep-merges two plain objects; nested objects are
  merged recursively, arrays are concatenated, and scalar values in ``Object2`` overwrite
  those in ``Object1``.
- ``sysConvertSysData2KeyValue(Data)``: Converts an array of ``{ KeyID, ObjectValue }`` entries
  (as produced by :ref:`devoopmodel-classes-getobjectdata`'s recursive getter) into a flat
  ``{ KeyID: ObjectValue, … }`` object.
- ``sysConvertSysDataArray2Object(Data)``: Converts an array of ``{ KeyID, … }`` entries into an
  object keyed by ``KeyID``.

24.5. Async Notification Classes
--------------------------------

These classes handle asynchronous notifications and status indicators.

24.5.1. sysObjAsyncNotifyIndicator
**********************************

Defined in ``sysAsyncNotifyIndicator.js``. Creates the visual container for one or more
asynchronous operation status indicators.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Methods:**

- ``init()``: Builds the indicator container.
- ``addMsgItem(Config)``: Adds a new ``sysObjAsyncNotifyIndicatorItem`` to the container.
- ``getMsgItemByName(ID)``: Retrieves a previously added item by its identifier.

24.5.2. sysObjAsyncNotifyIndicatorItem
**************************************

Defined in ``sysAsyncNotifyIndicatorItem.js``. Represents an individual notification item
within the async indicator container.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Methods:**

- ``sysObjAsyncNotifyIndicatorItem(NotifyConfig, ParentRef)``: Constructor, binds the item to its configuration and parent indicator.
- ``init()``: Builds the item's visual representation.
- ``setProcessStatus(Status)``: Updates the current process status (e.g. pending/success/error).
- ``setDisplayText(TextData)``: Sets the item's display text.
- ``updateProcessStatus()`` / ``updateDisplayText()``: Re-apply status/text to the rendered item.
- ``updateDisplay()``: Refreshes the overall item display.
- ``processResult(Status)``: Processes an incoming result and updates status/text accordingly.
- ``callbackTimeout(ItemRef)``: Handles automatic item expiry/removal after a configured timeout.
- ``close()``: Explicitly dismisses the notification item.

24.5.3. sysAsyncNotifyMsgHandler
********************************

Defined in ``sysAsyncNotifyMsgHandler.js``. Polls the backend for asynchronous messages and
routes them to the appropriate ``sysObjAsyncNotifyIndicatorItem``.

**Key Methods:**

- ``sysAsyncNotifyMsgHandler(MsgProcessing)``: Constructor, accepts the message processing strategy.
- ``getMsg()``: Issues the (long-)polling request for new async messages.
- ``callbackXMLRPCAsync()``: Processes the backend response and re-schedules the next poll.
- ``processMsg(Message)``: Routes a single message to the matching notification indicator item.

24.6. Specialized UI Components
-------------------------------

24.6.1. sysFileUpload
*********************

Defined in ``sysObjFileUpload.js`` as ``sysFileUpload``. Handles file upload functionality
including progress reporting.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Methods:**

- ``init()``: Builds the file input and upload button.
- ``ButtonCallback(FunctionID, Arguments)``: Triggers the configured action, typically ``startUpload()``.
- ``startUpload()``: Begins uploading the selected file(s).
- ``updateUploadStatus()`` / ``updateProgress(Progress)``: Reflect the current upload progress in the UI.
- ``UploadFinished(progress)``: Finalizes the upload UI state once the transfer completes.
- ``getData()``: Returns the currently selected file data.

24.6.2. sysObjOpenCloseContainer
********************************

Defined in ``sysObjOpenCloseContainer.js``. Creates a collapsible/expandable container.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Methods:**

- ``init()``: Builds the container in its configured initial (open/closed) state.
- ``toggleVisibleState()``: Switches between the open and closed state.
- ``updateState()``: Applies the current state to the DOM (icon/visibility).
- ``reset()``: Restores the container's configured default state.

24.6.3. sysObjDynRadioList
**************************

Defined in ``sysObjDynRadioList.js``. Dynamic, user-extensible radio button list component.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**sysObjDynRadioListRow:**

- ``sysObjDynRadioListRow(ParentObject, CtxtMenu, ButtonRef, ButtonJSONAttr, SetRemoveCallback)``: Constructor.
- ``init()``: Builds a single radio row with its associated context menu entry.
- ``addObjects(ButtonRef, ButtonJSONAttributes)``: Attaches the row's action button.
- ``EventListenerRightClick(Event)``: Opens the row's context menu.
- ``ButtonCallback(Function, Arguments)``: Handles the row's button action.
- ``remove()``: Removes this row from the list (see :ref:`devoopmodel-classes-baseobj-remove`).

**sysObjDynRadioList:**

- ``init()``: Builds the list container and its "add" affordance.
- ``ButtonCallback(Function, Arguments)``: Handles the list-level add/remove actions.
- ``add()``: Appends a new ``sysObjDynRadioListRow``.
- ``remove(RowIndex)``: Removes the row at the given index.

24.6.4. sysContextMenu
**********************

Defined in ``sysObjContextMenu.js``. Implements a generic, position-aware context menu.

**Key Classes:**

- ``sysContextMenu``: Main context menu container.
- ``sysContextMenuItem``: Individual, selectable menu entry.

**sysContextMenu Methods:**

- ``init()``: Builds the (initially hidden) menu root element.
- ``addItems()``: Adds the configured ``sysContextMenuItem`` entries.
- ``processItems()``: Resolves and renders the menu's item configuration.
- ``setupHeader()``: Builds an optional menu header/title.
- ``EventListenerClickClose(Event)``: Closes the menu when a click outside it is detected.
- ``close(Event)`` / ``removeRootElement(Event)``: Hide/remove the menu from the DOM.

**sysContextMenuItem Methods:**

- ``EventListenerClick(Event)``: Executes the item's configured action.
- ``setHilite()`` / ``removeHilite()``: Apply/clear hover highlighting.

24.7. List and Grid Components
------------------------------

24.7.1. sysList
***************

Defined in ``sysObjList.js``. Creates data lists with paginated, service-backed rows.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Properties:**

- ``RuntimeGetDataFunc`` / ``RuntimeSetDataFunc``: Bound to ``getRuntimeData`` / ``appendData``.
- ``GetDataMechanism`` / ``SetDataMechanism``: Both ``'Plain'`` (see :ref:`devoopmodel-classes-getobjectdata`).

**Key Methods:**

- ``init()``: Builds the list header and its column definitions.
- ``setupHeader()``: Builds the column header row.
- ``getServiceData()``: Requests the backing row data from the configured backend service.
- ``callbackXMLRPCAsync()``: Processes the backend response and triggers ``update()``.
- ``update()``: Re-renders the list from the currently held data.
- ``resetData()`` / ``reset()``: Clear the list's current row data / full state.
- ``setUpdateResult()``: Records the outcome of the latest data refresh.
- ``checkDouble(CheckValue)``: Detects whether a row with a given key already exists.
- ``renderPage()`` / ``renderRows()``: Render the currently visible page of rows.
- ``addRow(RowData, Index)`` / ``removeRow(Index)``: Add/remove a single row.
- ``removeSelected()``: Removes all currently selected rows.
- ``getColumnItems(ColumnID)``: Returns all cell values for a given column across rows.
- ``getRowByIndex(Index)`` / ``updateRow(Index, Data)``: Read/update a specific row.
- ``getRuntimeData()``: Returns the list's current row data (used as ``RuntimeGetDataFunc``).
- ``convertObjectDataKeyValue(Data)``: Normalizes incoming data to the list's internal row format.
- ``appendData(Data)``: Appends new rows to the list (used as ``RuntimeSetDataFunc``/``RuntimeAppendDataFunc`` target).
- ``EventListenerRightClick(Event)``: Opens the list's context menu.

24.7.2. sysListRow
******************

Defined in ``sysObjList.js``. Individual row component within a ``sysList``.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Methods:**

- ``sysListRow(ParentObject, RowIndex, RowData)``: Constructor, binds the row to its parent list, index and initial data.
- ``init()``: Builds the row's DOM structure.
- ``addColumns()`` / ``genGrid()``: Build the row's cells according to the configured columns.
- ``getColumnById(Column)``: Retrieves a specific cell object by column id.
- ``setRowData(Data)``: Applies new data to the row's cells.
- ``EventListenerRightClick(Event)`` / ``EventListenerSelect(Event)``: Handle contextual and selection interactions.
- ``remove()`` / ``removeSelected()``: Remove this row, or all selected rows, from the list.

24.7.3. sysPagination
*********************

Defined in ``sysRTPagination.js``. Handles pagination controls for ``sysList`` and similar,
page-based components.

**Inherits from:** :ref:`sysBaseObject <devoopmodel-classes-baseobj-addobject>`

**Key Methods:**

- ``sysPagination(ParentObject)``: Constructor, binds the pagination control to its parent (paginated) object.
- ``setPageCount()``: Computes the total number of pages from the parent's data.
- ``render()``: Builds the pagination control's DOM elements.
- ``update()``: Refreshes the pagination control to reflect the current page/data state.
- ``ButtonCallback(FunctionID, Arguments)``: Dispatches navigation button clicks.
- ``navigateLeft()`` / ``navigateRight()``: Move to the previous/next page.
- ``navigateIndex(PageNr)``: Jumps directly to a given page.

24.8. Screen Management Classes
-------------------------------

24.8.1. sysScreen
*****************

Defined in ``sysScreen.js``. Manages a single application screen, including its full object
hierarchy, styling and global variable scope.

**Key Properties:**

- ``ScreenID``: The screen's identifier.
- ``SkeletonData``: The screen's raw metadata definition.
- ``HierarchyRootObject``: The root ``sysObjDiv`` under which the screen's whole object tree is built.
- ``PostRequestData``: A ``sysRequestDataHandler`` instance for screen-level requests.
- ``GlobalVars``: The screen's local global-variable store.

**Key Methods:**

- ``setStyle(Style)`` / ``updateStyle(Style)``: Set / apply the screen's CSS style.
- ``setup()``: Builds the object hierarchy (``setupObject()``), connects service connectors,
  renders the root object, processes resets, and wires up event listeners.
- ``setupObject(ObjectID, HierarchyObject, HierarchyLevel = 0)``: Recursively builds and configures
  the object hierarchy from the screen's skeleton metadata.
- ``getSkeletonObjectsByObjectRefId(ObjectId)``: Resolves the skeleton metadata entry for an object reference.
- ``configObjectInstance(JSONConfig)``: Applies metadata configuration to a freshly created object instance.
- ``callbackXMLRPCAsync()``: Processes screen-level asynchronous service responses.
- ``setGlobalVar(Key, Value)`` / ``getGlobalVar(Key)``: Read/write a single screen-local global variable.
- ``setGlobalVars(GlobalVars)`` / ``getGlobalVars()``: Bulk read/write of the screen's global variable store.
- ``mergeGlobalVars(Items)``: Merges a set of variables into the existing global variable store.

24.8.2. sysScreenOverlay
************************

Defined in ``sysScreenOverlay.js``. Manages modal overlay screens rendered on top of the
regular screen stack.

**Key Methods:**

- ``activateOverlay(ScreenID, OverrideStyle)``: Activates the given screen as a centered modal overlay.
- ``activateOverlayAtPosition(ScreenID, CoordX, CoordY, Width)``: Activates the overlay at an
  explicit screen position and width, instead of being centered.
- ``closeOverlay(ScreenID)``: Closes the active overlay and restores the previous screen state.
