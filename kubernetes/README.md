# Kubernetes Installation Instructions

The *x0-system* ships **kubernetes-ready**.

>[!NOTE]
> Per default the installer will set up a *Minikube* system on *Linux* using the *docker* driver.

## 1. Quick Start / Minikube

```bash
# install dependencies
apt-get -y install curl
```

```bash
# change to setup dir
cd ./setup/

# start installer
python3 Setup.py
```

The configuration (JSON) is taken from `../config/app-config.json`.

Prerequisites:

- Non root user inside sudo group
- A running local Docker setup

>[!NOTE]
> Some installation steps require root (sudo) access (prompted).

## 2. Production Cluster Differences

1. *x0 minikube* setup lacks enhanced Role Base Access Control functionality /
enhanced private *Docker Registry* integration (e.g. GitLab).

>[!NOTE]
> *x0 kube installer* is able to manage RBAC / deployment tokens in a GKE
> production environment. Documentation to setup a Ubuntu Linux Virtual Machine
> (non-graphical multi-user environment) to handle cluster management / auth
> tokens in a secure manner can be found here:
> [./vm/management/README.md](./vm/management/README.md).

2. The minikube setup is not able to manage "external" DNS automatically.

>[!NOTE]
> The *x0 kube installer* is able to interact with OpenStack DNS management
> and handles external IP setup and DNS mapping automatically. This does only
> work in kubernetes clusters which rely on *OpenStack Designate*.

3. Ingress Load-Balancing only works with shipped ingress-nginx

>[!NOTE]
> For simplicity the *x0 minikube* addons *ingress* and *ingress-dns* are
> enabled. Concrete: only "ingressClassName: nginx" (1 single loadbalancer instance)
> is usable. *x0 kube installer feature* "Load Balancer Groups" does **not**
> work correctly (multiple lb_groups / instances) with minikube setup.

## 3. Dependencies

To be closest to a production setup, all dependend kubernetes docker images
(including CI tests) will be integrated into minikube environment.

*x0 minikube* depends on the following Docker images.

- Kubegres v1.19
- Postgres v14
- Ingress-NGINX v1.8.0
- Selenium Browser Test Framework v131.0

*x0 minikube* depends on the following Windows installations.

- Python for Windows (mandatory)<br>
  https://www.python.org/downloads/windows/
- Kubernetes Kubectl Tool (mandatory)<br>
  https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/
- Git for Windows 64bit (mandatory)<br>
  https://git-scm.com/downloads/win
- Windows curl (included in Git for Windows)

## 4. Kubegres

Kubegres is a simple, easy to configure kubernetes postgresql binary
replication implementation. It replicates to x configurable replica pods.

*x0 system* ships with an included *read-loadbalacing* Python Application
Server component.

>[!NOTE]
> Write safety is guaranteed trough kubernetes replica monitoring. If a master
> node dies, a new master will be elected, always addressable via "mypostgres"
> host / name, transparent for the application.

http://www.kubegres.io

## 5. Selenium

Selenium *currently* is used by *x0* for Browser Unit- and Integration-Tests.

To use it transparently in Native, Docker and Kubernetes environments Selenium
standalone-chrome container(s) in combination with Remote WebDriver are used.

http://www.selenium.dev

## 6. Post Installation

Check the following.

### 6.1. Namespaces

Get all existing namespaces.

```bash
# get namespaces
kubectl get namespace -o wide
```

Check, if the following namespaces, especially "x0-app" exists.

| NAME                | STATUS              |
| ------------------- | ------------------- |
| <img width="700px"> | <img width="320px"> |
| ingress-nginx       | Active              |
| kube-node-lease     | Active              |
| kube-public         | Active              |
| kube-system         | Active              |
| kubegres-system     | Active              |
| x0-app              | Active              |

### 6.2. Pods

Get all existing pods from namespace "x0-app".

```bash
# get pods
kubectl get pods -n x0-app
```

Check if the following pods exist, especially "READY" and "STATUS".
Also an internal IPv4 address must be assigned.

| NAME                   | READY                | STATUS               | IP                   |
| ---------------------- | -------------------- | -------------------- | -------------------- |
| <img width="420px">    | <img width="200px">  | <img width="200px">  | <img width="200px">  |
| mypostgres-1-0         | 1/1                  | Running              | 10.244.x.x           |
| selenium-server-0      | 1/1                  | Running              | 10.244.x.x           |
| x0-test-db-install     | 0/1                  | Completed            | 10.244.x.x           |
| x0-test-deployment-... | 1/1                  | Running              | 10.244.x.x           |
| x0-test-test-run       | 0/1                  | Completed            | 10.244.x.x           |

### 6.3. Service

Get all services from namespace "x0-app".

```bash
# get service
kubectl get service -o wide -n x0-app
```

Check if the following services exist.

| NAME                   | TYPE                 | CLUSTER-IP           | PORT(S)              |
| ---------------------- | -------------------- | -------------------- | -------------------- |
| <img width="420px">    | <img width="200px">  | <img width="200px">  | <img width="200px">  |
| mypostgres             | ClusterIP            | None                 | 5432/TCP             |
| selenium-server-0      | ClusterIP            | 10.103.x.x           | 4444/TCP             |
| x0-x0-app-test-svc     | ClusterIP            | 10.104.x.x           | 80/TCP               |

### 6.4. Endpoints

Get all endpoints from namespace "x0-app".

```bash
# get endpoints
kubectl get endpoints -o wide -n x0-app
```

Check if the following endpoints exist and the IP-mapping to pods is correct.

| NAME                | ENDPOINTS            |
| ------------------- | -------------------- |
| <img width="700px"> | <img width="320px">  |
| mypostgres          | 10.244.x.x:5432      |
| selenium-server-0   | 10.244.x.x:4444      |
| x0-x0-app-test-svc  | 10.244.x.x:80        |

### 6.5. Ingress

Get ingress from namespace "x0-app".

```bash
# get ingress
kubectl get ingress -o wide -n x0-app
```

Check if the following ingress exists (IP addresses / subnets may differ).

| NAME                            | CLASS                | HOSTS                | ADDRESS              |
| ------------------------------- | -------------------- | -------------------- | -------------------- |
| <img width="420px">             | <img width="200px">  | <img width="200px">  | <img width="200px">  |
| x0-x0-app-test-minikube-ingress | nginx                | x0-app.x0.localnet   | 172.17.84.42         |

### 6.6. DNS

Get the Hypervisor Host IP.

```bash
# get external ip address
minikube ip
```

Now add a host entry to the hosts file or add an A record to your local DNS server.

`192.168.200.128  x0-app.x0.localnet`

Open the following URL in local browser, this should display a simple "Hello World!" text.

`http://x0-app.x0.localnet/python/Index.py`

Also check the following test(s) and example(s).

`http://x0-app.x0.localnet/python/Index.py?appid=example1`<br>
`http://x0-app.x0.localnet/python/Index.py?appid=example4`<br>
`http://x0-app.x0.localnet/python/Index.py?appid=test_base`

### 8.7. Tests

To be 100% sure everything is working correctly, check the test-pods output.

```bash
# get test pods logs
kubectl logs x0-test-test-run -o wide -n x0-app
```

The last lines should look like this.

```bash
------------------ generated xml file: /tmp/pytest-junit.xml -------------------
======================== 51 passed in 81.53s (0:01:21) =========================
```
