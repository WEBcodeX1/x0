.. intro

1. x0 Framework
===============

1.1. Introduction
-----------------

The **x0 framework** is an **ultra-lightweight**, **serverless** in-browser RTTE
(Real-Time Templating Engine) designed to run **entirely independent** of backend
or server-side code. Built on a **clean, object-oriented** programming (OOP)
foundation, it **drastically minimizes code complexity** by replacing heavy imperative
logic with a **highly efficient declarative metadata** concept.

The framework can be statically loaded from any standard web server, comprising just
66 system and 4 object metadata definition files with a core footprint of only
**356 Kilobytes**. It depends on **Bootstrap** and optionally utilizes **Font Awesome**
for its UI components. Even with a minimalist setup of both libraries, extensive user
metadata, and custom application code, the total deployment size remains under
**4 Megabytes** for a complete client / server architecture. Because the application
renders completely within the client browser, it is perfectly suited for
**resource-constrained** environments like embedded **microcontroller** web interfaces.

An example of an x0-application-driven, browser-controlled multiplayer PONG game
running on an **ESP32-S3** microcontroller using the ESP-IDF framework (with embedded
*MicroPython*) can be found at the
`micropython-as <https://github.com/WEBcodeX1/micropython-as>`_ project.

The *x0-system* is also prepared to integrate with the
`NLAP (Native Lightweight Application Protocol) <https://github.com/WEBcodeX1/http-1.2>`_
Python application server as a high-performance, Apache-independent backend.

**Key Features**:

**Declarative Metadata Concept**: Uses modern declarative configurations to define
application behavior, drastically reducing custom boilerplate code.

**Clean OOP Foundation**: Leverages object-oriented design patterns to minimize
architectural complexity and keep the codebase maintainable.

**Serverless & Independent**: Runs entirely in the browser without depending on a
classic backend stack.

**Ultra-Lightweight Core**: Consists of only 66 system files and 4 metadata files,
totaling just 356 KB.

**Production Footprint < 4 MB**: Includes Bootstrap, Font Awesome, and comprehensive
user application code within less than 4 Megabytes.

**Microcontroller Ready**: Ideal for low-resource embedded web interfaces due to full
client-side rendering.

**Modern UI Foundations**: Built on top of Bootstrap 5.3 with optional, flexible
Font Awesome icon support — without relying on Bootstrap's JavaScript.

**In-Browser RTTE**: Renders and evolves object-driven interfaces directly in the
frontend in real time.

**Composable Object System**: Combines complex objects into reusable, structured
application models using clean OOP abstractions.

**Multi-Language Ready**: Delivers and maps the same underlying object model across
multiple display languages.

Intended Audience: The *x0-system* is designed for developers and organizations seeking
to create advanced, **real-time Single Page Applications** (SPAs). It is particularly
suited for teams prioritizing modular development, robust object-oriented principles,
and efficient cross-object communication, while maintaining lightweight and responsive
design principles. It is also well-suited for embedded and microcontroller web interface
development where resource constraints demand minimal overhead.

1.2. Abstract
-------------

The x0-system is a cutting-edge JavaScript framework designed to simplify the
development of real-time Single Page Applications (SPAs). By leveraging cross-object
communication, responsive design principles, and object-oriented DOM manipulation,
it offers developers a powerful toolset for creating modular, scalable, and highly
interactive web applications. With seamless integration of Bootstrap 5.3 (without
JavaScript dependencies), multi-language support, and deployment solutions like
Docker and Kubernetes, the x0-system is tailored for modern web development needs.

2. Core Features Overview
=========================

2.1. True DOM OOP Templating
----------------------------

The x0-system introduces a powerful feature called **True DOM OOP Templating**, which
enables developers to build dynamic, reusable, and modular user interfaces based on
Object-Oriented Programming (OOP) principles. This feature tightly integrates JavaScript
objects with DOM elements, ensuring a seamless and systematic approach to UI development.

