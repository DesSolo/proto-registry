package registry

import (
	"context"
	"fmt"
	"log/slog"

	"google.golang.org/protobuf/types/known/timestamppb"

	"proto-registry/internal/models"
	desc "proto-registry/pkg/api/registry"
)

// GetProjects Список проектов
func (i *Implementation) GetProjects(ctx context.Context, req *desc.GetProjectsRequest) (*desc.GetProjectsResponse, error) {
	projects, err := i.service.GetProjects(ctx, convertGetProjectsRequestToFilter(req))
	if err != nil {
		slog.ErrorContext(ctx, "ervice.GetProjects", "err", err)
		return nil, fmt.Errorf("service.GetProjects: %w", err)
	}

	return &desc.GetProjectsResponse{
		Projects: convertProjectsToDesc(projects),
	}, nil
}

func convertGetProjectsRequestToFilter(req *desc.GetProjectsRequest) models.GetProjectsFilter {
	return models.GetProjectsFilter{
		Pagination: convertPaginationToModel(req.GetPagination()),
		Name:       req.Name,
	}
}

func convertPaginationToModel(pagination *desc.Pagination) models.Pagination {
	return models.Pagination{
		Limit:  pagination.GetLimit(),
		Offset: pagination.GetOffset(),
	}
}

func convertProjectsToDesc(projects []*models.Project) []*desc.Project {
	result := make([]*desc.Project, 0, len(projects))
	for _, project := range projects {
		result = append(result, convertProjectToDesc(project))
	}

	return result
}

func convertProjectToDesc(project *models.Project) *desc.Project {
	return &desc.Project{
		Id:        project.ID,
		Name:      project.Name,
		UpdatedAt: timestamppb.New(project.UpdatedAt),
	}
}
