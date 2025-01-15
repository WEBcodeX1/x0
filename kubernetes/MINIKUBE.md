# Kubernetes Minikube Installation Instructions

The following installation instructions cover the installation of the base
*x0 system* on a kubernetes minikube including CI / tests.

See *x0 App Packaging* (**../PACKAGING.md**) subsection how to build your application
for running in a minikube environment. This is nearly transparent to the x0-base
installation process.

In short, run the following inside Windows Powershell (with Administrator privileges):
system up and running.

```powershell
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Hyper-V -All
```

Answer "Y"(es) to reboot. Afterwards Hyper-V is operational.

>[!NOTE]
> Install Git for Windows 64bit before you continue, it contains curl binary
> which is used by Setup.py

>[!NOTE]
> Also install the remaining dependencies (see 3. Dependencies).

```powershell
git clone https://github.com/WEBcodeX1/x0.git
cd .\x0\kubernetes\setup\
python Setup.py
```

The next chapters describe the installation process in detail.

## 1. Preface

The minikube installation (version v1.34.0) currently is tested on Microsoft
Windows 11 23H2 (x64) using the *x0 Kube Installer* (./setup/Setup.py).

*x0 minikube* runs Kubernetes version: *v1.31.0* and Docker version: *27.2.0*.

Minikubes primary purpose is to test an aplication / kubernetes metadata before
deploying it to a production cluster. The following section describes the
differences / limited *x0 Kube Installer* features.

## 2. Production Cluster Difference

1. *x0 minikube* setup lacks enhanced Role Base Access Control functionality /
enhanced private *Docker Registry* integration (e.g. Gitlab).

>[!NOTE]
> *x0 Kube Installer* is able to manage RBAC / deployment tokens in a GKE
> production environment. Documentation to setup a Ubuntu Linux Virtual Machine
> (non-graphical multi-user environment) to handle authentication tokens in a
> secure manner can be found here: #TODO: add link

2. The minikube setup is not able to manage "external" DNS automatically.

>[!NOTE]
> The *x0 Kube Installer* is able to interact with OpenStack DNS management
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

Also `kubectl` cluster administration utility is required by *x0 Kube Installer*
(Setup.py).

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
cd ./setup/
python3.exe Setup.py ..\..\
```

## 8. Post Installation

After installation, the following kubernetes objects should have been generated.

### 8.1. Namespaces

Check, if the namespace "x0-app" exists.

```powershell
# get namespaces
kubectl get namespaces
```

### 8.2. Pods

Check running pods.

```powershell
# get pods
kubectl get pods -n x0-app 
```

### 8.3. DNS

Add an DNS or "%windir%\system32\drivers\etc\hosts" entry for minikube external IP address
(x0-app.x0.localnet).

Open the following URL in local browser, this should display a simle "Hello World!" text.

http://x0-app.x0.localnet/python/Index.py
