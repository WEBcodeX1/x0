#!/bin/bash

if [[ -n "${UBUNTU_MIRROR_DNS}" ]] && [[ -n "${UBUNTU_MIRROR_IP}" ]]; then
	echo "Ubuntu Mirror IP:${UBUNTU_MIRROR_IP}"
	echo "Ubuntu Mirror DNS:${UBUNTU_MIRROR_DNS}"
	CMDLINE_ADD_HOST="--add-host=${UBUNTU_MIRROR_DNS}:${UBUNTU_MIRROR_IP}"
fi

BASE_COPY_DIR="./apt-config"

if [[ -n "${UBUNTU_MIRROR_DNS}" ]] && [[ -n "${UBUNTU_MIRROR_IP}" ]]; then
	cp ${BASE_COPY_DIR}/apt-sources-local.list ./tmp/apt-sources.list
else
	cp ${BASE_COPY_DIR}/apt-sources.list ./tmp/apt-sources.list
fi

x0_pwd=$(python3 ./scripts/get-pg-pass.py x0)
su_pwd=$(python3 ./scripts/get-pg-pass.py su)

echo '#!/bin/sh' > ./tmp/environment-db.sh
echo "export PSQL_x0_PWD='${x0_pwd}'" >> ./tmp/environment-db.sh
echo "export PSQL_ROOT_PWD='${su_pwd}'" >> ./tmp/environment-db.sh

echo '#!/bin/sh' > ./tmp/environment-app.sh
echo "export PSQL_x0_PWD='${x0_pwd}'" >> ./tmp/environment-app.sh
