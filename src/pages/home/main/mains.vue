<template>
    <div>
        <!--子路由-->
        <router-view></router-view>
        <!--底部导航条-->
        <div class="nav_bar">
            <ul class="my_flex_between_align_center">
                <li :class="{'active':activeIndex===index}" class="my_flex_vertical_center" v-for="(item,index) in navBarArr" :key="index" @touchstart="toggleBar(index,item.path)">
                    <div class="icon" :style="{backgroundImage:'url('+ getIconUrl(index,activeIndex) +')'}"></div>
                    <span>{{item.title}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        name: "mains",
        data() {
            return {
                // 底部导航条数据
                navBarArr: [
                    {
                        title: '首页',
                        iconUrl: require('../../../assets/images/home/main/home1.png'),
                        activeIconUrl: require('../../../assets/images/home/main/home2.png'),
                        path:'/index'
                    },
                    {
                        title: '购物车',
                        iconUrl: require('../../../assets/images/home/main/cart1.png'),
                        activeIconUrl: require('../../../assets/images/home/main/cart2.png'),
                        path:'/cart'
                    },
                    {
                        title: '我的',
                        iconUrl: require('../../../assets/images/home/main/my1.png'),
                        activeIconUrl: require('../../../assets/images/home/main/my2.png'),
                        path:'/my'
                    }
                ],
                // 底部导航激活
                activeIndex: 0
            }
        },
       methods: {
            // 获取选中导航栏按钮
            getIconUrl(index,activeIndex){
                if(index===activeIndex){
                    return this.navBarArr[index].activeIconUrl
                }else {
                    return this.navBarArr[index].iconUrl
                }
            },
           // 切换导航栏
           toggleBar(index,path){
                this.activeIndex = index
                this.goPage(path)
           },
           // 切换路由
           goPage(path){
                this.$router.replace(path)
           },
           // 根据路由名称更改样式
           changeStyle(path){
                let navIndex = this.navBarArr.findIndex(item=>item.path.substring(1)===path)
                this.activeIndex = navIndex
           }
       },
        // 创建钩子
        created() {
           document.title = this.$route.meta.title
            this.changeStyle(this.$route.name)
        },
        // 路由切换钩子
        beforeRouteUpdate(to,from,next){
            document.title =to.meta.title
            this.changeStyle(to.name)
            next()
        },
        // keepAlice钩子
        activated() {
            document.title = this.$route.meta.title
            this.changeStyle(this.$route.name)
        }

    }
</script>

<style scoped>
    .nav_bar {
        width: 100%;
        height: 1.2rem;
        position: fixed;
        left: 0;
        bottom: 0;
        z-index: 10;
        box-shadow: 0 0 10px #EFEFEF;
        -webkit-box-shadow: 0 0 10px #EFEFEF;
        background-color: #fff;
    }

    .nav_bar ul {
        height: 100%;
        padding: 0 9%;
        box-sizing: border-box;
    }

    .nav_bar ul li {
        width: 1rem;

    }

    .nav_bar .icon {
        width: .6rem;
        height: .6rem;
        background: url("../../../assets/images/home/main/home1.png") no-repeat center;
        background-size: 100%;
    }

    .nav_bar span {
        font-size: .25rem;
    }

    .active {
        color: #eb1625;
    }

</style>