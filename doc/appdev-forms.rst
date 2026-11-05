.. appdev-forms

.. _appdevforms:

17. Forms
=========

Providing forms for today's modern cloud applications is no longer the
static process it was years ago. If your application does not supply real-time,
modifiable forms—including content-based, dynamically reloading sub-content and specifically
highlighting areas upon user errors—the user experience will be rated poorly. Many frameworks
remain far too data-centric (such as SAP), making them look like tax forms from 1992.
Conversely, modern frameworks that rely too heavily on raw CSS and HTML5 often provide
a poor data-driven model, which is also undesirable.

The *x0-framework* combines these two worlds, providing an ultra-flexible, OOP-based
design model with two distinct development approaches:

- **Declarative Configuration:** Provides a **declarative-only** way to use pre-shipped,
  form-optimized *x0-objects*, such as the ``FormfieldList`` *x0-object-type*. It handles
  structural layout grids and automated group validation directly through declarative
  configuration without any programming, all while maintaining complete flexibility.

- **Programmatic Development:** Gives developers the ultimate flexibility to build custom
  *x0-system-objects*. Any declarative, pre-shipped object can also be used programmatically.
  For example, a single ``Formfield`` can be placed into other container objects, or multiple
  ``FormfieldList`` instances can be combined to create powerful, hierarchical UI elements.

The following documentation focuses on approach 1 (**Declarative Configuration**). If you are
interested in approach 2 (**Programmatic Development**) , please refer to the system developer
documentation starting at :ref:`devarchitecture`.

17.1. FormfieldList
-------------------

A ``FormfieldList`` is a container object that allows you to structure and group
multiple ``Formfield`` items. It provides core functionality such as single validation,
group validation, professional grid layouts, and error handling.

Each individual ``Formfield`` item has its own configuration, which is specified here:
:ref:`appdevformobjects`.

Additionally, the *x0-object-types* ``RangeSlider`` and ``RangeSliderContainer`` can
officially be used; see :ref:`objecttype-rangeslider` and :ref:`objecttype-rangeslidercontainer`.

Theoretically, **any** *x0-object-type* can be referenced inside a ``FormfieldList``, but
doing so may break the layout or lead to unexpected behavior.

17.2. Connecting Objects
------------------------

17.3. Grid Layout
-----------------

17.4. Form Validation
---------------------

- **Single-Field Validation**: .

- **Group Validation**: .

* **Error Container**: .

17.5. FormfieldOnchange Handler
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
   | FireEvents         | Fire Events on change to given Value                                 |
   +--------------------+----------------------------------------------------------------------+

.. note::
   An ``EnableOnValues``/``DisableOnValues`` example that enables/disables a complete sub-section
   hierarchy of child elements recursively can be found when running the *x0-static* docker application
   under "Settings/GlobalSettings" -> "DefaultSettings" (Tab) -> "SystemSettings/BasicSettings" upon
   enabling the Messaging Server Component checkbox (``FormfieldCheckbox`` *x0-system-object* type).

17.5.1. EnableOnValues
**********************

Valid for *x0-object-type* FormfieldPulldown.

Enable *x0-object* with ``ObjectID`` (set visible) when selected pulldown **value**
matches the given value in EnableOnValues Array.

``EnableOnValues`` must be specified in combination with ``DisableOnValues``
attribute to work properly.

Example see DisableOnValues.

17.5.2. DisableOnValues
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

17.5.3. ActivateOnValues
************************

Valid for *x0-object-type* ``FormfieldPulldown``.

Same as ``EnableOnValues`` with the difference that the internal object state
is set to **activated**.

Objects with deactivated state will be omitted from validation.

17.5.4. DeactivateOnValues
**************************

Same as ``DisableOnValues`` with the difference that the internal object state
is set to **deactivated**.

17.5.5. FireEvents
******************

Globally fire (raise) Events on any objects state change.

.. code-block:: javascript

   "OnChange": {
      "FireEvents": [ "EventID1", "EventID2" ]
   }

See :ref:`appdeveventsystem` for the full event-system architecture.

17.5.6. Chaining Events
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

17.6. System Validation Types
-----------------------------

Referenced by name via a form element's ``ValidateRef`` attribute (see
:ref:`appdevformobjects`, 11.2), implemented in ``sysFormfieldValidate.js``.
See :ref:`devoopmodel-classes` (24.3.6/24.3.7) for the underlying
``sysFormFieldValidate``/``sysFormFieldValidateGroup`` method reference.

17.6.1. Regex
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

17.6.2. Functions
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

17.6.3. Group Functions
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

17.7. User Validation
---------------------

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
