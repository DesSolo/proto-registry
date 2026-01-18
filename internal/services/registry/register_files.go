package registry

import (
	"context"
	"errors"
	"fmt"

	"proto-registry/internal/models"
	"proto-registry/internal/repositories"
	"proto-registry/internal/uow"
)

// RegisterFiles регистирует файлы
func (s *Service) RegisterFiles(ctx context.Context, version *models.Version, files []*models.File) error {
	err := s.uow.Do(ctx, func(repos uow.Repositories) error {
		if err := repos.Versions.UpsertVersion(ctx, version); err != nil {
			if errors.Is(err, repositories.ErrNotFound) {
				return ErrNotFound
			}

			return fmt.Errorf("repos.Versions.UpsertVersion: %w", err)
		}

		if err := repos.Files.DeleteFilesForVersion(ctx, version.ID); err != nil {
			return fmt.Errorf("repos.Files.DeleteFilesForVersion: %w", err)
		}

		for _, file := range files {
			file.VersionID = version.ID

			if err := repos.Files.CreateFile(ctx, file); err != nil {
				return fmt.Errorf("repos.Files.CreateFile: %w", err)
			}
		}

		return nil
	})

	if err != nil {
		return fmt.Errorf("uow.Do: %w", err)
	}

	return nil
}
