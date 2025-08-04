# Example #14 (List Detail Switch Screen)

This example demonstrates a classic master-detail interface with dynamic screen switching
using **x0-system-objects** in the x0 JavaScript SPA Browser Framework.

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example14`

## Video

A demonstration video `x0-example-4-list-detail-switch-screen.mkv` shows the example in action.

## Main Components

### 1. Overview

This example implements a two-pane layout:

- **List Area:** Displays a collection of row-items (records from `ServiceConnector` connected service).
- **Detail Area:** Shows detailed information for the selected item, and can switch between different detail views.

Switching the selection in the list instantly updates the detail pane, demonstrating real-time data binding and component communication.

### 2. Object Metadata

All UI and logic are defined in the respective `./static/object.json`.

- [Object Type List Documentation](https://docs.webcodex.de/x0/v1.0/appdev-objects.html#list)
- [Object Type TabContainer Documentation](https://docs.webcodex.de/x0/v1.0/appdev-objects.html#tabcontainer)
- [Object Types FormFields Documentation](https://docs.webcodex.de/x0/v1.0/appdev-objects.html#formfield-objects)

### 3. Usage

This example can be used as a template for:

- Dynamic master-detail UI synchronization.
- Event-driven component communication between **x0-system-objects** (`sysReactor.js`).
- Demonstrating modular UI construction using the **x0-framework**.

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
