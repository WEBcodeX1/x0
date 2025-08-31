.. appdev-grid-system

.. _appdevgridsystem:

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

9.1. Supported Object Types
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
