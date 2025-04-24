#!/bin/bash

until [ -f /tmp/test-finished ]
do
	sleep 1
done
