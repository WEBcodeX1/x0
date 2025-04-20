.. dev-object-modeling

.. _devobjectmodeling:

21. x0-Object Modeling
======================

The following sections describe how-to model self-programmed *x0-system-objects*
and their specification before they can be integrated into the base system.

21.1. Basic Building Rules
--------------------------

You should be familiar with the following x0-basics before continuing:

- Base Classes / Inheritance
- Child Objects
- Event Handler / Callbacks
- Building Object Structure (DOM)
- Modifying Runtime Data

21.1.1. Base Classes / Inheritance
**********************************

You should be familiar with the x0 *Core Base Model*, see:

21.1.2. Child Objects
*********************

21.1.3. Event Handler / Callbacks
*********************************

21.1.4. Building / Porting DOM Object Structure
***********************************************

21.1.5. Modifying Runtime Data
******************************


21.2. Building an Object Like sysObjDynRadioList.js
---------------------------------------------------

This section explains how to create a dynamic system object similar to
`sysObjDynRadioList.js` in the x0 framework. It focuses on the structure,
methods, and key principles used in `sysObjDynRadioList`.

- Overview

The sysObjDynRadioList is a dynamic object designed to manage a list of radio
buttons, with rows that can be added or removed at runtime. Each row includes a
radio button, an input field, and associated controls.

- Key Components:

    1. Base Object Inheritance: Inherits from sysBaseObject for core functionality.
    2. Dynamic Rows: Rows are represented by sysObjDynRadioListRow, which also inherits from sysBaseObject.
    3. Callbacks and Events: Used for adding/removing rows and handling user interactions.
    4. JSON Configuration: Utilized for defining object attributes and styles.

- Step-by-Step Guide

21.2.1. Create the Base Class
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

21.2.2. Initialize the Object
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

21.2.3. Define the Row Class
****************************

Each row in the list is represented by sysObjDynRadioListRow. This class manages its elements (radio button, input field, and optional remove button):

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

21.2.4. Add Rows Dynamically
****************************

The add method in sysObjDynRadioList creates new rows dynamically:

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

21.2.5. Handle Row Removal
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

21.2.6. Define Object Structure
*******************************

Use the addObjects method to define the DOM structure for each row:

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

21.2.7. Conclusion
******************

By following this guide, you can create dynamic objects similar to sysObjDynRadioList.js.
The key is leveraging the x0 system's object-oriented framework, callbacks, and
JSON-based DOM configuration. You can extend this structure further based on
your application's specific requirements.
