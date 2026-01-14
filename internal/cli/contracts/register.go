package contracts

import (
	"bytes"
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"strings"

	"github.com/spf13/cobra"
	"google.golang.org/grpc"
	"google.golang.org/grpc/credentials/insecure"

	registry "proto-registry/internal/clients/proto-registry"
	"proto-registry/internal/models"
	desc "proto-registry/pkg/api/registry"
)

func newRegisterCommand() *cobra.Command {
	var (
		roots        []string
		registryAddr string
		projectID    int64
		projectName  string
		ref          string
		refTypeS     string
		commit       string
	)

	cmd := &cobra.Command{
		Use:   "register",
		Short: "Register proto/openapi contracts",
		RunE: func(cmd *cobra.Command, _ []string) error {
			refType := decodeRefType(refTypeS)
			if refType == models.RefTypeUnknown {
				return fmt.Errorf("invalid ref type: %s", refTypeS)
			}

			files, err := findFiles(roots)
			if err != nil {
				return fmt.Errorf("findFiles: %w", err)
			}

			client, err := newProtoRegistryClient(registryAddr)
			if err != nil {
				return fmt.Errorf("newProtoRegistryClient: %w", err)
			}

			err = client.RegisterFiles(cmd.Context(), &registry.RegisterFilesRequest{
				ProjectID:   projectID,
				ProjectName: projectName,
				Ref:         ref,
				RefType:     refType,
				Commit:      commit,
				Files:       files,
			})
			if err != nil {
				return fmt.Errorf("RegisterFiles: %w", err)
			}

			return nil
		},
	}

	cmd.Flags().StringSliceVar(&roots, "root", []string{"api", "docs"}, "Root directories")
	cmd.Flags().StringVar(&registryAddr, "registry-addr", "", "Address of the proto registry")
	cmd.Flags().Int64Var(&projectID, "project-id", 0, "Project ID")
	cmd.Flags().StringVar(&projectName, "project-name", "", "Project name")
	cmd.Flags().StringVar(&ref, "ref", "", "Git reference")
	cmd.Flags().StringVar(&refTypeS, "ref-type", "branch", "Git reference type (tag or branch)")
	cmd.Flags().StringVar(&commit, "commit", "", "Git commit")

	cmd.MarkFlagsRequiredTogether(
		"root",
		"registry-addr",
		"project-id",
		"project-name",
		"ref",
		"ref-type",
		"commit",
	)

	return cmd
}

func decodeRefType(refType string) models.RefType {
	switch refType {
	case "branch":
		return models.RefTypeBranch
	case "tag":
		return models.RefTypeTag
	default:
		return models.RefTypeUnknown
	}
}

func newProtoRegistryClient(target string) (*registry.Client, error) {
	conn, err := grpc.NewClient(target, grpc.WithTransportCredentials(insecure.NewCredentials()))
	if err != nil {
		return nil, fmt.Errorf("grpc.NewClient: %w", err)
	}

	return registry.NewClient(desc.NewProtoRegistryClient(conn)), nil
}

func findFiles(roots []string) ([]*registry.File, error) {
	var files []*registry.File

	for _, root := range roots {
		err := filepath.Walk(root, func(path string, info fs.FileInfo, err error) error {
			if err != nil {
				return err
			}

			if info.IsDir() {
				return nil
			}

			if isProtoFile(path) {
				files = append(files, &registry.File{
					FileType: models.FileTypeProto,
					Path:     path,
				})
				return nil
			}

			if isOpenAPIFile(path) {
				files = append(files, &registry.File{
					FileType: models.FileTypeOpenAPI,
					Path:     path,
				})
				return nil
			}

			return nil
		})

		if err != nil {
			return nil, fmt.Errorf("filepath.Walk: %w", err)
		}
	}

	return files, nil
}

func isProtoFile(path string) bool {
	return strings.HasSuffix(path, ".proto")
}

func isOpenAPIFile(path string) bool {
	if !strings.HasSuffix(path, ".json") {
		return false
	}

	f, err := os.Open(path) // nolint:gosec
	if err != nil {
		return false
	}
	defer f.Close()

	buf := make([]byte, 64)
	if _, err := f.Read(buf); err != nil {
		return false
	}

	return bytes.Contains(buf, []byte(`"swagger"`))
}
