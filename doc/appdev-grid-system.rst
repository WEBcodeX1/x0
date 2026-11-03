.. appdev-grid-system

.. _appdevgridsystem:

10. Grid System
===============

The **x0-grid-system** is implemented through the `sysGridGenerator` system object,
which is responsible for generating a grid layout by processing source objects
into structured *rows* and *columns*. Rather than being a purely static layout
mechanism confined to a screen's initial load, the grid system is designed for
high-frequency runtime modification: it can be re-invoked at any time to
restructure an already rendered grid in response to changing source data,
enabling real-time UI re-rendering and fluid grid restructuring directly within
the browser client (see "Dynamic Restructuring" :ref:`dynamic-restructuring` below).

10.1. Key Characteristics
*************************

The **x0-grid-system** can be used to render layouts like the one shown in the
following diagram:

.. code-block:: javascript

	+---------------------------------+---------------------------------+
	| Col1                            | Col2                            |
	+---------------------------------+---------------------------------+
	| Col3                                                              |
	+---------------------------------+----------------+----------------+
	| Col4                            | Col5           | Col6           |
	+----------------+----------------+----------------+----------------+
	| Col7           | Col8           | Col9           | Col10          |
	+----------------+----------------+----------------+----------------+

To achieve this easily, the system uses an internal generator that wraps
CSS styles around existing *x0-objects*.

You can utilize Bootstrap grid utility classes, other advanced Bootstrap styles,
or custom styles defined in ``globalstyles.css``. Also note that these styles—not
just grid layouts—can be altered at runtime to provide awesome results.

10.2. Supported Object Types
****************************

Currently the following *x0-object-types* are supporting the *x0-grid* feature:

* List
* FormfieldList

.. warning::

   You should be familiar with Bootstrap CSS / Grid system before continue reading.

10.3. Global JSON Metadata
**************************

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

10.3.1. Input Data
------------------

The *x0-grid-system* processing requires an **Array of Elements** as input data.

.. code-block:: javascript

	[ el1, el2, el3, el4, el5, el6 ... ]

10.3.2. RowStyle / RowAfterElements
-----------------------------------

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
		<el6></el6>
	</div>

10.3.3. ColStyle / ColAfterElements
-----------------------------------

ColAfterElements processing is likewise RowAfterElements processing,
with the difference of generating a **column** container div instead
of a **row** container div.

.. note::
   Note that ColAfterElements default value is ``[1]``, so the container
   div including CSS will be set for each processed element.


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

10.4. Example List
******************

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

.. _dynamic-restructuring:

10.5. Dynamic Restructuring
***************************

While the previous sections describe `sysGridGenerator` as the mechanism used to lay
out a grid during the initial build of a screen, the grid system is **not** limited to
being a static, load-time-only layout tool. Because `sysGridGenerator.generate()` is a
plain, side-effect-free method operating on an in-memory array of source objects, it can
be invoked repeatedly at runtime, allowing an already rendered grid to be torn down and
rebuilt with different row/column styles, enclosure counts or source data at any point
during the application's lifetime.

10.5.1. Empirical Proof
-----------------------

This dynamic restructuring is demonstrated by `sysObjSystemSettingsContainerGrid`,
which can be inspected live in the static reference container under Main Menu →
*Settings* / *Global Settings* → Tab: *Default Settings* → Subsection: *Adjust Grid
/ Column View*.

The Subsection exposes a pulldown offering multiple pre-declared grid
``Variants`` (see ``GridGenerator.Variants`` in the object's JSON metadata), each
defining its own complete set of ``ColStyles`` and ``RowAfterElements``. Selecting a
variant and confirming via the *Update View* button does not merely resize isolated
columns: ``ButtonCallback()`` clears the container's existing ``ChildObjects``,
instantiates a fresh `sysGridGenerator` with the newly selected variant's styles and
enclosure counts, and calls ``rerenderObject()`` on the container — replacing the
*entire* structural row/column layout, for example switching between a 3-column and
a 6-column view, in a single step.

Because this entire sequence — grid regeneration, DOM teardown and re-render — runs
exclusively inside the *x0-core-engine* on the client, the layout metamorphosis
completes with zero added latency and **without issuing any network request or
contacting the backend server**: no XML-RPC call, no page reload, no server-side
template regeneration.

10.5. Systems Integration
*************************

Any *x0-system-object* (including hierarchical ones) can make use of the global grid
formatting routines provided that an array of elements is passed as input data.

Check out the developer documentation to learn how to implement grid formatting
into your custom-designed *x0-objects*.
