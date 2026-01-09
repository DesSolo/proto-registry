package versions

import (
	"context"
	"fmt"

	"proto-registry/internal/models"
	"proto-registry/internal/repositories"
)

func (r *Repository) GetVersions(ctx context.Context, filter models.GetVersionsFilter) ([]*models.Version, error) {
	query := repositories.QueryBuilder().
		Select("id", "project_id", "ref", "ref_type", "commit", "created_at", "updated_at").
		From("versions")

	if filter.Limit > 0 {
		query = query.Limit(uint64(filter.Limit))
	}

	if filter.Offset > 0 {
		query = query.Offset(uint64(filter.Offset))
	}

	if filter.ProjectID > 0 {
		query = query.Where("project_id = ?", filter.ProjectID)
	}

	sql, args, err := query.ToSql()
	if err != nil {
		return nil, fmt.Errorf("query.ToSql: %w", err)
	}

	rows, err := r.db.Query(ctx, sql, args...)
	if err != nil {
		return nil, fmt.Errorf("db.Query: %w", err)
	}
	defer rows.Close()

	var versions []*models.Version
	for rows.Next() {
		var version models.Version
		if err := rows.Scan(&version.ID, &version.ProjectID, &version.Ref, &version.RefType, &version.Commit, &version.CreatedAt, &version.UpdatedAt); err != nil {
			return nil, fmt.Errorf("rows.Scan: %w", err)
		}

		versions = append(versions, &version)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows.Err: %w", err)
	}

	return versions, nil
}
