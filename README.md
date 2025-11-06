CREATE TABLE patients ( 
    p_id SERIAL PRIMARY KEY,
    p_email VARCHAR(60) NOT NULL UNIQUE,
    p_password VARCHAR(60) NOT NULL
);

CREATE TABLE "session" (
    "sid" VARCHAR NOT NULL,
    "sess" JSON NOT NULL,
    "expire" TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL
);

CREATE TABLE doctors ( 
    d_id SERIAL PRIMARY KEY,
    d_email VARCHAR(60) NOT NULL UNIQUE,
    d_password VARCHAR(60) NOT NULL
);