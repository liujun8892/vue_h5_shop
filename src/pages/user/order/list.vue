<template>
    <div>
        <div class='order-list' v-for="(item,index) in orderList" :key="index"
             @click="$router.push('/user/order/details?ordernum='+item.ordernum)">
            <div class='ordernum-wrap'>
                <div class='ordernum'>订单编号：{{item.ordernum}}</div>
                <div class='status'>{{item.status==='0'?'待付款':item.status==='1'?'待收货':'已收货'}}</div>
            </div>
            <div class='item-list' v-for="(item2,index2) in item.goods" :key="index2">
                <div class='image'><img :data-echo="item2.image" src="../../../assets/images/common/lazyImg.jpg"/></div>
                <div class='title'>{{item2.title}}</div>
                <div class='amount'>x {{item2.amount}}</div>
            </div>
            <div class='total-wrap'>
                <div class='total'>实付金额：¥{{item.total}}</div>
                <div class="status-wrap">
                    <div class='status-btn' v-if="item.status==='0'" @click.stop="cancelOrder(index,item.ordernum)">
                        取消订单
                    </div>
                    <div class='status-btn' @click.stop="sureOrder(index,item)">
                        {{item.status=='0'?'去付款':item.status=='1'?'确认收货':'已收货'}}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState,mapMutations} from "vuex";
    import UpRefresh from '../../../assets/js/lib/uprefresh';

    export default {
        name: "order-list",
        methods: {
            ...mapActions({
                // 获取订单列表
                'getOrderList': 'order/_getOrderList',
                // 分页获取订单列表
                'getOrderListPage': 'order/_getOrderListPage',
                // 删除订单
                'cancel_order': 'order/_cancelOrder',
                // 确认订单
                'confirmReceipt': 'order/_confirmReceipt',
            }),
            ...mapMutations({
                // 订单支付
                'orderPay': 'order/ORDER_PAY',
            }),
            // 获取订单列表
            getData() {
                this.getOrderList({
                    status: this.status, page: 1, success: (res) => {
                        this.$nextTick(() => {
                            this.$util.lazyImg()
                        })
                        this.pullUp.init({
                            'maxPage': this.pageInfo.pagenum,
                            'curPage': 1,
                            'offsetBottom': 100
                        }, (page) => {
                            this.getOrderListPage({
                                page, status: this.status, success: () => {
                                    this.$util.lazyImg()
                                }
                            })
                        })
                    }
                })
            },
            //取消订单
            cancelOrder(index, orderNum) {
                this.$dialog.confirm({title: '', message: '您确认要取消吗?'}).then(() => {
                    this.cancel_order({
                        index, ordernum: orderNum, success: () => {
                            this.$util.lazyImg()
                        }
                    })
                }).catch(() => {
                })

            },
            // 订单支付
            ordersPay(index,status){
              this.orderPay({index,status})
            } ,
            //确认订单
            sureOrder(index, item) {
                 if (item.status==='0'){
                     this.ordersPay(index,'1')
                 }else if(item.status==='1'){
                     this.confirmReceipt({index,ordernum:item.ordernum})
                 }
            }
        },
        computed: {
            ...mapState({
                orderList: state => state.order.orderList,
                pageInfo: state => state.order.pageInfo,
            })
        },
        created() {
            this.status = this.$route.query.status ? this.$route.query.status : 'all'
            // 初始化分页插件
            this.pullUp = new UpRefresh()
            // 获取订单列表
            this.getData()
        },
        beforeDestroy() {
            this.pullUp.uneventSrcoll()
        },
        beforeRouteUpdate(to, from, next) {
            this.status = to.query.status
            // 获取订单列表
            this.getData()
            next()
        }
    }
</script>

<style scoped>
    .order-list {
        width: 100%;
        height: auto;
    }

    .order-list .ordernum-wrap {
        width: 96%;
        height: 0.8rem;
        border-bottom: #EFEFEF 1px solid;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        padding-left: 2%;
        padding-right: 2%;
        align-items: center;
        -webkit-align-items: center;
    }

    .order-list .ordernum-wrap .ordernum, .order-list .ordernum-wrap .status {
        width: auto;
        height: auto;
        font-size: 0.28rem;
    }

    .item-list {
        width: 100%;
        height: 1.6rem;
        border-bottom: #EFEFEF 1px solid;
        position: relative;
        z-index: 1;
    }

    .item-list .image {
        width: 1.2rem;
        height: 1.2rem;
        position: absolute;
        z-index: 1;
        left: 2%;
        top: 0.2rem;
    }

    .item-list .image img {
        width: 100%;
        height: 100%;
    }

    .item-list .title {
        width: 72%;
        height: auto;
        font-size: 0.28rem;
        position: absolute;
        z-index: 1;
        left: 22%;
        top: 0.2rem;
    }

    .item-list .amount {
        width: auto;
        height: auto;
        position: absolute;
        z-index: 1;
        right: 2%;
        bottom: 0.2rem;
        font-size: 0.24rem;
        color: #909090;
    }

    .total-wrap {
        width: 96%;
        height: 0.8rem;
        border-bottom: 1px solid #F17F1F;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        padding-left: 2%;
        padding-right: 2%;
    }

    .total-wrap .total {
        font-size: 0.28rem;
    }

    .total-wrap .status-btn {
        font-size: 0.24rem;
        width: 1.24rem;
        height: 0.52rem;
        line-height: 0.52rem;
        text-align: center;
        border: 1px solid #f15353;
        border-radius: 4px;
        margin-left: 0.2rem;
    }

    .total-wrap .status-wrap {
        display: flex;
        width: auto;
        justify-content: flex-end;
    }

</style>