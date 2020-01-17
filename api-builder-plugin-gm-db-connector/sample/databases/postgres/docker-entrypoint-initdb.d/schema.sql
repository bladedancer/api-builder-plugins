CREATE OR REPLACE FUNCTION trigger_set_modified()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_updated = NOW();
  RETURN NEW;
END;$$LANGUAGE 'plpgsql';

-- Address table
CREATE TABLE address (
    id serial PRIMARY KEY,
    street1 varchar(50),
    street2 varchar(50),
    street3 varchar(50),
    state varchar(50),
    postcode varchar(50),
    country varchar(50),
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_address_modified
BEFORE UPDATE ON address
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_modified();

-- Person table
CREATE TABLE person (
    id serial PRIMARY KEY,
    gn varchar(50),
    sn varchar(50),
    age integer,
    address integer REFERENCES address(id),
    created_on TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TRIGGER set_person_modified
BEFORE UPDATE ON person
FOR EACH ROW
EXECUTE PROCEDURE trigger_set_modified();

-- Bootstrap some data
INSERT INTO address(street1, state, postcode, country) VALUES ('O Connell St', 'Dublin', 'D1', 'Ireland');
INSERT INTO address(street1, state, postcode, country) VALUES ('Broadway', 'New York', '10036', 'USA');
INSERT INTO person(gn, sn, age, address) VALUES ('Bob', 'Smith', 32, 1);
INSERT INTO person(gn, sn, age, address) VALUES ('Fred', 'Smith', 30, 1);
INSERT INTO person(gn, sn, age, address) VALUES ('Dave', 'Jones', 41, 2);