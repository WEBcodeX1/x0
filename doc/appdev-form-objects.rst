.. appdev-form-objects

.. _appdevformobjects:

11. Formfield Objects
=====================

* :ref:`objecttype-formfieldlist`
* :ref:`objecttype-formfieldtext`
* :ref:`objecttype-formfieldlabel`
* :ref:`objecttype-formfieldtextarea`
* :ref:`objecttype-formfieldpulldown`
* :ref:`objecttype-formfielddynpulldown`
* :ref:`objecttype-formfieldcheckbox`
* :ref:`objecttype-formfieldhidden`

.. _objecttype-formfieldlist:

11.1. FormfieldList
-------------------

The ``FormfieldList`` *x0-object-type* serves as both a *x0-form* management tool
and a *x0-object-container*.

It offers advanced *x0-form-validation* capabilities and can be referenced by multiple
*x0-control-flow-modifying* *x0-object-types*.

More info at :ref:`appdevforms`.

11.1.1. Object Attributes
*************************

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| HiddenFields        | Array                | Array of Formfield IDs                          |
	+---------------------+----------------------+-------------------------------------------------+
	| Sections            | Array of Elements    | Array of Section Objects / Section Properties   |
	+---------------------+----------------------+-------------------------------------------------+

11.1.2. Section Attributes
**************************

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| ID                  | String               | Section Identifier                              |
	+---------------------+----------------------+-------------------------------------------------+
	| Object              | String               | Header to x0-object (existing) Reference        |
	+---------------------+----------------------+-------------------------------------------------+
	| ObjectAttributes    | Object               | Header Properties                               |
	+---------------------+----------------------+-------------------------------------------------+
	| Formfields          | Array                | Array of Formfield IDs                          |
	+---------------------+----------------------+-------------------------------------------------+

11.1.3. Section Object Attributes
*********************************

	+---------------------+---------------+--------------------------------------------------------+
	| **Property**        | **Type**      | **Description**                                        |
	+=====================+===============+========================================================+
	| Style               | CSS-String    | CSS Style Classes, space separated                     |
	+---------------------+---------------+--------------------------------------------------------+
	| SubStyle            | CSS-String    | CSS Style Classes, space separated                     |
	+---------------------+---------------+--------------------------------------------------------+
	| HeaderIcon          | CSS-String    | Fontawesome Icon CSS for Prepend Icon                  |
	+---------------------+---------------+--------------------------------------------------------+
	| HeaderTextID        | TextID-String | TextID referenced in "webui.text" DB Table / Multilang |
	+---------------------+---------------+--------------------------------------------------------+
	| SubHeaderTextID     | TextID-String | TextID referenced in "webui.text" DB Table / Multilang |
	+---------------------+---------------+--------------------------------------------------------+

11.1.4. Grid Attributes
***********************

Global Grid Attributes can be applied, see :ref:`appdevgridsystem`.

11.1.5. Runnable Example
************************

* http://x0-app.x0.localnet/python/Index.py?appid=example5

.. _objecttype-formfieldtext:

11.2. FormfieldText
-------------------

The ``FormfieldText`` *x0-object-type* renders an HTML ``<input>`` element of type ``text``.

11.2.1. Object Attributes
*************************

.. table:: Object Type FormfieldText Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'text'                             |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| StyleValidateOk     | CSS-String           | CSS Style Classes Override, space separated     |
	+---------------------+----------------------+-------------------------------------------------+
	| StyleValidateFail   | CSS-String           | CSS Style Classes Override, space separated     |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| Placeholder         | String               | Placeholder                                     |
	+---------------------+----------------------+-------------------------------------------------+
	| MaxLength           | Integer              | Maximum Length Character Count                  |
	+---------------------+----------------------+-------------------------------------------------+
	| Number              | Boolean              | Container Div Type, <DOMType></DOMType>         |
	+---------------------+----------------------+-------------------------------------------------+
	| Disabled            | Boolean              | Set HTML Form "disabled" Property               |
	+---------------------+----------------------+-------------------------------------------------+
	| ReadOnly            | Boolean              | Set HTML Form "readonly" Property               |
	+---------------------+----------------------+-------------------------------------------------+
	| Min                 | Integer              | Minimum Number Value                            |
	+---------------------+----------------------+-------------------------------------------------+
	| Max                 | Integer              | Maximum Number Value                            |
	+---------------------+----------------------+-------------------------------------------------+

11.2.2. FormfieldList Related
*****************************

