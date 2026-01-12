package projects

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"

	"proto-registry/internal/models"
	"proto-registry/internal/repositories"
)

func (r *Repository) GetProject(ctx context.Context, id int64) (*models.Project, error) {
	query := "SELECT id, name, updated_at FROM projects WHERE id = $1"

	var project models.Project
	if err := r.db.QueryRow(ctx, query, id).Scan(&project.ID, &project.Name, &project.UpdatedAt); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, repositories.ErrNotFound
		}

		return nil, fmt.Errorf("db.QueryRow: %w", err)
	}

	return &project, nil
}
