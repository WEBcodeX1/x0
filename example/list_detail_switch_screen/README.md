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

## 2. Key Features Demonstrated

- Dynamic master-detail UI synchronization.
- Real-time UI updates using **x0-system-objects**.
- Event-driven component communication (`sysReactor.js`).
- Demonstrating modular UI construction using the **x0-framework**.
