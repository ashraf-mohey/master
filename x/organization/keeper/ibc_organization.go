package keeper

import (
	"errors"

	"github.com/ashraf-mohey/master/x/organization/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	clienttypes "github.com/cosmos/ibc-go/v2/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v2/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v2/modules/core/24-host"

	hd "github.com/cosmos/cosmos-sdk/crypto/hd"
	"github.com/cosmos/cosmos-sdk/crypto/keyring"
	minttypes "github.com/cosmos/cosmos-sdk/x/mint/types"
	"strings"
)

// TransmitIbcOrganizationPacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitIbcOrganizationPacket(
	ctx sdk.Context,
	packetData types.IbcOrganizationPacketData,
	sourcePort,
	sourceChannel string,
	timeoutHeight clienttypes.Height,
	timeoutTimestamp uint64,
) error {

	sourceChannelEnd, found := k.ChannelKeeper.GetChannel(ctx, sourcePort, sourceChannel)
	if !found {
		return sdkerrors.Wrapf(channeltypes.ErrChannelNotFound, "port ID (%s) channel ID (%s)", sourcePort, sourceChannel)
	}

	destinationPort := sourceChannelEnd.GetCounterparty().GetPortID()
	destinationChannel := sourceChannelEnd.GetCounterparty().GetChannelID()

	// get the next sequence
	sequence, found := k.ChannelKeeper.GetNextSequenceSend(ctx, sourcePort, sourceChannel)
	if !found {
		return sdkerrors.Wrapf(
			channeltypes.ErrSequenceSendNotFound,
			"source port: %s, source channel: %s", sourcePort, sourceChannel,
		)
	}

	channelCap, ok := k.ScopedKeeper.GetCapability(ctx, host.ChannelCapabilityPath(sourcePort, sourceChannel))
	if !ok {
		return sdkerrors.Wrap(channeltypes.ErrChannelCapabilityNotFound, "module does not own channel capability")
	}

	packetBytes, err := packetData.GetBytes()
	if err != nil {
		return sdkerrors.Wrap(sdkerrors.ErrJSONMarshal, "cannot marshal the packet: "+err.Error())
	}

	packet := channeltypes.NewPacket(
		packetBytes,
		sequence,
		sourcePort,
		sourceChannel,
		destinationPort,
		destinationChannel,
		timeoutHeight,
		timeoutTimestamp,
	)

	if err := k.ChannelKeeper.SendPacket(ctx, channelCap, packet); err != nil {
		return err
	}

	return nil
}

// OnRecvIbcOrganizationPacket processes packet reception
func (k Keeper) OnRecvIbcOrganizationPacket(ctx sdk.Context, packet channeltypes.Packet, data types.IbcOrganizationPacketData) (packetAck types.IbcOrganizationPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}

	// TODO: packet reception logic
	kr, err := keyring.New(sdk.KeyringServiceName(), keyring.BackendTest, "/home/mohey/.master", nil)
	keyName := strings.Replace(strings.ToLower(data.Name), " ", "-", -1)
	key, err := kr.Key(keyName)
	_ = key
	if err == nil {
		return packetAck, errors.New("Organization already exists")
	}

	path := sdk.GetConfig().GetFullBIP44Path()
	record, mnemonic, err := kr.NewMnemonic(keyName, keyring.English, path, keyring.DefaultBIP39Passphrase, hd.Secp256k1)
	_ = mnemonic
	address := record.GetAddress()
	//publicKey := record.GetPubKey()

	amount := sdk.Coins{sdk.NewInt64Coin("fhc", 10)}

	if err := k.bankKeeper.MintCoins(ctx, minttypes.ModuleName, amount); err != nil {
		return packetAck, nil
	}

	if err := k.bankKeeper.SendCoinsFromModuleToAccount(ctx, minttypes.ModuleName, address, amount); err != nil {
		return packetAck, errors.New("Failed to fund organization account with coins")
	}

	//privateKey, err := kr.ExportPrivateKeyObject(keyName)
	packetAck.AccountName = keyName
	packetAck.Address = address.String()
	//packetAck.PublicKey = publicKey.String()
	//packetAck.PrivateKey = privateKey.String()
	//packetAck.PrivateKey = mnemonic

	return packetAck, nil
}

// OnAcknowledgementIbcOrganizationPacket responds to the the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementIbcOrganizationPacket(ctx sdk.Context, packet channeltypes.Packet, data types.IbcOrganizationPacketData, ack channeltypes.Acknowledgement) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error

		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck types.IbcOrganizationPacketAck

		if err := types.ModuleCdc.UnmarshalJSON(dispatchedAck.Result, &packetAck); err != nil {
			// The counter-party module doesn't implement the correct acknowledgment format
			return errors.New("cannot unmarshal acknowledgment")
		}

		// TODO: successful acknowledgement logic

		return nil
	default:
		// The counter-party module doesn't implement the correct acknowledgment format
		return errors.New("invalid acknowledgment format")
	}
}

// OnTimeoutIbcOrganizationPacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutIbcOrganizationPacket(ctx sdk.Context, packet channeltypes.Packet, data types.IbcOrganizationPacketData) error {

	// TODO: packet timeout logic

	return nil
}
