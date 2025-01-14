FROM ubuntu:22.04
MAINTAINER Claus Prüfer

ARG DEBIAN_FRONTEND=noninteractive

ARG APP_DEB_FILE=x0-app_0.98rc_all.deb
ARG APP_PSYCOP_DEB_FILE=x0-psycopg2-patched_0.98rc_all.deb

COPY ./x0/docker/tmp/apt-sources.list /etc/apt/sources.list
COPY ./x0/docker/tmp/environment-app.sh ./environment.sh

COPY ./$APP_DEB_FILE ./
COPY ./$APP_PSYCOP_DEB_FILE ./

RUN rm /var/lock
RUN mkdir -p /var/lock/

RUN apt-get -qq update -y

RUN apt-get -qq install libssl3=3.0.2-0ubuntu1.15 --allow-downgrades -y

RUN TZ="Europe/Berlin" apt-get -qq install -y tzdata locales

RUN apt-get -qq install -y ./$APP_DEB_FILE
RUN apt-get -qq install -y ./$APP_PSYCOP_DEB_FILE

RUN /var/lib/x0/app-setup/bin/fs-permissions.sh

RUN chown www-data:www-data /var/www

CMD /var/lib/x0/sys/docker-start-apache.sh

EXPOSE 80
EXPOSE 443
