# Overview / Terraform Export

Script `./terraform-export.sh` generates .tf HashiCorp Terraform compatible files from the
running x0 minikube infrastructure.

# Prerequisites / Install

1. Install Terraform (Ubuntu)

```bash
wget -O - https://apt.releases.hashicorp.com/gpg | sudo gpg --dearmor -o /usr/share/keyrings/hashicorp-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/hashicorp-archive-keyring.gpg] https://apt.releases.hashicorp.com $(grep -oP '(?<=UBUNTU_CODENAME=).*' /etc/os-release || lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/hashicorp.list
sudo apt update && sudo apt install terraform
```

2. Install k2tf

```bash
install_file="k2tf_0.8.0_Linux_amd64.tar.gz"
wget https://github.com/sl1pm4t/k2tf/releases/download/v0.8.0/${install_file}
tar -xvf ${install_file}
sudo install -o root -g root -m 0755 ${install_file} /usr/local/bin/${install_file}
```

3. Run x0 Kubernetes installer

```bash
cd ../setup
python3 Setup.py
```

4. Create terraform output directory

```bash
terraform_dir="~/terraform-test"
mkdir ${terraform_dir}
```

5. Init terraform

```bash
cd /${terraform_dir} && terraform init
```

# Current Kubernetes Infrastructure

- 1 Ingress-NGINX loadbalancer pod
- 2 x0-app application pods
- 2 Database pods (binary replication)
- 1 Selenium test-framework pod

Diagram: ./x0-kubernetes-default-infrastructure.pdf

# Objects Being Converted

1. Global

- Ingress for namespace x0-app

2. Namespaces ingress-nginx, kubegres-system and x0-app

- Deployments
- Services

# Convert

Finally, run converter script.

```bash
./terraform-export.sh ${terraform_dir}
```

# Check Working Terraform

```bash
cd /${terraform_dir} && terraform plan
```

# External References

- (https://github.com/sl1pm4t/k2tf/)[https://github.com/sl1pm4t/k2tf/]
- (https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/)[https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/]
