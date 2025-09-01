.. appdev-forms

.. _appdevforms:

17. Forms
=========

Designing Forms is an essential part when designing modern web-applications.
*x0-system* provides multiple mechanisms for building complex forms easily.

For complete form examples with microservice integration, see the `x0-skeleton repository examples <https://github.com/WEBcodeX1/x0-skeleton>`_, particularly:

* `Forms with MicroESB <https://github.com/WEBcodeX1/x0-skeleton/tree/main/example/01-forms-microesb>`_ - Complete form implementation with microservice abstraction layer
* Enhanced form functionality - See :ref:`Example 5 (Enhanced Form) <enhanced-form-example>` in the local examples

17.1. FormfieldList
-------------------

The FormfieldList *x0-object-type* is a container type providing the following
functionality.

* Providing HTML conform "<form>" container
* Grouping multiple single *x0-form-object-types* together
* Validating against *x0-system* provided JS Validation Functions
* Validating against user provided JS Validation Functions
* Multilanguage Error / Info Display 
* CSS styled / Bootstrap conform Subsections

For detailed formfield object documentation, see :ref:`appdevformobjects`.

**Local Examples:**

* :ref:`Example 5 (Enhanced Form) <enhanced-form-example>` - Advanced form functionality with validation
* See also the complete list of :ref:`form-related examples <form-examples-list>` in the local repository

17.2. Form Validation
---------------------

The FormfieldList *x0-object-type* provides *x0-form-validation*.

* Validating a single Form element 
* Validating multiple Form elements (Group Validation)
* Container Objects / Error Container 
* System Provided Validation Functions (Single and Group Validation)
* User Based Validation Functions (Single and Group Validation)
* Regex Validation

.. _enhanced-form-example:

**Examples:**

* **Local Example:** `Enhanced Form (Example 5) <http://x0-app.x0.localnet/python/Index.py?appid=example5>`_ - Demonstrates comprehensive form validation features
* **External Example:** `Forms with MicroESB <https://github.com/WEBcodeX1/x0-skeleton/tree/main/example/01-forms-microesb>`_ - Complete implementation with microservice integration
* See :ref:`form validation types <form-validation-types>` below for system-provided validation options

17.3. FormfieldOnchange Handler
-------------------------------

The FormfieldOnChange Handler provides a mechanism to modify other rendered
*x0-form-objects* when their state changes.


.. table:: FormfieldOnchange OnChange Attributes
	:widths: 30 70

	+---------------------+-----------------------------------------------------------------------+
	| **Property**        | **Description**                                                       |
	+=====================+=======================================================================+
	| ObjectID            | Destination ObjectID                                                  |
	+---------------------+-----------------------------------------------------------------------+
	| EnableOnValues      | Enable (set visible) DestinationObject on change to given Values      |
	+---------------------+-----------------------------------------------------------------------+
	| DisableOnValues     | Disable (set invisible) DestinationObject on change to given Values   |
	+---------------------+-----------------------------------------------------------------------+
	| ActivateOnValues    | Same like EnableOnValues but also set internal state to activated     |
	+---------------------+-----------------------------------------------------------------------+
	| DeactivateOnValues  | Same like DisableOnValues but also set internal state to deactivated  |
	+---------------------+-----------------------------------------------------------------------+
	| UpdateFormLength    | Write updated Formfield length to Destination Object                  |
	+---------------------+-----------------------------------------------------------------------+
	| FireEvents          | Fire Events on change to given Value                                  |
	+---------------------+-----------------------------------------------------------------------+

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

Update destination object with current objects input length.

17.3.6. FireEvents
******************

Globally fire (raise) Events on any objects state change.

.. code-block:: javascript

	"OnChange": {
		"FireEvents": [ "EventID1", "EventID2" ]
	}

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

17.4.1. Regex
*************

* DefaultString
* DefaultAtoZ
* DefaultInteger
* DefaultAtoZPlusNumbers
* DefaultAtoZUpper
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

17.4.2. Functions
*****************

* MinMax
* MaxLength
* IPAddress
* IPv4Address
* IPv6Address
* IPAddressSubnet
* IPPort
* DNSRecordName
* DateInternational
* DateGerman

17.4.3. Group Functions
***********************

* CheckUnique
* CheckNull
* CheckEmpty
* CheckDatePeriodOneYear
* CheckItemsOr
* CheckItemsMatch
* CheckTableRows
* MinOneItemNotNull
* DNSRecordValuePlusType

17.5. Providing User Validation
-------------------------------

To integrate your own user based *x0-validation-functions*, define them in
``userFunctions.js`` and reference in system database configuration.

.. code-block:: sql

	INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'user_function', '[0] = "FunctionNr1"');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'user_function', '[1] = "FunctionNr2"');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'user_function', '[2] = "FunctionNr3"');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'user_function', '[3] = "FunctionNr4"');

.. _form-examples-list:

17.6. Form Examples Reference
-----------------------------

**Local Repository Examples:**

* **Example 5 - Enhanced Form:** `http://x0-app.x0.localnet/python/Index.py?appid=example5 <http://x0-app.x0.localnet/python/Index.py?appid=example5>`_
  
  - Advanced form validation features
  - Multiple form field types
  - Error handling and user feedback
  - Integration with backend services

**External x0-skeleton Examples:**

* **Forms with MicroESB:** `https://github.com/WEBcodeX1/x0-skeleton/tree/main/example/01-forms-microesb <https://github.com/WEBcodeX1/x0-skeleton/tree/main/example/01-forms-microesb>`_
  
  - Complete form implementation with microservice abstraction layer
  - Production-ready form handling
  - Service integration patterns

**Related Documentation:**

* :ref:`appdevformobjects` - Detailed formfield object documentation
* :ref:`appdevoverlay` - Overlay mode forms
* :ref:`devexamples` - Guidelines for creating new examples
