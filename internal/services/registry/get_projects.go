package registry

import (
	"context"
	"fmt"

	"proto-registry/internal/models"
)

// GetProjects возвращает список проектов
func (s *Service) GetProjects(ctx context.Context, filter models.GetProjectsFilter) ([]*models.Project, error) {
	projects, err := s.projectsRepo.GetProjects(ctx, filter)
	if err != nil {
		return nil, fmt.Errorf("projectsRepo.GetProjects: %w", err)
	}

	return projects, nil
}
