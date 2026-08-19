FROM ubuntu:25.10
MAINTAINER Claus Prüfer

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get -qq update -y && \
    apt-get -qq install -y apache2

# Copy x0 JS source and static assets for the build step
COPY www/ /build/www/

# Copy static deployment directory (contains index.html and data/ templates)
COPY static/ /build/static/

# Copy the build script
COPY bin/build-static.sh /build/bin/build-static.sh

# Run build: populate /build/static with JS files and web assets from /build/www
RUN chmod +x /build/bin/build-static.sh && \
    /build/bin/build-static.sh /build/static

# Deploy static files to the Apache document root
RUN mkdir -p /var/www/vhosts/x0-static && \
    cp -ra /build/static/. /var/www/vhosts/x0-static/

# Configure Apache virtual host
COPY conf/vhost-x0-static.conf /etc/apache2/sites-available/x0-static.conf

RUN a2dissite 000-default.conf && \
    a2ensite x0-static.conf && \
    a2enmod headers allowmethods

CMD ["apache2ctl", "-D", "FOREGROUND"]

EXPOSE 80

LABEL org.opencontainers.image.source=https://github.com/clauspruefer/x0
LABEL org.opencontainers.image.description="x0 docker container image - static variant"
LABEL org.opencontainers.image.licenses=AGPL-3.0-or-later
