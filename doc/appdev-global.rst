.. appdev-global

.. _appdevglobalcss:

8. Global CSS Styling
=====================

The x0 framework seamlessly integrates with Bootstrap 5.3 CSS while providing 
flexibility for custom styling through global CSS cascading style sheets. This 
section explains how to efficiently combine Bootstrap CSS with custom styles and 
leverage them in x0 JSON metadata configurations.

8.1. Bootstrap CSS Integration
*****************************

The x0 framework comes with Bootstrap 5.3 CSS pre-integrated, allowing you to use 
Bootstrap classes directly in your x0 object configurations through the ``Style`` 
attribute in ``object.json`` files.

8.1.1. Using Bootstrap Classes in JSON Metadata
-----------------------------------------------

Bootstrap CSS classes can be applied to any x0-system-object that supports the 
``Style`` attribute:

.. code-block:: javascript

	"MyButton": {
		"Type": "Button",
		"Attributes": {
			"Style": "btn btn-primary me-2",
			"TextID": "TXT.BUTTON.SAVE"
		}
	}

.. code-block:: javascript

	"MyContainer": {
		"Type": "Div",
		"Attributes": {
			"Style": "container-fluid p-4 bg-light rounded shadow"
		}
	}

Common Bootstrap classes that work well with x0:

.. table:: Common Bootstrap Classes
	:widths: 30 70

	+-------------------+--------------------------------------------------------+
	| **Category**      | **Examples**                                           |
	+===================+========================================================+
	| Layout            | container, container-fluid, row, col-*, d-flex        |
	+-------------------+--------------------------------------------------------+
	| Spacing           | p-*, m-*, px-*, py-*, mx-*, my-*                      |
	+-------------------+--------------------------------------------------------+
	| Colors            | bg-primary, text-white, border-success                |
	+-------------------+--------------------------------------------------------+
	| Components        | btn, card, alert, badge, nav                           |
	+-------------------+--------------------------------------------------------+
	| Utilities         | rounded, shadow, float-start, text-center             |
	+-------------------+--------------------------------------------------------+

8.2. x0 Grid and Bootstrap Grid Integration
******************************************

The x0 Grid System works harmoniously with Bootstrap's grid classes to create 
powerful, responsive layouts.

8.2.1. Combining x0 Grid with Bootstrap Classes
----------------------------------------------

When using x0 Grid properties like ``RowStyle`` and ``ColStyle``, you can directly 
apply Bootstrap grid classes:

.. code-block:: javascript

	"MyList": {
		"Type": "List",
		"Attributes": {
			"RowStyle": "row mb-3",
			"ColStyle": ["col-md-6", "col-md-3", "col-md-3"],
			"RowAfterElements": 1
		}
	}

This creates a responsive layout where:
- Each row gets Bootstrap's ``row`` class with bottom margin
- Columns use Bootstrap's responsive grid (50%, 25%, 25% on medium screens)
- Layout adapts automatically to different screen sizes

8.2.2. Advanced Grid Combinations
--------------------------------

Complex layouts can be achieved by mixing x0 Grid properties with Bootstrap utilities:

.. code-block:: javascript

	"ResponsiveForm": {
		"Type": "FormfieldList",
		"Attributes": {
			"RowStyle": ["row g-3", "row g-3 bg-light p-2"],
			"ColStyle": ["col-12 col-md-6", "col-12 col-md-4", "col-12 col-md-2"],
			"RowAfterElements": [2, 3]
		}
	}

8.3. Custom CSS Integration
***************************

For project-specific styling, x0 provides the ``/www/static/globalstyles.css`` file 
where you can define custom CSS classes that complement Bootstrap styling.

8.3.1. Using globalstyles.css
-----------------------------

Custom styles in ``globalstyles.css`` can be applied alongside Bootstrap classes:

.. code-block:: css

	/* Custom styles in /www/static/globalstyles.css */
	.my-custom-header {
		background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
		color: white;
		border-radius: 8px;
	}

	.status-indicator {
		display: inline-block;
		width: 12px;
		height: 12px;
		border-radius: 50%;
		margin-right: 8px;
	}

	.status-active {
		background-color: #28a745;
	}

	.status-inactive {
		background-color: #dc3545;
	}