.. table:: Object Type FormfieldText FormfieldList Related Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DBColumn            | String               | Database Column Reference                       |
	+---------------------+----------------------+-------------------------------------------------+

.. _objecttype-formfieldlabel:

11.3. FormfieldLabel
--------------------

The ``FormfieldLabel`` *x0-object-type* renders an HTML ``<label>`` element for form inputs.

11.3.1. Object Attributes
*************************

.. table:: Object Type FormfieldLabel Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'label'                            |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| LabelFor            | String               | HTML attribute "labelfor"                       |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| DisplayText         | String               | Hardcoded / Non-multilanguage String            |
	+---------------------+----------------------+-------------------------------------------------+

.. _objecttype-formfieldtextarea:

11.4. FormfieldTextarea
-----------------------

The ``FormfieldTextarea`` *x0-object-type* renders an HTML ``<textarea>`` element for form inputs.

11.4.1. Object Attributes
*************************

.. table:: Object Type FormfieldTextarea Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'textarea'                         |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| Placeholder         | String               | Placeholder                                     |
	+---------------------+----------------------+-------------------------------------------------+
	| MaxLength           | Integer              | Maximum Length Character Count                  |
	+---------------------+----------------------+-------------------------------------------------+
	| Number              | Boolean              | Container Div Type, <DOMType></DOMType>         |
	+---------------------+----------------------+-------------------------------------------------+
	| Disabled            | Boolean              | Set HTML Form "disabled" Property               |
	+---------------------+----------------------+-------------------------------------------------+
	| ReadOnly            | Boolean              | Set HTML Form "readonly" Property               |
	+---------------------+----------------------+-------------------------------------------------+
	| Min                 | Integer              | Minimum Number Value                            |
	+---------------------+----------------------+-------------------------------------------------+
	| Max                 | Integer              | Maximum Number Value                            |
	+---------------------+----------------------+-------------------------------------------------+

.. _objecttype-formfieldpulldown:

11.5. FormfieldPulldown
-----------------------

The ``FormfieldPulldown`` *x0-object-type* renders a static HTML ``<select>`` element with
predefined options.

11.5.1. Object Attributes
*************************

.. table:: Object Type FormfieldPulldown Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'pulldown'                         |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| Options             | Array of Elements    | Array of Option Elements                        |
	+---------------------+----------------------+-------------------------------------------------+

11.5.2. Options Element
***********************

.. table:: FormfieldPulldown Options Element
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| Value               | String               | Hardcoded Value                                 |
	+---------------------+----------------------+-------------------------------------------------+
	| Default             | Boolean              | Default Display Element                         |
	+---------------------+----------------------+-------------------------------------------------+

.. _objecttype-formfielddynpulldown:

11.6. FormfieldDynPulldown
--------------------------

The ``FormfieldDynPulldown`` *x0-object-type*  renders renders a dynamic HTML ``<select>`` element
with options populated from backend data. This allows for flexible and dynamic selection based on
server-side content.

.. note::

    Unlike other *x0-object-types*, it retrieves backend data directly, bypassing the typical
    *x0-service-connector* mechanism.

11.6.1. Object Attributes
*************************

.. table:: Object Type FormfieldDynPulldown Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'dynpulldown'                      |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| ServiceURL          | URL-String           | Backend Service URL                             |
	+---------------------+----------------------+-------------------------------------------------+
	| UpdateOnEvents      | Array of EventIDs    | Array of EventIDs                               |
	+---------------------+----------------------+-------------------------------------------------+

.. _objecttype-formfieldcheckbox:

11.7. FormfieldCheckbox
-----------------------

The ``FormfieldCheckbox`` *x0-object-type* renders an HTML ``<input>`` element of type ``checkbox``.

11.7.1. Object Attributes
*************************

.. table:: Object Type FormfieldCheckbox Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'checkbox'                         |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| Value               | Enum Integer         | 1 == checked || 0 == unchecked                  |
	+---------------------+----------------------+-------------------------------------------------+

.. _objecttype-formfieldhidden:

11.8. FormfieldHidden
---------------------

The ``FormfieldHidden`` *x0-object-type* renders a non-visible HTML ``<input>`` element of type
``hidden``, which is rarely used to pass hidden form data to backend services.

11.8.1. Object Attributes
*************************

.. table:: Object Type FormfieldHidden Attributes
	:widths: 30 20 80

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Type                | Constant String      | Fixed String 'hidden'                           |
	+---------------------+----------------------+-------------------------------------------------+
	| Style               | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+
	| Value               | String               | Hardcoded Value                                 |
	+---------------------+----------------------+-------------------------------------------------+
