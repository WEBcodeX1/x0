#!/bin/sh

dstpath=$1
echo "Terrarform destination (output) path:${dstpath}"

kubectl get namespaces -o yaml | k2tf -o ${dstpath}/namespaces.tf
kubectl get ingress -n x0-app -o yaml | k2tf -o ${dstpath}/x0-app-ingress.tf

namespaces=(
    ingress-nginx
    kubegres-system
    x0-app
)

objects=(
    deployments
    endpoints
    services
    pods
)

for namespace in "${namespaces[@]}"; do
    echo "Processing namespace:${namespace}"
    for object in "${objects[@]}"; do
        kubectl get ${object} -n ${namespace} -o yaml | k2tf -o ${dstpath}/${namespace}-${object}.tf
    done
done