8.3.2. Combining Custom and Bootstrap Classes
--------------------------------------------

Mix custom classes with Bootstrap classes in your JSON configurations:

.. code-block:: javascript

	"HeaderContainer": {
		"Type": "Div",
		"Attributes": {
			"Style": "my-custom-header p-4 mb-3 shadow-lg"
		}
	}

	"StatusIndicator": {
		"Type": "Div",
		"Attributes": {
			"Style": "d-flex align-items-center status-indicator status-active"
		}
	}

8.4. CSS Best Practices with x0
*******************************

8.4.1. Recommended Approach
---------------------------

1. **Bootstrap First**: Use Bootstrap classes for layout, spacing, and common UI patterns
2. **Custom Enhancement**: Add custom CSS for brand-specific styling and unique components
3. **Consistent Naming**: Use clear, descriptive class names in globalstyles.css
4. **Responsive Design**: Leverage Bootstrap's responsive utilities with custom styles

8.4.2. Example Integration Pattern
---------------------------------

.. code-block:: javascript

	"ProductCard": {
		"Type": "Div",
		"Attributes": {
			"Style": "card product-card shadow-sm hover-lift"
		}
	}

Where ``card`` and ``shadow-sm`` are Bootstrap classes, and ``product-card`` and 
``hover-lift`` are custom classes defined in globalstyles.css.

.. _appdevglobalgrid:

9. Grid System
==============

The x0 grid system is implemented through the `sysGridGenerator` system object,
which is responsible for generating a grid layout by processing source objects
into structured rows and columns. Below is an explanation of its key components
and functionality:

- Key Components:

    1. Source Objects:
        The grid generator takes an array of source objects as input, which are processed into grid elements.

    2. Row and Column Styles:
        Customizable row and column styles (`RowStyles` and `ColStyles`) allow you to define the CSS styling for each grid element.

    3. Row and Column Enclosures:
        Rows and columns are enclosed in containers (`sysObjDiv` objects) for structured layout.
        The number of elements after which rows and columns are enclosed can be customized using `RowAfterElements` and `ColAfterElements`.

    4. Generators for Indices and Styles:
        The system uses generators (`RowIndexGenerator`, `ColIndexGenerator`, `RowStyleGenerator`, `ColStyleGenerator`) to dynamically determine the next row/column indices and styles.

    5. Dynamic Grid Creation:
        - The `generate` method processes the source objects:
            Groups objects into columns based on `ColAfterElements`.
            Groups columns into rows based on `RowAfterElements`.
        - Each grid element is assigned a unique identifier for DOM manipulation.

    6. Integration with Other System Objects:
        The grid system interacts with other x0 system objects, such as `sysObjDiv`, to create and manage the grid structure dynamically.

- Workflow:

    * Initialization:
        The `sysGridGenerator` object is initialized with row/column styles and enclosure settings.

    * Grid Generation:
        - The generate method iterates over the source objects:
            Groups objects into columns.
            Groups columns into rows.
        - The generated rows are returned as an array of `sysObjDiv` objects, each representing a grid row.

    * Styling and Customization:
        Rows and columns are styled dynamically using the provided CSS styles or default styles.

8.1. Supported Object Types
***************************

Currently the following *x0-object-types* are supporting the *x0-grid* feature:

* List
* FormfieldList

.. note::

	The *x0-global-grid-system* does not provide rowspan formating, this can be
	done otherwise by **directly referencing** or **designing own** *x0-system-objects*,
	see example #9 or :ref:`devobjectmodeling`.

.. warning::

	You should be familiar with Bootstrap Grid system before continue reading.

9.2. Global JSON Metadata
*************************

If an *x0-object* supports *x0-global-grid-system* formatting the following
properties can be set inside the objects "Attribute" representation.

