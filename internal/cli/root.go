package cli

import (
	"fmt"
	"os"

	"github.com/spf13/cobra"

	"proto-registry/internal/cli/contracts"
)

func Execute() {
	if err := newRootCommand().Execute(); err != nil {
		fmt.Fprintln(os.Stderr, err)
		os.Exit(1)
	}
}

func newRootCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "proto-registry",
		Short: "proto-registry",
	}

	cmd.AddCommand(
		contracts.NewContractsCommand(),
	)

	return cmd
}
