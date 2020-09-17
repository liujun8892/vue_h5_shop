import {getGoodsMenu,getGoodsItemList,getGoodsParams,getGoodsSpec,addFav} from '../../../api/goods'

export default {
    namespaced:true,
    state:{
        // 商品菜单
        goodsMenu:[],
        // 商品列表
        goodsList:[],
        // 商品参数
        goodsParams: {},
        // 商品规格
        goodsSpec: []
    },
    mutations:{
        ['SET_GOODS_Menu'](state,payload){
            state.goodsMenu = payload.goodsMenu
        },
        ['SET_GOODS_List'](state,payload){
            state.goodsList = payload.goodsList
        } ,
        ['SET_GOODS_PARAMS'](state,payload){
            state.goodsParams = payload.goodsParams
        },
        ['CLEAR_GOODS_PARAMS'](state){
            state.goodsParams =[]
        },
        ['SET_GOODS_SPEC'](state,payload){
            payload.goodsSpec.map(item=>item.checkedIndex=-1)
            state.goodsSpec = payload.goodsSpec
        },
        ['SET_GOODS_SPEC_CHECKED'](state,payload){
            state.goodsSpec[payload.index].checkedIndex = payload.childIndex
        }
    },
    actions:{
        getGoodsMenuData(conText,payload){
            getGoodsMenu().then(res=>{
                if(res.code===200){
                    // let data_ex = res.data
                    // data_ex.forEach(item=>item.)
                    conText.commit('SET_GOODS_Menu',{goodsMenu:res.data})
                    if (payload){
                        payload.success()
                    }
                }
            })
        },
        getGoodsListData(conText,payload){
            getGoodsItemList(payload.cid?payload.cid:493).then(res=>{
                if(res.code===200){
                    conText.commit('SET_GOODS_List',{goodsList:res.data})
                }else if(res.code===201) {
                    conText.commit('SET_GOODS_List',{goodsList:[]})
                }
                if (payload && payload.success){
                    payload.success()
                }
            })
        },
        getGoodsParamsData(conText,payload){
            getGoodsParams(payload.gid?payload.gid:null).then(res=>{
                if(res.code===200){
                    conText.commit('SET_GOODS_PARAMS',{goodsParams:res.data})
                }else if(res.code===201) {
                    conText.commit('SET_GOODS_PARAMS',{goodsParams:{}})
                }
                if (payload && payload.success){
                    payload.success()
                }
            })
        },
        getGoodsSpecData(conText,payload){
            getGoodsSpec(payload.gid?payload.gid:null).then(res=>{
                if(res.code===200){
                    conText.commit('SET_GOODS_SPEC',{goodsSpec:res.data})
                }else if(res.code===201) {
                    conText.commit('SET_GOODS_SPEC',{goodsSpec:[]})
                }
                if (payload && payload.success){
                    payload.success()
                }
            })
        },
        // 加入收藏
        _addFav(context,payload){
            addFav({uid:context.rootState.user.uid,...payload}).then(res=>{
                if (payload&&payload.success){
                    payload.success(res)
                }
            })
        }
    }
}