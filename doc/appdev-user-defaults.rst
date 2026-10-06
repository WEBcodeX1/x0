13. User Defaults
=================

The **x0-framework** provides a comprehensive user-based functionality system that allows
developers to extend core framework capabilities with custom validation functions,
default value configurations, and context menu processing. This system was introduced
to provide greater flexibility and customization options for application developers.

13.1. Default Values
********************

The ``UserDefaults`` class allows you to override system-wide default values and
configurations for various x0 components.

13.1.1. UserDefaults Class
--------------------------

The UserDefaults class is automatically instantiated on **x0-system-init**,
use it to override global default values.

.. code-block:: javascript

	function UserDefaults() {
		//- override default style configurations
		sysFactory.DefaultStyleScreen = 'col-md-10 ms-auto me-auto';
		sysFactory.DefaultStyleMenu = 'menu-custom-pos';
	}

13.1.2. Available Default Properties
------------------------------------

.. table:: User Default Properties
	:widths: 40 60

	+-----------------------------+--------------------------------------------------------+
	| **Property**                | **Description**                                        |
	+=============================+========================================================+
	| DefaultStyleScreen          | Override default screen container CSS classes          |
	+-----------------------------+--------------------------------------------------------+
	| DefaultStyleMenu            | Override default menu positioning CSS classes          |
	+-----------------------------+--------------------------------------------------------+
	| DefaultStyleScreenOverlay   | Override default overlay CSS classes                   |
	+-----------------------------+--------------------------------------------------------+
	| DefaultStyleListNavLeft     | Override default list navigation left CSS classes      |
	+-----------------------------+--------------------------------------------------------+
	| DefaultStyleListNavRight    | Override default list navigation right CSS classes     |
	+-----------------------------+--------------------------------------------------------+

13.2. User Validation Functions
*******************************

The framework supports custom validation functions that extend or override the built-in
validation system through the ``UserValidate`` class.

13.2.1. UserValidate Class
--------------------------

Custom validation functions are defined in the ``UserValidate`` class:

.. code-block:: javascript

	function UserValidate() {
		this.ValidateFunc = {
			'customEmail': this.validateCustomEmail,
			'phoneNumber': this.validatePhoneNumber,
			'strongPassword': this.validateStrongPassword
		};
	}

	UserValidate.prototype.validateCustomEmail = function(Value, FormObj) {
		const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
		const isValid = emailRegex.test(Value);
		console.debug('Custom email validation:', Value, isValid);
		return isValid;
	}

	UserValidate.prototype.validatePhoneNumber = function(Value, FormObj) {
		const phoneRegex = /^\+?[\d\s-()]{10,}$/;
		return phoneRegex.test(Value);
	}

13.2.2. Using Custom Validation
-------------------------------

Apply custom validation functions in form field configurations:

.. code-block:: javascript

	"EmailField": {
		"Type": "Formfield",
		"Attributes": {
			"Type": "text",
			"ValidateRef": "customEmail",
			"ValidateErrorTextID": "MultiLangTextID"
		}
	}

13.3. User Group Validation Functions
*************************************

For validation scenarios that require multiple form fields, the ``UserValidateGroup``
class provides group-based validation capabilities.

13.3.1. UserValidateGroup Class
-------------------------------

.. code-block:: javascript

	function UserValidateGroup() {
		this.ValidateFunc = {
			'passwordConfirmation': this.validatePasswordConfirmation,
			'addressValidation': this.validateCompleteAddress
		};
	}

	UserValidateGroup.prototype.validatePasswordConfirmation = function(FormfieldItems) {
		const password = FormfieldItems.find(item => item.ObjectID === 'Password');
		const confirmation = FormfieldItems.find(item => item.ObjectID === 'PasswordConfirm');

		if (password && confirmation) {
			const isMatch = password.getValue() === confirmation.getValue();
			console.debug('Password confirmation validation:', isMatch);
			return isMatch;
		}
		return false;
	}

13.3.2. Group Validation Configuration
--------------------------------------

Configure group validation in FormfieldList objects:

.. code-block:: javascript

	"LoginForm": {
		"Type": "FormfieldList",
		"Attributes": {
			"GroupValidate": {
				"FunctionRef": "passwordConfirmation",
				"ObjectIDs": ["Password", "PasswordConfirm"]
			}
		}
	}

13.4. Context Menu Functions
****************************

Context-menu operations are dispatched by the built-in ``FunctionDispatcher``.
Its supported function identifiers and configuration are documented in
:ref:`appdevcontextmenu`. The previous ``UserContextMenu`` extension example is
not part of the current runtime API.

13.5. Implementation Example
****************************

User default and validation classes are defined in the application's
``userFunctions.js`` file. The framework instantiates ``UserDefaults``,
``UserValidate``, and ``UserValidateGroup`` during initialization.

.. code-block:: javascript

   function UserDefaults() {
     this.DefaultStyleScreen = 'col-md-10 ms-auto me-auto custom-screen';
   }

   function UserValidate() {
     this.ValidateFunc = {
       'businessEmail': this.validateBusinessEmail
     };
   }

   UserValidate.prototype.validateBusinessEmail = function(Value, FormObj) {
     const businessDomains = ['company.com', 'business.org'];
     const domain = Value.split('@')[1];
     return businessDomains.includes(domain);
   };
