# Dynamic Radio List Example (`list_dyn_radio`)

This example demonstrates how to build a dynamic table component with radio button
lists using the x0 framework, focusing on realtime object manipulation (**add**, **remove**).
The configuration is data-driven and showcases integration between static JSON definitions and
backend service connectors, enabling flexible UI generation and dynamic data loading.

## URL

Example is accessible by calling URL:`http://x0-app.x0.localnet/python/Index.py?appid=example12`.

## Video

A simple video `x0-example-12-dyn-radio-button-list.mkv` demonstrates how this example works.

## Directory Structure

- `static/`
  - `object.json`: Defines UI objects, including a link, a service connector, and a table (`TestList1`) with dynamic radio list columns.
  - `skeleton.json`: Specifies the screen layout and object composition.
  - `menu.json`: (Not shown) Defines menu/navigation structure.
- `sql/`
  - `insert-txt.sql`: (Not shown) Inserts example text or labels for UI localization.
  - `sys-config.sql`: (Not shown) Provides system configuration or initial setup for the example.

## Main Components

### 1. `TestList1` Table
- Configured as a list/table with:
  - Custom styles for headers and rows.
  - Two columns:
    - A text column.
    - A dynamic radio list column, defined by `ObjectType: DynRadioList`.
  - Data source that supports both hardcoded and backend-provided data.
  - Navigation and selection options.

### 2. `TestList1Connector`
- A service connector object that fetches table data from a backend Python service (`/python/IntegrationTestGetTableData.py`) on the `InitSystem` event.

### 3. Screen Composition
- The screen (`Screen1`) is composed by connecting the service connector and table together using reference IDs, enabling modular and reusable UI configuration.

### 4. Real Time Manipulation

- One radio button element can be appended to the dynamic radio list column in realtime by pressing the **+ add** button.
- An already added radio button element can be removed from the dynamic radio list column in realtime by pressing the **- rem** button.
- An already added radio button element can also be removed by right-clicking the element and selecting *Remove*.
- Pressing a navigation button on bottom (1 to 3 list pages) demonstrates the rock solid *x0-consistent-object-state* feature.

### 5. Object Implementation

How it is implemented:
- sysObjDynRadioList.js

## How It Works

1. On initialization, the `TestList1Connector` triggers a backend call to fetch table data.
2. The `TestList1` table is populated with this data, displaying one column with standard text and another with a dynamic set of radio buttons for each row.
3. The configuration is fully declarative, making it easy to adapt to different data sources or UI requirements.

## Usage

This example can be used as a template for:
- Creating dynamic data tables with custom input controls (like radio buttons).
- Integrating backend data sources in a low-code or configuration-driven manner.
- Demonstrating modular UI construction using the x0 framework.

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
