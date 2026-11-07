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

The *x0-realtime-pagination* system splits an already loaded, **in-memory** collection
of data into multiple navigable pages directly inside the browser. Because all data is
already available on the client side, page navigation occurs instantly without requiring
additional network access.

This pagination engine is designed as a highly reusable runtime component. Any built-in
or **custom** *x0-object-type* can easily integrate pagination by exposing its row
collection and defining the desired row count per page. The component then automatically
manages the lifecycle and renders the corresponding navigation controls. This flexible
architecture allows the exact same mechanism to power standard components like ``Lists``,
as well as **deeply nested** custom *x0-objects* and containers.

14.5.1. Complex Editable Example
********************************

An advanced demonstration of this pagination mechanism is provided within the **x0-static**
Docker container (see :ref:`installation-minimal`). In the running application, navigate to
the **"Examples" / "Editable Templates"** menu; the **"Editable Order Remark List"** showcases
this specific implementation.

This live example showcases a highly complex runtime scenario where paginated items are
fully editable. It features an inline context menu to toggle the edit mode, remove individual
entries, or save the state of specific items directly. Additionally, a global control allows
you to switch all items into edit mode simultaneously—including those on currently invisible
pages.

The ability to maintain a fully synchronized, editable, and dynamic data state across hidden,
paginated views—even when dealing with deeply nested, hierarchical child object graphs—highlights
the true power of the *x0-framework*. Traditional component-based systems struggle to manage
such deep, multi-layered object mutations efficiently on invisible views, making *x0* uniquely
capable of building these complex, real-time UI models with absolute architectural simplicity.

14.6. Object Data Abstraction
-----------------------------

Object Data Abstraction defines how the *x0-shadow-dom* entity manages data.
In this context, data handling is categorized into the following distinct types:

1. External input (incoming data from external web services)
2. External output (outgoing data sent to external web services)
3. Internal object inter-communication (runtime data exchange between local objects)
4. External object inter-communication (real-time JSON messaging via network between clients)
5. Static object instantiation (executed on initial load)
6. Real-time object instantiation (executed dynamically at runtime)

While all these handling types are supported, type 4 currently requires improvement,
and type 6 is limited to a hardcoded implementation that only supports simple, non-nested object types.

The following sections will focus specifically on type 6 (Real-time object instantiation), as its
optimization fundamentally influences the future extensibility of the *x0-system*.

14.6.1. Real-Time Object Instantiation
**************************************

An initial prototype is currently testing a generic, recursive approach to get and set
nested JSON data using an Object-Document Mapping (ODM) pattern. In this architecture,
the *x0-shadow-dom* acts as an ODM entity, routing and managing data to dynamically modify
and instantiate complex object hierarchies—including deeply nested structures—at runtime.

This concept drastically reduces complexity from a NoSQL perspective: raw JSON data can
be fetched unmodified from MongoDB or similar databases and used directly to instantiate
multiple object hierarchies inside the *x0-runtime*. The same seamless process applies
conversely to data persistence and storage.

To support this complete generic implementation, the methods ``getObjectData()`` and
``setObjectData()`` are currently being developed and tested.

14.7. Drag & Drop
-----------------

Basic Drag & Drop functionality is already prepared; simple use cases, such as changing
an element's row position, can easily be achieved right now. However, when combined with
the Object Data Abstraction architecture introduced in the previous chapter, Drag & Drop
will evolve into a significantly more powerful capability.

This integration requires a fundamentally operational Real-Time Object Instantiation
component. Both of these advanced features are currently undergoing rapid development;
this functionality is expected to be available in *x0-version* 1.2.
