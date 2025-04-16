FROM postgres:15

COPY ../init_scripts/init.sql /docker-entrypoint-initdb.d/
