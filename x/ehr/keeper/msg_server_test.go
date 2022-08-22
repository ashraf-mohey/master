package keeper_test

import (
	"context"
	"testing"

	keepertest "github.com/ashraf-mohey/master/testutil/keeper"
	"github.com/ashraf-mohey/master/x/ehr/keeper"
	"github.com/ashraf-mohey/master/x/ehr/types"
	sdk "github.com/cosmos/cosmos-sdk/types"
)

func setupMsgServer(t testing.TB) (types.MsgServer, context.Context) {
	k, ctx := keepertest.EhrKeeper(t)
	return keeper.NewMsgServerImpl(*k), sdk.WrapSDKContext(ctx)
}
