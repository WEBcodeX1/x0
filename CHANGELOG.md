# Changelog

All notable changes to the x0 JavaScript Framework project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-09-07

### Added
- Comprehensive CHANGELOG.md following Keep a Changelog format
- Complete GitHub integration with issue templates, workflows, and documentation
- Enhanced example documentation with video demonstrations
- Nine comprehensive example videos (.mkv format) showcasing key framework features:
  - x0-example-1-add-object-table-column.mkv - Adding object types as table columns
  - x0-example-2-basic-menu-screen.mkv - Basic navigation menu implementation  
  - x0-example-4-list-detail-switch-screen.mkv - List/detail view switching
  - x0-example-6-screen-overlay.mkv - Modal overlay functionality
  - x0-example-7-list-object-data-grid.mkv - Object data grid functionality
  - x0-example-8-multi-tabcontainer.mkv - Multi-level tabbed containers
  - x0-example-10-net-messages.mkv - Network messaging between sessions
  - x0-example-12-dyn-radio-button-list.mkv - Dynamic radio button lists
  - x0-example-13-copy-paste.mkv - Copy/paste functionality between objects
- All examples from RC1 now include working demonstration videos
- Enhanced example README documentation with video references

### Changed
- Documentation improvements and standardization across all components
- Promoted from release candidate to stable release with full production readiness
- Updated example structure to include comprehensive video demonstrations
- Enhanced GitHub repository structure with complete CI/CD workflows
- Improved project documentation with better organization and accessibility

### Fixed
- Final bug fixes and stabilization for stable release
- All RC1 features thoroughly tested and validated
- Complete integration testing across all example scenarios
- Documentation consistency and accuracy improvements

### Major Features Carried Forward from RC1
- Example "list_objectdata_grid" - List grid-functionality demonstration (now with video)
- Example "net_messages" - Object exchange via msg-server with real-time communication (now with video)
- Example "object_instances" - Object instancing examples (experimental feature)
- Example "copy_paste" - Object data get/set context-menu functionality (now with video)
- Enhanced ContextMenu handling for FormfieldList x0-object-type
- Improved RuntimeSetDataFunc() for List "column" Objects
- All generic bug fixes from RC1 regarding JS array processing
- Complete sysObjFormfieldItem.js code cleanup (removed enclose__ object)

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

### Technical Stack
- **Frontend**: JavaScript ES6+, Bootstrap 5.3 CSS, FontAwesome 6 Free
- **Backend**: Python 3 with WSGI/Apache2 integration
- **Database**: PostgreSQL with psycopg2 connector
- **Messaging**: Custom Python3-based real-time messaging server
- **Testing**: Selenium WebDriver integration tests
- **Containerization**: Docker with multi-stage builds
- **Orchestration**: Kubernetes deployment manifests
- **Documentation**: Sphinx with reStructuredText

### Architecture
- **Single Page Application (SPA)**: Fast, desktop-like user experience
- **Object-Oriented Design**: True OOP with abstraction and inheritance
- **Event-Driven**: Comprehensive event system for object communication
- **Modular Components**: Reusable, configurable x0-objects
- **Metadata-Driven**: JSON-based configuration and object definitions
- **Backend-Agnostic**: Clean separation between frontend and backend logic

### Deployment Options
- **Docker**: Multi-container setup with x0-app, x0-db, x0-test, and x0-msg-server
- **Kubernetes**: Production-ready orchestration with configurable scaling
- **Traditional**: Apache2/WSGI deployment on dedicated servers
- **Development**: Local setup with integrated development tools

### Getting Started
1. **Quick Start**: Use Docker Compose for immediate setup
2. **Documentation**: Visit [docs.webcodex.de/x0/v1.0/](https://docs.webcodex.de/x0/v1.0/) for comprehensive guides
3. **Examples**: Explore 15 working examples in the `/example` directory
4. **Development**: Follow the [CONTRIBUTING.md](CONTRIBUTING.md) guide for development setup

### Examples Available (with Video Demonstrations)

**Note**: As of version 1.0.0, 9 examples include comprehensive video demonstrations in `.mkv` format, showcasing real-world usage and functionality.

- **add_object_table_column**: Adding object types as table columns *(includes video demo)*
- **basic_menu_screen**: Basic menu and navigation *(includes video demo)*
- **basic_tabcontainer**: Tab container functionality  
- **bootstrap_rowspan**: Bootstrap grid layout examples
- **copy_paste**: Context menu copy/paste functionality *(includes video demo)*
- **enhanced_form**: Advanced form features with validation
- **list_detail_switch_screen**: List and detail view switching *(includes video demo)*
- **list_dyn_radio**: Dynamic radio button lists *(includes video demo)*
- **list_objectdata_grid**: Grid functionality for data display *(includes video demo)*
- **multi_tabcontainer**: Multiple tab container management *(includes video demo)*
- **net_messages**: Network messaging between browser sessions *(includes video demo)*
- **object_instances**: Object instancing and lifecycle management
- **open_close_container**: Container expand/collapse functionality
- **screen_overlay**: Overlay and modal functionality *(includes video demo)*
- **tree_simple**: Hierarchical tree structures with navigation

**Video Format**: All demonstration videos are provided in `.mkv` format for high-quality, cross-platform compatibility. Videos showcase step-by-step usage scenarios, making it easier for developers to understand implementation patterns and expected behavior.

### Video Demonstrations New in v1.0.0

The stable release includes comprehensive video demonstrations for key framework features:

1. **x0-example-1-add-object-table-column.mkv** - Demonstrates how to dynamically add object types as table columns
2. **x0-example-2-basic-menu-screen.mkv** - Shows basic navigation menu implementation and usage
3. **x0-example-4-list-detail-switch-screen.mkv** - Illustrates seamless switching between list and detail views
4. **x0-example-6-screen-overlay.mkv** - Showcases modal overlay functionality and user interactions
5. **x0-example-7-list-object-data-grid.mkv** - Demonstrates advanced grid functionality for data display
6. **x0-example-8-multi-tabcontainer.mkv** - Shows multi-level tabbed container management
7. **x0-example-10-net-messages.mkv** - Illustrates real-time network messaging between browser sessions
8. **x0-example-12-dyn-radio-button-list.mkv** - Demonstrates dynamic radio button list generation
9. **x0-example-13-copy-paste.mkv** - Shows context menu copy/paste functionality between objects

These videos provide practical, real-world examples of how to implement and use x0 framework features effectively.

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

[Unreleased]: https://github.com/WEBcodeX1/x0/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/WEBcodeX1/x0/compare/v1.0.0-rc1...v1.0.0
[1.0.0-rc1]: https://github.com/WEBcodeX1/x0/compare/v0.99.0...v1.0.0-rc1
[0.99.0]: https://github.com/WEBcodeX1/x0/compare/v0.98.0-rc...v0.99.0
[0.98.0-rc]: https://github.com/WEBcodeX1/x0/releases/tag/v0.98.0-rc