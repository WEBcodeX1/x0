#!/bin/sh

# source environment
. /environment.sh

# set default values
[ ! -z "$1" ] && DB_NAME=$1 || DB_NAME="x0"
[ ! -z "$2" ] && DB_HOST="-h $2" || DB_HOST=""

#echo "db:${DB_NAME} host:${DB_HOST}"

# system paths
BASE_DIR="/var/lib/x0"
APP_SETUP_DIR="${BASE_DIR}/app-setup"
APP_DATABASE_DIR="${APP_SETUP_DIR}/database"

# process all sql scripts found in database path
ls ${APP_DATABASE_DIR} | while read sqlfile; do
    echo "Processing sql script:${sqlfile}"
    PGPASSWORD=${PSQL_ROOT_PWD} psql -U postgres -d ${DB_NAME} ${DB_HOST} -f ${APP_DATABASE_DIR}/${sqlfile} > /dev/null 2>/dev/null
done
