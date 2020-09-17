import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

let router = new Router({
    mode: "hash",//1、hash哈希：有#号。2、history历史：没有#号
    base: process.env.BASE_URL, //自动获取根目录路径
    scrollBehavior: (to, from, position) => { //解决白屏问题
        if (position) {
            return position
        } else {
            return {x: 0, y: 0}
        }
    }
    ,
    routes: [
        {
            path: "/",
            name: "mains",
            component: () => import("./pages/home/main/mains"),//路由懒加载解决首屏加载慢，性能优化
            // 自定义属性
            meta: {
                keepAlive: false
            },
            // 重定向
            redirect: '/index',
            // 子路由
            children: [
                {
                    path: 'index',
                    name: 'index',
                    component: () => import("./pages/home/index/index"),
                    meta: {
                        keepAlive: true,
                        title: '首页',
                    }
                },
                {
                    path: 'cart',
                    name: 'cart',
                    component: () => import("./pages/home/cart/cart"),
                    meta: {
                        keepAlive: false,
                        title: '购物车',
                    }
                },
                {
                    path: 'my',
                    name: 'my',
                    component: () => import("./pages/user/ucenter"),
                    meta: {
                        keepAlive: false,
                        title: '我的',
                    }
                }
            ]
        },
        {
            path: '/goods/classify',
            name: "goods-classify",
            component: () => import("./pages/home/goods/classify"),
            redirect: '/goods/classify/item',
            children: [{
                path: 'item',
                name: 'goods-classify-item',
                component: () => import('./pages/home/goods/classify_item'),
                meta: {
                    title: '商品分类'
                },
            }]
        },
        {
            path: '/goods/search',
            name: "goods-search",
            component: () => import("./pages/home/goods/search"),
        },
        {
            path: '/goods/details',
            name: "goods-details",
            component: () => import("./pages/home/goods/details"),
            redirect: '/goods/details/item',
            children: [{
                path: 'item',
                name: 'goods-details-item',
                component: () => import('./pages/home/goods/details_item')
            }, {
                path: 'content',
                name: 'goods-details-content',
                component: () => import('./pages/home/goods/details_content')
            }, {
                path: 'review',
                name: 'goods-details-review',
                component: () => import('./pages/home/goods/details_review')
            }]
        },
        {
            path: '/login',
            name: "login",
            component: () => import("./pages/home/login"),
        },
        {
            path: '/register',
            name: "register",
            component: () => import("./pages/home/register"),
        },
        {
            path: '/order',
            name: "order",
            component: () => import("./pages/home/order"),
            meta: {
                auth: true,
                title: '确认订单'
            },
        },
        {
            path: '/order/end',
            name: "order-end",
            component: () => import("./pages/home/order/end"),
            meta: {
                auth: true,
                title: '下单成功'
            },
        },
        {
            path: '/address',
            name: "address",
            component: () => import("./pages/home/address"),
            meta: {
                auth: true,
                title: '选择收货地址'
            },
        },
        {
            path: '/address/add',
            name: 'address-add',
            component: () => import('./pages/home/address/add'),
            meta: {
                auth: true,
                title: '添加收货地址'
            }
        },
        {
            path: '/address/mod',
            name: 'address-mod',
            component: () => import('./pages/home/address/mod'),
            meta: {
                auth: true,
                title: '修改收货地址'
            }
        },
        {
            path: '/user/order',
            name: 'my-order',
            component: () => import('./pages/user/order'),
            meta: {auth: true},
            redirect: '/user/order/list',
            children: [
                {
                    path: '/user/order/list',
                    name: 'my-order-list',
                    component: () => import('./pages/user/order/list'),
                    meta: {auth: true},
                },
                {
                    path: '/user/order/review',
                    name: 'my-order-review',
                    component: () => import('./pages/user/order/review'),
                    meta: {auth: true},
                },
            ]
        },
        {
            path: '/user/order/details',
            name: 'user-order-details',
            component: () => import('./pages/user/order/details'),
            meta: {
                auth: true,
                title: '订单详情'
            }
        }, {
            path: '/user/order/add_review',
            name: 'user-order-addReview',
            component: () => import('./pages/user/order/add_review'),
            meta: {
                auth: true,
                title: '添加评论'
            }
        },{
            path: '/user/profile',
            name: 'user-profile',
            component: () => import('./pages/user/profile'),
            meta: {
                auth: true
            }
        },{
            path: '/user/address',
            name: 'user-address',
            component: () => import('./pages/user/address'),
            meta: {
                auth: true,
                title: '收货地址'
            }
        },{
            path: '/user/address/mod',
            name: 'user-address-mod',
            component: () => import('./pages/user/address/mod'),
            meta: {
                auth: true,
                title: '修改收货地址'
            }
        },{
            path: '/user/address/add',
            name: 'user-address-add',
            component: () => import('./pages/user/address/add'),
            meta: {
                auth: true,
                title: '添加收货地址'
            }
        },{
            path: '/user/bind_cellphone',
            name: 'user-bind_cellphone',
            component: () => import('./pages/user/bind_cellphone'),
            meta: {
                auth: true,
                title: '绑定/修改手机'
            }
        },{
            path: '/user/mod_password',
            name: 'user-mod_password',
            component: () => import('./pages/user/mod_password'),
            meta: {
                auth: true,
                title: '修改密码'
            }
        },{
            path: '/user/fav',
            name: 'user-fav',
            component: () => import('./pages/user/fav'),
            meta: {
                auth: true,
                title: '我的收藏'
            }
        },
    ]
});
router.beforeEach((to, from, next) => {
    if (to.meta.auth) {
        if (localStorage['isLogin'] === 'true') {
            next();
        } else {
            next("/login");
        }
    } else {
        next();
    }
});
export default router;