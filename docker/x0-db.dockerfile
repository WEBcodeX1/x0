FROM ubuntu:latest
MAINTAINER Claus Prüfer

ARG DEBIAN_FRONTEND=noninteractive

ARG DB_DEB_FILE=x0-db_0.98rc_all.deb

COPY ./x0/docker/tmp/apt-sources.list /etc/apt/sources.list

COPY ./x0/docker/scripts/start-postgresql.sh /root/start-postgresql.sh
COPY ./$DB_DEB_FILE ./

RUN rm /var/lock
RUN mkdir -p /var/lock/

RUN apt-get -qq update -y

RUN apt-get -qq install -y ./$DB_DEB_FILE

CMD /root/start-postgresql.sh

EXPOSE 5432
