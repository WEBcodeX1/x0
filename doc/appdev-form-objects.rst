.. appdev-form-objects

.. _appdevformobjects:

11. Formfield Objects
=====================

* :ref:`objecttype-formfieldlist`
* :ref:`objecttype-formfieldcommon`
* :ref:`objecttype-formfieldtext`
* :ref:`objecttype-formfieldlabel`
* :ref:`objecttype-formfieldtextarea`
* :ref:`objecttype-formfieldpulldown`
* :ref:`objecttype-formfielddynpulldown`
* :ref:`objecttype-formfieldcheckbox`
* :ref:`objecttype-formfieldhidden`

In addition to the dedicated ``Formfield*`` *x0-object-types* documented below,
:ref:`objecttype-rangeslider` and :ref:`objecttype-rangeslidercontainer` (fully
documented in :ref:`systemobjects`) implement the same runtime get/set data
contract and may be referenced from a ``FormfieldList``'s ``ObjectIDs`` array
like any other *x0-form-object*.

.. _objecttype-formfieldlist:

11.1. FormfieldList
-------------------

The ``FormfieldList`` *x0-object-type* serves as both a *x0-form* management tool
and a *x0-object-container*. It instantiates a flat set of pre-defined
*x0-form-object* IDs, lays them out via the :ref:`appdevgridsystem`, and provides
*x0-form-validation* for the resulting group.

More info at :ref:`appdevforms`.

11.1.1. Object Attributes
*************************

.. table:: Object Type FormfieldList Attributes
	:widths: 30 20 80

	+------------------+-------------------+--------------------------------------------------+
	| **Property**     | **Type**          | **Description**                                  |
	+==================+===================+==================================================+
	| ObjectIDs        | Array of Strings  | Formfield (or other form-capable) ObjectIDs      |
	+------------------+-------------------+--------------------------------------------------+
	| Style            | CSS-String        | CSS Style Classes, space separated               |
	+------------------+-------------------+--------------------------------------------------+
	| ErrorContainer   | String            | ObjectID of an :ref:`objecttype-errorcontainer`  |
	+------------------+-------------------+--------------------------------------------------+
	| ContextMenuItems | Array of Elements | Context Menu Items, see :ref:`appdevcontextmenu` |
	+------------------+-------------------+--------------------------------------------------+
	| GroupValidate    | Array of Elements | Array of Group Validate Elements, see 11.1.2     |
	+------------------+-------------------+--------------------------------------------------+
	| Disable          | Boolean           | Disables all contained Formfields on reset()     |
	+------------------+-------------------+--------------------------------------------------+

``ObjectIDs`` entries resolve against pre-defined object metadata and are
instantiated recursively, consistent with the x0 pointer-based recursive object
model described in :ref:`devoopmodel-classes`.

11.1.2. GroupValidate Element Attributes
****************************************

Each element of ``GroupValidate`` dispatches a named group-validation function
(see :ref:`appdevforms`) against a set of related form fields, independent of
their individual ``ValidateRef`` checks.

.. table:: FormfieldList GroupValidate Element Attributes
	:widths: 30 20 80

	+---------------------+------------------+---------------------------------------------+
	| **Property**        | **Type**         | **Description**                             |
	+=====================+==================+=============================================+
	| FunctionRef         | String           | Name of the system Group Validate function  |
	+---------------------+------------------+---------------------------------------------+
	| ObjectIDs           | Array of Strings | ObjectIDs validated together by FunctionRef |
	+---------------------+------------------+---------------------------------------------+
	| ValidateErrorTextID | TextID-String    | TextID referenced in "webui.text" DB Table  |
	+---------------------+------------------+---------------------------------------------+

.. code-block:: javascript

	"GroupValidate": [
		{
			"FunctionRef": "CheckItemsMatch",
			"ObjectIDs": [ "PasswordNew", "PasswordRepeat" ],
			"ValidateErrorTextID": "TXT.VALIDATE.PASSWORD-MISMATCH"
		}
	]

11.1.3. Grid Attributes
***********************

Global Grid Attributes can be applied, see :ref:`appdevgridsystem`.

11.1.4. JSON Example
********************

The following excerpt (taken from the ``ExamplesCopyPasteFormSource`` definition
of the static reference container, see :ref:`appdev-static-deployment`) shows a
``FormfieldList`` grouping label, text, pulldown and
:ref:`objecttype-rangeslidercontainer` objects:

