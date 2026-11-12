.. _glossary:

28. Glossary
============

.. _glossary-actions:

28.1. Actions (*x0-actions*)
----------------------------

A declarative command mechanism available on ``Button`` and ``ButtonInternal``
*x0-object-types* (see :ref:`event-actions`) for triggering client-side
operations such as setting or appending data (``set``, ``append``), toggling
visibility or activation states (``enable``, ``disable``, ``activate``,
``deactivate``), resetting objects (``reset``), switching tabs or screens
(``tabswitch``, ``switchscreen``), writing global variables (``setglobalvar``),
and opening overlays (``openoverlay``).

.. _glossary-appdev-doc:

28.2. Application Development Documentation
-------------------------------------------

The first part of the *x0* documentation (Chapters 1–20), covering framework
introduction, installation, basic configuration, CSS styling, the grid system,
built-in *x0-system-objects*, forms, context menus, global components, events,
actions, overlays, messaging, and Kubernetes deployment.

.. _glossary-bootstrap:

28.3. Bootstrap
---------------

A popular front-end CSS framework pre-integrated into the *x0-system*
(version 5.3) without any Bootstrap JavaScript dependencies. Its utility and
12-column responsive grid classes are applied directly via the ``Style``,
``RowStyle``, and ``ColStyle`` attributes in ``object.json`` (see
:ref:`global-css`).

.. _glossary-clipboard:

28.4. Clipboard (*x0-clipboard*)
--------------------------------

An internal, object-oriented data exchange buffer (``sysFactory.ClipboardData``)
used by ``get-data`` and ``set-data`` operations—typically triggered via an
*x0-context-menu* (see :ref:`context-menu`)—to transfer structured object data
between *x0-objects* such as ``List`` and ``FormfieldList`` without flat
DOM-scraping.

.. _glossary-context-menu:

28.5. Context Menu (*x0-context-menu*)
--------------------------------------

An object-bound, declaratively configurable right-click menu
(``sysContextMenu``, see :ref:`context-menu`) supported out of the box on
``List`` (row and header levels) and ``FormfieldList`` objects. It dispatches
internal system functions (``get-data``, ``set-data``, ``get-set-data``,
``remove``, ``remove-selected``, ``reset``), activates overlays, or fires
reactor events.

.. _glossary-cross-objects:

28.6. Cross-Objects (*x0*)
--------------------------

The namesake principle of the *x0-framework* (/krɒs ɒb.dʒɪkt/): modular,
object-oriented UI and logic components capable of exchanging structured JSON
data and events both locally within the browser and asynchronously across
network boundaries.

.. _glossary-declarative-config:

28.7. Declarative Configuration
-------------------------------

The primary application development paradigm in *x0* (see
:ref:`main-concept`), in which entire applications are assembled from
pre-existing *x0-system-objects* using static JSON metadata files
(``object.json``, ``skeleton.json``, ``menu.json``) without writing custom
JavaScript.

.. _glossary-dev-doc:

28.8. Developer Documentation
-----------------------------

The second part of the *x0* documentation (Chapters 21–27), covering system
architecture, the pointer-based OOP inheritance model, the complete JavaScript
class reference, development best practices, automated Pytest/Selenium testing,
example creation, and plugins.

.. _glossary-docker:

28.9. Docker
------------

The primary containerization platform used to package, run, and test the
*x0-system* locally (see :ref:`installation`), comprising pre-built images for
``x0-app`` (Apache/WSGI backend), ``x0-db`` (PostgreSQL), ``x0-test``
(Pytest/Selenium runner), ``x0-msg-server``, and the standalone ``x0-static``
container.

.. _glossary-event-system:

28.10. Event System (*x0::Reactor*)
-----------------------------------

The publish/subscribe event bus implemented by ``sysReactor`` and ``sysEvent``
(see :ref:`event-system`). It decouples *x0-event-producers* (such as
``Button``, ``ButtonInternal``, ``Tab``, ``FormfieldOnChange``, and
``ContextMenu``) from *x0-event-receivers* (such as ``ServiceConnector``), and
automatically dispatches built-in lifecycle events (``InitSystem``,
``SwitchScreen``).

