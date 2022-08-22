package keeper_test

import (
	"testing"

	testkeeper "github.com/ashraf-mohey/master/testutil/keeper"
	"github.com/ashraf-mohey/master/x/ehr/types"
	"github.com/stretchr/testify/require"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.EhrKeeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
