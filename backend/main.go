package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/cinwald/memescene/backend/server"
	"github.com/cinwald/memescene/database"
	"log"
)

var (
	port = flag.Int("port", 13337, "port to serve from")

	debug = flag.Bool("debug", false, "Whether to log extra for debugging")

	dbPort = flag.Int("db_port", 5432, "port to connect to the database")
	dbName = flag.String("db_name", "memescene", "database name (default: memescene)")
	dbURL = flag.String("db_url", "localhost", "database url (default: localhost)")
	dbUser = flag.String("db_user", "", "user to connect to the database as")
	dbPass = flag.String("db_pass", "", "password for the db_user")
)

func main() {
	flag.Parse()
	ctx := context.Background()

	dbConfig := &database.ConnConfig{
		Username: *dbUser,
		Password: *dbPass,
		URL: *dbURL,
		DBName: *dbName,
		Port: *dbPort,
	}

	srv, err := server.New(ctx, *port, *debug, dbConfig)
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}
	defer srv.Close()

	fmt.Printf("Serving at http://localhost:%v\n", *port)
	log.Fatal(srv.ListenAndServe())
}
