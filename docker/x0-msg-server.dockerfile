FROM ubuntu:24.04
MAINTAINER Claus Prüfer

ARG DEBIAN_FRONTEND=noninteractive

ARG APP_DEB_FILE=x0-msg-server_1.0~rc1_all.deb

COPY ./x0/docker/tmp/apt-sources.list /etc/apt/sources.list
COPY ./x0/docker/tmp/environment-app.sh ./environment.sh

COPY ./$APP_DEB_FILE ./

RUN rm /var/lock
RUN mkdir -p /var/lock/

RUN apt-get -qq update -y

RUN TZ="Europe/Berlin" apt-get -qq install -y tzdata locales

RUN apt-get -qq install -y ./$APP_DEB_FILE

CMD /var/lib/msgserver/bin/docker-start-msg-server.sh

EXPOSE 8080

LABEL org.opencontainers.image.source=https://github.com/clauspruefer/x0
LABEL org.opencontainers.image.description="x0 docker container image - messaging server component"
LABEL org.opencontainers.image.licenses=AGPL-3.0-or-later
