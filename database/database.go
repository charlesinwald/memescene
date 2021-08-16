package database

import (
	"fmt"
	"github.com/lithammer/shortuuid"
	"github.com/cinwald/memescene/database/template"
	"io"
	"os"
	"strings"
)

type Database struct {
	// TODO: Implement this
}

func New() *Database {
	return &Database{}
}

func (db *Database) GetTemplates(ids []string) ([]*template.Template, error) {
	return []*template.Template{
		&template.Template{
			ID: "abc",
			Name: "Meme Name",
			ImageURI: "/templates/abc.jpg",
			Tags: []string{"funny"},
		},
	}, nil
}

// CreateTemplate creates a new template.
// It generates a string UUID, and writes the input data to a file named <uuid>.<extension>
// If extension is empty, it defauls to png.
func (db *Database) CreateTemplate(name string, tags []string, extension string, data io.Reader) (*template.Template, error) {
	id := shortuuid.New()
	if extension == "" {
		extension = ".png"
	}
	uri := "templates/" + id + extension

	f, err := os.OpenFile(uri, os.O_WRONLY|os.O_CREATE, 0777)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %v", err)
	}
	defer f.Close()
	_, err = io.Copy(f, data)
	if err != nil {
		return nil, fmt.Errorf("failed to save content: %v", err)
	}

	// Minor protection against injection.
	name = strings.ReplaceAll(name, "\"", "'")
	name = strings.ReplaceAll(name, "<", "_")
	name = strings.ReplaceAll(name, ">", "_")

	return &template.Template{
			ID: id,
			Name: name,
			ImageURI: uri,
			Tags: cleanTags(tags),
		}, nil
}

func (db *Database) UpdateTemplate(t *template.Template) error {
	 existing, err := db.GetTemplates([]string{t.ID})
	 if err != nil {
	 	return fmt.Errorf("error getting template %q: %v", t.ID, err)
	 }
	 // TODO: update the value of existing once storage is implemented.
	 // Remember to clean tags.
	 _ = existing
	 return nil
}

func cleanTags(tags []string) []string {
	var out []string
	for _, tag := range tags {
		tag = strings.ToLower(strings.TrimSpace(tag))
		if len(tag) < 3 {
			continue
		}
		out = append(out, tag)
	}
	return out
}