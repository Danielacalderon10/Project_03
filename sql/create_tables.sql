DROP TABLE IF EXISTS schedules;

CREATE TABLE IF NOT EXISTS schedules(
   user_id SERIAL PRIMARY KEY,
   day INT NOT NULL,
   start_at VARCHAR(250) NOT NULL,
   end_at VARCHAR(250) NOT NULL,
   created TIME DEFAULT now()
);

