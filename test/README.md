# Framework Tests

## 1. Unit Testing

## 2. Integration Tests

Integration Tests ensure functionality of all framework features especially on Base System changes.

The following logical Test Groups are implemented:

* Base Objects Default Parameters
* Base Objects Dynamic Parameters
* Base Objects Interactions

## 3. Test Types

The following test-types exist:

1. Local Docker Test, starts `x0-app`, `x0-db` `selenium-server-0` and `x0-test` docker container(s), pytest-3 is run inside `x0-test` container
2. Run inside Kubernetes app namespace(s), docker container from 1) will be started in Test-Pod with `HostAliases` set

## 4. Run Tests

Execute **`./run-test-container.sh`** to start 1) local test containers.

## 5. Kubernetes Tests

Test runners are under development currently.

## 6. Environment Variables

Set "`TEST_HTTPS_ONLY`" Environment Variable to 1 (`--env TEST_HTTPS_ONLY=1`) to run all test Vhost-URLs with https:// prefix.

Environment Variale "`RUN_NAMESPACE`" is internally used by Kubbernetes-Installer to automatically refer (pass to Pod) the correct Kubernetes-Namespace.

## 8. Test-Processing

Detailed Test-Processing / Workflows (including `app-config.json` / Vhosts), see Developer-Documentation in `/doc`.

## 7. Test-Implementation

To implement own tests, see Developer-Documentation in `/doc`.
