package ehr_test

import (
	"testing"

	keepertest "github.com/ashraf-mohey/master/testutil/keeper"
	"github.com/ashraf-mohey/master/testutil/nullify"
	"github.com/ashraf-mohey/master/x/ehr"
	"github.com/ashraf-mohey/master/x/ehr/types"
	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),
		PortId: types.PortID,
		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.EhrKeeper(t)
	ehr.InitGenesis(ctx, *k, genesisState)
	got := ehr.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	require.Equal(t, genesisState.PortId, got.PortId)

	// this line is used by starport scaffolding # genesis/test/assert
}
