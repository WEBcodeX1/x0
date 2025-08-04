# Example #13: (Copy & Paste)

This example demonstrates how to implement copy and paste functionality in the **x0-framework**,
utilizing **x0-objects** and context-menu (right-click) actions for seamless clipboard interactions
between **x0-object-type** `sysObjList.js` (row-data source) and `sysObjFormfieldList.js` (destination)
in a single-page application.

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example13`

## Video

A demonstration video `x0-example-13-copy-paste.mkv` shows the example in action.

## Main Components

### 1. `CopyPaste` Objects

- **x0-object-type** `sysObjList.js` (row) configured with a `sysObjContextMenu.js` providing "Get Data" functionality.
- **x0-object-type** `sysObjFormfieldList.js` configured with a `sysObjContextMenu.js` providing "Set Data" functionality.
- Source Object placed inside `sysObjTabContainer.js` Tab1 "Source Data".
- Destination Object placed inside `sysObjTabContainer.js` Tab2 "Destination Data".
- On context-menu right-click on `List` row in Tab1 "Source Data": select row data to clipboard.
- On context-menu right-click on `FormfieldList` in Tab1 "Destination" (complete formfield area): paste row data to object.

### 2. Object Metadata

All UI and logic are defined in the respective `object.json` metadata file, found at `./static/object.json`.

- [Object Type List Documentation](https://docs.webcodex.de/x0/v1.0/appdev-objects.html#list)
- [Object Type TabContainer Documentation](https://docs.webcodex.de/x0/v1.0/appdev-objects.html#tabcontainer)
- [Object Types FormFields Documentation](https://docs.webcodex.de/x0/v1.0/appdev-objects.html#formfield-objects)

### 3. x0 ContextMenu / Action System

- All clipboard actions are declared via metadata in `object.json` for all **x0-object-types** supporting `ContextMenu` operation, ensuring a low-code, declarative approach.

## Usage

This example can be used as a template for:

- Adding clipboard features to any **x0-object-type** `List`.
- Adding clipboard features to any **x0-object-type** `FormfieldList`.
- Demonstrating x0’s declarative `ContextMenu` action system.
- Quickly creating user-friendly forms with copy/paste in enterprise SPAs.
- Demonstrating modular UI construction using the **x0-framework**.

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