.. _glossary-fontawesome:

28.11. Font Awesome
-------------------

An optional icon library integrated into *x0* whose CSS classes can be applied
declaratively via ``IconStyle`` and ``IconStylePost`` properties across buttons,
labels, trees, containers, and context menu items.

.. _glossary-global-data:

28.12. Global Data Storage (*x0-global-data*)
---------------------------------------------

A declarative, in-memory key/value store integrated into the object model (see
:ref:`global-storage`) that replaces legacy hidden form fields. It supports
both application-wide variables (``sysFactory.getGlobalVar()`` /
``setGlobalVar()``) and screen-scoped variables (``ScreenObj.getGlobalVar()`` /
``setGlobalVar()``).

.. _glossary-grid-system:

28.13. Grid System (*x0-grid-system*)
-------------------------------------

The runtime layout engine implemented by ``sysGridGenerator`` (see
:ref:`grid-system`). Driven by ``RowStyle``, ``RowAfterElements``,
``ColStyle``, and ``ColAfterElements``, it wraps arrays of *x0-objects* into
responsive Bootstrap grid containers and supports instant, client-side dynamic
restructuring without network requests.

.. _glossary-kubernetes:

28.14. Kubernetes
-----------------

An orchestration platform supported natively by the *x0-kubernetes-installer*
(``/kubernetes/setup/Setup.py``, see :ref:`kubernetes-deployment`) to deploy
multi-environment, load-balanced Google Kubernetes Engine (GKE) and Minikube
clusters with Kubegres PostgreSQL replication, ``ingress-nginx``, and TLS.

.. _glossary-metadata-model:

28.15. Metadata Model
---------------------

The three core JSON configuration files that declaratively define an
*x0-application* (see :ref:`metadata-model`): ``object.json`` (object types and
attributes), ``skeleton.json`` (screen definitions and parent/child hierarchy
links via ``RefID`` and ``ElementID``), and ``menu.json`` (object links for the
``sysMenu`` area), optionally accompanied by ``text-data.json`` in static
deployments.

.. _glossary-multilanguage:

28.16. Multi-language Support
-----------------------------

The built-in localization mechanism of *x0*, resolving ``TXT.*`` identifiers
dynamically against either the ``webui.text`` PostgreSQL table or
``/static/meta/text-data.json`` (see :ref:`system-config`). Changing the
active language via ``LanguageSwitch`` updates all ``Text`` (``sysObjSQLText``)
instances in place without a page reload.

.. _glossary-notify-indication:

28.17. Notify Indication (*x0-notify-indication*)
-------------------------------------------------

An asynchronous UI feedback channel (``sysObjAsyncNotifyIndicator``, see
:ref:`notify-indication`) positioned in the Notification Area. It tracks
background service calls through *pending*, *success*, *error*, and *system
error* states and displays server-pushed messages.

.. _glossary-data-abstraction:

28.18. Object Data Abstraction (ODM)
------------------------------------

The unified runtime data API exposed via ``getObjectData()`` and
``setObjectData()`` (see :ref:`data-abstraction` and
:ref:`oopmodel-classes-getobjectdata`). Acting as an in-browser Object-Document
Mapper (ODM) on top of the *x0-shadow-dom*, it supports both direct (``Plain``)
and recursive (``KeyValue`` via ``KeyID``) JSON mapping for seamless NoSQL and
backend integration.

.. _glossary-object-instancing:

28.19. Object Instancing (``InstanceOf``)
-----------------------------------------

A declarative reuse mechanism in ``object.json`` (see :ref:`object-instancing`)
that allows an object entry to clone an existing configuration via
``InstanceOf`` and selectively override individual attributes using
``AttributesOverwrite`` without duplicating the full definition.

.. _glossary-oop:

28.20. Object-Oriented Programming (OOP) Model
----------------------------------------------

The pointer-based JavaScript prototype inheritance architecture at the core of
*x0* (see :ref:`dev-oopmodel`). By deriving every UI and logic component from
``sysBaseDOMElement`` and ``sysBaseObject``, the engine shares methods via
prototype pointers and achieves a minimal memory footprint even with tens of
thousands of live object instances.

