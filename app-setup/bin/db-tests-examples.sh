#!/bin/sh

# source environment
. /environment.sh

# set default values
[ ! -z "$1" ] && DB_NAME=$1 || DB_NAME="x0"
[ ! -z "$2" ] && DB_HOST="-h $2" || DB_HOST=""

BASEDIR="/var/lib/x0"

TEST_CONFIG_DIR="${BASEDIR}/test/integration/config"
EXAMPLE_CONFIG_DIR="${BASEDIR}/example"

# process tests (write config to database)
ls ${TEST_CONFIG_DIR} | while read dirname; do
    echo "Processing tests-config (db):${dirname}"
    CONF_SQL_DIR="${TEST_CONFIG_DIR}/${dirname}/sql"
    ls ${CONF_SQL_DIR} | while read sqlfile; do
        PGPASSWORD=${PSQL_ROOT_PWD} psql -U postgres ${DB_HOST} -d ${DB_NAME} -f ${CONF_SQL_DIR}/${sqlfile} > /dev/null 2>/dev/null
    done
done

# process examples (write config to database)
ls ${EXAMPLE_CONFIG_DIR} | while read dirname; do
    echo "Processing examples-config (db):${dirname}"
    CONF_SQL_DIR="${EXAMPLE_CONFIG_DIR}/${dirname}/sql"
    ls ${CONF_SQL_DIR} | while read sqlfile; do
        PGPASSWORD=${PSQL_ROOT_PWD} psql -U postgres ${DB_HOST} -d ${DB_NAME} -f ${CONF_SQL_DIR}/${sqlfile} > /dev/null 2>/dev/null
    done
done
