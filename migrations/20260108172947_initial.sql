-- +goose Up
-- +goose StatementBegin
CREATE TABLE projects (
    id BIGINT PRIMARY KEY NOT NULL,
    name VARCHAR(255) NOT NULL,
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE versions (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    ref VARCHAR(255) NOT NULL,
    ref_type VARCHAR(40) NOT NULL,
    commit VARCHAR(64) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT versions_uniq_project_id_ref UNIQUE (project_id, ref)
);

CREATE TABLE files (
    id BIGSERIAL PRIMARY KEY,
    version_id BIGINT NOT NULL REFERENCES versions(id) ON DELETE CASCADE,
    file_type VARCHAR(40) NOT NULL,
    path VARCHAR(300) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),

    CONSTRAINT files_uniq_version_id_path UNIQUE (version_id, path)
);

CREATE INDEX files_version_id_idx ON files(version_id);

-- +goose StatementEnd

-- +goose Down
-- +goose StatementBegin
DROP TABLE IF EXISTS files;
DROP TABLE IF EXISTS versions;
DROP TABLE IF EXISTS projects;
-- +goose StatementEnd
