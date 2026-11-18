.. appdev-grid-system

.. _grid-system:

10. Grid System
===============

The *x0-grid-system* is implemented through the ``sysGridGenerator``
*x0-system-class*, which is responsible for generating a grid layout by
processing source objects into structured *rows* and *columns*. Rather than
being a purely static layout mechanism confined to a screen's initial load,
the grid system is designed for high-frequency runtime modification: it can
be re-invoked at any time to restructure an already rendered grid in response
to changing source data, enabling real-time UI re-rendering and fluid grid
restructuring directly within the browser client
(see :ref:`dynamic-restructuring` below).

10.1. Key Characteristics
*************************

The **x0-grid-system** can be used to render layouts like the one shown in the
following diagram:

.. code-block:: text

   +-----------------------------------------+-----------------------------------------+
   | Col1                                    | Col2                                    |
   +-----------------------------------------+-----------------------------------------+
   | Col3                                                                              |
   +-----------------------------------------+--------------------+--------------------+
   | Col4                                    | Col5               | Col6               |
   +--------------------+--------------------+--------------------+--------------------+
   | Col7               | Col8               | Col9               | Col10              |
   +--------------------+--------------------+--------------------+--------------------+

To achieve this easily, the system uses an internal generator that wraps
CSS styles around existing *x0-objects*.

You can utilize Bootstrap grid utility classes, other advanced Bootstrap styles,
or custom styles defined in ``globalstyles.css``. Also note that these styles—not
just grid layouts—can be altered at runtime to provide awesome results.

10.2. Supported Object Types
****************************

Currently, the following *x0-object-types* are supporting the *x0-grid* feature:

* List
* FormfieldList

.. warning::

   You should be familiar with Bootstrap CSS / Grid system before continuing to read.

10.3. Global JSON Metadata
**************************

If an *x0-object* supports *x0-grid-system* formatting the following properties
can be set inside the object's ``Attributes`` representation.

.. table:: Global Grid Object Properties
   :widths: 20 30 50

   +-------------------+--------------------------+-------------------------------------------------------+
   | **Property**      | **Type**                 | **Description**                                       |
   +===================+==========================+=======================================================+
   | RowStyle          | ``String``/``Array``     | CSS Style Classes used for next Row-Element           |
   +-------------------+--------------------------+-------------------------------------------------------+
   | RowAfterElements  | ``Integer``/``Array``    | Generate Row-Element at next RowAfterElements reached |
   +-------------------+--------------------------+-------------------------------------------------------+
   | ColStyle          | ``String``/``Array``     | CSS Style Classes used for next Col-Element           |
   +-------------------+--------------------------+-------------------------------------------------------+
   | ColAfterElements  | ``Integer``/``Array``    | Generate Col-Element at next ColAfterElements reached |
   +-------------------+--------------------------+-------------------------------------------------------+
   |                   |                          | Optional, Default 1                                   |
   +-------------------+--------------------------+-------------------------------------------------------+

10.3.1. Input Data
------------------

The *x0-grid-system* processing requires an ``Array`` of *x0-object* references as input data.

.. code-block:: javascript

   [
      objref1, objref2, objref3, objref4, objref5, objref6
   ]

10.3.2. RowStyle / RowAfterElements
-----------------------------------

``RowAfterElements`` is definable as a single ``Integer`` or an ``Array`` of ``Integers``.

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

Setting ``"RowAfterElements": [ 1, 2 ]`` (``Array`` type) like this:

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

``ColAfterElements`` processing works just like ``RowAfterElements``
processing, with the difference of generating a **column** container div
instead of a **row** container div.

.. note::

   Note that ColAfterElements default value is ``[1]``, so the container
   div including CSS will be set for each processed element.

.. code-block:: json

   {
      "RowStyle": [ "row fw-bold", "row" ],
      "RowAfterElements": [ 1, 2 ],
      "ColStyle": "col-md-12",
      "ColAfterElements": [ 1, 2 ]
   }

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

.. code-block:: json

   {
      "RowStyle": "row",
      "RowAfterElements": [ 2, 4 ],
      "ColStyle": [
         "col-md-5",
         "col-md-7",
         "col-md-2",
         "col-md-3",
         "col-md-3",
         "col-md-5"
      ]
   }

Without table header the resulting output looks like the following.

.. code-block:: text

   +-----------------------------------------+-----------------------------------------+
   | Col1 (col-md-5)                         | Col2 (col-md-7)                         |
   +--------------------+--------------------+--------------------+--------------------+
   | Col3 (col-md-2)    | Col4 (col-md-3)    | Col5 (col-md-3)    | Col6 (col-md-5)    |
   +--------------------+--------------------+--------------------+--------------------+
   | Col1 (col-md-5)                         | Col2 (col-md-7)                         |
   +--------------------+--------------------+--------------------+--------------------+
   | Col3 (col-md-2)    | Col4 (col-md-3)    | Col5 (col-md-3)    | Col6 (col-md-5)    |
   +--------------------+--------------------+--------------------+--------------------+

.. _dynamic-restructuring:

10.5. Dynamic Restructuring
***************************

While the previous sections describe ``sysGridGenerator`` as the mechanism used to lay
out a grid during the **initial build** of a screen, the grid system is **not** limited
to being a static, load-time-only layout tool. Because ``sysGridGenerator.generate()``
is a plain method operating on an in-memory ``Array`` of source objects, it can be invoked
**repeatedly at runtime**, allowing an already rendered grid to be torn down and rebuilt with
different row/column styles, enclosure counts or source data at any point during the
application's lifetime.

10.5.1. Empirical Proof
-----------------------

An excellent example of this dynamic restructuring can be found in the
**"Default Settings"** tab of the *x0-static* Docker container. Start up
the container, open the application in your browser, and navigate to
**"Main Menu"** / **"Settings / Global Settings"** / **"Default Settings"**
(tab). Under **"Adjust Grid / Column View"**, you can select between two
different layout variants.

The underlying mechanism relies on three key behaviors:

- **Targeted Layout Redraws:** In this section, you can select different grid
  layouts (variants) from a dropdown menu. When you choose a variant and click
  **Update View**, the system leaves the surrounding page intact and only
  clears and redraws the grid view below—for example, switching the modified
  content area from a 3-column to a 6-column layout in a single step.

- **Zero Latency:** Because the entire rendering process executes directly
  within the browser (client-side), the visual update is immediate.

- **Zero Server Overhead:** The application does not reload the page, re-fetch
  templates, or communicate with the backend server. The target content area
  updates on screen without issuing a single network request.

10.6. Systems Integration
*************************

Any *x0-system-object* (including hierarchical ones) can make use of the global grid
formatting routines provided that an ``Array`` of elements is passed as input data.

Check out the developer documentation to learn how to implement grid formatting
into your custom-designed *x0-objects*, starting at :ref:`dev-architecture`.
