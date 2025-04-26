.. modules

.. _devplugins:

28. Plugins
===========

28.1. WordPress
---------------

The WordPress plugin in ``/modules/wordpress`` provides integrations for user registration and login events,
enabling communication between WordPress and *x0-system*. Below is an overview of the concept:

- Key Components:

    * Ultimate Member Post Registration Plugin (um-postreg.php):
        - Purpose: Hooks into the user registration process via the um_registration_complete action.
        - Functionality:
            1. Collects user information (e.g., ID, roles, login details).
            2. Sends an HTTP POST request to an external service (UserRegister.py) using cURL.
            3. The request includes data formatted as JSON and contains an authentication key.
        - External Service: The external service (UserRegister.py) processes the registration data and inserts it into a database table (wpuser).

    * Ultimate Member Post Login Plugin (um-postlogin.php):
        - Purpose: Hooks into the user login process via the set_logged_in_cookie action.
        - Functionality:
            1. Captures user ID and session details.
            2. Sends an HTTP POST request to an external service (UserLogin.py) using cURL.
            3. Updates the user's session data in the database.

    * Database Integration (wp_user.sql):
        - Defines a wpuser table to store user metadata, including user_login, registration_time, login_time, and session_id.
        - Provides constraints and relationships with other tables (e.g., crm.address).

    * External Python Endpoints:
        - UserRegister.py:
            1. Validates authentication keys.
            2. Inserts user registration data into the wpuser table, assigning roles based on the user's administrator status.
        - UserLogin.py:
            1. Updates the login_time and session_id fields in the wpuser table when users log in.

    * JavaScript Utilities (helper-head.js):
        - Handles cross-origin communication via postMessage.
        - Supports tasks like scrolling to the top or resizing iframes based on messages received from trusted origins.

- Workflow:

    1. During registration or login, the respective plugin captures event data and sends it to external endpoints.
    2. Authentication keys ensure secure communication between WordPress and the external services.
    3. The external Python services interact with the database, storing or updating user data in the wpuser table.
    4. JavaScript utilities handle dynamic user interface adjustments, such as iframe resizing.

This setup enables seamless integration between WordPress and *x0-system*, enhancing data management and
user experience.
