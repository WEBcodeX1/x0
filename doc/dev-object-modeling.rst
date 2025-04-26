.. dev-object-modeling

.. _devobjectmodeling:

26. x0-Object Modeling
======================

The following sections explain how to design **custom** *x0-system-objects* and
define their **specifications** for seamless integration into the core system.

26.1. Basic Modeling Rules
--------------------------

You should have a **solid understanding** of the following *x0* fundamentals before
continuing:

- Base Classes / Inheritance
- Child Objects / Parent Object
- Event Handler / Callbacks
- Building Object Structure (DOM)
- Modifying Runtime Data
- Object Realtime Updates
- Object Initialization
- Adding Context Menu Functionality

26.1.1. Base Classes / Inheritance
**********************************

You should familiarize yourself with the x0 *Core Base Model*.
Refer to: :ref:`devoopmodel_base`.

Any **custom** *x0-system-object* must inherit ``sysBaseObject`` in its prototype.

.. code-block:: javascript

    //- inherit sysBaseObject
    sysObjNewcomer.prototype = new sysBaseObject();

26.1.2. Child Objects / Parent Object
*************************************

The ``self.ChildObjects[]`` model in ``sysBaseObject.js`` is an array that
manages the child objects of a ``sysBaseObject`` instance. It functions as a
recursive container for hierarchical object structures within the
*x0-framework*.

1. Initialization

In any new modeled Object's constructor, ``this.ChildObjects[]`` must be initialized
as an empty array:

.. code-block:: javascript

    this.ChildObjects = new Array(); //- Child Objects

2. Child Object Relationships

Each child object in the array is an instance of ``sysBaseObject`` or its derived classes.
A parent-child relationship is established using the ``ParentObject`` property.

This enables any child object to directly access its parent(s).

.. code-block:: javascript

    //- Do something in the ParentObject
    this.ParentObject.doSomething();

    //- Do something in the ParentObject.ParentObject
    this.ParentObject.ParentObject.doSomething();

3. Add Objects

Adding objects to self is done like this:

.. code-block:: javascript

    //- add new sysObjDiv()
    let Obj1 = new sysObjDiv();
    Obj1.ObjectID = 'MyDiv1';

    //- add Obj1 to parent
    this.addObject(Obj1);

see: :ref: sysBaseObject.addObject()

4. Propagate Object(s) to DOM

.. code-block:: javascript

    //- render all ParentObject.ChildObjects[]
    this.ParentObject.renderObject();

26.1.3. Event Handler / Callbacks
*********************************

If you want to process native DOM Events (not *x0-events*),
in any new modeled Object's constructor, ``this.EventListeners[]`` must be
initialized as an empty array:

.. code-block:: javascript

    this.EventListeners = new Array(); //- Array of EventListener Objects

1. Add Event Listeners

.. code-block:: javascript

    let EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown'; //- Event Type 'mousedown'
    EventListenerObj['Element'] = this.EventListenerCallback.bind(this); //- Callback Method
    this.EventListeners['ListenerID'] = EventListenerObj; //- Add Listener with ListenerID

2. Multiple Event Listeners

When adding multiple Event Listeners, processing order will be preserved.

3. Event Listener Activation

After adding Event Listeners in Realtime Objects, they have to be explicitely
activated before working.

.. code-block:: javascript

    this.processEventListener();

4. sysButtonCallback Object

The ``sysButtonCallback`` *x0-object* can be used to asbtract ...

26.1.4. Building DOM Object Structure
*************************************

See :ref:`devporting`.

26.1.5. Modifying Runtime Data
******************************

The following types of dynamic data updates can change a *x0-object*
state on runtime.

- XML-RPC Async Call
- RuntimeSetData()
- RuntimeAppendData()

26.1.6. Working with Realtime Objects
*************************************

When designing realtime objects, the procedure of removing
DOM nodes completely sometimes is much smarter than complex (recursive)
update processing.

The *x0-framework* provides multiple solutions for removing DOM nodes.

