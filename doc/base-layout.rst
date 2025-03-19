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

.. code-block:: javascript
	:linenos:

	{
		"project": {
			"name": "spx-aom-portal",
			"id": "aom-portal"
		},
		"installer": {
			"type": "x0"
		},
		"database": {
			"name": "aomportal",
			"su_password": "changeme",
			"repl_password": "changeme",
			"size": "1Gi"
		},
		"env_list": [ "test", "prod" ],
		"environments": {
			"test": {
				"kubernetes": {
					"deployment": {
						"image": "clauspruefer/aom-portal",
						"replicas": 2,
						"cpu": "300m",
						"memory": "1048Mi",
						"autoscale": false
					},
					"namespace": "aom-portal-test",
					"app_templates": [ "kubegres" ]
				}
			},
			"prod": {
				"kubernetes": {
					"deployment": {
						"image": "clauspruefer/aom-portal",
						"replicas": 3,
						"cpu": "500m",
						"memory": "2048Mi",
						"autoscale": false
					},
					"namespace": "aom-portal-prod",
					"app_templates": [ "kubegres" ]
				}
			}
		},
		"vhosts": {
			"aom-portal": {
				"apps": [ "calculator", "legitimation" ],
				"env": {
					"test": {
						"dns": "aom-portal-test.kicker-finder.de",
						"ip": {
							"v4": {
								"dns_register": true,
								"dns_register_type": "openstack"
							}
						},
						"tls": {
							"certbot": {
								"generate": true,
								"admin_mail": "verwaltung@click-it.online"
							}
						}
					},
					"prod": {
						"dns": "aom-portal-prod.kicker-finder.de",
						"ip": {
							"v4": {
								"dns_register": true,
								"dns_register_type": "openstack"
							}
						},
						"tls": {
							"certbot": {
								"generate": true,
								"admin_mail": "verwaltung@click-it.online"
							},
							"certs_future": {
								"ca-cert": "aom-portal.CA.crt.pem",
								"cert": "aom-portal.Server.crt.pem",
								"key": "aom-portal.privkey.nopass.pem"
							}
						}
					}
				},
				"loadbalancer": {
					"ref": "ingress-aom-portal",
					"paths": [ "/" ]
				}
			}
		}
	}

3.3.2 Multi Vhost Example
-------------------------

The following configuration deploys a multi Vhost application (3 LoadBalancer) to Kubernetes Cluster.

#TODO: replace with "generic" configuration.

