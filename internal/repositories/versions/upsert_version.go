package versions

import (
	"context"
	"errors"
	"fmt"

	"github.com/jackc/pgx/v5/pgconn"

	"proto-registry/internal/models"
	"proto-registry/internal/repositories"
)

func (r *Repository) UpsertVersion(ctx context.Context, version *models.Version) error {
	query := `
		INSERT INTO versions(project_id, ref, ref_type, commit) VALUES ($1, $2, $3, $4)
		ON CONFLICT (project_id, ref)
		DO UPDATE SET
		    ref_type = EXCLUDED.ref_type,
		    commit = EXCLUDED.commit,
		    updated_at = NOW()
		RETURNING id
	`

	if err := r.db.QueryRow(ctx, query, version.ProjectID, version.Ref, version.RefType, version.Commit).Scan(&version.ID); err != nil {
		if isForeignKeyError(err) {
			return repositories.ErrNotFound
		}

		return fmt.Errorf("db.QueryRow: %w", err)
	}

	return nil
}

func isForeignKeyError(err error) bool {
	var pgErr *pgconn.PgError
	return errors.As(err, &pgErr) && pgErr.Code == "23503"
}
