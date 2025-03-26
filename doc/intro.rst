.. intro

1. Preface / Abstract
=====================

*x0* (cross-object) JavaScript Framework is a modern tool for building
powerful Web-Browser **Realtime-SPA (Single Page Applications)** efficiently.

See :ref:`x0special` what makes x0 system so **special**.

1.1. Cross Objects
------------------

The *x* in *x0* stands for **cross** meaning **communication**. *x0-objects* are
able to exchange (update) their metadata directly via JSON metadata.

1.2. Bootstrap / CSS Themes
---------------------------

*x0-system* includes current Bootstrap 5.3 basic CSS stylesheets (**zer0** JS logic).

Imagine *x0* as being the system which empowers Bootstrap with smart enhanced,
true OOP based JavaScript logic.

Also extending CSS styles by your own stylesheets is a procedure of minutes.

1.3. Fontawesome
----------------

Fontawesome free is integrated into *x0 base* system to provide an easy way to
use **high quality icons**.

1.4. CSS Grid System
---------------------

To guarantee future-proof responsiveness, *x0-system* provides smart libraries
for building real cool device-independend stuff using bootstraps grid styles.

Boostrap grid details see https://getbootstrap.com/docs/5.3/layout/grid/.

1.5. Browser Compability
------------------------

*x0-system* is built in a generic way (ECMA 8) so it runs on all current browsers
(Firefox, Chrome, Opera, Safari) natively.

1.6. Multi Language
-------------------

*x0-system* runs **multi-language** (english and german currently); the display
language even can be switched in realtime (without page reload).

1.7. Docker Images
------------------

Docker images are provided to start playing with *x0-system* in no time.

- https://docker.webcodex.de/x0/docker.x0-app.tar
- https://docker.webcodex.de/x0/docker.x0-db.tar

See installation subsection #add link howto handle.

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

.. _x0special:

1.11. What Makes x0 Special
---------------------------

The following 3 subsections describe what makes *x0-system* so special.

1.11.1. Div 2 Object
********************

Assume this example covers one of the simplest *x0 system objects* (SQLText).
It is configurable to get a Text by ID from the backend and display it in the
current selected language (english or german).

::Visio DIV 2 Object Instance

<div id="Screen1_HelloWorldText" class="">Hello World</div> Instance::SQLObject

The x0 system **always** associates **one single** *JS Object Instance* to a
single (rendered) DOM DIV (1:1). There will be no DOM DIVs without a connected
*JS Object Instance*.

If a rendered *x0-screen* contains 187 DIVs, 187 corresponding
*JS Object Instances* have been setup by *x0-system*.

Also each object holds its information about its *Parent Object* and the base
rendering routines (inherited *x0-base-classes*).

1.11.2. True DOM OOP
********************



The objects JS code uses the SQLTextID property inside its `switchLanguage`
method (member) to switch the text to the given language in realtime.

sysFactory.getObjectByID("sqltext1").switchLanguage('de');

1.11.3. Object Combination
**************************

The *x0* **killer feature** is the easy combination (chaining) of existing
objects to new ones.

Very simplified (), defining a new object "SelfDefinedObject" like:

this.addObject(new SQLTextObj(TextID));
this.addObject(new Formfield(Type=Text, Value));

generates a new object which is referencable like:

this.addObject(new SelfDefinedObject(Config));

Detailed information, how to build *x0-system-objects*, see developer documentation subsection xyz
