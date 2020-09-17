<template>
    <div class='page'>
        <div class='search-top'>
            <div class='search-header'>
                <div class='back' @click="$router.go(-1)"></div>
                <div class='search-wrap'>
                    <div class='search-icon'></div>
                    <div class='search-text' @click="isShow.show=true">{{keyword}}</div>
                </div>
                <div class='screen-btn' @click="toggleClassifyShow">筛选</div>
            </div>
            <div class='order-main'>
                <div :class='{"order-item":true,"active":searchIndex!==3}' @click="allToggleShow">
                    <div class="order-text">综合</div>
                    <div class='order-icon'></div>
                    <ul :class="{'order-menu':true,'hide':allShow}">
                        <li :class='{"active":searchIndex===index}'
                            v-for="(item,index) in productSearchOrderList.slice(0,3)" :key="index"
                            @click="toggleSearchChecked(index)">{{item.searchName}}
                        </li>
                    </ul>
                </div>
                <div :class="{'order-item':true,'active':searchIndex===3 }" @click="toggleSearchChecked(3)">
                    <div class="order-text">{{productSearchOrderList[3].searchName}}</div>
                </div>
            </div>
        </div>
        <div class='goods-main'>
            <template v-if="this.localGoodsList.length>0">
                <div class='goods-list' v-for="(item,index) in localGoodsList" :key="index" @click="$router.push('/goods/details?gid='+item.gid)">
                    <div class='image'><img src="../../../assets/images/common/lazyImg.jpg" :data-echo="item.image"/>
                    </div>
                    <div class='goods-content'>
                        <div class='goods-title'>{{item.title}}</div>
                        <div class='price'>¥{{item.price}}</div>
                        <div class='sales'>销量<span>{{item.sales}}</span>件</div>
                    </div>
                </div>
            </template>
            <div class="null-item" v-else>没有相关商品！</div>
        </div>
        <div ref="mask" class='mask' v-show="isClassifyShow" @click="isClassifyShow=false"></div>
        <div ref="screen" :class="{'screen':true,'move':isClassifyShow,'unmove':!isClassifyShow}">
            <div>
                <div class='attr-wrap'>
                    <div class='attr-title-wrap'>
                        <div class='attr-name'>分类</div>
                        <div :class="{'attr-icon':true,'up':!isMenuShow}" @click="toggleMenuShow"></div>
                    </div>
                    <div :class="{'item-wrap':true,'hide':!isMenuShow}">
                        <div :class='{"item":true,"active":checkedMenuIndex===index}' v-for="(item,index) in goodsMenu"
                             :key="index" @click="toggleCheckedMenu(index)">{{item.title}}
                        </div>
                    </div>
                </div>
                <div style='width:100%;height:1px;backgroundColor:#EFEFEF'></div>
                <div class='attr-wrap'>
                    <div class='attr-title-wrap'>
                        <div class='attr-name'>价格区间</div>
                        <div class='price-wrap'>
                            <div class='price-input'><input type="tel" placeholder="最低价" :value="minPrice"
                                                            @input="handleMinPriceInput"/></div>
                            <div class='price-line'> </div>
                            <div class='price-input'><input type="tel" placeholder="最高价" :value="maxPrice"
                                                            @input="handleMaxPriceInput"/></div>
                        </div>
                        <div class='attr-icon' :class="{'attr-icon':true,'up':!isPriceShow}"
                             @click="togglePriceShow"></div>
                    </div>
                    <div :class="{'item-wrap':true,'hide':!isPriceShow}">
                        <div :class='{"item":true,"active":checkedPriceIndex===index}' v-for="(item,index) in priceList"
                             :key="index" @click="toggleCheckedPrice(index)">{{item.minPrice}}-{{item.maxPrice}}
                        </div>
                    </div>
                </div>
                <div style='width:100%;height:0.3rem;backgroundColor:#EFEFEF'></div>
                <div>
                    <div class='attr-wrap' v-for="(item0,index0) in localGoodsAttr" :key="index0">
                        <div class='attr-title-wrap'>
                            <div class='attr-name'>{{item0.title}}</div>
                            <div :class="{'attr-icon':true,'up':!item0.show}" @click="toggleColorShow(item0)"></div>
                        </div>
                        <div :class="{'item-wrap':true,'hide':!item0.show}">
                            <div :class='{"item":true,"active":item0.checkedIndex===index}'
                                 v-for="(item,index) in item0.param" :key="index"
                                 @click="toggleGoodsAttr(index0,index)">{{item.title}}
                            </div>
                        </div>
                    </div>
                    <div style='width:100%;height:1px;backgroundColor:#EFEFEF'></div>
                </div>
                <div style='width:100%;height:1.2rem'></div>
            </div>
            <div class='handel-wrap'>
                <div class='item'>共<span>{{this.localPageInfo.total}}</span>件</div>
                <div class='item reset' @click="resetCondition">全部重置</div>
                <div class='item sure' @click="conditionSearch">确定</div>
            </div>
        </div>
        <!--搜索组件-->
        <my-search :show="isShow"></my-search>
    </div>
