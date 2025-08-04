# Example #8 (Multi Tab Container)

This example demonstrates the use of a dynamic multi-tab container interface utilizing
**x0-system-objects** in the x0 JavaScript SPA Browser Framework.

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example8`

## Video

A demonstration video `x0-example-8-multi-tabcontainer.mkv` shows the example in action.

## Main Components

### 1. Overview

This example presents a flexible multi-tabbed interface, where each tab can contain different views,
such as data grids, lists, forms or any other **x0-object-type**. The implementation showcases how
**x0's** system objects can be composed to create interactive, modular, and highly customizable UI layouts
with seamless tab navigation. Also object-recursion between multiple hierarchical tabs is part of this
example as well as object content-preservation on (hierarchical) tab-switching.

### 2. TabContainers

- Configured a main TabContainer object:
  - Two Tabs by default.
    - "Tab number 1" – containing simple SQLText.
    - "Tab number 2" – containing another (recursive) TabContainer.
  - Tab Container 2.
    - "Tab number 1" - SQL Text 1
    - "Tab number 2" - SQL Text 2

### 3. Object Metadata

All UI and logic are defined in the respective `./static/object.json`.

- [Object Type SQLText Documentation](https://docs.webcodex.de/x0/v1.0/appdev-objects.html#sqltext)
- [Object Type TabContainer Documentation](https://docs.webcodex.de/x0/v1.0/appdev-objects.html#tabcontainer)

### 4. Usage

This example can be used as a template for:

- Dynamic multi-tab navigation and content switching
- Embedding any **x0-object-types** in tab content areas
- Real-time data synchronization and UI updates
- Demonstrating modular UI construction using the **x0-framework**.

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
