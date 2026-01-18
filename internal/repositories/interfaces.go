package repositories

import (
	"context"

	"proto-registry/internal/models"
)

type ProjectsRepository interface {
	GetProjects(ctx context.Context, filter models.GetProjectsFilter) ([]*models.Project, error)
	GetProject(ctx context.Context, id int64) (*models.Project, error)
	UpsertProject(ctx context.Context, project *models.Project) error
}

type VersionsRepository interface {
	GetVersions(ctx context.Context, filter models.GetVersionsFilter) ([]*models.Version, error)
	GetVersion(ctx context.Context, id int64) (*models.Version, error)
	UpsertVersion(ctx context.Context, version *models.Version) error
}

type FilesRepository interface {
	GetFiles(ctx context.Context, filter models.GetFilesFilter) ([]*models.File, error)
	DeleteFilesForVersion(ctx context.Context, versionID int64) error
	CreateFile(ctx context.Context, file *models.File) error
}
