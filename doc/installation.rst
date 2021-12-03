.. installation

Installation
============

Prerequisites
-------------

* python3
* python3-psycopg2
* apache2
* apache2-wsgi
* postgresql-12

Webserver Config
----------------

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


Debian Package
--------------

Building
********

First generate a GPG Signing Key used for every Package generation.

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

Installation on a Debian 10/11 System works like this:

.. code-block:: bash

	# install package
	sudo dpkg --install [.deb file]
