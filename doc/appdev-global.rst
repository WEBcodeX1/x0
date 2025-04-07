.. appdev-global

.. _appdevglobalgrid:

4. Grid System
==============

Some *x0-object-types* offer global grid formating properties. Currently the
following *x0-object-types* are supported.

* List
* FormfieldList

The *x0-global-grid-system* uses the CSS Grid System / Bootstrap Grid Styles
to replace oldfashioned HTML table colspan with a simple mechanism without loosing
functionality.

.. note::

	The *x0-global-grid-system* does not provide rowspan formating, this can be
	done otherwise by **directly referencing** or **designing own** *x0-system-objects*,
	see example#9 or :ref:`devobjectmodeling`.

.. warning::

	You should be familiar with Boostrap Grid system before continue reading.

4.1. Global JSON Metadata 
*************************

If an *x0-object* supports *x0-global-grid-system* formating the following
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

4.1.1. Input Data
-----------------

The *x0-grid-system* processing requires an **Array of Elements** as input data.

.. code-block:: javascript

	[ el1, el2, el3, el4, el5, el6 ... ]

4.1.2. RowStyle / RowAfterElements
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
		<el6></el>
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

4.1.3. ColStyle / ColAfterElements
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

4.2. Example List
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

4.3. Developer
**************

Any *x0-system-object* can make use of the global grid formatting routines in
case an Array of Elements exists as input data.

Checkout the developer documenation how to implement grid formating into your
self designed *x0-objects*.

.. _appdevglobalcontextmenu:

5. Context Menu
===============

A context menu (right mouse click) can be bound to any *x0-object-type*.

.. note::

    Currently only ``List`` *x0-object-type* are supported, this will change in future releases.

5.1. Global Attributes
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

5.2. Implemented Methods
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

5.3. Edit Attributes
********************

.. table:: Context Menu Item "Edit" Attributes
	:widths: 30 20 100

	+---------------------+----------------------+-------------------------------------------------+
	| **Method**          | **Type**             | **Description**                                 |
	+=====================+======================+=================================================+
	| DstScreenID         | ScreenID-String      | Destination ScreenID Reference                  |
	+---------------------+----------------------+-------------------------------------------------+
	| RowColumn           | RowID-String         | Table Row Colun Reference                       |
	+---------------------+----------------------+-------------------------------------------------+
	| FireEvents          |  Array               | Array of EventIDs                               |
	+---------------------+----------------------+-------------------------------------------------+
