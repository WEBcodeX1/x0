# Example #11 (Object Instances)

This example demonstrates the object instancing feature in the x0 framework,
allowing for dynamic creation and management of multiple object instances.

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example11`

## Status

⚠️ **Development Status**: This x0-feature/example is currently unfinished and may exhibit unstable behavior.

## Main Components

### 1. Overview

Object instancing allows developers to create multiple instances of the same
x0-object type dynamically, each with its own state and configuration. This
feature is particularly useful for creating dynamic user interfaces where
the number of components isn't known at design time.

### 2. Object Metadata

All UI and logic are defined in the respective `./static/object.json`.

- [Object Instancing Documentation](https://docs.webcodex.de/x0/v1.0/appdev-overlay.html#object-instancing)

### 3. Potential Use Cases

Once completed, this feature can be used for:
- Dynamic form generation with variable field counts
- Creating lists of similar components
- Runtime object composition
- Template-based object creation

### 4. Development Notes

This example is currently under development. The implementation may change
significantly before being marked as stable.

---

**Note:** *x0-app* and *x0-db* docker containers must be up and running for viewing.
Due to the experimental nature of this feature, unexpected behavior may occur.
