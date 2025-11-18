FROM ubuntu:24.04

MAINTAINER Claus Prüfer

ARG DEBIAN_FRONTEND=noninteractive

ARG APP_DEB_FILE=x0-test_1.0_all.deb

COPY ./x0/docker/tmp/apt-sources.list /etc/apt/sources.list

COPY ./$APP_DEB_FILE ./

RUN rm /var/lock
RUN mkdir -p /var/lock/

RUN apt-get -qq update -y

RUN TZ="Europe/Berlin" apt-get -qq install -y tzdata locales

RUN apt-get -qq install -y ./$APP_DEB_FILE

CMD /var/lib/x0/sys/docker-run-pytest.sh

LABEL org.opencontainers.image.source=https://github.com/clauspruefer/x0
LABEL org.opencontainers.image.description="x0 docker container image - global test component"
LABEL org.opencontainers.image.licenses=AGPL-3.0-or-later
