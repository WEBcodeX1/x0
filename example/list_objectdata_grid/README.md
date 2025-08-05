# Example #7 (List Object Data Grid)

This example demonstrates how to build a dynamic, object-based data grid using **x0-system-type** `sysObjList.js`
in the x0 JavaScript SPA Browser Framework.

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example7`

## Video

[Download example video (VLC or MPV player recommended)](https://download.webcodex.de/x0/video/x0-example-7-list-object-data-grid.mkv).

## Main Components

### 1. Overview

This example showcases the integration of a list-driven data grid, where rows and columns are configured and rendered dynamically using the system object architecture of **x0**. It demonstrates multi-colpspanned-table-rows (containing real-time data), row/column grouping, and fully object-oriented data provisioning between grid, list, and backend.

### 2. Object Metadata

All UI and logic are defined in the respective `./static/object.json`.

- [Object Type List Documentation](https://docs.webcodex.de/x0/v1.0/appdev-objects.html#list)
- [Global Grid System Documentation](https://docs.webcodex.de/x0/v1.0/appdev-global.html)

### 3. Technical Details

- **Object Data Grid**
  Built using a global **x0-grid-renderer** `sysGridGenerator.js`).
- **Colspan Table Rows**
  The table fetches data from the backend and renders as multi-columns containing a 3 column colspan every 2 rows.
- **Muiltiline Row-Record**
  A single data (row) containing multiple column data can be display-formated (CSS) over multiple table (grid) rows.
- **Row Selection**
  Clicking a row highlights it/shows highliting over >1 (multiple) lines.
- **Backend Integration:**
  The data grid synchronizes with a backend Python service by using **x0** `ServiceConnector`, demonstrating live data feeding to the grid enabled table.

### 3. Usage

This example can be used as a template for:

- Dynamic object-driven data grid rendering
- Grid tables containing multi-row records
- Demonstrating modular UI construction using the **x0-framework**.

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
