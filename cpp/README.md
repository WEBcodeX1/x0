# x0 C++ Framework

C++ variant of the x0 JavaScript framework using **Qt** for graphical rendering and **nlohmann::json** for configuration management.

## Overview

This directory contains a C++ implementation of the x0 framework, providing equivalent functionality to the JavaScript version in `/www/`. The C++ variant is designed for desktop applications requiring native performance and Qt-based graphical output.

## Architecture

The C++ framework mirrors the JavaScript architecture:

| JavaScript (`/www/`)       | C++ (`/cpp/`)          | Description                                    |
|---------------------------|------------------------|------------------------------------------------|
| `sysBaseDOMElement.js`    | `x0BaseElement.h/cpp`  | Base element wrapping Qt widgets               |
| `sysBaseObject.js`        | `x0BaseObject.h/cpp`   | Hierarchical object with children              |
| `sysFactory.js`           | `x0Factory.h/cpp`      | Object factory and screen management           |
| `sysScreen.js`            | `x0Screen.h/cpp`       | Screen/view management                         |
| `sysReactor.js`           | `x0Reactor.h/cpp`      | Event system                                   |
| `sysObjDiv.js`            | `x0ObjDiv.h/cpp`       | Container widget (QFrame)                      |
| `sysObjButton.js`         | `x0ObjButton.h/cpp`    | Button widget (QPushButton)                    |

## Dependencies

- **Qt 5.15+** or **Qt 6.x** (Core, Widgets modules)
- **nlohmann/json 3.x** (automatically fetched via CMake)
- **CMake 3.16+**

## Building

### Prerequisites

```bash
# Ubuntu/Debian
sudo apt-get install cmake qt6-base-dev

# Or for Qt5
sudo apt-get install cmake qtbase5-dev
```

### Build Steps

```bash
cd cpp
mkdir build && cd build
cmake ..
make -j$(nproc)
```

### Running

```bash
./x0-app
```

## Usage Example

```cpp
#include "x0Factory.h"
#include "x0Screen.h"
#include "x0ObjDiv.h"
#include "x0ObjButton.h"

using namespace x0;

int main() {
    // Load configuration
    json skeleton = loadFromFile("skeleton.json");
    json dataObject = loadFromFile("objects.json");
    
    // Initialize factory
    x0Factory& factory = x0Factory::instance();
    factory.setDataSkeleton(skeleton);
    factory.setDataObject(dataObject);
    factory.init();
    
    // Access screens and objects
    x0Screen* screen = factory.getScreenById("MainScreen");
    x0BaseObject* button = factory.getObjectById("MyButton");
    
    return 0;
}
```

## JSON Configuration

The C++ framework uses the same JSON configuration format as the JavaScript version:

### Skeleton Configuration
```json
{
    "MainScreen": [
        {"MainDiv": {"RefID": "MainScreen"}},
        {"WelcomeText": {"RefID": "MainDiv"}},
        {"ActionButton": {"RefID": "MainDiv"}}
    ]
}
```

### Object Configuration
```json
{
    "ActionButton": {
        "Type": "Button",
        "Attributes": {
            "Style": "btn btn-primary",
            "TextID": "BTN.SUBMIT",
            "OnClick": "/api/submit",
            "FireEvents": ["DataRefresh"]
        }
    }
}
```

## Class Hierarchy

```
QObject
└── x0BaseElement (Qt widget wrapper)
    └── x0BaseObject (hierarchical object)
        ├── x0ObjDiv (container)
        └── x0ObjButton (button)

x0Factory (singleton, object management)
x0Screen (screen/view container)
x0Reactor (event dispatching)
```

## Features

- **Hierarchical Object Model**: Parent-child relationships with recursive rendering
- **JSON Configuration**: Load UI definitions from JSON files
- **Qt Integration**: Native desktop widgets with Qt
- **Event System**: Register and dispatch events across objects
- **Screen Management**: Multiple screens with switching support
- **Object Factory**: Dynamic object creation by type

## Extending

To add new widget types:

1. Create header in `include/`:
```cpp
// x0ObjMyWidget.h
class x0ObjMyWidget : public x0BaseObject {
    Q_OBJECT
public:
    void createWidget(const QString& objectId) override;
    void init() override;
};
```

2. Create implementation in `src/`:
```cpp
// x0ObjMyWidget.cpp
void x0ObjMyWidget::createWidget(const QString& objectId) {
    m_widget = std::make_unique<QMyWidget>();
    m_widget->setObjectName(objectId);
}
```

3. Register in factory:
```cpp
x0Factory::instance().registerObjectType("MyWidget", 
    []() { return std::make_shared<x0ObjMyWidget>(); });
```

## License

AGPL-3.0 - See [../LICENSE](../LICENSE)

## Contributing

See [../CONTRIBUTING.md](../CONTRIBUTING.md)
