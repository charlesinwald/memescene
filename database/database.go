package database

import (
	"context"
	"fmt"
	"github.com/cinwald/memescene/database/template"
	"github.com/jackc/pgx/v4/pgxpool"
	"github.com/lithammer/shortuuid"
	"io"
	"os"
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