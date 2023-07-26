# Framework Tests

## Unit Testing

There will be **no** focus on Unit Testing. Integration Tests roughly rationalise Unit Testing completely in our case.
Furthermore no suitable JavaScript Unit Testing Framework has been selected. For these reasons mentioned we ommit Unit Testing to begin completely.

## Integration Tests

Integration Tests should ensure functionality of all framework features especially on Base System changes.

The following logical Test Groups will be implemented:

* Base Objects Default Parameters (Browser DOM Existence)
* Base Objects Dynamic Parameters (Object Variants)
* Base Objects Clickable Interactions
* Object to Object Interactions

## Test Types

Two Test Types exist:

1. Local Docker Test which starts up the necessary Docker Containers (x0-app and x0-db).
2. Kubernetes Tests in already deployed Kubernetes Environment.

## Run Tests

Execute **./run-tests-docker.sh** to start local testing.

Execute **./run-tests.sh** to start testing in kubernetes environment (deployed).
