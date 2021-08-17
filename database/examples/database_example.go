// database_example demonstrates adding, updating, and selecting templates.
// It requires an existing database. The config to connect to the database is set through flags,
// but defaults to a database named memescene. User and password must be provided.
//
// Sample execution:
// go build
// ./database_example --db_user=foo --db_pass=bar
//
// Sample output:
// 	Creating template
// 	Wrote template to database: &{ID:zNr8sdswmmamFBDQNbDLdF Name:TemplateName ImageURI:templates/zNr8sdswmmamFBDQNbDLdF.png Tags:[cats funny]}
// 	Updating template to include kitten tag
// 	Updated template successful
// 	Retrieving template by ID
//  Successfully found original template with updated tag
package main

import (
	"context"
	"flag"
	"fmt"
	"github.com/charlesinwald/memescene/database"
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
	fmt.Println("Creating template")
	t, err := db.CreateTemplate(ctx, "TemplateName", []string{"funny", "cats"}, ".png", nil, false)
	if err != nil {
		log.Fatalf("Failed to create template: %v\n", err)
	}
	fmt.Printf("Wrote template to database: %+v\n", t)

	fmt.Println("Updating template to include kitten tag")
	t.Tags = append(t.Tags, "kitten")
	err = db.UpdateTemplate(ctx, t)
	if err != nil {
		log.Fatalf("Failed to update template: %v\n", err)
	}
	fmt.Println("Updated template successful")

	fmt.Println("Retrieving template by ID")
	got, err := db.GetTemplates(ctx, []string{t.ID})
	if err != nil {
		log.Fatalf("Failed to retrieve template: %v\n", err)
	}
	if len(got) != 1 {
		log.Fatalf("Got %d templates, expected 1\n", len(got))
	}
	if !reflect.DeepEqual(t, got[0]) {
		log.Fatalf("Got template not equal to expected\nOriginal: %+v\nUpdated: %+v\n", t, got[0])
	}
	fmt.Println("Successfully found original template with updated tag")
}
