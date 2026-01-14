package registry

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	"proto-registry/internal/services/registry"
	desc "proto-registry/pkg/api/registry"
)

// GetProject Детальная информация о проекте
func (i *Implementation) GetProject(ctx context.Context, req *desc.GetProjectRequest) (*desc.GetProjectResponse, error) {
	project, err := i.service.GetProject(ctx, req.GetId())
	if err != nil {
		if errors.Is(err, registry.ErrNotFound) {
			return nil, status.Error(codes.NotFound, err.Error()) // nolint:wrapcheck
		}

		slog.ErrorContext(ctx, "service.GetProject", "err", err)
		return nil, fmt.Errorf("service.GetProject: %w", err)
	}

	return &desc.GetProjectResponse{
		Project: convertProjectToDesc(project),
	}, nil
}