1. remove()

Inherited from ``sysBaseObject``. Any object can call this method to
remove itself from ParentObject.ChildObjects[] and the corresponding DIV
from the DOM.

See :ref:``.

2. removeParent()

Inherited from ``sysBaseObject``. Any object can call this method to
remove all ParentObject.ChildObjects[] and the corresponding DIVs
from the DOM.

See :ref:``.

26.1.7. Object Loading / Initialization
***************************************

1. init()

26.1.8.Adding Context Menu Functionality
****************************************

1. Add Event Listener init()
2. Setup Context Menu
3. Eventually extend

26.2. Building an Object Like sysObjDynRadioList.js
---------------------------------------------------

This section explains how to create a dynamic system object similar to
``sysObjDynRadioList.js`` in the *x0-framework*. It focuses on the structure,
methods, and key principles used in ``sysObjDynRadioList``.

26.2.1. Overview
****************

The ``sysObjDynRadioList`` is a **dynamic object** designed to manage a list of
**radio buttons**, with rows that can be added or removed at runtime. Each row
includes a **radio button**, an **input field**, and **associated controls**.

26.2.2. Key Components
**********************

    1. Base Object Inheritance:
        Inherits from ``sysBaseObject`` for core functionality.
    2. Dynamic Rows:
        Rows are represented by ``sysObjDynRadioListRow``, which also inherits from ``sysBaseObject``.
    3. Callbacks and Events:
        Used for adding/removing rows and handling user interactions.
    4. JSON Configuration:
        Utilized for defining object attributes and styles.

26.2.3. Step-by-Step Guide
**************************

Following, a Step-by-Step Guide, guiding you through the creation process.

26.2.2. Create the Base Class
*****************************

Start by defining your main object, inheriting from sysBaseObject:

.. code-block:: javascript

    function sysObjDynRadioList() {
        this.EventListeners = {};
        this.ChildObjects = [];
        this.RowItems = []; // Array to hold rows
        this.RowIndex = 0;  // Tracks row indices
    }

    // Inherit from sysBaseObject
    sysObjDynRadioList.prototype = new sysBaseObject();

26.2.3. Initialize the Object
*****************************

Define the init method to set up the object structure and default components:

.. code-block:: javascript

    sysObjDynRadioList.prototype.init = function() {
        this.DOMType = 'div';
        this.DOMStyle = 'container-fluid';

        // Add an "Add Row" button
        let AddButton = new sysObjButtonCallback();
        AddButton.setCallback(this, 'add');

        let AddButtonJSONAttributes = {
            "DOMType": "a",
            "Style": "col-md-1 btn btn-primary btn-sm",
            "IconStyle": "fa-solid fa-plus",
            "TextID": "TXT.BUTTON.ADD"
        };

        this.addObject(
            new sysObjDynRadioListRow(
                this,                   // Parent Object
                false,                  // Context Menu disabled
                AddButton,              // Button Reference
                AddButtonJSONAttributes // Button Attributes
            )
        );
    };

26.2.4. Define the Row Class
****************************

Each row in the list is represented by ``sysObjDynRadioListRow``. This class manages its
elements (radio button, input field, and optional remove button):

.. code-block:: javascript

    function sysObjDynRadioListRow(ParentObject, CtxtMenu, ButtonRef, ButtonJSONAttr, SetRemoveCallback) {
        this.EventListeners = {};
        this.ChildObjects = [];
        this.ParentObject = ParentObject;

        this.Index = this.ParentObject.RowIndex;
        this.CtxtMenuActive = CtxtMenu;
        this.ButtonRef = ButtonRef;
        this.ButtonJSONAttr = ButtonJSONAttr;
        this.SetRemoveCallback = SetRemoveCallback;

        this.init();
    }

    // Inherit from sysBaseObject
    sysObjDynRadioListRow.prototype = new sysBaseObject();

