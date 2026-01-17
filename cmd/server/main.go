package main

import (
	"context"
	"log/slog"
	"os"
	"os/signal"
	"syscall"

	"proto-registry/internal/app"
)

func main() {
	application := app.New()

	ctx, cancel := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGINT, syscall.SIGTERM)
	defer cancel()

	go func() {
		<-ctx.Done()
		slog.DebugContext(ctx, "shutting down")

		cancel()
	}()

	if err := application.Run(ctx); err != nil {
		slog.ErrorContext(ctx, "failed to run application", "error", err)
		os.Exit(1)
	}
}
