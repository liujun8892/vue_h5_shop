<template>
    <div class="page">
        <div ref="swpier-wrap" class='swpier-wrap swiper-container'>
            <div class="swiper-wrapper">
                <div class="swiper-slide" v-for="(item,index) in goodsParams.images" :key="index"><img :src="item"
                                                                                                       alt=""/></div>
            </div>
            <div class="swiper-pagination" ref="swiper-pagination"></div>
        </div>
        <div class='goods-ele-main'>
            <div class='goods-title'>{{goodsParams.title}}</div>
            <div class='price'>¥{{goodsParams.price}}</div>
            <ul class='sales-wrap'>
                <li>快递：{{goodsParams.freight}}元</li>
                <li>月销量{{goodsParams.sales}}件</li>
            </ul>
        </div>
        <div class='reviews-main'>
            <div class="reviews-title">商品评价（{{pageInfo.total}}）</div>
            <div class='reviews-wrap'>
                <div class='reviews-list' v-for="(item,index) in commentList" :key="index">
                    <div class='uinfo'>
                        <div class='head'><img alt="" src="../../../assets/images/common/lazyImg.jpg"
                                               :data-echo="item.head"/></div>
                        <div class='nickname'>{{item.nickname}}</div>
                    </div>
                    <div class='reviews-content'>{{item.content}}</div>
                    <div class='reviews-date'>{{item.times}}</div>
                </div>
            </div>
            <div class='reviews-more' @click="$router.replace('/goods/details/review?gid='+gid)">查看更多评价</div>
        </div>
        <div class='bottom-btn-wrap'>
            <div class='btn fav' @click="addFav">收藏</div>
            <div class='btn cart' @click="addCart">加入购物车</div>
        </div>
        <div :class="{'mask':true, 'hide':!cartPanelShow}"></div>
        <div ref="cart-panel" :class="{'cart-panel':true,'down':!cartPanelShow,'up':cartPanelShow}">
            <div ref="goods-info" class='goods-info'>
                <div class='close-panel-wrap'>
                    <div class='spot'></div>
                    <div class="line"></div>
                    <div class='close' @click="closeCartPanel"></div>
                </div>
                <div ref="goods-img" class='goods-img'>
                    <img :src="goodsParams.images&&goodsParams.images[0]" alt=""/>
                </div>
                <div class='goods-wrap'>
                    <div class='goods-title'>{{goodsParams.title}}</div>
                    <div class='price'>¥{{goodsParams.price}}</div>
                    <div class='goods-code'>商品编码:{{goodsParams.gid}}</div>
                </div>
            </div>
            <div class='attr-wrap'>
                <div class='attr-list' v-for="(item,index) in goodsSpec" :key="index">
                    <div class='attr-name'>{{item.title}}</div>
                    <div class='val-wrap'>
                        <span :class="{'val':true,'active':item.checkedIndex===index1}"
                              v-for="(item1,index1) in item.values" :key="index1" @click="toggleParams(index,index1)">{{item1.value}}</span>
                    </div>
                </div>
            </div>
            <div class='amount-wrap'>
                <div class='amount-name'>购买数量</div>
                <div class="amount-input-wrap">
                    <div :class="{'btn':true,'dec':true,'active':goodsCount===1}" @click="decrCount">-</div>
                    <div class='amount-input'><input type="tel" maxlength="3" v-model="goodsCount" @input="validGoodsCount" @blur="setGoodsCountBlur($event)" /></div>
                    <div class='btn inc' @click="incrCount">+</div>
                </div>
            </div>
            <div class='sure-btn' @click="submitCart">确定</div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapMutations, mapState} from 'vuex'
    import Swiper from "../../../assets/js/lib/swiper";
    import TweenMax from "../../../assets/js/lib/TweenMax";
    import {Toast} from 'vant'

    export default {
        data() {
            return {
                cartPanelShow: false,
                gid: '',
                goodsCount: 1,
                addCartImgMove: false,
            }
        },
        created() {
            console.log(1)
            this.gid = this.$route.query.gid ? this.$route.query.gid : ''
            this.getGoodsParams({
                gid: this.gid, success: () => {
                    this.$nextTick(() => {
                        new Swiper(this.$refs['swpier-wrap'], {
                            autoplay: 3000,//可选选项，自动滑动
                            pagination: this.$refs['swiper-pagination'],
                            paginationClickable: true,
                            autoplayDisableOnInteraction: false
                        })
                        document.title = this.goodsParams.title
                    })
                }
            })
            this.getGoodsSpec({
                gid: this.gid, success: () => {
                }
            })
            this.getCommentList({
                gid: this.gid,
                success: () => {
                    setTimeout(()=>{
                        console.log(this.commentList)
                    },2000)
                    this.$nextTick(() => {
                        this.$util.lazyImg()
                    })
                }
            })
        },
        methods: {
            ...mapActions({
                getGoodsParams: 'goods/getGoodsParamsData',
                getGoodsSpec: 'goods/getGoodsSpecData',
                getCommentList: 'reviews/getGoodsCommentData',
                _addFav: 'goods/_addFav',
            }),
            ...mapMutations({
                setGoodsSpecChecked: 'goods/SET_GOODS_SPEC_CHECKED',
                addGoodsCart: 'cart/ADD_GOODS_CART',
                clearGoodsParams: 'goods/CLEAR_GOODS_PARAMS'
            }),
            addCart() {
                this.cartPanelShow = true
            },
            closeCartPanel() {
                this.cartPanelShow = false
            },
            toggleParams(index, childIndex) {
                this.setGoodsSpecChecked({index, childIndex})
            },
            validGoodsCount(e) {
                this.goodsCount = e.target.value
                this.goodsCount = this.goodsCount.replace(/[^\d]/g, '')
                if (this.goodsCount === '') {
                   return
                }
                this.goodsCount = parseInt(this.goodsCount)
            },
            incrCount() {
                this.goodsCount++
            },
            decrCount() {
                if (this.goodsCount === 1) return
                this.goodsCount--
            },
            submitCart() {
                let unCheckedSpec = this.validSpec()
                // 校验spec是否都选了
                if (unCheckedSpec) {
                    return Toast('请选择' + unCheckedSpec)
                }
                // 加入购物车动画 封装商品信息加入vuex购物车和本地缓存
                this.addCartImgAction(this.addGoodsToCart)
            },
            validSpec() {
                for (let i = 0; i < this.goodsSpec.length; i++) {
                    if (this.goodsSpec[i].checkedIndex === -1) {
                        return this.goodsSpec[i].title
                    }
                }
            },
            setGoodsCountBlur(e) {
                if (!this.goodsCount){
                    this.goodsCount =1
                }
            },
            addCartImgAction(callBack) {
                if (!this.addCartImgMove) {
                    let goodsInfo = this.$refs['goods-info']
                    let goodsImg = this.$refs['goods-img']
                    let cloneImg = goodsImg.cloneNode(true)
                    cloneImg.style.cssText = "position:absolute;z-index:10;top:.2rem;left:.2rem;width:.4rem;height:.4rem"
                    goodsInfo.appendChild(cloneImg)
                    let cartIcon = document.getElementById('cart-icon')
                    let cartTop = window.innerHeight - this.$refs['cart-panel'].offsetHeight
                    this.addCartImgMove = true
                    TweenMax.to(cloneImg, 2, {
                        bezier: [{x: cloneImg.offsetLeft, y: -100}, {x: cartIcon.offsetLeft, y: -cartTop}],
                        onComplete: () => {
                            this.addCartImgMove = false
                            cloneImg.remove()
                            callBack()
                        }
                    })
                    TweenMax.to(cloneImg, .2, {rotation: 360, repeat: -1})
                }
            },
            addGoodsToCart() {
                let goods = {}
                goods.gid = this.goodsParams.gid
                goods.title = this.goodsParams.title
                goods.images = this.goodsParams.images[0]
                goods.freight = this.goodsParams.freight
                goods.price = this.goodsParams.price
                goods.checked = true
                goods.specs = []
                this.goodsSpec.forEach(item => {
                    goods.specs.push({
                        attrid: item.attrid,
                        title: item.title,
                        vid: item.values[item.checkedIndex].vid,
                        value: item.values[item.checkedIndex].value
                    })
                    return item
                })
                goods.count = this.goodsCount
                this.addGoodsCart({goods})
            },
            // 加入收藏
            addFav() {
                if (this.isLogin) {
                    this._addFav({
                        gid: this.gid, success: (res) => {
                            console.log(res)
                            if (res.code === 200)  {
                                this.$toast('收藏成功')
                            }else {
                                this.$toast('收藏成功')
                                // this.$toast(res.data)
                            }
                        }
                    })
                } else {
                    this.$toast({
                        message: '请先登录', duration: 1000, onClose: () => {
                            this.$router.push('/login')
                        }
                    })
                }

            }
        },
        computed: {
            ...mapState({
                goodsParams: state => state.goods.goodsParams,
                goodsSpec: state => state.goods.goodsSpec,
                commentList: state => state.reviews.commentList,
                pageInfo: state => state.reviews.pageInfo,
                isLogin: state => state.user.isLogin
            })
        },
        beforeRouteLeave(to,from,next){
            this.clearGoodsParams()
            next()
        },
    }
