# sysLogger - Configurable Logging for x0 Framework

## Overview

The `sysLogger` class provides a configurable logging mechanism for the x0 JavaScript framework. It replaces direct `console.debug()` calls and allows fine-grained control over log output based on configurable debug levels.

## Quick Start

The logger is available globally after initialization:

```javascript
// Basic usage
sysFactory.Logger.debug('Debug message');
sysFactory.Logger.info('Info message');
sysFactory.Logger.warn('Warning message');
sysFactory.Logger.error('Error message');

// With formatting
sysFactory.Logger.debug('User data: %o', userData);
sysFactory.Logger.info('Processing item %d of %d', current, total);
```

## Configuration

The logging level is configured in the PostgreSQL database:

```sql
-- Default configuration
INSERT INTO system.config (config_group, "value") 
VALUES ('debug_level', '10');
```

## Log Levels

| Level | Name | Value | Description |
|-------|------|-------|-------------|
| NONE | `LOG_LEVEL_NONE` | 0 | No logging (production) |
| ERROR | `LOG_LEVEL_ERROR` | 1 | Only error messages |
| WARN | `LOG_LEVEL_WARN` | 5 | Warnings and errors |
| INFO | `LOG_LEVEL_INFO` | 8 | Info, warnings, and errors |
| DEBUG | `LOG_LEVEL_DEBUG` | 10 | All messages (development) |

## Migration from console.debug()

Replace existing console calls:

```javascript
// Before
console.debug('TreeSimple JSONConfig:%o', Attributes);

// After
sysFactory.Logger.debug('TreeSimple JSONConfig:%o', Attributes);
```

## Benefits

1. **Performance**: Logging can be completely disabled in production (level 0)
2. **Flexibility**: Different log levels without code changes
3. **Consistency**: Standardized logging interface
4. **Control**: Centralized configuration through database

## Documentation

For complete documentation, see `/doc/appdev-logging.rst`

## Testing

Run the integration tests:

```bash
pytest test/integration/test_logger.py
```

## Examples

### Basic Logging

```javascript
function processData(data) {
    sysFactory.Logger.debug('Processing data:', data);
    
    try {
        // Process data
        sysFactory.Logger.info('Data processed successfully');
    } catch (err) {
        sysFactory.Logger.error('Data processing failed:', err);
    }
}
```

### Conditional Logging with Objects

```javascript
sysReactor.prototype.registerEvent = function(Attributes, ProcessObject, Type) {
    sysFactory.Logger.debug('registerEvent - Attributes:%o ProcessObject:%o Type:%s', 
                           Attributes, ProcessObject, Type);
    // ... implementation
}
```

### Custom Log Levels

```javascript
// Log only if level >= 7
sysFactory.Logger.log(7, 'Custom level message', data);
```

## API Reference

### Methods

- `debug(...)` - Log debug messages (level 10)
- `info(...)` - Log info messages (level 8)
- `warn(...)` - Log warning messages (level 5)
- `error(...)` - Log error messages (level 1)
- `log(level, ...)` - Log with custom level
- `setLogLevel(level)` - Set the logging level
- `getLogLevel()` - Get the current logging level

### Constants

- `sysLogger.LOG_LEVEL_NONE` = 0
- `sysLogger.LOG_LEVEL_ERROR` = 1
- `sysLogger.LOG_LEVEL_WARN` = 5
- `sysLogger.LOG_LEVEL_INFO` = 8
- `sysLogger.LOG_LEVEL_DEBUG` = 10
