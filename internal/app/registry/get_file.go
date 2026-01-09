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

// GetFile Детальное представление файла
func (i *Implementation) GetFile(ctx context.Context, req *desc.GetFileRequest) (*desc.GetFileResponse, error) {
	file, err := i.service.GetFileContent(ctx, req.GetProjectId(), req.GetRef(), req.GetPath())
	if err != nil {
		if errors.Is(err, registry.ErrValidationFailed) {
			return nil, status.Error(codes.InvalidArgument, err.Error())
		}

		if errors.Is(err, registry.ErrNotFound) {
			return nil, status.Error(codes.NotFound, err.Error())
		}

		slog.ErrorContext(ctx, "service.GetFileContent", slog.String("err", err.Error()))
		return nil, fmt.Errorf("service.GetFileContent: %w", err)
	}

	return &desc.GetFileResponse{
		Content: string(file.Content),
	}, nil
}
