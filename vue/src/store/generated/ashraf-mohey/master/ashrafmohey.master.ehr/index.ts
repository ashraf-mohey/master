import { txClient, queryClient, MissingWalletError , registry} from './module'

import { Ehr } from "./module/types/ehr/ehr"
import { EhrPacketData } from "./module/types/ehr/packet"
import { NoData } from "./module/types/ehr/packet"
import { IbcTransferEhrsPacketData } from "./module/types/ehr/packet"
import { IbcTransferEhrsPacketAck } from "./module/types/ehr/packet"
import { Params } from "./module/types/ehr/params"


export { Ehr, EhrPacketData, NoData, IbcTransferEhrsPacketData, IbcTransferEhrsPacketAck, Params };

async function initTxClient(vuexGetters) {
	return await txClient(vuexGetters['common/wallet/signer'], {
		addr: vuexGetters['common/env/apiTendermint']
	})
}

async function initQueryClient(vuexGetters) {
	return await queryClient({
		addr: vuexGetters['common/env/apiCosmos']
	})
}

function mergeResults(value, next_values) {
	for (let prop of Object.keys(next_values)) {
		if (Array.isArray(next_values[prop])) {
			value[prop]=[...value[prop], ...next_values[prop]]
		}else{
			value[prop]=next_values[prop]
		}
	}
	return value
}

function getStructure(template) {
	let structure = { fields: [] }
	for (const [key, value] of Object.entries(template)) {
		let field: any = {}
		field.name = key
		field.type = typeof value
		structure.fields.push(field)
	}
	return structure
}

const getDefaultState = () => {
	return {
				Params: {},
				GetPatientEhrs: {},
				
				_Structure: {
						Ehr: getStructure(Ehr.fromPartial({})),
						EhrPacketData: getStructure(EhrPacketData.fromPartial({})),
						NoData: getStructure(NoData.fromPartial({})),
						IbcTransferEhrsPacketData: getStructure(IbcTransferEhrsPacketData.fromPartial({})),
						IbcTransferEhrsPacketAck: getStructure(IbcTransferEhrsPacketAck.fromPartial({})),
						Params: getStructure(Params.fromPartial({})),
						
		},
		_Registry: registry,
		_Subscriptions: new Set(),
	}
}

// initial state
const state = getDefaultState()

export default {
	namespaced: true,
	state,
	mutations: {
		RESET_STATE(state) {
			Object.assign(state, getDefaultState())
		},
		QUERY(state, { query, key, value }) {
			state[query][JSON.stringify(key)] = value
		},
		SUBSCRIBE(state, subscription) {
			state._Subscriptions.add(JSON.stringify(subscription))
		},
		UNSUBSCRIBE(state, subscription) {
			state._Subscriptions.delete(JSON.stringify(subscription))
		}
	},
	getters: {
				getParams: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.Params[JSON.stringify(params)] ?? {}
		},
				getGetPatientEhrs: (state) => (params = { params: {}}) => {
					if (!(<any> params).query) {
						(<any> params).query=null
					}
			return state.GetPatientEhrs[JSON.stringify(params)] ?? {}
		},
				
		getTypeStructure: (state) => (type) => {
			return state._Structure[type].fields
		},
		getRegistry: (state) => {
			return state._Registry
		}
	},
	actions: {
		init({ dispatch, rootGetters }) {
			console.log('Vuex module: ashrafmohey.master.ehr initialized!')
			if (rootGetters['common/env/client']) {
				rootGetters['common/env/client'].on('newblock', () => {
					dispatch('StoreUpdate')
				})
			}
		},
		resetState({ commit }) {
			commit('RESET_STATE')
		},
		unsubscribe({ commit }, subscription) {
			commit('UNSUBSCRIBE', subscription)
		},
		async StoreUpdate({ state, dispatch }) {
			state._Subscriptions.forEach(async (subscription) => {
				try {
					const sub=JSON.parse(subscription)
					await dispatch(sub.action, sub.payload)
				}catch(e) {
					throw new Error('Subscriptions: ' + e.message)
				}
			})
		},
		
		
		
		 		
		
		
		async QueryParams({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const queryClient=await initQueryClient(rootGetters)
				let value= (await queryClient.queryParams()).data
				
					
				commit('QUERY', { query: 'Params', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryParams', payload: { options: { all }, params: {...key},query }})
				return getters['getParams']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryParams API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		
		
		 		
		
		
		async QueryGetPatientEhrs({ commit, rootGetters, getters }, { options: { subscribe, all} = { subscribe:false, all:false}, params, query=null }) {
			try {
				const key = params ?? {};
				const queryClient=await initQueryClient(rootGetters)
				let value= (await queryClient.queryGetPatientEhrs( key.patientId, query)).data
				
					
				while (all && (<any> value).pagination && (<any> value).pagination.next_key!=null) {
					let next_values=(await queryClient.queryGetPatientEhrs( key.patientId, {...query, 'pagination.key':(<any> value).pagination.next_key})).data
					value = mergeResults(value, next_values);
				}
				commit('QUERY', { query: 'GetPatientEhrs', key: { params: {...key}, query}, value })
				if (subscribe) commit('SUBSCRIBE', { action: 'QueryGetPatientEhrs', payload: { options: { all }, params: {...key},query }})
				return getters['getGetPatientEhrs']( { params: {...key}, query}) ?? {}
			} catch (e) {
				throw new Error('QueryClient:QueryGetPatientEhrs API Node Unavailable. Could not perform query: ' + e.message)
				
			}
		},
		
		
		async sendMsgSendIbcTransferEhrs({ rootGetters }, { value, fee = [], memo = '' }) {
			try {
				const txClient=await initTxClient(rootGetters)
				const msg = await txClient.msgSendIbcTransferEhrs(value)
				const result = await txClient.signAndBroadcast([msg], {fee: { amount: fee, 
	gas: "200000" }, memo})
				return result
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendIbcTransferEhrs:Init Could not initialize signing client. Wallet is required.')
				}else{
					throw new Error('TxClient:MsgSendIbcTransferEhrs:Send Could not broadcast Tx: '+ e.message)
				}
			}
		},
		
		async MsgSendIbcTransferEhrs({ rootGetters }, { value }) {
			try {
				const txClient=await initTxClient(rootGetters)
				const msg = await txClient.msgSendIbcTransferEhrs(value)
				return msg
			} catch (e) {
				if (e == MissingWalletError) {
					throw new Error('TxClient:MsgSendIbcTransferEhrs:Init Could not initialize signing client. Wallet is required.')
				} else{
					throw new Error('TxClient:MsgSendIbcTransferEhrs:Create Could not create message: ' + e.message)
				}
			}
		},
		
	}
}
