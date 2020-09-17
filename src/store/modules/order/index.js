import {addOrder, getOrderNumber,getOrderList,cancelOrder,confirmReceipt,getOderInfo,getOderUnReview} from '../../../api/order'
import {getCommentOptions,submitComment} from '../../../api/goods/review'

export default {
    namespaced: true,
    state: {
        // 订单编号
        orderNumber: '',
        // 订单列表
        orderList: [],
        // 订单列表分页信息
        pageInfo: {pagenum:0},
        // 订单详情
        orderInfo:{},
        // 订单评论列表
        orderReviewList: [],
        // 订单评论星级选项
        reviewOptions:[],
    },
    mutations: {
        ['SET_ORDER_NUMBER'](state, payload) {
            state.orderNumber = payload.orderNumber
        },
        ['SET_ORDER_LIST'](state, payload) {
            state.orderList = payload.orderList
            state.pageInfo = payload.pageInfo
        },
        ['SET_ORDER_LIST_PAGE'](state, payload) {
            if (payload.orderList.length>0){
                state.orderList.push(...payload.orderList)
            }
        },
        ['CANCEL_ORDER'](state, payload) {
            state.orderList.splice(payload.index,1)
        },
        // 订单支付
        ['ORDER_PAY'](state, payload) {
            state.orderList[payload.index].status = payload.status
        },
        // 确认订单
        ['CONFIRM_ORDER'](state, payload) {
            state.orderList[payload.index].status = '2'
        } ,
        // 设置订单详情
        ['SET_ORDER_INFO'](state, payload) {
           state.orderInfo = payload.orderInfo
        },
        // 设置订单评论列表
        ['SET_ORDER_REVIEW'](state, payload) {
           state.orderReviewList = payload.orderReviewList
        },
        // 分页设置订单评论列表
        ['SET_ORDER_REVIEW_PAGE'](state, payload) {
           state.orderReviewList.push(...payload.orderReviewList)
        },
        //设置评价分数
        ["SET_REVIEW_SCORE"](state,payload){
            if(state.reviewOptions.length>0){
                for(let i=payload.index2+1;i<state.reviewOptions[payload.index].scores.length;i++){
                    state.reviewOptions[payload.index].scores[i].active=false;
                }
                for(let i=0;i<=payload.index2;i++){
                    state.reviewOptions[payload.index].scores[i].active=true;
                }
                state.reviewOptions[payload.index].score=payload.score;
            }
        },
        // 设置评论列表星级选项
        ['SET_REVIEW_OPTIONS'](state, payload) {
           state.reviewOptions = payload.reviewOptions
        }
    },
    actions: {
        // 添加订单
        _addOrder(context, payload) {
          return  addOrder({uid: context.rootState.user.uid, ...payload}).then(res => {
                   return res
            })
        },
        // 查询最新订单编号
        _getOrderNumber(context, payload) {
            getOrderNumber(context.rootState.user.uid).then(res => {
                if (res.code === 200) {
                    // 保存最新的订单编号
                    context.commit('SET_ORDER_NUMBER', {orderNumber: res.data.ordernum})
                    if (payload && payload.success) {
                        payload.success(res)
                    }
                }
            })
        },
        // 查询订单列表
        _getOrderList(context,payload){
            getOrderList({uid:context.rootState.user.uid,...payload}).then(res=>{
                if (res.code === 200) {
                    context.commit('SET_ORDER_LIST',{orderList:res.data,pageInfo:res.pageinfo})
                }else {
                    context.commit('SET_ORDER_LIST',{orderList:[],pageInfo:{pagenum:0}})
                }
                if (payload&&payload.success){
                    payload.success(res)
                }
            })
        },
        // 分页查询订单列表
        _getOrderListPage(context,payload){
            getOrderList({uid:context.rootState.user.uid,...payload}).then(res=>{
                if (res.code === 200) {
                    context.commit('SET_ORDER_LIST_PAGE',{orderList:res.data})
                }else {
                    context.commit('SET_ORDER_LIST_PAGE',{orderList:[]})
                }
                if (payload&&payload.success){
                    payload.success(res)
                }
            })
        },
        // 取消订单
        _cancelOrder(context,payload){
            cancelOrder({uid:context.rootState.user.uid,...payload}).then(res=>{
                if (res.code === 200) {
                    context.commit('CANCEL_ORDER',{index:payload.index})
                }
                if (payload&&payload.success){
                    payload.success(res)
                }
            })
        },
        // 确认收货
        _confirmReceipt(context,payload){
            confirmReceipt({uid:context.rootState.user.uid,...payload}).then(res=>{
                if (res.code === 200) {
                    context.commit('CONFIRM_ORDER',{index:payload.index})
                }
                if (payload&&payload.success){
                    payload.success(res)
                }
            })
        },
        // 获取订单详情
        _getOderInfo(context,payload){
            getOderInfo({uid:context.rootState.user.uid,...payload}).then(res=>{
                if (res.code === 200) {
                    context.commit('SET_ORDER_INFO',{orderInfo:res.data})
                }
                if (payload&&payload.success){
                    payload.success(res)
                }
            })
        },
        // 获取待评价的订单
        _getOderUnReview(context,payload){
            getOderUnReview({uid:context.rootState.user.uid,page:1}).then(res=>{
                if (res.code === 200) {
                    context.commit('SET_ORDER_REVIEW',{orderReviewList:res.data})
                    if (payload&&payload.success){
                        payload.success(res.pageinfo.pagenum)
                    }
                }else {
                    context.commit('SET_ORDER_REVIEW',{orderReviewList:[]})
                    if (payload&&payload.success){
                        payload.success(0)
                    }
                }
            })
        },
        // 分页待评价的订单
        _getOderUnReviewPage(context,payload){
            getOderUnReview({uid:context.rootState.user.uid,page:payload.page}).then(res=>{
                if (res.code === 200) {
                    context.commit('SET_ORDER_REVIEW_PAGE',{orderReviewList:res.data})
                    if (payload&&payload.success){
                        payload.success(res)
                    }
                }
            })
        },
        // 获取评价选项
        _getCommentOptions(context,payload){
            getCommentOptions().then(res=>{
                if (res.code === 200) {
                    for(let i=0;i<res.data.length;i++){
                        res.data[i].score=5;
                        res.data[i].scores=[
                            {
                                value:1,
                                active:true
                            },
                            {
                                value:2,
                                active:true
                            },
                            {
                                value:3,
                                active:true
                            },
                            {
                                value:4,
                                active:true
                            },
                            {
                                value:5,
                                active:true
                            }
                        ]
                    }
                    context.commit('SET_REVIEW_OPTIONS',{reviewOptions:res.data})
                }
                if (payload&&payload.success){
                    payload.success(res)
                }
            })
        },
        // 提交评论
        _submitComment(context,payload){
            console.log(payload)
            submitComment({uid:context.rootState.user.uid,...payload}).then(res=>{
                console.log(res)
                if (payload&&payload.success){
                    payload.success(res)
                }
            })
        },
    }
}