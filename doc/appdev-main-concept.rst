.. appdev-main-concept

.. _appdevmainconcept:

7. Main Concept
===============

The main concept behind the *x0-system* is a simple, declarative approach, where
**three** core JSON structures describe the entire object ecosystem from which a complete
*x0-application* is statically rendered.

Object definitions inside this ecosystem utilize predefined *x0-system-classes*
(JavaScript classes) that follow a strict, system-defined OOP model. When properly
configured, a single JSON object declaration inside **1.** `object.json` describes exactly
one class instance configuration, which the system then uses for instantiation, while
**2.** `skeleton.json` defines general object relations, and **3.** `menu.json` defines
relations specific to menu purposes.

Through the integration of so-called `ServiceConnectors` (which will be discussed later),
this ecosystem can be fed with external data either at **load-time** or dynamically at **run-time**.

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

Optionally, in the *x0-static* (completely serverless) system variant, multilingual text data
must also be defined on a file basis:

- **text-data.json** — Defines the multilingual text data for use with *x0-objects* of type ``Text``.

7.2.1. Object Definition
************************

Each object in ``object.json`` is declared as follows:

.. code-block:: json

   {
     "$ObjectID": {
       "Type": "$ObjectType",
       "Attributes": {}
     }
   }

-  Each individual object declaration must be assigned a unique ID via ``$ObjectID``.
-  Each object declaration maps 1:1 to a single *x0-object* instance.
-  The ``Attributes`` property must contain the metadata required for the specific *x0-object* type (see :ref:`systemobjects`).
-  The ``$ObjectID`` is referenced from within ``skeleton.json`` *or* ``menu.json``.

7.2.2. Skeleton Definition
**************************

Definitions inside ``skeleton.json`` serve multiple purposes:

- Defining multiple *x0-screens* via a unique ``$ScreenID`` key in the root dictionary
- Relating *x0-objects* to a defined screen / ``$ScreenID``
- Cross-referencing *x0-objects* among themselves

7.2.3. Screen Reference
***********************

To reference objects to a given *x0-screen* (e.g., with its ``$ScreenID`` set to ``Screen1``), **exactly one**
object must be referenced by its ``RefID``.

.. code-block:: json

   {
     "Screen1": [
       {
         "Object1": {
           "RefID": "Screen1"
         }
       }
     ]
   }

- If a *x0-object* is **not connected** or connected to a **non-existent** screen, it will be ignored.
- If **multiple** *x0-objects* are connected, the system's behavior is undefined.

7.2.4. Object Reference
***********************

To reference objects among themselves inside ``skeleton.json``, the ``RefID``
of the child object must point to the parent object.

.. code-block:: json

   {
     "Screen1": [
       {
         "Object1": {
           "RefID": "Screen1"
         }
       },
       {
         "Object2": {
           "RefID": "Object1"
         }
       }
     ]
   }

When configured this way, the resulting chain of objects forms a **plain** object
**reference** without any logical consequences. However, consider the following:

.. note::
   Some *x0-object* **types** (e.g., ``ServiceConnector``) can be interposed
   **within** this chained structure to extend the model with logical behavior
   (which is defined inside the object's declarative configuration in ``object.json``).

7.2.5. Menu Integration
***********************

Building a menu structure is as easy as referencing objects inside ``skeleton.json``.

To see how x0 content areas are set up, refer to :ref:`appdevconfig-contentareas`.
Any *x0-object* type can be used inside the menu content area.

The only difference in ``menu.json`` is that the menu content area uses a statically defined
``$ScreenID`` named ``sysMenu``. Therefore, screen-referencing objects must always use
``"RefID": "sysMenu"``.

.. code-block:: json

  [
    {
      "x0Logo":
      {
        "RefID": "sysMenu"
      }
    },
    {
      "MenuTree":
      {
         "RefID": "sysMenu"
      }
    }
  ]

7.2.6. Skeleton ElementID
*************************

When a *x0-object* serves as a container that yields multiple referenceable objects
(e.g., a ``TabContainer``), the ``ElementID`` must be provided in addition to a valid ``RefID``.

Example configuration in ``object.json`` for a *x0-object* of type ``TabContainer`` and
two ``RangeSlider`` objects ready to be connected to the tab container's tabs:

.. code-block:: json

   {
     "TabContainer1": {
       "Type": "TabContainer",
       "Attributes": {
         "Tabs": [
           { "ID": "Tab1", "Default": true, "TextID": "TXT.BASIC-TABCONTAINER.TAB1", "Style": "col-md-6" },
           { "ID": "Tab2", "TextID": "TXT.BASIC-TABCONTAINER.TAB2", "Style": "col-md-6" }
         ]
       }
     },
     "Object1": {
       "Type": "RangeSlider",
       "Attributes": {
         "Min": 0,
         "Max": 100
       }
     },
     "Object2": {
       "Type": "RangeSlider",
       "Attributes": {
         "Min": 0,
         "Max": 100
       }
     }
   }

The following configuration in ``skeleton.json`` uses the ``ElementID`` to finally
connect a) the ``TabContainer`` to ``Screen1`` and b) ``Object1`` and ``Object2`` to the
relevant ``Tab`` elements:

.. code-block:: json

   {
     "Screen1": [
       {
         "TabContainer1": {
           "RefID": "Screen1"
         }
       },
       {
         "Object1": {
           "RefID": "TabContainer1",
           "ElementID": "Tab1"
         }
       },
       {
         "Object2": {
           "RefID": "TabContainer1",
           "ElementID": "Tab2"
         }
       }
     ]
   }

7.3. Custom Extensions
----------------------

Building **custom** *x0-extensions* (your own custom-coded classes) requires strict
adherence to the system's OOP model. The developer section of this documentation
describes both:

- **How to build** these classes
- **How to integrate** them into the *x0-core*

Please ensure you are familiar with :ref:`devbestpractices` before you begin.

.. tip::
   The *x0-system* only unlocks its **full potential** when building own custom user-defined
   extensions (*x0-user-objects*). This innovative, OOP-based templating is extremely powerful,
   especially for complex, nested, and interdependent elements.

.. important::
   This methodology makes it possible to build flexible, extensible, templatable,
   and highly maintainable ecosystems in large-scale environments.
