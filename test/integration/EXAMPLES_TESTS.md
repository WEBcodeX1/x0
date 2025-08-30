# Example Tests Documentation

This document describes the unit tests created for all x0-framework examples.

## Overview

The `test_examples.py` file contains comprehensive tests for all examples in the `/example` directory (excluding `tree_simple` which is still in development).

## Test Coverage

The following examples are tested:

1. **example1**: add_object_table_column - Adding object types as table columns
2. **example2**: basic_menu_screen - Basic navigation menu implementation
3. **example3**: basic_tabcontainer - Simple tabbed interface  
4. **example4**: list_detail_switch_screen - List/detail view switching
5. **example5**: enhanced_form - Advanced form features and validation
6. **example6**: screen_overlay - Modal overlay functionality
7. **example7**: list_objectdata_grid - Object data grid functionality
8. **example8**: multi_tabcontainer - Multi-level tabbed containers
9. **example9**: bootstrap_rowspan - Bootstrap grid with rowspan functionality
10. **example10**: net_messages - Network messaging between sessions
11. **example11**: object_instances - Dynamic object instancing (experimental)
12. **example12**: list_dyn_radio - Dynamic radio button lists
13. **example13**: copy_paste - Copy/paste functionality between objects
14. **example14**: open_close_container - Collapsible container sections

## Test Approach

Each test:

1. **Loads the example**: Navigates to the example URL using its app_id
2. **Waits for DOM**: Uses WebDriverWait to ensure the page loads
3. **Validates components**: Checks for specific elements based on the example's object.json configuration
4. **Assertions**: Verifies that key components are present and functioning

## Enhanced Validations

Some tests include enhanced validations:

- **example2**: Checks for menu Link elements (Link1, Link2)
- **example3**: Verifies TabContainer elements are present
- **example4**: Looks for ServiceConnector and FormfieldList components
- **example5**: Validates FormfieldList and Formfield components

## Running the Tests

### Prerequisites

1. x0-app and x0-db containers must be running
2. Selenium server must be available
3. All example applications must be properly configured in the database

### Command

```bash
cd /home/runner/work/x0/x0/test
python -m pytest integration/test_examples.py -v
```

### Environment Variables

The tests use the same environment variables as other integration tests:

- `RUN_NAMESPACE`: Kubernetes namespace (if running in k8s)
- `KUBERNETES_SERVICE_HOST`: Kubernetes API server (if running in k8s)
- `TEST_HTTPS_ONLY`: Force HTTPS URLs

## Integration with CI

These tests follow the same patterns as existing integration tests and should integrate seamlessly with the current CI pipeline for the `current-release` branch.

## Future Enhancements

The tests can be enhanced further by:

1. Adding more specific element validations based on each example's object.json
2. Testing interactive features (clicking, form submission, etc.)
3. Validating data loading and display
4. Testing cross-screen navigation
5. Verifying responsive design elements

## Error Handling

Tests include appropriate error handling:

- Timeout handling for slow-loading examples
- Graceful failure with descriptive error messages
- Proper WebDriver cleanup following existing patterns