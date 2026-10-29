FROM ubuntu:26.04
MAINTAINER Claus Prüfer

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get -qq update -y && \
    apt-get -qq install -y apache2

# copy javascript core system
COPY ./x0/www/ /var/www/vhosts/x0-static

# copy static system data
COPY ./x0/static/system/index.html /var/www/vhosts/x0-static/index.html
COPY ./x0/static/system/sysInitOnLoad.js /var/www/vhosts/x0-static/sysInitOnLoad.js

# copy static meta data
COPY ./x0/static/meta/* /var/www/vhosts/x0-static/static/

# copy x0 logo
COPY ./x0/image/x0-logo-small.png /var/www/vhosts/x0-static/image/x0-logo.png

# configure apache virtual host
COPY ./x0/config/vhost-x0-static.conf /etc/apache2/sites-available/x0-static.conf

# disable default vhost, enable x0 vhost
RUN a2dissite 000-default.conf && \
    a2ensite x0-static.conf

CMD ["apache2ctl", "-D", "FOREGROUND"]

EXPOSE 80

LABEL org.opencontainers.image.source=https://github.com/WEBcodeX1/x0
LABEL org.opencontainers.image.description="x0 docker container image - static variant"
LABEL org.opencontainers.image.licenses=AGPL-3.0-or-later
