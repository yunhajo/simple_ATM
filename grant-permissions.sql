DROP USER IF EXISTS 'appadmin'@'localhost';
CREATE USER 'appadmin'@'localhost' IDENTIFIED WITH caching_sha2_password BY 'adminpw';
GRANT ALL PRIVILEGES ON bank.* TO 'appadmin'@'localhost';
FLUSH PRIVILEGES;