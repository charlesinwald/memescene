CREATE TABLE templates (
	id          text PRIMARY KEY,
	name        text NOT NULL,
	tags        text[] NOT NULL,
	image_uri   text NOT NULL
);
