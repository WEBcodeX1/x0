x0 Framework Documentation
==========================

JavaScript Framework for Real-time Single Page Applications

The **x0** (*cross-object*) JavaScript Framework is a modern tool for efficiently building powerful web-browser **real-time SPAs** (Single Page Applications). Built on Bootstrap 5.3 with zero Bootstrap JavaScript dependencies, it offers true DOM OOP templating, cross-object communication, responsive design, and streamlined deployment.

**Key Features:**

- **Zero Bootstrap JavaScript** dependency with Bootstrap 5.3 CSS integration
- **Cross-Object Communication** using JSON for efficient metadata exchange
- **True DOM OOP Templating** with 1:1 JavaScript object to DOM element mapping
- **Responsive Design** with CSS Grid and Bootstrap's grid system
- **Integrated FontAwesome Icons** and modern UI components
- **Streamlined Deployment** with Docker and Kubernetes support

**Quick Start:**

.. code-block:: javascript

    // Example x0 object creation
    let myDiv = new sysObjDiv();
    myDiv.ObjectID = 'myContent';
    myDiv.addObject(childObject);
    myDiv.renderObject();

Getting Started
===============

.. toctree::
   :maxdepth: 2
   :caption: First Steps

   intro
   installation

Application Development
=======================

.. toctree::
   :maxdepth: 2
   :caption: Building Applications

   appdev-config
   appdev-global
   appdev-objects
   appdev-forms
   appdev-backend
   appdev-event-system
   appdev-overlay
   appdev-messaging
   appdev-deployment

Developer Documentation
=======================

.. toctree::
   :maxdepth: 2
   :caption: Advanced Topics

   dev-architecture
   dev-oop-model
   dev-oop-classes
   dev-object-modeling
   dev-backend
   dev-tests
   dev-examples
   dev-porting

Reference
=========

.. toctree::
   :maxdepth: 2
   :caption: Additional Resources

   plugins
   glossary

Indices and tables
==================

* :ref:`genindex`
* :ref:`modindex`
* :ref:`search`
