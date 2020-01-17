USE demo;

CREATE TABLE `pet` (
    `id` INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    `name` varchar(50),
    `breed` varchar(50),
    `ownerId` integer,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

INSERT INTO pet (name, breed, ownerId) values ('rover', 'dog', 1);
INSERT INTO pet (name, breed, ownerId) values ('fido', 'dog', 1);
INSERT INTO pet (name, breed, ownerId) values ('sherlock', 'cat', 2);