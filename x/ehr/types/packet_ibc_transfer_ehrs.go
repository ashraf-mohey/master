package types

// ValidateBasic is used for validating the packet
func (p IbcTransferEhrsPacketData) ValidateBasic() error {

	// TODO: Validate the packet data

	return nil
}

// GetBytes is a helper for serialising
func (p IbcTransferEhrsPacketData) GetBytes() ([]byte, error) {
	var modulePacket EhrPacketData

	modulePacket.Packet = &EhrPacketData_IbcTransferEhrsPacket{&p}

	return modulePacket.Marshal()
}
