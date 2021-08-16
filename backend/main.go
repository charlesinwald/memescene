package main

import (
	"flag"
	"fmt"
	"github.com/cinwald/memescene/backend/server"
	"log"
)

var (
	port = flag.Int("port", 13337, "port to serve from")

	debug = flag.Bool("debug", false, "Whether to log extra for debugging")
)

func main() {
	flag.Parse()

	srv, err := server.New(*port, *debug)
	if err != nil {
		log.Fatalf("Failed to create server: %v", err)
	}

	fmt.Printf("Serving at http://localhost:%v\n", *port)
	log.Fatal(srv.ListenAndServe())
}