.. code-block:: javascript

	"WorkerForm": {
		"Type": "FormfieldList",
		"Attributes": {
			"ObjectIDs": [
				"WorkerNameLabel", "WorkerName",
				"WorkerSurenameLabel", "WorkerSurename",
				"TeamGroupLabel", "TeamGroup",
				"TeamPercentageMinLabel", "TeamPercentageMin",
				"TeamPercentageMaxLabel", "TeamPercentageMax"
			],
			"ErrorContainer": "WorkerFormErrorContainer"
		}
	},

	"WorkerName": {
		"Type": "FormfieldText",
		"Attributes": {
			"Style": "form-control border-secondary m-1 p-2 w-100"
		}
	},

	"TeamGroup": {
		"Type": "FormfieldPulldown",
		"Attributes": {
			"Style": "form-select border-secondary m-1 p-2 w-100",
			"Options": [
				{ "TextID": "TXT.TEAM.TELECOM", "Value": 10 },
				{ "TextID": "TXT.TEAM.ACCOUNTING", "Value": 30, "Default": true }
			]
		}
	}

.. _objecttype-formfieldcommon:

11.2. Common Formfield Attributes
---------------------------------

The following attributes are evaluated by the shared ``sysFormfieldItem`` base
class and therefore apply, where semantically meaningful, to every concrete
Formfield *x0-object-type* documented below (:ref:`objecttype-formfieldlabel`
is exempt from validation and runtime data handling).

.. table:: Common Formfield Attributes
	:widths: 30 20 80

	+------------------------+----------------+------------------------------------------------------------------------+
	| **Property**           | **Type**       | **Description**                                                        |
	+========================+================+========================================================================+
	| Style                  | CSS-String     | CSS Style Classes, space separated                                     |
	+------------------------+----------------+------------------------------------------------------------------------+
	| OnChange               | Object / Array | On-change handler config, see :ref:`appdevforms`                       |
	+------------------------+----------------+------------------------------------------------------------------------+
	| ValidateRef            | String         | Named Validate Function / Regex, see :ref:`appdevforms`                |
	+------------------------+----------------+------------------------------------------------------------------------+
	| ValidateNullable       | Boolean        | Skip validation when the field value is empty                          |
	+------------------------+----------------+------------------------------------------------------------------------+
	| ValidateErrorTextID    | TextID-String  | TextID referenced in "webui.text" DB Table                             |
	+------------------------+----------------+------------------------------------------------------------------------+
	| StyleValidateOk        | CSS-String     | CSS Style applied on success (default: Bootstrap success border)       |
	+------------------------+----------------+------------------------------------------------------------------------+
	| StyleValidateFail      | CSS-String     | CSS Style applied on failure (default: Bootstrap danger border)        |
	+------------------------+----------------+------------------------------------------------------------------------+
	| StyleValidateFailFirst | CSS-String     | Additional CSS applied to the first failed field (default: 'border-4') |
	+------------------------+----------------+------------------------------------------------------------------------+
	| GlobalVar              | String         | Global variable key restored into this field on reset()                |
	+------------------------+----------------+------------------------------------------------------------------------+
	| DBColumn               | String         | Database Column Reference                                              |
	+------------------------+----------------+------------------------------------------------------------------------+

.. note::

	``Attributes.Type`` additionally accepts an optional string overriding the
	rendered HTML5 input ``type`` attribute (e.g. ``"password"``, ``"email"``,
	``"tel"`` for :ref:`objecttype-formfieldtext`). For
	:ref:`objecttype-formfieldpulldown`, :ref:`objecttype-formfielddynpulldown`
	and :ref:`objecttype-formfieldlabel`, setting ``Type`` to the matching
	constant string (``'pulldown'``, ``'dynpulldown'``, ``'label'``) is an
	additional, mostly redundant safety net excluding the field from automatic
	``FormfieldList`` validation regardless of ``ValidateRef``.

.. _objecttype-formfieldtext:

11.3. FormfieldText
-------------------

The ``FormfieldText`` *x0-object-type* renders an HTML ``<input>`` element, defaulting
to ``type="text"``. See :ref:`objecttype-formfieldcommon` for inherited attributes.

11.3.1. Object Attributes
*************************

