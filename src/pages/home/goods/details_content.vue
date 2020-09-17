<template>
    <div class="page">
        <div class='content' v-html="goodsParams.bodys">
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState} from 'vuex'
    export default {
        created() {
            this.gid= this.$route.query.gid
            this.getGoodsParams({
                gid: this.gid, success: () => {
                }
            })
        },
        methods:{
            ...mapActions({
                getGoodsParams: 'goods/getGoodsParamsData',
            })
        },
        computed:{
            ...mapState({
                goodsParams: state => state.goods.goodsParams,
            })
        }

    }
</script>

<style scoped>
    .page{margin-top:1.2rem;}
    .content{width:90%;margin:0 auto;font-size:0.32rem;line-height:0.5rem;}
</style>
