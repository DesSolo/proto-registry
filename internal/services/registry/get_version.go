package registry

import (
	"context"
	"errors"
	"fmt"

	"proto-registry/internal/models"
	"proto-registry/internal/repositories"
)

// GetVersion возваращает версию по id
func (s *Service) GetVersion(ctx context.Context, id int64) (*models.Version, error) {
	version, err := s.versionsRepo.GetVersion(ctx, id)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, ErrNotFound
		}

		return nil, fmt.Errorf("versionsRepo.GetVersion: %w", err)
	}

	return version, nil
}
