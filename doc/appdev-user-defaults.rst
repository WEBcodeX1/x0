11. User Defaults
=================

The x0 framework provides a comprehensive user-based functionality system that allows
developers to extend core framework capabilities with custom validation functions,
default value configurations, and context menu processing. This system was introduced
to provide greater flexibility and customization options for application developers.

11.1. Default Values
********************

The ``UserDefaults`` class allows you to override system-wide default values and
configurations for various x0 components.

11.1.1. UserDefaults Class
--------------------------

The UserDefaults class is automatically instantiated as ``sysFactory.UserDefaults``
during framework initialization:

.. code-block:: javascript

	function UserDefaults() {
		// Override default style configurations
		this.DefaultStyleScreen = 'col-md-10 ms-auto me-auto';
		this.DefaultStyleMenu = 'menu-custom-pos';

		// Set custom validation defaults
		this.DefaultValidationMessages = {
			'required': 'This field is required',
			'email': 'Please enter a valid email address',
			'number': 'Please enter a valid number'
		};
	}

11.1.2. Available Default Properties
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

11.2. User Validation Functions
*******************************

The framework supports custom validation functions that extend or override the built-in
validation system through the ``UserValidate`` class.

11.2.1. UserValidate Class
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

11.2.2. Using Custom Validation
-------------------------------

Apply custom validation functions in form field configurations:

.. code-block:: javascript

	"EmailField": {
		"Type": "FormfieldText",
		"Attributes": {
			"Validate": {
				"customEmail": true
			}
		}
	}

11.3. User Group Validation Functions
*************************************

For validation scenarios that require multiple form fields, the ``UserValidateGroup``
class provides group-based validation capabilities.

11.3.1. UserValidateGroup Class
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

11.3.2. Group Validation Configuration
--------------------------------------

Configure group validation in FormfieldList objects:

.. code-block:: javascript

	"LoginForm": {
		"Type": "FormfieldList",
		"Attributes": {
			"Validate": {
				"Group": {
					"passwordConfirmation": ["Password", "PasswordConfirm"]
				}
			}
		}
	}

11.4. User Context Menu Processing
**********************************

The ``UserContextMenu`` class allows custom processing of context menu interactions
beyond the standard framework methods.

11.4.1. UserContextMenu Class
-----------------------------

.. code-block:: javascript

	function UserContextMenu() {
	}

	UserContextMenu.prototype.process = function(ContextMenuRef) {
		console.debug('Processing custom context menu action:', ContextMenuRef);

		const method = ContextMenuRef.Method;
		const rowData = ContextMenuRef.RowData;

		switch(method) {
			case 'CustomExport':
				this.handleCustomExport(rowData);
				break;
			case 'CustomNotification':
				this.handleCustomNotification(rowData);
				break;
			default:
				console.debug('Unknown custom context menu method:', method);
		}
	}

	UserContextMenu.prototype.handleCustomExport = function(rowData) {
		// Custom export logic
		console.debug('Exporting data:', rowData);
	}

11.4.2. Context Menu Configuration
----------------------------------

Add custom context menu items in List configurations:

.. code-block:: javascript

	"MyList": {
		"Type": "List",
		"Attributes": {
			"ContextMenuItems": [
				{
					"Method": "CustomExport",
					"TextID": "TXT.EXPORT.CUSTOM",
					"IconStyle": "fa-solid fa-file-export"
				}
			]
		}
	}

11.5. Implementation Example
****************************

Complete example showing user functionality integration:

.. code-block:: javascript

	// File: /www/static/userFunctions.js

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
	}

	function UserValidateGroup() {
		this.ValidateFunc = {
			'businessInfo': this.validateBusinessInfo
		};
	}

	UserValidateGroup.prototype.validateBusinessInfo = function(FormfieldItems) {
		// Custom business validation logic
		return true;
	}

	function UserContextMenu() {
	}

	UserContextMenu.prototype.process = function(ContextMenuRef) {
		// Custom context menu processing
		console.debug('Custom context menu processing:', ContextMenuRef);
	}
