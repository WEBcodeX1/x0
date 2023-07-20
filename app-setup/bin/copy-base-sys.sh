#!/bin/sh

VHOST_DIR="$1"

# system vars
WEBSERVERDIR="/var/www/vhosts"
x0DIR="${WEBSERVERDIR}/x0"

# copy x0 base system to vhost dir
cp -Ra ${x0DIR}/*.js ${WEBSERVERDIR}/${VHOST_DIR}/

# copy x0 base python scripts
cp -Ra ${x0DIR}/python/*.py ${WEBSERVERDIR}/${VHOST_DIR}/python/

# set filesystem permissions
chown -R www-data:www-data /var/www/python
chmod 770 /var/www/python
find /var/www/python -type f -print0 | xargs -0 chmod 460
chown -R www-data:www-data /var/www/vhosts
find /var/www/vhosts -type f -print0 | xargs -0 chmod 460
find /var/www/vhosts -type d -print0 | xargs -0 chmod 770

# reload apache
service apache2 reload