.. table:: Global Grid Object Properties
	:widths: 30 20 50

	+-------------------+----------------------+-------------------------------------------------------+
	| **Property**      | **Type**             | **Description**                                       |
	+===================+======================+=======================================================+
	| RowStyle          | String / Array       | CSS Style Classes used for next Row-Element (Div)     |
	+-------------------+----------------------+-------------------------------------------------------+
	| RowAfterElements  | Integer / Array      | Generate Row-Element at next RowAfterElements reached |
	+-------------------+----------------------+-------------------------------------------------------+
	| ColStyle          | String / Array       | CSS Style Classes used for next Col-Element (Div)     |
	+-------------------+----------------------+-------------------------------------------------------+
	| ColAfterElements  | Integer / Array      | Generate Col-Element at next ColAfterElements reached |
	+-------------------+----------------------+-------------------------------------------------------+
	|                   |                      | Optional, Default 1                                   |
	+-------------------+----------------------+-------------------------------------------------------+

9.2.1. Input Data
-----------------

The *x0-grid-system* processing requires an **Array of Elements** as input data.

.. code-block:: javascript

	[ el1, el2, el3, el4, el5, el6 ... ]

9.2.2. RowStyle / RowAfterElements
----------------------------------

``RowAfterElements`` is definable as a single string or an Array of Strings.

Setting ``"RowAfterElements": 1`` will generate a row container div with css
class from ``RowStyle`` for each single Element.

.. code-block:: html

	<div class="row">
		<el1></el1>
	</div>
	<div class="row">
		<el2></el2>
	</div>
	<div class="row">
		<el3></el3>
	</div>

Setting ``"RowAfterElements": 2`` will generate divs like this:

.. code-block:: html

	<div class="row">
		<el1></el1>
		<el2></el2>
	</div>
	<div class="row">
		<el3></el3>
		<el4></el4>
	</div>

Setting ``"RowAfterElements": [ 1, 2 ]`` (Array type) like this:

.. code-block:: html

	<div class="row">
		<el1></el1>
	</div>
	<div class="row">
		<el2></el2>
		<el3></el3>
	</div>
	<div class="row">
		<el4></el4>
	</div>
	<div class="row">
		<el5></el5>
		<el6></el6>
	</div>

Modifying ``"RowStyle": [ "row fw-bold", "row" ]`` renders:

.. code-block:: html

	<div class="row fw-bold">
		<el1></el1>
	</div>
	<div class="row">
		<el2></el2>
		<el3></el3>
	</div>
	<div class="row fw-bold">
		<el4></el4>
	</div>
	<div class="row">
		<el5></el5>
		<el6></el>
	</div>

9.2.3. ColStyle / ColAfterElements
----------------------------------

ColAfterElements processing is likewise RowAfterElements processing,
with the difference of generating a **column** container div instead
of a **row** container div.

.. note::

    Note that ColAfterElements default value is ``[1]``, so the container
	div including CSS will be set for each processed element.

The last 

.. code-block:: javascript

	"RowStyle": [ "row fw-bold", "row" ],
	"RowAfterElements": [ 1, 2 ],
	"ColStyle": "col-md-12"
	"ColAfterElements": [ 1, 2 ]

.. code-block:: html

	<div class="row fw-bold">
		<div class="col-md-12">
			<el1></el1>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<el2></el2>
			<el3></el3>
		</div>
	</div>
	<div class="row fw-bold">
		<div class="col-md-12">
			<el4></el4>
		</div>
	</div>
	<div class="row">
		<div class="col-md-12">
			<el5></el5>
			<el6></el>
		</div>
	</div>

9.3. Example List
*****************

.. code-block:: javascript

	"RowStyle": "row",
	"RowAfterElements": [ 2, 4 ]
	"ColStyle": [
		"col-md-5",
		"col-md-7",
		"col-md2",
		"col-md3",
		"col-md3",
		"col-md5"
	]

Without table header the resulting output looks like the following.

