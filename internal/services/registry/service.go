package registry

import (
	"context"

	"proto-registry/internal/repositories"
	"proto-registry/internal/uow"
)

type GitlabClient interface {
	GetRepositoryFile(ctx context.Context, project, filePath, ref string) ([]byte, error)
}

type UnitOfWork interface {
	Do(ctx context.Context, fn func(repos uow.Repositories) error) error
}

type Service struct {
	gitlabClient GitlabClient

	projectsRepo repositories.ProjectsRepository
	versionsRepo repositories.VersionsRepository
	filesRepo    repositories.FilesRepository

	uow UnitOfWork
}

func NewService(
	gitlabClient GitlabClient,
	projectsRepo repositories.ProjectsRepository,
	versionsRepo repositories.VersionsRepository,
	filesRepo repositories.FilesRepository,
	uow UnitOfWork,
) *Service {
	return &Service{
		gitlabClient: gitlabClient,
		projectsRepo: projectsRepo,
		versionsRepo: versionsRepo,
		filesRepo:    filesRepo,
		uow:          uow,
	}
}
