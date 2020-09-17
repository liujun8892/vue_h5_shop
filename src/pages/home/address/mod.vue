<template>
    <div class="page">
        <SubHeader title="添加收货地址"></SubHeader>
        <div class='main'>
            <ul>
                <li>收货人</li>
                <li><input type="text" placeholder="收货人姓名" v-model="name"/></li>
            </ul>
            <ul>
                <li>联系方式</li>
                <li><input type="text" placeholder="联系人手机号" v-model="cellphone" @input="formatPhoneNumber"
                           maxlength="11"/></li>
            </ul>
            <ul>
                <li>所在地区</li>
                <li>
                    <input type="text" placeholder="请选择所在地区" class='area' readOnly :value="showArea"
                           @click="isArea=true"/>
                </li>
            </ul>
            <ul>
                <li>详细地址</li>
                <li><input type="text" placeholder="街道详细地址" v-model="address"/></li>
            </ul>
            <ul>
                <li>设置为默认地址</li>
                <li><input type="checkbox" v-model="isDefault"/></li>
            </ul>
            <button type="button" class='submit-save' @click="submit()">保存</button>
        </div>


    </div>
</template>

<script>
    import {mapActions} from "vuex";
    import SubHeader from "../../../components/sub_header";
    import areaData from '../../../assets/data/area';

    export default {
        name: "address-add",
        data() {
            return {
                name: "",
                cellphone: "",
                showArea: "",
                address: "",
                isDefault: false,
                areaList: areaData,
                isArea: false,
                province: "",
                city: "",
                area: ""
            }
        },
        created() {
            this.$util.authUserStatus(this)
            this.aid = this.$route.query.aid
            this.getAddressItem({
                aid: this.aid, success: (res) => {
                    this.name = res.name
                    this.cellphone = res.cellphone
                    this.showArea = `${res.province} ${res.city} ${res.area}`
                    this.address = res.address
                    this.isDefault = res.isdefault==='1'
                    this.province = res.province
                    this.city = res.city
                    this.area = res.area
                }
            })
        },
        mounted() {
            document.title = this.$route.meta.title;
        },
        components: {
            SubHeader
        },
        methods: {
            ...mapActions({
                getAddressItem: 'address/_getAddressItem',
                updateAddress: 'address/_updateAddress'
            }),
            // 规范手机号码
            formatPhoneNumber(e) {
                this.cellphone = e.target.value
                this.cellphone = this.cellphone.replace(/[^\d]/g, '')
            },
            // 选择地址
            selectArea(e) {
                this.province = e[0].name
                this.city = e[1].name
                this.area = e[2].name
                this.showArea = `${this.province} ${this.city} ${this.area}`

                this.isArea = false
            },
            // 添加地址
            submit() {
                if (this.name.match(/^\s*$/)) {
                    return this.$toast('请输入用户名')
                }
                if (this.cellphone.match(/^\s*$/) || !this.cellphone.match(/^1[345678]\d{9}$/)) {
                    return this.$toast('请输入正确的手机号码')
                }
                if (this.showArea.match(/^\s*$/)) {
                    return this.$toast('请选择收货地址')
                }
                if (this.address.match(/^\s*$/)) {
                    return this.$toast('请输入详细地址')
                }
                this.updateAddress({
                    aid:this.aid,
                    name: this.name,
                    cellphone: this.cellphone,
                    province: this.province,
                    city: this.city,
                    area: this.area,
                    address: this.address,
                    isdefault: this.isDefault ? '1' : '0',
                    success: (res) => {
                        if (res.code === 200) {
                            this.$toast({
                                message: '修改地址成功',
                                duration: 1600,
                                onClose: () => {
                                    this.$router.go(-1)
                                }
                            })
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .page {
        width: 100%;
        height: 100vh;
        overflow: hidden;
        background-color: #FFFFFF;
    }

    .main {
        width: 100%;
        margin-top: 1rem;
    }

    .main ul {
        width: 100%;
        height: 1.02rem;
        border-bottom: #EFEFEF 1px solid;
        display: flex!important;
        display: -webkit-flex;
        align-items: center!important;
        -webkit-align-items: center;
    }

    .main ul li {
        display: flex;
        align-items: center;
        font-size: 0.3rem;
        margin-left: 0.3rem;
    }


    .main ul li:nth-child(2) {
        width: 62%;
        height: 100%;
    }

    .main ul li input {
        width: 100%;
        height: 75%;
        font-size: 0.30rem;
    }

    .main ul li .area {
        font-size: 0.28rem !important;
    }

    .main ul li input[type='checkbox'] {
        width: 0.4rem;
        height: 0.4rem;
    }

    .main .submit-save {
        width: 85%;
        height: 0.8rem;
        background-color: #FCB40A;
        border-radius: 4px;
        margin: 0 auto;
        display: block;
        border: 0 none;
        outline: none;
        font-size: 0.32rem;
        color: #FFFFFF;
        margin-top: 0.4rem;
    }
</style>