CREATE TABLE IF NOT EXISTS projects (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY,
  userid uuid NOT NULL,
  project VARCHAR NOT NULL
);