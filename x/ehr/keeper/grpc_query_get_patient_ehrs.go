package keeper

import (
	"context"

	"github.com/ashraf-mohey/master/x/ehr/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
	
	"github.com/cosmos/cosmos-sdk/store/prefix"
	"github.com/cosmos/cosmos-sdk/types/query"
)

func (k Keeper) GetPatientEhrs(goCtx context.Context, req *types.QueryGetPatientEhrsRequest) (*types.QueryGetPatientEhrsResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Process the query
	_ = ctx

	// Define a variable that will store a list of ehrs
	var ehrs []*types.Ehr

	store := ctx.KVStore(k.storeKey)
	// Get the part of the store that keeps ehrs
	ehrsStore := prefix.NewStore(store, []byte(types.EhrKey))

	// Paginate the records store based on PageRequest
	pageRes, err := query.Paginate(ehrsStore, req.Pagination, func(key []byte, value []byte) error {
		var ehr types.Ehr
		if err := k.cdc.Unmarshal(value, &ehr); err != nil {
			return err
		}
		if ehr.PatientId == req.PatientId {
			ehrs = append(ehrs, &ehr)
		}

		return nil
	})
	// Throw an error if pagination failed
	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}
	// Return a struct containing a list of patient's ehrs and pagination info
	return &types.QueryGetPatientEhrsResponse{Ehrs: ehrs, Pagination: pageRes}, nil
}
