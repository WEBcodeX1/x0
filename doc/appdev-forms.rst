.. appdev-forms

.. _appdevforms:

17. Forms
=========

Form architecture within the *x0-system* utilizes a highly adaptable, object-oriented
ecosystem structured around two primary developmental methodologies. These paradigms
may be deployed in isolation or seamlessly coalesced within a hybrid implementation layer:

* **Container-Driven Topologies (Declarative):** This methodology leverages monolithic
  container abstractions, exemplified by the ``FormfieldList`` *x0-system-object* type,
  which natively encapsulates structural grid-formatting matrices and automated group-validation
  lifecycles directly at the metadata and configuration layer within ``object.json``.

* **Component-Driven Topologies (Programmatic):** This approach utilizes granular, standalone
  *x0-system-object* types derived from ``sysObjFormfieldItem.js``. These primitive inputs are
  engineered to operate either as autonomous entities or as tightly coupled child nodes embedded
  within a parent container hierarchy.

Both architectural frameworks remain fully interoperable; high-level structural components,
including ``FormfieldList``, ``FormfieldText``, or any other ``FormfieldItem`` variation, can
be dynamically instantiated at runtime, configured, and orchestrated programmatically inside
a custom-engineered *x0-component*.

17.1. FormfieldList
-------------------

The ``FormfieldList`` *x0-object-type* is the central container of the forms
subsystem. It fulfils a dual role, acting simultaneously as a *x0-form*
management facility and as a generic *x0-object-container*:

* Renders a HTML5 conformant ``<form>`` element as its enclosing DOM node.
* Groups an arbitrary, declaratively referenced set of *x0-form-object-types*
  (``Formfield*``, :ref:`objecttype-rangeslider`/:ref:`objecttype-rangeslidercontainer`)
  into a single addressable, cohesive unit.
* Lays out its contained form objects via the generic :ref:`appdevgridsystem`,
  enabling responsive, Bootstrap-conformant multi-column arrangements.
* Validates each contained field against system-provided JS Validation
  Functions (17.4) as well as user-provided JS Validation Functions (17.5).
* Performs cross-field Group Validation (17.2) in addition to per-field
  validation.
* Renders localized, multilanguage error and info feedback via a referenced
  :ref:`objecttype-errorcontainer`.

For the complete ``FormfieldList`` attribute reference, the individual
``Formfield*`` object types and their shared attributes, see
:ref:`appdevformobjects`.

.. note::

	Beyond local JS validation, forms integrate transparently with the
	generic backend layer: a ``Button`` object's backend Service Execution
	(see :ref:`appdevcontrolbutton`) or a ``FormfieldDynPulldown``'s
	``ServiceID`` (see :ref:`appdevformobjects`, 11.7) dispatch the enclosing
	form's data to any remote service endpoint.

17.2. Form Validation
---------------------

