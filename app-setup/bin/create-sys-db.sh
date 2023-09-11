#!/bin/sh

# source environment
. /environment.sh

# set default values
[ ! -z "$1" ] && DB_NAME=$1 || DB_NAME="x0"
[ ! -z "$2" ] && DB_HOST="-h $2" || DB_HOST=""

BASEDIR="/var/lib/x0"
DBDIR="${BASEDIR}/database"

cp ${DBDIR}/01-create-database.sql /tmp/01-create-database.sql
cp ${DBDIR}/02-x0-sys-DB.sql /tmp/02-x0-sys-DB.sql

sed -i "s/\${SYS_DATABASE}/${DB_NAME}/g" /tmp/01-create-database.sql
sed -i "s/\${SYS_DATABASE}/${DB_NAME}/g" /tmp/02-x0-sys-DB.sql
sed -i "s/\${SYS_x0_PWD}/${PSQL_x0_PWD}/g" /tmp/02-x0-sys-DB.sql

PGPASSWORD=${PSQL_ROOT_PWD} psql -U postgres ${DB_HOST} -f /tmp/01-create-database.sql
PGPASSWORD=${PSQL_ROOT_PWD} psql -U postgres ${DB_HOST} -f /tmp/02-x0-sys-DB.sql
PGPASSWORD=${PSQL_ROOT_PWD} psql -U postgres ${DB_HOST} -d ${DB_NAME} -f ${BASEDIR}/database/03-insert-sys-config.sql
PGPASSWORD=${PSQL_ROOT_PWD} psql -U postgres ${DB_HOST} -d ${DB_NAME} -f ${BASEDIR}/database/04-sys-text.sql
