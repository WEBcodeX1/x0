.. enhanced-formating

Enhanced Formating Techniques
=============================

Some Object Types offer extended Formating Properties. Actually the following Object-Types are supported:

* List
* FormfieldList

This Technique replaces Table Row/Colspan with a simple mechanism without loosing functionality.

List
----

The following Examples (Bootstrap Table Styles) will show you how to use correctly.

Example 1
*********

.. code-block:: javascript

	"CellGroupRowStyle": "Style1 Style2",
	"RowAfterElements": [ 2, 4 ]
	"ElementsEnclosedByDivStyle": [
		"col-md-5",
		"col-md-7",
		"col-md2",
		"col-md3",
		"col-md3",
		"col-md5"
	]

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

FormfieldList
-------------

Same rendering takes place with slightly modified Property Naming.

Example 1
*********

.. code-block:: javascript

	"CellGroupColumns": [ 2, 4 ],
	"CellGroupStyle": "row",
	"FormfieldEnclosedByDivStyle": [
		"col-md-5",
		"col-md-7",
		"col-md2",
		"col-md3",
		"col-md3",
		"col-md5"
	]

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
