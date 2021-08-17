CREATE TABLE templates (
	id          varchar(64) PRIMARY KEY,
	name        varchar(512) NOT NULL,
	tags        varchar(1024) NOT NULL,
	image_uri   varchar(1024) NOT NULL
);
