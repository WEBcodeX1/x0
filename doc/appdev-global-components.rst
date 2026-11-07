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
- Get/Set Data Abstraction
- Realtime Pagination System
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

The *x0-notify-indication* system is a non-blocking, asynchronous feedback channel that
informs the user about the outcome of actions executed in the background, without
interrupting the current screen state. It is implemented across four cooperating engine
components: ``sysObjAsyncNotify`` (``sysAsyncNotify.js``), the globally accessible
singleton container ``sysObjAsyncNotifyIndicator`` (``sysAsyncNotifyIndicator.js``,
exposed as ``sysFactory.GlobalAsyncNotifyIndicator``), the per-message
``sysObjAsyncNotifyIndicatorItem`` (``sysAsyncNotifyIndicatorItem.js``), and the
``sysAsyncNotifyMsgHandler`` (``sysAsyncNotifyMsgHandler.js``), which bridges
server-pushed messages into the same indicator container. Every individual notification
is represented by its own ``sysObjAsyncNotifyIndicatorItem`` instance, uniquely
addressable through its declarative ``ID``, and progresses through a small status
lifecycle — *pending*, *success*, *error* or *system error* — that is reflected both in
the item's icon and its background styling.

14.4.1. Base Mechanism
***********************

Add a notify indicator by adding the ``Notify`` attribute to *x0-button-type* like
shown in the following example. 

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

For a backend-calling ``Button``, the declarative ``Notify`` block is registered as soon
as the call is dispatched (``sysObjButton.prototype.callService()`` delegates to
``addNotifyHandler()``), and the corresponding ``sysObjAsyncNotifyIndicatorItem`` is
resolved automatically once the XML-RPC response returns, with the resulting status
(*success*, *error* or *system error*) derived from the response payload
(``sysObjButton.prototype.callbackXMLRPCAsync()``). ``ButtonInternal`` shares the same
validation and action-processing foundation — ``validateForm()``, ``processActions()``
and the subsequent event-firing lifecycle — with ``Button``; because its actions are
resolved entirely on the client, a ``ButtonInternal``-driven status indication is instead
produced by invoking the very same indicator API directly once the internal operation
has concluded (see 14.4.3).

14.4.2. Multi-language Support
*******************************

All user-facing text produced by the indicator — the header associated with a
``Notify.ID``, the status captions (*success* / *error* / *system error*), and auxiliary
interface strings such as the dismiss button's tooltip — is resolved through the
framework's central text-resolution service, ``sysFactory.getText()``, following the same
``TXT.*`` identifier convention used throughout *x0* (for example
``TXT.SYS.NOTIFYINDICATOR.SUCCESS``, ``TXT.SYS.NOTIFYINDICATOR.ERROR`` and
``TXT.SYS.NOTIFYINDICATOR.TITLE_CLOSE``). Because these identifiers — rather than literal
strings — are embedded in the rendered item
(``sysObjAsyncNotifyIndicatorItem.prototype.updateDisplayText()``), every notification
produced by the system automatically follows the session's active language without
requiring any additional localization logic in application code.

14.4.3. Versatility Beyond the ServiceConnector
************************************************

While the ``ButtonSubmit`` example couples ``Notify`` with a ``ServiceConnector``-style
backend dispatch, the underlying indicator API —
``sysFactory.GlobalAsyncNotifyIndicator.addMsgItem()`` together with
``getMsgItemByName(ID).setProcessStatus()`` — is entirely independent of that transport
and works equally well with purely internal, declaratively-triggered logic. As a concrete
example, ``sysObjSystemSettingsContainerItem.prototype.ButtonCallback()``
(``sysObjSystemSettingsContainer.js``) registers and resolves a notification purely from
a local get/set round-trip against an in-page object, without ever contacting a backend
service. The same indicator is also the target of ``sysAsyncNotifyMsgHandler``'s
long-polling channel (``sysAsyncNotifyMsgHandler.js``), which lets the backend push
unsolicited ``sys-indicator`` status updates — as well as declarative ``fire-events`` and
``switch-screen-id`` instructions — into already-registered indicator items. Taken
together, these cases demonstrate that notify indication is a general-purpose,
transport-agnostic event sink rather than a feature exclusive to ``ServiceConnector``
calls.

14.4.4. Programmatic Extensibility
************************************

Because ``sysFactory.GlobalAsyncNotifyIndicator`` is a globally accessible singleton, any
custom *x0-system-object* can integrate with the notify indication system
programmatically, entirely independent of the declarative ``Notify`` attribute: calling
``addMsgItem({ "ID": … })`` registers a new indicator item, and the item returned by
``getMsgItemByName(ID)`` exposes ``setProcessStatus()``, ``setDisplayText()`` and
``updateDisplay()`` to drive its lifecycle explicitly from custom application logic, as
demonstrated by ``sysObjSystemSettingsContainer.js``. For the complete method-level
reference of the classes involved — ``sysObjAsyncNotifyIndicator``,
``sysObjAsyncNotifyIndicatorItem`` and ``sysAsyncNotifyMsgHandler`` — see
:ref:`devoopmodel-classes-asyncnotify` in the system developer's guide.

14.5. Object Data Abstraction
-----------------------------

## Add complete chapter including subchapters / describe the generic ``getObjectData()`` /  ``setObjectData()`` concept in detail.

14.6. Realtime Pagination
-------------------------

## Add complete chapter including subchapters / describe the generic realtime pagination concept including examples / remark that also hierarical objects can be paginated

14.7. Drag & Drop
-----------------

## Add a remark that drag&drop is prepared but finaly needs a 100% generic ``getObjectData()`` /  ``setObjectData()`` abstraction to work correctly, which hopefully will be provided in system version 1.2.
