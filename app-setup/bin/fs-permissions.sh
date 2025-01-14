#!/bin/sh

chmod 550 /var/www/vhosts
chmod 550 /var/www/python

find /var/www/python -type f -print0 | xargs -0 chmod 460
find /var/www/vhosts -type f -print0 | xargs -0 chmod 460
find /var/www/vhosts -type d -print0 | xargs -0 chmod 550

chown -R www-data:root /var/www/vhosts
chown -R www-data:root /var/www/python
