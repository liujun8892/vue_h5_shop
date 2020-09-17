import Vue from 'vue'
import Vuex from 'vuex'
import user from './modules/user'
import index from './modules/index/index'
import goods from './modules/goods'
import reviews from './modules/goods/reviews'
import cart from './modules/cart'
import search from './modules/search'
import address from './modules/address'
import order from './modules/order'

Vue.use(Vuex)

let store = new Vuex.Store({
    modules: {
        user,
        index,
        goods,
        reviews,
        cart,
        search,
        address,
        order
    }
})
export default store;