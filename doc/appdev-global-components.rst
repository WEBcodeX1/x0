.. appdev-backend

.. _appdev-backend:

14. Global Components
=====================

14.1 Introduction
-----------------

This chapter is about the global components the x0-system provides.

- Global Data Storage
- Notify Indication
- Get/Set Data Abstraction
- Realtime Pagination System

14.2. Global Data Storage
-------------------------

## Improve / add overall description (add hidden-field, direct DOM reference)

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

The *x0-system* also enables a more fine grained control over global data (namesapce)
by mapping global variables not to the main global space but to a specified *x0-screen.

It is currently not supported to set screen based global variables declaratively,
programmatically, inside your own custom-built *x0-objects*, you can access them via:

.. code-block:: javascript

   const screenObj = sysFactory.getScreenByID('Screen1');
   var value = screenObj.getGlobalVar('MyScreenKey');

Write a screen global variable:

.. code-block:: javascript

   const screenObj = sysFactory.getScreenByID('Screen1');
   screenObj.setGlobalVar('MyScreenKey', 'my_value');

.. _appdev-backend-notify:

14.3. Notify Indication
-----------------------

## Add / improve the notifiy indicator description, probably add sub-chapters, but do not go into techincal details

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

14.4. Object Data Abstraction
-----------------------------

## Add complete chapter including subchapters / describe the generic ``getObjectData()`` /  ``setObjectData()`` concept in detail,

14.5. Realtime Pagination
-------------------------

## Add complete chapter including subchapters / describe the generic realtime pagination concept including examples / remark that also hierarical objects can be paginated