</template>

<script>
    import MySearch from '../../../components/search'
    import IsScroll from '../../../assets/js/lib/iscroll'
    import {mapActions, mapState} from 'vuex'
    import UpRefresh from '../../../assets/js/lib/uprefresh'

    export default {
        name: "search",
        components: {
            MySearch
        },
        created() {
            // 获取右侧筛选的商品分类菜单
            this.getGoodsMenuData({
                success: () => {
                    this.$nextTick(() => {
                        this.myScroll.refresh()
                    })
                }
            })

            this.pullUp = new UpRefresh()
            // 获取商品列表
            this.init()

            // 根据搜索的关键词获取商品的属性
            this.getGoodsAttrs()
        },
        data() {
            return {
                isShow: {show: false},
                keyword: this.$route.query.keyword || '',
                productSearchOrderList: [
                    {
                        searchName: '综合',
                        searchType: 'all'
                    }, {
                        searchName: '从低到高',
                        searchType: 'up'
                    }, {
                        searchName: '从高到底',
                        searchType: 'down'
                    }, {
                        searchName: '销量',
                        searchType: 'sales'
                    }
                ],
                // 价格选项
                priceList: [{
                    priceType: 1,
                    minPrice: 1,
                    maxPrice: 50
                }, {
                    priceType: 2,
                    minPrice: 51,
                    maxPrice: 99
                }, {
                    priceType: 3,
                    minPrice: 100,
                    maxPrice: 300
                }, {
                    priceType: 4,
                    minPrice: 301,
                    maxPrice: 1000
                }, {
                    priceType: 5,
                    minPrice: 1001,
                    maxPrice: 4000
                }, {
                    priceType: 6,
                    minPrice: 4001,
                    maxPrice: 9999
                }
                ],
                // 显示隐藏综合搜索框
                allShow: true,
                // 选中搜索条件索引
                searchIndex: 0,
                // 分类搜索显示隐藏
                isClassifyShow: false,
                // 选中的分类菜单索引
                checkedMenuIndex: -1,
                // 分类菜单显示隐藏
                isMenuShow: true,
                // 价格选中
                checkedPriceIndex: -1,
                // 价格显示隐藏
                isPriceShow: true,
                // 最低价
                minPrice: '',
                // 最高价
                maxPrice: '',
                // 商品参数
                localGoodsAttr: [],
                // 商品列表
                localGoodsList: [],
                localPageInfo: {total: 0}
            }
        },
        mounted() {
            // 禁用touchmove
            this.$refs['screen'].addEventListener('touchmove', this.forbidDefaultScroll)
            // 设置滚动
            this.myScroll = new IsScroll(this.$refs['screen'], {
                scrollX: false,
                scrollY: true,
                preventDefault: false
            })
        },
        methods: {
            // vuex获取商品分类菜单
            ...mapActions({
                getGoodsMenuData: 'goods/getGoodsMenuData',
                getGoodsAttr: 'search/getGoodsAttrData',
                getGoodsList: 'search/getGoodsListData',
                loadMoreGoods: 'search/loadMoreGoods',
            }),
            // 显示隐藏综合搜索框
            allToggleShow() {
                this.allShow = !this.allShow
            },
            // 切换搜索选中
            toggleSearchChecked(index) {
                this.searchIndex = index
                this.init()
            },
            // 分类搜索显示隐藏
            toggleClassifyShow() {
                this.isClassifyShow = true
            },
            // 禁止默认事件
            forbidDefaultScroll(e) {
                e.preventDefault()
            },
            // 分类菜单显示隐藏
            toggleMenuShow() {
                this.isMenuShow = !this.isMenuShow
            },
            // 价格选中
            toggleCheckedPrice(index) {
                this.checkedPriceIndex = this.checkedPriceIndex === index ? -1 : index
                this.minPrice = this.priceList[index].minPrice
                this.maxPrice = this.priceList[index].maxPrice
                if (this.checkedPriceIndex === -1) {
                    this.minPrice = ''
                    this.maxPrice = ''
                }

            },
            // 价格显示隐藏
            togglePriceShow() {
                this.isPriceShow = !this.isPriceShow
            },
            // 处理价格输入数据合规
            handleMinPriceInput(e) {
                this.minPrice = e.target.value
                this.minPrice = this.minPrice.replace(/[^\d|\.]/g, '')

            },
            handleMaxPriceInput(e) {
                this.maxPrice = e.target.value
                this.maxPrice = this.maxPrice.replace(/[^\d|\.]/g, '')
            },
            // 颜色显示隐藏
            toggleColorShow(item) {
                item.show = !item.show
                // console.log(item)
                // this.isColorShow = !this.isColorShow
            },
            // 切换选中的 分类菜单
            toggleCheckedMenu(index) {
                this.checkedMenuIndex = this.checkedMenuIndex === index ? -1 : index

            },
            // 切换商品属性
            toggleGoodsAttr(parentIndex, childIndex) {
                this.localGoodsAttr[parentIndex].checkedIndex = this.localGoodsAttr[parentIndex].checkedIndex === childIndex ? -1 : childIndex

            },
            // 获取商品数据
            init() {
               let params = this.getParams()
                console.log(params)
                this.getGoodsList({
                    params,
                    success: () => {
                        this.localGoodsList = this.goodsList.data
                        this.localPageInfo = this.goodsList.pageinfo
                        this.$nextTick(() => {
                            this.$util.lazyImg()
                        })
                        this.pullUp.init({"curPage":1,"maxPage":parseInt(this.localPageInfo.pagenum),"offsetBottom":100},(page)=>{
                           this.loadMore(params,page)
                        });
                    }
                })
            },
            // 下拉加载更多
            loadMore(params,page){
                params.page = page
                this.loadMoreGoods({params})
            },
            // 获取最新的参数
            getParams(){
                let param = []
                this.localGoodsAttr.map(item => {
                    if (item.checkedIndex !== -1) {
                        return param.push(Number.parseInt(item.param[item.checkedIndex].pid))
                    }
                })
                param = JSON.stringify(param)
                let cid = this.checkedMenuIndex === -1 ? '' : this.goodsMenu[this.checkedMenuIndex].cid
              return  {
                    kwords: this.keyword,
                    param: param,
                    page: 1,
                    price1: this.minPrice,
                    price2: this.maxPrice,
                    otype: this.productSearchOrderList[this.searchIndex].searchType,
                    cid: cid
                }
            },
            // 获取商品属性
            getGoodsAttrs(){
                this.getGoodsAttr({
                    keyword: this.keyword, success: () => {
                        this.localGoodsAttr = this.goodsAttrs
                        this.$nextTick(() => {
                            this.myScroll.refresh()
                        })
                    }
                })
            },
            // 条件搜索
            conditionSearch() {
                this.init()
            },
            // 重置搜搜条件
            resetCondition() {
                this.checkedMenuIndex = -1
                this.checkedPriceIndex = -1
                this.minPrice = ''
                this.maxPrice = ''
                this.localGoodsAttr.map(item=>item.checkedIndex=-1)
            }
        },
        computed: {
            // vuex获取商品分类菜单菜单数据
            ...mapState({
                goodsMenu: (state) => state.goods.goodsMenu,
                goodsAttrs: (state) => state.search.goods_attrs,
                goodsList: (state) => state.search.goods_list,
            })
        },
        beforeRouteUpdate(to, from, next) {
            this.keyword = to.query.keyword || ''
            this.init()
            this.getGoodsAttrs()
            next()
        },
        beforeDestroy() {
            // 禁用touchmove
            this.$refs['screen'].removeEventListener('touchmove', this.forbidDefaultScroll)
        }
    }