.. _glossary-overlay:

28.21. Overlay Mode (*x0-overlay-mode*)
---------------------------------------

A screen-layering capability managed by ``sysScreenOverlay`` (see
:ref:`appdev-overlay`) that activates one or more pre-instantiated screens on
top of the active base screen—either centered as a modal or explicitly
positioned—without re-creating DOM hierarchies.

.. _glossary-realtime-pagination:

28.22. Realtime Pagination (*x0-realtime-pagination*)
-----------------------------------------------------

An in-browser pagination engine (``sysPagination`` in ``sysRTPagination.js``,
see :ref:`realtime-pagination`) that partitions in-memory object collections
into navigable pages with zero network latency while preserving the live state
of objects on hidden pages.

.. _glossary-rtte:

28.23. Real-Time Templating Engine (RTTE)
-----------------------------------------

The core browser-side rendering concept of *x0* (see :ref:`abstract`), replacing
server-side string template replacement with live, metadata-driven JavaScript
object hierarchies that can be mutated and re-rendered (``rerenderObject()``)
in real time without bundling or page reloads.

.. _glossary-service-connector:

28.24. ServiceConnector
-----------------------

A non-visual intermediary *x0-system-object* (``sysServiceConnector``, see
:ref:`backend-connector`) bound between a parent container and a data-bearing
child object (such as ``List`` or ``FormfieldList``) in ``skeleton.json``. It
listens for configured reactor events and executes asynchronous XML-RPC/REST
POST calls to populate its target object.

.. _glossary-shadow-dom:

28.25. Shadow DOM (*x0-shadow-dom*)
-----------------------------------

The internal recursive object graph of x0 (see :ref:`dev-oopmodel`), in which
each live JavaScript object instance maintains a strict 1:1 association with a
corresponding browser DOM node. It acts as a stateful intermediate layer
between application logic and presentation.

.. _glossary-source-data-objects:

28.26. Source Data Objects (``SrcDataObjects``)
-----------------------------------------------

A declarative mechanism handled by ``sysSourceObjectHandler`` (see
:ref:`sourcedata-objects`) that gathers runtime values from referenced system
objects, hardcoded definitions, global variables, or screen-scoped variables and
appends them to the JSON payload of outgoing backend POST requests.

.. _glossary-base-class:

28.27. x0-base-class
--------------------

A foundational JavaScript class in the *x0-core*—specifically
``sysBaseDOMElement`` (single-node DOM binding) and ``sysBaseObject``
(recursive parent/child hierarchy, rendering, data API, and lifecycle)—from
which every *x0-system-object* and custom extension must derive.

.. _glossary-factory:

28.28. x0-factory (``sysFactory``)
----------------------------------

The global singleton registry and bootstrap entry point of an *x0-application*
(see :ref:`dev-oopmodel`). It holds the ``SetupClasses`` constructor map,
instantiates and switches ``sysScreen`` instances, manages global variables and
localized texts, and starts the reactor and async notification handler.

.. _glossary-screen:

28.29. x0-screen (``sysScreen``)
--------------------------------

A self-contained, pre-instantiated visual view rooted at a HierarchyRootObject
(see :ref:`appdev-config` and :ref:`dev-oopmodel`). Inactive screens persist as
hidden DOM layers rather than being destroyed, guaranteeing full client-side
state preservation across screen switches.

.. _glossary-static:

28.30. x0-static
----------------

The lightweight, completely serverless deployment mode and Docker container
(``/docker/x0-static.dockerfile``, see :ref:`installation-minimal`) served by
Apache alone without PostgreSQL, WSGI, or background services, bundling a
complete runnable showcase of x0 examples.

.. _glossary-system-object:

28.31. x0-system-object
-----------------------

Alias: *x0-object*.

A modular, reusable building block in the *x0-framework* (either shipped
out of the box under ``/www/sysObj*.js`` or implemented as a custom class
extension) that combines declarative JSON metadata, OOP behavior, DOM binding,
and inter-object communication.
