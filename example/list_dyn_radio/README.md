# Example #12 (Dynamic Radio List)

Example #12 demonstrates the enhanced *x0-system-object* `sysObjDynRadioList.js`
in action. It showcases how the *x0-system* enables flexible, realtime UI
lists—dynamically bound to a List column.

## URL

Open URL:`http://x0-app.x0.localnet/python/Index.py?appid=example12`.

## Video

A simple video `x0-example-12-dyn-radio-button-list.mkv` demonstrates how this example works.

## Main Components

### 1. `TestList1` Table

- Configured as a list/table with:
  - Custom styles for headers and rows.
  - Two columns:
    - A text column "Column 1".
    - A dynamic radio list column "Column 2", defined by `ObjectType: DynRadioList`.
  - Data source with backend-provided data.
  - Navigation options (3 pages).

### 2. Object Metadata

Inspect the examples JSON object metadata in `./static/object.json`.

[Object Type List Documentation](https://docs.webcodex.de/x0/v1.0/appdev-objects.html#list).

### 3. `TestList1Connector`

- A service connector object that fetches table data from a backend Python service (`/python/IntegrationTestGetTableData.py`) on the `InitSystem` event.

### 4. Screen Composition

- The screen (`Screen1`) is composed by connecting the service connector and table together using reference IDs, enabling modular and reusable UI configuration.

### 5. Real Time Manipulation

- One radio button element can be appended to the dynamic radio list column in realtime by pressing the **+ add** button.
- An already added radio button element can be removed from the dynamic radio list column in realtime by pressing the **- rem** button.
- An already added radio button element can also be removed by right-clicking the element and selecting *Remove*.
- Pressing a navigation button on bottom (1 to 3 list pages) demonstrates the rock solid *x0-consistent-object-state* feature.

### 6. Object Implementation

A system-developer should take a closer look at `sysObjDynRadioList.js`, it is a
well-suited, enhanced realtime-feature implementation example.

## How It Works

1. On initialization, the `TestList1Connector` triggers a backend call to fetch table data.
2. The `TestList1` table is populated with this data, displaying one column with standard text and another with a dynamic set of radio buttons for each row.
3. The configuration is fully declarative, making it easy to adapt to different data sources or UI requirements.

## Usage

This example can be used as a template for:
- Dynamic realtime object rendering.
- Creating dynamic list table columns with custom input controls (like radio buttons).
- Integrating backend data sources in a low-code or configuration-driven manner.
- Demonstrating modular UI construction using the x0 framework.

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
