<template>
    <div class="page">
        <!--顶部固定控件-->
        <div class="header my_flex_between_align_center" :class="{'scroll':isScroll}">
            <!--分类按钮-->
            <div class="categories_icon" @click="$router.push('/goods/classify')">

            </div>
            <!--搜索盒子-->
            <div class="search_box my_flex_align_center" @click="openSearch">
                <div class="search_icon"></div>
                <div class="search_placeholder">请输入宝贝名称</div>
            </div>
            <!--登录按钮-->
            <div class="login" v-show="!isLogin" @click="$router.push('/login')">
                登录
            </div>
            <div class="uCenter_icon" v-show="isLogin" @click="$router.push('/my')">
            </div>
        </div>
        <!--轮播图-->
        <div class="banner">
            <div class="swiper-container" ref="swiper-container">
                <div class="swiper-wrapper">
                    <div class="swiper-slide" v-for="(item,index) in swipers" :key="index">
                        <img :src="item.image"  :alt="item.title">
                    </div>
                </div>
                <div class="swiper-pagination" ref="swiper-pagination"></div>
            </div>

        </div>
        <!--快捷导航栏-->
        <div class="quick_nav">
            <ul class="my_flex_between">
                <li class="my_flex_vertical_center" v-for="(item,index) in navs" :key="index" @click="$router.push('/goods/classify/item?cid='+item.cid)">
                    <img :src="item.image" :alt="item.title">
                    <span>{{item.title}}</span>
                </li>
            </ul>
        </div>
        <!--分类商品展示-->
        <template v-for="(item,index) in goods">
            <div class="category_goods_wrap" :key="index" v-if="item.items&&item.items.length===7">
                <div :class="'category_title'+' category_title'+(index+1)">
                    —— {{item.title}} ——
                </div>
                <div class="category_goods_row1 my_flex">
                    <div class="category_goods_left" @click="$router.push('/goods/details?gid='+item.items[0].gid)">
                        <div class="goods_title">{{item.items[0].title}}</div>
                        <div class="goods_text">
                            <span>精品打折</span>
                            <span :class="'goods_price'+' goods_price_'+(index+1)">{{item.items[0].price}}元</span>
                        </div>
                        <div class="goods_image">
                            <img src="../../../assets/images/common/lazyImg.jpg"
                                 :data-echo="item.items[0].image"
                                 :alt="item.items[0].title">
                        </div>
                    </div>
                    <div class="category_goods_right my_flex_vertical">
                        <div class="category_goods_item my_flex" v-for="(item1,index1) in item.items.slice(1,3)" @click="$router.push('/goods/details?gid='+item1.gid)"
                             :key="index1">
                            <div class="category_goods_info">
                                <div class="goods_title">
                                    {{item1.title}}
                                </div>
                                <div>
                                    品质精挑
                                </div>
                            </div>
                            <div class="category_goods_img">
                                <img src="../../../assets/images/common/lazyImg.jpg"
                                     :data-echo="item1.image"
                                     :alt="item1.title">
                            </div>
                        </div>
                    </div>
                </div>
                <div class="category_goods_row2 my_flex">
                    <div class="category_goods_item my_flex_f1" v-for="(item1,index1) in item.items.slice(3,7)"
                         :key="index1"
                         @click="$router.push('/goods/details?gid='+item1.gid)">
                        <div class="title">
                            {{item1.title}}
                        </div>
                        <div class="img">
                            <img src="../../../assets/images/common/lazyImg.jpg"
                                 :data-echo="item1.image"
                                 :alt="item1.title">
                        </div>
                        <div class="new_price">¥{{item1.price}}</div>
                        <div class="old_price">¥{{item1.price*2}}</div>
                    </div>
                </div>
            </div>
            <div class="category_goods_wrap" v-if="item.items&&item.items.length===6" :key="index">
                <div class="category_title category_title2">
                    —— {{item.title}} ——
                </div>
                <div class="category_goods_row1 my_flex">
                    <div class="category_goods_left my_flex_f1 category_list_2"
                         v-for="(item1,index1) in item.items.slice(0,2)" :key="index1"  @click="$router.push('/goods/details?gid='+item1.gid)">
                        <div class="title goods_common_title">
                            {{item1.title}}
                        </div>
                        <div class="text">
                            火爆开售
                        </div>
                        <div class="img">
                            <img src="../../../assets/images/common/lazyImg.jpg"
                                 :data-echo="item1.image"
                                 :alt="item1.title">
                        </div>
                    </div>
                </div>
                <div class="category_goods_row2 my_flex">
                    <div class="category_goods_item my_flex_f1" v-for="(item1,index1) in item.items.slice(2,6)"
                         :key="index1"
                         @click="$router.push('/goods/details?gid='+item1.gid)">
                        <div class="title">
                            {{item1.title}}
                        </div>
                        <div class="img">
                            <img src="../../../assets/images/common/lazyImg.jpg"
                                 :data-echo="item1.image"
                                 :alt="item1.title">
                        </div>
                        <div class="new_price">¥{{item1.price}}</div>
                        <div class="old_price">¥{{item1.price*2}}</div>
                    </div>
                </div>
            </div>
        </template>

        <!--为您推荐-->
        <div class="recommend_title my_flex_align_center">
            <div class="line"></div>
            <div class="recommend_text_wrap my_flex_f1 my_flex">
                <div class="recommend_icon"></div>
                <div>为您推荐</div>
            </div>
            <div class="line"></div>
        </div>
        <div class="recommend_goods_wrap my_flex">
            <template v-if="recom_goods.length>0">
                <div class="recommend_goods_item" v-for="(item,index) in recom_goods" :key="index"  @click="$router.push('/goods/details?gid='+item.gid)">
                    <div class="recommend_img">
                        <img src="../../../assets/images/common/lazyImg.jpg"
                             :data-echo="item.image"
                             :alt="item.title"
                             class="common_img">
                    </div>
                    <div class="recommend_title">
                        {{item.title}}
                    </div>
                    <div class="recommend_price">
                        ¥{{item.price}}
                    </div>
                </div>
            </template>
        </div>
        <!--搜索组件-->
        <my-search :show="isShow"></my-search>
    </div>
