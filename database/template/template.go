package template

type Template struct {
	// ID is a UUID.
	ID string `json:",omitempty"`

	// Name is the name / title of a template.
	Name string `json:",omitempty"`

	// ImageURI is where the template's underlying image is stored.
	// For example, "template/123.jpg" for a file stored
	ImageURI string `json:",omitempty"`

	Tags []string `json:",omitempty"`
}
