package app

import (
	"context"
	"fmt"
)

type App struct{}

func New() *App {
	return &App{}
}

func (a *App) Run(ctx context.Context) error {
	di := newContainer()

	if err := di.Server().Run(ctx, di.Services()...); err != nil {
		return fmt.Errorf("failed to run server: %w", err)
	}

	return nil
}
