# 🚀 x0 Development Installation Guide

Welcome to the **x0-base-system** setup!
This guide will help you get your development environment up and running on popular platforms.

---

## 🖥️ Supported Platforms

- **Google Kubernetes Engine (GKE) - Minikube**
- **Google Kubernetes Engine (GKE) - Production Cluster**
- **Local Docker Environment / Linux (Ubuntu, Devuan)**

> **Note:**
> This documentation is intended for **x0-system developers**.
> If you want to develop an **x0-application**, please visit the [x0-skeleton repository](https://github.com/WEBcodeX1/x0-skeleton/).

---

## 1️⃣ System Prerequisites

Before you begin, ensure you have the following installed (all architectures):

- **Debian Build System** (`debuild`)
- **Debian Package Signing** (`gpg`)
- **Docker Engine** (including `buildx`)

### 🐧 Ubuntu (22.04, 24.04) - x64

```bash
# install Debian package builder, docker and GNU gpg
sudo apt-get -y install debuild gnupg docker.io
```

### 🐧 Devuan - x64

```bash
# install Debian package builder, docker and GNU gpg
sudo apt-get install devscripts pbuilder gnupg docker.io
```

### 🐧 Ubuntu (24.04.3) - arm64

```bash
# install Debian package builder, docker, GNU gpg and debhelper
sudo apt-get install devscripts pbuilder gnupg docker.io debhelper
```

>[!NOTE]
> We do not ship multiarch docker images. For arm64 (runs also on
> Macintosh AArch64 processors), x0-app and x0-db image can be downloaded
> here: https://docker.webcodex.de/x0-arm64/

---

## 2️⃣ Docker: Build & Run

The quickest way to get started is with Docker.

### 📦 Primary Docker Images Being Built

- `x0-app`
- `x0-db`
- `x0-test`

> ℹ️ Check debian and docker requirements before building:
> - [debian/README.md](./debian/README.md)
> - [docker/README.md](./docker/README.md)

### 🏗️ Build Debian Packages

```bash
cd ./debian && debuild
```

### 🏗️ Build Docker Images

```bash
cd ./docker
./build-x0-app.sh
./build-x0-db.sh
./build-x0-test.sh
```

### ▶️ Run Containers

```bash
cd ./docker && ./x0-start-containers.sh
```

---

## 3️⃣ Kubernetes / Minikube

Deploy and test **x0-base** or your own **x0-applications** locally with Minikube before production rollout.

> **Minikube deployment is automated and easy to use!**

For full instructions, see [kubernetes/README.md](./kubernetes/README.md).

---

## 🆘 Need Help?

- **For x0-system development:** Stay here!
- **For x0-application development:** Visit [x0-skeleton](https://github.com/WEBcodeX1/x0-skeleton/).

---

Happy coding! 🎉
