/**
 * recursive_object_data_examples.js
 *
 * Demonstrates all supported scenarios for the recursive object data API:
 *
 *   getObjectData(recursive=true)  -- hierarchical getter
 *   setObjectData(data, recursive=true) -- hierarchical setter with per-node
 *                                          "Action": "set" | "append" support
 *
 * Paste individual scenarios into the browser console after the x0-application
 * has finished initialising, or call them from a userFunctions.js callback
 * that is wired to a Button / ButtonInternal action.
 *
 * Object-tree assumed by scenarios 3-10
 * ──────────────────────────────────────
 *
 *   RootContainer  (Div - pure container, no RuntimeGetDataFunc)
 *   ├── Container1  (Div - pure container)
 *   │   ├── MyList1   (List  - has RuntimeGetDataFunc / RuntimeSetDataFunc / RuntimeAppendDataFunc)
 *   │   └── MyList2   (List  - has RuntimeGetDataFunc / RuntimeSetDataFunc / RuntimeAppendDataFunc)
 *   └── Container2  (Div - pure container)
 *       ├── MyForm1   (FormfieldList - has RuntimeGetDataFunc / RuntimeSetDataFunc)
 *       └── MyProgress1 (ProgressBar - has RuntimeGetDataFunc / RuntimeSetDataFunc)
 */


// =============================================================================
// Scenario 1 – Flat single-object GET (non-recursive baseline)
// =============================================================================
// Returns the raw value from RuntimeGetDataFunc of one specific object.
// Identical to the pre-existing single-object behaviour.

var scenario1 = function()
{
    var FormObj = sysFactory.getObjectByID('MyForm1');
    var Data = FormObj.getObjectData();
    console.log('Scenario 1 – single-object get:', Data);
};


// =============================================================================
// Scenario 2 – Flat single-object SET (non-recursive baseline)
// =============================================================================
// Calls RuntimeSetDataFunc directly on one object.

var scenario2 = function()
{
    var ProgressObj = sysFactory.getObjectByID('MyProgress1');
    ProgressObj.setObjectData(42);
    console.log('Scenario 2 – single-object set: progress set to 42');
};


// =============================================================================
// Scenario 3 – Recursive GET from a container root
// =============================================================================
// Walks the entire subtree of RootContainer.
// Returns a flat map: { MyList1: <value>, MyList2: <value>,
//                       MyForm1: <value>, MyProgress1: <value> }
// Pure containers (no RuntimeGetDataFunc) are transparently skipped.

var scenario3 = function()
{
    var RootObj = sysFactory.getObjectByID('RootContainer');
    var Data = RootObj.getObjectData(true);
    console.log('Scenario 3 – recursive get from root:', Data);
};


// =============================================================================
// Scenario 4 – Recursive SET on a leaf object inside a container
// =============================================================================
// Sets the progress bar value through the recursive setter.
// The hierarchy wrapper is required even for a single leaf to use the
// recursive path.

var scenario4 = function()
{
    var RootObj = sysFactory.getObjectByID('RootContainer');
    RootObj.setObjectData(
        {
            "ObjectIDs":
            {
                "Container2":
                {
                    "ObjectIDs":
                    {
                        "MyProgress1": 75
                    }
                }
            }
        },
        true
    );
    console.log('Scenario 4 – recursive set leaf (progress to 75)');
};


// =============================================================================
// Scenario 5 – Recursive SET on a list object (array data)
// =============================================================================
// Passes an array directly to a List object via the recursive setter.
// Arrays are dispatched to RuntimeSetDataFunc without any Action directive.

var scenario5 = function()
{
    var RootObj = sysFactory.getObjectByID('RootContainer');
    RootObj.setObjectData(
        {
            "ObjectIDs":
            {
                "Container1":
                {
                    "ObjectIDs":
                    {
                        "MyList1":
                        [
                            {
                                "ObjectIDs":
                                {
                                    "Column1": { "Property1": "Row1-Col1" },
                                    "Column2": { "Property1": "Row1-Col2" }
                                }
                            },
                            {
                                "ObjectIDs":
                                {
                                    "Column1": { "Property1": "Row2-Col1" },
                                    "Column2": { "Property1": "Row2-Col2" }
                                }
                            }
                        ]
                    }
                }
            }
        },
        true
    );
    console.log('Scenario 5 – recursive set list with 2 rows');
};


