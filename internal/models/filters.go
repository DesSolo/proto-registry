package models

type Pagination struct {
	Limit  int64
	Offset int64
}

type GetProjectsFilter struct {
	Pagination
	Name *string
}

type GetVersionsFilter struct {
	Pagination
	ProjectID int64
}

type GetFilesFilter struct {
	Pagination
	VersionID int64
}
