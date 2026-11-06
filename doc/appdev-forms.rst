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

.. _formfield-list:

17.1. FormfieldList
-------------------

A ``FormfieldList`` is a container object that allows you to structure and group
multiple ``Formfield`` items. It provides core functionality such as single validation,
group validation, professional grid layouts, and error handling.

Each individual ``Formfield`` item has its own configuration, which is specified here:
:ref:`appdevformobjects`.

Additionally, these *x0-object-types* are officially supported:

- :ref:`objecttype-rangeslider`
- :ref:`objecttype-rangeslidercontainer`
- :ref:`objecttype-dynradiolist`

.. warning::
   Theoretically, **any** *x0-object-type* can be referenced inside a ``FormfieldList``, but
   doing so may break the layout or lead to unexpected behavior.

17.1.1. Object Attributes
*************************

.. table:: FormfieldList Attributes
   :widths: 15 15 70

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
   | GroupValidate    | Array of Elements | Array of Group Validate Elements                 |
   +------------------+-------------------+--------------------------------------------------+
   | Disable          | Boolean           | Disables all contained Formfields on ``reset()`` |
   +------------------+-------------------+--------------------------------------------------+

17.1.2. Validation
******************

By declaratively setting a ``Formfield`` item's ``ValidateRef`` with a valid validation regex or
function reference (see :ref:`form-validation-types`), the item is **ready** for validation.

Triggering the validation process ultimately happens when a ``Button`` or ``ButtonInternal``
*x0-object-type* (:ref:`objecttype-button` or :ref:`objecttype-buttoninternal`) has been
configured to do so. See :ref:`appdevactions` for details on the logical control flow behavior.

17.1.3. Group Validation
************************

Unlike validating a single ``Formfield`` item, specifying ``GroupValidate``
allows multiple items to be validated against each other.

The ``FunctionRef`` property allows developers to reference a validation function
defined in ``sysFormfieldValidate.js``. This file contains multiple pre-shipped validation
scenarios. See :ref:`form-validation-types` for details, which also describes how to extend
the system with custom, programmatic validation routines.

.. table:: GroupValidate Element Attributes
   :widths: 15 15 70

   +---------------------+------------------+------------------------------------------------+
   | **Property**        | **Type**         | **Description**                                |
   +=====================+==================+================================================+
   | FunctionRef         | String           | Name of the system Group Validate function     |
   +---------------------+------------------+------------------------------------------------+
   | ObjectIDs           | Array of Strings | ObjectIDs validated together by FunctionRef    |
   +---------------------+------------------+------------------------------------------------+
   | ValidateErrorTextID | TextID-String    | TextID referenced in "webui.text" DB Table     |
   +---------------------+------------------+------------------------------------------------+

.. code-block:: javascript

   "GroupValidate": [
      {
         "FunctionRef": "CheckItemsMatch",
         "ObjectIDs": [
            "PasswordNew",
            "PasswordRepeat"
         ],
         "ValidateErrorTextID": "TXT.VALIDATE.PASSWORD-MISMATCH"
      }
   ]

17.1.4. Grid Integration
************************

The declarative **Form** approach also allows you to apply professional layouts
without complex configurations, as shown below:

.. code-block:: javascript

	+---------------------------------+---------------------------------+
	| FormItem1 (label)               | FormItem2                       |
	+---------------------------------+---------------------------------+
	| FormItem3 (label)                                                 |
	+---------------------------------+----------------+----------------+
	| FormItem4                       | FormItem5      | FormItem6      |
	+----------------+----------------+----------------+----------------+
	| FormItem7      | FormItem8      | FormItem9      | FormItem10     |
	+----------------+----------------+----------------+----------------+

For a detailed explanation of how the *x0-grid* system works, see :ref:`appdevgridsystem`.

17.1.5. ErrorContainer
**********************

When validating a ``FormfieldList``, the ``ErrorContainer`` (:ref:`objecttype-errorcontainer`)
*x0-object-type* handles rendering error information upon validation failure.
Like any other *x0-object*, it supports multilingual display text and is **not**
**bound** directly to the referencing ``FormfieldList``.

Positioning (layout) the ``ErrorContainer`` is achieved via ``object.json`` and ``skeleton.json``,
just like any other *x0-object-type*. The *x0-shadow-dom* enables this behavior: on validation failure,
the *x0-system* references the bound ``ErrorContainer`` using ``sysFactory.getObjectByID(ErrorContainerID)``
and calls the object instance's render routines, which ultimately output the detailed error information
(according to the current display language).

.. important::
   By default, the ``ErrorContainer`` should be configured without any attributes, unless a
   specific ``Style`` needs to be applied. Connecting it within ``skeleton.json`` is sufficient,
   as its logic is **always** controlled externally by other objects.

17.1.6. Backend Data In
***********************

