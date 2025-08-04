# Example #1 (Add Object Table Column)

This example demonstrates how to use the *x0-object* `sysObjObjList.js` to add
already existing *x0-object-types* `sysObjButton.js` and `sysObjFileUpload.js` dynamically as column data.

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example1`.

## Video

A simple video `x0-example-add-object-table-column.mkv` demonstrates how this example works.

## Main Components

### 1. `TestObjTable` Table
- Configured as a list/table with:
  - Custom styles for headers and rows.
  - Two columns by default.
    - "Column 1" – button without functionality
    - "Column 2" – file upload picker
  - Navigation options (2 pages).

### 2. Object Metadata

Inspect the examples JSON object metadata in `./static/object.json`.

[Object Type List Documentation](https://docs.webcodex.de/x0/v1.0/appdev-objects.html#list).
[Object Type FileUpload Documentation](https://docs.webcodex.de/x0/v1.0/appdev-objects.html#fileupload).

### 3. `TestObjTableConnector`

- A service connector object that fetches table data from a backend Python service (`/python/IntegrationTestGetTableData.py` or similar) on the `InitSystem` event.
- The backend data is irrelevant / not displayed, it merely serves the purpose to fill the table with row data.

### 4. Screen Composition

- The screen (`ScreenAddObjCol`) is composed by connecting the service connector and table using reference IDs, enabling modular and reusable UI configuration.

### 5. Column Configuration Syntax

The following JSON excerpt shows how to configure the two columns used in this example:

```json
Columns":
    [
        {
            "ID": "col1",
            "HeaderTextID": "TXT.TABLE.EXAMPLETABLECOLOBJECTS.HEADER.COL1",
            "Attributes": {
                "ObjectType": "ButtonInternal",
                "Style": "btn btn-secondary",
                "IconStyle": "fa-solid fa-martini-glass-empty",
                "TextID": "TXT.BUTTON.EXAMPLETABLECOLOBJECTS"
            }
        },
        {
            "ID": "col2",
            "HeaderTextID": "TXT.TABLE.EXAMPLETABLECOLOBJECTS.HEADER.COL2",
            "Attributes": {
                "ObjectType": "FileUpload",
                "TextID": "TXT.EXAMPLETABLECOLOBJECTS.UPLOAD",
                "Style": "md-3",
                "StyleDescription": "fst-italic",
                "StyleSelectButton": "",
                "StyleProgressContainer": "progress",
                "StyleUploadButton": "btn btn-primary",
                "StyleProgressBar": "progress-bar progress-bar-striped progress-bar-animated",
                "StyleProgressBarPercentage": "",
                "UploadScript": "/python/Upload.py"
            }
        }
    ]
```

> [!IMPORTANT]
> The **Attributes** *sub* element gets passes to each objects `init()` as `JSONConfig.Attributes`
> on row / column rendering.

## How It Works

1. On initialization, the `TestObjTableConnector` triggers a backend call to fetch table data.
2. The `TestObjTable` gets rendered independent of the backend data.
3. Rendering (all rows) contain "Column 1": the button without functionality, "Column 2": the fileupload picker.

## Usage

This example can be used as a template for:
- Configure *x0-object-type* `sysList` table columns with existing *x0-object-type* instances.
- Demonstrating modular, low-code UI construction using the x0 framework.

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
