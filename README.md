# x0 JavaScript Framework

## 1. Abstract / Purpose

**x0 (cross-object) JavaScript Framework** /krɒs ɒb.dʒɪkt/  is a modern tool for
building powerful Web-Browser Realtime-SPA (Single Page Applications) efficiently.

## 2. Single Page Application

SPA-applications are modern browser-aplications which run *nearly* backend independent,
though getting more and more close to *real* desktop-apps.

## 3. Cross Objects

What does the cross stand for you might ask. **Communication**.

Due to the x0-systems clean OOP model, each object is able to e"x"change its data
container between client(s) *directly*.

See examples section for more information.

## 4. Responsiveness

Due to x0 relying on *Bootstrap CSS* cross browser standards for all end-devices are
guaranteed.

Build / maintain only "ONE" single app (even android). IT-budgeg saved!

## 5. True Object Orientation / Clean Code

JavaScript (ECMA6 / ECMA7) still lacks overloading DOM object internal functions,
which makes building clean efficient abstraction models nearly impossible.

Especially if you are a high level, experienced OOP programmer, immediate sadness,
anger and an enourmos frustration level are highly possible symptoms.

x0 does the trick! **The Missing Layer** will be simulated, now modeling is fun again.
If implemented in the correct way, even extremely efficient.

>[!NOTE]
> Bind your own object methods to an existing *DOM element*; use object inheritance.

## 6. Zero Code Duplication / Freedom

The x0 OSI layer abstraction is very simple and relies on **0** (backend) dependencies.

Currently other compared SPA frameworks tend to code duplication by a factor > 2.

## 7. Object Chaining / Data Abstraction

A smart base-class design / model helps making object design with x0 framework a big
enjoyment.

Combining (chaining) objects for later reuse (even recursive chainable) is a x0 basic
feature using a clean abstraction model.

Feeding objects with data and getting data from objects (graph based JSON) also saves
a lot of effort due to a smart / recursive objects metadata model.

See examples section to better understand object modeling and how to implement.

>[!NOTE]
> x0 provides *object instancing* in **runtime** with 0 backend-communication.

## 8. Kubernetes Ready

*x0 applications* run on Google Kubernetes Engine (GKE).

The JSON based kubernetes installer makes it easy to deploy multiple application
environments in no time.

>[!NOTE]
> Also minikube on Windows is *partially* supported.

## 9. Open Source

*x0 system* is licensed under AGPL-3.0 license.

## 10. Technically

Detailled installation instruction(s) can be found in [./INSTALL.md](./INSTALL.md) and subdirs **README.md**.

### 10.1. OS Compatibility

*x0 system* runs stabel on current Ubuntu Linux 22.04.x LTS (Jammy Jellyfish), inside
local Docker containers or on native Google Kubernetes Engine (GKE).

>[!NOTE]
> Detailed Documentation for setting up on Minukube (Windows 11) see [/doc/minikube.rst](/doc/minikube.rst).

### 10.2. Prerequisites

Currently the following OpenSource products are required to run the system:

- Apache2.0+
- Apache WSGI (Python) **or** FalconAS Application Server
- PostgreSQL 13+
- Python3+
- Psycopg2 (Python) PostgreSQL Client-Library

### 10.3. Deployment

*x0 system* is deployable on the following plattforms:

- Linux Standalone
- Docker
- Google Kubernetes Engine (GKE)

## 11. Future Plans / Milestones

>[!NOTE]
> We currently are working on a Python Application Server (FalconAS) to replace Apache and WSGI module.<br>
> https://github.com/WEBcodeX1/http-1.2 (still beta).

Milestones are github managed; can be found at "Issues / Milestones".
