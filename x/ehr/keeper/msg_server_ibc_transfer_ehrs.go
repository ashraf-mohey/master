package keeper

import (
	"context"

	"github.com/ashraf-mohey/master/x/ehr/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	clienttypes "github.com/cosmos/ibc-go/v2/modules/core/02-client/types"
)

func (k msgServer) SendIbcTransferEhrs(goCtx context.Context, msg *types.MsgSendIbcTransferEhrs) (*types.MsgSendIbcTransferEhrsResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: logic before transmitting the packet

	// Construct the packet
	var packet types.IbcTransferEhrsPacketData

	packet.Creator = msg.Creator
	packet.PatientId = msg.PatientId

	// Transmit the packet
	err := k.TransmitIbcTransferEhrsPacket(
		ctx,
		packet,
		msg.Port,
		msg.ChannelID,
		clienttypes.ZeroHeight(),
		msg.TimeoutTimestamp,
	)
	if err != nil {
		return nil, err
	}

	return &types.MsgSendIbcTransferEhrsResponse{}, nil
}
