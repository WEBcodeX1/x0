FROM ubuntu:22.04
MAINTAINER Claus Prüfer

ARG DEBIAN_FRONTEND=noninteractive

ARG APP_DEB_FILE=x0-app_1.0~rc1_all.deb

COPY ./x0/docker/tmp/apt-sources.list /etc/apt/sources.list
COPY ./x0/docker/tmp/environment-app.sh ./environment.sh

COPY ./$APP_DEB_FILE ./

RUN rm /var/lock
RUN mkdir -p /var/lock/

RUN apt-get -qq update -y

#RUN apt-get -qq install libssl3=3.0.2-0ubuntu1.15 --allow-downgrades -y

RUN TZ="Europe/Berlin" apt-get -qq install -y tzdata locales

RUN apt-get -qq install -y ./$APP_DEB_FILE

RUN /var/lib/x0/app-setup/bin/fs-permissions.sh

RUN chown www-data:www-data /var/www

CMD /var/lib/x0/sys/docker-start-apache.sh

EXPOSE 80
EXPOSE 443

LABEL org.opencontainers.image.source=https://github.com/clauspruefer/x0
LABEL org.opencontainers.image.description="x0 docker container image - application component"
LABEL org.opencontainers.image.licenses=AGPL-3.0-or-later
