.. appdev-messaging

14. Messaging
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
and performant on HTTP/1.1. Polling timeout is set to 10 seconds.

.. warning::

    Running the *micro-msg-server* is **not** intended for production use.
    Some system similar to rabbit-mq should be considered when processing heavy
    messaging loads.

.. warning::

    Also the messaging server code differs (patched) from the original and
    will only work with example code.

14.1. Example
-------------

The following example exchanges form metadata from users session a)
over the network to user session b).

* http://x0-app.x0.localnet/python/Index.py?appid=example10

To test message exchange, open the given URL in multiple (two) browser tabs
and reload until two different user ids in the ``User ID`` form (user ids are
random generated) will be displayed.

Now select the correct destination ``User Dst SessionID``. Clicking the 
``Send Data`` button will exchange the data and display the form data entered
in the source users browser as soon as possible.

.. warning::

    The example code does not emphasise on security. It is no good idea to
    exchange user-sessions between network clients. Normally this is the backends
    job after a successful user authentication (user-id / session-id mapping).

.. warning::

    Also to simplify things message deletion takes place directly after returning
    on msg-server side. This workflow is not acceptable in real-world scenarios,
    the deletion has to be re-triggered after receipt on client-side.

14.2. Internal Messaging Format
-------------------------------

Coming soon.
