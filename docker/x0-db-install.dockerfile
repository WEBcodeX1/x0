FROM ubuntu:latest
MAINTAINER Claus Prüfer

ARG DEBIAN_FRONTEND=noninteractive

ARG APP_DEB_FILE=x0-db-install_0.98rc_all.deb

COPY ./x0/docker/tmp/apt-sources.list /etc/apt/sources.list
COPY ./x0/docker/tmp/environment-db.sh ./environment.sh

COPY ./$APP_DEB_FILE ./

RUN rm /var/lock
RUN mkdir -p /var/lock/

RUN apt-get -qq update -y

RUN TZ="Europe/Berlin" apt-get -qq install -y tzdata locales

RUN apt-get -qq install -y ./$APP_DEB_FILE

CMD . /environment.sh