</script>

<style scoped>
    .page {
        width: 100%;
        height: auto;
        background-color: #FFFFFF;
        overflow: hidden;
    }

    .search-top {
        width: 100%;
        position: fixed;
        z-index: 10;
        left: 0px;
        top: 0px;
        background-color: #FFFFFF;
    }

    .search-header {
        width: 100%;
        height: 0.8rem;
        border-bottom: 1px solid #EFEFEF;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        align-items: center;
        -webkit-align-items: center
    }

    .search-header .back {
        width: 0.8rem;
        height: 0.8rem;
        background-image: url('../../../assets/images/home/goods/back.png');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
    }

    .search-header .search-wrap {
        width: 75%;
        background: #EAEAEA;
        height: 80%;
        border-radius: 0.1rem;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
    }

    .search-header .search-wrap .search-icon {
        width: 0.5rem;
        height: 0.5rem;
        background-image: url("../../../assets/images/common/search.png");
        background-repeat: no-repeat;
        background-size: 100%;
        background-position: center;
        margin-left: 0.1rem;
        margin-right: 0.2rem;
    }

    .search-header .search-wrap .search-text {
        width: 90%;
        height: auto;
        font-size: 0.32rem;
    }

    .search-header .screen-btn {
        width: auto;
        height: auto;
        font-size: 0.32rem;
        margin-right: 0.1rem;
    }

    .search-top .order-main {
        width: 100%;
        height: 0.8rem;
        border-bottom: 1px solid #EFEFEF;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
    }

    .search-top .order-main .order-item {
        width: auto;
        height: auto;
        display: flex;
        display: -webkit-flex;
        margin-left: 0.4rem;
        position: relative;
        z-index: 1;
    }

    .search-top .order-main .order-item .order-text {
        font-size: 0.32rem;
    }

    .search-top .order-main .order-item.active .order-text {
        color: #FDA208
    }

    .search-top .order-main .order-item .order-icon {
        width: 0.35rem;
        height: 0.35rem;
        background-image: url("../../../assets/images/home/goods/down.png");
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
        margin-left: 0.1rem;
    }

    .search-top .order-main .order-item.active .order-icon {
        background-image: url("../../../assets/images/home/goods/up.png");
        background-size: 100%;
        background-position: center;
        background-repeat: no-repeat;
    }

    /*.search-top .order-main .order-item .order-icon.up{background-image:url("../../../../assets/images/home/goods/up.png");background-size:100%;background-position: center;background-repeat: no-repeat;}*/
    .search-top .order-main .order-item .order-menu {
        width: 688%;
        height: auto;
        background-color: #FFFFFF;
        position: absolute;
        z-index: 1;
        left: -35%;
        top: 0.63rem;
    }

    .search-top .order-main .order-item .order-menu li {
        width: 95%;
        height: 0.8rem;
        border-bottom: 1px solid #EFEFEF;
        font-size: 0.28rem;
        line-height: 0.8rem;
        padding-left: 0.4rem;
    }

    .search-top .order-main .order-item .order-menu li.active {
        color: #FDA208
    }

    .goods-main {
        width: 100%;
        height: auto;
        margin-top: 2rem;
    }

    .goods-main .goods-list {
        width: 100%;
        height: 2rem;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        overflow: hidden;
        margin-bottom: 0.4rem;
    }

    .goods-main .goods-list .image {
        width: 2rem;
        height: 2rem;
        margin-left: 0.1rem;
        overflow: hidden;
        text-align: center;
    }

    .goods-main .goods-list .image img {
        width: auto;
        height: auto;
        max-height: 100%;
        max-height: 100%;
    }

    .goods-main .goods-list .goods-content {
        width: 67%;
        height: 98%;
        border-bottom: solid 1px #cccccc;
    }

    .goods-main .goods-list .goods-title {
        width: 95%;
        height: 0.8rem;
        font-size: 0.28rem;
        overflow: hidden;
    }

    .goods-main .goods-list .price {
        font-size: 0.32rem;
        color: #F93036;
        margin-top: 0.1rem;
    }

    .goods-main .goods-list .sales {
        font-size: 0.24rem;
        color: #969696;
        margin-top: 0.1rem;
    }

    .goods-main .goods-list .sales span {
        color: #FDA208
    }

    .mask {
        width: 100%;
        height: 100%;
        position: fixed;
        z-index: 99;
        left: 0px;
        top: 0px;
        background-color: rgba(0, 0, 0, 0.3)
    }

    .screen {
        width: 80%;
        height: 100%;
        position: fixed;
        z-index: 100;
        right: 0px;
        top: 0px;
        background-color: #FFFFFF;
        transform: translateX(100%);
        -webkit-transform: translateX(100%);
        overflow: hidden;
    }

    .screen.move {
        transition: transform 0.3s;
        -webkit-transition: transform 0.3s;
        transform: translateX(0%);
        -webkit-transform: translateX(0%)
    }

    .screen.unmove {
        transition: transform 0.3s;
        -webkit-transition: transform 0.3s;
        transform: translateX(100%);
        -webkit-transform: translateX(100%)
    }

    .screen .attr-wrap {
        width: 100%;
    }

    .screen .attr-wrap .attr-title-wrap {
        width: 94%;
        height: 0.8rem;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        align-items: center;
        -webkit-align-items: center;
        padding-left: 0.2rem;
        padding-right: 0.2rem;
    }

    .screen .attr-wrap .attr-title-wrap .attr-name {
        font-size: 0.32rem;
    }

    .screen .attr-wrap .attr-title-wrap .attr-icon {
        width: 0.4rem;
        height: 0.4rem;
        background-image: url("../../../assets/images/home/goods/down.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
    }

    .screen .attr-wrap .attr-title-wrap .attr-icon.up {
        background-image: url("../../../assets/images/home/goods/up.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
    }

    .screen .attr-wrap .attr-title-wrap .price-wrap {
        width: auto;
        height: auto;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
        margin-left: 18%;
    }

    .screen .attr-wrap .attr-title-wrap .price-wrap .price-input {
        display: flex;
        align-items: center;
        width: 1rem;
        height: 0.4rem;
        border: 1px solid #EFEFEF
    }

    .screen .attr-wrap .attr-title-wrap .price-wrap .price-input input {
        width: 70%;
        height: 50%;
        font-size: 0.22rem;
    }

    .screen .attr-wrap .attr-title-wrap .price-wrap .price-line {
        width: 0.4rem;
        height: 1px;
        background-color: #EFEFEF;
        margin-left: 0.1rem;
        margin-right: 0.1rem;
    }

    .screen .attr-wrap .item-wrap {
        width: 100%;
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        -webkit-flex-wrap: wrap;
    }

    .screen .attr-wrap .item-wrap .item {
        width: 30%;
        height: 0.64rem;
        background-color: #EFEFEF;
        text-align: center;
        line-height: 0.64rem;
        overflow: hidden;
        font-size: 0.28rem;
        border-radius: 0.1rem;
        margin-left: 2%;
        margin-right: 1%;
        margin-bottom: 0.2rem;
    }

    .screen .attr-wrap .item-wrap .item.active {
        color: #FFFFFF;
        background-color: #FDA208;
    }

    .screen .handel-wrap {
        width: 100%;
        height: 1rem;
        background-color: #FFFFFF!important;
        border-top: 1px solid #EFEFEF;
        position: fixed;
        z-index: 5;
        transform: translateZ(1000px);
        left: 0px;
        bottom: 0px;
        display: flex;
        display: -webkit-flex;
    }

    .screen .handel-wrap .item {
        width: auto;
        height: 100%;
        font-size: 0.28rem;
        text-align: center;
        line-height: 1rem;
        flex: 1;
        -webkit-flex: 1
    }

    .screen .handel-wrap .item span {
        color: #FDA208
    }

    .screen .handel-wrap .item.reset {
        background-color: #EFEFEF
    }

    .screen .handel-wrap .item.sure {
        background-color: #FDA208;
        color: #FFFFFF
    }

    .hide {
        display: none !important;
    }
</style>
