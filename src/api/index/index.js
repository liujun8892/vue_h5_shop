import config from '../../assets/js/config/config'
import {request} from '../../assets/js/utils/request'

// 首页快速导航
export function getNavsData() {
    return request(config.baseApi+"/home/index/nav?token="+config.token)
}

// 轮播图
export function getSwiperData() {
    return request(config.baseApi+"/home/index/slide?token="+config.token)
}

// 商品列表
export function getGoodsData() {
    return request(config.baseApi+"/home/index/goodsLevel?token="+config.token)
}
// 商品推荐
export function getRecommendGoodsData() {
    return request(config.baseApi+"/home/index/recom?token="+config.token)
}