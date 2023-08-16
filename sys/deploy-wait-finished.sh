#!/bin/bash

until [ -f /tmp/deploy-finished ]
do
	sleep 2
done
