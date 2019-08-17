<template>
    <div class="sidebar">
        <el-menu class="sidebar-el-menu" :default-active="onRoutes" :collapse="collapse" background-color="#324157"
            text-color="#bfcbd9" active-text-color="#20a0ff" unique-opened router>
            <template v-for="item in items">
                <template v-if="item.subs">
                    <el-submenu :index="item.index" :key="item.index">
                        <template slot="title">
                            <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                        </template>
                        <template v-for="subItem in item.subs">
                            <el-submenu v-if="subItem.subs" :index="subItem.index" :key="subItem.index">
                                <template slot="title">{{ subItem.title }}</template>
                                <el-menu-item v-for="(threeItem,i) in subItem.subs" :key="i" :index="threeItem.index">
                                    {{ threeItem.title }}
                                </el-menu-item>
                            </el-submenu>
                            <el-menu-item v-else :index="subItem.index" :key="subItem.index">
                                {{ subItem.title }}
                            </el-menu-item>
                        </template>
                    </el-submenu>
                </template>
                <template v-else>
                    <el-menu-item :index="item.index" :key="item.index">
                        <i :class="item.icon"></i><span slot="title">{{ item.title }}</span>
                    </el-menu-item>
                </template>
            </template>
        </el-menu>
    </div>
</template>

