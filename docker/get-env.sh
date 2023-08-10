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
