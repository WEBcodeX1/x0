#!/bin/sh

VHOST_DIR="$1"

# system vars
WEBSERVERDIR="/var/www/vhosts"
x0DIR="${WEBSERVERDIR}/x0"

# copy x0 base system to vhost dir
cp -Ra ${x0DIR}/*.js ${WEBSERVERDIR}/${VHOST_DIR}/

# copy x0 base python scripts
cp -Ra ${x0DIR}/python/*.py ${WEBSERVERDIR}/${VHOST_DIR}/python/
