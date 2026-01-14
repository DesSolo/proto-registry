package protoregistry

import (
	"context"
	"fmt"

	"proto-registry/internal/models"
	desc "proto-registry/pkg/api/registry"
)

type File struct {
	FileType models.FileType
	Path     string
}

type RegisterFilesRequest struct {
	ProjectID   int64
	ProjectName string
	Ref         string
	RefType     models.RefType
	Commit      string
	Files       []*File
}

func (c *Client) RegisterFiles(ctx context.Context, req *RegisterFilesRequest) error {
	_, err := c.client.RegisterProject(ctx, &desc.RegisterProjectRequest{
		Project: &desc.Project{
			Id:   req.ProjectID,
			Name: req.ProjectName,
		},
	})
	if err != nil {
		return fmt.Errorf("client.RegisterProject: %w", err)
	}

	_, err = c.client.RegisterFiles(ctx, &desc.RegisterFilesRequest{
		ProjectId: req.ProjectID,
		RefType:   convertRefTypeToDesc(req.RefType),
		Ref:       req.Ref,
		Commit:    req.Commit,
		Files:     convertFilesToDesc(req.Files),
	})
	if err != nil {
		return fmt.Errorf("client.RegisterFiles: %w", err)
	}

	return nil
}

func convertRefTypeToDesc(refType models.RefType) desc.RefType {
	switch refType {
	case models.RefTypeBranch:
		return desc.RefType_REF_TYPE_BRANCH
	case models.RefTypeTag:
		return desc.RefType_REF_TYPE_TAG
	default:
		return desc.RefType_REF_TYPE_UNKNOWN
	}
}

func convertFilesToDesc(files []*File) []*desc.RegisterFilesRequest_File {
	result := make([]*desc.RegisterFilesRequest_File, 0, len(files))
	for _, file := range files {
		result = append(result, &desc.RegisterFilesRequest_File{
			FileType: convertFileTypeToDesc(file.FileType),
			Path:     file.Path,
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
