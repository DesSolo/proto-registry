package contracts

import "github.com/spf13/cobra"

func NewContractsCommand() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "contracts",
		Short: "Manage registry contracts",
	}

	cmd.AddCommand(newRegisterCommand())

	return cmd
}
