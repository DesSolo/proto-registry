package registry

import (
	"context"
	"fmt"

	"proto-registry/internal/models"
)

// GetVersions возвращает список версий
func (s *Service) GetVersions(ctx context.Context, filter models.GetVersionsFilter) ([]*models.Version, error) {
	versions, err := s.versionsRepo.GetVersions(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("versionsRepo.GetVersions: %w", err)
	}

	return versions, nil
}