</script>

<style scoped>
    @import "../../../assets/css/common/swiper.css";

    .swpier-wrap {
        width: 100%;
        height: 7rem;
        overflow: hidden;
        position: relative;
        z-index: 1;
        margin-top: 1.2rem;
    }

    .swpier-wrap img {
        width: 100%;
    }

    .goods-ele-main {
        width: 100%;
        height: auto;
        background-color: #FFFFFF;
        margin: 0 auto;
        padding-top: 0.5rem;
        padding-bottom: 0.5rem;
    }

    .goods-ele-main .goods-title {
        width: 90%;
        font-size: 0.28rem;
        margin: 0 auto;
    }

    .goods-ele-main .price {
        color: #F93036;
        width: 90%;
        margin: 0 auto;
        margin-top: 0.2rem;
        font-size: 0.32rem;
    }

    .goods-ele-main .sales-wrap {
        width: 90%;
        margin: 0 auto;
        font-size: 0.24rem;
        color: #969696;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        margin-top: 0.2rem;
    }

    .reviews-main {
        width: 100%;
        background-color: #FFFFFF;
        margin-top: 0.5rem;
        overflow: hidden;
        padding-bottom: 1.7rem
    }

    .reviews-main .reviews-title {
        color: #7b7f82;
        font-size: 0.32rem;
        width: 90%;
        margin: 0 auto;
        margin-top: 0.2rem;
    }

    .reviews-main .reviews-wrap {
        width: 90%;
        margin: 0 auto;
    }

    .reviews-main .reviews-wrap .reviews-list {
        width: 100%;
        margin-top: 0.4rem;
    }

    .reviews-main .reviews-list .uinfo {
        width: 100%;
        display: flex;
        display: -webkit-flex;
        height: 0.6rem;
        align-items: center;
        -webkit-align-items: center;
    }

    .reviews-main .reviews-list .uinfo .head {
        width: 0.6rem;
        height: 0.6rem;
        margin-right: 0.2rem;
    }

    .reviews-main .reviews-list .uinfo .head img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }

    .reviews-main .reviews-list .uinfo .nickname {
        width: auto;
        font-size: 0.28rem;
    }

    .reviews-main .reviews-list .reviews-content {
        width: 100%;
        margin: 0 auto;
        font-size: 0.28rem;
        margin-top: 0.2rem;
    }

    .reviews-main .reviews-list .reviews-date {
        width: auto;
        font-size: 0.28rem;
        color: #7b7f82;
        margin-top: 0.2rem;
    }

    .reviews-main .reviews-more {
        width: 2.44rem;
        height: 0.56rem;
        border: solid 1px #D50A17;
        line-height: 0.56rem;
        text-align: center;
        font-size: 0.28rem;
        margin: 0 auto;
        margin-top: 0.5rem;
        border-radius: 0.1rem;
    }

    .bottom-btn-wrap {
        width: 100%;
        height: 1.2rem;
        position: fixed;
        bottom: 0px;
        left: 0px;
        z-index: 10;
        display: flex;
        display: -webkit-flex;
    }

    .bottom-btn-wrap .btn {
        width: auto;
        height: 100%;
        flex: 1;
        -webkit-flex: 1;
        font-size: 0.36rem;
        color: #FFFFFF;
        text-align: center;
        line-height: 1.2rem;
    }

    .bottom-btn-wrap .btn.fav {
        background-color: #FCB40A;
    }

    .bottom-btn-wrap .btn.cart {
        background-color: #CC0004;
    }

    .mask {
        width: 100%;
        height: 100%;
        position: fixed;
        left: 0px;
        top: 0px;
        z-index: 11;
        background-color: rgba(0, 0, 0, 0.3)
    }

    .hide {
        display: none !important;
    }

    .cart-panel {
        width: 100%;
        height: 60%;
        position: fixed;
        z-index: 12;
        left: 0px;
        bottom: 0px;
        background-color: #f5f5f9;
        transition: transform 0.3s;
        -webkit-transition: transform 0.3s
    }

    .cart-panel.down {
        transform: translateY(120%);
        -webkit-transform: translateY(120%);
    }

    .cart-panel.up {
        transform: translateY(0%);
        -webkit-transform: translateY(0%);
    }

    .cart-panel .goods-info {
        width: 98%;
        height: 1.22rem;
        border-bottom: #EFEFEF solid 1px;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
        padding-left: 0.2rem;
        position: relative;
        z-index: 1;
        background-color: #FFFFFF;
    }

    .cart-panel .goods-info .goods-img {
        width: 0.8rem;
        height: 0.8rem;
        margin-right: 0.3rem;
    }

    .cart-panel .goods-info .goods-img img {
        width: 100%;
        height: 100%;
    }

    .cart-panel .goods-info .goods-wrap {
        width: 80%;
        height: auto;
    }

    .cart-panel .goods-info .goods-wrap .goods-title {
        width: 100%;
        height: 0.7rem;
        font-size: 0.24rem;
        overflow: hidden;
    }

    .cart-panel .goods-info .goods-wrap .price {
        color: #F93036;
        font-size: 0.24rem;
    }

    .cart-panel .goods-info .goods-wrap .goods-code {
        color: #888888;
        font-size: 0.24rem;
        position: absolute;
        z-index: 1;
        right: 0.2rem;
        bottom: 0px;
    }

    .cart-panel .close-panel-wrap {
        width: 0.6rem;
        height: 1.2rem;
        position: absolute;
        right: -0.2rem;
        top: -1rem;
        z-index: 2;
    }

    .cart-panel .close-panel-wrap .spot {
        width: 0.12rem;
        height: 0.12rem;
        position: absolute;
        z-index: 1;
        bottom: 0px;
        left: 0px;
        background-color: #000000;
        border-radius: 100%;
    }

    .cart-panel .close-panel-wrap .line {
        width: 1px;
        height: 0.72rem;
        background-color: #FFFFFF;
        position: absolute;
        z-index: 1;
        left: 0.05rem;
        bottom: 0.05rem;
    }

    .cart-panel .close-panel-wrap .close {
        width: 0.4rem;
        height: 0.4rem;
        background-image: url('../../../assets/images/home/goods/x.png');
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        position: absolute;
        left: -0.14rem;
        top: 0.1rem;
        z-index: 1;
    }

    .cart-panel .attr-wrap {
        width: auto;
        max-height: 3.5rem;
        padding-left: 0.2rem;
        background-color: #FFFFFF;
        overflow-y: scroll;
        overflow-scrolling: touch;
        -webkit-overflow-scrolling: touch;
    }

    .cart-panel .attr-wrap .attr-list {
        width: 100%;
        height: auto;
        margin-top: 0.2rem;
    }

    .cart-panel .attr-list .attr-name {
        width: auto;
        font-size: 0.32rem;
    }

    .cart-panel .attr-list .val-wrap {
        width: auto;
        margin-top: 0.2rem;
        display: flex;
        display: -webkit-flex;
        flex-wrap: wrap;
        -webkit-flex-wrap: wrap;
    }

    .cart-panel .attr-list .val-wrap .val {
        background: #EFEFEF;
        font-size: 0.32rem;
        padding: 0.1rem 0.2rem;
        border-radius: 0.1rem;
        margin-right: 0.17rem;
        display: table;
        margin-bottom: 0.17rem;
    }

    .cart-panel .attr-list .val-wrap .val.active {
        color: #FFFFFF;
        background-color: #FDA208;
    }

    .cart-panel .amount-wrap {
        width: auto;
        padding-left: 0.2rem;
        padding-top: 0.2rem;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        height: 0.64rem;
        align-items: center;
        -webkit-align-items: center;
        background-color: #FFFFFF;
        padding-bottom: 0.3rem;
    }

    .cart-panel .amount-wrap .amount-name {
        width: auto;
        font-size: 0.32rem;
    }

    .cart-panel .amount-wrap .amount-input-wrap {
        width: 2.04rem;
        height: 0.64rem;
        border: 1px solid #000000;
        margin-right: 0.2rem;
        border-radius: 0.08rem;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
    }

    .cart-panel .amount-wrap .amount-input-wrap .btn {
        width: 0.6rem;
        height: 0.4rem;
        font-size: 0.32rem;
        text-align: center;
        line-height: 0.4rem;
    }

    .cart-panel .amount-wrap .amount-input-wrap .btn.active {
        color: #B5B5B5;
    }

    .cart-panel .amount-wrap .amount-input-wrap .dec {
        border-right: 1px solid #000000;
    }

    .cart-panel .amount-wrap .amount-input-wrap .amount-input {
        display: flex;
        align-items: center;
        width: 0.76rem;
        height: 100%;

    }

    .cart-panel .amount-wrap .amount-input-wrap .amount-input input {
        width: 100%;
        height: 75%;
        text-align: center;
        font-size: 0.28rem;
    }

    .cart-panel .amount-wrap .amount-input-wrap .inc {
        border-left: 1px solid #000000;
    }

    .cart-panel .sure-btn {
        width: 100%;
        height: 0.8rem;
        position: absolute;
        bottom: 0px;
        left: 0px;
        z-index: 1;
        color: #FFFFFF;
        font-size: 0.32rem;
        background-color: #CF0005;
        text-align: center;
        line-height: 0.8rem;
    }

</style>
