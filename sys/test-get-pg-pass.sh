#!/bin/sh

BASEDIR="/var/lib/x0"
DB_SU_PWD=$(${BASEDIR}/sys/get-pg-pass.py su)
echo ${DB_SU_PWD}
