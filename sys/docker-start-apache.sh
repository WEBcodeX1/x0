#!/bin/sh

LOG_ACCESS_FILE="/var/log/apache2/x0.access.log"
LOG_ERROR_FILE="/var/log/apache2/x0.error.log"

touch ${LOG_ACCESS_FILE}
touch ${LOG_ERROR_FILE}

ln -sf /dev/stdout ${LOG_ACCESS_FILE}
ln -sf /dev/stderr ${LOG_ERROR_FILE}

/usr/sbin/apache2ctl -D FOREGROUND