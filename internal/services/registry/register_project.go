package registry

import (
	"context"
	"fmt"

	"proto-registry/internal/models"
)

// RegisterProject регистрирует проект
func (s *Service) RegisterProject(ctx context.Context, project *models.Project) error {
	if err := s.projectsRepo.UpsertProject(ctx, project); err != nil {
		return fmt.Errorf("projectsRepo.UpsertProject: %w", err)
	}

	return nil
}