Key Characteristics:

    Strict 1:1 Mapping Between JavaScript Objects and DOM Elements
        Each DOM element (e.g., a DIV) is directly associated with a single JavaScript object instance.
        This association ensures that every DOM element has a corresponding object responsible for its
        behavior and data handling.

    Inheritance and Modularity
        The templating system leverages OOP inheritance, allowing developers to define base objects
        and extend them to create specialized components. This promotes code reuse, reduces duplication,
        and simplifies complex UI designs.

    Real-Time Updates
        The templating system enables objects to update their associated DOM elements in real time.
        For example, calling an object's update() method dynamically modifies the DOM to reflect changes
        without requiring a page reload.

    Event Handling and Propagation
        Objects manage their own event listeners and callbacks, ensuring encapsulated and modular event
        handling. Events can also be redirected or propagated across objects for complex interactions.

    Dynamic Object Composition
        Developers can combine multiple predefined objects into new, custom objects.
        This feature allows for the creation of highly advanced and reusable UI components by chaining
        existing objects together.

    Web Service Integration
        Objects can bind to web services as data sources, enabling dynamic content retrieval and seamless
        integration with backends.

2.2. CSS Grid System
--------------------

The *x0-system* is structured around reusable and modular JavaScript system-objects, which
are the building blocks for creating dynamic and responsive user interfaces. These objects
interact seamlessly with the CSS Grid System, combining functionality and layout in a way
that supports scalability, maintainability, and responsiveness.

Key Features:

    Responsive Design
        The grid system automatically adjusts to different screen sizes, ensuring an
        optimal user experience across desktops, tablets, and smartphones. It uses a
        12-column layout system, allowing developers to define flexible and precise
        layouts.

    Bootstrap Integration
        Built on Bootstrap 5.3's Grid framework, the *x0-system* provides a reliable
        and well-documented foundation for layout design. Developers can take advantage
        of Bootstrap's familiar syntax and responsive breakpoints (e.g., "col-sm-\*",
        "col-md-\*", "col-lg-\*").

    Customizability
        The grid system can be easily extended or overridden with custom CSS styles
        to meet specific design requirements. Developers are free to define their own
        class combinations for unique layouts.

    Device Independence
        The *x0-system* ensures that applications are truly device-independent by providing
        a grid structure that adapts fluidly to the user's device and screen size.

    Future-Proofing
        By adhering to modern web standards and the latest version of Bootstrap, the
        *x0-system's* grid ensures compatibility with future web technologies and frameworks.

2.3. Browser Compatibility
--------------------------

*x0-system* is built in a **generic** way (using ECMA 6 and 7 standards),
enabling it to run natively on all modern browsers, including Firefox, Chrome,
Opera, and Safari.

3. Deployment and Integration
=============================

3.1. Docker Support
-------------------

**Pre-built** Docker images are available to get started with *x0-system* quickly:

.. code-block:: bash

    # pull docker images
    docker pull ghcr.io/webcodex1/x0-app
    docker pull ghcr.io/webcodex1/x0-db
    docker pull ghcr.io/webcodex1/x0-test

See :ref:`installation` for instructions on how to proceed.

3.2. Kubernetes
---------------

*x0-applications* can also be deployed on (load-balanced) Google Kubernetes Engine
(GKE), with native support integrated into the *x0-system*.

For more details, visit: https://github.com/WEBcodeX1/x0/blob/main/kubernetes/README.md.

4. Licensing and Milestones
===========================

4.1. Licensing
--------------

*x0-base-system* is licensed under the Open Source AGPLv3 license.

Certain components, including the WYSIWYG Editor, will be offered as **non-free**.

4.2. Milestones
---------------

For the current milestones, see: https://github.com/WEBcodeX1/x0/milestones.

5. References
=============

5.1. Related Documentation
--------------------------

- Configuration / Application Setup
    :ref:`appdevconfig`
- Css Styling Guide
    :ref:`appdevglobalcss`
- Grid System
    :ref:`appdevgridsystem`
- System Objects and Examples
    :ref:`systemobjects`
- Forms Development
    :ref:`appdevforms`
- Example Development Guidelines
    :ref:`devexamples`
- Developer Documentation (Chapters 20 - 27)
    :ref:`devarchitecture`

5.2. External Resources
-----------------------

- SPA (Single-page application)
    https://developer.mozilla.org/en-US/docs/Glossary/SPA
- Bootstrap 5
    https://getbootstrap.com/
- Font Awesome
    https://fontawesome.com/
- micropython-as (x0-driven ESP32-S3 PONG game using MicroPython)
    https://github.com/WEBcodeX1/micropython-as
- NLAP — Native Lightweight Application Protocol (FalconAS Python Application Server)
    https://github.com/WEBcodeX1/http-1.2
