# Framework Tests

## Unit Testing

There will be **no** focus on Unit Testing. Integration Tests roughly rationalise Unit Testing
completely in our case. Furthermore no suitable JavaScript Unit Testing Framework has been selected.

For these reasons mentioned we ommit Unit Testing to begin completely.

## Integration Tests

Integration Tests should ensure functionality of all framework features especially on Base System changes.

The following logical Test Groups will be implemented:

* Base Objects Default Parameters (Browser DOM Existence)
* Base Objects Dynamic Parameters (Object Variants)
* Base Objects Clickable Interactions
* Object to Object Interactions

## Test Types

The following test-types exist:

1. Local Test (x0-app, x0-db doker container), pytest-3, chromium and chromedriver must be installed locally
2. Local Docker Test (x0-app, x0-db, x0-test and selenium-server docker container) completely running in separated containers
3. Kubernetes (inside temp created pods) Test in already deployed Kubernetes Environment

## Run Tests

Execute **./run-tests-local.sh** to start (1.) local testing (containers will be started as needed).

Execute **./run-tests.sh** simply starts pytest-3 and is is used inside containers for (2.) and (3.).
