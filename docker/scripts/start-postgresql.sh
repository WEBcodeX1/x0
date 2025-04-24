#/bin/sh

chown -R postgres:postgres /var/lib/postgresql/16/main/
chown -R postgres:postgres /var/run/postgresql/

su -c "/usr/lib/postgresql/16/bin/postgres -D /var/lib/postgresql/16/main" postgres
