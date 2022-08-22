package cli

import (
	"strconv"

	"github.com/ashraf-mohey/master/x/ehr/types"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	channelutils "github.com/cosmos/ibc-go/v2/modules/core/04-channel/client/utils"
	"github.com/spf13/cobra"
)

var _ = strconv.Itoa(0)

func CmdSendIbcTransferEhrs() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "send-ibc-transfer-ehrs [src-port] [src-channel] [patient-id]",
		Short: "Send a ibcTransferEhrs over IBC",
		Args:  cobra.ExactArgs(3),
		RunE: func(cmd *cobra.Command, args []string) error {
			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			creator := clientCtx.GetFromAddress().String()
			srcPort := args[0]
			srcChannel := args[1]
			argPatientId, err := strconv.ParseUint(string(args[2]), 10, 64)

			// Get the relative timeout timestamp
			timeoutTimestamp, err := cmd.Flags().GetUint64(flagPacketTimeoutTimestamp)
			if err != nil {
				return err
			}
			consensusState, _, _, err := channelutils.QueryLatestConsensusState(clientCtx, srcPort, srcChannel)
			if err != nil {
				return err
			}
			if timeoutTimestamp != 0 {
				timeoutTimestamp = consensusState.GetTimestamp() + timeoutTimestamp
			}

			msg := types.NewMsgSendIbcTransferEhrs(creator, srcPort, srcChannel, timeoutTimestamp, argPatientId)
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	cmd.Flags().Uint64(flagPacketTimeoutTimestamp, DefaultRelativePacketTimeoutTimestamp, "Packet timeout timestamp in nanoseconds. Default is 10 minutes.")
	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
