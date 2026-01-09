package files

import (
	"context"
	"fmt"

	"proto-registry/internal/models"
)

func (r *Repository) CreateFile(ctx context.Context, file *models.File) error {
	query := "INSERT INTO files(version_id, file_type, path) values ($1, $2, $3) RETURNING id"

	if err := r.db.QueryRow(ctx, query, file.VersionID, file.FileType, file.Path).Scan(&file.ID); err != nil {
		return fmt.Errorf("db.QueryRow: %w", err)
	}

	return nil
}
