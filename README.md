# Proto Registry

Proto Registry is a service for managing and storing protobuf contracts and OpenAPI schemas. It allows centralized storage, versioning, and usage of contracts from various sources such as GitLab.

## Overview

Proto Registry provides the following capabilities:

- Registration of projects with protobuf contracts and OpenAPI schemas
- Version management of contracts (branches and tags)
- File storage in PostgreSQL
- REST and gRPC API for accessing contracts
- Integration with GitLab for automatic contract retrieval

## Architecture

The project consists of the following components:

- **Server** (`cmd/server`) — Main server with REST and gRPC API
- **CLI** (`cmd/cli`) — Command-line interface for administrative tasks
- **API** (`api/registry`) — Protobuf API definition
- **Database** — PostgreSQL for storing metadata and files
- **Migrations** — Automatic database migrations
- **Clients** — Integration with external systems (GitLab)

## Requirements

- Go 1.25+
- PostgreSQL 17+
- GitLab (for retrieving contracts)

## Installation and Local Run

### Prerequisites

1. Install Go 1.25+ and PostgreSQL 17+
2. Clone the repository:
```bash
git clone https://github.com/username/proto-registry.git
cd proto-registry
```

### Local Setup

1. Install dependencies:
```bash
go mod tidy
```

2. Start PostgreSQL using Docker:
```bash
make compose-up
```

3. Apply database migrations:
```bash
# Install goose if not already installed
go install github.com/pressly/goose/v3/cmd/goose@latest

# Apply migrations
goose postgres "host=127.0.0.1 port=5432 user=postgres password=postgres dbname=proto-registry sslmode=disable" up
```

4. Create a configuration file (e.g., `/etc/proto-registry/config.yaml` or use the `CONFIG_FILE_PATH` environment variable):

```yaml
database:
  dsn: host=127.0.0.1 port=5432 user=postgres password=postgres dbname=proto-registry sslmode=disable

clients:
  gitlab:
    api_url: https://gitlab.com/api/v4
    token: "YOUR_GITLAB_TOKEN"
```

5. Build and run the server:
```bash
make build-server
CONFIG_FILE_PATH=/path/to/config.yaml ./bin/release/registry-server
```

### Using Docker Compose

You can use the provided docker-compose file to run the entire stack:

```bash
make compose-up
```

## Configuration

The configuration file should be in YAML format:

```yaml
database:
  dsn: host=127.0.0.1 port=5432 user=postgres password=postgres dbname=proto-registry sslmode=disable

clients:
  gitlab:
    api_url: https://gitlab.com/api/v4
    token: "YOUR_GITLAB_TOKEN"
```

Parameters:
- `database.dsn` — PostgreSQL connection string
- `clients.gitlab.api_url` — GitLab API URL
- `clients.gitlab.token` — GitLab authentication token

## API

Proto Registry provides both REST and gRPC API for working with contracts:

### REST API

- `GET /v1/projects` — Get list of projects
- `GET /v1/projects/{id}` — Get project information
- `POST /v1/projects` — Register project
- `GET /v1/versions` — Get list of versions
- `GET /v1/versions/{id}` — Get version information
- `GET /v1/files` — Get list of files
- `GET /v1/files:content` — Get file content
- `POST /v1/files` — Register files

### gRPC API

See the service definition in `api/registry/service_v1.proto`.

## License

MIT