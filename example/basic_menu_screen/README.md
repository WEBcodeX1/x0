# Example #2 (Basic Menu Screen)

This example demonstrates how to use the **x0-framework** to implement a basic menu **x0-screen** with navigation options.
It highlights how to configure a simple and modular single-page application layout using reusable **x0-objects** and declarative metadata.

Additionally it shows **x0-object-consistency** over switching **x0-screens** (navigating from "Screen1" to "Screen2" and vice versa).

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example2`

## Video

A demonstration video `x0-example-basic-menu-screen.mkv` illustrates the menu screen in action.

## Main Components

### 1. `MainMenu` Object

- Configured as a menu/navigation bar.
- Contains 2 menu items, each linked to a different **x0-screen** (app page).
- Customizable styles and icons/ hierarchical **x0-object** skeleton.json like config for menu entries.
- 2 screen links / buttons a) "Screen1" and b) "Screen2".
- "Screen1" contains `sysObjList` **x0-object-type** filled with backend data (2 pages).
- "Screen2" contains `sysObjTabContainer` **x0-object-type** containing 2 tabs.

### 2. Object Metadata

Inspect this example’s JSON object metadata in `./static/object.json`.

- [Basic Configuration Documentation](https://docs.webcodex.de/x0/v1.0/appdev-config.html)

### 3. Menu Configuration Syntax

An example JSON excerpt for configuring the menu skeleton (`./static/menu.json`):

```json
[
    {
        "Link1":
        {
            "RefID": "sysMenu"
        }
    },
    {
        "Link2":
        {
            "RefID": "sysMenu"
        }
    }
]
```

An example JSON excerpt for configuring the menu objects (`./static/object.json`):

```json
{
    "Link1":
    {
        "Type": "Link",
        "Attributes": {
            "Style": "btn btn-secondary",
            "TextID": "TXT.MENU.BASICEXAMPLE.SCREEN1",
            "ScreenID": "Screen1"
        }
    },

    "Link2":
    {
        "Type": "Link",
        "Attributes": {
            "Style": "btn btn-secondary",
            "TextID": "TXT.MENU.BASICEXAMPLE.SCREEN2",
            "ScreenID": "Screen2"
        }
    }
}
```

## How It Works

1. On initialization, the menu object is rendered with all configured menu items.
2. When a menu item is selected, the corresponding **x0-screen** (app page) is loaded (navigation).
3. All object states are preserved on any navigation action (*menu* or *tab-container*).

## Usage

This example can be used as a template for:

- Creating a basic navigation menu in x0 applications.
- Serving as a starting point for more complex SPA navigation layouts.
- Demonstrating modular UI construction using the **x0-framework**.

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