To populate a ``FormfieldList`` object instance with data from the backend, the global,
generic *x0-component* ``ServiceConnector`` (see :ref:`appdevserviceconnector`) is used.
Once configured correctly and after the corresponding event triggers the backend
service, the data arrives at the internal XML-RPC receiving mechanism of the ``FormfieldList``.

The data mapping depends heavily on the incoming schema. Even if there is a structural
mismatch (such as missing or extra fields), the data will still be correctly correlated
to the matching ``Formfield`` items inside the ``FormfieldList``, provided the keys match.

Upon object instantiation, the ``FormfieldList`` *x0-object-type* automatically maps its
internal ``KeyID`` to the given ``FormfieldID`` for each item. This ``KeyID`` serves as the primary
key for the ``Formfield`` when incoming input data is processed for a list of ``Formfield`` items.

Based on this rule, if three items with the IDs "FormID1", "FormID2", and "FormID3"
are mapped to the ``FormfieldList``, the following examples explain the behavior in detail:

.. code-block:: javascript

   {
      "FormID1": "data1",
      "FormID2": "data2"
   }

Two items will be updated with the values "data1" and "data2". The ``Formfield`` item "FormID3" remains empty.

.. code-block:: javascript

   {
      "FormID2": "data2",
      "FormID3": "data3",
      "FormID4": "data4"
   }

Two items will be updated with the values "data2" and "data3". The ``Formfield`` item "FormID1" remains empty,
and the incoming data key "FormID4" will be ignored.

17.1.7. Backend Data Out
************************

17.1.8. Context Menu
********************


17.2. FormfieldOnchange Handler
-------------------------------

The **x0::FormfieldOnChange** Handler component (``sysFormfieldOnChangeHandler.js``) provides
a declarative mechanism allowing a single form field's state change to reactively reconfigure
other, already rendered *x0-form-objects* without any custom JavaScript.

.. table:: FormfieldOnchange OnChange Attributes
   :widths: 25 75

   +--------------------+------------------------------------------------------------------------+
   | **Property**       | **Description**                                                        |
   +====================+========================================================================+
   | ObjectID           | Destination ObjectID.                                                  |
   +--------------------+------------------------------------------------------------------------+
   | EnableOnValues     | Enable (set visible) DestinationObject on change to given Values.      |
   +--------------------+------------------------------------------------------------------------+
   | DisableOnValues    | Disable (set invisible) DestinationObject on change to given Values.   |
   +--------------------+------------------------------------------------------------------------+
   | ActivateOnValues   | Same like EnableOnValues but also set internal state to activated.     |
   +--------------------+------------------------------------------------------------------------+
   | DeactivateOnValues | Same like DisableOnValues but also set internal state to deactivated.  |
   +--------------------+------------------------------------------------------------------------+
   | FireEvents         | Fire Events on change to given Value                                   |
   +--------------------+------------------------------------------------------------------------+

.. important::
   An ``EnableOnValues``/``DisableOnValues`` example that enables/disables a complete sub-section
   hierarchy of child elements recursively can be found when running the *x0-static* docker application
   under "Settings/GlobalSettings" -> "DefaultSettings" (Tab) -> "SystemSettings/BasicSettings" upon
   enabling the Messaging Server Component checkbox (``FormfieldCheckbox`` *x0-system-object* type).

17.2.1. EnableOnValues
**********************

Valid for *x0-object-type* FormfieldPulldown.

Enable *x0-object* with ``ObjectID`` (set visible) when selected pulldown **value**
matches the given value in EnableOnValues Array.

``EnableOnValues`` must be specified in combination with ``DisableOnValues``
attribute to work properly.

Example see DisableOnValues.

17.2.2. DisableOnValues
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

17.2.3. ActivateOnValues
************************

Valid for *x0-object-type* ``FormfieldPulldown``.

Same as ``EnableOnValues`` with the difference that the internal object state
is set to **activated**.

Objects with deactivated state will be omitted from validation.

17.2.4. DeactivateOnValues
**************************

Same as ``DisableOnValues`` with the difference that the internal object state
is set to **deactivated**.

17.2.5. FireEvents
******************

Globally fire (raise) Events on any objects state change.

.. code-block:: javascript

   "OnChange": {
      "FireEvents": [ "EventID1", "EventID2" ]
   }

See :ref:`appdeveventsystem` for the full event-system architecture.

17.2.6. Chaining Events
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

17.3. System Validation Types
-----------------------------

Referenced by name via a form element's ``ValidateRef`` attribute (see
:ref:`appdevformobjects`), implemented in ``sysFormfieldValidate.js``.

17.3.1. Regex
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

17.3.2. Functions
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

17.3.3. Group Functions
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

17.4. User Based Integration
----------------------------

Custom *x0-validation-functions* are integrated directly in ``userFunctions.js``,
which ships with a dedicated ``UserValidate`` (single-field) and ``UserValidateGroup``
(group) registry.

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

Additional information will be provided in the systems-developer manual starting
at :ref:`devarchitecture`.
