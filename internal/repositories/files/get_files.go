package files

import (
	"context"
	"fmt"

	"proto-registry/internal/models"
	"proto-registry/internal/repositories"
)

func (r *Repository) GetFiles(ctx context.Context, filter models.GetFilesFilter) ([]*models.File, error) {
	query := repositories.QueryBuilder().
		Select("id", "version_id", "file_type", "path", "created_at").
		From("files")

	if filter.Limit > 0 {
		query = query.Limit(filter.Limit)
	}

	if filter.Offset > 0 {
		query = query.Offset(filter.Offset)
	}

	if filter.VersionID > 0 {
		query = query.Where("version_id = ?", filter.VersionID)
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

	var files []*models.File
	for rows.Next() {
		var file models.File
		if err := rows.Scan(&file.ID, &file.VersionID, &file.FileType, &file.Path, &file.CreatedAt); err != nil {
			return nil, fmt.Errorf("rows.Scan: %w", err)
		}

		files = append(files, &file)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("rows.Err: %w", err)
	}

	return files, nil
}
