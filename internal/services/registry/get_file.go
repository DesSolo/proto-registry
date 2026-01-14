package registry

import (
	"context"
	"errors"
	"fmt"
	"path/filepath"
	"strconv"
	"strings"

	"proto-registry/internal/clients/gitlab"
	"proto-registry/internal/models"
)

func (s *Service) GetFileContent(ctx context.Context, projectID int64, ref, path string) (*models.FileContent, error) {
	if err := validateFilePath(path); err != nil {
		return nil, fmt.Errorf("%w invalid path: %w", ErrValidationFailed, err)
	}

	project := strconv.FormatInt(projectID, 10)

	content, err := s.gitlabClient.GetRepositoryFile(ctx, project, path, ref)
	if err != nil {
		if errors.Is(err, gitlab.ErrNotFound) {
			return nil, ErrNotFound
		}

		return nil, fmt.Errorf("gitlabClient.GetRepositoryFile: %w", err)
	}

	return &models.FileContent{
		Content: content,
	}, nil
}

func validateFilePath(path string) error {
	if strings.HasPrefix(path, "/") {
		return errors.New("path contains leading slash")
	}

	ext := filepath.Ext(path)
	switch ext {
	case ".proto", ".json":
		if ext == ".json" && !strings.HasSuffix(path, ".swagger.json") {
			return errors.New("JSON file must be swagger format")
		}
		return nil
	default:
		return errors.New("unsupported file extension: must be .proto or .swagger.json")
	}
}
