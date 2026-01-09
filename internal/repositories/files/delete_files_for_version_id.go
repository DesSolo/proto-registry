package files

import (
	"context"
	"fmt"
)

func (r *Repository) DeleteFilesForVersion(ctx context.Context, versionID int64) error {
	query := "DELETE FROM files WHERE version_id = $1"

	if _, err := r.db.Exec(ctx, query, versionID); err != nil {
		return fmt.Errorf("db.Exec: %w", err)
	}

	return nil
}
