.. installation

Installation
============

The following documentation describes installing the x0-js Framework on a standard Debian Linux System.

Package Prerequisites
---------------------

* python3
* python3-psycopg2
* apache2
* apache2-wsgi
* postgresql-12

Debian Package
--------------

You can decide if you install a prebuild package by downloading from our services or to build a debian
package with dpkg-debuild from linux terminal.

Download
********

TODO: add links for source and package

Building
********

For building with `dpkg-buildpackage` you need to install additional packages.

* gpg
* debhelper

After package installation generate a GPG Signing Key used for every Package generation.

.. code-block:: bash

	# generate gpg signing key
	gpg --full-generate-key

Build Package (as linux user).

.. code-block:: bash

	# cd to system root / project dir
	cd ${PROJECT_DIR}

	# build package from project root
	dpkg-buildpackage --sign-key=$KEY_ID

This will generate the Debian .deb and related Package(s) in the filesystem parent folder.

Installation
************

.. note::

	You can specify the vhost domain in "/etc/x0/domain.conf". If this file is non existent,
	the default domain "x0.local" will be inserted.

Install the package with the following commands.

.. code-block:: bash

	# install package
	sudo dpkg --install <x0.deb>

.. note::

	The installer generates a working "Hello World" example which is accesible from
	http://x0.local after you put in /etc/hosts or your local DNS server configuration.

Webserver Config
----------------

If you install by source option, you have to setup a working apache2 configuration and .


Apache2 Vhost Example
*********************

.. code-block:: bash

	<VirtualHost *:443>
		ServerName x0.domain.com
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
