import config from '../../assets/js/config/config'
import {request} from '../../assets/js/utils/request'

// 首页左侧商品菜单
export function getGoodsMenu() {
    return request(config.baseApi+"/home/category/menu?token="+config.token)
}

// 首页右侧商品列表
export function getGoodsItemList(cid=492) {
    return request(config.baseApi+"/home/category/show?cid="+cid+"&token="+config.token)
}

// 商品详情参数接口
export function getGoodsParams(gid ='704407997') {
    return request(config.baseApi+"/home/goods/info?gid="+gid+"&type=details&token="+config.token)
}


// 商品详情规格接口
export function getGoodsSpec(gid ='704407997') {
    return request(config.baseApi+"/home/goods/info?gid="+gid+"&type=spec&token="+config.token)
}

// 加入收藏
export function addFav(params) {
    return request(config.baseApi+"/goods/fav?uid="+params.uid+"&gid="+params.gid+"&token="+config.token)
}
