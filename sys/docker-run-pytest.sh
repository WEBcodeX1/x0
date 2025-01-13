#!/bin/sh

TEST_DIR="/var/lib/x0/test"

cd ${TEST_DIR}

pytest-3 --junit-xml=/tmp/pytest-junit.xml --log-file=/tmp/pytest.log
