<template>
    <div class="page">
        <SubHeader title="会员注册"></SubHeader>
        <div class='main'>
            <div class="inputs"><input type="text" placeholder="验证码" v-model="vcode" maxlength="4"/>
                <div class="vcode-img"><img :src="showCode" @click="changeVCode"/></div>
            </div>
            <div class='cellphone-wrap'>
                <div class='cellphone'><input type="tel" placeholder="请输入手机号" v-model="cellphone" @input="handlePhone"/>
                </div>
                <div :class="{'code-btn':true,'success':validPhone}" @click="getMsgAuthCode">{{msgAuthCode}}</div>
            </div>
            <div class='code-wrap'><input type="text" placeholder="输入任意6位验证码即可" v-model="msgCode" @input="handleVCode" maxlength="6"/></div>
            <div class='password-wrap'>
                <div class='password'><input :type="isOpen?'text':'password'" placeholder="请输入密码" v-model="password"/>
                </div>
                <div class='switch-wrap'>
                    <van-switch v-model="isOpen" active-color="#EB1625"/>
                </div>
            </div>
            <div class='sure-btn' @click="submitRegister">注册</div>
        </div>
    </div>
</template>

<script>
    import {mapActions} from "vuex";
    import SubHeader from "../../../components/sub_header";

    export default {
        data() {
            return {
                vcode: '',
                showCode: this.$config.baseApi + '/vcode/chkcode?token=' + this.$config.token,
                cellphone: '',
                msgCode: '',
                isOpen: false,
                password: '',
                validPhone: false,
                msgAuthCode: '获取短信验证码',
                isIntervalStop: true,
                isSubmit: false,
            }
        },
        components: {
            SubHeader
        },
        created() {

        },
        methods: {
            ...mapActions({
                uValidCode: 'user/uValidCode',
                uValidPhone: 'user/uValidPhone',
                uRegister: 'user/uRegister',
            }),
            changeVCode(e) {
                e.target.src = this.$config.baseApi + '/vcode/chkcode?token=' + this.$config.token + '&random=' + new Date().getTime()
            },
            handlePhone(e) {
                this.cellphone = e.target.value
                this.cellphone = this.cellphone.replace(/[^\d]/g, '')
                if (this.cellphone.match(/^1[34578]\d{9}$/)) {
                    this.validPhone = true
                } else {
                    this.validPhone = false
                }
            },
            handleVCode(e) {
                this.msgCode = e.target.value
                this.msgCode = this.msgCode.replace(/[^\w]/g, '')
            },
            // 获取短信验证码
            async getMsgAuthCode() {
                // 验证是否重复点击
                if (!this.isIntervalStop) return
                //  验证手机号格式
                if (!this.validPhone) {
                    return this.$toast('请输入正确的手机号码')
                }
                //  验证手机号是否已注册
                let vPhoneRes = await this.uValidPhone({phoneNumber:this.cellphone})
                if (vPhoneRes.code===200&&vPhoneRes.data.isreg==='1'){
                    return this.$toast('此手机号已被注册过,请更换手机号')
                }
                // 验证图文验证码
                let vcodeRes = await this.uValidCode({vCode: this.vcode})
                console.log(vcodeRes)
                // if (vcodeRes.code !== 200) {
                //     return this.$toast('请输入正确的图形验证码')
                // }
                let time = 10
                this.msgAuthCode = `重新获取(${time})`
                this.isIntervalStop = false
                this.timer = setInterval(() => {
                    time--
                    if (time < 1) {
                        this.msgAuthCode = '获取短信验证码'
                        this.isIntervalStop = true
                        clearInterval(this.timer)
                    }else {
                        this.msgAuthCode = `重新获取(${time})`
                    }

                }, 1000)
            },
            // 注册提交
            async submitRegister(){
                // 再次校验注册表单数据
                //  验证手机号格式
                if (!this.validPhone) {
                    return this.$toast('请输入正确的手机号码')
                }
                //  验证手机号是否已注册
                let vPhoneRes = await this.uValidPhone({phoneNumber:this.cellphone})
                if (vPhoneRes.code===200&&vPhoneRes.data.isreg==='1'){
                    return this.$toast('此手机号已被注册过,请更换手机号')
                }
                // 验证图文验证码
                let vcodeRes = await this.uValidCode({vCode: this.vcode})
                // if (vcodeRes.code !== 200) {
                //     return this.$toast('请输入正确的图形验证码')
                // }
                if (!this.msgCode.match(/^\d{6}$/)){
                    return this.$toast('请输入正确的短信验证码')
                }
                if (this.password.match(/^\s*$/)){
                    return this.$toast('请输入密码')
                }
                // 防止重复注册
                if (this.isSubmit) return
                this.isSubmit=true
                let registerRes = await this.uRegister({vcode:this.vcode,cellphone:this.cellphone,password: this.password})
                this.isSubmit=false
                if (registerRes.code===200){
                    this.$router.push('/login?from=register')
                }else {
                    // return this.$toast(registerRes.data)
                }
            }
        },
        beforeDestroy() {

        }
    }
