package database

import (
	"context"
	"fmt"
	"github.com/charlesinwald/memescene/database/template"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/lithammer/shortuuid"
	"io"
	"os"
	"sort"
	"strings"
)

// ConnConfig contains enough information to generate a postgres database connection URL.
type ConnConfig struct {
	Username, Password, URL, DBName string
	Port int
}

// ConnString is suitable for providing to a pgxpool Connect function.
// Example output:
// "postgres://jack:secret@pg.example.com:5432/mydb?pool_max_conns=100"
func (cc ConnConfig) ConnString() string {
	return fmt.Sprintf("postgres://%s:%s@%s:%d/%s?pool_max_conns=100", cc.Username, cc.Password, cc.URL, cc.Port, cc.DBName)
}

type Database struct {
	dbPool *pgxpool.Pool

	closeFunc func()
}

func (db *Database) Close() {
	if db.closeFunc != nil {
		db.closeFunc()
	}
}

func New(ctx context.Context, config *ConnConfig) (*Database, error) {
	dbPool, err := pgxpool.Connect(ctx, config.ConnString())
	if err != nil {
		return nil, fmt.Errorf("unable to connect to database: %v", err)
	}

	return &Database{
		dbPool: dbPool,
		closeFunc: dbPool.Close,
	}, nil
}

// GetTemplates returns all templates with the provided IDs. The return is all or none, so if any of the IDs are invalid,
// an error is returned.
func (db *Database) GetTemplates(ctx context.Context, ids []string) ([]*template.Template, error) {
	var out []*template.Template
	rows, err := db.dbPool.Query(ctx, "SELECT id, name, tags, image_uri FROM templates WHERE id = ANY($1)", ids)
	if err != nil {
		return nil, fmt.Errorf("error querying for provided template ids: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		t := new(template.Template)
		err = rows.Scan(&t.ID, &t.Name, &t.Tags, &t.ImageURI)
		if err != nil {
			return nil, fmt.Errorf("error decoding table row into a template: %v",  err)
		}
		out = append(out, t)
	}
	if len(out) != len(ids) {
		return nil, fmt.Errorf("found %d of %d requested IDs")
	}
	sort.Slice(out, func(i, j int) bool {
		return out[i].ID < out[j].ID
	})
	return out, nil
}

// CreateTemplate creates a new template.
// It generates a string UUID as the template ID, and writes the input data to a file named <uuid><extension>
// If extension is empty, it defaults to png.
// If writeToFile is false, it only creates the database entry. This may be useful for testing.
func (db *Database) CreateTemplate(ctx context.Context, name string, tags []string, extension string, data io.Reader, writeToFile bool) (*template.Template, error) {
	id := shortuuid.New()
	if extension == "" {
		extension = ".png"
	}
	uri := "templates/" + id + extension

	if writeToFile {
		f, err := os.OpenFile(uri, os.O_WRONLY|os.O_CREATE, 0777)
		if err != nil {
			return nil, fmt.Errorf("failed to open file: %v", err)
		}
		defer f.Close()
		_, err = io.Copy(f, data)
		if err != nil {
			return nil, fmt.Errorf("failed to save content: %v", err)
		}
	}

	// Minor protection against injection.
	name = strings.ReplaceAll(name, "\"", "'")
	name = strings.ReplaceAll(name, "<", "_")
	name = strings.ReplaceAll(name, ">", "_")

	tmpl := &template.Template{
			ID: id,
			Name: name,
			ImageURI: uri,
			Tags: cleanTags(tags),
		}
	_, err := db.dbPool.Exec(ctx, "INSERT INTO templates(id, name, tags, image_uri) values($1, $2, $3, $4)",
		tmpl.ID, tmpl.Name, tmpl.Tags, tmpl.ImageURI,
	)
	if err != nil {
		return nil, fmt.Errorf("failed to insert template into database: %v", err)
	}
	return tmpl, nil
}

func (db *Database) UpdateTemplate(ctx context.Context, t *template.Template) error {
	 t.Tags = cleanTags(t.Tags)
	_, err := db.dbPool.Exec(ctx, "UPDATE templates SET name = $2, tags = $3, image_uri = $4 WHERE id = $1",
		t.ID, t.Name, t.Tags, t.ImageURI,
	)
	if err != nil {
		return fmt.Errorf("failed to update template: %v", err)
	}
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
	sort.Strings(out)
	return out
}

// SearchTemplates looks for templates that either:
// 1. have names containing the full input search query.
// 2. contain tags which contain the full input search query
// TODO: This can be improved to match multiple tags, fuzzy matching, related terms, etc.
func (db *Database) SearchTemplates(ctx context.Context, rawQuery string) ([]*template.Template, error) {
	var out []*template.Template
	rows, err := db.dbPool.Query(ctx, `
SELECT id, name, tags, image_uri
FROM templates
--    STRPOS(str, substr)     
WHERE STRPOS(name, $1) > 0
  -- If any of the tags contain the string, it's good to go.
  OR (SELECT SUM(STRPOS(tag, $1)) > 0
      FROm UNNEST(tags) AS tag)
`, rawQuery)
	if err != nil {
		return nil, fmt.Errorf("error querying for provided template ids: %v", err)
	}
	defer rows.Close()
	for rows.Next() {
		t := new(template.Template)
		err = rows.Scan(&t.ID, &t.Name, &t.Tags, &t.ImageURI)
		if err != nil {
			return nil, fmt.Errorf("error decoding table row into a template: %v",  err)
		}
		out = append(out, t)
	}
	sort.Slice(out, func(i, j int) bool {
		return out[i].ID < out[j].ID
	})
	return out, nil
}
