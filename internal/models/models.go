package models

import "time"

type Project struct {
	ID        int64
	Name      string
	UpdatedAt time.Time
}

type RefType string

const (
	RefTypeUnknown RefType = "unknown"
	RefTypeBranch  RefType = "branch"
	RefTypeTag     RefType = "tag"
)

type Version struct {
	ID        int64
	ProjectID int64
	Ref       string
	RefType   RefType
	Commit    string
	CreatedAt time.Time
	UpdatedAt time.Time
}

type FileType string

const (
	FileTypeUnknown FileType = "unknown"
	FileTypeProto   FileType = "proto"
	FileTypeOpenAPI FileType = "openapi"
)

type File struct {
	ID        int64
	VersionID int64
	FileType  FileType
	Path      string
	CreatedAt time.Time
}

type FileContent struct {
	Content []byte
}
