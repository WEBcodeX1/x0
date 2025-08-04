# Example #6 (Screen Overlay)

This example demonstrates the use of a dynamic screen overlay using **x0-system-objects**
in the x0 JavaScript SPA Browser Framework.

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example6`

## Video

A demonstration video `x0-example-6-screen-overlay.mkv` shows the example in action.

## Main Components

### 1. Overview

This example showcases how to create and manage overlay screens that appear above the
main application interface. Overlays are useful for dialogs, notifications, modals, wizards,
and any UI elements that need to temporarily take focus while dimming or disabling the background.

### 2. Overlay Objects

- Simple SQLText.
- Overlay Button (opens overlay on-click).
  - Overlay TabContainer.
    - Two Tabs by default.
      - "Tab number 1" – containing FileUpload picker.
      - "Tab number 2" – containing simple SQLText.

### 3. Object Metadata

All UI and logic are defined in the respective `./static/object.json`.

- [Global Overlay Documentation](https://docs.webcodex.de/x0/v1.0/appdev-overlay.html)

### 4. Usage

- Creation and control of modal overlay screens
- Embedding any x0-system-object within overlays
- Demonstrating modular UI construction using the **x0-framework**.

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
