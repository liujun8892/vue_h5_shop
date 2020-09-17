import {getGoodsComment} from '../../../api/goods/review'

export default {
    namespaced:true,
    state:{
       commentList:[],
       pageInfo:{}
    },
    mutations:{
        ['SET_COMMENT'](state,payload){
            state.commentList = payload.commentList
            state.pageInfo = payload.pageInfo
        },
        ['SET_MORE_COMMENT'](state,payload){
            state.commentList.push(...payload.moreCommentList)
        }
    },
    actions:{
        getGoodsCommentData(context,payload){
            getGoodsComment(payload.gid,payload.page).then(res=>{
                if (res.code===200){
                    context.commit('SET_COMMENT',{commentList:res.data,pageInfo:res.pageinfo})
                }else {
                    context.commit('SET_COMMENT',{commentList:[],pageInfo:{total:0}})
                }
                if(payload.success){
                    payload.success()
                }
            })
        },
        getMoreGoodsCommentData(context,payload){
            getGoodsComment(payload.gid,payload.page).then(res=>{
                if (res.code===200){
                    context.commit('SET_MORE_COMMENT',{moreCommentList:res.data,pageInfo:res.pageinfo})
                }else {
                    context.commit('SET_MORE_COMMENT',{moreCommentList:[],pageInfo:{total:0}})
                }
                if(payload.success){
                    payload.success()
                }
            })
        }
    }
}