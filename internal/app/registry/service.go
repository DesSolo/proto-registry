package registry

import (
	"context"

	"github.com/grpc-ecosystem/grpc-gateway/v2/runtime"
	"google.golang.org/grpc"

	"proto-registry/internal/models"
	desc "proto-registry/pkg/api/registry"
)

type Service interface {
	GetProjects(ctx context.Context, filter models.GetProjectsFilter) ([]*models.Project, error)
	GetProject(ctx context.Context, id int64) (*models.Project, error)
	RegisterProject(ctx context.Context, project *models.Project) error
	GetVersions(ctx context.Context, filter models.GetVersionsFilter) ([]*models.Version, error)
	GetFiles(ctx context.Context, filter models.GetFilesFilter) ([]*models.File, error)
	GetFileContent(ctx context.Context, projectID int64, ref, path string) (*models.FileContent, error)
	RegisterFiles(ctx context.Context, version *models.Version, files []*models.File) error
}

// Implementation ...
type Implementation struct {
	service Service
	desc.UnimplementedProtoRegistryServer
}

// New return new instance of Implementation.
func New(service Service) *Implementation {
	return &Implementation{
		service: service,
	}
}

// RegisterGRPC register gRPC service.
func (i *Implementation) RegisterGRPC(server *grpc.Server) {
	desc.RegisterProtoRegistryServer(server, i)
}

// RegisterGateway register HTTP handlers.
func (i *Implementation) RegisterGateway(ctx context.Context, mux *runtime.ServeMux) error {
	return desc.RegisterProtoRegistryHandlerServer(ctx, mux, i)
}

// RegisterGatewayFromEndpoint register HTTP handlers for specific endpoint.
func (i *Implementation) RegisterGatewayFromEndpoint(ctx context.Context, mux *runtime.ServeMux, endpoint string, opts []grpc.DialOption) error {
	return desc.RegisterProtoRegistryHandlerFromEndpoint(ctx, mux, endpoint, opts)
}
