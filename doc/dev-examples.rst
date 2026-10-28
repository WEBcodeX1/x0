.. dev-examples

.. _devexamples:

28. Examples
============

The ``example/`` directory contains database-backed application examples.
Current examples are:

* ``add_object_table_column``
* ``basic_menu_screen``
* ``basic_tabcontainer``
* ``bootstrap_rowspan``
* ``copy_paste``
* ``enhanced_form``
* ``list_detail_switch_screen``
* ``list_dyn_radio``
* ``list_objectdata_grid``
* ``multi_tabcontainer``
* ``net_messages``
* ``object_instances``
* ``open_close_container``
* ``screen_overlay``
* ``tree_simple``

Each example directory may contain SQL setup/data files and a ``static/``
directory with ``menu.json``, ``object.json``, and ``skeleton.json``. Compare
the chosen example's files before assuming optional files or backend scripts
are required. The database configuration selects an example's ``app_id`` and
metadata directory; the application is served by ``python/Index.py``.

28.1. Adding an Example
-----------------------

Use an existing example as the template for its feature area. Add only the
metadata and database setup needed by the example, and document its purpose
and prerequisites in a local ``README.md``. Run the application through the
database-backed Docker profile and verify its metadata and services before
submitting it.

The static deployment example is defined separately under ``static/meta/``;
its deployment requirements are described in
:ref:`appdev-static-deployment`.

28.2. Related References
------------------------

* :ref:`object-examples-reference` lists examples related to runtime objects.
* :ref:`appdevforms` describes form behavior and validation.
* :ref:`devtests` describes the integration test suite.
