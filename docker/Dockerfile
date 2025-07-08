FROM bannsec/edex-ui-docker:latest

# Change permissions for the GeoLite2 database files to be world-readable
# This resolves the EACCES: permission denied errors for the 'edex' user
RUN chmod a+r /opt/edex-ui/src/node_modules/geolite2-redist/dbs/GeoLite2-Country.mmdb && \
    chmod a+r /opt/edex-ui/src/node_modules/geolite2-redist/dbs/GeoLite2-City.mmdb && \
    chmod a+r /opt/edex-ui/src/node_modules/geolite2-redist/dbs/GeoLite2-ASN.mmdb