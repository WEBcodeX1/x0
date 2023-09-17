#!/bin/sh

chmod 550 /var/www/vhosts
chmod 550 /var/www/python

find /var/www/python -type f -print0 | xargs -0 chmod 460
find /var/www/vhosts -type f -print0 | xargs -0 chmod 460
find /var/www/vhosts -type d -print0 | xargs -0 chmod 550

chown -R 33:0 /var/www/vhosts
chown -R 33:0 /var/www/python
