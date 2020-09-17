import config from '../../assets/js/config/config'
import {request} from '../../assets/js/utils/request'

/**
 * 新增订单
 * @param params
 * {aid:string,freight:string,addsid:string,goodsData:jsonString}
 * @returns {Promise<*>}
 */
export function addOrder(params) {
    return request(config.baseApi+"/order/add?token="+config.token,'post',params)
}

/**
 * 查询用户最后提交的订单编号
 * @param uid 用户id
 * @returns {Promise<*>}
 */
export function getOrderNumber(uid) {
    return request(config.baseApi+"/order/lastordernum?uid="+uid+"&token="+config.token)
}

/**
 * 查询订单列表
 * @param params uid 用户id status 订单状态(all 全部 0 待付款 1 待收货 2 待评价 -1 取消订单) page 订单当前页
 * @returns {Promise<*>}
 */
export function getOrderList(params) {
    return request(config.baseApi+`/user/myorder/index?uid=${params.uid}&status=${params.status}&token=`+config.token+`&page=${params.page}`)
}

/**
 *  取消订单
 * @param params ordernum 订单号
 * @returns {Promise<*>}
 */
export function cancelOrder(params) {
    return request(config.baseApi+`/user/myorder/clearorder?uid=${params.uid}&ordernum=${params.ordernum}&token=`+config.token)
}

/**
 *  确认收货
 * @param params
 * @returns {Promise<*>}
 */
export function confirmReceipt(params) {
    return request(config.baseApi+`/user/myorder/finalorder?uid=${params.uid}&ordernum=${params.ordernum}&token=`+config.token)
}

/**
 * 订单详情
 * @param params
 * @returns {Promise<*>}
 */
export function getOderInfo(params) {
    return request(config.baseApi+`/user/myorder/desc?uid=${params.uid}&ordernum=${params.ordernum}&token=`+config.token)
}

/**
 * 获取待评价的订单
 * @param params
 * @returns {Promise<*>}
 */
export function getOderUnReview(params) {
    return request(config.baseApi+`/user/myorder/reviewOrder?uid=${params.uid}&page=${params.page}&token=`+config.token)
}
