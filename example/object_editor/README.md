# Example #16 (Object Editor)

This example provides an in-browser x0 editor application with runtime object and screen editing.

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example16`

## Features

- Main object bar with:
  - **screen section** (add, remove, switch screen)
  - **system-object section** (all registered x0 system objects)
- Object properties form with editable JSON attributes.
- Workspace/canvas for drag and drop object placement.
- Drag and drop for:
  - adding new objects from system-object section
  - reparenting existing connected objects
- Runtime updates of:
  - `sysFactory.DataObject.XMLRPCResultData` (object.json structure)
  - `sysFactory.DataSkeleton.XMLRPCResultData` (skeleton.json structure)

## Notes

- Changes are runtime/in-memory only.
- No backend persistence endpoint is included in this example.