.. code-block:: javascript

    sysObjDynRadioListRow.prototype.init = function() {
        this.DOMStyle = 'row';
        this.ObjectID = 'row-ctain' + this.ParentObject.ObjectID + this.Index;
        this.RadioGroupID = 'row-ctain' + this.ParentObject.ObjectID;

        // Add objects (radio button, input field, etc.)
        this.addObjects(this.ButtonRef, this.ButtonJSONAttr);

        // Set up callback for removing the row
        if (this.SetRemoveCallback) {
            this.ButtonRef.setCallback(this, 'remove');
        }

        // Add context menu listener if enabled
        if (this.CtxtMenuActive) {
            let EventListenerObj = {
                'Type': 'mousedown',
                'Element': this.EventListenerRightClick.bind(this)
            };
            this.EventListeners['ContextMenuOpen'] = EventListenerObj;
        }
    };

26.2.5. Add Rows Dynamically
****************************

The add method in ``sysObjDynRadioList`` creates new rows dynamically:

.. code-block:: javascript

    sysObjDynRadioList.prototype.add = function() {
        this.RowIndex += 1;

        let RemoveButton = new sysObjButtonCallback();
        let RemoveButtonJSONAttributes = {
            "DOMType": "a",
            "Style": "col-md-1 btn btn-primary btn-sm",
            "IconStyle": "fa-solid fa-minus",
            "TextID": "TXT.BUTTON.REMOVE"
        };

        this.addObject(
            new sysObjDynRadioListRow(
                this,                       // Parent Object
                true,                       // Context Menu enabled
                RemoveButton,               // Button Reference
                RemoveButtonJSONAttributes, // Button Attributes
                true                        // Enable remove callback
            )
        );

        // Re-render the object
        this.renderObject(this.DOMParentID);
    };

26.2.6. Handle Row Removal
**************************

The remove method in sysObjDynRadioListRow is used to remove a row:

.. code-block:: javascript

    sysObjDynRadioListRow.prototype.remove = function() {
        this.removeBase(); // Call inherited remove method
    };

In the parent object, the remove method manages the array of rows:

.. code-block:: javascript

    sysObjDynRadioList.prototype.remove = function(RowIndex) {
        this.RowItems[RowIndex].remove();
    };

26.2.7. Define Object Structure
*******************************

Use the ``addObjects`` method to define the DOM structure for each row:

.. code-block:: javascript

    sysObjDynRadioListRow.prototype.addObjects = function(ButtonRef, ButtonJSONAttributes) {
        let ObjDefs = [
            {
                "id": "col-ctnt" + this.Index,
                "SysObject": new sysObjDiv(),
                "JSONAttributes": { "Style": "col-md-11" },
                "ObjectDefs": [
                    {
                        "id": "base-ctain" + this.Index,
                        "SysObject": new sysObjDiv(),
                        "JSONAttributes": { "Style": "input-group" },
                        "ObjectDefs": [
                            {
                                "id": "radio-ctain" + this.Index,
                                "SysObject": new sysObjDiv(),
                                "JSONAttributes": {
                                    "Style": "input-group-text",
                                    "Value": '<input type="radio" id="' + this.ObjectID + '-root" name="' + this.RadioGroupID + '" class="form-check-input mt-0">'
                                }
                            },
                            {
                                "id": "input-text" + this.ObjectID + this.Index,
                                "SysObject": new sysFormfieldItemText(),
                                "JSONAttributes": {
                                    "Style": "form-control",
                                    "Type": "text"
                                }
                            }
                        ]
                    }
                ]
            },
            {
                "id": "col-btn",
                "SysObject": ButtonRef,
                "JSONAttributes": ButtonJSONAttributes
            }
        ];

        sysFactory.setupObjectRefsRecursive(ObjDefs, this);
    };

26.2.8. Conclusion
******************

By following this guide, you can create dynamic objects similar to sysObjDynRadioList.js.
The key is leveraging the x0 system's object-oriented framework, callbacks, and
JSON-based DOM configuration. You can extend this structure further based on
your application's specific requirements.
