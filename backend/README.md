Backend HTTP server for memescene.

## Build & Run

```
$ go build main.go
$ ./main --db_name=memescene --db_url=localhost --db_port=5432 --db_user=omar --db_pass=pass
```

Note:
* If building and running on a fork of github.com/charlesinwald/memescene, you must update `go.mod` 
  in the base directory so it knows to replace import paths with the name of your forked repo.
* On windows, use `./main.exe`
* Execution will fail unless the database and user exist.

## API

### View endpoints

`r.Path("/api").Methods("GET")`

### Create Template

Input is triggered by an HTML form with a file upload. It expects a string field called "name" and a CSV field called "tags".

A json of the generated template is returned.

`r.Path("/api/template/create").Methods("POST")`

This can be triggered using `curl`:

`curl -v -F "name=test_name" -F "tags=foo,bar" -F file=@/c/Untitled.png localhost:13337/api/template/create`

Example output:

`{"ID":"Ef4oxU8dXkT8e7ZcgqQ2c","Name":"test_name","ImageURI":"templates/Ef4oxU8dXkT8e7ZcgqQ2c.png","Tags":["foo","bar"]}`

### Get Template(s)

Input is json with field "ids" and a comma separated list of template ids.

`r.Path("/api/template/get").Methods("GET")`

### Update Template

Input is a json template. The key field is the ID, which is used to update the template with that ID.

`r.Path("/api/template/update").Methods("POST")`

### Search Templates

Input is a query string in the param "q". Example: "?q=tag:funny,cats"

A json of templates is returned.

`r.Path("/api/template/search").Methods("GET").Queries("q", "")`