``FormfieldList`` drives a two-tier *x0-form-validation* pipeline, triggered
whenever its ``validate()`` method is invoked (typically as part of a
``Button``'s pre-service control-flow, see :ref:`appdevcontrolbutton`):

* **Single-Field Validation**: every contained form element is validated
  individually against its own ``ValidateRef`` (System Provided or User Based,
  Regex or Function, see 17.4/17.5).

* **Group Validation**: declaratively configured ``GroupValidate`` elements
  (see :ref:`appdevformobjects`, 11.1.2) additionally validate a related set
  of fields as a whole, independent of their individual ``ValidateRef``
  checks (e.g. "password and password-repeat must match").

* **Error Container**: validation failures of either tier are surfaced
  through the ``ErrorContainer``-referenced :ref:`objecttype-errorcontainer`,
  which renders a localized (multilanguage) error message; the first failed
  field additionally receives the ``StyleValidateFailFirst`` CSS treatment.

17.3. FormfieldOnchange Handler
-------------------------------

The FormfieldOnChange Handler provides a declarative mechanism allowing a
single form field's state change to reactively reconfigure other, already
rendered *x0-form-objects* -- without any custom JavaScript.

.. table:: FormfieldOnchange OnChange Attributes
	:widths: 30 70

	+--------------------+----------------------------------------------------------------------+
	| **Property**       | **Description**                                                      |
	+====================+======================================================================+
	| ObjectID           | Destination ObjectID                                                 |
	+--------------------+----------------------------------------------------------------------+
	| EnableOnValues     | Enable (set visible) DestinationObject on change to given Values     |
	+--------------------+----------------------------------------------------------------------+
	| DisableOnValues    | Disable (set invisible) DestinationObject on change to given Values  |
	+--------------------+----------------------------------------------------------------------+
	| ActivateOnValues   | Same like EnableOnValues but also set internal state to activated    |
	+--------------------+----------------------------------------------------------------------+
	| DeactivateOnValues | Same like DisableOnValues but also set internal state to deactivated |
	+--------------------+----------------------------------------------------------------------+
	| UpdateFormLength   | Trigger a Destination Object length update, see 17.3.5               |
	+--------------------+----------------------------------------------------------------------+
	| FireEvents         | Fire Events on change to given Value                                 |
	+--------------------+----------------------------------------------------------------------+

.. note::

	An ``EnableOnValues``/``DisableOnValues`` example that enables/disables a complete sub-section
	hierarchy of child elements recursively can be found when running the *x0-static* docker application
	under "Settings/GlobalSettings" -> "DefaultSettings" (Tab) -> "SystemSettings/BasicSettings" upon
	enabling the Messaging Server Component checkbox (``FormfieldCheckbox`` *x0-system-object* type).

17.3.1. EnableOnValues
**********************

Valid for *x0-object-type* FormfieldPulldown.

Enable *x0-object* with ``ObjectID`` (set visible) when selected pulldown **value**
matches the given value in EnableOnValues Array.

``EnableOnValues`` must be specified in combination with ``DisableOnValues``
attribute to work properly.

Example see DisableOnValues.

17.3.2. DisableOnValues
***********************

Valid for *x0-object-type* FormfieldPulldown.

Disable *x0-object* with ``ObjectID`` (set invisible) when selected pulldown
**value** matches the given value in DisableOnValues Array.

``DisableOnValues`` must be specified in combination with ``EnableOnValues``
attribute to work properly.

The following example will enable destination object **RecordPriority**
when MX record type is selected and disable when A or CNAME selected.

.. code-block:: javascript

	"RecordType": {
		"Type": "Formfield",
		"Attributes": {
			"Type": "pulldown",
			"Style": "form-select w-100",
			"Options": [
				{
					"TextID": "TXT.PULLDOWN.RECORD-TYPE.A",
					"Value": "A",
					"Default": true
				},
				{
					"TextID": "TXT.PULLDOWN.RECORD-TYPE.CNAME",
					"Value": "CNAME"
				},
				{
					"TextID": "TXT.PULLDOWN.RECORD-TYPE.MX",
					"Value": "MX"
				}
			],
			"OnChange": {
				"ObjectID": "RecordPriority",
				"EnableOnValues": [
					"MX"
				],
				"DisableOnValues": [
					"A",
					"CNAME"
				]
			}
		}
	}

17.3.3. ActivateOnValues
************************

Valid for *x0-object-type* FormfieldPulldown.

Same as EnableOnValues with the difference that the internal object state
is set to **activated**.

Objects with deactivated state will be omitted from validation.

17.3.4. DeactivateOnValues
**************************

Same as DisableOnValues with the difference that the internal object state
is set to **deactivated**.

17.3.5. UpdateFormLength
************************

Valid for *x0-object-type* FormfieldText and FormfieldTextarea.

Boolean flag triggering a remaining/current-length update on a destination
object as the source field's value changes. Combined with the following
sibling attributes:

.. table:: UpdateFormLength Sibling Attributes
	:widths: 25 15 60

	+-----------------+---------------+----------------------------------------------------------+
	| **Property**    | **Type**      | **Description**                                          |
	+=================+===============+==========================================================+
	| UpdateFormfield | String        | Destination ObjectID receiving the computed length       |
	+-----------------+---------------+----------------------------------------------------------+
	| MaxLength       | Integer       | Character budget the computed length is measured against |
	+-----------------+---------------+----------------------------------------------------------+
	| TextPreID       | TextID-String | TextID prepended to the computed remaining length        |
	+-----------------+---------------+----------------------------------------------------------+
	| TextPostID      | TextID-String | TextID appended to the computed remaining length         |
	+-----------------+---------------+----------------------------------------------------------+

.. code-block:: javascript

	"OnChange": {
		"UpdateFormLength": true,
		"UpdateFormfield": "RemainingCharsLabel",
		"MaxLength": 255,
		"TextPreID": "TXT.FORM.CHARS-REMAINING.PRE",
		"TextPostID": "TXT.FORM.CHARS-REMAINING.POST"
	}

17.3.6. FireEvents
******************

Globally fire (raise) Events on any objects state change.

.. code-block:: javascript

	"OnChange": {
		"FireEvents": [ "EventID1", "EventID2" ]
	}

See :ref:`appdeveventsystem` for the full event-system architecture.

17.3.7. Chaining Events
***********************

Multiple OnChange config can be specified if provided as **Array** type. 

.. code-block:: javascript

	"OnChange": [
		{
			"ObjectID": "RecordPriority",
			"EnableOnValues": [
				"MX"
			],
			"DisableOnValues": [
				"A",
				"CNAME"
			]
		},
		{
			"FireEvents": [ "EventID1", "EventID2" ]
		}
	]

.. _form-validation-types:

17.4. System Validation Types
-----------------------------

Referenced by name via a form element's ``ValidateRef`` attribute (see
:ref:`appdevformobjects`, 11.2), implemented in ``sysFormfieldValidate.js``.
See :ref:`devoopmodel-classes` (24.3.6/24.3.7) for the underlying
``sysFormFieldValidate``/``sysFormFieldValidateGroup`` method reference.

