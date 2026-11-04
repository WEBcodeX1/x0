.. appdev-backend

.. _appdev-backend:

14. Global Components
=====================

14.1 Intro
----------

This chapter is about all x0-global components.

- Global Data Storage
- Notify Indication
- Get/Set Data Abstraction
- Realtime Pagination System

14.2. Global Data
-----------------

The *x0-system* provides two independent key/value stores for sharing state across
objects, screens, and backend calls:

- **Global Data** — application-wide key/value pairs accessible from any screen at
  any time via ``sysFactory.getGlobalVar()`` / ``sysFactory.setGlobalVar()``.
- **Screen Global Data** — per-screen key/value pairs that are populated automatically
  after a screen-level data-load and are scoped to that specific screen object.

14.2.1. Init Global Data
************************

*x0-global-data* is preloaded from a backend script at application startup
(*x0-init*). Register the script and variable mappings in the ``system.config``
table:

.. code-block:: sql

   INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'preload_script', '"InitSystem.py"');
   INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'preload_var', '["GlobalVar1"] = "ret_var1"');
   INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'preload_var', '["GlobalVar2"] = "ret_var2"');
   INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'preload_var', '["GlobalVar3"] = "ret_var3"');

The mapping syntax ``["GlobalVarName"] = "backend_key"`` instructs *x0* to read
the key ``backend_key`` from the backend JSON response and store it under the name
``GlobalVarName`` in the global data store.

.. warning::
   The *x0-static* component does not yet support this feature.

14.2.2. Runtime Access
**********************

A global variable can be set declaratively through a **Button** action:

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

Each *x0-screen* maintains its own private key/value store that is populated
automatically when the screen's backend data-load completes
(``triggerGlobalDataLoad``). The store is updated with the full JSON result
returned by the backend service, so every top-level key in that response becomes
a screen-level global variable.

Read a screen global variable in JavaScript:

.. code-block:: javascript

   var screenObj = sysFactory.getScreenByID('Screen1');
   var value = screenObj.getGlobalVar('MyScreenKey');

Write a screen global variable:

.. code-block:: javascript

   var screenObj = sysFactory.getScreenByID('Screen1');
   screenObj.setGlobalVar('MyScreenKey', 'my_value');

14.2.3. Global SrcDataObjects
*****************************

Use the ``GlobalVar`` SrcDataObject type to include individual application-wide
global variables in a backend request:

.. code-block:: javascript

   "SrcDataObjects":
   {
      "MyGlobalKey":
      {
         "Type": "GlobalVar"
      }
   }

The key ``MyGlobalKey`` is both the name under which the value is looked up in the
global store and the key under which it is sent to the backend.

14.2.4. Screen Based SrcDataObjects
***********************************

Use the ``ScreenGlobalVar`` SrcDataObject type to forward a screen-level variable
to the backend. Specify the source screen with ``ScreenID``:

.. code-block:: javascript

   "SrcDataObjects":
   {
      "MyScreenKey":
      {
         "Type": "ScreenGlobalVar",
         "ScreenID": "Screen1"
      }
   }

The value stored under ``MyScreenKey`` in ``Screen1``'s global store is sent to
the backend under the same key name.

.. _appdev-backend-notify:

14.3. Notify Indication
-----------------------

To provide the user with status information (notify) a notification-indicator
per backend service call is configurable.

Add a notify indicator by adding "Notify" attribute to *x0-button-type* like
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
