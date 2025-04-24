#!/bin/sh

KEY_FILE="/tmp/cert-key.pem"
CERT_FILE="/tmp/cert.pem"
HOST="x0-app-test.kicker-finder.de"

openssl req -x509 -nodes -days 365 -newkey rsa:4096 -keyout ${KEY_FILE} -out ${CERT_FILE} -subj "/CN=${HOST}/O=${HOST}" -addext "subjectAltName = DNS:${HOST}"
kubectl --namespace x0-test create secret tls x0-app-tls --key ${KEY_FILE} --cert ${CERT_FILE}
