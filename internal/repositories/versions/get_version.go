package versions

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5"

	"proto-registry/internal/models"
	"proto-registry/internal/repositories"
)

func (r *Repository) GetVersion(ctx context.Context, id int64) (*models.Version, error) {
	query := "SELECT id, project_id, ref, ref_type, commit, created_at, updated_at FROM versions WHERE id=$1"

	var version models.Version
	if err := r.db.QueryRow(ctx, query, id).Scan(&version.ID, &version.ProjectID, &version.Ref, &version.RefType, &version.Commit, &version.CreatedAt, &version.UpdatedAt); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return nil, repositories.ErrNotFound
		}

		return nil, fmt.Errorf("db.QueryRow: %w", err)
	}

	return &version, nil
}
