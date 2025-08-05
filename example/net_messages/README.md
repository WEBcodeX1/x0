# Example #10 (Net Messaging)

Example #10 illustrates *x0-object-metadata* network exchange via a messaging
component (server).

## 1. Dependencies

Example needs running `x0-msg-server` container and setting dns / hostname.

https://docker.webcodex.de/x0/docker.x0-msg-server.tar<br>

```bash
# load docker image
docker load < docker.x0-msg-server.tar

# start x0-message-server
cd ./docker/
./x0-start-msg-server.sh
```

Add `x0-msg-server.x0-localnet` with IP address `172.20.0.100` to /etc/hosts or dns zone.

## 2. Video

[Download example video (VLC or MPV player recommended)](https://download.webcodex.de/x0/video/x0-example-10-net-messages.mkv).

## 3. Open Browser Tabs

Open URL `http://x0-app.x0.localnet/python/Index.py?appid=example10` in two browser tabs.

Reload browser tab(s) until two different UserIDs appear in the "User ID" formfield(s).
Select the destination "User Dst SessionID" of browser tab 2. Wait apx. 30 seconds until
message-server CORS working with local docker network setup.

The form data will be sent when the "Send Data" button has been clicked and should be
displayed in the second browser tab. Also a notify-indicator message should appear
stating that you have received a network-message.
