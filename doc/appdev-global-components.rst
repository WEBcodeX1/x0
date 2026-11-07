.. appdev-backend

.. _appdev-backend:

14. Global Components
=====================

14.1 Introduction
-----------------

This chapter covers the global architecture components provided by the *x0-system*.
It outlines the following global sub-points:

- Global Data Storage
- Object Instancing
- Notify Indication
- Realtime Pagination System
- Data Abstraction Model
- Drag & Drop Integration

14.2. Global Data Storage
-------------------------

The *x0-global-data* concept officially **supersedes** the legacy practice of storing or
passing **global data** to the backend via hidden form fields. Instead of embedding
auxiliary state directly inside the DOM through invisible, unmanaged input elements,
*x0* exposes a dedicated, **declarative key/value store** that is natively integrated into
the object model. When combined with the ``SrcDataObjects`` (*SourceDataObjects*)
mechanism (see :ref:`appdeveventsystem`), global data — or screen-scoped global data —
can be selectively included in the payload of any backend service call, without
requiring a corresponding, ``Formfield`` of type **hidden** to carry the value.

- **Global Data** — application-wide key/value pairs accessible from any screen at
  any time via ``sysFactory.getGlobalVar()`` / ``sysFactory.setGlobalVar()``.

- **Screen Global Data** — per-screen key/value pairs that are populated automatically
  after a screen-level data-load and are scoped to that specific screen object.

14.2.1. Init Global Data
************************

*x0-global-data* is preloaded from a backend script at application startup
(*x0-init*). Register the script and variable mappings in the ``system.config``
database table (inside *x0-db* container):

.. code-block:: sql

   INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'preload_script', '"InitSystem.py"');
   INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'preload_var', '["GlobalVar1"] = "ret_var1"');
   INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'preload_var', '["GlobalVar2"] = "ret_var2"');
   INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'preload_var', '["GlobalVar3"] = "ret_var3"');

The mapping syntax ``["GlobalVarName"] = "backend_key"`` instructs *x0* to read
the key ``backend_key`` from the backend JSON response and store it under the name
``GlobalVarName`` in the global data store.

.. warning::
   The *x0-static* component does **not yet** support this feature.

14.2.2. Declarative Access
**************************

A global variable can be set declaratively through a *x0-action* on ``sysObjButton`` or
``sysObjButtonInternal`` *x0-object-type*:

.. code-block:: javascript

   "OnClick":
   [
      {
         "Action": "setglobalvar",
         "SetVar": "MyGlobalKey",
         "SetValue": "my_value"
      }
   ]

14.2.3. Screen Global Data
**************************

The *x0-system* also enables more **fine-grained control** over **global data** (like
an isolated namespace) by mapping global variables to a specified *x0-screen* rather than
the main global space.

While setting screen-based global variables declaratively is currently **not supported**,
you can access them programmatically inside your own custom-built *x0-objects* via:

.. code-block:: javascript

   const ScreenObj = sysFactory.getScreenByID('Screen1');
   var Value = ScreenObj.getGlobalVar('MyScreenKey');

Write a screen global variable:

.. code-block:: javascript

   const ScreenObj = sysFactory.getScreenByID('Screen1');
   ScreenObj.setGlobalVar('MyScreenKey', 'my_value');

.. _appdev-backend-notify:

14.3. Object Instancing
-----------------------

Any *x0-object-type* — regardless of whether it is a simple formfield, a complex
container, or a fully composed list — can be instantiated from an already-existing
declarative configuration. Rather than duplicating an entire ``object.json`` definition
entry by entry, a new entry can simply reference an existing one as its source and,
optionally, adjust only the attributes that need to differ.

In ``object.json``, a single object declarative configuration allows an entry to be
declared as a *instance* of another, already-defined object instead of repeating its
full definition.

14.3.1. InstanceOf
******************

The ``InstanceOf`` property is used whenever a new object must expose the exact same
declarative configuration as an already-defined one, yet needs to exist as its own,
separate copy somewhere else — for example, inside an overlay screen, as an item of a
different list, or bound to a different element in ``skeleton.json``. Rather than
duplicating the referenced object's full ``Attributes`` block, the new entry simply
points to it by its ``ObjectID`` and is resolved and merged into a standalone
configuration at screen setup.

.. code-block:: json

   "ExampleFormList2":
   {
      "InstanceOf": "ExampleFormList1"
   }

14.3.2. AttributesOverwrite
***************************

An instantiated object is not required to be an exact, unmodified copy of its source. By
adding an ``AttributesOverwrite`` block alongside ``InstanceOf``, any attribute already
present in the referenced configuration's ``Attributes`` can be selectively replaced with
a new value for this particular instance, while every attribute not listed remains
inherited unchanged from the source object.

