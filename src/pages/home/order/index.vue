<template>
    <div class="page">
        <SubHeader title="确认订单"></SubHeader>
        <div class='main'>
            <div class='address-wrap' @click="$router.push('/address')">
                <div class='persion-info' v-show="name?true:false">
                    <span>收货人：{{name}}</span><span>{{cellphone}}</span>
                </div>
                <div class='address' v-show="name?true:false">
                    <img src="../../../assets/images/home/cart/map.png" alt="收货地址"/><span>{{showArea}}</span>
                </div>
                <div v-show="!name?true:false" class='address-null'>您的收货地址为空,点击添加收货地址</div>
                <div class='arrow'></div>
                <div class='address-border-wrap'>
                    <div class='trapezoid style1'></div>
                    <div class='trapezoid style2'></div>
                    <div class='trapezoid style1'></div>
                    <div class='trapezoid style2'></div>
                    <div class='trapezoid style1'></div>
                    <div class='trapezoid style2'></div>
                    <div class='trapezoid style1'></div>
                    <div class='trapezoid style2'></div>
                    <div class='trapezoid style1'></div>
                    <div class='trapezoid style2'></div>
                </div>
            </div>
            <div class='goods-wrap'>
                <div class='goods-list' v-for="(item,index) in newCartData" :key="index">
                    <div class='image'><img :src="item.images" alt=""/></div>
                    <div class='goods-param'>
                        <div class='title'>{{item.title}}</div>
                        <div class='attr'>
                            <span v-for="(item2,index2) in item.specs" :key="index2">{{item2.title}}：
                             {{item2.value}}
                            </span>
                        </div>
                        <div class='amount'>x {{item.count}}</div>
                        <div class='price'>￥{{item.price}}</div>
                    </div>
                </div>
            </div>
            <ul class='total-wrap'>
                <li>商品总额</li>
                <li>￥{{total}}</li>
            </ul>
            <ul class='total-wrap'>
                <li>运费</li>
                <li>￥{{freight}}</li>
            </ul>
        </div>
        <div class='balance-wrap'>
            <div class='price-wrap'>
                <span>实际金额：</span><span>￥{{total+freight}}</span>
            </div>
            <div class='balance-btn' @click="submitOrder()">提交订单</div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters, mapState,mapMutations} from "vuex";
    import SubHeader from "../../../components/sub_header";

    export default {
        name: "order",
        data() {
            return {
                aid: '',
                name: "",
                cellphone: "",
                showArea: "",
                isSubmit: false
            }
        },
        components: {
            SubHeader
        },
        computed: {
            ...mapState({
                cartData: state => state.cart.goodsCart
            }),
            ...mapGetters({
                total: "cart/totalPrice",
                freight: "cart/totalFreight"
            }),
            newCartData() {
                if (this.cartData.length > 0) {
                    let cartList = this.cartData.filter(item => item.checked === true)
                    cartList.map(item => {
                        item.amount = item.count
                        item.img = item.images
                        item.attrs = []
                        item.specs.forEach(item1 => {
                            let obj = {}
                            obj.attrid = item1.attrid
                            obj.title = item1.title
                            obj.param = []
                            obj.param.paramid = item1.vid
                            obj.param.title = item1.value
                            item.attrs.push(obj)
                        })
                        return item
                    })
                    return cartList
                } else {
                    return []
                }
            }
        },
        created() {
            this.$util.authUserStatus(this)
            this.aid = sessionStorage['aid']
            // 获取默认的收货地址
            if (this.aid) {
                this.getAddressItem({
                    aid: this.aid, success: (res) => {
                        this.name = res.name
                        this.cellphone = res.cellphone
                        this.showArea = `${res.province} ${res.city} ${res.area}`
                    }
                })
            } else {
                this.getDefaultAddress({
                    success: (res) => {
                        this.name = res.name
                        this.cellphone = res.cellphone
                        this.showArea = `${res.province} ${res.city} ${res.area}`
                        this.aid = res.aid
                    }
                })
            }
        },
        mounted() {
            document.title = this.$route.meta.title;
        },
        methods: {
            ...mapActions({
                getAddressItem: 'address/_getAddressItem',
                getDefaultAddress: 'address/_getDefaultAddress',
                addOrder: 'order/_addOrder',
            }),
            ...mapMutations({
                deleteCheckedGoods: 'cart/DELETE_CHECKED_GOODS'
            }),
            //提交订单
            async submitOrder() {
                // 防止重复提交
                if (!this.isSubmit) {
                    this.isSubmit = true
                    let res = await this.addOrder({
                        freight: this.freight, addsid: this.aid, goodsData: JSON.stringify(this.newCartData),
                    })
                    this.isSubmit = false
                    if (res.code === 200) {
                        this.deleteCheckedGoods()
                        this.$router.push('order/end')
                    }
                }
            }
        }
    }
</script>

