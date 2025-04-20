.. dev-backend

.. _devbackend:

18. Backend Development
=======================

18.1. XMLRPC Callbacks
----------------------

The `sysXMLRPCRequest.js` file in the *x0-framework* implements the core functionality
for handling XML-RPC (Remote Procedure Call) requests, supporting both synchronous and
asynchronous operations. Below is an overview of its concept:

- Key Concepts:

    * Purpose:
        1. Handles communication between the client-side application and backend services using XML-RPC.
        2. Supports both SYNC (synchronous) and ASYNC (asynchronous) request handling, although synchronous requests are deprecated.

    * Core Features:
        1. Request Types: Supports POST and GET HTTP methods.
        2. Asynchronous Support: Implements XMLHttpRequest for making asynchronous requests to the server.
        3. Authentication: Includes support for HTTP Basic Authentication with configurable credentials.
        4. Dynamic URL Parameters: Allows appending random URL parameters to avoid caching issues during requests.

    * Primary Methods:
        1. setRequestType: Configures the HTTP method (e.g., POST or GET).
        2. setRequestBasicAuth: Sets up Basic Authentication credentials for the request.
        3. Request: Executes the XML-RPC call, processes the response, and invokes the callback function if provided.

    * Callback Handling:
        1. In asynchronous mode, the onreadystatechange method processes the server response and parses it as JSON.
        2. The result is merged or directly assigned to the target object, and the callback function (e.g., callbackXMLRPCAsync) is invoked to handle post-request operations.

    * Session Management:
        1. Includes session data in requests when available, ensuring secure and contextual communication with the backend.

    * Error Handling:
        1. Logs errors and exceptions encountered during request preparation or response processing.

    * Flexibility:
        1. The system allows dynamic configuration of request headers, including Content-Type and Accept.

    * x0-object Callback:
        1. Always execute the *x0-systems* `callbackXMLRPCAsync` callback method in the caller *x0-object*.

Example Workflow:

    - A request is initialized using the sysCallXMLRPC constructor with a target URL and optional parameters.
    - Configuration methods (e.g., setRequestType or setRequestBasicAuth) are used to customize the request.
    - The Request method is called with a target object containing data and callback methods.
    - In asynchronous mode, the server response is processed, parsed, and passed to the callback function for further action.