.. table:: Object Type FormfieldText Attributes
	:widths: 30 20 80

	+-------------------+---------------+----------------------------------------------------------------------------------------+
	| **Property**      | **Type**      | **Description**                                                                        |
	+===================+===============+========================================================================================+
	| Type              | String        | Overrides the HTML5 "type" attribute, e.g. 'password', 'email', 'tel' (default 'text') |
	+-------------------+---------------+----------------------------------------------------------------------------------------+
	| TextID            | TextID-String | TextID referenced in "webui.text" DB Table                                             |
	+-------------------+---------------+----------------------------------------------------------------------------------------+
	| Placeholder       | String        | Placeholder                                                                            |
	+-------------------+---------------+----------------------------------------------------------------------------------------+
	| PlaceholderTextID | TextID-String | Placeholder, TextID referenced in "webui.text" DB Table                                |
	+-------------------+---------------+----------------------------------------------------------------------------------------+
	| MaxLength         | Integer       | Maximum Length Character Count                                                         |
	+-------------------+---------------+----------------------------------------------------------------------------------------+
	| Number            | Boolean       | Switches the HTML5 input "type" to 'number'                                            |
	+-------------------+---------------+----------------------------------------------------------------------------------------+
	| Disabled          | Boolean       | Set HTML Form "disabled" Property                                                      |
	+-------------------+---------------+----------------------------------------------------------------------------------------+
	| ReadOnly          | Boolean       | Set HTML Form "readonly" Property                                                      |
	+-------------------+---------------+----------------------------------------------------------------------------------------+
	| Min               | Integer       | Minimum Number Value                                                                   |
	+-------------------+---------------+----------------------------------------------------------------------------------------+
	| Max               | Integer       | Maximum Number Value                                                                   |
	+-------------------+---------------+----------------------------------------------------------------------------------------+

.. _objecttype-formfieldlabel:

11.4. FormfieldLabel
--------------------

The ``FormfieldLabel`` *x0-object-type* renders an HTML ``<label>`` element for form
inputs. Internally it instantiates a child :ref:`objecttype-sqltext` object to render
the label's (multilanguage) text and optional icon, consistent with the x0
recursive child-object model (:ref:`devoopmodel-classes`).

11.4.1. Object Attributes
*************************

.. table:: Object Type FormfieldLabel Attributes
	:widths: 30 20 80

	+--------------+---------------+-------------------------------------------------------------------------------------------+
	| **Property** | **Type**      | **Description**                                                                           |
	+==============+===============+===========================================================================================+
	| Style        | CSS-String    | CSS Style Classes applied to the ``<label>`` element                                      |
	+--------------+---------------+-------------------------------------------------------------------------------------------+
	| TextStyle    | CSS-String    | CSS Style Classes passed to the child :ref:`objecttype-sqltext` element                   |
	+--------------+---------------+-------------------------------------------------------------------------------------------+
	| IconStyle    | CSS-String    | Fontawesome Icon CSS Classes passed to the child :ref:`objecttype-sqltext` element        |
	+--------------+---------------+-------------------------------------------------------------------------------------------+
	| TextID       | TextID-String | TextID referenced in "webui.text" DB Table, passed to the child :ref:`objecttype-sqltext` |
	+--------------+---------------+-------------------------------------------------------------------------------------------+

.. _objecttype-formfieldtextarea:

11.5. FormfieldTextarea
-----------------------

The ``FormfieldTextarea`` *x0-object-type* renders an HTML ``<textarea>`` element for
form inputs. See :ref:`objecttype-formfieldcommon` for inherited attributes.

11.5.1. Object Attributes
*************************

.. table:: Object Type FormfieldTextarea Attributes
	:widths: 30 20 80

	+-------------------+---------------+---------------------------------------------------------+
	| **Property**      | **Type**      | **Description**                                         |
	+===================+===============+=========================================================+
	| TextID            | TextID-String | TextID referenced in "webui.text" DB Table              |
	+-------------------+---------------+---------------------------------------------------------+
	| Placeholder       | String        | Placeholder                                             |
	+-------------------+---------------+---------------------------------------------------------+
	| PlaceholderTextID | TextID-String | Placeholder, TextID referenced in "webui.text" DB Table |
	+-------------------+---------------+---------------------------------------------------------+
	| Rows              | Integer       | HTML "rows" Attribute                                   |
	+-------------------+---------------+---------------------------------------------------------+
	| MaxLength         | Integer       | Maximum Length Character Count                          |
	+-------------------+---------------+---------------------------------------------------------+
	| Disabled          | Boolean       | Set HTML Form "disabled" Property                       |
	+-------------------+---------------+---------------------------------------------------------+
	| ReadOnly          | Boolean       | Set HTML Form "readonly" Property                       |
	+-------------------+---------------+---------------------------------------------------------+

.. _objecttype-formfieldpulldown:

11.6. FormfieldPulldown
-----------------------

The ``FormfieldPulldown`` *x0-object-type* renders a static HTML ``<select>`` element with
predefined options. See :ref:`objecttype-formfieldcommon` for inherited attributes.

11.6.1. Object Attributes
*************************