17.4.1. Regex
*************

* DefaultString
* DefaultAtoZ
* DefaultInteger
* DefaultAtoZPlusNumbers
* DefaultAtoZUpper
* Quantity (alias of DefaultInteger)
* ZipCodeGerman
* UserName
* UserPass
* UserGroup
* MailAddress
* PhoneNrInternational
* PhoneNrGerman
* PhoneNrAreaGerman
* PhoneNrCountryCode
* Country
* StreetNr
* EuroWithCents
* BarcodeZebra
* NameGerman
* NameUnitedStates

17.4.2. Functions
*****************

* Float
* MinMax
* IPAddress (alias of IPv4Address)
* IPv4Address
* IPv6Address
* IPv4SubnetMask
* IPPort
* DNSRecordName
* DateInternational
* DateGerman

17.4.3. Group Functions
***********************

* CheckDiffer
* CheckNull
* CheckEmpty
* CheckDatePeriodOneYear
* CheckDatePeriodOneYearDP
* CheckItemsOr
* CheckItemsMatch
* CheckTableRows
* MinOneItemNotNull
* DNSRecordValuePlusType

17.5. Providing User Validation
---------------------------------

Custom *x0-validation-functions* are integrated directly in ``userFunctions.js``,
which ships with a dedicated ``UserValidate`` (single-field) and
``UserValidateGroup`` (group) registry -- structurally identical to the system
registries documented in 17.4, but kept in a separate, application-owned file
so that it survives engine upgrades untouched.

Register a new single-field validation function by adding a named key/function
pair to ``UserValidate``'s ``ValidateFunc`` object:

.. code-block:: javascript

	function UserValidate()
	{
	    this.ValidateFunc = {
	        'CustomFunctionName': this.CustomFunctionName
	    };
	}

	UserValidate.prototype.CustomFunctionName = function(Value, FormObj)
	{
	    //- return true == Error, false == Ok
	    return false;
	}

Group validation functions follow the same pattern against
``UserValidateGroup``'s ``ValidateFunc`` object, receiving the array of
participating form objects instead of a single value.

Reference the resulting function name via ``ValidateRef`` (single-field) or
``FunctionRef`` (``GroupValidate``, see :ref:`appdevformobjects`, 11.1.2)
exactly like any system-provided validation type.

.. _form-examples-list:

**Related Documentation:**

* :ref:`appdevformobjects` - Detailed formfield object documentation
* :ref:`appdevgridsystem` - Form-object layout via the Grid System
* :ref:`appdev-backend` - Backend / Service Connector integration
* :ref:`appdevoverlay` - Overlay mode forms
* :ref:`devexamples` - Guidelines for creating new examples
