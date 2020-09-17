import config from '../../assets/js/config/config'
import {request} from '../../assets/js/utils/request'

// 添加收货地址
export function addAddress(params) {
    return request(config.baseApi+"/user/address/add?token="+config.token,"post",params)
}

// 获取收货地址列表
export function getAddressList(uid) {
    return request(config.baseApi+`/user/address/index?uid=${uid}&token=`+config.token)
}

// 根据id删除地址
export function deleteAddress(params) {
    return request(config.baseApi+`/user/address/del?uid=${params.uid}&aid=${params.aid}&token=`+config.token)
}

// 根据id获取地址
export function getAddressItem(params) {
    return request(config.baseApi+`/user/address/info?uid=${params.uid}&aid=${params.aid}&token=`+config.token)
}

// 根据id修改地址
export function updateAddress(params) {
    return request(config.baseApi+`/user/address/mod?token=`+config.token,'post',params)
}

// 获取默认收货地址
export function getDefaultAddress(uid) {
    return request(config.baseApi+`/user/address/defaultAddress?uid=${uid}&token=`+config.token)
}