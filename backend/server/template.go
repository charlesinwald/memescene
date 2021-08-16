package server

import (
	"bytes"
	"encoding/json"
	"fmt"
	"github.com/charlesinwald/memescene/database/template"
	"net/http"
	"path/filepath"
	"strings"
)

const maxTemplateSize = 1024 * 1024 * 16; // 16 MB

func (srv *Server) TemplateGetHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	rawIDs := r.URL.Query().Get("ids")
	if rawIDs == "" {
		http.Error(w, "no template ids specified", http.StatusBadRequest)
		return
	}

	ids := strings.Split(rawIDs, ",")
	templates, err := srv.db.GetTemplates(ids)
	if err != nil {
		http.Error(w, fmt.Sprintf("failed to get template(s): %v", err), http.StatusInternalServerError)
		return
	}

	// Encode to a buffer so encoding errors don't result in writing partial data over HTTP.
	buf := &bytes.Buffer{}
	if err := json.NewEncoder(buf).Encode(templates); err != nil {
		http.Error(w, fmt.Sprintf("error encoding json: %v", err), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(buf.Bytes()) // TODO: Is it worth handling these errors?
}


func (srv *Server) TemplateCreateHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	r.Body = http.MaxBytesReader(w, r.Body, maxTemplateSize)
	if err := r.ParseMultipartForm(maxTemplateSize); err != nil {
		http.Error(w, "The uploaded content is too big. Please choose an file that's less than 16MB in size", http.StatusBadRequest)
		return
	}

	file, handler, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	extension := filepath.Ext(handler.Filename)
	name := r.FormValue("name")
	tags := strings.Split(r.FormValue("tags"), ",")
	t, err := srv.db.CreateTemplate(name, tags, extension, file)
	if err != nil {
		http.Error(w, fmt.Sprintf("error creating template: %v", err), http.StatusInternalServerError)
	}

	// Encode to a buffer so encoding errors don't result in writing partial data over HTTP.
	buf := &bytes.Buffer{}
	if err := json.NewEncoder(buf).Encode(t); err != nil {
		http.Error(w, fmt.Sprintf("error encoding json: %v", err), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(buf.Bytes()) // TODO: Is it worth handling these errors?
}

func (srv *Server) TemplateUpdateHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	var t template.Template
	if err := json.NewDecoder(r.Body).Decode(&t); err != nil {
		w.WriteHeader(http.StatusBadRequest)
		_ = json.NewEncoder(w).Encode(&serverError{
			Status:  http.StatusBadRequest,
			Message: fmt.Sprintf("failed to decode provided template to internal Template struct: %v", err),
		})
		return
	}
	if err := srv.db.UpdateTemplate(&t); err != nil {
		http.Error(w, fmt.Sprintf("failed to update provided template: %v", err), http.StatusInternalServerError)
		return
	}
}

func (srv *Server) TemplateSearchHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	rawQuery := r.URL.Query().Get("q")
	if len(rawQuery) == 0 {
		_, _ = w.Write([]byte("{}"))
		return
	}
	// TODO: Implement parsing a search query and finding results for it.
	templates, err := srv.db.GetTemplates(nil)
	if err != nil {
		http.Error(w, fmt.Sprintf("failed to get template(s): %v", err), http.StatusInternalServerError)
		return
	}

	// Encode to a buffer so encoding errors don't result in writing partial data over HTTP.
	buf := &bytes.Buffer{}
	if err := json.NewEncoder(buf).Encode(templates); err != nil {
		http.Error(w, fmt.Sprintf("error encoding json: %v", err), http.StatusInternalServerError)
		return
	}
	_, err = w.Write(buf.Bytes()) // TODO: Is it worth handling these errors?
}
