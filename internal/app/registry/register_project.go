package registry

import (
	"context"
	"fmt"

	"google.golang.org/protobuf/types/known/emptypb"

	"proto-registry/internal/models"
	desc "proto-registry/pkg/api/registry"
)

// RegisterProject Зарегистрировать проект
func (i *Implementation) RegisterProject(ctx context.Context, req *desc.RegisterProjectRequest) (*emptypb.Empty, error) {
	if err := i.service.RegisterProject(ctx, convertProjectToModel(req.GetProject())); err != nil {
		return nil, fmt.Errorf("service.RegisterProject: %w", err)
	}

	return nil, nil
}

func convertProjectToModel(project *desc.Project) *models.Project {
	return &models.Project{
		ID:   project.GetId(),
		Name: project.GetName(),
	}
}
