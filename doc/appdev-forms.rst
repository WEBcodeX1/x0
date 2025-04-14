.. appdev-forms

.. _appdevforms:

11. Forms
=========

Designing Forms is an essential part when designing modern web-applications.
*x0-system* provides multiple mechanism for building complex forms easily.

11.1. FormfieldList
-------------------

The FormfieldList *x0-object-type* is a container type providing the following
functionality.

* Providing HTML conform <form> container
* Grouping multiple single *x0-form-object-types* together
* Validating against *x0-system* provided JS Validation Functions
* Validating against user provided JS Validation Functions
* Multilanguage Error / Info Display 
* CSS styled / Bootstrap conform Subsections

11.2. Form Validation
---------------------

The FormfieldList *x0-object-type* provides *x0-form-validation*.

* Validating a single Form element 
* Validating multiple Form elements (Group Validation)
* Container Objects / Error Container 
* System Provided Validation Functions (Single and Group Validation)
* User Based Validation Functions (Single and Group Validation)
* Regex Validation

Example see: http://x0-app.x0.localnet/python/Index.py?appid=example5.

11.3. FormfieldOnchange Handler
-------------------------------

The FormfieldOnChange Handler provides the mechanism to modify other already
rendered *x0-form-objects* when their state changes.

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

11.3.1. EnableOnValues
**********************

Valid for *x0-object-type* FormfieldPulldown.

Enable *x0-object* with ``ObjectID`` (set visible) when selected pulldown **value**
matches the given value in EnableOnValues Array.

``EnableOnValues`` must be specified in combination with ``DisableOnValues``
attribute to work properly.

Example see DisableOnValues.

11.3.2. DisableOnValues
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

11.3.3. ActivateOnValues
************************

Valid for *x0-object-type* FormfieldPulldown.

Same as EnableOnValues with the difference that the internal object state
is set to **activated**.

Objects with deactivated state will be ommitted from validation.

11.3.4. DeactivateOnValues
**************************

Same as DisableOnValues with the difference that the internal object state
is set to **deactivated**.

11.3.5. UpdateFormLength
************************

Valid for *x0-object-type* FormfieldText and FormfieldTextarea.

Update destination object with current objects input length.

11.3.6. FireEvents
******************

Globally fire Events on any objects state change.

.. code-block:: javascript

	"OnChange": {
		"FireEvents": [ "EventID1", "EventID2" ]
	}

11.3.7. Chaining Events
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

11.4. System Validation Types
-----------------------------

11.4.1. Regex
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

11.4.2. Functions
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

11.4.3. Group Functions
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

11.5. Providing User Validation
-------------------------------

To integrate your own user based *x0-validation-functions*, define them in
``userFunctions.js`` and reference in system database configuration.

.. code-block:: sql

	INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'user_function', '[0] = "FunctionNr1"');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'user_function', '[1] = "FunctionNr2"');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'user_function', '[2] = "FunctionNr3"');
	INSERT INTO system.config (app_id, config_group, "value") VALUES ('appid', 'user_function', '[3] = "FunctionNr4"');
