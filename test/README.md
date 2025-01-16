# Framework Tests

## 1. Unit Testing

Currently no unit tests exist, integration tests are sufficient to guarantee proper
system functionality.

## 2. Integration Tests

Integration tests ensure functionality of all framework features especially on
*x0 base system* changes.

The following logical test groups are implemented:

* Base Objects Default Parameters
* Base Objects Dynamic Parameters
* Base Objects Interactions

## 3. Docker Test Run

Local docker test run depends on running selenium server(s).

1. Execute `python3 run-selenium-server.py` to start selenium container
2. Execute `../docker/x0-start-containers.sh` to start `x0-app` and `x0-db` containers
3. Execute `run-test-container.sh` to finally start test run

## 4. Kubernetes Test Run

Kubernetes test run is implemented in minikube environment.
See [../kubernetes/MINIKUBE.md](../kubernetes/MINIKUBE.md).

## 5. Environment Variables

Set `TEST_HTTPS_ONLY` Environment Variable to 1 `--env TEST_HTTPS_ONLY=1` to
run all test vhost-URLs with https:// prefix.

## 6. Test-Implementation

Test implementation specifications are documented in *x0 developer documentation*  `/doc`.
