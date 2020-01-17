USE demo;

CREATE TABLE `owner` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(50),
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE `pet` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(50),
    `breed` varchar(50),
    `owner` integer,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (owner) REFERENCES owner(id)
);

INSERT INTO owner (id, name) values (1, 'Dave');
INSERT INTO owner (id, name) values (2, 'John');
INSERT INTO pet (name, breed, owner) values ('rover', 'dog', 1);
INSERT INTO pet (name, breed, owner) values ('fido', 'dog', 1);
INSERT INTO pet (name, breed, owner) values ('sherlock', 'cat', 2);