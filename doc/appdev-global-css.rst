.. appdev-global-css

.. _global-css:

9. Global CSS Styling
=====================

The *x0-framework* seamlessly integrates with **Bootstrap 5.3** CSS while providing
flexibility for custom styling through global CSS cascading style sheets. This section
explains how to efficiently **combine** Bootstrap CSS with **custom styles** and leverage
them in *x0-metadata* (JSON) configurations.

.. important::
   While some online discussions label Bootstrap as outdated, its combination with custom
   *x0-css* provides clear **evidence to the contrary**. This approach empowers developers
   to build highly sophisticated, *individual* designs.

9.1. Bootstrap Integration
**************************

The *x0-framework* comes with **Bootstrap 5.3** CSS pre-integrated, allowing you to use
Bootstrap classes directly in your x0 object configurations through the ``Style`` 
attribute in ``object.json`` object declarations.

9.1.1. Using Bootstrap Classes
------------------------------

Bootstrap CSS classes can be applied to any *x0-system-object* that supports the
``Style`` attribute:

.. code-block:: javascript

   {
      "ExampleButton":
      {
         "Type": "Button",
         "Attributes":
         {
            "Style": "btn btn-primary me-2",
            "TextID": "TXT.BUTTON.SAVE"
         }
      }
   }

.. code-block:: javascript

   {
      "ExampleContainer":
      {
         "Type": "Div",
         "Attributes":
         {
            "Style": "container-fluid p-4 bg-light rounded shadow"
         }
      }
   }

Common Bootstrap classes that work well with x0:

.. table:: Common Bootstrap Classes
   :widths: 10 90

   +-------------------+----------------------------------------------------------------+
   | **Category**      | **Examples**                                                   |
   +===================+================================================================+
   | Layout            | container, container-fluid, row, col-*                         |
   +-------------------+----------------------------------------------------------------+
   | Spacing           | p-*, m-*, px-*, py-*, mx-*, my-*                               |
   +-------------------+----------------------------------------------------------------+
   | Colors            | bg-primary, text-white, border-success                         |
   +-------------------+----------------------------------------------------------------+
   | Components        | btn, card, badge, nav                                          |
   +-------------------+----------------------------------------------------------------+
   | Utilities         | rounded, shadow, float-start, text-center                      |
   +-------------------+----------------------------------------------------------------+

9.2. x0 vs. Bootstrap Grid
**************************

The *x0-grid-system* works harmoniously with Bootstrap's grid classes to create powerful,
responsive layouts.

9.2.1. Mix x0 with Bootstrap
----------------------------

When using *x0-grid* properties like ``RowStyle`` and ``ColStyle``, you can directly
apply Bootstrap grid classes:

.. code-block:: javascript

   {
      "ExampleList":
      {
         "Type": "List",
         "Attributes":
         {
            "RowStyle": "row mb-3",
            "ColStyle": [ "col-md-6", "col-md-3", "col-md-3" ],
            "RowAfterElements": 1
         }
      }
   }

This creates a responsive layout where:

- Each row gets Bootstrap's ``row`` class with bottom margin
- Columns use Bootstrap's responsive grid (50%, 25%, 25% on medium screens)

9.2.2. Advanced Grid Combinations
---------------------------------

Complex layouts can be achieved by mixing *x0-grid* properties with Bootstrap utilities:

.. code-block:: javascript

   {
      "ExampleResponsiveForm":
      {
         "Type": "FormfieldList",
         "Attributes":
         {
            "RowStyle": [ "row g-3", "row g-3 bg-light p-2" ],
            "ColStyle": [ "col-12 col-md-6", "col-12 col-md-4", "col-12 col-md-2"],
            "RowAfterElements": [ 2, 3 ]
         }
      }
   }

9.3. Custom CSS Integration
***************************

For project-specific styling, x0 provides the ``/www/static/globalstyles.css`` file 
where you can define custom CSS classes that complement Bootstrap styling.

9.3.1. Using globalstyles.css
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

9.3.2. Mix Custom and Bootstrap
-------------------------------

Mix custom classes with Bootstrap classes in your JSON configurations:

.. code-block:: javascript

   {
      "ExampleHeaderContainer":
      {
         "Type": "Div",
         "Attributes":
         {
            "Style": "my-custom-header p-4 mb-3 shadow-lg"
         }
      }

      "StatusIndicator":
      {
         "Type": "Div",
         "Attributes":
         {
            "Style": "d-flex align-items-center status-indicator status-active"
         }
      }
   }

9.4. Best Practices
*******************

9.4.1. Recommended Approach
---------------------------

1. **Bootstrap First**: Use Bootstrap classes for layout, spacing, and common UI patterns
2. **Custom Enhancement**: Add custom CSS for brand-specific styling and unique components
3. **Consistent Naming**: Use clear, descriptive class names in ``globalstyles.css``
4. **Responsive Design**: Leverage Bootstrap's responsive utilities with custom styles

9.4.2. Example Integration
--------------------------

.. code-block:: javascript

   {
      "ExampleProductCard":
      {
         "Type": "Div",
         "Attributes":
         {
            "Style": "card product-card shadow-sm hover-lift"
         }
      }
   }

Where ``card`` and ``shadow-sm`` are Bootstrap classes, and ``product-card`` and
``hover-lift`` are custom classes defined in globalstyles.css.
