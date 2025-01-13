#!/bin/sh

APP_SETUP_DIR="/var/lib/x0/app-setup/bin/"

cd ${APP_SETUP_DIR}

CMD_PARAMETERS="$(python3 ./get-pg-database.py) mypostgres"

./create-sys-db.sh ${CMD_PARAMETERS}
./init-app-db.sh ${CMD_PARAMETERS}
./db-tests-examples.sh ${CMD_PARAMETERS}
