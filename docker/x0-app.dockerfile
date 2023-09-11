FROM ubuntu:latest
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

RUN TZ="Europe/Berlin" apt-get -qq install -y tzdata locales

RUN apt-get -qq install -y ./$APP_DEB_FILE
RUN apt-get -qq install -y ./$APP_PSYCOP_DEB_FILE

CMD . /environment.sh
CMD /var/lib/x0/sys/docker-start-apache.sh

EXPOSE 80
EXPOSE 443
