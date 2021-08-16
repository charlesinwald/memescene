# Database Setup

## Windows

### Installation / Account Setup

1. Install `postgresql-13.3-2-windows-x64.exe`. https://www.postgresql.org/download/windows/
    1. Record the password you create. This is the password for the database superuser, username "postgres".
1. Add the `bin` directory to `PATH`. By default: `C:\Program Files\PostgreSQL\13\bin`
1. Open a terminal (recommended if on windows to use `cmd.exe` over git bash / mingw, as there seem to be issues with buffered text not displaying.
1. Create a user account to own the database:
    1. `psql --username=postgres`
	1. Create account: `CREATE USER memelord WITH ENCRYPTED PASSWORD 'password';`
	1. Give permissions. https://www.postgresql.org/docs/current/sql-alteruser.html
        `ALTER USER memelord WITH CREATEDB CREATEROLE`
	1. (optional) Use `ALTER USER` to update other settings, like updating password with: `ALTER USER memelord WITH PASSWORD 'foo';`
	1. (optional) View current users/roles with `\du`
1. Create individual user account
    ```
	psql --username=postgres
	CREATE USER omar WITH ENCRYPTED PASSWORD 'password';
	ALTER USER memelord WITH CREATEDB CREATEROLE
	```
1. Add the user to the memelord group/role.
	`GRANT memelord TO omar;`

### Database / Table Setup

1. Create the database. https://www.postgresql.org/docs/current/sql-createdatabase.html
    From shell, run: `createdb --echo --username=omar --owner=memelord memescene "Metadata about memes"`
1. (optional) View databases with `\l` after logging in with psql.
1. (optional) Delete databases with `DROP DATABASE "db_name";`. Note that quotes around the name are required.
1. Create a table. https://www.postgresql.org/docs/current/sql-createtable.html
    ```
	$ psql --username=omar memescene
	$ CREATE TABLE templates (
		id          varchar(64) CONSTRAINT firstkey PRIMARY KEY,
		name        varchar(512) NOT NULL,
		tags        varchar(1024) NOT NULL,
		image_uri   varchar(512) NOT NULL
	);
	```
	Note that the line of text for the final field must not end with a comma.
