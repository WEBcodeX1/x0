.. base-layout

.. _appconfiguration:

3. App Configuration / Layout
=============================

3.1 Application Skeleton
------------------------

The following Directory-Structure Skeleton must be met for a working x0-Application setup.

If you checkout the Demo-Application at https://git01.click-it.online/app-skeleton it will be
created automatically.

+------------------------+------------------------------------------------------------------------+
| **Path**               | **Description**                                                        |
+========================+========================================================================+
| | /config              | - Must contain app-config.json for Kubernetes setup                    |
+------------------------+------------------------------------------------------------------------+
| | /database            | - Holds all .sql scripts which will be executed on app-installation    |
+------------------------+------------------------------------------------------------------------+
| | /debian              | - Contains Debian package metadata                                     |
+------------------------+------------------------------------------------------------------------+
| | /docker              | - Docker buildfiles and setup scripts                                  |
+------------------------+------------------------------------------------------------------------+
| | /kubernetes          | - Kubernetes related, workaround installer (without CI)                |
+------------------------+------------------------------------------------------------------------+
| | /python              | - "Global" Apache2 WSGI Python scripts / DB connection params          |
+------------------------+------------------------------------------------------------------------+
| | /www/python          | - Application Pythoin backend scripts                                  |
+------------------------+------------------------------------------------------------------------+
| | /www/static/$appid   | - Static app CSS and x0-Object configuration                           |
+------------------------+------------------------------------------------------------------------+

3.2 Docker
----------

#TODO: add description.

3.3 Kubernetes
--------------

#TODO: add description.

3.3.1 Single Vhost Example
--------------------------

The following configuration deploys a single Vhost application (1 LoadBalancer) to Kubernetes Cluster.

3.3.2 Multi Vhost Example
-------------------------

The following configuration deploys a multi Vhost application (3 LoadBalancer) to Kubernetes Cluster.

#TODO: replace with "generic" configuration.

The given JSON configuration will "render" the Kubernetes-Infrastructure as following.

#TODO: replace with "generic" image.

.. image:: /images/x0-kubernetes-multi-vhost.png
  :alt: Image - x0 Architecture

3.4 Standalone Webserver Config
-------------------------------

If you have installed the x0 debian packages locally, you have to setup apache2 configuration like this:

.. code-block:: bash
	:linenos:

	<VirtualHost *:443>
		ServerName x0.domain.local
		ServerAdmin admin@x0
		DocumentRoot /var/www/vhosts/x0
		LogLevel warn

		SSLEngine on
		SSLCertificateFile /etc/ssl/apache/cert.pem
		SSLCertificateKeyFile /etc/ssl/apache/key.pem
		SSLCertificateChainFile /etc/ssl/apache/ca-chain.pem

		<Directory /var/www/vhosts/x0/python>
			SSLOptions +StdEnvVars
			AddHandler wsgi-script .py
			Options Indexes FollowSymLinks ExecCGI
			AllowOverride None
			Require all granted
		</Directory>

		ErrorLog /var/log/apache2/x0.error.log
		CustomLog /var/log/apache2/x0.access.log combined
	</VirtualHost>
