package config

import (
	"fmt"
	"os"

	"gopkg.in/yaml.v3"
)

type Config struct {
	Database struct {
		DSN string `yaml:"dsn"`
	} `yaml:"database"`
	Clients struct {
		Gitlab struct {
			APIUrl string `yaml:"api_url"`
			Token  string `yaml:"token"`
		}
	} `yaml:"clients"`
}

func NewFromFile(path string) (*Config, error) {
	data, err := os.ReadFile(path) // nolint:gosec
	if err != nil {
		return nil, fmt.Errorf("os.ReadFile: %w", err)
	}

	var config Config

	if err := yaml.Unmarshal(data, &config); err != nil {
		return nil, fmt.Errorf("yaml.Unmarshal: %w", err)
	}

	return &config, nil
}
