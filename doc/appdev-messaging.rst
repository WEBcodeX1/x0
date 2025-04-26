.. appdev-messaging

18. Messaging
=============

18.1. Intro
-----------

Messaging is used to transfer JSON Object-Data between Network Clients including
notification messages.

To enable local messaging functionality a docker container using
https://github.com/clauspruefer/micro-msg-server has been set up.

.. note::

    Docker networking has limitations, so running the messaging server on port
    8080 is the only option to run *x0-app* and *x0-msg-server* in parallel.

18.2. Start Server
------------------

Start the messaging server with the following commands.

.. code-block:: bash

	# start messaging server
	cd ./docker
    ./x0-start-msg-server.sh

18.3. Internal
--------------

Internally *x0-system* uses long polling mechanism which still runs stable
and performant on HTTP/1.1. Polling timeout is set to 10 seconds.

This method is planned to be replaced by WebSockets in the near future.

.. warning::

    Running the *micro-msg-server* is **not** intended for production use.
    Some system similar to rabbit-mq should be considered when processing heavy
    messaging loads.

.. warning::

    Also the messaging server code differs (patched) from the original and
    will only work with example code.

18.4. Example
-------------

The following example transfers form metadata from user session A over the
network to user session B.

* http://x0-app.x0.localnet/python/Index.py?appid=example10

To test message exchange, open the given URL in multiple (two) browser tabs
and reload until two different user ids in the ``User ID`` form (user ids are
random generated) will be displayed.

Now select the correct destination ``User Dst SessionID``. Clicking the 
``Send Data`` button will exchange the data and display the form data entered
in the source users browser as soon as possible.

.. warning::

    The example code does not emphasize security. It is not advisable to
    exchange user-sessions between network clients. Normally this is the backends
    job after a successful user authentication (user-id / session-id mapping).

.. warning::

    Also to simplify things mmessage deletion occurs immediately after processing
    on the messaging server side. This workflow is not acceptable in real-world
    scenarios, the deletion has to be re-triggered after receipt on client-side.
