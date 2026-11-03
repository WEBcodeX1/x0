.. appdev-main-concept

.. _appdevmainconcept:

7. Main Concept
===============

The main concept behind the *x0-system* is a simple, declarative approach, where
**three** core JSON arrays describe the entire object ecosystem from which a complete
*x0-application* is statically rendered.

A single object definition inside this ecosystem (the object skeleton) utilizes
pre-existing *x0-system-classes* (JavaScript classes) that follow a strict, system-defined
OOP model. When properly configured, a single JSON object declaration inside ``object.json``
describes exactly one class instance configuration, which the system then uses for
instantiation.

Through the integration of so-called ``ServiceConnectors`` (which will be discussed later),
this ecosystem can be fed with external data either at load-time or dynamically at run-time.

7.1. Shadow DOM
---------------

The most important part of the system is the *x0-shadow-dom*. Just like the DOM is
hierarchically structured, the internal x0 object representation consists of recursive
objects, where each individual object is always bound 1:1 to a DOM layer.

This concept establishes an intermediate layer (a shadow) between the logical and the
presentational (DOM) layers. This entirely outperforms old-fashioned approaches, such as
directly accessing or manipulating the DOM, or using hidden form fields for data storage.

One might think this concept scales poorly, but the exact opposite is true. While
function-driven systems scale badly, the *x0-system* integrates a true, smart,
abstract **OOP-driven model**. It utilizes the JavaScript core engine's pointer-based
inheritance mechanism, which references inherited data memory only once. Consequently,
instantiating 10,000 object structures results in an exceptionally low memory and
performance footprint.

7.2. Metadata & Object Model
----------------------------

**One** *x0-application* is defined through a declarative, JSON-driven metadata model inside
the following files:

-  **object.json** — Defines all *x0-system-objects*, including their attributes and metadata.
-  **skeleton.json** — Defines how objects relate to one another and establishes screen references.
-  **menu.json** — Contains a subset of *skeleton.json* specific to the "menu" screen, managing navigation structures.

7.2.1. object.json
******************

Each object in ``object.json`` is declared as:

.. code-block:: json

   {
     "$ObjectID": {
       "Type": "$ObjectType",
       "Attributes": {}
     }
   }

-  ``$ObjectID`` is referenced from ``menu.json`` *or* ``skeleton.json``.

8.1.2. skeleton.json
********************

Defines which screen each object belongs to, e.g.:

.. code-block:: json

   {
     "Screen1": [
       { "Object1": { "RefID": "Screen1" } }
     ]
   }

7.4.3. menu.json
****************

Uses the same syntax as ``skeleton.json``, but the root ``RefID`` is always
``sysMenu`` (see :ref:`appdevconfig-contentareas`).

7.5. Metadata ElementID
-----------------------

Object elements (e.g. tabs within a tab container) are referenced via the
``ElementID`` property in ``skeleton.json``.

Example: Tab Container
**********************

**object.json**

.. code-block:: json

   {
     "TabContainer1": {
       "Type": "TabContainer",
       "Attributes": {
         "Tabs": [
           { "ID": "Tab1", "Default": true, "TextID": "TXT.BASIC-TABCONTAINER.TAB1", "Style": "col-md-4" },
           { "ID": "Tab2", "TextID": "TXT.BASIC-TABCONTAINER.TAB2", "Style": "col-md-8" }
         ]
       }
     }
   }

**skeleton.json**

.. code-block:: json

   {
     "Screen1": [
       { "TabContainer1": { "RefID": "Screen1" } },
       { "Text1": { "RefID": "TabContainer1", "ElementID": "Tab1" } },
       { "Text2": { "RefID": "TabContainer1", "ElementID": "Tab2" } }
     ]
   }

7.6. Object Templates
---------------------

-  Custom object templates are registered via the ``template_file`` and
   ``setup_class`` configuration parameters in the database.
-  ``.js`` template files are placed under ``/static``.
-  See :ref:`devobjectmodeling` for the underlying object model.
