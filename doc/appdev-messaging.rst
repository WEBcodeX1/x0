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

By default, the *x0-framework* ships with a very limited, self-implemented, and dockerized
messaging server called *x0-msg-server*, which is written in Python. While this built-in
server handles basic infrastructure requirements, the architecture is highly decoupled.
Connecting the framework to other production-ready messaging systems (such as RabbitMQ,
Apache Kafka, or MQTT brokers) can be achieved with minimal integration effort.

The messaging infrastructure is built around a lightweight micro-messaging server architecture
that handles message routing, session management, and delivery between connected clients.

.. warning::

   The shipped *x0-msg-server* container is functionally very limited and possesses
   strict performance ceilings. It is explicitly designed and intended **only** for
   internal message exchange testing and local development. It must not be deployed
   in production environments.

20.2. Architecture
------------------

The messaging system consists of three main components:

20.2.1. Client-Side Components
##############################

* **sysAsyncNotifyMsgHandler**: JavaScript client that manages message polling and processing
* **sysXMLRPCRequest**: Handles HTTP communication with the messaging server
* **Session Management**: Tracks user sessions and message routing

20.2.2. Messaging Server
########################

* **MsgHandler.py**: WSGI application handling HTTP requests from clients
* **MessagingServer.py**: Core message processing and routing logic
* **Unix Socket Communication**: Internal communication between components

20.2.3. Communication Flow
##########################

.. code-block:: text

    Client A                 Messaging Server            Client B
       |                          |                         |
       |-- POST message data ---->|                         |
       |                          |-- store message ------->|
       |<-- confirmation ---------|                         |
       |                          |<-- GET polling request--|
       |                          |-- return messages ----->|
       |                          |-- delete messages ----->|

20.2.4. Technical Implementation
################################

The system uses HTTP long-polling with a 10-second timeout for real-time communication.
Messages are temporarily stored in memory and delivered to destination sessions through
continuous polling requests.

.. note::

   WebSocket implementation is planned for future releases to improve efficiency
   and reduce server load.

20.3. Setup and Installation
-----------------------------

20.3.1. Prerequisites
#####################

* Docker environment
* *x0-app* container running
* Network connectivity between containers

20.3.2. Server Installation
###########################

Download and start the messaging server:

.. code-block:: bash

    # Download message server image
    curl -o docker.x0-msg-server.tar https://docker.webcodex.de/x0/docker.x0-msg-server.tar

    # Load Docker image
    docker load < docker.x0-msg-server.tar

    # Start messaging server
    cd ./docker
    ./x0-start-msg-server.sh

20.3.3. Network Configuration
#############################

Configure DNS resolution for the messaging server:

.. code-block:: bash

    # Add to /etc/hosts
    echo "172.20.0.100 x0-msg-server.x0-localnet" >> /etc/hosts

.. note::

   Due to Docker networking limitations, the messaging server runs on port 8080
   to ensure compatibility with *x0-app* and *x0-msg-server* parallel execution.

20.4. Configuration
-------------------

20.4.1. Server Configuration
############################

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

20.4.2. Client Configuration
############################

Configure the messaging client in your *x0-application*:

.. code-block:: javascript

    // Initialize messaging handler
    const msgHandler = new sysAsyncNotifyMsgHandler(true);
    
    // Configure server URL
    sysFactory.MsgServerGetURL = 'http://x0-msg-server.x0-localnet:8080/get';

20.5. Example Implementation
----------------------------

20.5.1. Basic Usage
###################

The messaging system is demonstrated in Example #10:

**URL:** http://x0-app.x0.localnet/python/Index.py?appid=example10

20.5.2. Testing Procedure
#########################

1. Open the example URL in two separate browser tabs
2. Reload both tabs until different User IDs are displayed
3. Select the destination "User Dst SessionID" in the first tab
4. Enter test data in the form fields
5. Click "Send Data" to transmit data to the second tab
6. Observe real-time data transfer and notification display

20.5.3. Current Implementation Status
#####################################

.. note::

   The *x0-messaging* feature is currently in **beta**. Extended API documentation
   is still under development. For architectural insights and implementation details,
   please refer directly to the source code of Example #10 within the workspace.
