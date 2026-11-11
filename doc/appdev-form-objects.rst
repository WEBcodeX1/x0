.. appdev-form-objects

.. _appdevformobjects:

12. Formfield Objects
=====================

**Native** ``FormfieldItem`` elements (defined in ``sysObjFormfieldItem.js``):

- :ref:`formfield-text`
- :ref:`formfield-label`
- :ref:`formfield-textarea`
- :ref:`formfield-pulldown`
- :ref:`formfield-dynpulldown`
- :ref:`formfield-checkbox`
- :ref:`formfield-hidden`

**Complex** elements (defined outside ``sysObjFormfieldItem.js``):

- :ref:`objecttype-rangeslider`
- :ref:`objecttype-rangeslidercontainer`
- :ref:`objecttype-dynradiolist`

Any of these can either be used as:

- single, **declarative configured** instance inside ``object.json``,
- inside a ``FormfieldList`` container object (see: :ref:`formfield-list`), or
- programmatically (as an individual element) inside **custom built** *x0-objects*.

.. _formfield-text:

12.1. FormfieldText
-------------------

The ``FormfieldText`` *x0-object-type* renders an HTML ``<input>`` element, defaulting
to ``type="text"``. See :ref:`formfield-global` for inherited attributes.

12.1.1. Object Attributes
*************************

.. table:: FormfieldText Attributes
   :widths: 15 10 75

   +-------------------+---------------+----------------------------------------------------------------+
   | **Property**      | **Type**      | **Description**                                                |
   +===================+===============+================================================================+
   | Type              | String        | Overrides HTML "type" attribute                                |
   +-------------------+---------------+----------------------------------------------------------------+
   | TextID            | TextID-String | TextID referenced in "webui.text" DB Table                     |
   +-------------------+---------------+----------------------------------------------------------------+
   | Placeholder       | String        | Placeholder                                                    |
   +-------------------+---------------+----------------------------------------------------------------+
   | PlaceholderTextID | TextID-String | Placeholder, TextID referenced in "webui.text" DB Table        |
   +-------------------+---------------+----------------------------------------------------------------+
   | MaxLength         | Integer       | Maximum Length Character Count                                 |
   +-------------------+---------------+----------------------------------------------------------------+
   | Number            | Boolean       | Switches the HTML input "type" to "number"                     |
   +-------------------+---------------+----------------------------------------------------------------+
   | Disabled          | Boolean       | Set HTML Form "disabled" Property                              |
   +-------------------+---------------+----------------------------------------------------------------+
   | ReadOnly          | Boolean       | Set HTML Form "readonly" Property                              |
   +-------------------+---------------+----------------------------------------------------------------+
   | Min               | Integer       | Minimum Number Value                                           |
   +-------------------+---------------+----------------------------------------------------------------+
   | Max               | Integer       | Maximum Number Value                                           |
   +-------------------+---------------+----------------------------------------------------------------+

.. _formfield-label:

12.2. FormfieldLabel
--------------------

The ``FormfieldLabel`` *x0-object-type* renders an HTML ``<label>`` element for form
inputs. Internally it instantiates a child :ref:`object-text` object to render
the label's (multilanguage) text and optional icon.

12.2.1. Object Attributes
*************************

