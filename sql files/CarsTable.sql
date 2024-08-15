
CREATE TABLE cars (
    id SERIAL PRIMARY KEY,
    make VARCHAR(255),
    model VARCHAR(255),
    year INT,
    color VARCHAR(100),
    description TEXT,
    cost NUMERIC(10, 2)
);

CREATE TABLE users (
	id serial PRIMARY KEY,
	username VARCHAR(200) NOT NULL UNIQUE,
	password VARCHAR(100) NOT NULL
);

select * from cars;
select * from users;

drop table cars;