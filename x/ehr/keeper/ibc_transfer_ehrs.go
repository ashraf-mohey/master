package keeper

import (
	"errors"

	"github.com/ashraf-mohey/master/x/ehr/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	clienttypes "github.com/cosmos/ibc-go/v2/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v2/modules/core/04-channel/types"
	host "github.com/cosmos/ibc-go/v2/modules/core/24-host"

	"encoding/binary"
	"encoding/json"
	"github.com/cosmos/cosmos-sdk/store/prefix"
	"io/ioutil"
	"net/http"
	"strconv"
	"encoding/base64"
)

// TransmitIbcTransferEhrsPacket transmits the packet over IBC with the specified source port and source channel
func (k Keeper) TransmitIbcTransferEhrsPacket(
	ctx sdk.Context,
	packetData types.IbcTransferEhrsPacketData,
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

// OnRecvIbcTransferEhrsPacket processes packet reception
func (k Keeper) OnRecvIbcTransferEhrsPacket(ctx sdk.Context, packet channeltypes.Packet, data types.IbcTransferEhrsPacketData) (packetAck types.IbcTransferEhrsPacketAck, err error) {
	// validate packet data upon receiving
	if err := data.ValidateBasic(); err != nil {
		return packetAck, err
	}
		

	// TODO: packet reception logic
	
	// GetPatientDetailsById data.PatientId
	result, err := sendHttpRequest(types.AuthorityPatientByIdUrl + strconv.FormatUint(data.PatientId, 10))
	
	if err != nil {
		return packetAck, nil
	}
	var patientResult PatientResult
	if err := json.Unmarshal([]byte(result), &patientResult); err != nil {
		return packetAck, nil
	}
	patientId, err := strconv.ParseUint(string(patientResult.Patient.Id), 10, 64)
	if err != nil || patientId <= 0 {
		return packetAck, nil
	}

	patientPublicKey, err := publicKeyShhStringToRsaKey(patientResult.Patient.PublicKey)
	if err != nil {
		return packetAck, nil
	}

	// GetOrganizationDetailsByAddress data.OrganizationAddress
	result, err = sendHttpRequest(types.AuthorityOrganizationByAddressUrl + data.OrganizationAddress)
	if err != nil {
		return packetAck, nil
	}
	var organizationResult OrganizationResult
	if err := json.Unmarshal([]byte(result), &organizationResult); err != nil {
		return packetAck, nil
	}
	organizationId, err := strconv.ParseUint(string(organizationResult.Organization.Id), 10, 64)

	if err != nil || organizationId <= 0 {
		return packetAck, nil
	}
	organizationPublicKey, err := publicKeyShhStringToRsaKey(organizationResult.Organization.PublicKey)
	if err != nil {
		return packetAck, nil
	}
				
	//GetPendingTransfer EHRs using data.PendingTransferUrl
	result, err = sendHttpRequest(data.PendingTransferUrl + "cache/ehr/ehrs/pending/" + strconv.FormatUint(data.PatientId, 10) + "/" + "accessToken")
	if err != nil {
		return packetAck, nil
	}

	var ehrsResult EhrsResult
	if err := json.Unmarshal([]byte(result), &ehrsResult); err != nil {
		return packetAck, nil
	}
	
	verifiedRecordsIds := []uint64{}


	for _, ehr := range ehrsResult.Ehrs {
		if ehr.Transferred {
			continue
		}

		
		decodedSignature, err := base64.StdEncoding.DecodeString(ehr.PatientSignature)
		if err != nil {
			continue
		}
		valid, err := verifySignature(patientPublicKey, []byte(ehr.DataHash), decodedSignature)
						
		if !valid || err != nil {
			continue
		}

					
		decodedSignature, err = base64.StdEncoding.DecodeString(ehr.OrganizationSignature)
		if err != nil {
			continue
		}
		valid, err = verifySignature(organizationPublicKey, []byte(ehr.DataHash), decodedSignature)
		if !valid || err != nil {
			continue
		}
		ehrId, _ := strconv.ParseUint(string(ehr.Id), 10, 64)
		verifiedRecordsIds = append(verifiedRecordsIds, ehrId)

		
		var ehrRecord = types.Ehr{
			Creator:               ehr.Creator,
			PatientId:             patientId,
			DataHash:              ehr.DataHash,
			PatientSignature:      ehr.PatientSignature,
			OrganizationSignature: ehr.OrganizationSignature,
		}
		_ = k.AppendEhr(ctx, ehrRecord)
	}
	


	packetAck.Ids = verifiedRecordsIds
	
	return packetAck, nil
}


// OnAcknowledgementIbcTransferEhrsPacket responds to the the success or failure of a packet
// acknowledgement written on the receiving chain.
func (k Keeper) OnAcknowledgementIbcTransferEhrsPacket(ctx sdk.Context, packet channeltypes.Packet, data types.IbcTransferEhrsPacketData, ack channeltypes.Acknowledgement) error {
	switch dispatchedAck := ack.Response.(type) {
	case *channeltypes.Acknowledgement_Error:

		// TODO: failed acknowledgement logic
		_ = dispatchedAck.Error

		return nil
	case *channeltypes.Acknowledgement_Result:
		// Decode the packet acknowledgment
		var packetAck types.IbcTransferEhrsPacketAck

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

// OnTimeoutIbcTransferEhrsPacket responds to the case where a packet has not been transmitted because of a timeout
func (k Keeper) OnTimeoutIbcTransferEhrsPacket(ctx sdk.Context, packet channeltypes.Packet, data types.IbcTransferEhrsPacketData) error {

	// TODO: packet timeout logic

	return nil
}

/////////////////////////////
func (k Keeper) GetNextEhrId(ctx sdk.Context) uint64 {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), []byte(types.EhrIdKey))
	// Convert the EhrIdKey to bytes
	byteKey := []byte(types.EhrIdKey)
	// Get the value of the id
	bz := store.Get(byteKey)
	// Return one if the id value is not found for first record
	if bz == nil {
		return 1
	}
	// Convert the id into a uint64
	return binary.BigEndian.Uint64(bz)
}

func (k Keeper) SetNextEhrId(ctx sdk.Context, nextId uint64) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), []byte(types.EhrIdKey))
	// Convert the EhrIdKey to bytes
	byteKey := []byte(types.EhrIdKey)
	// Convert id from uint64 to string and get bytes
	bz := make([]byte, 8)
	binary.BigEndian.PutUint64(bz, nextId)
	// Set the value of EhrIdKey to nextId
	store.Set(byteKey, bz)
}

