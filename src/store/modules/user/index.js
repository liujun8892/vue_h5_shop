import {
    authLoginStatus,
    getUerInfo,
    getUserFav,
    isRegister,
    login,
    logout,
    register,
    uploadHeadPortrait,
    uploadPassword,
    uploadPhoneNumber,
    uploadUserInfo,
    validCode,
    deleteFav
} from '../../../api/user'

export default {
    namespaced: true,
    state: {
        uid: localStorage['uid'] ? localStorage['uid'] : '',
        nickname: localStorage['nickname'] ? localStorage['nickname'] : '',
        isLogin: localStorage['isLogin'] ? JSON.parse(localStorage['isLogin']) : false,
        authToken: localStorage['authToken'] ? localStorage['authToken'] : '',
        // 用户头像
        head: '',
        // 用户积分
        points: 0,
        // 用户收藏
        favs:[]
    },
    mutations: {
        ['SET_LOGIN_INFO'](state, payload) {
            state.uid = payload.uid
            state.nickname = payload.nickname
            state.isLogin = payload.utype === '0'
            state.authToken = payload.auth_token
            localStorage['uid'] = payload.uid
            localStorage['nickname'] = payload.nickname
            localStorage['isLogin'] = payload.utype === '0'
            localStorage['authToken'] = payload.auth_token
        },
        ['OUT_LOGIN'](state, payload) {
            state.uid = ''
            state.nickname = ''
            state.isLogin = ''
            state.authToken = ''
            state.head = ''
            state.points = 0
            localStorage.removeItem('uid')
            localStorage.removeItem('nickname')
            localStorage.removeItem('isLogin')
            localStorage.removeItem('authToken')
            sessionStorage.removeItem('aid')
        },
        ['SET_USER_INFO'](state, payload) {
            state.nickname = payload.data.nickname
            state.head = payload.data.head
            state.points = payload.data.points
        } ,
        ['SET_FAV'](state, payload) {
          state.favs = payload.favs
        },
        ['SET_FAV_PAGE'](state, payload) {
          state.favs.push(...payload.favs)
        },
        ['DELETE_FAV'](state, payload) {
          state.favs.splice(payload.index,1)
        }
    },
    actions: {
        // 用户登录
        uLogin(context, payload) {
            login(payload).then(res => {
                if (res.code === 200) {
                    context.commit('SET_LOGIN_INFO', res.data)
                    context.rootState.cart.goodsCart = localStorage.getItem('goods_cart') ? JSON.parse(localStorage.getItem('goods_cart')) : []
                }
                if (payload.success) {
                    payload.success(res)
                }
            })
        },
        // 校验图形验证码
        uValidCode(context, payload) {
            return validCode(payload.vCode).then(res => {
                return res
            })
        },
        // 校验手机号码是否注册
        uValidPhone(context, payload) {
            return isRegister(payload.phoneNumber).then(res => {
                return res
            })
        },
        // 用户注册
        uRegister(context, payload) {
            return register(payload.vcode, payload.cellphone, payload.password).then(res => {
                return res
            })
        },
        // 用户登录状态认证
        uAuthLoginStatus(context, payload) {
            authLoginStatus({uid: context.state.uid, auth_token: context.state.authToken}).then(res => {
                if (res.code !== 200) {
                    // 清除vuex中的购物车数据
                    context.rootState.cart.goodsCart = []
                    // 清除本地缓存中用户信息
                    context.commit('OUT_LOGIN')
                }
                if (payload.success) {
                    payload.success(res)
                }
            })
        },
        // 退出登录
        uLogout(context, payload) {
            logout({uid: context.state.uid}).then(res => {
                if (res.code === 200) {
                    // 清除vuex中的购物车数据
                    context.rootState.cart.goodsCart = []
                    // 清除本地缓存中用户信息
                    context.commit('OUT_LOGIN')
                }
                if (payload && payload.success) {
                    payload.success(res)
                }
            })
        },
        // 获取用户信息
        uGetUerInfo(context, payload) {
            getUerInfo(context.state.uid).then(res => {
                if (res.code === 200) {
                    context.commit('SET_USER_INFO', {data: res.data})
                }
                if (payload && payload.success) {
                    payload.success(res)
                }
            })
        },
        // 用户头像上传
        _uploadHeadPortrait(context, payload) {
            uploadHeadPortrait({headfile: payload.headfile}).then(res => {
                if (payload && payload.success) {
                    payload.success(res)
                }
            })
        },
        // 修改用户信息
        _uploadUserInfo(context, payload) {
            uploadUserInfo({uid: context.rootState.user.uid, ...payload}).then(res => {
                if (payload && payload.success) {
                    payload.success(res)
                }
            })
        },
        // 修改手机号
        _uploadPhoneNumber(context, payload) {
            uploadPhoneNumber({uid: context.rootState.user.uid, ...payload}).then(res => {
                if (payload && payload.success) {
                    payload.success(res)
                }
            })
        },
        // 修改密码
        _uploadPassword(context, payload) {
            uploadPassword({uid: context.rootState.user.uid, ...payload}).then(res => {
                if (payload && payload.success) {
                    payload.success(res)
                }
            })
        },
        // 获取用户收藏
        _getUserFav(context, payload) {
            getUserFav({uid: context.rootState.user.uid, page: 1}).then(res => {
                let pagenum = 0
                if (res.code === 200) {
                    context.commit('SET_FAV', {favs:res.data})
                    pagenum = res.pageinfo.pagenum
                } else {
                    context.commit('SET_FAV', {favs:[]})
                }
                if (payload && payload.success) {
                    payload.success(pagenum)
                }
            })
        },
        // 分页获取用户收藏
        _getUserFavPage(context, payload) {
            getUserFav({uid: context.rootState.user.uid, ...payload}).then(res => {
                if (res.code === 200) {
                    context.commit('SET_FAV_PAGE', {favs:res.data})
                }
                if (payload && payload.success) {
                    payload.success(res)
                }
            })
        },
        // 删除收藏
        _deleteFav(context,payload){
            deleteFav({uid: context.rootState.user.uid, ...payload}).then(res=>{
                if (res.code===200){
                    context.commit('DELETE_FAV',{index:payload.index})
                }
                if (payload&&payload.success){
                    payload.success()
                }
            })
        }
    }
}