# Kubernetes Installation Instructions

The following chapters cope with the installation process on GKE (Google Kubernetes Engine).

1. Minikube
2. Production Cluster

## 1. Minikube

*x0 minikube* setup is limited. RBAC (Role Based Access Control), Access Token Handling and
Load-Balancing / Multi-Environment-Setup are **not** well supported by *x0 kubernetes installer*.

Nevertheless *x0 base system* incuding CI / tests and *x0 apps* run without any problems on
minikube to test them before deploying on production systems.

Details [./MINIKUBE.md](./MINIKUBE.md).

## 2. Production Cluster

For enhanced production-cluster setup / management the minimal (gui-less) Ubuntu
Linux Virtual Machine has to be used.

Details [./vm/management/README.md](./vm/management/README.md).
