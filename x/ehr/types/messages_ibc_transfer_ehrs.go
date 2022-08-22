package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgSendIbcTransferEhrs = "send_ibc_transfer_ehrs"

var _ sdk.Msg = &MsgSendIbcTransferEhrs{}

func NewMsgSendIbcTransferEhrs(
	creator string,
	port string,
	channelID string,
	timeoutTimestamp uint64,
	patientId uint64,
) *MsgSendIbcTransferEhrs {
	return &MsgSendIbcTransferEhrs{
		Creator:          creator,
		Port:             port,
		ChannelID:        channelID,
		TimeoutTimestamp: timeoutTimestamp,
		PatientId:        patientId,
	}
}

func (msg *MsgSendIbcTransferEhrs) Route() string {
	return RouterKey
}

func (msg *MsgSendIbcTransferEhrs) Type() string {
	return TypeMsgSendIbcTransferEhrs
}

func (msg *MsgSendIbcTransferEhrs) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgSendIbcTransferEhrs) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgSendIbcTransferEhrs) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	if msg.Port == "" {
		return sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "invalid packet port")
	}
	if msg.ChannelID == "" {
		return sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "invalid packet channel")
	}
	if msg.TimeoutTimestamp == 0 {
		return sdkerrors.Wrap(sdkerrors.ErrInvalidRequest, "invalid packet timeout")
	}
	return nil
}
