.. appdev-messaging

.. _appdev-messaging:

20. Messaging System
====================

20.1. Overview
--------------

The *x0-messaging-system* provides real-time communication capabilities between browser
clients, enabling the transfer of JSON object data and notification messages across
network connections. This system facilitates multi-user collaboration, real-time data
synchronization, and interactive web applications.

The messaging infrastructure is built around a lightweight micro-messaging server that
handles message routing, session management, and delivery between connected clients.

**Key Features:**

* Real-time JSON object data exchange
* Session-based message routing
* Long-polling communication mechanism
* Cross-browser client communication
* Docker containerized deployment
* Integration with *x0-framework* objects

20.2. Architecture
------------------

The messaging system consists of three main components:

**20.2.1. Client-Side Components**

* **sysAsyncNotifyMsgHandler**: JavaScript client that manages message polling and processing
* **sysXMLRPCRequest**: Handles HTTP communication with the messaging server
* **Session Management**: Tracks user sessions and message routing

**20.2.2. Messaging Server**

* **MsgHandler.py**: WSGI application handling HTTP requests from clients
* **MessagingServer.py**: Core message processing and routing logic
* **Unix Socket Communication**: Internal communication between components

**20.2.3. Communication Flow**

.. code-block:: text

    Client A                 Messaging Server            Client B
       |                          |                         |
       |-- POST message data ---->|                         |
       |                          |-- store message ------->|
       |<-- confirmation ---------|                         |
       |                          |<-- GET polling request--|
       |                          |-- return messages ----->|
       |                          |-- delete messages ----->|

**20.2.4. Technical Implementation**

The system uses HTTP long-polling with a 10-second timeout for real-time communication.
Messages are temporarily stored in memory and delivered to destination sessions through
continuous polling requests.

.. note::

    WebSocket implementation is planned for future releases to improve efficiency
    and reduce server load.

20.3. Setup and Installation
-----------------------------

**20.3.1. Prerequisites**

* Docker environment
* *x0-app* container running
* Network connectivity between containers

**20.3.2. Server Installation**

Download and start the messaging server:

.. code-block:: bash

    # Download message server image
    curl -o docker.x0-msg-server.tar https://docker.webcodex.de/x0/docker.x0-msg-server.tar

    # Load Docker image
    docker load < docker.x0-msg-server.tar

    # Start messaging server
    cd ./docker
    ./x0-start-msg-server.sh

**20.3.3. Network Configuration**

Configure DNS resolution for the messaging server:

.. code-block:: bash

    # Add to /etc/hosts
    echo "172.20.0.100 x0-msg-server.x0-localnet" >> /etc/hosts

.. note::

    Due to Docker networking limitations, the messaging server runs on port 8080
    to ensure compatibility with *x0-app* and *x0-msg-server* parallel execution.

20.4. Configuration
-------------------

**20.4.1. Server Configuration**

The messaging server configuration is defined in the Docker container:

.. code-block:: python

    server_config = {
        'address': '/var/lib/msgserver/messageserver.socket',
        'permissions': {
            'user': 'www-data',
            'group': 'www-data',
            'userid': 33,
            'groupid': 33,
            'mod': '0770'
        }
    }

**20.4.2. Client Configuration**

Configure the messaging client in your *x0-application*:

.. code-block:: javascript

    // Initialize messaging handler
    const msgHandler = new sysAsyncNotifyMsgHandler(true);
    
    // Configure server URL
    sysFactory.MsgServerGetURL = 'http://x0-msg-server.x0-localnet:8080/get';

20.5. API Reference
-------------------

**20.5.1. Message Structure**

.. code-block:: javascript

    {
        "session_src": "source_session_id",
        "session_dst": "destination_session_id", 
        "payload": {
            "msg-type": "net-message",
            "method-id": "set-data",
            "dst-object": "target_object_name",
            "payload": { /* actual data */ }
        }
    }

**20.5.2. HTTP Endpoints**

**GET /get**
    Retrieve messages for a session (long-polling)
    
    *Parameters:*
    - ``session_src``: Source session identifier
    - ``type``: Request type ("GET")

**POST /set**
    Send message to destination session
    
    *Parameters:*
    - ``session_src``: Source session identifier  
    - ``session_dst``: Destination session identifier
    - ``payload``: Message data object

**20.5.3. JavaScript API**

.. code-block:: javascript

    // Start message processing
    msgHandler.getMsg();
    
    // Process received message
    msgHandler.processMsg(messageObject);
    
    // Handle callback
    msgHandler.callbackXMLRPCAsync();

