import {getHotSearch,getGoodsAttr,getGoodsList} from '../../../api/search'

export default {
    namespaced:true,
    state:{
        // 历史记录关键词
        historyKeywords:window.localStorage.getItem('historyKeywords')?JSON.parse(window.localStorage.getItem('historyKeywords')): [],
        // 热词
        hot_keywords:[],
        // 商品属性
        goods_attrs: [],
        // 商品列表
        goods_list: []
    },
    mutations:{
       ['SET_HISTORY_KEYWORDS'](state,payload){
           state.historyKeywords.unshift(payload.keyword)
           window.localStorage.setItem('historyKeywords',JSON.stringify(state.historyKeywords))
       },
        ['CLEAR_HISTORY_KEYWORDS'](state){
            state.historyKeywords= []
            window.localStorage.removeItem('historyKeywords')
        },
        ['SET_HOT_KEYWORDS'](state,payload){
          state.hot_keywords= payload.hot_keywords
        },
        ['SET_GOODS_ATTR'](state,payload){
          state.goods_attrs= payload.goods_attr
        },
        ['SET_GOODS_LIST'](state,payload){
          state.goods_list= payload.goods_list
        },
        ['SET_MORE_GOODS'](state,payload){
           state.goods_list.data.push(...payload.more_goods)
            // payload.more_goods.map(item=>{
            //     state.goods_list.push(1)
            //     return item
            // })
        },
    },
    actions:{
        getHotSearchData(conText,payload){
            getHotSearch().then(res=>{
                if(res.code===200){
                    conText.commit('SET_HOT_KEYWORDS',{hot_keywords:res.data})
                    if (payload){
                        payload.success()
                    }
                }
            })
        },
        getGoodsAttrData(conText,payload){
            getGoodsAttr(payload.keyword).then(res=>{
                if(res.code===200){
                    res.data.map(item=>{
                        item.show= true
                        item.checkedIndex=-1
                        return item
                    })
                    conText.commit('SET_GOODS_ATTR',{goods_attr:res.data})
                }else {
                    conText.commit('SET_GOODS_ATTR',{goods_attr:[]})
                }

                if (payload){
                    payload.success()
                }
            })
        },
        getGoodsListData(conText,payload){
            getGoodsList(payload.params).then(res=>{
                if(res.code===200){
                    conText.commit('SET_GOODS_LIST',{goods_list:res})
                }else {
                    conText.commit('SET_GOODS_LIST',{goods_list:{data:[],pageinfo:{page:0,pagenum:0,pagesize:0,total:0}}})
                }
                if (payload){
                    payload.success()
                }
            })
        },
        loadMoreGoods(conText,payload){
            getGoodsList(payload.params).then(res=>{
                if(res.code===200){
                    conText.commit('SET_MORE_GOODS',{more_goods:res.data})
                }else {
                    conText.commit('SET_MORE_GOODS',{more_goods:[]})
                }
                if (payload && payload.success){
                    payload.success()
                }
            })
        },
    }
}