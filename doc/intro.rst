.. intro

1. Preface / Abstract
=====================

*x0* (cross-object) JavaScript Framework is a modern tool for building
powerful Web-Browser **Realtime-SPA (Single Page Applications)** efficiently.

.. note::

    See :ref:`targetgroup` which target group the *x0-system* is intended for.

1.1. Cross Objects
------------------

The *x* in *x0* stands for **cross** meaning **communication**. *x0-objects* are
able to exchange (update) their metadata **directly** via JSON metadata.

1.2. Bootstrap / CSS Themes
---------------------------

*x0-system* includes current Bootstrap 5.3 basic CSS stylesheets without a
single line of JavaScript code (**zer0 Bootstrap JS**).

Imagine *x0* as being the system which empowers Bootstrap with smart enhanced,
true OOP based JavaScript logic.

Also **extending CSS styles** by your own stylesheets is a procedure of minutes.

1.3. Fontawesome
----------------

Fontawesome 6 free is integrated into *x0 base* system to provide an easy way
to use **high quality icons**.

1.4. CSS Grid System
---------------------

To guarantee future-proof responsiveness, *x0-system* provides smart libraries
for building real cool device-independend stuff relying on bootstraps grid styles.

Boostrap grid details see https://getbootstrap.com/docs/5.3/layout/grid/.

1.5. Browser Compability
------------------------

*x0-system* is built in a generic way (ECMA 6, 7) so it runs on all current
browsers (Firefox, Chrome, Opera, Safari) natively.

1.6. Multi Language
-------------------

*x0-system* runs **multi-language** (english and german currently); the display
language even can be switched in realtime (without page reload).

1.7. Docker Images
------------------

Docker images are provided to start playing with *x0-system* in no time.

- https://docker.webcodex.de/x0/docker.x0-app.tar
- https://docker.webcodex.de/x0/docker.x0-db.tar
- https://docker.webcodex.de/x0/docker.x0-test.tar

See installation subsection (#add link) howto use.

1.8. Kubernetes
---------------

Also running x0 applications on (load-balanced) Google Kubernetes Engine has
been natively implemented into x0 system.

See https://github.com/WEBcodeX1/x0/blob/main/kubernetes/README.md.

1.9. Licensing
--------------

*x0-base-system* is licensed under OpenSource AGPLv3 license.

Some following components including the WYSIWYG-Editor will be **non-free**.

1.10. Milestones
----------------

Current milestones see GitHub https://github.com/WEBcodeX1/x0/milestones.

.. _targetgroup:

1.11. x0 Target Group
---------------------

The following 3 subsections describe the *x0-systems* **technical advantages**
and which **target group** the system is intended for.

1.11.1. Div 2 Object Mapping
****************************

Assume the following example covers one of the simplest *x0 system objects*:
**SQLText**. It is configurable to get a Text by ID from the backend and display
it in the current selected language (english or german).

.. image:: images/x0-oop-obj2div-mapping.png
  :alt: image - oop object2div mapping

The x0 system **always** associates **one single** *JS Object Instance* to a
single (rendered) DOM DIV (1:1). There will be no DOM DIVs without a connected
*JS Object Instance*.

If a rendered *x0-screen* contains e.g. 187 DIVs, 187 corresponding
*JS Object Instances* have been setup by *x0-system* on *x0-app-start* (browser
page load).

Also each object holds its information about its *Parent Object* and the base
rendering routines (inherited *x0-base-classes*).

.. note::

    More complex objects consist of multiple (far more) DIVs.
    Check out the developer section about howto design *x0-system-objects*
    ... #add ref to developer subsection!

1.11.2. True DOM OOP
********************

The *x0-systems* **DIV2ObjectMapping** method opens up true OOP based DOM DIV
modeling / manipulation to the programmer.

.. note::

    Which in fact makes it possible to create real powerful, enhanced,
    **combined** *x0-system-objects* (details see next section).

Now continuing with the SQLText example from the previous section.

So the *x0-system* has created a SQLText object instance with the TextID
"Text1" defined inside `object.json`, its `update()` method is callable
from outside to update display text (DIV) to current selected system language
in **realtime**.

.. code-block:: javascript

    sysFactory.getObjectByID("TXT.Text1").update();

Additionally the programmer will be provided with the following abilities:

- Redirecting Events
- Callbacks from other Objects
- Web-Service Data Source Binding

1.11.3. Object Combination
**************************

The **most remarkable feature** provided by the *x0-system* is the possibility
of combining (chaining) existing objects into new ones.

Very simplified (invalid JavaScript syntax), defining a new object
**SelfDefinedObject** is done like:

.. code-block:: javascript

    this.addObject(new SQLTextObj(TextID='TXT.DISPLAY'));
    this.addObject(new Formfield(Type='Pulldown', Options=['Option1', 'Option2']));

Now, exactly in the same way defining the *SelfDefinedObject* object, it can
be reused to define other new objects.

.. code-block:: javascript

    this.addObject(new SelfDefinedObject(Config));

.. note::

    Detailed information, how to integrate *x0-system-objects*, see
    developer documentation subsection xyz ... #add ref to developer subsection!
