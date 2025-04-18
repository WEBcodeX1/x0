# x0 JavaScript Framework

![x0-logo](./image/x0-logo-github.png)

## 1. Abstract / Purpose

**x0 (cross-object) JavaScript Framework** /krɒs ɒb.dʒɪkt/  is a modern tool for
building powerful Web-Browser Realtime-SPA (Single Page Applications) efficiently.

Installation instruction(s) see: [./INSTALL.md](./INSTALL.md).<br>
Rendered Sphinx documentation: https://docs.webcodex.de/x0/v1.0/.

## 2. Single Page Application

SPA-applications are modern browser-applications which run *nearly* backend independent,
though getting more and more close to *real* desktop-apps.

## 3. Quick Start

To see x0-system in action immediately, download the following docker images.

https://docker.webcodex.de/x0/docker.x0-app.tar<br>
https://docker.webcodex.de/x0/docker.x0-db.tar<br>

```bash
# clone repository
git clone https://github.com/WEBcodeX1/x0.git
cd x0

# install docker
apt-get -y install docker.io

# set docker permissions / restart shell
usermod -aG docker your-user

# load docker images
docker load < docker.x0-app.tar
docker load < docker.x0-db.tar

# start x0-system
cd ./docker/
./x0-start-containers.sh
```
Open URL http://172.20.0.10/python/Index.py?appid=example12.

## 4. Cross Objects

What does the cross stand for you might ask. **Communication**.

Due to the x0-systems clean OOP model, each object is able to e"x"change its data
container internally and over the network between client(s) *directly*.

See examples section [example #10](./example/net_messages/) and
[example #13](./example/copy_paste/) for more information.

## 5. Responsiveness

Due to x0 relying on *Bootstrap CSS* cross browser standards for all end-devices are
guaranteed (CSS Grid system).

Build / maintain only **ONE** single app (even android). IT-budget saved!

Also x0 does not rely on bootstrap / external JavaScript includes.

## 6. True Object Orientation / Clean Code

JavaScript (ECMA6 / ECMA7) still lacks overloading DOM object internal functions,
which makes building clean efficient abstraction models nearly impossible.

Especially if you are a high level, experienced OOP programmer, immediate sadness,
anger and an enormous frustration level are highly possible symptoms.

x0 does the trick! **The Missing Layer** will be simulated, now modeling is fun again.
If implemented in the correct way, even extremely efficient.

>[!NOTE]
> Bind your own object methods to an existing *DOM element*; use object inheritance.

## 7. Zero Code Duplication / Freedom

The x0 OSI layer abstraction is very simple and relies on **0** (backend) dependencies.

Currently other compared SPA frameworks tend to code duplication by a factor > 2.

## 8. Object Chaining / Data Abstraction

A smart base-class design / model helps making object design with x0 framework a big
enjoyment.

Combining (chaining) objects for later reuse (even recursive chainable) is a x0 basic
feature using a clean abstraction model.

Feeding objects with data and getting data from objects (graph based JSON) also saves
a lot of effort due to a smart / recursive objects metadata model.

See Sphinx documentation examples section ([./doc](./doc)) for a better understanding
of object modeling and how to implement in detail.

>[!NOTE]
> x0 provides *object instancing* in **runtime** with 0 backend-communication.

## 9. Kubernetes Ready

*x0 applications* run on Google Kubernetes Engine (GKE).

The JSON based kubernetes installer makes it easy to deploy multiple application
environments in no time.

See [./kubernetes/README.md](./kubernetes/README.md).

>[!NOTE]
> Also minikube on Windows is *partially* supported.

## 10. Open Source

*x0 system* is licensed under AGPL-3.0 license.

## 11. Technically

Detailed installation instruction(s) can be found in [./INSTALL.md](./INSTALL.md)
and subdirs **README.md**.

### 11.1. OS Compatibility

*x0 system* runs stable on current Ubuntu Linux 22.04.x LTS (Jammy Jellyfish), inside
local Docker containers or on native Google Kubernetes Engine (GKE).

>[!NOTE]
> Detailed Documentation for setting up on Minikube (Windows 11) see [./kubernetes/README.md](./kubernetes/README.md).

### 11.2. Prerequisites

Currently the following OpenSource products are required to run the system:

- Apache2.0+
- Apache WSGI (Python) **or** FalconAS Application Server
- PostgreSQL 13+
- Python3+
- Psycopg2 (Python) PostgreSQL Client-Library
- Selenium Browser Test-Framework / Python Libraries

### 11.3. Prerequisites Kubernetes

- Kubegres (https://github.com/reactive-tech/kubegres)

### 11.4. Deployment

*x0 system* is deployable on the following platforms:

- Linux Standalone
- Docker
- Google Kubernetes Engine (GKE)

## 12. Security

For a better perspective on security, x0-system is PKCS 11 / PKCS 15 compatible
(also on GKE). Provisioning is managed by its own PKI (Private Key Management) system
(non-free).

## 13. Future Plans / Milestones

>[!NOTE]
> We currently are working on a Python Application Server (FalconAS) to replace Apache
> and WSGI module.<br>
> https://github.com/WEBcodeX1/http-1.2.

Milestones are github managed, see https://github.com/WEBcodeX1/x0/milestones.
