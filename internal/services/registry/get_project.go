package registry

import (
	"context"
	"errors"
	"fmt"

	"proto-registry/internal/models"
	"proto-registry/internal/repositories"
)

// GetProject возвращает проект по id
func (s *Service) GetProject(ctx context.Context, id int64) (*models.Project, error) {
	project, err := s.projectsRepo.GetProject(ctx, id)
	if err != nil {
		if errors.Is(err, repositories.ErrNotFound) {
			return nil, ErrNotFound
		}

		return nil, fmt.Errorf("projectsRepo.GetProject: %w", err)
	}

	return project, nil
}
