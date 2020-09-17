import config from '../../assets/js/config/config'
import {request} from '../../assets/js/utils/request'

// 用户登录
export function login(data) {
    return request(config.baseApi+"/home/user/pwdlogin?token="+config.token,"post",data)
}

// 用户注册验证码校验
export function validCode(vCode) {
    return request(config.baseApi+"/home/user/checkvcode?token="+config.token,"post",{vcode:vCode})
}

// 用户手机号是否注册过
export function isRegister(phoneNumber) {
    return request(config.baseApi+"/home/user/isreg?token="+config.token,"post",{username:phoneNumber})
}

// 用户注册
export function register(vcode,cellphone,password) {
    return request(config.baseApi+"/home/user/reg?token="+config.token,"post",{vcode,cellphone,password})
}

// 用户登录状态认证
export function authLoginStatus(params) {
    return request(config.baseApi+"/home/user/safe?token="+config.token,"post",params)
}

// 退出登录
export function logout(params) {
    return request(config.baseApi+"/home/user/safeout?token="+config.token,"post",params)
}

// 获取用户信息
export function getUerInfo(uid) {
    return request(config.baseApi+"/user/myinfo/userinfo/uid/"+uid+"/?token="+config.token)
}

// 上传头像
export function uploadHeadPortrait(data) {
    return request(config.baseApi+"/user/myinfo/formdatahead?token="+config.token,'file',data)
}

// 修改用户信息
export function uploadUserInfo(data) {
    return request(config.baseApi+"/user/myinfo/updateuser?token="+config.token,'post',data)
}

// 修改手机号
export function uploadPhoneNumber(data) {
    return request(config.baseApi+"/user/myinfo/updatecellphone?token="+config.token,'post',data)
}

// 修改密码
export function uploadPassword(data) {
    return request(config.baseApi+"/user/myinfo/modpwd?token="+config.token,'post',data)
}

// 分页获取用户收藏
export function getUserFav(params) {
    return request(config.baseApi+`/user/fav/index?uid=${params.uid}&  token=${config.token}&page=${params.page}`)
}

// 删除收藏
export function deleteFav(params) {
    return request(config.baseApi+`/user/fav/del?uid=${params.uid}&  fid=${params.fid}&token=${config.token}`)
}