</template>

<script>
    import Swiper from '../../../assets/js/lib/swiper.js'
    import MySearch from '../../../components/search'
    import {mapActions, mapState} from 'vuex'

    export default {
        name: "index",
        components: {
          MySearch
        },
        data() {
            return {
                // 顶部固定控件渐变色开关
                isScroll: false,
                shouldScroll: true,
                // 搜索控件的显示隐藏
                isShow: {show:false},
                //
            }
        },
        created() {
            // 获取轮播图数据
            this.getSwiper({
                success: () => {
                    this.$nextTick(() => {
                        new Swiper(this.$refs['swiper-container'], {
                            autoplay: 3000,//可选选项，自动滑动
                            pagination: this.$refs['swiper-pagination'],
                            paginationClickable: true,
                            autoplayDisableOnInteraction: false
                        })
                        this.$util.lazyImg()
                    })
                }
            })
            // 获取快捷导航栏数据
            this.getNavs({success:()=>{
                    this.$nextTick(() => {
                        this.$util.lazyImg()
                    })
                }})
            // 获取商品列表
            this.getGoods({
                success: () => {
                    this.$nextTick(() => {
                        this.$util.lazyImg()
                    })
                }
            })
            // 获取推荐商品数据
            this.getRecommendGoods({
                success: () => {
                    this.$nextTick(() => {
                        this.$util.lazyImg()
                    })
                }
            })
        },
        mounted() {
            window.addEventListener('scroll', this.handleScroll)
        },
        methods: {
            // 解构vuex中的异步方法
            ...mapActions({
                getSwiper: "index/getSwiper",
                getNavs: "index/getNavs",
                getGoods: "index/getGoods",
                getRecommendGoods: "index/getRecommendGoods",
            }),
            // 滚动，头部控件变色
            handleScroll() {
                //  兼容性获取滚动的值
                let scrollValue = document.body.scrollTop || document.documentElement.scrollTop
                if (scrollValue > 100) {
                    if (this.shouldScroll) {
                        this.isScroll = true
                        this.shouldScroll = false
                    }
                } else {
                    if (this.isScroll) {
                        this.isScroll = false
                        this.shouldScroll = true
                    }
                }
            },
            // 打开搜索页面
            openSearch() {
                this.isShow.show=true
            },
            // 去分类页面
            goClassify(item){
                console.log(1)
                console.log(item)
            }
        },
        computed: {
            ...mapState({
                swipers: (state) => state.index.swiper,
                navs: (state) => state.index.navs,
                goods: (state) => state.index.goods,
                recom_goods: (state) => state.index.recom_goods,
                isLogin: (state) => state.user.isLogin
            })
        },
        destroyed() {
            window.removeEventListener('scroll', this.handleScroll)
        },
        activated() {
            window.addEventListener('scroll', this.handleScroll)
        },
        deactivated() {
            window.removeEventListener('scroll', this.handleScroll)
        }
    }
