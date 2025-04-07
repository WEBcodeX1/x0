.. appdev-overlay

.. _appdevoverlay:

12. Overlay
===========

It is possible to render a *x0-system-screen* in *x0-overlay-mode*.
Due to the *x0-system* design (all screens are present, but only one visible)
a screen instance will be setup coexisting with the original source version.

See very limited example (screen only contains one single *x0-object*) at
http://x0-app.x0.localnet/python/Index.py?appid=example6.

12.1. Object Instances
----------------------

Also it is possible to create *x0-object-instances* and *decorate* them with
additional *x0-objects* (enhanced templating functionality).

See example at http://x0-app.x0.localnet/python/Index.py?appid=example11.

.. warning::

    The *x0-feature* *x0-object-instances* is **not** very well-tested. Use with
    caution, especially in combination with *x0-overlay-mode*.
