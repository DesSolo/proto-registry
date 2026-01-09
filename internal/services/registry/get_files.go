package registry

import (
	"context"
	"fmt"

	"proto-registry/internal/models"
)

// GetFiles возвращает список файлов
func (s *Service) GetFiles(ctx context.Context, filter models.GetFilesFilter) ([]*models.File, error) {
	files, err := s.filesRepo.GetFiles(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("filesRepo.GetFiles: %w", err)
	}

	return files, nil
}
