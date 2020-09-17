import {addAddress, deleteAddress, getAddressList,getAddressItem,updateAddress,getDefaultAddress} from '../../../api/address'

export default {
    namespaced: true,
    state: {
        address: []
    },
    mutations: {
        ['SET_ADDRESS'](state, payload) {
            state.address = payload.address
        },
        ['DELETE_ADDRESS'](state, payload) {
            state.address.splice(payload.index,1)
        },
        ['UPDATE_ADDRESS'](state, payload) {
            state.address.find(item=>{
              if(item.aid===payload.address.aid){
                return item = payload.address
              }
            })
        }
    },
    actions: {
        // 添加收货地址
        _addAddress(context, payload) {
            addAddress({uid: context.rootState.user.uid, ...payload}).then(res => {
                    if (payload.success) {
                        payload.success(res)
                    }
                }
            )
        },
        // 获取收货地址列表
        _getAddressList(context, payload) {
            getAddressList(context.rootState.user.uid).then(res => {
                    if (res.code === 200) {
                        context.commit('SET_ADDRESS', {address: res.data})
                    }
                }
            )
        },
        // 删除收货地址列表
        _deleteAddress(context, payload) {
            deleteAddress({uid: context.rootState.user.uid, ...payload}).then(res => {
                    if (res.code === 200) {
                        if (payload.index) {
                            context.commit('DELETE_ADDRESS', {index: payload.index})
                        }
                        if (payload.success) {
                            payload.success(res)
                        }
                    }
                }
            )
        },
        // 根据id查找地址
        _getAddressItem(context, payload) {
            getAddressItem({uid: context.rootState.user.uid, ...payload}).then(res => {
                    if (res.code === 200) {
                        if (payload.success) {
                            payload.success(res.data)
                        }
                    }
                }
            )
        },
        // 修改地址
        _updateAddress(context, payload) {
            updateAddress({uid: context.rootState.user.uid, ...payload}).then(res => {
                    if (res.code === 200) {
                        context.commit('UPDATE_ADDRESS',{address:res.data})
                        if (payload.success) {
                            payload.success(res)
                        }
                    }
                }
            )
        },
        _getDefaultAddress(context,payload){
            getDefaultAddress( context.rootState.user.uid).then(res => {
                    if (res.code === 200) {
                        if (payload.success) {
                            payload.success(res.data)
                        }
                    }
                }
            )
        }
    }
}