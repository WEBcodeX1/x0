.. appdev-logging

.. _appdevlogging:

Logging System
==============

The *x0-framework* provides a configurable logging mechanism through the ``sysLogger`` class.
This logging system replaces direct ``console.debug()`` calls and allows fine-grained control
over log output based on configurable debug levels.

Overview
--------

The logging system is designed to:

* Reduce performance impact of debug statements in production
* Provide configurable log levels from the PostgreSQL backend
* Support standard logging levels (ERROR, WARN, INFO, DEBUG)
* Maintain backward compatibility with existing code

Configuration
-------------

The logging level is configured in the PostgreSQL database via the ``debug_level`` configuration:

.. code-block:: sql

    INSERT INTO system.config (config_group, "value") 
    VALUES ('debug_level', '10');

Log Levels
----------

The following log levels are available:

=============== ======= =====================================================
Level Name      Value   Description
=============== ======= =====================================================
LOG_LEVEL_NONE  0       No logging (production)
LOG_LEVEL_ERROR 1       Only error messages
LOG_LEVEL_WARN  5       Warnings and errors
LOG_LEVEL_INFO  8       Informational messages, warnings, and errors
LOG_LEVEL_DEBUG 10      All messages including debug output
=============== ======= =====================================================

Usage
-----

The logger is accessible globally through ``sysFactory.Logger`` after initialization.

Basic Logging
^^^^^^^^^^^^^

.. code-block:: javascript

    // Debug messages (level 10)
    sysFactory.Logger.debug('Debug message:', objectData);
    
    // Info messages (level 8)
    sysFactory.Logger.info('User logged in:', userId);
    
    // Warning messages (level 5)
    sysFactory.Logger.warn('Deprecated function called:', functionName);
    
    // Error messages (level 1)
    sysFactory.Logger.error('Operation failed:', errorDetails);

Custom Log Levels
^^^^^^^^^^^^^^^^^

You can also use custom log levels:

.. code-block:: javascript

    // Log with custom level (7)
    sysFactory.Logger.log(7, 'Custom level message:', data);

Getting/Setting Log Level
^^^^^^^^^^^^^^^^^^^^^^^^^^

.. code-block:: javascript

    // Get current log level
    var currentLevel = sysFactory.Logger.getLogLevel();
    
    // Set log level programmatically (not recommended, use config instead)
    sysFactory.Logger.setLogLevel(5);  // Set to WARN level

Examples
--------

Basic Usage
^^^^^^^^^^^

.. code-block:: javascript

    function sysReactor() {
        this.Events = new Array();
        sysFactory.Logger.debug('Reactor initialized with events array');
    }
    
    sysReactor.prototype.registerEvent = function(Attributes, ProcessObject, Type) {
        sysFactory.Logger.debug('registerEvent Attributes:%o ProcessObject:%o, Type:%s', 
                               Attributes, ProcessObject, Type);
        // ... rest of implementation
    }

Conditional Logging
^^^^^^^^^^^^^^^^^^^

.. code-block:: javascript

    function processData(data) {
        try {
            // Process data
            sysFactory.Logger.info('Data processed successfully');
        } catch (err) {
            sysFactory.Logger.error('Data processing failed:', err);
        }
    }

Migration Guide
---------------

Existing ``console.debug()`` calls can be gradually migrated to use the logger:

Before:

.. code-block:: javascript

    console.debug('TreeSimple JSONConfig:%o', Attributes);

After:

.. code-block:: javascript

    sysFactory.Logger.debug('TreeSimple JSONConfig:%o', Attributes);

Benefits
--------

Using the logger class provides several advantages:

1. **Performance**: Logging can be completely disabled in production (level 0)
2. **Flexibility**: Different log levels can be enabled without code changes
3. **Consistency**: Standardized logging interface across the framework
4. **Control**: Centralized configuration through the database

Best Practices
--------------

1. Use appropriate log levels:
   
   * ``debug()`` for detailed debugging information
   * ``info()`` for general informational messages
   * ``warn()`` for warning messages about potential issues
   * ``error()`` for error conditions

2. Include context in log messages:

   .. code-block:: javascript

       // Good - includes context
       sysFactory.Logger.debug('User validation failed for ID:%s', userId);
       
       // Poor - lacks context
       sysFactory.Logger.debug('Validation failed');

3. Use structured logging with objects:

   .. code-block:: javascript

       sysFactory.Logger.debug('Request data:', {
           url: requestUrl,
           method: requestMethod,
           params: requestParams
       });

4. Avoid logging sensitive information:

   .. code-block:: javascript

       // Avoid logging passwords, tokens, or personal data
       sysFactory.Logger.debug('User logged in', { userId: user.id }); // OK
       // NOT: sysFactory.Logger.debug('Login', { password: user.password }); // NEVER!

Technical Details
-----------------

Implementation
^^^^^^^^^^^^^^

The ``sysLogger`` class is implemented in ``/www/sysLogger.js`` and provides:

* Constructor: ``sysLogger()``
* Methods:
  
  * ``setLogLevel(level)`` - Set the logging level
  * ``getLogLevel()`` - Get the current logging level
  * ``debug(...)`` - Log debug messages
  * ``info(...)`` - Log info messages
  * ``warn(...)`` - Log warning messages
  * ``error(...)`` - Log error messages
  * ``log(level, ...)`` - Log with custom level

Initialization
^^^^^^^^^^^^^^

The logger is initialized in ``sysInitOnLoad.js`` during application startup:

.. code-block:: javascript

    sysFactory.Logger = new sysLogger();
    sysFactory.Logger.setLogLevel(sysVarDebugLevel);

The ``sysVarDebugLevel`` value is injected from the Python backend (``Index.py``)
based on the PostgreSQL configuration.
