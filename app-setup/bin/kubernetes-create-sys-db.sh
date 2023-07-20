#!/bin/sh

# set default values
[ ! -z "$1" ] && DB_NAME=$1 || DB_NAME="x0"
[ ! -z "$2" ] && DB_HOST="-h $2" || DB_HOST="127.0.0.1"
[ ! -z "$3" ] && DB_PASS="-h $3" || DB_PASS="changeme"

#echo "DB:${DB_NAME} HOST:${DB_HOST}"

/var/lib/x0/app-setup/bin/create-sys-db.sh ${DB_NAME} ${DB_HOST} ${DB_PASS}
