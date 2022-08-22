package cli

import (
	"strconv"

	"github.com/ashraf-mohey/master/x/ehr/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/spf13/cobra"
)

var _ = strconv.Itoa(0)

func CmdGetPatientEhrs() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "get-patient-ehrs [patient-id]",
		Short: "Query getPatientEhrs",
		Args:  cobra.ExactArgs(1),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			reqPatientId, err := strconv.ParseUint(string(args[0]), 10, 64)

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			queryClient := types.NewQueryClient(clientCtx)

			params := &types.QueryGetPatientEhrsRequest{
				PatientId: reqPatientId,
			}

			res, err := queryClient.GetPatientEhrs(cmd.Context(), params)
			if err != nil {
				return err
			}

			return clientCtx.PrintProto(res)
		},
	}

	flags.AddQueryFlagsToCmd(cmd)

	return cmd
}
