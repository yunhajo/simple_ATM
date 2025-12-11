SET GLOBAL local_infile = 1;
DROP DATABASE IF EXISTS bank;
CREATE DATABASE bank;
USE bank;
source setup.sql;
source load-data.sql;
source grant-permissions.sql;