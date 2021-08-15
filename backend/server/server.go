// server exposes an HTTP server.
package server

import (
	"fmt"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"github.com/omustardo/memescene/database"
	"net/http"
	"time"
)

type Server struct {
	httpsrv *http.Server
	router  *mux.Router

	db *database.Database
}

// New creates a new Server.
func New(port int, debugLogging bool) (*Server, error) {
	r := mux.NewRouter()
	// TODO: I'm unclear on the risks of CORS. I recall needing to use it for local frontend development, but it should
	//   be fine to remove (or restrict somehow) once this is running in "production".
	cors := handlers.CORS(
		handlers.AllowedHeaders([]string{"*"}),
		handlers.AllowedOrigins([]string{"*"}),
		handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"}))
	r.Use(cors)
	srv := &Server{
		router:   r,
		httpsrv: &http.Server{
			Handler:      r,
			Addr:         fmt.Sprintf(":%d", port),
			WriteTimeout: 15 * time.Second,
			ReadTimeout:  15 * time.Second,
		},
		db: database.New(),
	}
	setRoutes(r, srv)

	// TODO(long_term): Only support HTTPS. Enforce by adding `.Schemes("http", "https")` somewhere

	if debugLogging {
		r.Use(loggingMiddleware) // Intercept all other handlers in order to debug log.
	}
	return srv, nil
}

func setRoutes(r *mux.Router, srv *Server) {
	// TODO: Require json content for relevant endpoints. r.HeadersRegexp("Content-Type", "application/json")

	// API Documentation
	r.Path("/api").Methods("GET").HandlerFunc(func(writer http.ResponseWriter, request *http.Request) {
		r.Walk(func(route *mux.Route, router *mux.Router, ancestors []*mux.Route) error {
			t, err := route.GetPathTemplate()
			if err != nil {
				return err
			}

			_, err = fmt.Fprintf(writer, "%v\n", t)
			return err
		})
	})

	// Template API
	// Input is json with field "ids" and a comma separated list of template ids.
	r.Path("/api/template/get").Methods("GET").HandlerFunc(srv.TemplateGetHandler)
	// Input is a form, with a file upload, a field called "name", and a CSV field called "tags".
	// A json of the generated template is returned.
	r.Path("/api/template/create").Methods("POST").HandlerFunc(srv.TemplateCreateHandler)
	// Input is a json template. The key field is the ID, which is used to update the template with that ID.
	r.Path("/api/template/update").Methods("POST").HandlerFunc(srv.TemplateUpdateHandler)
	// Input is a query string in the param "q". Example: "?q=tag:funny,cats"
	// A json of templates is returned.
	r.Path("/api/template/search").Methods("GET").Queries("q", "").HandlerFunc(srv.TemplateSearchHandler)
}

// loggingMiddleware logs all URIs as they are received.
func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		formatStr := "2006-01-02_15:04:05" // https://gobyexample.com/time-formatting-parsing
		fmt.Printf("%v: %v : %v\n", time.Now().Format(formatStr), r.RemoteAddr, r.RequestURI)
		// Call the next handler.
		next.ServeHTTP(w, r)
	})
}

func (srv *Server) ListenAndServe() error {
	return srv.httpsrv.ListenAndServe()
}

type serverError struct {
	// Status is an HTTP status code.
	Status  int    `json:"status"`
	Message string `json:"message"`
}