.. code-block:: javascript
	:linenos:

	{
		"project": {
			"name": "spx-comserver",
			"id": "spx-comserver"
		},
		"installer": {
			"type": "debian-package"
		},
		"database": {
			"name": "spx-comserver",
			"su_password": "changeme",
			"repl_password": "changeme",
			"size": "6Gi"
		},
		"env_list": [ "test", "prod" ],
		"environment": "test",
		"environments": {
			"test": {
				"kubernetes": {
					"deployment": {
						"image": "clauspruefer/x0-app",
						"replicas": 2,
						"cpu": "200m",
						"memory": "1048Mi",
						"autoscale": false
					},
					"namespace": "spx-test",
					"app_templates": [ "kubegres" ]
				}
			},
			"prod": {
				"kubernetes": {
					"deployment": {
						"image": "clauspruefer/x0-app",
						"replicas": 4,
						"cpu": "500m",
						"memory": "2048Mi",
						"autoscale": {
							"min": 3,
							"max": 6
						}
					},
					"namespace": "spx-prod",
					"app_templates": [ "kubegres" ]
				}
			}
		},
		"vhosts": {
			"spx-scanapp": {
				"apps": [ "scanapp" ],
				"env": {
					"test": {
						"dns": "scanapp-test.kicker-finder.de",
						"dns_old": "scanapp.spx-test.webcodex.de",
						"ip": {
							"v4": {
								"dns_register": true,
								"dns_register_type": "openstack",
								"old": "213.183.85.167"
							}
						},
						"tls": {
							"certs": {
								"ca-cert": "ca.scanapp.spx-test.webcodex.de.CA.crt.pem",
								"cert": "scanapp.spx-test.webcodex.de.Server.crt.pem",
								"key": "scanapp.spx-test.webcodex.de.Server.key.unencrypted.pem"
							},
							"verify-client-certs": "require"
						}
					},
					"prod": {
						"dns": "scanapp-prod.kicker-finder.de",
						"dns_old": "scanapp.spx-prod.webcodex.de",
						"ip": {
							"v4": {
								"dns_register": true,
								"dns_register_type": "openstack",
								"old": "213.183.85.169"
							}
						},
						"tls": {
							"certs": {
								"ca-cert": "ca.scanapp.spx-prod.webcodex.de.CA.crt.pem",
								"cert": "scanapp.spx-prod.webcodex.de.Server.crt.pem",
								"key": "scanapp.spx-prod.webcodex.de.Server.key.unencrypted.pem"
							},
							"verify-client-certs": "require"
						}
					}
				},
				"loadbalancer": {
					"ref": "ingress-scanapp",
					"paths": [ "/" ]
				}
			},
			"spx-webui": {
				"apps": [ "webui" ],
				"env": {
					"test": {
						"dns": "webui-test.kicker-finder.de",
						"dns_old": "webui.spx-test.webcodex.de",
						"ip": {
							"v4": {
								"dns_register": true,
								"dns_register_type": "openstack",
								"old": "213.183.85.167"
							}
						},
						"tls": {
							"certs": {
								"ca-cert": "ca.webui.spx-test.webcodex.de.CA.crt.pem",
								"cert": "webui.spx-test.webcodex.de.Server.crt.pem",
								"key": "webui.spx-test.webcodex.de.Server.key.unencrypted.pem"
							},
							"verify-client-certs": "require"
						}
					},
					"prod": {
						"dns": "webui-prod.kicker-finder.de",
						"dns_old": "webui.spx-prod.webcodex.de",
						"ip": {
							"v4": {
								"dns_register": true,
								"dns_register_type": "openstack",
								"old": "213.183.85.169"
							}
						},
						"tls": {
							"certs": {
								"ca-cert": "ca.webui.spx-prod.webcodex.de.CA.crt.pem",
								"cert": "webui.spx-prod.webcodex.de.Server.crt.pem",
								"key": "webui.spx-prod.webcodex.de.Server.key.unencrypted.pem"
							},
							"verify-client-certs": "require"
						}
					}
				},
				"loadbalancer": {
					"ref": "ingress-webui",
					"paths": [ "/" ]
				}
			},
			"spx-vgp": {
				"env": {
					"test": {
						"dns": "vgp-test.kicker-finder.de",
						"dns_old": "vgp.spx-test.webcodex.de",
						"ip": {
							"v4": {
								"dns_register": true,
								"dns_register_type": "openstack",
								"old": "213.183.85.168"
							}
						},
						"tls": {
							"certs": {
								"ca-cert": "ca.vgp.spx-test.webcodex.de.CA.crt.pem",
								"cert": "vgp.spx-test.webcodex.de.Server.crt.pem",
								"key": "vgp.spx-test.webcodex.de.Server.key.unencrypted.pem"
							},
							"verify-client-certs": "require"
						}
					},
					"prod": {
						"dns": "vgp-prod.kicker-finder.de",
						"dns_old": "vgp.spx-prod.webcodex.de",
						"ip": {
							"v4": {
								"dns_register": true,
								"dns_register_type": "openstack",
								"old": "213.183.85.170"
							}
						},
						"tls": {
							"certs": {
								"ca-cert": "ca.vgp.spx-prod.webcodex.de.CA.crt.pem",
								"cert": "vgp.spx-prod.webcodex.de.Server.crt.pem",
								"key": "vgp.spx-prod.webcodex.de.Server.key.unencrypted.pem"
							},
							"verify-client-certs": "require"
						}
					}
				},
				"loadbalancer": {
					"ref": "ingress-vgp",
					"paths": [ "/" ],
					"rewrite": {
						"/VGPNotifyOutgoing": "/VGPNotifyOutgoing.py",
						"VGPNotifyULDeliveryRequest": "/VGPNotifyULDeliveryRequest.py",
						"/VGPInventor": "/VGPInventory.py",
						"/VGPNotifyULIncomingRetour": "/VGPNotifyUnileverIncomingRetour.py"
					}
				}
			},
			"spx-xmlparser": {
				"kubernetes-service": false
			},
			"local-test": {
				"kubernetes-service": false
			}
		}
	}

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
