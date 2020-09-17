<template>
    <div class="page">
        <div class='search-header'>
            <div class='back' @click="goBack()"></div>
            <div class='search' @click="isShow.show=true">请输入宝贝名称</div>
        </div>
        <div class='goods-main'>
            <div ref="scroll-classify" class='classify-wrap'>
                <div>
                    <div ref="item" :class="{'classify-item':true, active:checkedIndex===index}"
                         v-for="(item,index) in goodsMenu" :key="index" @click="handleToggle(index,item.cid)"
                        >{{item.title}}
                    </div>
                    <div :class="{'classify-item':true,'bottom-box':true}"
                    >
                    </div>
                    <div :class="{'classify-item':true,'bottom-box':true}"
                    >
                    </div>
                </div>
            </div>
            <div class='goods-content'>
                <router-view></router-view>
            </div>
        </div>
        <!--搜索组件-->
        <my-search :show="isShow"></my-search>
    </div>
</template>

<script>
    import IsScroll from '../../../assets/js/lib/iscroll'
    import {mapState,mapActions} from 'vuex'
    import MySearch from '../../../components/search'

    export default {
        data() {
            return {
                // 选中的索引
                checkedIndex: 0,
                // 搜索页显示
                searchShow:{show:false},
                isShow: {show:false},
            }
        },
        methods: {
            ...mapActions({
                getGoodsMenu:'goods/getGoodsMenuData'
            }),
            goBack() {
                this.$router.go(-1);
            },
            forbidDefaultScroll(e){
                e.preventDefault()
            },
            // 菜单栏切换动画
            menuToggleAction(index,time){
                // 计算被点击选项前面选项的高之和
                let beforeItemsHeight = this.$refs['item'][0].offsetHeight*index
                // 计算可视区域的菜单栏高度
                let viewMenuheight = this.$refs['scroll-classify'].offsetHeight
                // 计算整个滚动菜单栏的高度
                let wholeScrollHeight =  this.$refs['scroll-classify'].scrollHeight
                // 计算还剩下的选项的高之和
                let  afterItemsHeight = wholeScrollHeight-beforeItemsHeight
                // 点击滚动动画效果
                if (beforeItemsHeight>(viewMenuheight/3) && afterItemsHeight>viewMenuheight){
                    this.myScroll.scrollTo(0,-beforeItemsHeight,time,IsScroll.utils.elastic)
                }
            },
            // 商品菜单切换
            handleToggle(index,cid) {
                this.checkedIndex =index
                this.menuToggleAction(index,1000)
                this.$router.replace('/goods/classify/item?cid='+cid)
            }
        },
        computed: {
            ...mapState({
                goodsMenu:(state)=>state.goods.goodsMenu
            })
        },
        components: {
            MySearch
        },
        created() {
            // 获取商品菜单
            this.getGoodsMenu({success:()=>{
                    this.$nextTick(()=>{
                        this.myScroll.refresh()
                        // 获取菜单cid
                        let cid = this.$route.query.cid
                        if (cid){
                            // 根据cid查询菜单索引
                            let index=  this.goodsMenu.findIndex(item=>item.cid===cid)
                            this.checkedIndex =index
                            this.menuToggleAction(index,0)
                        }

                    })
                }})

        },
        mounted() {
            document.title=this.$route.meta.title
            // 禁用touchmove
            this.$refs['scroll-classify'].addEventListener('touchmove',this.forbidDefaultScroll)
            // 设置滚动
            this.myScroll = new IsScroll(this.$refs['scroll-classify'],{
                scrollX: false,
                scrollY:true,
                preventDefault:false
            })
        },
        beforeDestroy() {
            // 禁用touchmove
            this.$refs['scroll-classify'].removeEventListener('touchmove',this.forbidDefaultScroll)
        }
    }
</script>

<style scoped>
    .page {
        width: 100%;
        height: 100vh;
        overflow: hidden;
    }

    .search-header {
        width: 100%;
        height: 1rem;
        background: #FFFFFF;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
        border-bottom: 1px solid #EFEFEF;
    }

    .search-header .back {
        width: 0.8rem;
        height: 0.8rem;
        background-image: url("../../../assets/images/home/goods/back.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
    }

    .search-header .search {
        width: 80%;
        height: 0.69rem;
        border: solid 1px #B2B2B2;
        border-radius: 0.1rem;
        font-size: 0.28rem;
        color: #626262;
        line-height: 0.69rem;
        padding-left: 0.2rem;
    }

    .goods-main {
        width: 100%;
        height: 92.5vh;
        display: flex;
        display: -webkit-flex;
    }

    .goods-main .classify-wrap {
        width: 1.72rem;
        height: 100%;
        overflow: hidden;
        margin-right: 3%;
        position: relative;
        z-index: 1;
    }

    .goods-main .classify-wrap .classify-item {
        width: 100%;
        height: 0.8rem;
        border-bottom: 1px solid #EFEFEF;
        background-color: #FFFFFF;
        font-size: 0.28rem;
        text-align: center;
        line-height: 0.8rem;
        overflow: hidden;
    }

    .goods-main .classify-wrap .classify-item.active {
        color: #ff0000
    }

    .goods-main .goods-content {
        width: 71%;
        height: 100%;
    }
    .bottom-box {
        border: none!important;
    }
</style>
