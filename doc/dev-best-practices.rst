.. dev-porting

.. _devporting:

29. Application Porting
=======================

This document explains how to port an existing web application, particularly
its DOM/HTML structure, into the *x0-framework*. It focuses on transforming frameworks
like Bootstrap into *x0-format* while leveraging the framework's object-oriented
principles.

Extended object modeling and programming references are available in the relevant
documentation sections.

29.1. Introduction
-------------------

Porting a web application into *x0* involves converting static HTML and dynamically
referenced JavaScript components into reusable and modular *x0-objects*. This ensures
that the application benefits from the framework's robust event handling, runtime data
manipulation, and hierarchical object model.

Key processes include:

1. Converting HTML DOM elements into ``sysBaseObject``-derived objects.
2. Using JSON configuration for object initialization and styling.
3. Structuring the application into reusable components.

For additional modeling references, see: :ref:`devobjectmodeling`.

29.2. Modern Approach
---------------------

The *modern approach* to porting focuses on recursive object referencing and
modularization. This method ensures scalability and maintainability by leveraging
the ``sysFactory.setupObjectRefsRecursive()`` function.

29.2.1. Recursive Referencing
*****************************

Using ``sysFactory.setupObjectRefsRecursive()`` allows you to:

- Define hierarchical object structures in JSON format.
- Automatically initialize, configure, and render objects recursively.
- Simplify the process of converting nested DOM elements into *x0-objects*.

29.2.2. Example: Recursive Object Definition
********************************************

The following example demonstrates how to structure a Bootstrap-formatted
component into a recursive *x0-object* hierarchy:

.. code-block:: javascript

    const ObjDefs = [
        {
            "id": "container",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": { "Style": "container-fluid" },
            "ObjectDefs": [
                {
                    "id": "row",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": { "Style": "row" },
                    "ObjectDefs": [
                        {
                            "id": "col",
                            "SysObject": new sysObjDiv(),
                            "JSONAttributes": { "Style": "col-md-4" },
                            "ObjectDefs": [
                                {
                                    "id": "btn",
                                    "SysObject": new sysObjButton(),
                                    "JSONAttributes": {
                                        "Style": "btn btn-primary",
                                        "TextID": "TXT.BUTTON.CLICK_ME"
                                    }
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    ];

    // Initialize and render objects recursively
    sysFactory.setupObjectRefsRecursive(ObjDefs, this);

This example converts a Bootstrap container, row, and column with a button
into an *x0-object* hierarchy.

29.3. Simple Referencing
------------------------

The *simple referencing* approach is ideal for small or isolated components.
It does not require deep nesting or complex hierarchies.

29.3.1. Example: Simple Object Initialization
*********************************************

Here is an example of defining and adding a single object without recursion:

.. code-block:: javascript

    const Btn = new sysObjButton();
    Btn.ObjectID = "SimpleButton";
    Btn.JSONConfig = {
        "Attributes": {
            "Style": "btn btn-secondary",
            "TextID": "TXT.BUTTON.SUBMIT"
        }
    };

    this.addObject(Btn);

In this case, the button is directly added to ``this`` object.
This method is straightforward but less flexible for scaling or reusing components.

29.4. Combining Modern and Simple Approaches
--------------------------------------------

In practice, you may need to combine modern and simple referencing techniques.
For example:

- Use recursive referencing for defining the application's primary structure.
- Use simple referencing for dynamically adding or modifying objects at runtime.

29.4.1. Example: Combined Approach
**********************************

.. code-block:: javascript

    // Define the main structure recursively
    const ObjDefs = [
        {
            "id": "mainContainer",
            "SysObject": new sysObjDiv(),
            "JSONAttributes": { "Style": "container" },
            "ObjectDefs": [
                {
                    "id": "header",
                    "SysObject": new sysObjDiv(),
                    "JSONAttributes": { "Style": "header" }
                }
            ]
        }
    ];

    sysFactory.setupObjectRefsRecursive(ObjDefs, this);

    // Add a dynamic object later using simple referencing
    const DynamicBtn = new sysObjButton();
    DynamicBtn.ObjectID = "DynamicButton";
    DynamicBtn.JSONConfig = {
        "Attributes": {
            "Style": "btn btn-warning",
            "TextID": "TXT.BUTTON.DYNAMIC"
        }
    };

    this.addObject(DynamicBtn);

This approach maximizes the flexibility of the *x0-framework*,
combining the strengths of both methods.

29.5. Best Practices
--------------------

Follow these best practices when porting applications into *x0*:

1. **Modularize Components**:
   - Break down the application into reusable components using `sysBaseObject` and its derivatives.
   - Use JSON configurations to define attributes and styles.

2. **Leverage Recursive Referencing**:
   - Use `sysFactory.setupObjectRefsRecursive()` for defining complex hierarchies.
   - Avoid hardcoding child object structures.

3. **Optimize Event Handling**:
   - Use `this.EventListeners[]` for native DOM events.
   - Define reusable callbacks for common interactions.

4. **Test Incrementally**:
   - Test each component independently before integrating it into the application.
   - Use the browser's developer tools for debugging DOM and JavaScript issues.

5. **Document Components**:
   - Provide clear documentation for each reusable component, including its JSON configuration and expected behavior.

29.6. Additional Resources
--------------------------

For more information, see:
- :ref:`devobjectmodeling` for object modeling and hierarchy design.
- ``/examples`` directory for practical examples of ported applications.
- ``sysFactory.js`` for details on ``setupObjectRefsRecursive()``.

By following this guide, you can efficiently port existing web applications into
the *x0-framework*, leveraging its powerful object-oriented and modular architecture.