<style scoped>
    .page {
        width: 100%;
        min-height: 100vh;
        background-color: #ffffff;
        overflow: hidden;
    }

    .main {
        width: 100%;
        margin-top: 1.4rem;
        margin-bottom: 1.4rem;
    }

    .address-wrap {
        width: 100%;
        height: 1.9rem;
        position: relative;
        z-index: 1;
    }

    .address-wrap .address-border-wrap {
        width: 100%;
        position: absolute;
        z-index: 1;
        left: 0;
        bottom: 0;
        display: flex;
        display: -webkit-flex;
    }

    .address-wrap .address-border-wrap .trapezoid {
        width: 6%;
        margin-left: 1%;
        margin-right: 1%;
    }

    .address-wrap .address-border-wrap .trapezoid.style1 {
        border-bottom: 0.08rem solid #fdcd4d;
        border-left: 0.08rem solid transparent;
        border-right: 0.08rem solid transparent;
    }

    .address-wrap .address-border-wrap .trapezoid.style2 {
        border-top: 0.08rem solid #84614d;
        border-left: 0.08rem solid transparent;
        border-right: 0.08rem solid transparent;
    }

    .address-wrap .persion-info {
        width: auto;
        height: auto;
        position: absolute;
        z-index: 1;
        left: 0.4rem;
        top: 0;
        font-size: 0.28rem;
        font-weight: bold;
    }

    .address-wrap .persion-info span:nth-child(1) {
        padding-right: 1rem;
    }

    .address-wrap .address {
        width: auto;
        height: auto;
        position: absolute;
        z-index: 1;
        left: 0.4rem;
        top: 0.9rem;
    }

    .address-wrap .address img {
        width: 0.4rem;
        height: 0.4rem;
        vertical-align: middle;
        margin-right: 0.1rem;
    }

    .address-wrap .address span {
        font-size: 0.24rem;
    }

    .address-wrap .arrow {
        width: 0.32rem;
        height: 0.32rem;
        background-image: url("../../../assets/images/common/right_arrow.png");
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        position: absolute;
        z-index: 1;
        right: 0.2rem;
        top: 0.6rem;
    }

    .address-wrap .address-null {
        width: auto;
        height: auto;
        font-size: 0.28rem;
        position: absolute;
        z-index: 1;
        left: 50%;
        top: 0;
        transform: translateX(-50%);
        -webkit-transform: translateX(-50%);
        display: table;
        margin-top: 0.5rem;
        white-space: nowrap;
    }

    .goods-wrap {
        width: 100%;
        margin-top: 0.4rem;
        overflow: hidden;
    }

    .goods-wrap .goods-list {
        width: 92%;
        height: 2rem;
        margin: 0 auto;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
        margin-bottom: 0.4rem;
    }

    .goods-wrap .goods-list .image {
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.3rem;
    }

    .goods-wrap .goods-list .image img {
        width: 100%;
        height: 100%;
    }

    .goods-wrap .goods-list .goods-param {
        width: 75%;
    }

    .goods-wrap .goods-list .goods-param .title {
        width: 100%;
        height: 0.4rem;
        overflow: hidden;
        font-size: 0.28rem;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .goods-wrap .goods-list .attr {
        width: 100%;
        height: 0.4rem;
        font-size: 0.28rem;
        margin-top: 0.1rem;
        color: #868686
    }

    .goods-wrap .goods-list .attr span {
        padding-right: 0.3rem;
    }

    .goods-wrap .goods-list .amount {
        font-size: 0.24rem;
        color: #868686;
        margin-top: 0.1rem;
    }

    .goods-wrap .goods-list .price {
        font-size: 0.28rem;
        color: #F51D2A;
        margin-top: 0.1rem;
        margin-left: -0.07rem;
    }

    .total-wrap {
        width: 92%;
        margin: 0 auto;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        font-size: 0.32rem;
        margin-bottom: 0.3rem;
    }

    .total-wrap li:nth-child(1) {
        color: #787878;
    }

    .total-wrap li:nth-child(2) {
        color: #F51D2A;
    }

    .balance-wrap {
        width: 100%;
        height: 1rem;
        border-top: 1px solid #EFEFEF;
        position: fixed;
        z-index: 5;
        left: 0;
        bottom: 0;
        background-color: #FFFFFF;
        display: flex;
        display: -webkit-flex;
    }

    .balance-wrap .price-wrap {
        flex: 2;
        -webkit-flex: 2;
        text-align: right;
        line-height: 1rem;
        padding-right: 0.2rem;
        font-size: 0.32rem;
    }

    .balance-wrap .price-wrap span:nth-child(2) {
        color: #F51D2A
    }

    .balance-wrap .balance-btn {
        flex: 1;
        -webkit-flex: 1;
        background-color: #CC0004;
        font-size: 0.32rem;
        color: #FFFFFF;
        line-height: 1rem;
        text-align: center;
    }
</style>