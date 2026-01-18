package uow

import (
	"context"
	"fmt"

	"github.com/jackc/pgx/v5"

	"proto-registry/internal/repositories"
	"proto-registry/internal/repositories/files"
	"proto-registry/internal/repositories/versions"
)

type TX interface {
	Begin(ctx context.Context) (pgx.Tx, error)
}

type Repositories struct {
	Versions repositories.VersionsRepository
	Files    repositories.FilesRepository
}

type UnitOfWork struct {
	tx TX
}

func NewUnitOfWork(tx TX) *UnitOfWork {
	return &UnitOfWork{tx: tx}
}

func (u *UnitOfWork) Do(ctx context.Context, fn func(Repositories) error) error {
	tx, err := u.tx.Begin(ctx)
	if err != nil {
		return fmt.Errorf("pool.Begin: %w", err)
	}
	defer tx.Rollback(ctx)

	repos := Repositories{
		Versions: versions.NewRepository(tx),
		Files:    files.NewRepository(tx),
	}

	if err := fn(repos); err != nil {
		return fmt.Errorf("fn: %w", err)
	}

	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("tx.Commit: %w", err)
	}

	return nil
}
