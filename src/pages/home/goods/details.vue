<template>
    <div>
        <div class='details-header'>
            <div class='back' @click="$router.go(-1)"></div>
            <div class='tab-wrap'>
                <div :class="{'tab-name':true,'active':activeBarIndex===0}" @click="goPage('/goods/details?gid='+gid,0)">商品</div>
                <div :class="{'tab-name':true,'active':activeBarIndex===1}" @click="goPage('/goods/details/content?gid='+gid,1)">详情</div>
                <div :class="{'tab-name':true,'active':activeBarIndex===2}" @click="goPage('/goods/details/review?gid='+gid,2)">评价</div>
            </div>
            <div id="cart-icon" class='cart-icon' @click="goPage('/cart?from=details')">
                <div class='spot'></div>
            </div>
        </div>
        <div class="sub-page">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        data(){
            return {
                activeBarIndex: 0,
                gid:'',
            }
        },
        created() {
            this.gid = this.$route.query.gid?this.$route.query.gid:''
            if (this.$route.path==="/goods/details/item"){
                this.activeBarIndex = 0
            }else if (this.$route.path==="/goods/details/content"){
                this.activeBarIndex = 1
            }else {
                this.activeBarIndex = 2
            }
        },
        methods:{
            goPage(url,activeBarIndex){
                this.activeBarIndex = activeBarIndex
                this.$router.replace(url);
            }
        },
        beforeRouteUpdate(to,from,next){
            if (to.path==="/goods/details/review"){
                this.activeBarIndex = 2
            }
            next()
        }
    }
</script>

<style scoped>
    .details-header{width:100%;height:1rem;background-color:#FFFFFF;display:flex;display:-webkit-flex;align-items: center;-webkit-align-items: center;justify-content: space-between;-webkit-justify-content: space-between;position: fixed;z-index:10;left:0px;top:0px;}
    .details-header .back{width:0.8rem;height:0.8rem;background-image:url('../../../assets/images/home/goods/back.png');background-repeat: no-repeat;background-position: center;background-size:100%;}
    .details-header .tab-wrap{width:70%;height:100%;display:flex;display:-webkit-flex;justify-content: center;-webkit-justify-content: center;}
    .details-header .tab-wrap .tab-name{width:auto;height:96%;overflow:hidden;line-height:1rem;text-align:center;margin-left:9%;margin-right:9%;font-size:0.36rem;}
    .details-header .tab-wrap .tab-name.active{border-bottom: solid 2px #FDA208;}
    .details-header .cart-icon{width:0.8rem;height:0.8rem;background-image:url('../../../assets/images/home/goods/cart.png');background-repeat: no-repeat;background-position: center;background-size:100%;margin-right:0.2rem;position:relative;z-index:1;}
    .details-header .cart-icon .spot{width:0.2rem;height:0.2rem;background-color:#CC0004;border-radius: 100%;position:absolute;z-index:1;right:0px;top:0.15rem;}

    .sub-page{width:100%;}

</style>