</script>

<style scoped>

    .page {
        width: 100%;
        height: 100vh;
        background-color: #ffffff;
    }

    .main {
        width: 100%;
        padding-top: 1.4rem;
    }

    .cellphone-wrap {
        width: 90%;
        height: 0.84rem;
        margin: 0 auto;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        margin-top: 0.4rem;
    }

    .cellphone-wrap .cellphone {
        width: 62%;
        height: 100%;
        border: #EFEFEF solid 1px;
        border-radius: 2px;
    }

     .cellphone-wrap .cellphone input, .code-wrap input, .password-wrap .password input {
        width: 92%;
        height: 78%;
         margin-top: .05rem;
        font-size: 0.28rem;
        padding-left: 0.2rem;
    }

    .cellphone-wrap .code-btn {
        width: 35%;
        height: 0.82rem;
        background: #EAEAEA;
        color: #717376;
        border: #EAEAEA solid 1px;
        border-radius: 2px;
        font-size: 0.28rem;
        text-align: center;
        line-height: 0.82rem;
    }

    .cellphone-wrap .code-btn.success {
        background: #FFFFFF;
        border: 1px solid #EB1625;
        color: #EB1625
    }

    .code-wrap {
        width: 90%;
        height: 0.84rem;
        margin: 0 auto;
        border-radius: 2px;
        border: #EFEFEF solid 1px;
        margin-top: 0.4rem;
    }

    .password-wrap {
        width: 90%;
        height: 0.84rem;
        margin: 0 auto;
        border-radius: 2px;
        border: #EFEFEF solid 1px;
        margin-top: 0.4rem;
        display: flex;
        display: -webkit-flex;
    }

    .password-wrap .password {
        width: 80%;
        height: 100%;
    }

    .password-wrap .switch-wrap {
        width: 20%;
        margin-top: 0.1rem;
    }

    .sure-btn {
        width: 85%;
        height: 0.8rem;
        margin: 0 auto;
        background: #EB1625;
        font-size: 0.36rem;
        color: #FFFFFF;
        line-height: 0.8rem;
        text-align: center;
        margin-top: 0.4rem;
        border-radius: 4px;
    }

    .fastreg-wrap {
        width: 85%;
        display: flex;
        display: -webkit-flex;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        font-size: 0.24rem;
        margin: 0 auto;
        margin-top: 0.3rem;
    }

    .fastreg-wrap img {
        width: 0.32rem;
        height: 0.32rem;
        vertical-align: middle;
    }

    .inputs {
        display: flex;
        align-items: center;
        width: 90%;
        height: 0.84rem;
        border: #EFEFEF solid 1px;
        border-radius: 2px;
        background: #FFFFFF;
        margin: 0 auto;
        line-height: 0.84rem;
        padding-left: 0.1rem;
        font-size: 0.28rem;
        position: relative;
        box-sizing: border-box;
    }

    .inputs .vcode-img {
        width: 20%;
        height: 60%;
        position: absolute;
        right: 0px;
        top: 20%;
        border-left: 1px solid #EFEFEF;
        text-align: center;
    }

    .inputs .vcode-img img {
        width: 80%;
        height: 100%;
    }

    .inputs input {
        margin-top: 0.033rem;
        line-height: 0.46rem !important;
        font-size: 0.28rem;
        width: 80%;
        height: 0.64rem;
    }
</style>
