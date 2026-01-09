package registry

import (
	"context"

	"proto-registry/internal/models"
)

type GitlabClient interface {
	GetRepositoryFile(ctx context.Context, project, filePath, ref string) ([]byte, error)
}

type ProjectsRepository interface {
	GetProjects(ctx context.Context, filter models.GetProjectsFilter) ([]*models.Project, error)
	UpsertProject(ctx context.Context, project *models.Project) error
}

type VersionsRepository interface {
	GetVersions(ctx context.Context, filter models.GetVersionsFilter) ([]*models.Version, error)
	UpsertVersion(ctx context.Context, version *models.Version) error
}

type FilesRepository interface {
	GetFiles(ctx context.Context, filter models.GetFilesFilter) ([]*models.File, error)
	DeleteFilesForVersion(ctx context.Context, versionID int64) error
	CreateFile(ctx context.Context, file *models.File) error
}

type Service struct {
	gitlabClient GitlabClient

	projectsRepo ProjectsRepository
	versionsRepo VersionsRepository
	filesRepo    FilesRepository
}

func NewService(
	gitlabClient GitlabClient,
	projectsRepo ProjectsRepository,
	versionsRepo VersionsRepository,
	filesRepo FilesRepository,
) *Service {
	return &Service{
		gitlabClient: gitlabClient,
		projectsRepo: projectsRepo,
		versionsRepo: versionsRepo,
		filesRepo:    filesRepo,
	}
}
