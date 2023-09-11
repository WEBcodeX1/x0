#!/bin/sh

APP_SETUP_DIR="/var/lib/x0/app-setup/bin/"
CMD_PARAMETERS="x0 mypostgres"

cd ${APP_SETUP_DIR}

./create-sys-db.sh ${CMD_PARAMETERS}
./init-app-db.sh ${CMD_PARAMETERS}
./db-tests-examples.sh ${CMD_PARAMETERS}
