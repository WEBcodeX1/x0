//-------1---------2---------3---------4---------5---------6---------7--------//
//- Copyright WEB/codeX, clickIT 2011 - 2025                                 -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- SYSTEM "Logger"                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//
//- Configurable logging mechanism with debug level support                  -//
//-                                                                          -//
//-                                                                          -//
//-------1---------2---------3---------4---------5---------6---------7--------//


//------------------------------------------------------------------------------
//- CONSTRUCTOR "sysLogger"
//------------------------------------------------------------------------------

function sysLogger() {
    this.logLevel = 0;  // Default: no logging
    this.enabled = false;
}


//------------------------------------------------------------------------------
//- Log Level Constants
//------------------------------------------------------------------------------

sysLogger.LOG_LEVEL_NONE = 0;
sysLogger.LOG_LEVEL_ERROR = 1;
sysLogger.LOG_LEVEL_WARN = 5;
sysLogger.LOG_LEVEL_INFO = 8;
sysLogger.LOG_LEVEL_DEBUG = 10;


//------------------------------------------------------------------------------
//- METHOD "setLogLevel"
//- Sets the current logging level
//------------------------------------------------------------------------------

sysLogger.prototype.setLogLevel = function(level) {
    this.logLevel = parseInt(level) || 0;
    this.enabled = this.logLevel > 0;
}


//------------------------------------------------------------------------------
//- METHOD "getLogLevel"
//- Gets the current logging level
//------------------------------------------------------------------------------

sysLogger.prototype.getLogLevel = function() {
    return this.logLevel;
}


//------------------------------------------------------------------------------
//- METHOD "debug"
//- Logs debug messages (level 10)
//------------------------------------------------------------------------------

sysLogger.prototype.debug = function() {
    if (this.enabled && this.logLevel >= sysLogger.LOG_LEVEL_DEBUG) {
        console.debug.apply(console, arguments);
    }
}


//------------------------------------------------------------------------------
//- METHOD "info"
//- Logs info messages (level 8)
//------------------------------------------------------------------------------

sysLogger.prototype.info = function() {
    if (this.enabled && this.logLevel >= sysLogger.LOG_LEVEL_INFO) {
        console.info.apply(console, arguments);
    }
}


//------------------------------------------------------------------------------
//- METHOD "warn"
//- Logs warning messages (level 5)
//------------------------------------------------------------------------------

sysLogger.prototype.warn = function() {
    if (this.enabled && this.logLevel >= sysLogger.LOG_LEVEL_WARN) {
        console.warn.apply(console, arguments);
    }
}


//------------------------------------------------------------------------------
//- METHOD "error"
//- Logs error messages (level 1)
//------------------------------------------------------------------------------

sysLogger.prototype.error = function() {
    if (this.enabled && this.logLevel >= sysLogger.LOG_LEVEL_ERROR) {
        console.error.apply(console, arguments);
    }
}


//------------------------------------------------------------------------------
//- METHOD "log"
//- Generic log method with custom level
//------------------------------------------------------------------------------

sysLogger.prototype.log = function(level) {
    if (this.enabled && this.logLevel >= level) {
        var args = Array.prototype.slice.call(arguments, 1);
        console.log.apply(console, args);
    }
}
