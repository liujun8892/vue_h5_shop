<template>
    <div ref="goods-classify-content" class="goods-content-main">
        <div v-show="goodsList.length>0">
            <div class='goods-wrap' v-for="(item,index) in goodsList" :key="index">
                <div class='classify-name'>{{item.title}}</div>
                <div class='goods-items-wrap'>
                    <ul v-for="(item2,index2) in item.goods" :key="index2"
                        @click="$router.push('/goods/details?gid='+item2.gid)">
                        <li><img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item2.image" alt=""/></li>
                        <li>{{item2.title}}</li>
                    </ul>
                </div>
            </div>
            <div class="bottom-box"></div>
        </div>
        <div v-show="goodsList.length<=0" class="no-data">没有相关商品！</div>
    </div>
</template>

<script>
    import IsScroll from "../../../assets/js/lib/iscroll";
    import {mapActions, mapState} from 'vuex'

    export default {
        data() {
            return {}
        },
        methods: {
            ...mapActions({getGoodsList: 'goods/getGoodsListData'}),
            forbidDefaultScroll(e) {
                e.preventDefault()
            },
            // 获取商品列表
            getGoodsListData(cid){
                this.getGoodsList({
                    cid: cid, success: () => {
                        this.$nextTick(() => {
                            this.myScroll.scrollTo(0,0,0,IsScroll.utils.elastic)
                            this.myScroll.refresh()
                            this.$util.lazyImg()
                        })
                    }
                })
            }

        },
        computed: {
            ...mapState({
                goodsList: state => state.goods.goodsList
            })
        },
        created() {

            // 获取商品选项的cid
            let cid = this.$route.query.cid ? this.$route.query.cid : 492
            this.getGoodsListData(cid)
        },
        mounted() {
            this.$util.lazyImg()
            // 禁用touchmove
            this.$refs['goods-classify-content'].addEventListener('touchmove', this.forbidDefaultScroll)
            // 设置滚动
            this.myScroll = new IsScroll(this.$refs['goods-classify-content'], {
                scrollX: false,
                scrollY: true,
                preventDefault: false
            })
            this.myScroll.on('scrollEnd', () => {
                this.$util.lazyImg()
            })

        },
        beforeRouteUpdate(to, from, next) {
            // 获取商品选项的cid
            let cid = to.query.cid
            this.getGoodsListData(cid)
            next();
        },
        beforeDestroy() {
            this.$refs['goods-classify-content'].removeEventListener("touchmove", this.forbidDefaultScroll);
        }
    }
</script>

<style scoped>
    .goods-content-main {
        width: 100%;
        height: 100%;
        overflow: hidden;
        position: relative;
        z-index: 1;
    }

    .goods-wrap {
        width: 100%;
        height: auto;
    }

    .goods-wrap .classify-name {
        font-size: 0.28rem;
        width: 100%;
        height: 0.6rem;
        line-height: 0.6rem;
        overflow: hidden;
    }

    .goods-wrap .goods-items-wrap {
        width: 100%;
        height: auto;
        background-color: #FFFFFF;
        padding-top: 0.2rem;
        overflow: hidden;
    }

    .goods-wrap .goods-items-wrap ul {
        width: 32%;
        height: auto;
        float: left;
        margin-left: 0.5%;
        margin-right: 0.5%;
        margin-bottom: 0.2rem;
    }

    .goods-wrap .goods-items-wrap ul li:nth-child(1) {
        width: 1.5rem;
        height: 1.5rem;
        overflow: hidden;
        margin: 0 auto;
        text-align: center
    }

    .goods-wrap .goods-items-wrap ul li:nth-child(1) img {
        width: auto;
        height: auto;
        max-width: 100%;
        max-height: 100%;
    }

    .goods-wrap .goods-items-wrap ul li:nth-child(2) {
        width: 90%;
        height: 0.8rem;
        font-size: 0.24rem;
        overflow: hidden;
        text-align: center;
        margin: 0 auto;
        white-space: nowrap;
        text-overflow: ellipsis;
        margin-top: 0.2rem;
    }
    .bottom-box {
        height: 0.8rem;
        background-color: #fff;
    }
</style>
