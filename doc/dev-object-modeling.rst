.. dev-object-modeling

.. _devobjectmodeling:

26. x0-Object Modeling
======================

The following sections explain how to design **custom** *x0-system-objects* and
define their **specifications** for seamless integration into the core system.

26.1. Basic Modeling Rules
--------------------------

Before proceeding, ensure you have a **solid understanding** of the following *x0*
fundamentals:

- Base Classes / Inheritance
- Child Objects / Parent Object
- Event Handlers / Callbacks
- Building Object Structure (DOM)
- Modifying Runtime Data
- Object Realtime Updates
- Object Initialization
- Adding Context Menu Functionality

26.1.1. Base Classes / Inheritance
**********************************

The x0 framework follows a strict object-oriented approach. All custom *x0-system-objects*
must inherit from ``sysBaseObject`` in their prototypes.

.. code-block:: javascript

    //- inherit sysBaseObject
    sysObjNewcomer.prototype = new sysBaseObject();

Refer to: :ref:`devoopmodel_base` for more information on the *x0* Core Base Model.

26.1.2. Child Objects / Parent Object
*************************************

The ``this.ChildObjects[]`` array in ``sysBaseObject.js`` is used to manage child objects
of a ``sysBaseObject`` instance. It acts as a recursive container, enabling hierarchical
object structures.

1. Initialization

In a custom object's constructor, initialize ``this.ChildObjects[]`` as an empty array:

.. code-block:: javascript

    this.ChildObjects = new Array(); //- Child Objects

2. Child-Parent Relationships

Each child object in the array is an instance of ``sysBaseObject`` or its derived classes.
A parent-child relationship is established using the ``ParentObject`` property.

.. code-block:: javascript

    //- Do something in the ParentObject
    this.ParentObject.doSomething();

    //- Do something in the ParentObject.ParentObject
    this.ParentObject.ParentObject.doSomething();

3. Adding Child Objects

Adding objects to a parent object is straightforward:

.. code-block:: javascript

    //- add new sysObjDiv()
    let Obj1 = new sysObjDiv();
    Obj1.ObjectID = 'MyDiv1';

    //- add Obj1 to parent
    this.addObject(Obj1);

Refer to: :ref:`sysBaseObject.addObject()` for more details.

4. Rendering Child Objects

To propagate changes to the DOM, render all child objects:

.. code-block:: javascript

    //- render all ParentObject.ChildObjects[]
    this.ParentObject.renderObject();

26.1.3. Event Handler / Callbacks
*********************************

Event handlers allow objects to process native DOM events. All event listeners
must be defined in the ``this.EventListeners[]`` array.

1. Initialize Event Listeners

In the constructor, initialize ``this.EventListeners[]`` as an empty array:

.. code-block:: javascript

    this.EventListeners = new Array(); //- Array of EventListener Objects

2. Adding Event Listeners

Add event listeners by defining their type and callback function:

.. code-block:: javascript

    let EventListenerObj = new Object();
    EventListenerObj['Type'] = 'mousedown'; //- Event Type 'mousedown'
    EventListenerObj['Element'] = this.EventListenerCallback.bind(this); //- Callback Method
    this.EventListeners['ListenerID'] = EventListenerObj; //- Add Listener with ListenerID

3. Activating Event Listeners

To activate added event listeners:

.. code-block:: javascript

    this.processEventListener();

4. sysButtonCallback Object

The ``sysButtonCallback`` *x0-object* abstracts common button interactions.
It simplifies event handling for buttons.

Refer to: :ref:`devporting`.

26.1.4. Building DOM Object Structure
*************************************

Refer to: :ref:`devporting` for detailed instructions on building DOM object structures.

26.1.5. Modifying Runtime Data
******************************

The following methods enable runtime data updates for *x0-objects*:

- **XML-RPC Async Call**: Fetches data asynchronously from remote services.
- **RuntimeSetData(data)**: Updates the object's current data.
- **RuntimeAppendData(data)**: Appends new data to the existing dataset.

26.1.6. Working With Realtime Objects
*************************************

For realtime objects, removing DOM nodes is often more efficient than complex
recursive updates. The *x0-framework* provides multiple methods:

1. remove()

Inherited from ``sysBaseObject``, this method removes the object from
``ParentObject.ChildObjects[]`` and deletes its corresponding DOM node.

Refer to: :ref:`devporting`.

2. removeParent()

Also inherited from ``sysBaseObject``, this method removes the parent
object and all its child objects from the DOM.

Refer to: :ref:`refid` for further details.

26.1.7. Object Loading / Initialization
***************************************

Objects registered with the *x0-core* system expose the following properties:

1. init()

The ``init()`` method is called during x0 system initialization (on page load).
Use this method to define initialization logic.

2. JSONConfig.Attributes

The object's JSON configuration is processed during system initialization and applies
throughout its lifecycle. Use ``JSONConfig.Attributes`` to define configuration data.

26.1.8. Adding Context Menu Functionality
*****************************************

To add context menu functionality, initialize event listeners and callbacks in the
``init()`` method. For example, ``sysObjDynRadioList.js`` uses a context menu for row removal:

1. Add Event Listeners

.. code-block:: javascript

    sysObjName.prototype.init = function()
    {
        if (this.JSONConfig.Attributes.CtxtMenu == true) {
            var EventListenerObj = new Object();
            EventListenerObj['Type'] = 'mousedown';
            EventListenerObj['Element'] = this.EventListenerRightClick.bind(this);
            this.EventListeners['ContextMenuOpen'] = EventListenerObj;
        }
    }

2. Context Menu Callback

.. code-block:: javascript

    sysObjName.prototype.EventListenerRightClick = function(Event)
    {
        var ContextMenuItems = [
            {
                "ID": "Remove",
                "TextID": "TXT.CONTEXTMENU.METHOD.REMOVE",
                "IconStyle": "fa-solid fa-paste",
                "InternalFunction": "remove"
            }
        ];

        //- check for right click on mousedown
        if (Event.button == 2 && ContextMenuItems !== undefined) {

            var ContextMenu = new sysContextMenu();

            ContextMenu.ID             = 'CtMenu_' + this.ObjectID;
            ContextMenu.ItemConfig     = ContextMenuItems;
            ContextMenu.ScreenObject   = sysFactory.getScreenByID(sysFactory.CurrentScreenID);
            ContextMenu.ParentObject   = this;
            ContextMenu.pageX          = Event.pageX;
            ContextMenu.pageY          = Event.pageY;

            ContextMenu.init();
        }
    }

26.1.9. Object Registration
***************************

After object-modeling has been finished, it must be added to the *x0-system*.

1. User Object Runtime Import

Refer to: :ref:`appdevconfig-object-templates`.

2. System Core Object

Register core *x0-system-objects* in ``sysFactory.js`` by adding them to
``sysFactory.SetupClasses``:

.. code-block:: javascript

    this.SetupClasses = {
            "NewObjectType": sysNewObjectType,
    }

26.1.10. Additional Examples
****************************

Check additional realtime processing code in the following system files:

- ``sysRTPagination.js``

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