.. code-block:: json

   "ExampleFormlist2":
   {
      "InstanceOf": "ExampleFormlist1",
      "AttributesOverwrite": {
         "ObjectIDs": [
            "Formfield1",
            "Formfield2",
            "Formfield3"
         ]
      }
   }

14.4. Notify Indication
-----------------------

The *x0-notify-indication* system is an asynchronous feedback channel that
informs the user about the outcome of actions executed in the background, without
interrupting the current screen state. It also bridges server-pushed messages into
the same indicator container.

The system supports multiple message containers (item instances), which are uniquely
addressable via their declarative ``ID``. Each message container can be configured with
a specific icon and background color for visual emphasis, and transitions through the
following states:

- *pending*
- *success*
- *error*
- *system error*

14.4.1. Base Mechanism
***********************

Add a notify indicator by adding the ``Notify`` attribute to *x0-button-type* like
shown in the following example:

.. code-block:: javascript

   "ButtonSubmit": {
      "Type": "Button",
      "Attributes": {
         "TextID": "TXT.BUTTON.SUBMIT",
         "Style": "btn btn-primary w-100 mt-3",
         "OnClick": "/python/example-service.py",
         "SrcDataObjects": [
            "FormfieldList1",
            "FormfieldObject1",
            "FormfieldObject2"
         ],
         "Notify": {
            "ID": "SubmitIdentifier",
            "DisplayHeaderID": "TXT.NOTIFY.EXAMPLE"
         }
      }
   }

14.4.2. Multi-language Support
******************************

The *x0-notify-indication* system fully complies with the framework's standard
multi-language requirements. All user-facing text—including notification headers
and status captions—is resolved dynamically using standard ``TXT.*`` identifiers.
By embedding these text identifiers rather than literal strings, every notification
automatically adapts to the active user session's language without requiring any
additional localization logic in the application configuration.

14.4.4. Programmatic Integration
********************************

Beyond declarative configurations, the *x0-notify-indication* system can also be
controlled programmatically within custom *x0-objects*. This programmatic approach
allows developers to explicitly drive the notification lifecycle via code.

Additionally, the programmatic model grants access to network events and background
messages processed by the notification system—a capability that is currently not available
through the declarative model. For a complete API reference, please consult the system
developer's guide starting at :ref:`devarchitecture`.

14.5. Realtime Pagination
-------------------------

The *x0-realtime-pagination* system, implemented by ``sysPagination``
(``sysRTPagination.js``), splits an already-loaded, in-memory collection of rows into
multiple navigable pages directly inside the browser. Page switches are resolved by
toggling each row's ``VisibleState`` between ``hidden`` and ``visible``
(``sysPagination.prototype.update()``); no additional backend round-trip is required to
move between pages whose data has already been fetched, resulting in instantaneous,
realtime page navigation.

14.5.1. Generic Object Integration
***********************************

``sysPagination`` is a standalone runtime object rather than a base class: any
*x0-system-object* — built-in or custom, flat or deeply nested — becomes paginatable by
instantiating it as ``new sysPagination(this)`` and exposing two conventions the
pagination engine relies on, a ``RowItems`` array holding the individual row objects and
a ``RowCount`` attribute defining the number of rows displayed per page. The pagination
object then renders its own navigation controls (previous/next links and numbered page
items, built via ``sysFactory.setupObjectRefsRecursive()``) and attaches them to the
parent object. This generic contract is what allows the same mechanism to drive the
built-in ``List`` (``sysObjList.js``) and ``ImageSelector`` (``sysObjImageSelector.js``)
*x0-object-types* as well as arbitrarily sophisticated, hierarchical custom containers,
since each ``RowItem`` may itself be an arbitrarily complex, nested object graph.

14.5.2. Editable, Paginated Containers
****************************************

``www/userObjExampleEditableItemContainer.js`` demonstrates this generic contract in a
production-complexity scenario: a custom container whose row items
(``userObjExampleEditableItem``) are not only paginated but also fully editable and
re-orderable in realtime. Every structural mutation — adding a row
(``addItem()``), reordering rows, or removing one — rebuilds the affected
``ChildObjects``/``RowItems`` state and then calls ``this.PaginationObject.update()``
(see ``redrawList()``) to recompute the currently visible slice and re-render the
navigation controls, keeping the pagination state consistent with the underlying,
dynamically changing data set.

14.6. Object Data Abstraction
-----------------------------

## Add complete chapter including subchapters / describe the generic ``getObjectData()`` /  ``setObjectData()`` concept in detail.

14.7. Drag & Drop
-----------------

## Add a remark that drag&drop is prepared but finaly needs a 100% generic ``getObjectData()`` /  ``setObjectData()`` abstraction to work correctly, which hopefully will be provided in system version 1.2.
