package registry

import (
	"context"
	"fmt"

	"google.golang.org/protobuf/types/known/timestamppb"

	"proto-registry/internal/models"
	desc "proto-registry/pkg/api/registry"
)

// GetFiles Список файлов
func (i *Implementation) GetFiles(ctx context.Context, req *desc.GetFilesRequest) (*desc.GetFilesResponse, error) {
	files, err := i.service.GetFiles(ctx, convertGetFilesToFilter(req))
	if err != nil {
		return nil, fmt.Errorf("service.GetFiles: %w", err)
	}

	return &desc.GetFilesResponse{
		Files: convertFilesToDesc(files),
	}, nil
}

func convertGetFilesToFilter(req *desc.GetFilesRequest) models.GetFilesFilter {
	return models.GetFilesFilter{
		Pagination: convertPaginationToModel(req.GetPagination()),
		VersionID:  req.GetVersionId(),
	}
}

func convertFilesToDesc(files []*models.File) []*desc.GetFilesResponse_File {
	result := make([]*desc.GetFilesResponse_File, 0, len(files))
	for _, file := range files {
		result = append(result, &desc.GetFilesResponse_File{
			Id:        file.ID,
			FileType:  convertFileTypeToDesc(file.FileType),
			Path:      file.Path,
			CreatedAt: timestamppb.New(file.CreatedAt),
		})
	}

	return result
}

func convertFileTypeToDesc(fileType models.FileType) desc.FileType {
	switch fileType {
	case models.FileTypeProto:
		return desc.FileType_FILE_TYPE_PROTO
	case models.FileTypeOpenAPI:
		return desc.FileType_FILE_TYPE_OPENAPI
	default:
		return desc.FileType_FILE_TYPE_UNKNOWN

	}
}
