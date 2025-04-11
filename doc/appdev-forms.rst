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

	+---------------------+------------------------------------------------------------------------+
	| **Property**        | **Description**                                                        |
	+=====================+========================================================================+
	| ObjectID            | Destination ObjectID                                                   |
	+---------------------+------------------------------------------------------------------------+
	| EnableOnValues      | Enable (set visible) DestinationObject on change to given Values       |
	+---------------------+------------------------------------------------------------------------+
	| DisableOnValues     | Disable (set invisible) DestinationObject on change to given Values    |
	+---------------------+------------------------------------------------------------------------+
	| ActivateOnValues    | Same like EnableOnValues but also set internal state to activated      |
	+---------------------+------------------------------------------------------------------------+
	| DeactivateOnValues  | Same like DisableOnValues but also set internal state to deactivated   |
	+---------------------+------------------------------------------------------------------------+
	| UpdateFormLength    | Write updated Formfield length to Destination Object                   |
	+---------------------+------------------------------------------------------------------------+
	| FireEvents          | Fire Events on change to given Value                                   |
	+---------------------+------------------------------------------------------------------------+

11.3.1. EnableOnValues
**********************


11.3.2. DisableOnValues
***********************


11.3.3. ActivateOnValues
************************

11.3.4. DeactivateOnValues
**************************

11.3.5. UpdateFormLength
************************


11.3.6. FireEvents
******************

11.3.7. Chaining Events
***********************


11.4. Validating Sources
------------------------

11.5. Providing User Validation
-------------------------------
