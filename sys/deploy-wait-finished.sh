#!/bin/bash

until [ -f /tmp/deploy-finished ]
do
	sleep 1
done