</script>

<style scoped>
    @import "../../../assets/css/common/swiper.css";

    .page {
        width: 100%;
        min-height: 100%;
        margin-bottom: 1.5rem;
    }

    .header {
        width: 100%;
        height: 1rem;
        padding: .3rem;
        position: fixed;
        z-index: 10;
        background: linear-gradient(rgba(1, 1, 1, .2), hsla(0, 0%, 100%, 0));
        box-sizing: border-box;
    }

    .header.scroll {
        background: linear-gradient(#eb1652, hsla(0, 0%, 100%, 0));
    }

    .categories_icon {
        width: .6rem;
        height: .6rem;
        background: url("../../../assets/images/common/class.png") no-repeat center;
        background-size: 100%;
    }

    .search_box {
        margin: 0 .2rem;
        flex: 1;
        height: .56rem;
        background-color: rgba(255, 255, 255, .5);
        border-radius: 4px;
        font-size: .32rem;
        color: #ffffff;
    }

    .search_box .search_icon {
        width: .44rem;
        height: .44rem;
        margin: 0 .2rem;
        background: url("../../../assets/images/common/search.png") no-repeat center;
        background-size: 100%;
    }

    .login {
        width: auto;
        height: .44rem;
        font-size: .32rem;
        color: #ffffff;
    }

    .uCenter_icon{
        width: .6rem;
        height: .6rem;
        background: url("../../../assets/images/home/index/my.png") no-repeat  center;
        background-size: 100%;
    }

    .banner {
        width: 100%;
        height: 3.66rem;
    }

    .banner img {
        width: 100%;
        height: 100%;
    }

    .quick_nav {
        margin: .2rem 0;
        width: 100%;
        height: 1.6rem;
        background-color: #fff;
    }

    .quick_nav ul {
        padding: 0 2%;
        width: 100%;
        height: 100%;
        box-sizing: border-box;
    }

    .quick_nav ul li {
        width: 1.4rem;
        font-size: .28rem;
        color: #7b7f82;
    }

    .quick_nav ul li img {
        margin-bottom: .18rem;
        width: .8rem;
        height: .8rem;
    }

    /*分类商品展示*/
    .category_goods_wrap {
        margin-top: .2rem;
        width: 100%;
        background-color: #fff;
    }

    .category_goods_wrap .category_title {
        width: 100%;
        height: .62rem;
        text-align: center;
        line-height: .62rem;
        font-size: .32rem;
        border-bottom: 1px solid #EFEFEF;
    }

    .category_goods_wrap .category_title.category_title1 {
        color: #f73b61;
    }

    .category_goods_row1 {
        width: 100%;
        height: 3.5rem;
        border-bottom: 1px solid #EFEFEF;
    }

    .category_goods_row1 > div {
        flex: 1;
    }

    .category_goods_row1 div {
        overflow: hidden;
    }

    .category_goods_row1 > div:nth-child(1) {
        border-right: 1px solid #EFEFEF;
    }

    .category_goods_left .goods_title {
        padding: .18rem 0 0 .2rem;
        font-size: .28rem;
        height: .32rem;
        font-weight: 700;
    }

    .category_goods_left .goods_text {
        padding: .12rem 0 0 .2rem;
        font-size: .28rem;
    }

    .category_goods_left .goods_text span:nth-child(1) {
        color: #cb385d;
    }

    .goods_text span:nth-child(2) {
        position: relative;
        left: .6rem;
        background-color: #f21d4f;
        color: #ffffff;
        border-radius: 8px;
        padding: .05rem .05rem;
    }

    .category_goods_left .goods_image {
        width: 3rem;
        height: 2rem;
        margin: 0.2rem auto 0;
    }

    .category_goods_left .goods_image img {
        width: 100%;
        height: 100%;
    }

    .category_goods_item {
        flex: 1;
    }

    .category_goods_item:nth-child(1) {
        border-bottom: 1px solid #EFEFEF;
    }

    .category_goods_item .category_goods_info {
        width: 60%;
    }

    .category_goods_item .category_goods_info .goods_title {

        padding: .18rem 0 0 .2rem;
        font-size: .28rem;
        height: .32rem;
        font-weight: 700;
    }

    .category_goods_item .category_goods_info div:nth-child(2) {
        padding: .12rem 0 0 .2rem;
        font-size: .26rem;
        color: #7b7f82;
    }

    .category_goods_item .category_goods_img {
        margin: .2rem 0 0 .1rem;
        width: 1.2rem;
        height: 1.2rem;
    }

    .category_goods_item .category_goods_img img {
        width: 100%;
        height: 100%;
    }

    .category_goods_row2 {
        /*overflow: hidden;*/
    }

    .category_goods_row2 .category_goods_item {
        height: 3.2rem;
        border-right: 1px solid #EFEFEF;
    }

    .category_goods_row2 .category_goods_item:last-child {
        border-right: none;
    }

    .category_goods_row2 .category_goods_item .title {
        margin: .2rem auto 0;
        overflow: hidden;
        height: .4rem;
        font-size: .28rem;
        font-weight: 700;
    }

    .category_goods_row2 .category_goods_item .img {
        width: 1.5rem;
        height: 1.5rem;
        margin: .2rem auto 0;
    }

    .category_goods_row2 .category_goods_item .img img {
        width: 100%;
        height: 100%;
    }

    .category_goods_row2 .category_goods_item .new_price {
        margin-top: .15rem;
        text-align: center;
        font-size: .28rem;
        color: #d32a4e;
    }

    .category_goods_row2 .category_goods_item .old_price {
        text-align: center;
        font-size: .28rem;
        color: #7b7f82;
        text-decoration: line-through;
    }

    .category_goods_wrap .category_title.category_title2 {
        color: #fe6719;
    }

    .goods_common_title {
        width: 98%;
        margin: .2rem auto 0;
        overflow: hidden;
        height: .4rem;
        font-size: .28rem;
        font-weight: 700;
        text-align: center;

    }

    .category_list_2 .text {
        margin-top: .1rem;
        text-align: center;
        font-size: .28rem;
        color: #7b7f82;
    }

    .category_list_2 .img {
        width: 1.8rem;
        height: 2rem;
        margin: .1rem auto 0;
    }

    .category_list_2 .img img {
        width: 100%;
        height: 100%;
    }

    .category_goods_wrap .category_title.category_title3 {
        color: #5fc600;

    }

    .category_goods_row1 .category_goods_left .goods_price.goods_price_3 {
        background-color: #5fc600;
    }

    /*为您推荐*/
    .recommend_title {
        height: 1rem;
        font-size: .32rem;
    }

    .recommend_title .line {
        width: 35%;
        height: 1px;
        background-color: #d4d4d4;
    }

    .recommend_title .recommend_icon {
        width: .4rem;
        height: .4rem;
        margin: 0 .2rem 0 .2rem;
        background: url("../../../assets/images/home/index/recom.png") no-repeat center;
        background-size: 100%;
    }

    .recommend_goods_wrap {
        width: 100%;
        flex-wrap: wrap;
    }

    .recommend_goods_wrap .recommend_goods_item {
        width: 46%;
        height: 4.5rem;
        margin: 0 2% .2rem 2%;
        background-color: #fff;
    }

    .recommend_goods_wrap .recommend_goods_item .recommend_img {
        width: 2.8rem;
        height: 2.8rem;
        margin: 0.2rem auto;
    }

    .common_img {
        width: 100%;
        height: 100%;
    }

    .recommend_title {
        height: .8rem;
        font-size: .28rem;
        overflow: hidden;
        height: .8rem;
        width: 100%;
    }

    .recommend_price {
        font-size: .28rem;
        color: #d32a4e;
    }
</style>