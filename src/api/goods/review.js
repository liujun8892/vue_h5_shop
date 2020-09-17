import config from '../../assets/js/config/config'
import {request} from '../../assets/js/utils/request'

// 获取商品评论
export function getGoodsComment(gid ='704407997',page =1) {
    return request(config.baseApi+"/home/reviews/index?gid="+gid+"&token="+config.token+"&page="+page)
}

// 获取评价星级选项
export function getCommentOptions() {
    return request(config.baseApi+"/home/reviews/service?&token="+config.token)
}

/**
 * 提交评价
 * @param params uid:会员id gid:商品id content:评价内容 ordernum: 390451578 rsdata:星级评价数据(JSON.stringify)
 * @returns {Promise<*>}
 */
export function submitComment(params) {
    return request(config.baseApi+"/home/reviews/add?&token="+config.token,'post',params)
}
