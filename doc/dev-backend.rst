.. dev-backend

.. _devbackend:

25. Backend Development
=======================

25.1. XMLRPC Callbacks
----------------------

The ``sysXMLRPCRequest.js`` file in the *x0-framework* implements the core functionality
for handling XML-RPC (Remote Procedure Call) requests, supporting both synchronous and
asynchronous operations. Below is an overview of its concept:

25.1.1. Key Concepts
********************

    * Purpose:
        1. Handles communication between the client-side application and backend services using XML-RPC.
        2. Supports ASYNC (asynchronous) request handling.

    * Core Features:
        1. Request Types:
            Supports POST and GET HTTP methods.
        2. Asynchronous Support:
            Implements ``XMLHttpRequest`` for making asynchronous requests to the server.
        3. Authentication:
            Includes support for HTTP Basic Authentication with configurable credentials.
        4. Dynamic URL Parameters:
            Allows appending random URL parameters to avoid caching issues during requests.

    * Primary Methods:
        1. setRequestType:
            Configures the HTTP method (e.g., POST or GET).
        2. setRequestBasicAuth:
            Sets up Basic Authentication credentials for the request.
        3. Request:
            Executes the XML-RPC call, processes the response, and invokes the callback function if provided.

    * Callback Handling:
        1. In asynchronous mode, the ``onreadystatechange`` method processes the server response and parses it as JSON.
        2. The result is merged or directly assigned to the target object, and the callback function (e.g., ``callbackXMLRPCAsync``) is invoked to handle post-request operations.

    * Session Management:
        1. Includes session data in requests when available, ensuring secure and contextual communication with the backend.

    * Error Handling:
        1. Logs errors and exceptions encountered during request preparation or response processing.

    * Flexibility:
        1. The system allows dynamic configuration of request headers, including Content-Type and Accept.

    * x0-object Callback:
        1. Always execute the *x0-systems* ``callbackXMLRPCAsync`` callback method in the caller *x0-object*.

25.1.2. Example Workflow
************************

    * A request is initialized using the ``sysCallXMLRPC`` constructor with a target URL and optional parameters.
    * Configuration methods (e.g., ``setRequestType`` or ``setRequestBasicAuth``) are used to customize the request.
    * The Request method is called with a target object containing data and ``callbackXMLRPCAsync`` callback method.
    * In asynchronous mode, the server response is processed, parsed, and passed to the callback function for further action.

25.1.3. Getting Backend Data
****************************

*x0-application-developer* and *x0-systems-developer* roles should always use *x0-service-connector*
and *x0-source-data-objects* in the following situations:

- Developing *x0-applications*
- Modeling *x0-system-objects*

Direct usage of `sysXMLRPCRequest` is discouraged and should only be done when developing the
*x0-core-system*. See :ref:`devbackend-nested-rpc` for more details on nested *x0-system* XML-RPC calls.

25.1.4. Error Handling
**********************

A backend service must return the following JSON syntax when an error has occured:

.. code-block:: javascript

    "Result": {
        "Error": True
        "Exception": "Exception String / Description"
    }

If *x0-service* handling is configured correctly, the ``AsynNotifyIndicator``
:ref:`appdev-backend-notify` uses the error-metadata to display error information.

If no error has occured, the ``Error`` and ``Exception`` properties have to
be ommited.

.. code-block:: javascript

    "Result": {
    }

.. _devbackend-nested-rpc:

25.1.5. Nested RPC Requests
***************************

Only relevant for *x0-core-system* development.

Sometimes multiple / nested (pseudo-synchronous) XML-RPC requests are necessary.

25.1.6. Debugging Information
*****************************

If something misbehaves drastically, first check Browser JS Console
log / debug messages for relevant debugging keywords.

If this wont help, try to comment exception handling in the following
files:

- ``sysXMLRPCRequest.js``
- ``sysReactor.js``
- ``sysFactory.js``
- ``sysScreen.js``

25.2. JSON Schemas
------------------

JSON schemas define the structure and validation rules for *x0-system-objects*.
Properly defining JSON schemas ensures consistency and reduces runtime errors.

25.2.1. How to Define JSON Schemas
**********************************

1. **Schema Structure:**
   Define the schema for each *x0-system-object*, including required fields, data types, and default values.
2. **Validation:**
   Use JSON schema validation tools to enforce correctness during development and runtime.
3. **Examples:**
   Provide example JSON schemas in the documentation to guide developers.

25.2.2. Best Practices
**********************

1. **Version Control:**
   Maintain versioned schemas to handle backward compatibility.
2. **Consistency:**
   Ensure all schemas follow the same conventions and naming patterns.
3. **Documentation:**
   Document the purpose and structure of each schema for easy reference.
