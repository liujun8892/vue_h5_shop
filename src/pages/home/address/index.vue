<template>
    <div class="page">
        <SubHeader title="选择收货地址"></SubHeader>
        <div class='main'>
            <div class='address-nav'>
                <div class='address-nav-name-1'>配送地址</div>
                <div class='address-nav-name-2' @click="$router.push('/address/add')">+添加收货地址</div>
            </div>
            <template v-show="address.length>0">
                <div class='address-list' v-for="(item,index) in address" :key="index" @click="selectAddress(item.aid)">
                    <div class='address-info-wrap'>
                        <div class='check-mark' v-if="item.isdefault==='1'?true:false"></div>
                        <div :class="{'address-info':true, 'default':item.isdefault==='1'?true:false}">
                            <div class='person'><span>{{item.name}}</span><span>{{item.cellphone}}</span></div>
                            <div class='address'>
                                <span class='default' v-if="item.isdefault==='1'?true:false">默认</span>
                                <span class='text'>{{item.province}}{{item.city}}{{item.area}}{{item.address}}</span>
                            </div>
                        </div>
                    </div>
                    <div class='handle-wrap'>
                        <div class='edit' @click.stop="$router.push('/address/mod?aid='+item.aid)"></div>
                        <div class='del' @click.stop="delAddress(index,item.aid)"></div>
                    </div>
                </div>
            </template>
            <div class="no-data" v-show="address.length===0">您还没有添加收货地址！</div>
        </div>
    </div>
</template>

<script>
    import {mapActions,mapState} from "vuex";
    import SubHeader from "../../../components/sub_header";
    export default {
        name: "my-address",
        components:{
            SubHeader
        },
        data(){
            return {

            }
        },
        created(){
            this.$util.authUserStatus(this)
            this.getAddressList()
        },
        mounted(){
            document.title=this.$route.meta.title;
        },
        computed:{
          ...mapState({
                address: state=>state.address.address
          })
        },
        methods:{
            ...mapActions({
                getAddressList:'address/_getAddressList',
                deleteAddress:'address/_deleteAddress',
            }),
            //删除收货地址
            delAddress(index,aid){
                this.$dialog.confirm({
                    title: '',
                    message: '确认要删除吗?',
                })
                    .then(() => {
                        // on confirm
                        this.deleteAddress({index,aid})
                    })
                    .catch(() => {
                        // on cancel
                    });

            },
            //选择收货地址
            selectAddress(aid){
                sessionStorage['aid']= aid
                this.$router.go(-1)
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
        margin-top: 1rem;
    }

    .main .address-nav {
        width: 100%;
        height: 0.8rem;
        background-color: #D3C6BE;
        font-size: 0.32rem;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        align-items: center;
        -webkit-align-items: center;
    }

    .main .address-nav .address-nav-name-1 {
        margin-left: 0.2rem;
    }

    .main .address-nav .address-nav-name-2 {
        margin-right: 0.2rem;
    }

    .main .address-list {
        width: 100%;
        height: 2.22rem;
        border-bottom: 1px solid #C6C6C6;
    }

    .main .address-list .address-info-wrap {
        width: 90%;
        height: 1.42rem;
        border-bottom: #C6C6C6 1px dashed;
        margin: 0 auto;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
    }

    .main .address-list .address-info-wrap .check-mark {
        width: 0.4rem;
        height: 0.4rem;
        background-image: url("../../../assets/images/home/cart/gou.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 0.3rem;
    }

    .main .address-list .address-info-wrap .address-info.default {
        width: 90%;
    }

    .main .address-list .address-info-wrap .address-info {
        width: 100%;
        height: auto
    }

    .main .address-list .person {
        width: 100%;
        height: 0.5rem;
        border-bottom: #EFEFEF 1px solid;
        font-size: 0.28rem;
        overflow: hidden;
    }

    .main .address-list .person span:nth-child(1) {
        margin-right: 0.2rem;
    }

    .main .address-list .address {
        width: 100%;
        height: 0.6rem;
        overflow: hidden;
        line-height: 0.6rem;
        margin-top: 0.1rem;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

    .main .address-list .address .text {
        font-size: 0.32rem;
    }

    .main .address-list .address .default {
        padding: 0.05rem 0.1rem;
        background-color: #FDB709;
        color: #FFFFFF;
        font-size: 0.24rem;
        border-radius: 4px;
        margin-right: 0.2rem;
    }

    .main .address-list .handle-wrap {
        width: 100%;
        height: 0.76rem;
        display: flex;
        display: -webkit-flex;
        justify-content: flex-end;
        -webkit-justify-content: flex-end;
        align-items: center;
        align-items: center;
    }

    .main .address-list .handle-wrap .edit {
        width: 0.4rem;
        height: 0.4rem;
        background-image: url("../../../assets/images/home/cart/edit.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 0.3rem;
    }

    .main .address-list .handle-wrap .del {
        width: 0.4rem;
        height: 0.4rem;
        background-image: url("../../../assets/images/home/cart/del.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 0.3rem;
    }
</style>