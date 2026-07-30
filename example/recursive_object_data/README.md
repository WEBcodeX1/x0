# Example: Recursive Object Data Get / Set

This example demonstrates the recursive **get** and **set** API introduced in
`sysBaseObject`: `getObjectData(recursive=true)` and
`setObjectData(data, recursive=true)`.

The scenarios below can be pasted into the browser console (or into a
`userFunctions.js` callback) after the x0-application has finished loading.
They use `sysFactory.getObjectByID()` to locate objects in the live object
tree and then exercise every combination of the recursive API.

## Scenario Overview

| # | Description |
|---|-------------|
| 1 | Flat single-object **get** (non-recursive, baseline) |
| 2 | Flat single-object **set** (non-recursive, baseline) |
| 3 | Recursive **get** from a container root |
| 4 | Recursive **set** on a leaf object inside a container |
| 5 | Recursive **set** on a list object (array data) |
| 6 | Recursive **set** across two sibling containers |
| 7 | Recursive **set** with explicit `"Action": "set"` directive |
| 8 | Recursive **set** with explicit `"Action": "append"` directive |
| 9 | Mixed **set** and **append** in one call across nested containers |
| 10 | Recursive **get** after recursive **set** (round-trip verification) |

See `recursive_object_data_examples.js` for the full, runnable code.

## Related Documentation

- [sysBaseObject.getObjectData / setObjectData](https://docs.webcodex.de/x0/v1.1/dev-oop-classes.html#sysbaseobject-getobjectdata)
- [System Objects](https://docs.webcodex.de/x0/v1.1/appdev-objects.html)
