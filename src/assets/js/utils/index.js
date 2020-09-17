import echo from '../lib/echo'

function lazyImg() {
    echo.init({
        offset : 100,//可视区域多少像素可以被加载
        throttle : 0 //设置图片延迟加载的时间
    })
}

function authUserStatus(_this) {
    _this.$store.dispatch('user/uAuthLoginStatus',{success:(res)=>{
            if (res.code!==200){
                _this.$router.replace('/login')
            }
        }})
}

export default {
    lazyImg,
    authUserStatus
}