package projects

import (
	"context"
	"fmt"

	"proto-registry/internal/models"
)

func (r *Repository) UpsertProject(ctx context.Context, project *models.Project) error {
	query := `
		INSERT INTO projects(id, name) VALUES($1, $2)
		ON CONFLICT (id)
		DO UPDATE SET 
		    name = EXCLUDED.name,
		    updated_at = NOW()
	`

	if _, err := r.db.Exec(ctx, query, project.ID, project.Name); err != nil {
		return fmt.Errorf("db.Exec: %w", err)
	}

	return nil
}
