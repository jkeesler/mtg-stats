create extension dblink;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_database WHERE datname = 'stats'
    ) THEN
        PERFORM dblink_exec('dbname=postgres', 'CREATE DATABASE stats');
    END IF;
END $$;

GRANT ALL PRIVILEGES ON DATABASE stats TO admin;