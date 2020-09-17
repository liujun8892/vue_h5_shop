<template>
    <div class="page">
        <SubHeader title="会员登录"></SubHeader>
        <div class='main login-main'>
            <div class='code-wrap' style="margin-top:0px"><input type="text" placeholder="手机号" v-model="cellphone"/></div>
            <div class='password-wrap'>
                <div class='password'><input :type="switchChecked?'text':'password'"  placeholder="密码" v-model="password" /></div>
                <div class='switch-wrap'>
                    <van-switch v-model="switchChecked" active-color="#EB1625" />
                </div>
            </div>
            <div class='sure-btn' @click="doLogin()">登录</div>
            <div class="fastreg-wrap">
                <div><img src="../../../assets/images/home/index/forget.png" alt="忘记密码"/> 忘记密码</div>
                <div @click="$router.push('/register')" ><img src="../../../assets/images/home/index/reg.png" alt="忘记密码" /> 快速注册</div>
            </div>
        </div>
    </div>
</template>

<script>
   import SubHeader from '../../../components/sub_header'
   import {mapActions} from 'vuex'
    export default {
        data(){
            return {
                switchChecked: false,
                cellphone:'',
                password: ''
            }
        },
        components:{
            SubHeader
        },
        created() {
            this.from = this.$route.query.from?this.$route.query.from:''
        },
        methods:{
            ...mapActions({
                login:'user/uLogin'
            }),
            doLogin(){
                // 校验手机号
                if (this.cellphone.match(/^\s*$/||!this.cellphone.match(/^1[34578]\d{9}$/))){
                    return this.$toast('手机号或密码输入错误!')
                }
                // 校验密码
                if(this.password.match(/^\s*$/)){
                    return this.$toast('手机号或密码输入错误!')
                }
                this.login({cellphone: this.cellphone,password: this.password,success:(res)=>{
                        if (res.code===200){
                            if (this.from==='register'){
                                this.$router.go(-3)
                            }else {
                                this.$router.go(-1)
                            }
                        }else {
                            this.$toast(res.data)
                        }
                    }})
            }
        }
    }
</script>

<style scoped>
    .page{width:100%;height:100vh;background-color: #ffffff;}
    .main{width:100%;padding-top:1.4rem;}
    .cellphone-wrap{width:90%;height:0.84rem;margin:0 auto;display: flex;display: -webkit-flex;justify-content: space-between;-webkit-justify-content: space-between;}
    .cellphone-wrap .cellphone{width:62%;height:100%;border:#EFEFEF solid 1px;border-radius: 2px;}
    .cellphone-wrap .cellphone input,.code-wrap input,.password-wrap .password input{margin-top: .05rem; width:92%;height:78%;font-size:0.28rem;padding-left:0.2rem;}
    .my-ipt {
        height: .6rem!important;
        width: 6rem!important;
        margin: 0 auto;
        margin-top: .4rem;
        border: 1px solid #000000;
    }
    .my-ipt {
        line-height: .6rem;
        height: .5rem!important;
        width: 6rem!important;
    }
    .cellphone-wrap .code-btn{width:35%;height:0.82rem;background:#EAEAEA;color:#717376;border:#EAEAEA solid 1px;border-radius: 2px;font-size:0.28rem;text-align:center;line-height:0.82rem;}
    .cellphone-wrap .code-btn.success{background:#FFFFFF;border:1px solid #EB1625;color:#EB1625}
    .code-wrap{width:90%;height:0.84rem;margin:0 auto;border-radius: 2px;border:#EFEFEF solid 1px;margin-top:0.4rem;}
    .password-wrap{width:90%;height:0.84rem;margin:0 auto;border-radius: 2px;border:#EFEFEF solid 1px;margin-top:0.4rem;display:flex;display: -webkit-flex;}
    .password-wrap .password{width:80%;height:100%;}
    .password-wrap .switch-wrap{width:20%;margin-top:0.1rem;}
    .sure-btn{width:85%;height:0.8rem;margin:0 auto;background:#EB1625;font-size:0.36rem;color:#FFFFFF;line-height:0.8rem;text-align: center;margin-top:0.4rem;border-radius: 4px;}
    .fastreg-wrap{width:85%;display:flex;display:-webkit-flex;justify-content: space-between;-webkit-justify-content: space-between;font-size:0.24rem;margin:0 auto;margin-top:0.3rem;}
    .fastreg-wrap img{width:0.32rem;height:0.32rem;vertical-align: middle;}
</style>
