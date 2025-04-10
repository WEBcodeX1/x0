# Kubernetes Minikube Installation Instructions

The following installation instructions cover the installation of the
base *x0 system* on a kubernetes minikube cluster including CI / tests.

In short, run the following inside Windows 11 (Professional) Powershell
(with Administrator privileges): system up and running.

```powershell
# enable windows hyper-v feature
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

Answer "Y"(es) to reboot. Afterwards Hyper-V is operational.

>[!NOTE]
> Install Git for Windows 64bit before you continue, it contains `curl` binary
> which is used / referenced by Setup.py

>[!NOTE]
> Also install the remaining dependencies (see 3. Dependencies).

```powershell
# clone repository and start setup
git clone https://github.com/WEBcodeX1/x0.git
cd .\x0\kubernetes\setup\
python Setup.py
```

>[!NOTE]
> Add `x0-app.x0.localnet` to host DNS, access `http://x0-app.x0.localnet/python/Index.py&appid=test_base`

The next chapters describe the installation process (also non Hyper-V setup)
in detail.

## 1. Preface

The minikube installation (version v1.34.0) currently is tested on Microsoft
Windows 11 23H2 (x64) using the *x0 kube installer*<br>(`./setup/Setup.py`).

*x0 minikube* runs Kubernetes version: *v1.31.0* and Docker version: *27.2.0*.

Minikubes primary purpose is to test an aplication / kubernetes metadata before
deploying it to a production cluster. The following section describes the
differences / limited *x0 kube installer* features.

## 2. Production Cluster Difference

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

## 6. Installation Preparation

The following sections cover the installation process in detail.

### 6.1. Backends

The minikube system can be run on multiple backends / virtualization products,
called **driver**.

Tested installations / drivers (MS Windows).

- VMWare
- VirtualBox
- Microsoft Hyper-V

>[!WARNING]
> Dispite all recommendations using docker as preferred driver, **we** do not do
> this for MS Windows (tm) systems. Hyper-V is your friend here.

### 6.2. Internet-less Setup

In some (iso-certified) environments internet-access is limited, even turned off
completely. We recommend using the VMWare driver (--driver=vmware) in this case.

>[!WARNING]
> The addons installation is very picky with the image verification.
> Be sure that base iso and correct docker images are locally cached correctly.
> It is possible to install minikube on an internet connected client and copy the
> cached data afterwards to the internet-less system.

>[!NOTE]
> In some environments / more complex network setups (multiple NIC / routed)
> VMWare NAT NIC settings have to be adapted manually (DNS, Port Forwarding ...).

### 6.3. Global Recommendations

Be sure to run the minikube setup / installation as Administrator User.

>[!WARNING]
> Always manage the cluster from an unprivileged account (Powershell) using
> Administrator rights.

### 6.4. Hyper-V

However, the Virtualbox and VMWare drivers did misbehave on multiple machines
directly connected to the internet. Only MS Hyper-V did work out of the box here.

The following message indicates no external network connectivity. This should not
be the case with `--driver=hyperv`.

> ! Failing to connect to https://registry.k8s.io/ from both inside the minikube
> VM and host machine

>[!NOTE]
> Also modern Windows *Virtual Based Security* works out of the box with enabled
> hardware acceleration. With VMWare and VirtualBox driver the Windows feature
> *Virtual Based Security* should be turned off completely.

The following powershell command will install and enable Windows Hyper-V.

```powershell
# enable windows hyper-v feature
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

### 6.5. VMWare

First, we recommend to disable Windows feature *Virtual Based Security*.
Without VMs do not use VT-x / VT-d CPU hardware capabilities.

Also add the following VMWare path to the systems environment variable `Path`.

```powershell
C:\Program Files (x86)\VMware\VMware Workstation
```

### 6.6. Kubectl

Also `kubectl` cluster administration utility is required by *x0 kube installer*.

https://kubernetes.io/docs/tasks/tools/install-kubectl-windows/

### 6.7. Python

Install Python for Windows 3.13 globally (all users).

On the first installer page.

- Set checkbox "Use admin privileges when installing py.exe"
- Set checkbox "Add python.exe to PATH"

Click "Customize installation".

Important checkboxes **must** be set.

- "py launcher"
- "for all users (requires admin privileges)"

## 7. Installation

Generate the cluster now and install *x0-system* inside.

### Download Docker Images

Only important for a non-internet environment.

Minikube connected to the internet will download all Docker images
automatically.

Download required mages from https://docker.webcodex.de/x0/ manually (an own
Docker sub-registry is in preparation).

### 7.1. Import Docker Base Images

```powershell
# import docker images (system / addons)
minikube image load docker.registry.2.8.3.tar
minikube image load docker.kube-registry-proxy.v0.0.6.tar
minikube image load docker.minikube-ingress-dns.v0.0.3.tar
minikube image load docker.ingress-nginx.controller.v1.11.2.tar
```

### 7.2. Generate minikube Cluster

1. Option 1 (MS Hyper-V)

```powershell
# generate minikube cluster (ms hyper-v)
minikube.exe start --driver=hyperv
```

2. Option 2 (VMWare)

```powershell
# generate minikube cluster (vmware driver)
minikube.exe start --driver=vmware
```

After successful cluster creation the following lines should appear.

> * minikube v1.34.0 on Microsoft Windows 11 Pro ...

> * Done! kubectl is now configured to use "minikube" cluster and "default"
> namespace by default

Perfect, cluster is up and running. Now, check which external IPv4 address the
cluster is using.

```powershell
# check minikube cluster ip
minikube.exe ip
```

This should output the current configured external IP address.
Remember the address for later DNS usage.

### 7.3. Install Addons

```powershell
# enable addons "registry", "ingress" and "ingress-dns"
minikube addons enable registry
minikube addons enable ingress
minikube addons enable ingress-dns

