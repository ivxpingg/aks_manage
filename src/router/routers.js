import Main from '@/views/Main/main.vue';
const Login = [
    {
        path: '/login',
        name: 'login',
        meta: {
            title: '登录'
        },
        component: () => import('@/views/login/index.vue')
    }
];

// 首页
const Home = [
    {
        path: '/',
        //name: 'home',
        redirect: '/userManage/user',
        component: Main,
        meta: {
            hideInMenu: true,
            title: '用户管理',
            notCache: true,
            requireAuth: true
        }
    }
];

// 用户管理
// const Home = [
//     {
//         path: '/',
//         redirect: '/home',
//         component: Main,
//         title: '用户',
//         meta: {
//             icon: 'ios-person',
//             title: '用户管理',
//             requireAuth: true
//         },
//         children: [
//             {
//                 path: '/home',
//                 name: 'home',
//                 meta: {
//                     icon: 'ios-square',
//                     title: '用户管理',
//                     requireAuth: true
//                 },
//                 component: (resolve) => require(['@/views/userManage/user/user.vue'], resolve),
//             },
//             {
//                 path: '/userManage/driver',
//                 name: 'driver',
//                 meta: {
//                     icon: 'ios-square',
//                     title: '司机管理',
//                     requireAuth: true
//                 },
//                 component: (resolve) => require(['@/views/userManage/driver/driver.vue'], resolve),
//             },
//             {
//                 path: '/userManage/adminUser',
//                 name: 'adminUser',
//                 meta: {
//                     icon: 'ios-square',
//                     title: '管理员管理',
//                     requireAuth: true
//                 },
//                 component: (resolve) => require(['@/views/userManage/admin/adminUser.vue'], resolve),
//             }
//         ]
//     }
// ];
const UserManage = [
    {
        path: '/userManage',
        name: 'userManage',
        title: '用户管理',
        redirect: '/userManage/user',
        component: Main,
        meta: {
            icon: 'ios-person',
            title: '用户管理',
            requireAuth: true
        },
        children: [
            {
                path: 'user',
                name: 'home',
                meta: {
                    icon: 'ios-square',
                    title: '用户管理',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/userManage/user/user.vue'], resolve),
            },
            {
                path: 'driver',
                name: 'driver',
                meta: {
                    icon: 'ios-square',
                    title: '司机管理',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/userManage/driver/driver.vue'], resolve),
            },
            {
                path: 'adminUser',
                name: 'adminUser',
                meta: {
                    icon: 'ios-square',
                    title: '管理员管理',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/userManage/admin/adminUser.vue'], resolve),
            },
            {
                path: 'roleAuthManage',
                name: 'roleAuthManage',
                meta: {
                    icon: 'ios-square',
                    title: '角色管理',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/userManage/roleAuthManage/roleAuthManage.vue'], resolve),
            }
        ]
    }
];
// 宣传管理
const PublicManage = [
    {
        path: '/publicManage',
        name: 'publicManage',
        component: Main,
        meta: {
            icon: 'ios-square',
            title: '宣传管理',
            requireAuth: true
        },
        children: [
            {
                path: 'noticeManage',
                name: 'noticeManage',
                meta: {
                    icon: 'ios-square',
                    title: '通知公告管理',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/publicManage/noticeManage/noticeManage.vue'], resolve),
            },
            {
                path: 'swiperManage',
                name: 'swiperManage',
                meta: {
                    icon: 'ios-square',
                    title: '轮播图管理',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/publicManage/swiperManage/swiperManage.vue'], resolve),
            }
        ]
    }
];

// 定制公交
const CustomizedBus = [
    {
        path: '/customizedBus',
        name: 'customizedBus',
        component: Main,
        meta: {
            icon: 'ios-square',
            title: '定制公交'
        },
        children: [
            {
                path: 'lineManage',
                name: 'lineManage',
                meta: {
                    icon: 'ios-square',
                    title: '公交线路管理',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/customizedBus/lineManage/lineManage.vue'], resolve),
            },
            {
                path: 'stationManage',
                name: 'stationManage',
                meta: {
                    icon: 'ios-square',
                    title: '停靠站点管理',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/customizedBus/stationManage/stationManage.vue'], resolve),
            }
        ]
    }
];
// 包车管理
const CharteredBus = [
    {
        path: '/charteredBus',
        name: 'charteredBus',
        component: Main,
        meta: {
            icon: 'ios-square',
            title: '包车管理'
        },
        children: [
            {
                path: 'order',
                name: 'order',
                meta: {
                    icon: 'ios-square',
                    title: '包车订单管理',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/charteredBus/order/order.vue'], resolve),
            },
            {
                path: 'organization',
                name: 'organization',
                meta: {
                    icon: 'ios-square',
                    title: '包车机构管理',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/charteredBus/organization/organization.vue'], resolve),
            },
            {
                path: 'orgManage',
                name: 'orgManage',
                meta: {
                    icon: 'ios-square',
                    title: '机构管理',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/charteredBus/orgManage/orgManage.vue'], resolve),
            }
        ]
    }
];

// 公共自行车站管理
const BikeManage = [
    {
        path: '/bikeManage',
        name: 'bikeManage',
        component: Main,
        meta: {
            icon: 'ios-square',
            title: '公共自行车站管理'
        },
        children: [
            {
                path: 'bikeList',
                name: 'bikeList',
                meta: {
                    icon: 'ios-square',
                    title: '公共自行车站',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/bikeManage/bikeList/bikeList.vue'], resolve),
            }
        ]
    }
];

// 一卡通充值点管理
const CardManage = [
    {
        path: '/cardManage',
        name: 'cardManage',
        component: Main,
        meta: {
            icon: 'ios-square',
            title: '一卡通充值点管理'
        },
        children: [
            {
                path: 'cardList',
                name: 'cardList',
                meta: {
                    icon: 'ios-square',
                    title: '一卡通充值点',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/cardManage/cardList/cardList.vue'], resolve),
            }
        ]
    }
];

// 充电桩管理
const ChargingManage = [
    {
        path: '/chargingManage',
        name: 'chargingManage',
        component: Main,
        meta: {
            icon: 'ios-square',
            title: '充电桩管理'
        },
        children: [
            {
                path: 'chargingList',
                name: 'chargingList',
                meta: {
                    icon: 'ios-square',
                    title: '充电桩',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/chargingManage/chargingList/chargingList.vue'], resolve),
            }
        ]
    }
];

// 出租车管理
const TaxiManage = [
    {
        path: '/taxiManage',
        name: 'taxiManage',
        component: Main,
        meta: {
            icon: 'ios-square',
            title: '出租车管理'
        },
        children: [
            {
                path: 'taxiOrder',
                name: 'taxiOrder',
                meta: {
                    icon: 'ios-square',
                    title: '出租车订单',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/taxiManage/taxiOrder/taxiOrder.vue'], resolve),
            }
        ]
    }
];

// 用户反馈
const Feedback = [
    {
        path: '/feedbackManage',
        name: 'feedbackManage',
        component: Main,
        meta: {
            icon: 'ios-square',
            title: '用户反馈'
        },
        children: [
            {
                path: 'feedback',
                name: 'feedback',
                meta: {
                    icon: 'ios-square',
                    title: '用户反馈',
                    requireAuth: true
                },
                component: (resolve) => require(['@/views/feedbackManage/feedback/feedback.vue'], resolve),
            }
        ]
    }
];


// 系统管理
const SystemManage = [
    {
        path: '/systemManage',
        name: 'systemManage',
        component: Main,
        meta: {
            icon: 'ios-settings',
            title: '系统管理',
            requireAuth: true
        },
        children: [
            {
                path: 'dataDict',
                name: 'dataDict',
                meta: {
                    icon: 'ios-square',
                    title: '数据字典',
                    requireAuth: true
                },
                component: () => import('../views/SystemManage/dataDict/dataDict.vue')
            }
        ]
    }
];

export default [
    ...Login,
    ...Home,
    ...UserManage,
    ...PublicManage,
    ...CustomizedBus,
    ...CharteredBus,
    ...BikeManage,
    ...CardManage,
    ...ChargingManage,
    ...TaxiManage,
    ...Feedback,
    ...SystemManage
]