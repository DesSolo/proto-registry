package registry

import (
	"context"
	"errors"
	"fmt"

	"proto-registry/internal/models"
	"proto-registry/internal/repositories"
)

// RegisterFiles регистирует файлы
func (s *Service) RegisterFiles(ctx context.Context, version *models.Version, files []*models.File) error {
	if err := s.versionsRepo.UpsertVersion(ctx, version); err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return ErrNotFound
		}

		return fmt.Errorf("versionsRepo.UpsertVersion: %w", err)
	}

	if err := s.filesRepo.DeleteFilesForVersion(ctx, version.ID); err != nil {
		return fmt.Errorf("filesRepo.DeleteFilesForVersion: %w", err)
	}

	for _, file := range files {
		file.VersionID = version.ID

		if err := s.filesRepo.CreateFile(ctx, file); err != nil {
			return fmt.Errorf("filesRepo.CreateFile: %w", err)
		}
	}

	return nil
}
