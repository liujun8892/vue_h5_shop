<template>
    <div class="cart-main">
        <SubHeader title="购物车" :isBack="isBack"></SubHeader>
        <div class='cart-list' v-for="(item,index) in cartList" :key="index">
            <div :class="{'select-btn':true,'active':item.checked}" @click="toggleChecked(index)"></div>
            <div class='image-wrap'>
                <div class='image'>
                    <img :src="item.images"/></div>
                <div class='del' @click="deleteGoods(index)">删除</div>
            </div>
            <div class='goods-wrap'>
                <div class='goods-title'>{{item.title}}</div>
                <div class='goods-attr'>
                    <span v-for="(item1,index1) in item.specs" :key="index1">{{item1.title}}：
                        {{item1.value}}
                    </span>
                </div>
                <div class='buy-wrap'>
                    <div class='price'>¥{{item.price}}</div>
                    <div class="amount-input-wrap">
                        <div :class="{'btn':true,'dec':true,'active':item.count===1}" @click="decrCount(index)">-
                        </div>
                        <div class='amount-input'><input type="tel" :value="item.count" maxlength="3"
                                                         @input="validGoodsCount($event,index)"
                                                         @blur="setGoodsCountBlur($event,index)"
                        />
                        </div>
                        <div class='btn inc' @click="incrCount(index)">+</div>
                    </div>
                </div>
            </div>
        </div>
        <div class='orderend-wrap'>
            <div class='select-area'>
                <div class='select-wrap' @click="totalSelectAll">
                    <div :class="{'select-btn':true,'active':selectAll&&totalPrice}"></div>
                    <div class='select-text'>全选</div>
                </div>
                <div class='total'>
                    运费：<span>¥{{this.totalFreight}}</span>&nbsp;&nbsp;合计：<span>¥{{this.totalPrice}}</span></div>
            </div>
            <div :class="{'orderend-btn':true,'disable':totalPrice===0}" @click="$router.push('/order')">去结算</div>
        </div>
    </div>
</template>

<script>
    import SubHeader from '../../../components/sub_header'
    import {mapGetters, mapMutations, mapState} from 'vuex'

    export default {
        data() {
            return {
                isBack: false,
            }
        },
        created() {
            this.isBack = this.$route.query.from ? true : false
        },
        mounted() {

        },
        computed: {
            ...mapState({
                cartList: state => state.cart.goodsCart
            }),
            ...mapGetters({
                totalFreight: 'cart/totalFreight',
                totalPrice: 'cart/totalPrice',
                selectAll: 'cart/selectAll',
            })
        },
        components: {
            SubHeader
        },
        methods: {
            ...mapMutations({
                setGoodsCount: 'cart/SET_GOODS_COUNT',
                _setGoodsCountBlur: 'cart/SET_GOODS_COUNT_BLUR',
                setGoodsIncrement: 'cart/SET_GOODS_INCREMENT',
                setGoodsDecrement: 'cart/SET_GOODS_DECREMENT',
                setGoodsCheckAll: 'cart/SET_GOODS_SELECT_ALL',
                setGoodsChecked: 'cart/SET_GOODS_SELECT',
                deleteGoodsCart: 'cart/DELETE_GOODS_CART',
            }),
            validGoodsCount(e, index) {
                this.setGoodsCount({value: e.target.value, index})
            },
            setGoodsCountBlur(e, index) {
                console.log(index)
                 this._setGoodsCountBlur({value:e==0?'':e, index})
            },
            incrCount(index) {
                this.setGoodsIncrement({index})
            },
            decrCount(index) {
                this.setGoodsDecrement({index})
            },
            totalSelectAll() {
                this.setGoodsCheckAll({checkAll: !this.selectAll})
            },
            toggleChecked(index){
                this.setGoodsChecked({index})
            },
            deleteGoods(index){
                this.deleteGoodsCart({index})
            }
        },
        beforeRouteUpdate(to, from, next) {
            this.isBack = to.query.from ? true : false
            next()
        }
    }
</script>

