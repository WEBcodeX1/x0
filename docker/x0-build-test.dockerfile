FROM devuan/devuan:latest
MAINTAINER Claus Prüfer

ARG APP_DEB_FILE=x0-app_0.98rc_all.deb
ARG APP_PSYCOP_DEB_FILE=x0-psycopg2-patched_0.98rc_all.deb

COPY ./$APP_DEB_FILE ./
COPY ./$APP_PSYCOP_DEB_FILE ./

RUN rm /var/lock
RUN mkdir -p /var/lock/

RUN apt-get -qq update -y

RUN apt-get -qq install -y ./$APP_DEB_FILE
RUN apt-get -qq install -y ./$APP_PSYCOP_DEB_FILE

CMD /usr/sbin/apache2ctl -D FOREGROUND

EXPOSE 80
EXPOSE 443
