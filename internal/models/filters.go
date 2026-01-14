package models

type Pagination struct {
	Limit  uint64
	Offset uint64
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
