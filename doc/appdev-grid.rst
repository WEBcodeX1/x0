.. appdev-grid

4. Global Grid System
=====================

Some *x0-object-types* offer global grid formating properties. Currently the
following object types are supported:

* List
* FormfieldList

The *x0-global-grid-system* uses the CSS Grid System / Bootstrap Grid Styles
to replace oldfashioned HTML table rowspan with a simple mechanism without loosing
functionality.

.. note::

    The *x0-global-grid-system* does not provide colspan formating, this can
	be done otherwise by using ObjectContainer or designing own objects
	(see ...).

Example 1
*********

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
	"ColAfterElements": 1

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