# check addons enabled
minikube addons list
```

### 7.4. Import 3d Party Docker Images

```powershell
# import docker images (selenium test framework)
minikube image load docker.selenium-standalone-chrome.tar

# import docker images (kubegres and postgres)
minikube image load docker.reactivetechio.kubegres.1.19.tar
minikube image load docker.postgres.14.tar
```

### 7.5. Import x0 Docker Images

>[!WARNING]
> This step is **mandatory** / images **must** be downloaded and installed manually.

```powershell
# import docker images (x0 system)
minikube image load docker.x0-app.tar
minikube image load docker.x0-db-install.tar
minikube image load docker.x0-test.tar
```

### 7.6. Run Setup / x0-Installer

Now its time to run the installer.

The installer uses `../../config/app-config.json` as configuration source.

```powershell
# start setup / installation
cd .\setup\
python.exe Setup.py
```

## 8. Post Installation

After installation, the following kubernetes objects should have been generated.

### 8.1. Namespaces

Get all existing namespaces.

```powershell
# get namespaces
kubectl.exe get namespace -o wide
```

Check, if the following namespaces, especially "x0-app" exists.

| NAME                | STATUS             |
| ------------------- | ------------------ |
| <img width="700px"> | <img width="320">  |
| ingress-nginx       | Active             |
| kube-node-lease     | Active             |
| kube-public         | Active             |
| kube-system         | Active             |
| kubegres-system     | Active             |
| x0-app              | Active             |

### 8.2. Pods

Get all existing pods from namespace "x0-app".

```powershell
# get pods
kubectl.exe get pods -n x0-app 
```

Check if the following pods exist, especially "READY" and "STATUS".
Also an internal IPv4 address must be assigned.

| NAME                   | READY              | STATUS             | IP                 |
| ---------------------- | ------------------ | ------------------ | ------------------ |
| <img width="420px">    | <img width="200">  | <img width="200">  | <img width="200">  |
| mypostgres-1-0         | 1/1                | Running            | 10.244.x.x         |
| selenium-server-0      | 1/1                | Running            | 10.244.x.x         |
| x0-test-db-install     | 0/1                | Completed          | 10.244.x.x         |
| x0-test-deployment-... | 1/1                | Running            | 10.244.x.x         |
| x0-test-test-run       | 0/1                | Completed          | 10.244.x.x         |

### 8.3. Service

Get all services from namespace "x0-app".

```powershell
# get service
kubectl.exe get service -o wide -n x0-app
```

Check if the following services exist.

| NAME                   | TYPE               | CLUSTER-IP         | PORT(S)            |
| ---------------------- | ------------------ | ------------------ | ------------------ |
| <img width="420px">    | <img width="200">  | <img width="200">  | <img width="200">  |
| mypostgres             | ClusterIP          | None               | 5432/TCP           |
| selenium-server-0      | ClusterIP          | 10.103.x.x         | 4444/TCP           |
| x0-x0-app-test-svc     | ClusterIP          | 10.104.x.x         | 80/TCP             |

### 8.4. Endpoints

Get all endpoints from namespace "x0-app".

```powershell
# get endpoints
kubectl.exe get endpoints -o wide -n x0-app
```

Check if the following endpoints exist and the IP-mapping to pods is correct.

| NAME                | ENDPOINTS          |
| ------------------- | ------------------ |
| <img width="700px"> | <img width="320">  |
| mypostgres          | 10.244.x.x:5432    |
| selenium-server-0   | 10.244.x.x:4444    |
| x0-x0-app-test-svc  | 10.244.x.x:80      |

### 8.5. Ingress

Get ingress from namespace "x0-app".

```powershell
# get ingress
kubectl.exe get ingress -o wide -n x0-app
```

Check if the following ingress exists.

| NAME                            | CLASS              | HOSTS              | ADDRESS            |
| ------------------------------- | ------------------ | ------------------ | ------------------ |
| <img width="420px">             | <img width="200">  | <img width="200">  | <img width="200">  |
| x0-x0-app-test-minikube-ingress | nginx              | x0-app.x0.localnet | 172.17.84.42       |

### 8.6. DNS

>[!WARNING]
> Note kubernetes is using **4 IP scopes**

1. Hypervisor Host IP (NAT)
2. Ingress: Docker Network (172.17.x.x)
3. Kube Proxy Subnets (10.103.x.x, 10.104.x.x) 
4. Internal PODs (10.244.x.x)

Get the Hypervisor Host IP.

```powershell
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

```powershell
# get test pods logs
kubectl.exe logs x0-test-test-run -o wide -n x0-app
```

The last lines should look like this.

```powershell
------------------ generated xml file: /tmp/pytest-junit.xml -------------------
======================== 40 passed in 81.53s (0:01:21) =========================
```
