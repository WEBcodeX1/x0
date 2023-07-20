FROM ubuntu:latest
MAINTAINER Claus Prüfer

ARG DEBIAN_FRONTEND=noninteractive

ARG DB_DEB_FILE=x0-db_0.98rc_all.deb

COPY ./$DB_DEB_FILE ./

RUN rm /var/lock
RUN mkdir -p /var/lock/

RUN apt-get -qq update -y

RUN apt-get -qq install -y ./$DB_DEB_FILE

CMD su -c "/usr/lib/postgresql/14/bin/postgres -D /var/lib/postgresql/14/main" postgres

EXPOSE 5432
