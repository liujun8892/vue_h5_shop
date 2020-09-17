import Vue from 'vue'

export default {
    namespaced: true,
    state: {
        goodsCart: localStorage.getItem('goods_cart') ? JSON.parse(localStorage.getItem('goods_cart')) : []
    },
    mutations: {
        // 添加商品到购物车
        ['ADD_GOODS_CART'](state, payload) {
            let index = state.goodsCart.findIndex(item =>
                item.gid === payload.goods.gid && JSON.stringify(item.specs) === JSON.stringify(payload.goods.specs)
            )
            if (index === -1) {
                state.goodsCart.push(payload.goods)
            } else {
                state.goodsCart[index].count += payload.goods.count
            }
            localStorage.setItem('goods_cart', JSON.stringify(state.goodsCart))
        },
        // 删除商品
        ['DELETE_GOODS_CART'](state, payload) {
            state.goodsCart.splice(payload.index, 1)
            localStorage.setItem('goods_cart', JSON.stringify(state.goodsCart))
        },
        // 输入商品数量
        ['SET_GOODS_COUNT'](state, payload) {
            state.goodsCart[payload.index].count = payload.value
            state.goodsCart[payload.index].count = state.goodsCart[payload.index].count.replace(/[^\d]/g, '')
            if (state.goodsCart[payload.index].count === '') {
                return
            } else {
                state.goodsCart[payload.index].count = parseInt(state.goodsCart[payload.index].count)
            }
            Vue.set(state.goodsCart, payload.index, state.goodsCart[payload.index])
            localStorage.setItem('goods_cart', JSON.stringify(state.goodsCart))
        },
        // 输入商品数量
        ['SET_GOODS_COUNT_BLUR'](state, payload) {
            console.log(state.goodsCart[payload.index])
            if (state.goodsCart[payload.index].count === '') {
                state.goodsCart[payload.index].count = 1
            }
            Vue.set(state.goodsCart, payload.index, state.goodsCart[payload.index])
            localStorage.setItem('goods_cart', JSON.stringify(state.goodsCart))
        },
        // 商品数量++
        ['SET_GOODS_INCREMENT'](state, payload) {
            state.goodsCart[payload.index].count++
            Vue.set(state.goodsCart, payload.index, state.goodsCart[payload.index])
            localStorage.setItem('goods_cart', JSON.stringify(state.goodsCart))
        },
        // 商品数量--
        ['SET_GOODS_DECREMENT'](state, payload) {
            if (state.goodsCart[payload.index].count === 1) return
            state.goodsCart[payload.index].count--
            Vue.set(state.goodsCart, payload.index, state.goodsCart[payload.index])
            localStorage.setItem('goods_cart', JSON.stringify(state.goodsCart))
        },
        // 全选
        ['SET_GOODS_SELECT_ALL'](state, payload) {
            state.goodsCart.map(item => item.checked = payload.checkAll)
            localStorage.setItem('goods_cart', JSON.stringify(state.goodsCart))
        },
        // 单选切换
        ['SET_GOODS_SELECT'](state, payload) {
            state.goodsCart[payload.index].checked = !state.goodsCart[payload.index].checked
            Vue.set(state.goodsCart, payload.index, state.goodsCart[payload.index])
            localStorage.setItem('goods_cart', JSON.stringify(state.goodsCart))
        },
        // 提交订单成功后删除已选的商品
        ['DELETE_CHECKED_GOODS'](state) {
            state.goodsCart = state.goodsCart.filter(item => item.checked !== true)
            localStorage.setItem('goods_cart', JSON.stringify(state.goodsCart))
        },
    },
    actions: {},
    getters: {
        // 总运费
        totalFreight(state) {
            let freights = []
            state.goodsCart.forEach(item => {
                    if (item.checked) {
                        freights.push(item.freight)
                    }
                }
            )
            return freights.length > 0 ? Math.max.apply(null, freights) : 0
        },
        // 总价格
        totalPrice(state) {
            let totalPrice = 0
            state.goodsCart.forEach(item => {
                if (item.checked) {
                    totalPrice += item.price * item.count
                }
            })
            return totalPrice !== 0 ? parseFloat(totalPrice.toFixed(2)) : 0
        },
        // 全选
        selectAll(state) {
            return !state.goodsCart.find(item => item.checked === false)
        }
    }
}