<p align="center">
  <img src="./image/x0-logo-github.png" alt="x0 Framework Logo" width="800"/>
</p>

<h1 align="center">x0 JavaScript Framework</h1>
<p align="center"><em>Modern, Real-Time SPA Framework for Powerful Web Applications</em></p>

<div align="center">
  <a href="https://github.com/WEBcodeX1/x0/actions/workflows/github-code-scanning/codeql">
    <img src="https://github.com/WEBcodeX1/x0/actions/workflows/github-code-scanning/codeql/badge.svg" alt="CodeQL">
  </a>
  <a href="https://github.com/WEBcodeX1/x0/actions/workflows/ci.yml">
    <img src="https://github.com/WEBcodeX1/x0/actions/workflows/ci.yml/badge.svg" alt="x0 Test Runner">
  </a>
  <a href="https://github.com/WEBcodeX1/x0/actions/workflows/dependabot/dependabot-updates">
    <img src="https://github.com/WEBcodeX1/x0/actions/workflows/dependabot/dependabot-updates/badge.svg" alt="Dependabot">
  </a>
  <a href="https://github.com/WEBcodeX1/x0/blob/main/LICENSE">
    <img src="https://img.shields.io/github/license/WEBcodeX1/x0?style=flat" alt="License">
  </a>
  <a href="https://docs.webcodex.de/x0/v1.0/">
    <img src="https://img.shields.io/badge/docs-sphinx-blue" alt="Docs">
  </a>
</div>

---

## :pushpin: Overview

**x0** (cross-object) is a next-gen JavaScript framework for building robust, real-time Single Page Applications (SPAs) with true object orientation, zero code duplication, and modern deployment options (Docker/Kubernetes).

- **Fast SPA Development**: Near desktop-app speed and features
- **Responsive by Design**: One app, every device, standards via Bootstrap CSS
- **Clean OOP**: True object orientation, abstraction, chaining, metadata modeling
- **Zero Code Duplication**: Efficient, maintainable, backend-agnostic
- **Kubernetes Ready**: Easy cloud-native deployment
- **Security**: PKCS 11/15 compatible, own PKI system (non-free)

## :racehorse: Quick Start

Try x0 now in minutes!

```bash
# Clone & enter repo
git clone https://github.com/WEBcodeX1/x0.git
cd x0

# Install Docker
apt-get -y install docker.io

# Docker permissions & setup
usermod -aG docker your-user

# Pull images
docker pull ghcr.io/webcodex1/x0-app
docker pull ghcr.io/webcodex1/x0-db
docker pull ghcr.io/webcodex1/x0-test

# Start x0-system
cd ./docker/
./x0-start-containers.sh
```

Add to `/etc/hosts`:
```bash
172.20.0.10     x0-app.x0.localnet
```

Try examples:
```
http://x0-app.x0.localnet/python/Index.py?appid=example7
```

Full install details: [INSTALL.md](./INSTALL.md)
Rendered docs: [Official Sphinx Documentation](https://docs.webcodex.de/x0/v1.0/).

---

## :star2: Features

- **Cross Objects:** Clean OOP, seamless data exchange between clients and network
- **Responsiveness:** Bootstrap CSS grid, single app for all devices
- **Object Chaining/Data Abstraction:** Chain objects, enjoy recursive, reusable modeling
- **Zero Code Duplication/Freedom:** OSI-layer abstraction, minimal backend dependencies
- **Kubernetes Ready:** Google Kubernetes Engine (GKE), Minikube support
- **Security:** PKCS-compatible, optional advanced PKI system

Learn more in [Examples](#14-examples).

---

## :computer: Single Page Application

Modern browser apps with near desktop power. Backend independence, real-time updates.

---

## :bookmark_tabs: Table of Contents

1. [Abstract / Purpose](#abstract--purpose)
2. [Technical Details](#technical-details)
3. [Security](#security)
4. [Future Plans / Milestones](#future-plans--milestones)
5. [Examples](#examples)
6. [File & Folder Structure](#file--folder-structure)
7. [Contributing](#contributing)
8. [Community & Support](#community)
9. [License](#license)

---

## :mega: Abstract / Purpose

**x0** is designed to make advanced SPA development fun, fast, and maintainable. With zero code duplication and clean OOP, x0 powers complex, modern web applications.

---

## :zap: Technical Details

**OS Compatibility:**
- Ubuntu 22.04 (Jammy Jellyfish)
- Ubuntu 24.04 (Noble Numbat)
- Devuan (Daedalus 5.0)

**Prerequisites:**
- Apache2.0+ / WSGI or FalconAS
- PostgreSQL 13+
- Python3+, Psycopg2, Selenium

**Kubernetes:**
- Kubegres: [GitHub](https://github.com/reactive-tech/kubegres)
- Minikube: Partial support on Windows/Linux

**Deployment:**
- Linux Standalone
- Docker
- Google Kubernetes Engine (GKE)

---

## :closed_lock_with_key: Security

PKCS 11/15 compatible. Optional advanced PKI (non-free).
Full details in [WEB/codeX PKI Manager](http://www.webcodex.de/Projects/WCDXPKIManager).

---

## :alarm_clock: Future Plans / Milestones

- FalconAS Python Application Server: [repo](https://github.com/WEBcodeX1/http-1.2)
- Roadmap: [GitHub Milestones](https://github.com/WEBcodeX1/x0/milestones)

---

## :bulb: Examples

Try 13 live examples:

```
http://x0-app.x0.localnet/python/Index.py?appid=example1
...
http://x0-app.x0.localnet/python/Index.py?appid=example13
```
The most impressive: **12 (list_dyn_radio)** and **13 (copy_paste)**.

---

## :file_folder: File & Folder Structure

Partial overview, see [GitHub file search](https://github.com/WEBcodeX1/x0/search):

```
├── README.md
├── INSTALL.md
├── debian/
│   └── README.md
├── docker/
│   ├── README.md
│   ├── build-all.sh
│   └── ...
├── doc/
│   ├── index.rst
│   ├── intro.rst
│   ├── dev-examples.rst
│   ├── Makefile
│   └── conf.py
├── conf/
│   └── wsgi.conf
├── www/
│   └── sysText.js
└── ... (more files & folders)
```
More: [WEBcodeX1/x0 on GitHub](https://github.com/WEBcodeX1/x0)

---

## :wave: Contributing

Contributions & feedback welcome!
See [CONTRIBUTING.md](./CONTRIBUTING.md) (if exists) or open an issue.

---

## :globe_with_meridians: Community & Support

- [Discussions](https://github.com/WEBcodeX1/x0/discussions)
- [Issues](https://github.com/WEBcodeX1/x0/issues)
- [Docs](https://docs.webcodex.de/x0/v1.0/)

---

## :memo: License

AGPL-3.0. See [LICENSE](./LICENSE).

---

<p align="center"><sub>Made with ❤️ by Claus Prüfer & WEBcodeX1</sub></p>
