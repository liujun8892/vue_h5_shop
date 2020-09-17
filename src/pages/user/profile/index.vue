<template>
    <div class="page">
        <SubHeader title="个人资料" right-text="保存" @submit="submit()"></SubHeader>
        <div class='main'>
            <ul class='head'>
                <li>头像</li>
                <li><img :src="showHead" alt=""/><input ref="headfile" type="file" @change="uploadHead"/></li>
            </ul>
            <ul class='list'>
                <li>昵称</li>
                <li><input type="text" placeholder="请设置昵称" v-model="nickname" ref="nickName"/></li>
                <li class='arrow' @click="selectNickName"></li>
            </ul>
            <ul class='list'>
                <li>性别</li>
                <li><input type="text" placeholder="请选择性别" :value="showGender" readonly @click="isGender=true"/></li>
                <li class='arrow' @click="isGender=true"></li>
            </ul>
        </div>
        <van-action-sheet
                v-model="isGender"
                :actions="genders"
                cancel-text="取消"
                title="请选择性别"
                @select="selectGender"
        />
    </div>
</template>

<script>
    import {mapActions} from "vuex";
    import SubHeader from "../../../components/sub_header";

    export default {
        data() {
            return {
                isGender: false,
                genders: [
                    {name: "男"},
                    {name: "女"}
                ],
                showGender: "",
                gender: "",
                showHead: require("../../../assets/images/user/my/default-head.png"),
                nickname: "",
                head: ""
            }
        },
        created() {
            this.$util.authUserStatus(this)
            this.isSubmit = true;
            this.getUserInfo({
                success: (res) => {
                    this.nickname = res.data.nickname;
                    this.gender = res.data.gender;
                    this.showGender = this.gender === "1" ? "男" : this.gender === '2' ? "女" : "";
                    this.showHead = res.data.head ? res.data.head : require("../../../assets/images/user/my/default-head.png");
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
                asyncUploadHead: "user/_uploadHeadPortrait",
                updateUserInfo: "user/_uploadUserInfo",
                getUserInfo: "user/uGetUerInfo"
            }),
            selectNickName() {
                this.$refs.nickName.focus()
            },
            submit() {
                if (this.nickname.match(/^\s*$/)) {
                    this.$toast("请输入昵称")
                    return;
                }
                if (this.gender.match(/^\s*$/)) {
                    this.$toast("请选择性别")
                    return;
                }
                if (this.isSubmit) {
                    this.isSubmit = false;
                    this.updateUserInfo({
                        nickname: this.nickname, gender: this.gender, head: this.head, success: (res) => {
                            if (res.code === 200) {
                                this.$toast({
                                    message: "修改成功！",
                                    duration: 1000,
                                    onClose: () => {
                                        this.$router.go(-1);
                                    }
                                })
                            } else {
                                this.$toast(res.data);
                            }
                        }
                    })
                }
            },
            //选择性别
            selectGender(val) {
                this.showGender = val.name;
                this.isGender = false;
                this.gender = this.showGender === "男" ? "1" : this.showGender === '女' ? "2" : "";
            },
            //上传头像
            uploadHead(e) {
                if (e.target.files[0]) {
                    this.asyncUploadHead({
                        headfile: e.target.files[0], success: (res) => {console.log(res)

                            if (res.code === 200) {
                                this.showHead = "https://vueh5shop.liujun1314.online/userfiles/head/" + res.data.msbox;
                                this.head = res.data.msbox;
                            }
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>
    .page {
        width: 100%;
        height: 100vh;
        background-color: #FFFFFF;
        overflow: hidden;
    }

    .main {
        width: 100%;
        margin-top: 1.02rem;
    }

    .main ul.head {
        width: 100%;
        height: 1.2rem;
        border-bottom: 1px solid #EFEFEF;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
        justify-content: space-between;
        -webkit-justify-content: space-between;
    }

    .main ul.head li:nth-child(1) {
        font-size: 0.28rem;
        margin-left: 5%;
    }

    .main ul.head li:nth-child(2) {
        width: 1rem;
        height: 1rem;
        margin-right: 10%;
        position: relative;
        z-index: 1;
    }

    .main ul.head li:nth-child(2) img {
        width: 100%;
        height: 100%;
        border-radius: 100%;
    }

    .main ul.head li:nth-child(2) input {
        width: 100%;
        height: 95%;
        position: absolute;
        z-index: 1;
        left: 0;
        top: 0;
        opacity: 0;
    }

    .main ul.list {
        width: 100%;
        height: 0.8rem;
        border-bottom: 1px solid #EFEFEF;
        display: flex;
        display: -webkit-flex;
        align-items: center;
        -webkit-align-items: center;
        justify-content: space-between;
        -webkit-justify-content: space-between;
        font-size: 0.28rem;
    }

    .main ul.list li:nth-child(1) {
        margin-left: 5%;
    }

    .main ul.list li:nth-child(2) {
        width: 50%;
        height: 100%;
        margin-left: 20%;
    }

    .main ul.list li:nth-child(2) input {
        width: 100%;
        height: 75%;
        text-align: right;
        font-size: 0.28rem;
    }

    .main ul.list li.arrow {
        width: 0.4rem;
        height: 0.4rem;
        background-image: url("../../../assets/images/common/right_arrow.png");
        background-size: 100%;
        background-repeat: no-repeat;
        background-position: center;
        margin-right: 3%;
    }
</style>
