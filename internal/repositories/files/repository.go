package files

import "proto-registry/internal/repositories"

type Repository struct {
	db repositories.Querier
}

func NewRepository(db repositories.Querier) *Repository {
	return &Repository{db: db}
}
