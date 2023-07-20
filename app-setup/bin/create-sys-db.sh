#!/bin/sh

# set default values
[ ! -z "$1" ] && DB_NAME=$1 || DB_NAME="x0"
[ ! -z "$2" ] && DB_HOST="-h $2" || DB_HOST=""
[ ! -z "$3" ] && DB_PASS="-h $3" || DB_PASS="changeme"

BASEDIR="/var/lib/x0"
DBDIR="${BASEDIR}/database"

cp ${DBDIR}/01-create-database.sql /tmp/01-create-database.sql
cp ${DBDIR}/02-x0-sys-DB.sql /tmp/02-x0-sys-DB.sql

sed -i "s/\${SYS_DATABASE}/${DB_NAME}/g" /tmp/01-create-database.sql
sed -i "s/\${SYS_DATABASE}/${DB_NAME}/g" /tmp/02-x0-sys-DB.sql

PGPASSWORD=${DB_PASS} psql -U postgres ${DB_HOST} -f /tmp/01-create-database.sql
PGPASSWORD=${DB_PASS} psql -U postgres ${DB_HOST} -f /tmp/02-x0-sys-DB.sql
PGPASSWORD=${DB_PASS} psql -U postgres ${DB_HOST} -d ${DB_NAME} -f ${BASEDIR}/database/03-insert-sys-config.sql
PGPASSWORD=${DB_PASS} psql -U postgres ${DB_HOST} -d ${DB_NAME} -f ${BASEDIR}/database/04-sys-text.sql
