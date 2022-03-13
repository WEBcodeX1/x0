#!/bin/sh

while :
do
	inotifywait -r /var/www/vhosts
	chown -R www-data:deploy /var/www/vhosts
	chown -R www-data:deploy /var/www/python
	find /var/www/vhosts -type f -print0 | xargs -0 chmod 460
	find /var/www/vhosts -type d -print0 | xargs -0 chmod 770
	sleep 1
done
