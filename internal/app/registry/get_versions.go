package registry

import (
	"context"
	"fmt"
	"log/slog"

	"google.golang.org/protobuf/types/known/timestamppb"

	"proto-registry/internal/models"
	desc "proto-registry/pkg/api/registry"
)

// GetVersions Возвращает детальное представление версии
func (i *Implementation) GetVersions(ctx context.Context, req *desc.GetVersionsRequest) (*desc.GetVersionsResponse, error) {
	versions, err := i.service.GetVersions(ctx, convertGetVersionsFilterToModel(req))
	if err != nil {
		slog.ErrorContext(ctx, "fservice.GetVersions:", "err", err)
		return nil, fmt.Errorf("service.GetVersions: %w", err)
	}

	return &desc.GetVersionsResponse{
		Versions: convertVersionsToDesc(versions),
	}, nil
}

func convertGetVersionsFilterToModel(filter *desc.GetVersionsRequest) models.GetVersionsFilter {
	return models.GetVersionsFilter{
		Pagination: convertPaginationToModel(filter.GetPagination()),
		ProjectID:  filter.GetProjectId(),
	}
}

func convertVersionsToDesc(versions []*models.Version) []*desc.Version {
	result := make([]*desc.Version, 0, len(versions))
	for _, version := range versions {
		result = append(result, convertVersionToDesc(version))
	}

	return result
}

func convertVersionToDesc(version *models.Version) *desc.Version {
	return &desc.Version{
		Id:        version.ID,
		Ref:       version.Ref,
		RefType:   convertRefTypeToDesc(version.RefType),
		Commit:    version.Commit,
		CreatedAt: timestamppb.New(version.CreatedAt),
		UpdatedAt: timestamppb.New(version.UpdatedAt),
	}
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
