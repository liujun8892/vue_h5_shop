import config from '../../assets/js/config/config'
import {request} from '../../assets/js/utils/request'

// 首页左侧商品菜单
export function getHotSearch() {
    return request(config.baseApi+"/home/public/hotwords?token="+config.token)
}

// 根据搜索的关键词返回相关属性
export function getGoodsAttr(keyword ='') {
    return request(config.baseApi+"/home/goods/param?kwords="+keyword+"&token="+config.token)
}

// 筛选商品列表
export function getGoodsList(params) {
    let url = `${config.baseApi}/home/goods/search?kwords=${params.kwords}&param=`+ params.param+`&page=${params.page}&price1=${params.price1}&price2=${params.price2}&otype=${params.otype}&cid=${params.cid}&token=1ec949a15fb709370f`
    return request(url)
}