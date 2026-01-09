package projects

import (
	"context"
	"fmt"

	"github.com/Masterminds/squirrel"

	"proto-registry/internal/models"
	"proto-registry/internal/repositories"
)

func (r *Repository) GetProjects(ctx context.Context, filter models.GetProjectsFilter) ([]*models.Project, error) {
	query := repositories.QueryBuilder().
		Select("id", "name", "updated_at").
		From("projects")

	if filter.Limit > 0 {
		query = query.Limit(uint64(filter.Limit))
	}

	if filter.Offset > 0 {
		query = query.Offset(uint64(filter.Offset))
	}

	if filter.Name != nil {
		query = query.Where(squirrel.ILike{"name": "%" + *filter.Name + "%"})
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

	var projects []*models.Project
	for rows.Next() {
		var project models.Project
		if err := rows.Scan(&project.ID, &project.Name, &project.UpdatedAt); err != nil {
			return nil, fmt.Errorf("rows.Scan: %w", err)
		}

		projects = append(projects, &project)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows.Err: %w", err)
	}

	return projects, nil
}
