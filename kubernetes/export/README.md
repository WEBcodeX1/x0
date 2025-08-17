# Overview / Terraform Export

Script `./terraform-export.sh` generates .tf HashiCorp Terraform compatible files from the
running x0 minikube infrastructure.

# Prerequisites / Install

1. Install Terraform (Ubuntu)

```bash
# wget install file / hashicorp gpg key
wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg

# add archive to apt sources
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(grep -oP '(?<=UBUNTU_CODENAME=).*' /etc/os-release || lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list

# apt update / install
sudo apt update && sudo apt install terraform
```

2. Install k2tf

```bash
# get k2tf
install_file="k2tf_0.8.0_Linux_amd64.tar.gz"
wget https://github.com/sl1pm4t/k2tf/releases/download/v0.8.0/${install_file}

# extract
tar -xvf ${install_file}

# install
sudo install -o root -g root -m 0755 ${install_file} /usr/local/bin/${install_file}
```

3. Run x0 Kubernetes installer

```bash
# cd to setup dir
cd ../setup

# run installer
python3 Setup.py
```

4. Create Terraform output directory

```bash
# make terraform dir
terraform_dir="~/terraform-test"
mkdir ${terraform_dir}
```

5. Init Terraform

```bash
# init terraform
cd /${terraform_dir} && terraform init
```

# Current Kubernetes Infrastructure

- 1 *Ingress-NGINX* loadbalancer pod
- 2 *x0-app* application pods
- 2 *Kubegres* database pods (binary replication)
- 1 *Selenium* test-framework pod

Diagram: [./x0-kubernetes-default-infrastructure.pdf](./x0-kubernetes-default-infrastructure.pdf)

# Objects Being Converted

1. Global

- *Ingress* for namespace x0-app

2. Namespaces ingress-nginx, kubegres-system and x0-app

- *Deployments*
- *Services*

# Convert

Finally, run converter script.

```bash
./terraform-export.sh ${terraform_dir}
```

# Check Working Terraform

```bash
# check terraform syntax
cd /${terraform_dir} && terraform plan
```

# External References

- [https://developer.hashicorp.com/terraform](https://developer.hashicorp.com/terraform)
- [https://github.com/sl1pm4t/k2tf/](https://github.com/sl1pm4t/k2tf/)
- [https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)
- [https://www.selenium.dev](https://www.selenium.dev)
- [https://www.kubegres.io](https://www.kubegres.io)
