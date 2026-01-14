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

// GetVersion Детальная информация о версии
func (i *Implementation) GetVersion(ctx context.Context, req *desc.GetVersionRequest) (*desc.GetVersionResponse, error) {
	version, err := i.service.GetVersion(ctx, req.GetId())
	if err != nil {
		if errors.Is(err, registry.ErrNotFound) {
			return nil, status.Error(codes.NotFound, err.Error()) // nolint:wrapcheck
		}

		slog.ErrorContext(ctx, "service.GetVersion", "err", err)
		return nil, fmt.Errorf("service.GetVersion: %w", err)
	}

	return &desc.GetVersionResponse{
		Version: convertVersionToDesc(version),
	}, nil
}
