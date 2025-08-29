# Example #15 (Tree Simple)

This example demonstrates how to use the **TreeSimple** system object in the x0 JavaScript SPA Browser Framework. It showcases hierarchical tree structures with expandable/collapsible nodes, FontAwesome icons, and navigation capabilities between different screens.

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example15`

## Video

[Download example video (VLC or MPV player recommended)](https://download.webcodex.de/x0/video/x0-example-15-tree-simple.mkv).

## Main Components

### 1. TreeSimple System Objects

This example includes two different TreeSimple configurations:

- **TreeSimpleElement1**: A basic tree with two main nodes and simple navigation items
- **TreeSimpleElement2**: An advanced tree featuring nested sub-nodes and more complex hierarchical structures

### 2. Tree Structure Features

#### Node Types
- **Nodes**: Expandable/collapsible containers with FontAwesome icons
- **Items**: Interactive navigation elements that switch between screens

#### Tree Navigation
The tree items provide navigation functionality:
- Click tree items to switch between Screen1, Screen2, and Screen3
- Tree state is preserved during navigation
- Visual selection indicators highlight the active tree item

### 3. Screen Layouts

- **Screen1**: Displays TreeSimpleElement1 in a collapsible container
- **Screen2**: Shows TreeSimpleElement2 with enhanced tree structure
- **Screen3**: Demonstrates side-by-side tree layout with both tree elements

### 4. OpenCloseContainer Integration

Each tree is wrapped in an OpenCloseContainer, providing:
- Collapsible container headers with descriptive titles
- Left and right positioning options for flexible layouts
- State management for container visibility

## How It Works

1. **Tree Initialization**: TreeSimple objects are configured with hierarchical JSON metadata defining nodes and items
2. **Icon Integration**: FontAwesome icons provide visual cues for different node and item types
3. **Navigation**: Tree items trigger screen navigation while maintaining tree state consistency
4. **Expandable Nodes**: Users can expand/collapse tree nodes using caret controls
5. **Visual Feedback**: Hover effects and selection indicators enhance user interaction

## Object Metadata

All UI components and tree structures are defined in the respective `./static/object.json`. The tree configuration includes:

```json
{
    "Type": "TreeSimple",
    "Attributes": {
        "TreeItems": [
            {
                "Type": "Node",
                "TextID": "TXT.NODE1",
                "Icon": "fa-solid fa-hexagon-nodes",
                "Children": [
                    {
                        "Type": "Item",
                        "TextID": "TXT.ITEM1",
                        "Icon": "fa-solid fa-code-branch",
                        "ScreenID": "Screen1"
                    }
                ]
            }
        ]
    }
}
```

## Usage

This example can be used as a template for:

- Creating hierarchical navigation menus with expandable categories
- Building file explorer-style interfaces
- Implementing sidebar navigation with nested menu structures
- Demonstrating tree-based data organization in x0 applications
- Showcasing integration between TreeSimple and OpenCloseContainer objects

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
>>>>>>> main
