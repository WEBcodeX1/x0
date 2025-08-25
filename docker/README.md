# 🐳 Docker

> **Docker containerization for the x0 JavaScript Framework**  
> Complete container orchestration, building, and deployment guide

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start](#-quick-start)
3. [Image List](#-image-list)
4. [Building Images](#-building-images)
5. [Container Management](#-container-management)
6. [Network Configuration](#-network-configuration)
7. [Image Management](#-image-management)
8. [Environment Variables](#-environment-variables)
9. [Troubleshooting](#-troubleshooting)
10. [References](#-references)

---

## 🔧 Prerequisites

Before working with the x0 Docker setup, ensure you have:

- **Docker Engine** (v20.10+)
- **Docker Compose** (v2.0+) *(optional, for orchestration)*
- **Git** (for repository access)
- **Bash shell** (for build scripts)

**System Requirements:**
- Minimum 4GB RAM
- 10GB free disk space
- Network access for image pulls

---

## 🚀 Quick Start

Get the x0 system running with Docker in under 5 minutes:

```bash
# 1. Clone the repository (if not already done)
git clone https://github.com/WEBcodeX1/x0.git
cd x0/docker

# 2. Build all images
./build-all.sh

# 3. Set up network and start containers
./x0-network.sh
./x0-start-containers.sh

# 4. Access the application
# Web UI: http://localhost (ports 80/443)
# Database: localhost:5432
```

**Stop the system:**
```bash
./x0-stop-containers.sh
```

---

## 📦 Image List

The x0 system is composed of **7 specialized Docker images**:

| Image | Purpose | Base | Registry |
|-------|---------|------|----------|
| **x0-app** | Web application server | Ubuntu 24.04 | `ghcr.io/webcodex1/x0-app` |
| **x0-db** | PostgreSQL 14 database | Ubuntu 24.04 | `ghcr.io/webcodex1/x0-db` |
| **x0-db-install** | Kubernetes DB installer | Ubuntu 24.04 | `ghcr.io/webcodex1/x0-db-install` |
| **x0-db-install-tpl** | DB template installer | Ubuntu 24.04 | `ghcr.io/webcodex1/x0-db-install-tpl` |
| **x0-test** | Integration test runner | Ubuntu 24.04 | `ghcr.io/webcodex1/x0-test` |
| **x0-test-github** | GitHub Actions test runner | Ubuntu 24.04 | `ghcr.io/webcodex1/x0-test-github` |
| **x0-msg-server** | Message server component | Ubuntu 24.04 | `ghcr.io/webcodex1/x0-msg-server` |

---

## 🔨 Building Images

### Build All Images
```bash
# Build all images at once
./build-all.sh
```

### Build Individual Images
```bash
# Web application
./build-x0-app.sh

# Database
./build-x0-db.sh

# Database installers
./build-x0-db-install.sh
./build-x0-db-install-tpl.sh

# Test runners
./build-x0-test.sh
./build-x0-test-github.sh

# Message server
./build-x0-msg-server.sh
```

### Build Options
- **Build logs** are saved to `x0-build-*.log` files in the parent directory
- **Progress output** is enabled with `--progress=plain`
- **No cache** option is used for database image (`--no-cache`)

**Speed up builds** by configuring a local Ubuntu mirror (see [Environment Variables](#-environment-variables)).

---

## 🏃 Container Management

### Starting the System
```bash
# 1. Create the Docker network
./x0-network.sh

# 2. Start all containers
./x0-start-containers.sh
```

### Individual Container Operations
```bash
# Start database only
docker run -d --name x0-db \
  --net x0-connect --ip 172.20.0.20 \
  -p 5432:5432 \
  ghcr.io/webcodex1/x0-db

# Start web application
docker run -d --name x0-app \
  --add-host=mypostgres:172.20.0.20 \
  --net x0-connect --ip 172.20.0.10 \
  -p 80:80 -p 443:443 \
  ghcr.io/webcodex1/x0-app
```

### Stopping Containers
```bash
# Stop all x0 containers
./x0-stop-containers.sh

# Stop individual containers
docker stop x0-app x0-db
```

### Container Health Checks
```bash
# Check running containers
docker ps | grep x0

# View container logs
docker logs x0-app
docker logs x0-db

# Execute commands in containers
docker exec -it x0-app bash
docker exec -it x0-db psql -U postgres
```

---

## 🌐 Network Configuration

### Network Details
- **Network Name:** `x0-connect`
- **Subnet:** `172.20.0.0/24`
- **Gateway:** `172.20.0.1`

### Container IP Assignments
| Container | IP Address | Hostname |
|-----------|------------|----------|
| x0-app | `172.20.0.10` | x0-app |
| x0-db | `172.20.0.20` | mypostgres |

### Port Mappings
| Service | Container Port | Host Port | Protocol |
|---------|----------------|-----------|----------|
| Web UI (HTTP) | 80 | 80 | TCP |
| Web UI (HTTPS) | 443 | 443 | TCP |
| PostgreSQL | 5432 | 5432 | TCP |

### Network Commands
```bash
# Create network
docker network create --subnet=172.20.0.0/24 x0-connect

# Inspect network
docker network inspect x0-connect

# Remove network
docker network rm x0-connect
```

---

## 🏷️ Image Management

### Tagging and Registry Operations
```bash
# Tag and push all images to registry
./tag-images.sh
```

### Export/Import Images
```bash
# Export all images to tar files
./export-images.sh

# Import images from tar files
docker load < /tmp/docker.x0-app.tar
docker load < /tmp/docker.x0-db.tar
# ... (repeat for other images)
```

### Manual Registry Operations
```bash
# Tag for registry
docker tag x0-app:latest ghcr.io/webcodex1/x0-app:latest

# Push to registry
docker push ghcr.io/webcodex1/x0-app:latest

# Pull from registry
docker pull ghcr.io/webcodex1/x0-app:latest
```

---

## ⚙️ Environment Variables

### Ubuntu Mirror Configuration
Speed up image building by using a local Ubuntu mirror:

```bash
# Export environment variables
export UBUNTU_MIRROR_DNS=archive.ubuntu.local
export UBUNTU_MIRROR_IP=10.10.100.250

# Then run build scripts
./build-all.sh
```

### Automatic Configuration
The build scripts automatically:
- Detect mirror configuration via `scripts/get-env.sh`
- Configure `--add-host` parameters for Docker builds
- Select appropriate APT sources list

### Database Passwords
Database passwords are automatically generated and configured:
```bash
# Generated by scripts/get-env.sh
export PSQL_x0_PWD='<generated-password>'
export PSQL_ROOT_PWD='<generated-password>'
```

---

## 🔍 Troubleshooting

### Common Issues

**Build Failures:**
```bash
# Check build logs
tail -f x0-build-app.log

# Clean Docker cache
docker system prune -a

# Rebuild without cache
docker build --no-cache ...
```

**Network Issues:**
```bash
# Recreate network
docker network rm x0-connect
./x0-network.sh

# Check network connectivity
docker exec x0-app ping mypostgres
```

**Container Startup Issues:**
```bash
# Check container status
docker ps -a

# View startup logs
docker logs x0-app

# Inspect container configuration
docker inspect x0-app
```

**Permission Issues:**
```bash
# Ensure scripts are executable
chmod +x *.sh scripts/*.sh

# Check Docker daemon permissions
sudo usermod -aG docker $USER
```

### Debugging Commands
```bash
# System information
docker system info
docker version

# Resource usage
docker system df
docker stats

# Container inspection
docker exec -it x0-app bash
docker exec -it x0-db psql -U postgres -c '\l'
```

---

## 📚 References

### Docker Files
- [`build-all.sh`](./build-all.sh) - Build all images
- [`x0-network.sh`](./x0-network.sh) - Network setup
- [`x0-start-containers.sh`](./x0-start-containers.sh) - Start containers
- [`x0-stop-containers.sh`](./x0-stop-containers.sh) - Stop containers
- [`tag-images.sh`](./tag-images.sh) - Tag and push images
- [`export-images.sh`](./export-images.sh) - Export images

### Dockerfiles
- [`x0-app.dockerfile`](./x0-app.dockerfile) - Web application
- [`x0-db.dockerfile`](./x0-db.dockerfile) - Database
- [`x0-test.dockerfile`](./x0-test.dockerfile) - Test runner

### External Links
- [Docker Documentation](https://docs.docker.com/)
- [x0 Framework Documentation](https://docs.webcodex.de/x0/v1.0/)
- [GitHub Container Registry](https://ghcr.io)

---

<p align="center">
  <em>Part of the <a href="../README.md">x0 JavaScript Framework</a> | Docker orchestration by WEBcodeX</em>
</p>