<style scoped>

    .cart-main {
        width: 100%;
        margin-top: 1rem;
        margin-bottom: 2.2rem;
    }

    .cart-main .cart-list {
        width: 100%;
        height: 2.2rem;
        background-color: #FFFFFF;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
        margin-top: 0.1rem;
    }

    .cart-main .cart-list .select-btn {
        width: 0.4rem;
        height: 0.4rem;
        border: #EFEFEF solid 1px;
        border-radius: 100%;
        margin-left: 0.2rem;
        margin-right: 0.3rem;
    }

    .cart-main .cart-list .select-btn.active {
        background-image: url("../../../assets/images/home/cart/checkmark.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        border: #FFFFFF solid 1px;
    }

    .cart-main .cart-list .image-wrap {
        width: 1.2rem;
        margin-right: 0.3rem;
    }

    .cart-main .cart-list .image-wrap .image {
        width: 100%;
        height: 1.2rem;
    }

    .cart-main .cart-list .image-wrap .image img {
        width: 100%;
        height: 100%;
    }

    .cart-main .cart-list .image-wrap .del {
        width: 100%;
        text-align: center;
        font-size: 0.24rem;
        color: #B5B5B5;
        margin-top: 0.2rem;
    }

    .cart-main .cart-list .goods-wrap {
        width: 64%;
        font-size: 0.24rem;
    }

    .cart-main .cart-list .goods-wrap .goods-title {
        width: 100%;
    }

    .cart-main .cart-list .goods-wrap .goods-attr {
        width: 100%;
        margin-top: 0.1rem;
    }

    .cart-main .cart-list .goods-wrap .goods-attr span {
        padding-right: 0.3rem;
    }

    .cart-main .cart-list .goods-wrap .buy-wrap {
        width: 100%;
        height: 0.8rem;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        align-items: center;
        -webkit-align-items: center;
    }

    .cart-main .cart-list .goods-wrap .buy-wrap .price {
        font-size: 0.28rem;
        color: #CC0004;
        margin-top: 0.2rem;
    }

    .cart-main .cart-list .goods-wrap .buy-wrap .amount-input-wrap {
        width: 2.04rem;
        height: 0.5rem;
        border: 1px solid #000000;
        margin-right: 0.2rem;
        border-radius: 0.08rem;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
    }


    .cart-main .cart-list .goods-wrap .buy-wrap .amount-input-wrap .btn {
        width: 0.6rem;
        height: 0.4rem;
        font-size: 0.32rem;
        text-align: center;
        line-height: 0.4rem;
    }

    .cart-main .cart-list .goods-wrap .buy-wrap .amount-input-wrap .btn.active {
        color: #B5B5B5;
    }

    .cart-main .cart-list .goods-wrap .buy-wrap .amount-input-wrap .dec {
        border-right: 1px solid #000000;
    }

    .cart-main .cart-list .goods-wrap .buy-wrap .amount-input-wrap .amount-input {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 0.76rem;
        height: 100%;
    }

    .cart-main .cart-list .goods-wrap .buy-wrap .amount-input-wrap .amount-input input {
        width: 80%;
        height: 75%;
        text-align: center;
    }

    .cart-main .cart-list .goods-wrap .buy-wrap .amount-input-wrap .inc {
        border-left: 1px solid #000000;
    }

    .orderend-wrap {
        width: 100%;
        height: 1rem;
        background: #FFFFFF;
        position: fixed;
        z-index: 10;
        left: 0;
        bottom: 1.2rem;
        border-top: 1px solid #EFEFEF;
        display: flex;
        display: -webkit-flex;
    }

    .orderend-wrap .select-area {
        width: auto;
        height: 100%;
        flex: 3;
        -webkit-flex: 3;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        align-items: center;
        -webkit-align-items: center;
    }

    .orderend-wrap .select-area .select-wrap {
        width: auto;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
    }

    .orderend-wrap .select-area .select-wrap .select-text {
        font-size: 0.24rem;
    }

    .orderend-wrap .select-area .select-wrap .select-btn {
        width: 0.4rem;
        height: 0.4rem;
        border: #EFEFEF solid 1px;
        border-radius: 100%;
        margin-left: 0.2rem;
        margin-right: 0.1rem;
    }

    .orderend-wrap .select-area .select-wrap .select-btn.active {
        background-image: url("../../../assets/images/home/cart/checkmark.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        border: #FFFFFF solid 1px;
    }

    .orderend-wrap .orderend-btn {
        width: auto;
        height: 100%;
        flex: 1;
        -webkit-flex: 1;
        background: #CC0004;
        font-size: 0.32rem;
        color: #FFFFFF;
        text-align: center;
        line-height: 1rem;
    }

    .orderend-wrap .orderend-btn.disable {
        background: #BFBFBF;
    }

    .orderend-wrap .total {
        font-size: 0.24rem;
        margin-right: 0.2rem;
    }

    .orderend-wrap .total span {
        color: #CC0004
    }
</style>
