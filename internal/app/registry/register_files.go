package registry

import (
	"context"
	"errors"
	"fmt"
	"log/slog"

	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	"google.golang.org/protobuf/types/known/emptypb"

	"proto-registry/internal/models"
	"proto-registry/internal/services/registry"
	desc "proto-registry/pkg/api/registry"
)

// RegisterFiles Зарегистрировать файлы
func (i *Implementation) RegisterFiles(ctx context.Context, req *desc.RegisterFilesRequest) (*emptypb.Empty, error) {
	err := i.service.RegisterFiles(ctx,
		convertRegisterFilesRequestToVersion(req), convertRegisterFilesRequestToFiles(req),
	)
	if err != nil {
		if errors.Is(err, registry.ErrNotFound) {
			return nil, status.Error(codes.NotFound, err.Error()) // nolint:wrapcheck
		}

		slog.ErrorContext(ctx, "service.RegisterFiles", "err", err)
		return nil, fmt.Errorf("service.RegisterFiles: %w", err)
	}

	return nil, nil
}

func convertRegisterFilesRequestToVersion(req *desc.RegisterFilesRequest) *models.Version {
	return &models.Version{
		ProjectID: req.GetProjectId(),
		Ref:       req.GetRef(),
		RefType:   convertRefTypeToModel(req.GetRefType()),
		Commit:    req.GetCommit(),
	}
}

func convertRefTypeToModel(refType desc.RefType) models.RefType {
	switch refType {
	case desc.RefType_REF_TYPE_BRANCH:
		return models.RefTypeBranch
	case desc.RefType_REF_TYPE_TAG:
		return models.RefTypeTag
	default:
		return models.RefTypeUnknown
	}
}

func convertRegisterFilesRequestToFiles(req *desc.RegisterFilesRequest) []*models.File {
	files := make([]*models.File, 0, len(req.GetFiles()))
	for _, file := range req.GetFiles() {
		files = append(files, &models.File{
			FileType: convertFileTypeToModel(file.GetFileType()),
			Path:     file.GetPath(),
		})
	}

	return files
}

func convertFileTypeToModel(fileType desc.FileType) models.FileType {
	switch fileType {
	case desc.FileType_FILE_TYPE_PROTO:
		return models.FileTypeProto
	case desc.FileType_FILE_TYPE_OPENAPI:
		return models.FileTypeOpenAPI
	default:
		return models.FileTypeUnknown
	}
}