<script>
    import bus from '../common/bus';
    export default {
        data() {
            return {
                collapse: false,
                items: [
                    {
                        icon: 'el-icon-lx-home',
                        index: 'dashboard',
                        title: '系统首页'
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '15',
                        title: '小程序设置',
                        subs: [
                            {
                                index: 'item_list',
                                title: '宝贝管理',
                            },
                            {
                                index: 'banner_list',
                                title: 'banner库',
                            },
                            {
                                index: 'setting_banner',
                                title: '首页设置',
                            },
                            {
                                index: 'setting_recommend',
                                title: '推荐设置',
                            },
                            {
                                index: 'freight',
                                title: '运费设置',
                            },
                            {
                                index: 'presentCategory',
                                title: '小程序呈现品类',
                            },
                            {
                                index: 'presentSeries',
                                title: '小程序呈现系列',
                            },
                            {
                                index: 'itemsWeeklyNew',
                                title: '每周上新',
                            },
                            {
                                index: 'itemsDesigner',
                                title: '设计师推荐',
                            },
                            {
                                index: 'itemsHot',
                                title: '热销商品',
                            },
                            {
                                index: 'editor',
                                title: '更新日志'
                            },
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '10',
                        title: '商品属性设置',
                        subs: [
                            
                            {
                                index: 'brand',
                                title: '商品品牌',
                            },
                            {
                                index: 'sizes',
                                title: '商品尺寸',
                            },
                            {
                                index: 'category_list',
                                title: '商品类目',
                            },
                            {
                                index: 'series',
                                title: '商品系列',
                            },
                            {
                                index: 'properties',
                                title: '商品属性',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '9',
                        title: '终端信息设置',
                        subs: [
                            {
                                index: 'partner_list',
                                title: '合伙人管理',
                            },
                            {
                                index: 'shopkeeper_list',
                                title: '金牌店长管理',
                            },
                            {
                                index: 'shop_list',
                                title: '门店管理',
                            },
                            {
                                index: 'region_list',
                                title: '大区管理',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '29',
                        title: '会员管理',
                        subs: [
                            {
                                index: 'member',
                                title: '会员管理',
                            },
                            {
                                index: 'partnerApply',
                                title: '线上合伙人',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '13',
                        title: '营销设置',
                        subs: [
                            {
                                index: 'coupon',
                                title: '优惠券',
                            },
                            {
                                index: 'cutdown',
                                title: '砍价',
                            },
                            {
                                index: 'discount',
                                title: '折扣',
                            },
                            {
                                index: 'seckill',
                                title: '秒杀',
                            },
                            {
                                index: 'group',
                                title: '拼团',
                            },
                            {
                                index: 'encouragement',
                                title: '销售激励',
                            }
                            ,
                            {
                                index: 'fixedPrice',
                                title: '一口价',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '11',
                        title: '交易管理',
                        subs: [
                            {
                                index: 'trade_index',
                                title: '订单管理',
                            },
                            {
                                index: 'tradeService',
                                title: '订单管理(客服)',
                            },
                            {
                                index: 'trade_delivery',
                                title: '发货管理',
                            },
                            {
                                index: 'refund',
                                title: '退货管理',
                            },
                            {
                                index: 'ticket',
                                title: '取货单管理',
                            },
                            {
                                index: 'refund_money',
                                title: '退款管理',
                            },
                            {
                                index: 'service',
                                title: '客服管理',
                            },
                            {
                                index: 'service_task',
                                title: '客服任务',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '30',
                        title: '报表管理',
                        subs: [
                            {
                                index: 'cwbb',
                                title: '财务报表',
                                subs:[
                                    
                                    {
                                        index: 'vipGetCash',
                                        title: '会员提现'
                                    },
                                    {
                                        index: 'shareProfit',
                                        title: '结算分成'
                                    },
                                    {
                                        index: 'getPartnerReserve',
                                        title: '(汇总)合伙人储值消费'
                                    },
                                    {
                                        index: 'getShopReserve',
                                        title: '(汇总)店铺储值消费'
                                    },
                                    {
                                        index: 'getShopVipReserve',
                                        title: '(汇总)店铺会员储值消费'
                                    },
                                    {
                                        index: 'getVipReserveDetail',
                                        title: '(明细)店铺会员储值消费'
                                    },
                                 
                                    {
                                        index: 'getShopMemberSaleDetail',
                                        title: '(明细)店铺会员销售'
                                    },
                                    {
                                        index: 'shopSalesScheduleDetail',
                                        title: '(明细)店铺销售'
                                    },
                                    
                                    // {
                                    //     index: 'storeLogisticsList',
                                    //     title: '(明细)店铺物流'
                                    // }
                                ]
                            },
                            {
                                index: 'spbb',
                                title: '商品报表',
                                subs:[
                                    {
                                        index: 'singleSale',
                                        title: '单品销售分析'
                                    },
                                    {
                                        index: 'hotStyleSale',
                                        title: '爆款销售分析'
                                    },
                                    {
                                        index: 'saleDetail',
                                        title: '(明细)销售明细'
                                    },
                                    {
                                        index: 'saleSummary',
                                        title: '(汇总)销售汇总'
                                    },
                                    {
                                        index: 'refundDetail',
                                        title: '(明细)退货明细'
                                    },
                                    {
                                        index: 'refundSummary',
                                        title: '(汇总)退货汇总'
                                    },
                                    {
                                        index: 'shopAllocationSummary',
                                        title: '(汇总)店铺调拨'
                                    }
                                    ,
                                    {
                                        index: 'shopAllocationFellow',
                                        title: '(跟进)店铺调拨'
                                    },
                                    {
                                        index: 'getShopStorageDifferencesQuery',
                                        title: '(明细)店铺商品流水表'
                                    },
                                    {
                                        index: 'storeMerchandiseInventoryDetail',
                                        title: '(明细)店铺商品进销存管理'
                                    }
                                    ,
                                    {
                                        index: 'categorySale',
                                        title: '店铺销售品类分析'
                                    }
                                    // ,
                                    // {
                                    //     index: 'shopSaleRank',
                                    //     title: '店铺销售排名'
                                    // }
                                ]
                            },
                            {
                                index: 'kfbb',
                                title: '客服报表',
                                subs:[
                                    {
                                        index: 'orderTrackingForm',
                                        title: '售前订单跟踪'
                                    }
                                ]
                            },
                            
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '16',
                        title: '商品管理',
                        subs: [
                            // {
                            //     index: 'test',
                            //     title: 'test',
                            // },
                            {
                                index: 'stockproblem',
                                title: '次品库存',
                            },
                            {
                                index: 'stockproblemrecord',
                                title: '次品登记',
                            },
                            {
                                index: 'stockcommon',
                                title: '普通库存',
                            },
                            {
                                index: 'allot',
                                title: '调拨通知',
                            },
                            {
                                index: 'send',
                                title: '发货单',
                            },
                            {
                                index: 'allotSend',
                                title: '调拨发货单',
                            },
                            {
                                index: 'distribute',
                                title: '铺货单管理',
                            },
                            {
                                index: 'supply',
                                title: '补货单管理',
                            },
                            {
                                index: 'inventory',
                                title: '盘存单管理',
                            }
                            ,
                            {
                                index: 'recall',
                                title: '退仓单管理',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '18',
                        title: '门店日志管理',
                        subs: [
                            {
                                index: 'dailySummary',
                                title: '每日总结',
                            },
                            {
                                index: 'weeklySummary',
                                title: '每周总结',
                            }
                            ,
                            {
                                index: 'moonthlySummary',
                                title: '每月总结',
                            },
                            {
                                index: 'saleTarget',
                                title: '销售目标分解',
                            },
                            {
                                index: 'shopHandOver',
                                title: '门店交接',
                            },
                            {
                                index: 'workHandOver',
                                title: '工作交接项目',
                            },
                            {
                                index: 'exhibition',
                                title: '门店陈列',
                            },
                            {
                                index: 'material',
                                title: '素材资料',
                            },
                            {
                                index: 'poster',
                                title: '海报设置',
                            },
                            {
                                index: 'shareCode',
                                title: '分享码管理',
                            },
                            {
                                index: 'longWxSet',
                                title: '长微信设置',
                            }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '7',
                        title: '总部审核',
                        subs: [
                            {
                                index: 'checkItemsOnline',
                                title: '宝贝上线审核'
                            },
                            {
                                index: 'checkShop',
                                title: '门店审核'
                            },
                            {
                                index: 'checkAllot',
                                title: '调拨通知审核'
                            },
                            {
                                index: 'checkDistribute',
                                title: '铺货单审核'
                            },
                            {
                                index: 'checkSupply',
                                title: '补货单审核'
                            },
                            {
                                index: 'checkRefund',
                                title: '退仓单审核'
                            },
                            {
                                index: 'checkCoupon',
                                title: '优惠券审核'
                            },
                            // {
                            //     index: 'checkDiscount',
                            //     title: '折扣审核'
                            // },
                            // {
                            //     index: 'checkSeckill',
                            //     title: '秒杀审核'
                            // },
                            // {
                            //     index: 'checkGroup',
                            //     title: '拼团审核'
                            // },
                            // {
                            //     index: 'checkCutdown',
                            //     title: '砍价审核'
                            // }
                        ]
                    },
                    {
                        icon: 'el-icon-menu',
                        index: '14',
                        title: '权限设置',
                        subs: [
                            {
                                index: 'menu',
                                title: '权限管理',
                            },
                            {
                                index: 'role',
                                title: '角色管理',
                            },
                            {
                                index: 'user',
                                title: '用户管理',
                            }
                        ]
                    }
                   ,
                //     {
                //         icon: 'el-icon-menu',
                //         index: '8',
                //         title: '资料库',
                //         subs: [
                //             {
                //                 index: 'brand',
                //                 title: '商品品牌',
                //             },
                //             {
                //                 index: 'sizes',
                //                 title: '商品尺寸',
                //             },
                //             {
                //                 index: 'category_list',
                //                 title: '商品类目',
                //             },
                //             {
                //                 index: 'series',
                //                 title: '商品系列',
                //             },
                //             {
                //                 index: 'properties',
                //                 title: '商品属性',
                //             },
                //             {
                //                 index: 'exhibition',
                //                 title: '门店陈列',
                //             },
                //             {
                //                 index: 'material',
                //                 title: '素材资料',
                //             },
                //             {
                //                 index: 'poster',
                //                 title: '海报',
                //             },
                //             {
                //                 index: 'shareCode',
                //                 title: '分享码管理',
                //             }
                //         ]
                //     },
                //     {
                //         icon: 'el-icon-menu',
                //         index: '12',
                //         title: '会员',
                //         subs: [
                //             {
                //                 index: 'member',
                //                 title: '会员管理',
                //             }
                //         ]
                //     },
                //     {
                //         icon: 'el-icon-menu',
                //         index: '17',
                //         title: '客服',
                //         subs: [
                //             {
                //                 index: 'service',
                //                 title: '客服管理',
                //             },
                //             {
                //                 index: 'service_task',
                //                 title: '客服任务',
                //             }
                //         ]
                //     },
                //     {
                //         icon: 'el-icon-menu',
                //         index: '19',
                //         title: '销售目标',
                //         subs: [
                //             {
                //                 index: 'saleTarget',
                //                 title: '销售目标分解',
                //             }
                //         ]
                //     },
                //     {
                //         icon: 'el-icon-menu',
                //         index: '20',
                //         title: '门店工作交接',
                //         subs: [
                //             {
                //                 index: 'shopHandOver',
                //                 title: '门店交接',
                //             },
                //             {
                //                 index: 'workHandOver',
                //                 title: '工作交接项目',
                //             }
                //         ]
                //     },
                    
                    // {
                    //     icon: 'el-icon-lx-cascades',
                    //     index: 'table',
                    //     title: '基础表格'
                    // },
               
                    // {
                    //     icon: 'el-icon-lx-calendar',
                    //     index: '3',
                    //     title: '表单相关',
                    //     subs: [
                    //         {
                    //             index: 'form',
                    //             title: '基本表单'
                    //         },
                    //         {
                    //             index: '3-2',
                    //             title: '三级菜单',
                    //             subs: [
                    //                 {
                    //                     index: 'editor',
                    //                     title: '富文本编辑器'
                    //                 },
                    //                 {
                    //                     index: 'markdown',
                    //                     title: 'markdown编辑器'
                    //                 },
                    //             ]
                    //         },
                    //         {
                    //             index: 'upload',
                    //             title: '文件上传'
                    //         }
                    //     ]
                    // },
                    // {
                    //     icon: 'el-icon-lx-emoji',
                    //     index: 'icon',
                    //     title: '自定义图标'
                    // },
                    // {
                    //     icon: 'el-icon-pie-chart',
                    //     index: 'charts',
                    //     title: 'schart图表'
                    // },
                    // {
                    //     icon: 'el-icon-menu',
                    //     index: '6',
                    //     title: '拖拽组件',
                    //     subs: [
                    //         {
                    //             index: 'drag',
                    //             title: '拖拽列表',
                    //         },
                    //         {
                    //             index: 'dialog',
                    //             title: '拖拽弹框',
                    //         }
                    //     ]
                    // },
                    // {
                    //     icon: 'el-icon-lx-global',
                    //     index: 'i18n',
                    //     title: '国际化功能'
                    // },
                   
                    // ,
                    // {
                    //     icon: 'el-icon-lx-warn',
                    //     index: '7',
                    //     title: '错误处理',
                    //     subs: [
                    //         {
                    //             index: 'permission',
                    //             title: '权限测试'
                    //         },
                    //         {
                    //             index: '404',
                    //             title: '404页面'
                    //         }
                    //     ]
                    // }
                    
                ]
            }
        },
        computed:{
            onRoutes(){
                return this.$route.path.replace('/','');
            }
        },
        created(){
            // 通过 Event Bus 进行组件间通信，来折叠侧边栏
            bus.$on('collapse', msg => {
                this.collapse = msg;
            })
        }
    }
</script>

<style scoped>
    .sidebar{
        display: block;
        position: absolute;
        left: 0;
        top: 70px;
        bottom:0;
        overflow-y: scroll;
        /* height: 100%; */
        background: rgb(50, 65, 87);
    }
    .sidebar::-webkit-scrollbar{
        width: 0;
    }
    .sidebar-el-menu:not(.el-menu--collapse){
        width: 230px;
    }
    .sidebar > ul {
        height:100%;
    }
</style>
