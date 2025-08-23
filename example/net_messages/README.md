# Example #10 (Net Messaging)

This example demonstrates *x0-object-metadata* network exchange via a messaging
component, showcasing real-time communication between multiple browser instances
using the x0 framework's messaging system.

## URL

Open URL: `http://x0-app.x0.localnet/python/Index.py?appid=example10`

## Video

[Download example video (VLC or MPV player recommended)](https://download.webcodex.de/x0/video/x0-example-10-net-messages.mkv).

## Main Components

### 1. Overview

This example illustrates how x0-objects can exchange metadata and communicate
across network connections using a dedicated messaging server. It demonstrates
real-time data synchronization between multiple browser sessions.

### 2. Dependencies

Example requires running `x0-msg-server` container and proper DNS/hostname configuration.

Download and setup:
```bash
# Download message server image
curl -o docker.x0-msg-server.tar https://docker.webcodex.de/x0/docker.x0-msg-server.tar

# Load docker image
docker load < docker.x0-msg-server.tar

# Start x0-message-server
cd ./docker/
../x0-start-msg-server.sh
```

Add `x0-msg-server.x0-localnet` with IP address `172.20.0.100` to `/etc/hosts` or DNS zone.

### 3. Testing the Example

1. Open URL `http://x0-app.x0.localnet/python/Index.py?appid=example10` in two browser tabs
2. Reload browser tabs until two different UserIDs appear in the "User ID" formfields
3. Select the destination "User Dst SessionID" of browser tab 2
4. Wait approximately 30 seconds for message-server CORS setup with local docker network
5. Click "Send Data" button in one tab to send form data to the other tab
6. Observe the notify-indicator message confirming network message reception

### 4. Object Metadata

All UI and logic are defined in the respective `./static/object.json`.

- [Messaging Documentation](https://docs.webcodex.de/x0/v1.0/appdev-messaging.html)
- [Network Events Documentation](https://docs.webcodex.de/x0/v1.0/appdev-event-system.html)

### 5. Usage

This example can be used as a template for:
- Real-time communication between browser sessions
- Multi-user collaboration features
- Network-based data synchronization
- Demonstrating messaging capabilities using the **x0-framework**

---

**Note:** *x0-app*, *x0-db*, and *x0-msg-server* docker containers must be up and running for viewing.