.. table:: Object Type FormfieldPulldown Attributes
	:widths: 30 20 80

	+------------------+-------------------+---------------------------------------------------------+
	| **Property**     | **Type**          | **Description**                                         |
	+==================+===================+=========================================================+
	| Options          | Array of Elements | Array of Option Elements, see 11.6.2                    |
	+------------------+-------------------+---------------------------------------------------------+
	| AddNoneItem      | Boolean           | Prepend an empty "none selected" Option Element         |
	+------------------+-------------------+---------------------------------------------------------+
	| AddNoneItemValue | String            | Value of the prepended "none" Option (default ``null``) |
	+------------------+-------------------+---------------------------------------------------------+
	| AddNoneItemTxtID | TextID-String     | TextID of the prepended "none" Option                   |
	+------------------+-------------------+---------------------------------------------------------+

11.6.2. Options Element
***********************

.. table:: FormfieldPulldown Options Element
	:widths: 30 20 80

	+--------------+---------------+--------------------------------------------+
	| **Property** | **Type**      | **Description**                            |
	+==============+===============+============================================+
	| TextID       | TextID-String | TextID referenced in "webui.text" DB Table |
	+--------------+---------------+--------------------------------------------+
	| Value        | String        | Hardcoded Value                            |
	+--------------+---------------+--------------------------------------------+
	| Default      | Boolean       | Default Selected Option                    |
	+--------------+---------------+--------------------------------------------+
	| Display      | String        | Hardcoded Display Text, overrides TextID   |
	+--------------+---------------+--------------------------------------------+

.. _objecttype-formfielddynpulldown:

11.7. FormfieldDynPulldown
--------------------------

The ``FormfieldDynPulldown`` *x0-object-type* renders a dynamic HTML ``<select>`` element
with options populated from backend data. This allows for flexible and dynamic selection based on
server-side content. See :ref:`objecttype-formfieldcommon` for inherited attributes.

.. note::

	``FormfieldDynPulldown`` always issues its own ``sysCallXMLRPC`` request against
	``ServiceURL``, independent of the generic ``sysServiceConnector`` mechanism (see
	:ref:`devoopmodel-classes`). When ``ServiceID`` is additionally specified, the
	field also builds ``PostRequestData`` via ``sysRequestDataHandler`` /
	``processSourceObjects()`` (``sysSourceObjectHandler``) to source POST parameters
	from other form objects before dispatching the request, enabling cascading
	pulldowns (e.g. selecting a country populates a dependent city pulldown).

11.7.1. Object Attributes
*************************

.. table:: Object Type FormfieldDynPulldown Attributes
	:widths: 30 20 80

	+----------------+-------------------+---------------------------------------------------------------------------+
	| **Property**   | **Type**          | **Description**                                                           |
	+================+===================+===========================================================================+
	| ServiceURL     | URL-String        | Backend Service URL, requested via XML-RPC                                |
	+----------------+-------------------+---------------------------------------------------------------------------+
	| ServiceID      | String            | Optional backend service identifier, sources POST data from other objects |
	+----------------+-------------------+---------------------------------------------------------------------------+
	| UpdateOnEvents | Array of EventIDs | Re-fetches Options when any Event fires                                   |
	+----------------+-------------------+---------------------------------------------------------------------------+

.. _objecttype-formfieldcheckbox:

11.8. FormfieldCheckbox
-----------------------

The ``FormfieldCheckbox`` *x0-object-type* renders an HTML ``<input>`` element of type
``checkbox``. See :ref:`objecttype-formfieldcommon` for inherited attributes.

11.8.1. Object Attributes
*************************

.. table:: Object Type FormfieldCheckbox Attributes
	:widths: 30 20 80

	+--------------+----------+---------------------------------------------+
	| **Property** | **Type** | **Description**                             |
	+==============+==========+=============================================+
	| Value        | Boolean  | Initial checked state (``true`` == checked) |
	+--------------+----------+---------------------------------------------+

.. _objecttype-formfieldhidden:

11.9. FormfieldHidden
---------------------

The ``FormfieldHidden`` *x0-object-type* renders a non-visible HTML ``<input>`` element of type
``hidden``, which is rarely used to pass hidden form data to backend services. See
:ref:`objecttype-formfieldcommon` for inherited attributes.

11.9.1. Object Attributes
*************************

.. table:: Object Type FormfieldHidden Attributes
	:widths: 30 20 80

	+--------------+----------+-----------------+
	| **Property** | **Type** | **Description** |
	+==============+==========+=================+
	| Value        | String   | Hardcoded Value |
	+--------------+----------+-----------------+
