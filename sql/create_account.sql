DROP USER IF EXISTS 'simonwang'@'localhost';
DROP DATABASE IF EXISTS simonwangdb;
CREATE DATABASE simonwangdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'simonwang'@'localhost' IDENTIFIED WITH mysql_native_password BY '961002';
GRANT SELECT, INSERT, DELETE, UPDATE ON simonwangdb.* TO 'simonwang'@'localhost';
