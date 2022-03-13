#!/bin/sh

LOCAL_CONFIG="./deployment.cfg"
. ${LOCAL_CONFIG}

PERMISSION_WWW_USER="www-data"
PERMISSION_GLOBAL_GROUP="deploy"
PERMISSION_GLOBAL_GROUP_ID="1001"
PERMISSION_CHMOD_DIR="770"
PERMISSION_CHMOD_FILE="460"

LOCAL_REPO_PATH="./"

if [ ${SERVER_DEPLOYMENT} -eq 1 ]; then
	LOCAL_REPO_PATH="/tmp/x0_deployment"
	REMOTE_DEPLOYMENT_PATH="/var/www"
	DATABASE_USER="postgres"
fi

REMOTE_DEPLOYMENT_VHOSTS_PATH="${REMOTE_DEPLOYMENT_PATH}/vhosts"
REMOTE_DEPLOYMENT_VHOST_PATH="${REMOTE_DEPLOYMENT_VHOSTS_PATH}/${REMOTE_VHOST}"

LOCAL_DATABASE_PATH="${LOCAL_REPO_PATH}/database"
LOCAL_DATABASE_UPDATE_PATH="${LOCAL_DATABASE_PATH}/update"
LOCAL_PYTHON_PATH="${LOCAL_REPO_PATH}/python"
LOCAL_WWW_PATH="${LOCAL_REPO_PATH}/www"
LOCAL_WWW_PYTHON_PATH="${LOCAL_WWW_PATH}/python"
LOCAL_WWW_STATIC_PATH="${LOCAL_WWW_PATH}/static"
LOCAL_WWW_X0_TEMPLATE_PATH="${LOCAL_WWW_PATH}/x0/template"

REMOTE_PYTHON_PATH="${REMOTE_DEPLOYMENT_PATH}/python"
REMOTE_WWW_PATH="${REMOTE_DEPLOYMENT_VHOST_PATH}"
REMOTE_WWW_PYTHON_PATH="${REMOTE_DEPLOYMENT_VHOST_PATH}/python"
REMOTE_WWW_STATIC_PATH="${REMOTE_DEPLOYMENT_VHOST_PATH}/static"

# SET BINARIES
BINARY_PSQL=$(which psql)

echo "Init: ${INIT_DATABASE}"

# INIT DATABASE
if [ ${INIT_DATABASE} -eq 1 ]; then
	for file in $(ls -1 ${LOCAL_DATABASE_PATH}/*.sql); do
		if [ ${SERVER_DEPLOYMENT} -eq 0 ]; then
			${BINARY_PSQL} -U ${DATABASE_USER} -h ${DATABASE_HOST} -d ${DATABASE_NAME} -f ${file}
		fi
		if [ ${SERVER_DEPLOYMENT} -eq 1 ]; then
			${BINARY_PSQL} -U ${DATABASE_USER} -d ${DATABASE_NAME} -f ${file}
		fi
	done
fi

# UPDATE DATABASE
for file in $(ls -1 ${LOCAL_DATABASE_UPDATE_PATH}/*.sql); do
	if [ ${SERVER_DEPLOYMENT} -eq 0 ]; then
		${BINARY_PSQL} -U ${DATABASE_USER} -h ${DATABASE_HOST} -d ${DATABASE_NAME} -f ${file}
	fi	
	if [ ${SERVER_DEPLOYMENT} -eq 1 ]; then
		${BINARY_PSQL} -U ${DATABASE_USER} -d ${DATABASE_NAME} -f ${file}
	fi
done

# CREATE REMOTE DIRS IF NOT EXIST
if [ ! -d  ${REMOTE_PYTHON_PATH} ]; then
	mkdir -p ${REMOTE_PYTHON_PATH}
fi

if [ ! -d  ${REMOTE_WWW_PYTHON_PATH} ]; then
	mkdir -p ${REMOTE_WWW_PYTHON_PATH}
fi

if [ ! -d  ${REMOTE_WWW_STATIC_PATH} ]; then
	mkdir -p ${REMOTE_WWW_STATIC_PATH}
fi

# COPY FILES
cp ${LOCAL_PYTHON_PATH}/* ${REMOTE_PYTHON_PATH}/
cp ${LOCAL_WWW_PYTHON_PATH}/* ${REMOTE_WWW_PYTHON_PATH}/
cp ${LOCAL_WWW_STATIC_PATH}/* ${REMOTE_WWW_STATIC_PATH}/
cp ${LOCAL_WWW_X0_TEMPLATE_PATH}/* ${REMOTE_WWW_PATH}/
cp ${LOCAL_WWW_PATH}/*.js ${REMOTE_WWW_PATH}/
cp ${LOCAL_WWW_PATH}/*.html ${REMOTE_WWW_PATH}/

# UPDATE PERMISSIONS
chgrp -R ${PERMISSION_GLOBAL_GROUP_ID} ${REMOTE_DEPLOYMENT_VHOSTS_PATH}
chgrp -R ${PERMISSION_GLOBAL_GROUP_ID} ${REMOTE_PYTHON_PATH}

find ${REMOTE_PYTHON_PATH} -name "*.py" -print0 | xargs -0 chmod ${PERMISSION_CHMOD_FILE}

find ${REMOTE_DEPLOYMENT_VHOST_PATH} -type f -print0 | xargs -0 chmod ${PERMISSION_CHMOD_FILE}
find ${REMOTE_DEPLOYMENT_VHOST_PATH} -type d -print0 | xargs -0 chmod ${PERMISSION_CHMOD_DIR}

chmod ${PERMISSION_CHMOD_DIR} ${REMOTE_PYTHON_PATH}
