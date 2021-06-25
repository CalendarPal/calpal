ALTER TABLE IF EXISTS tasks

ADD COLUMN IF NOT EXISTS description VARCHAR DEFAULT 'Give the task more details, future you will be glad';