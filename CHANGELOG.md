# Changelog

This document records significant changes to the x0 JavaScript Framework. It follows
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/) and
[Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.1.0-rc1] - 2026-10-06

### Added
- A database-independent static deployment profile, including a dedicated Docker image and startup script.
- Runtime objects for image display and selection, informational text, header/body layout, and system settings.
- A function dispatcher and example objects for editable items, flight data, timed progress, and wizard workflows.
- Static metadata for the standalone deployment, together with a compact logo and additional example icons.

### Changed
- Reworked core runtime processing for object construction and updates, event dispatch, service requests, asynchronous notifications, and user-defined functions.
- Revised form-field processing and validation, list and tree behavior, grid generation, pagination, tab navigation, screen management, and overlays.
- Updated file-upload handling, global styles, application initialization, and static application metadata.
- Revised Docker and Debian packaging, build and startup workflows, and local/offline package-mirror configuration; updated the bundled `pgdbpool` archive to 1.0.2.
- Consolidated deployment configuration under `config/` and reorganized static application files under `static/meta/` and `static/system/`.

### Removed
- Removed the legacy Link, LinkExternal, IntervalHandler, and FormSectionHeader components.
- Removed superseded drag-and-drop and recursive-object-data examples, the former static build script, and obsolete configuration and package files.

## [1.0.0] - 2025-09-07

### Added
- A changelog following Keep a Changelog conventions.
- GitHub issue templates, workflows, and supporting project documentation.

### Changed
- Standardized project documentation and designated the release candidate as the stable release.

### Fixed
- Applied final stabilization fixes for the 1.0.0 release.

## [1.0.0-rc1] - 2025-04-18

### Added
- Examples for object-data grids, network messaging, object instances, and context-menu copy and paste.
- Context-menu support for FormfieldList objects.
- `RuntimeSetDataFunc()` support for List column objects.

### Changed
- Improved object processing and state management.

### Fixed
- Corrected multiple defects in JavaScript array processing.
- Removed the redundant `enclose__` object from `sysObjFormfieldItem.js`.

## [0.99.0] - 2025-03-20

### Added
- Real-time language switching and local integration tests.
- The `enhanced_form` example and List section processing.
- Font Awesome icons for additional object types, form-section headers, and pagination.
- Shared grid-calculation logic for List and FormfieldList objects.
- System real-time functions and favicon handling.

### Changed
- Generalized the x0 base and refactored List and pagination processing while preserving object state.
- Reworked CSS styles for Bootstrap 5 and updated the Python PostgreSQL integration.
- Revised TabContainer processing and updated JavaScript copyright notices.
- Improved form-field group validation and regular-expression handling.

### Fixed
- Removed duplicated code and corrected object inheritance in `sysObjFormfieldItem`.
- Removed redundant logic from form-field change handling.
- Updated integration tests for the revised codebase.

### Removed
- Temporarily removed form-field overlays and calculated form fields from FormfieldList.
- Removed incomplete logic from `sysObjButton` and `sysObjButtonInternal`.

## [0.98.0-rc] - 2023-06-20

### Added
- The initial x0 JavaScript Framework release, including its object-oriented single-page application architecture and DOM-based templating model.
- JSON-based metadata for cross-object communication and a multi-language text-management system.
- Core List, Form, Button, and TabContainer objects, with basic validation and event processing.
- Bootstrap 5.3 CSS integration, responsive CSS Grid layouts, and Font Awesome 6 Free icons.
- Docker and Kubernetes deployment support, PostgreSQL integration, and an Apache2/WSGI backend.
- Initial project documentation.

### Components
- **x0-app**: Python 3 application package.
- **x0-db**: PostgreSQL database component.
- **x0-test**: Selenium-based integration test framework.
- **x0-msg-server**: Python 3 messaging server.

[Unreleased]: https://github.com/WEBcodeX1/x0/compare/v1.1.0-rc1...HEAD
[1.1.0-rc1]: https://github.com/WEBcodeX1/x0/compare/v1.0.0...v1.1.0-rc1
[1.0.0]: https://github.com/WEBcodeX1/x0/compare/v1.0.0-rc1...v1.0.0
[1.0.0-rc1]: https://github.com/WEBcodeX1/x0/compare/v0.99.0...v1.0.0-rc1
[0.99.0]: https://github.com/WEBcodeX1/x0/compare/v0.98.0-rc...v0.99.0
[0.98.0-rc]: https://github.com/WEBcodeX1/x0/releases/tag/v0.98.0-rc
