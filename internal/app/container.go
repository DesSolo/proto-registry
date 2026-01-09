package app

import (
	"context"
	"log/slog"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5/pgxpool"
	"google.golang.org/grpc"

	"proto-registry/internal/app/registry"
	"proto-registry/internal/clients/gitlab"
	"proto-registry/internal/config"
	"proto-registry/internal/repositories/files"
	"proto-registry/internal/repositories/projects"
	"proto-registry/internal/repositories/versions"
	registry_service "proto-registry/internal/services/registry"
	"proto-registry/pkg/interceptor"
	"proto-registry/pkg/server"
)

type container struct {
	config   *config.Config
	service  registry.Service
	server   *server.Server
	services []server.Service

	pool *pgxpool.Pool
}

func newContainer() *container {
	return &container{}
}

func (c *container) Config() *config.Config {
	if c.config == nil {
		configFilePath := os.Getenv("CONFIG_FILE_PATH")
		if configFilePath == "" {
			configFilePath = "/etc/proto-registry/config.yaml"
		}

		cfg, err := config.NewFromFile(configFilePath)
		if err != nil {
			fatal("failed to load config", err)
		}

		c.config = cfg
	}

	return c.config
}

func (c *container) Server() *server.Server {
	if c.server == nil {
		c.server = server.New(server.NewDefaultOptions(
			server.WithGRPCServerOptions(
				grpc.ChainUnaryInterceptor(
					interceptor.Logging(slog.Default()),
					interceptor.Validation,
				),
			),
		))
	}

	return c.server
}

func (c *container) Services() []server.Service {
	if len(c.services) == 0 {
		c.services = append(c.services, registry.New(
			c.Service(),
		))
	}

	return c.services
}

func (c *container) Pool() *pgxpool.Pool {
	if c.pool == nil {
		options := c.Config().Database

		ctx := context.Background()

		pool, err := pgxpool.New(ctx, options.DSN)
		if err != nil {
			fatal("pgxpool.New", err)
		}

		if err := pool.Ping(ctx); err != nil {
			fatal("pgxpool.Ping", err)
		}

		c.pool = pool
	}

	return c.pool
}

func (c *container) Service() registry.Service {
	if c.service == nil {
		clientsOptions := c.Config().Clients

		c.service = registry_service.NewService(
			gitlab.NewClient(http.DefaultClient, clientsOptions.Gitlab.ApiURL, clientsOptions.Gitlab.Token),
			projects.NewRepository(c.Pool()),
			versions.NewRepository(c.Pool()),
			files.NewRepository(c.Pool()),
		)
	}

	return c.service
}

func fatal(message string, err error) {
	slog.Error(message, "err", err)
	os.Exit(1)
}
