#!/bin/sh

# set calling url used for testing
export TEST_URL="x0-app.kicker-finder.de"

# set remote webdriver url
export REMOTE_WEBDRIVER_URL="chromium.gitlab-ci.local"

# start pytest
pytest-3
