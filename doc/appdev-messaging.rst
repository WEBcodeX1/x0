.. appdev-messaging

13. Messaging
=============

Messaging is used to transfer JSON Object-Data between Network Clients including
Notify Messages.

To get local messaging working a docker container using
https://github.com/clauspruefer/micro-msg-server  has been configured.

Docker Networking is quite limited so running the messaging server on port 8080
is the only option to run *x0-app* and *x0-msg-server* in parallel.

Start the messaging server with the following commands.

.. code-block:: bash

	# install docker
	cd ./docker
    ./x0-start-msg-server.sh

Internally *x0-system* uses long polling mechanism which still runs stable
and on HTTP/1.1.

.. warning::

    Running the micro-msg-server is not intended for production use.
    Some system similar to rabbit-mq should be considered when processing heavy
    loads.

13.1. Example
-------------

Example requires CORS to be disabled in Browser because port 8080 is
misinterpreted by first OPTIONS client request.

For Firefox, do this by setting the following config option. Afterwards
example is runnable.

.. code-block:: bash

    content.cors.disable = true

* http://x0-app.x0.localnet/python/Index.py?appid=example10

13.2. Messaging Format
----------------------

Coming soon.