.. table:: FormfieldLabel Attributes
   :widths: 15 10 75

   +--------------+---------------+--------------------------------------------------------------------+
   | **Property** | **Type**      | **Description**                                                    |
   +==============+===============+====================================================================+
   | Style        | CSS-String    | CSS Classes applied to the ``<label>`` element                     |
   +--------------+---------------+--------------------------------------------------------------------+
   | TextStyle    | CSS-String    | Text CSS Classes (child :ref:`object-text` element)                |
   +--------------+---------------+--------------------------------------------------------------------+
   | IconStyle    | CSS-String    | Icon CSS Classes (child :ref:`object-text` element)                |
   +--------------+---------------+--------------------------------------------------------------------+
   | TextID       | TextID-String | TextID from "webui.text" DB Table (child :ref:`object-text`        |
   +--------------+---------------+--------------------------------------------------------------------+

.. _formfield-textarea:

12.3. FormfieldTextarea
-----------------------

The ``FormfieldTextarea`` *x0-object-type* renders an HTML ``<textarea>`` element for
form inputs. See :ref:`formfield-global` for inherited attributes.

12.3.1. Object Attributes
*************************

.. table:: FormfieldTextarea Attributes
   :widths: 15 10 75

   +-------------------+---------------+---------------------------------------------------------------+
   | **Property**      | **Type**      | **Description**                                               |
   +===================+===============+===============================================================+
   | TextID            | TextID-String | TextID referenced in "webui.text" DB Table                    |
   +-------------------+---------------+---------------------------------------------------------------+
   | Placeholder       | String        | Placeholder                                                   |
   +-------------------+---------------+---------------------------------------------------------------+
   | PlaceholderTextID | TextID-String | Placeholder, TextID referenced in "webui.text" DB Table       |
   +-------------------+---------------+---------------------------------------------------------------+
   | Rows              | Integer       | HTML "rows" Attribute                                         |
   +-------------------+---------------+---------------------------------------------------------------+
   | MaxLength         | Integer       | Maximum Length Character Count                                |
   +-------------------+---------------+---------------------------------------------------------------+
   | Disabled          | Boolean       | Set HTML Form "disabled" Property                             |
   +-------------------+---------------+---------------------------------------------------------------+
   | ReadOnly          | Boolean       | Set HTML Form "readonly" Property                             |
   +-------------------+---------------+---------------------------------------------------------------+

.. _formfield-pulldown:

12.4. FormfieldPulldown
-----------------------

The ``FormfieldPulldown`` *x0-object-type* renders a static HTML ``<select>`` element with
predefined options. See :ref:`formfield-global` for inherited attributes.

12.4.1. Object Attributes
*************************

.. table:: FormfieldPulldown Attributes
   :widths: 15 10 75

   +------------------+-------------------+------------------------------------------------------------+
   | **Property**     | **Type**          | **Description**                                            |
   +==================+===================+============================================================+
   | Options          | Array of Elements | Array of Option Elements, see 12.6.2                       |
   +------------------+-------------------+------------------------------------------------------------+
   | AddNoneItem      | Boolean           | Prepend an empty "none selected" Option Element            |
   +------------------+-------------------+------------------------------------------------------------+
   | AddNoneItemValue | String            | Value of the prepended "none" Option (default ``null``)    |
   +------------------+-------------------+------------------------------------------------------------+
   | AddNoneItemTxtID | TextID-String     | TextID of the prepended "none" Option                      |
   +------------------+-------------------+------------------------------------------------------------+

12.4.2. Options Element
***********************

.. table:: FormfieldPulldown Options Element
   :widths: 15 10 75

   +--------------+---------------+--------------------------------------------------------------------+
   | **Property** | **Type**      | **Description**                                                    |
   +==============+===============+====================================================================+
   | TextID       | TextID-String | TextID referenced in "webui.text" DB Table                         |
   +--------------+---------------+--------------------------------------------------------------------+
   | Value        | String        | Hardcoded Value                                                    |
   +--------------+---------------+--------------------------------------------------------------------+
   | Default      | Boolean       | Default Selected Option                                            |
   +--------------+---------------+--------------------------------------------------------------------+
   | Display      | String        | Hardcoded Display Text, overrides TextID                           |
   +--------------+---------------+--------------------------------------------------------------------+

.. _formfield-dynpulldown:

12.5. FormfieldDynPulldown
--------------------------

The ``FormfieldDynPulldown`` *x0-object-type* renders a dynamic HTML ``<select>`` element
with options populated from backend data. This allows for flexible and dynamic selection based on
server-side content. See :ref:`formfield-global` for inherited attributes.

12.5.1. Object Attributes
*************************

.. table:: FormfieldDynPulldown Attributes
   :widths: 15 10 75

   +----------------+-------------------+--------------------------------------------------------------+
   | **Property**   | **Type**          | **Description**                                              |
   +================+===================+==============================================================+
   | ServiceURL     | URL-String        | Backend Service URL, requested via XML-RPC                   |
   +----------------+-------------------+--------------------------------------------------------------+
   | ServiceID      | String            | Optional Backend Service Identifier                          |
   +----------------+-------------------+--------------------------------------------------------------+
   | UpdateOnEvents | Array of EventIDs | Re-fetches Options when any Event fires                      |
   +----------------+-------------------+--------------------------------------------------------------+

.. _formfield-checkbox:

12.6. FormfieldCheckbox
-----------------------

The ``FormfieldCheckbox`` *x0-object-type* renders an HTML ``<input>`` element of type
``checkbox``. See :ref:`formfield-global` for inherited attributes.

12.6.1. Object Attributes
*************************

.. table:: FormfieldCheckbox Attributes
   :widths: 15 10 75

   +--------------+----------+-------------------------------------------------------------------------+
   | **Property** | **Type** | **Description**                                                         |
   +==============+==========+=========================================================================+
   | Value        | Boolean  | Initial checked state (``true`` == checked)                             |
   +--------------+----------+-------------------------------------------------------------------------+

.. _formfield-hidden:

12.7. FormfieldHidden
---------------------

The ``FormfieldHidden`` *x0-object-type* renders a non-visible HTML ``<input>`` element
of type ``hidden``. See :ref:`formfield-global` for inherited attributes.

.. warning::
   Hidden form fields are deprecated; use the *x0-globals* component instead.

12.7.1. Object Attributes
*************************

.. table:: FormfieldHidden Attributes
   :widths: 15 10 75

   +--------------+----------+-------------------------------------------------------------------------+
   | **Property** | **Type** | **Description**                                                         |
   +==============+==========+=========================================================================+
   | Value        | String   | Hardcoded Value                                                         |
   +--------------+----------+-------------------------------------------------------------------------+

.. _formfield-global:

12.8. Global Formfield Attributes
---------------------------------

Global ``FormfieldItem`` properties, valid for **any** sub-type of ``FormfieldItem``.

.. table:: Global Formfield Attributes
   :widths: 15 10 75

   +------------------------+----------------+---------------------------------------------------------+
   | **Property**           | **Type**       | **Description**                                         |
   +========================+================+=========================================================+
   | Style                  | CSS-String     | CSS Style Classes, space separated                      |
   +------------------------+----------------+---------------------------------------------------------+
   | GlobalVar              | String         | Global variable key restored into this field on reset() |
   +------------------------+----------------+---------------------------------------------------------+
   | OnChange               | Object / Array | On-change handler config, see :ref:`appdevforms`        |
   +------------------------+----------------+---------------------------------------------------------+
   | ValidateRef            | String         | Named Validate Function / Regex, see :ref:`appdevforms` |
   +------------------------+----------------+---------------------------------------------------------+
   | ValidateNullable       | Boolean        | Skip validation when the field value is empty           |
   +------------------------+----------------+---------------------------------------------------------+
   | ValidateErrorTextID    | TextID-String  | TextID referenced in "webui.text" DB Table              |
   +------------------------+----------------+---------------------------------------------------------+
   | StyleValidateOk        | CSS-String     | CSS Style applied on success                            |
   +------------------------+----------------+---------------------------------------------------------+
   | StyleValidateFail      | CSS-String     | CSS Style applied on failure                            |
   +------------------------+----------------+---------------------------------------------------------+
   | StyleValidateFailFirst | CSS-String     | Additional CSS applied to the first failed field        |
   +------------------------+----------------+---------------------------------------------------------+
