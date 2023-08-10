#/bin/sh

chown -R postgres:postgres /var/lib/postgresql/14/main/
chown -R postgres:postgres /var/run/postgresql/

su -c "/usr/lib/postgresql/14/bin/postgres -D /var/lib/postgresql/14/main" postgres
