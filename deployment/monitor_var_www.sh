#!/bin/sh

while :
do
	inotifywait -r /var/www
	chown -R www-data:deploy /var/www/python
	chmod 770 /var/www/python
	find /var/www/python -type f -print0 | xargs -0 chmod 460
	chown -R www-data:deploy /var/www/vhosts
	find /var/www/vhosts -type f -print0 | xargs -0 chmod 460
	find /var/www/vhosts -type d -print0 | xargs -0 chmod 770
	sleep 1
done
