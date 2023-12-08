# Framework Tests

## Unit Testing

There will be **no** focus on Unit Testing. Integration Tests roughly rationalise Unit Testing completely for all use-cases. Furthermore no suitable JavaScript Unit Testing Framework is currently available on the market.

For these reasons mentioned we ommit Unit Testing completely to boost development speed.

## Integration Tests

Integration Tests should ensure functionality of all framework features especially on Base System changes.

The following logical Test Groups will be implemented:

* Base Objects Default Parameters (Browser DOM Existence)
* Base Objects Dynamic Parameters (Object Variants)
* Base Objects Clickable Interactions
* Object to Object Interactions

## Test Types

The following test-types exist:

1. Local Docker Test, starts `x0-app`, `x0-db` `selenium-server-0` and `x0-test` docker container(s), pytest-3 is run inside `x0-test` container
2. Run inside Kubernetes app namespace(s), docker container from 1) will be started in Test-Pod with `HostAliases` set

## Run Tests

Execute **`./run-test-container.sh`** to start 1) local test containers.

## Kubernetes Tests

Test runners are under development currently.

## Environment Variables

Set "`TEST_HTTPS_ONLY`" Environment Variable to 1 (`--env TEST_HTTPS_ONLY=1`) to run all test Vhost-URLs with https:// prefix.
