DROP TABLE IF EXISTS schedules;

CREATE TABLE IF NOT EXISTS schedules(
   schedule_id SERIAL PRIMARY KEY,
   userid INT NOT NULL,
   day INT NOT NULL,
   start_at VARCHAR(250) NOT NULL,
   end_at VARCHAR(250) NOT NULL,
   created TIME DEFAULT now()
);

DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS users(
   user_id SERIAL PRIMARY KEY,
   firstname VARCHAR(250) NOT NULL,
   lastname VARCHAR(250) NOT NULL,
   email VARCHAR(250) NOT NULL,
   password VARCHAR(250) NOT NULL,
   created TIME DEFAULT now()
);

