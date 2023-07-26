#!/bin/sh

OUT_PATH="../../ssl"

CERT_CA_FILE="${OUT_PATH}/ca.x0-app.CA.crt.pem"
CERT_CA_KEY_FILE="${OUT_PATH}/x0-app.Server.key"
CERT_FILE="${OUT_PATH}/x0-app.Server.crt.pem"
CERT_KEY_FILE="${OUT_PATH}/x0-app.Server.key.unencrypted.pem"
CERT_CSR_FILE="${OUT_PATH}/x0-csr.pem"

CERT_CA_PASSPHRASE="change4prod-ca"
CERT_PASSPHRASE="change4prod"

DEMO_FQDN="x0-app.kicker-finder.de"

# generate apache ssl cert
openssl genrsa -des3 -out ${CERT_CA_KEY_FILE} -passout pass:${CERT_CA_PASSPHRASE} 4096
openssl req -x509 -new -nodes -key ${CERT_CA_KEY_FILE} -sha512 -days 365 -out ${CERT_CA_FILE} -subj "/C=DE/ST=MA/O=clickIT/CN=ca.local" -passin pass:${CERT_CA_PASSPHRASE}
openssl genrsa -out ${CERT_KEY_FILE} -passout pass:${CERT_PASSPHRASE} 4096
openssl req -new -sha512 -key ${CERT_KEY_FILE} -subj "/C=DE/ST=MA/O=clickIT/CN=${DEMO_FQDN}" -out ${CERT_CSR_FILE} -passin pass:${CERT_PASSPHRASE} -nodes
openssl x509 -req -in ${CERT_CSR_FILE} -CA ${CERT_CA_FILE} -CAkey ${CERT_CA_KEY_FILE} -CAcreateserial -out ${CERT_FILE} -days 365 -sha512 -passin pass:${CERT_CA_PASSPHRASE}
