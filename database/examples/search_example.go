// search_example demonstrates adding and searching for templates.
// It requires an existing database. The config to connect to the database is set through flags,
// but defaults to a database named memescene. User and password must be provided.
//
// Sample execution:
//  go build
//  ./search_example --db_user=foo --db_pass=bar
//
// Sample output:
// 	Creating templates
// 	Using name: "GC6aX7KbDYkcCtAxynG8zg"
// 	Successfully found template when searching by name: "6aX7Kb"
// 	Result: &{ID:3g9DrdekNZC7Gh7HBvCZy6 Name:GC6aX7KbDYkcCtAxynG8zg ImageURI:templates/3g9DrdekNZC7Gh7HBvCZy6.png Tags:[cats funny]}
// 	Found 25 results for tag "funny"
package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/charlesinwald/memescene/database"
	"github.com/lithammer/shortuuid"
	"log"
	"reflect"
)

var(
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

	db, err := database.New(ctx, dbConfig)
	if err != nil {
		log.Fatalf("Failed to open database: %v\n", err)
	}
	fmt.Println("Creating templates")
	name := shortuuid.New()
	fmt.Printf("Using name: %q\n", name)
	t, err := db.CreateTemplate(ctx, name, []string{"funny", "cats"}, ".png", nil, false)
	if err != nil {
		log.Fatalf("Failed to create template: %v\n", err)
	}

	for i := 0; i < 5; i++ {
		_, err := db.CreateTemplate(ctx, fmt.Sprintf("other%d name", i), []string{"meh"}, "", nil, false)
		if err != nil {
			log.Fatalf("Failed to create template: %v\n", err)
		}
	}

	// Search by name substring
	q := name[2:8]
	got, err := db.SearchTemplates(ctx, q)
	if err != nil {
		log.Fatalf("Failed to find template: %v", err)
	}
	if len(got) != 1 {
		log.Fatalf("Found %d results, expected 1\n", len(got))
	}
	if !reflect.DeepEqual(t, got[0]) {
		log.Fatalf("Got template not equal to expected\nOriginal: %+v\nUpdated: %+v\n", t, got[0])
	}
	fmt.Printf("Successfully found template when searching by name: %q\nResult: %+v\n", q, got[0])

	// Search by tag
	q = "funny"
	got, err = db.SearchTemplates(ctx, q)
	if err != nil {
		log.Fatalf("Failed to find template: %v", err)
	}
	if len(got) == 0 {
		log.Fatalf("Failed to find templates for tag %q\n", q)
	}
	fmt.Printf("Found %d results for tag %q", len(got), q)
}
