# Changelog

All notable changes to the x0 JavaScript Framework project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0-rc1] - 2025-04-18

### Added
- Example "list_objectdata_grid" - List grid-functionality demonstration
- Example "net_messages" - Object exchange via msg-server with real-time communication
- Example "object_instances" - Object instancing examples
- Example "copy_paste" - Object data get/set context-menu functionality
- ContextMenu handling to FormfieldList x0-object-type
- RuntimeSetDataFunc() for List "column" Objects

### Fixed
- Multiple generic bug fixes regarding JS array processing
- sysObjFormfieldItem.js code cleanup (removed enclose__ object)

### Changed
- Improved object processing and state management

## [0.99.0] - 2025-03-20

### Added
- Complete multilanguage support with real-time switching
- Integration tests for local (non-docker) environments
- Example "enhanced_form" with advanced form functionality
- sysObjList "sections" processing 
- FontAwesome icons for multiple Object types
- sysRTFormSectionHeader.js for sysObjFormfieldList
- sysRTPagination.js for sysObjList
- Global Grid-Calculation generator for sysObjList and sysObjFormfieldList
- System real-time functions (sysRT*)
- Favicon.ico handling

### Changed
- x0 base made 100% generic
- sysObjList and pagination completely refactored (maintains 100% object state)
- Complete CSS styles rework using Bootstrap 5 template conformance
- Integrated current psycopg2 Python3 module
- Corrected sysObjTabContainer base code
- Updated copyright year in all .js files
- Improved formfield validation system with group validation and regex fixes

### Fixed
- Code duplication/object inheritance in sysObjFormfieldItem
- Multiple unnecessary code removed from sysFormfieldOnChangeHandler
- Integration tests corrected for new code base

### Removed
- Overlay processing of Formfield Objects in sysObjFormfieldList (temporarily)
- "Calculated" Formfield Objects (temporarily) 
- Incomplete logic from sysObjButton and sysObjButtonInternal

## [0.98.0-rc] - 2023-06-20

### Added
- Initial release of x0 JavaScript Framework
- Core OOP JavaScript SPA framework architecture
- True DOM OOP templating with 1:1 object-to-DOM mapping
- Cross-object communication using JSON metadata
- Bootstrap 5.3 CSS integration (without JavaScript dependencies)
- Responsive design with CSS Grid support
- FontAwesome 6 Free icon integration
- Docker containerization support
- Kubernetes deployment support
- PostgreSQL database integration
- Apache2/WSGI backend support
- Multi-language text management system
- Core x0-objects: List, Form, Button, TabContainer
- Basic validation and event system
- Initial documentation structure

### Components
- **x0-app**: Main application package with Python3 backend
- **x0-db**: PostgreSQL database component
- **x0-test**: Integration testing framework with Selenium
- **x0-msg-server**: Python3-based messaging server

## Project Information

### Current Features
- **Zero Bootstrap JavaScript Dependency**: Uses Bootstrap 5.3 CSS without JavaScript
- **Responsive Design**: Built with CSS Grid and Bootstrap responsive system
- **Cross-Object Communication**: Seamless metadata exchange between x0-objects
- **True DOM OOP Templating**: Strict 1:1 mapping between JavaScript objects and DOM elements
- **Multi-language Support**: Real-time language switching without page reload
- **Integrated Testing**: Selenium-based integration tests
- **Container Ready**: Docker images and Kubernetes support
- **Comprehensive Documentation**: Sphinx-based documentation with examples

### Examples Available
- **basic_menu_screen**: Basic menu and navigation
- **basic_tabcontainer**: Tab container functionality  
- **bootstrap_rowspan**: Bootstrap grid layout examples
- **copy_paste**: Context menu copy/paste functionality
- **enhanced_form**: Advanced form features with validation
- **list_detail_switch_screen**: List and detail view switching
- **list_dyn_radio**: Dynamic radio button lists
- **list_objectdata_grid**: Grid functionality for data display
- **multi_tabcontainer**: Multiple tab container management
- **net_messages**: Network messaging between browser sessions
- **object_instances**: Object instancing and lifecycle management
- **open_close_container**: Container expand/collapse functionality
- **screen_overlay**: Overlay and modal functionality

### Documentation
- Complete Sphinx documentation available at [docs.webcodex.de/x0/v1.0/](https://docs.webcodex.de/x0/v1.0/)
- Installation guide with Docker and Kubernetes setup
- Application development guide with object modeling
- Core development documentation for framework contributors
- Testing and deployment guides

### Links
- **Repository**: [github.com/WEBcodeX1/x0](https://github.com/WEBcodeX1/x0)
- **Documentation**: [docs.webcodex.de/x0/v1.0/](https://docs.webcodex.de/x0/v1.0/)
- **License**: AGPL-3.0
- **Maintainer**: Claus Prüfer <pruefer@webcodex.de>

[1.0.0-rc1]: https://github.com/WEBcodeX1/x0/compare/v0.99.0...v1.0.0-rc1
[0.99.0]: https://github.com/WEBcodeX1/x0/compare/v0.98.0-rc...v0.99.0
[0.98.0-rc]: https://github.com/WEBcodeX1/x0/releases/tag/v0.98.0-rc