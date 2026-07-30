# Example #16: Drag and Drop

This example demonstrates how to implement drag-and-drop functionality in the **x0-framework**,
enabling objects to be dragged between UI components for seamless data transfer.

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example16`

## Scenarios Demonstrated

### 1. List → List (Append by Drag)

- **Source**: `sysObjList.js` (`SourceList`) configured with `"DragSource": true`.
- **Target**: `sysObjList.js` (`DestinationList`) configured with `"DropTarget": true`.
- Drag any row from the **Source List** tab and drop it onto the **Destination List** in the
  **Drop Targets** tab. The row data is appended to the destination list.

### 2. List → FormfieldList (Set Form Data by Drag)

- **Source**: same `SourceList` above.
- **Target**: `sysObjFormfieldList.js` (`DestinationForm`) configured with `"DropTarget": true`.
- Drag any row from the **Source List** tab and drop it onto the **Form Drop Target** in the
  **Drop Targets** tab. The row data populates the form fields.

### 3. Tree Item → Tree Node (Move by Drag)

- **Tree**: `sysObjTreeSimple.js` (`DragDropTree`) configured with both `"DragSource": true`
  and `"DropTarget": true`.
- In the **Tree** tab, drag any item from one node and drop it onto another node's header.
  The item is moved to the target node's children list.

## Configuration

All drag-and-drop behaviour is declared declaratively in `object.json`:

| Object type      | Attribute      | Effect                                    |
|------------------|----------------|-------------------------------------------|
| `List`           | `DragSource: true` | Rows can be dragged as data sources   |
| `List`           | `DropTarget: true` | Rows from other lists can be dropped  |
| `FormfieldList`  | `DropTarget: true` | Dragged row data sets the form fields |
| `TreeSimple`     | `DragSource: true` | Tree items can be dragged             |
| `TreeSimple`     | `DropTarget: true` | Tree nodes accept dropped items       |

## Visual Feedback

Drop targets highlight with a dashed blue outline (`.sysDragDropOver`) while a draggable
object is hovered over them.

## Main Components

- [`sysObjList.js`](../../../www/sysObjList.js) — drag source rows and drop target list
- [`sysObjFormfieldList.js`](../../../www/sysObjFormfieldList.js) — drop target form
- [`sysObjTreeSimple.js`](../../../www/sysObjTreeSimple.js) — drag source items and drop target nodes
- [`sysDragDropHandler.js`](../../../www/sysDragDropHandler.js) — central coordinator

## Object Metadata

All UI and logic are defined in `./static/object.json`.

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