func (k Keeper) AppendEhr(ctx sdk.Context, ehr types.Ehr) uint64 {
	// Get the next ehr id in the store
	id := k.GetNextEhrId(ctx)
	ehr.Id = id
	// Get the store
	store := prefix.NewStore(ctx.KVStore(k.storeKey), []byte(types.EhrKey))
	// Convert the ehr ID into bytes
	byteKey := make([]byte, 8)
	binary.BigEndian.PutUint64(byteKey, ehr.Id)
	// Marshal the ehr into bytes
	appendedValue := k.cdc.MustMarshal(&ehr)
	// Insert the ehr bytes using ehr ID as a key
	store.Set(byteKey, appendedValue)
	// Update the next ehr id
	k.SetNextEhrId(ctx, id+1)
	return id
}

func sendHttpRequest(url string) (string, error) {
	req, err := http.NewRequest("GET", url, nil)

	req.Header.Set("accept", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return "", err
	}

	defer resp.Body.Close()

	//fmt.Println("response Status:", resp.Status)
	//fmt.Println("response Headers:", resp.Header)
	body, err := ioutil.ReadAll(resp.Body)

	return string(body), err
}

type PatientResult struct {
	Patient Patient
}

type Patient struct {
	Id        string
	PublicKey string
}

type OrganizationResult struct {
	Organization Organization
}

type Organization struct {
	Id        string
	PublicKey string
}

type EhrsResult struct {
	Ehrs []Ehr
}

type Ehr struct {
	Creator string
	Id string
	PatientId string
	DataHash string
	PatientSignature string
	OrganizationSignature string
	Transferred bool
}