.. code-block:: javascript

	+---------------------------------+---------------------------------+
	| Col1 (col-md-5)                 | Col2 (col-md-7)                 |
	+----------------+----------------+----------------+----------------+
	| Col3 (col-md2) | Col4 (col-md3) | Col5 (col-md3) | Col6 (col-md5) |
	+---------------------------------+---------------------------------+
	| Col1 (col-md-5)                 | Col2 (col-md-7)                 |
	+----------------+----------------+----------------+----------------+
	| Col3 (col-md2) | Col4 (col-md3) | Col5 (col-md3) | Col6 (col-md5) |
	+----------------+----------------+----------------+----------------+

9.4. Developer
**************

Any *x0-system-object* can make use of the global grid formatting routines in
case an Array of Elements exists as input data.

Checkout the developer documentation how to implement grid formating into your
self designed *x0-objects*.

.. _appdevglobalcontextmenu:

10. Context Menu
===============

A context menu (right mouse click) can be bound to any *x0-object-type*
(if it was implemented by the *x0-developer*).

.. note::

    Currently only ``List`` and ``FormfieldList`` *x0-object-types* are supported,
    this will change in future releases.

10.1. Global Attributes
**********************

.. table:: Context Menu Item Global Attributes
	:widths: 30 20 100

	+---------------------+----------------------+-------------------------------------------------+
	| **Property**        | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Method              | Enum-String          | Implemented Context Menu Methods                |
	+---------------------+----------------------+-------------------------------------------------+
	| TextID              | TextID-String        | TextID referenced in "webui.text" DB Table      |
	+---------------------+----------------------+-------------------------------------------------+
	| IconStyle           | CSS-String           | CSS Style Classes, space separated              |
	+---------------------+----------------------+-------------------------------------------------+

10.2. Implemented Methods
************************

.. table:: Context Menu Methods
	:widths: 30 20 100

	+---------------------+----------------------+-------------------------------------------------+
	| **Method**          | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| Edit                | Table-Row            | Switch Screen into Edit-Mode                    |
	+---------------------+----------------------+-------------------------------------------------+
	| RemoveSingle        | Table-Row            | Remove Single Table Row                         |
	+---------------------+----------------------+-------------------------------------------------+
	| RemoveSelected      | Array of Table-Rows  | Remove Selected Table Rows                      |
	+---------------------+----------------------+-------------------------------------------------+

10.3. Edit Attributes
********************

.. table:: Context Menu Item "Edit" Attributes
	:widths: 30 20 100

	+---------------------+----------------------+-------------------------------------------------+
	| **Method**          | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DstScreenID         | ScreenID-String      | Destination ScreenID Reference                  |
	+---------------------+----------------------+-------------------------------------------------+
	| RowColumn           | RowID-String         | Table Row Column Reference                      |
	+---------------------+----------------------+-------------------------------------------------+
	| FireEvents          |  Array               | Array of EventIDs                               |
	+---------------------+----------------------+-------------------------------------------------+

.. _appdevglobaluser:

11. User Functionality & Default Values
=======================================

The x0 framework provides a comprehensive user-based functionality system that allows 
developers to extend core framework capabilities with custom validation functions, 
default value configurations, and context menu processing. This system was introduced 
to provide greater flexibility and customization options for application developers.

11.1. User Defaults
*******************

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
-----------------------------------

.. table:: User Default Properties
	:widths: 40 60

	+-----------------------------+--------------------------------------------------------+
	| **Property**                | **Description**                                        |
	+=============================+========================================================+
	| DefaultStyleScreen          | Override default screen container CSS classes         |
	+-----------------------------+--------------------------------------------------------+
	| DefaultStyleMenu            | Override default menu positioning CSS classes         |
	+-----------------------------+--------------------------------------------------------+
	| DefaultStyleScreenOverlay   | Override default overlay CSS classes                  |
	+-----------------------------+--------------------------------------------------------+
	| DefaultStyleListNavLeft     | Override default list navigation left CSS classes     |
	+-----------------------------+--------------------------------------------------------+
	| DefaultStyleListNavRight    | Override default list navigation right CSS classes    |
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
-------------------------------------

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
---------------------------------

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
