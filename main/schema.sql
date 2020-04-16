CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE,
    email VARCHAR(255),
    email_verified BOOLEAN,
    date_created DATE,
    last_login Date
);

CREATE TABLE posts (
    pid SERIAL PRIMARY KEY,
    title VARCHAR(255),
    body VARCHAR,
    search_vector TSVECTOR,
    user_id INT REFERENCES users(id),
    auther VARCHAR REFERENCES users(username), 
    date_created TIMESTAMP
);

CREATE TABLE comments (
    cid SERIAL PRIMARY KEY,
    comment VARCHAR(255),
    auther VARCHAR REFERENCES users(username), 
    user_id INT REFERENCES users(id),
    post_id INT REFERENCES posts(pid),
    date_created TIMESTAMP
);