20.6. Security Considerations
-----------------------------

.. warning::

    The current messaging implementation is designed for development and demonstration
    purposes only. **Do not use in production environments** without implementing
    proper security measures.

**20.6.1. Security Limitations**

* No authentication mechanism
* Session IDs transmitted in plain text
* No message encryption
* Immediate message deletion after delivery
* No access control or authorization

**20.6.2. Production Recommendations**

For production deployments, consider implementing:

* User authentication and session validation
* Message encryption (TLS/SSL)
* Access control and permissions
* Message persistence and acknowledgment
* Rate limiting and abuse prevention
* Proper error handling and logging

.. note::

    For production messaging requirements, consider enterprise solutions like
    RabbitMQ, Apache Kafka, or Redis Pub/Sub.

20.7. Example Implementation
----------------------------

**20.7.1. Basic Usage**

The messaging system is demonstrated in Example #10:

**URL:** http://x0-app.x0.localnet/python/Index.py?appid=example10

**20.7.2. Testing Procedure**

1. Open the example URL in two separate browser tabs
2. Reload both tabs until different User IDs are displayed
3. Select the destination "User Dst SessionID" in the first tab
4. Enter test data in the form fields
5. Click "Send Data" to transmit data to the second tab
6. Observe real-time data transfer and notification display

**20.7.3. Code Example**

.. code-block:: javascript

    // Initialize messaging in your application
    function initializeMessaging() {
        const msgHandler = new sysAsyncNotifyMsgHandler(true);
        msgHandler.getMsg();
    }
    
    // Send message to another session
    function sendMessage(destSessionId, data) {
        const msgData = {
            "session_dst": destSessionId,
            "payload": {
                "msg-type": "net-message", 
                "method-id": "set-data",
                "dst-object": "FormlistExchangeData",
                "payload": data
            }
        };
        
        // Send via RPC handler
        const rpc = new sysCallXMLRPC(sysFactory.MsgServerSetURL);
        rpc.PostData = msgData;
        rpc.Request();
    }

20.8. Best Practices
--------------------

**20.8.1. Development Guidelines**

* Always validate session IDs before message transmission
* Implement proper error handling for failed message delivery
* Use meaningful message types and identifiers
* Keep message payloads small and focused
* Test message flow in multiple browser instances

**20.8.2. Performance Optimization**

* Minimize polling frequency where possible
* Implement message batching for high-volume scenarios
* Use appropriate timeout values for long-polling
* Monitor server resource usage

**20.8.3. Debugging**

Enable console debugging for message flow analysis:

.. code-block:: javascript

    console.debug('Message received:', messageData);
    console.debug('Session ID:', sysFactory.SysSessionID);

20.9. Troubleshooting
---------------------

**20.9.1. Common Issues**

**Messages not delivered:**
    - Verify messaging server is running
    - Check network connectivity between containers
    - Validate session IDs are correctly generated
    - Ensure proper DNS resolution

**Connection timeouts:**
    - Increase polling timeout if necessary
    - Verify server port accessibility
    - Check firewall settings

**CORS errors:**
    - Wait approximately 30 seconds for CORS setup
    - Verify server configuration allows cross-origin requests

**20.9.2. Diagnostic Commands**

.. code-block:: bash

    # Check server status
    docker ps | grep msg-server
    
    # View server logs
    docker logs x0-msg-server
    
    # Test network connectivity
    curl -X GET "http://x0-msg-server.x0-localnet:8080/get"

**20.9.3. Error Messages**

Common error responses and solutions:

.. code-block:: javascript

    // Connection error
    {
        "error": true,
        "exception": "Connection refused"
    }
    // Solution: Ensure messaging server is running

    // Invalid session
    {
        "error": true, 
        "exception": "Invalid session ID"
    }
    // Solution: Verify session ID format and validity

20.10. Migration and Future Considerations
------------------------------------------

**20.10.1. WebSocket Migration**

The current long-polling implementation will be replaced with WebSockets:

* Improved real-time performance
* Reduced server resource consumption  
* Better scalability for multiple concurrent users
* Enhanced browser compatibility

**20.10.2. Production Alternatives**

For production environments, consider migrating to:

* **Redis Pub/Sub**: Simple publish-subscribe messaging
* **RabbitMQ**: Robust message queuing with persistence
* **Apache Kafka**: High-throughput distributed messaging
* **WebSocket.io**: Real-time bidirectional communication

.. warning::

    The micro-msg-server code differs from the original implementation and
    is specifically adapted for *x0-framework* compatibility. Direct usage
    outside the *x0-ecosystem* is not recommended.
