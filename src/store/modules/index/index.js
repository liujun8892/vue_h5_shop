import {getGoodsData, getNavsData, getRecommendGoodsData, getSwiperData} from '../../../api/index'

export default {
    namespaced: true,
    state: {
        navs: [],
        swiper: [],
        goods: [],
        recom_goods: [],
    },
    mutations: {
        ['SET_NAVS'](state, payload) {
            state.navs = payload.navs
        },
        ['SET_SWIPER'](state, payload) {
            state.swiper = payload.swiper
        },
        ['SET_GOODS'](state, payload) {
            state.goods = payload.goods
        },
        ['SET_Recommend_GOODS'](state, payload) {
            state.recom_goods = payload.recom_goods
        }
    },
    actions: {
        getNavs(conText, payload) {
            getNavsData().then(res => {
                if (res.code === 200) {
                    conText.commit('SET_NAVS', {navs: res.data})
                }
                if (payload && payload.success) {
                    payload.success()
                }
            })
        },
        getSwiper(conText, payload) {
            getSwiperData().then(res => {
                if (res.code === 200) {
                    conText.commit('SET_SWIPER', {swiper: res.data})
                    if (payload) {
                        payload.success()
                    }
                }
            })
        },
        getGoods(conText, payload) {
            getGoodsData().then(res => {
                if (res.code === 200) {
                    conText.commit('SET_GOODS', {goods: res.data})
                    if (payload) {
                        payload.success()
                    }
                }
            })
        },
        getRecommendGoods(conText, payload) {
            getRecommendGoodsData().then(res => {
                if (res.code === 200) {
                    conText.commit('SET_Recommend_GOODS', {recom_goods: res.data})
                    if (payload) {
                        payload.success()
                    }
                }
            })
        },
    }
}