// =============================================================================
// Scenario 6 – Recursive SET across two sibling containers
// =============================================================================
// Sets data in Container1 and Container2 in a single call.

var scenario6 = function()
{
    var RootObj = sysFactory.getObjectByID('RootContainer');
    RootObj.setObjectData(
        {
            "ObjectIDs":
            {
                "Container1":
                {
                    "ObjectIDs":
                    {
                        "MyList1":
                        [
                            {
                                "ObjectIDs":
                                {
                                    "Column1": { "Property1": "A" },
                                    "Column2": { "Property1": "B" }
                                }
                            }
                        ]
                    }
                },
                "Container2":
                {
                    "ObjectIDs":
                    {
                        "MyProgress1": 30
                    }
                }
            }
        },
        true
    );
    console.log('Scenario 6 – recursive set across two containers');
};


// =============================================================================
// Scenario 7 – Recursive SET with explicit "Action": "set" directive
// =============================================================================
// The Action directive is optional when setting; it makes the intent explicit.

var scenario7 = function()
{
    var RootObj = sysFactory.getObjectByID('RootContainer');
    RootObj.setObjectData(
        {
            "ObjectIDs":
            {
                "Container1":
                {
                    "ObjectIDs":
                    {
                        "MyList1":
                        {
                            "Action": "set",
                            "Data":
                            [
                                {
                                    "ObjectIDs":
                                    {
                                        "Column1": { "Property1": "Set-Row1-Col1" },
                                        "Column2": { "Property1": "Set-Row1-Col2" }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        true
    );
    console.log('Scenario 7 – explicit Action:set on MyList1');
};


// =============================================================================
// Scenario 8 – Recursive SET with explicit "Action": "append" directive
// =============================================================================
// Appends rows to MyList1 without clearing existing data.
// Requires RuntimeAppendDataFunc to be defined on the target object (sysList has it).

var scenario8 = function()
{
    var RootObj = sysFactory.getObjectByID('RootContainer');
    RootObj.setObjectData(
        {
            "ObjectIDs":
            {
                "Container1":
                {
                    "ObjectIDs":
                    {
                        "MyList1":
                        {
                            "Action": "append",
                            "Data":
                            [
                                {
                                    "ObjectIDs":
                                    {
                                        "Column1": { "Property1": "Appended-Row-Col1" },
                                        "Column2": { "Property1": "Appended-Row-Col2" }
                                    }
                                }
                            ]
                        }
                    }
                }
            }
        },
        true
    );
    console.log('Scenario 8 – explicit Action:append on MyList1');
};


// =============================================================================
// Scenario 9 – Mixed SET and APPEND in one call across nested containers
// =============================================================================
// MyList1 receives a fresh dataset (set), while MyList2 gets additional rows
// appended (append), and MyProgress1 is updated to a new value – all in a
// single setObjectData call.

var scenario9 = function()
{
    var RootObj = sysFactory.getObjectByID('RootContainer');
    RootObj.setObjectData(
        {
            "ObjectIDs":
            {
                "Container1":
                {
                    "ObjectIDs":
                    {
                        "MyList1":
                        {
                            "Action": "set",
                            "Data":
                            [
                                {
                                    "ObjectIDs":
                                    {
                                        "Column1": { "Property1": "Fresh-Row1-Col1" },
                                        "Column2": { "Property1": "Fresh-Row1-Col2" }
                                    }
                                }
                            ]
                        },
                        "MyList2":
                        {
                            "Action": "append",
                            "Data":
                            [
                                {
                                    "ObjectIDs":
                                    {
                                        "Column1": { "Property1": "Extra-Row1-Col1" },
                                        "Column2": { "Property1": "Extra-Row1-Col2" }
                                    }
                                }
                            ]
                        }
                    }
                },
                "Container2":
                {
                    "ObjectIDs":
                    {
                        "MyProgress1": 90
                    }
                }
            }
        },
        true
    );
    console.log('Scenario 9 – mixed set+append across containers');
};


// =============================================================================
// Scenario 10 – Recursive GET after recursive SET (round-trip verification)
// =============================================================================
// Sets known values using scenario 6, then reads them back recursively and
// logs the round-trip result for verification.

var scenario10 = function()
{
    // 1. Write known data
    scenario6();

    // 2. Read back the entire subtree
    var RootObj = sysFactory.getObjectByID('RootContainer');
    var Data = RootObj.getObjectData(true);
    console.log('Scenario 10 – round-trip verification, recursive get after set:', Data);
};
