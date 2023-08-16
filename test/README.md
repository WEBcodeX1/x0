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

1. Local Docker Test (x0-app, x0-db), pytest-3, chromium and chromedriver must be installed locally
2. Kubernetes Tests in already deployed Kubernetes Environment

In future releases it is planned to run local tests completely in containers.

## Run Tests

Execute **./run-tests-local.sh** to start local testing.

Execute **./run-tests.sh** to start testing in kubernetes "test" environment (realtime kubernetes deployment).
