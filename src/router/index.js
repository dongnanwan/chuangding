import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            redirect: '/dashboard'
        },
        {
            name:'zswj',
            path: '/',
            component: resolve => require(['../components/common/Home.vue'], resolve),
            meta: { keepAlive: true,title: '自述文件'},
            children:[
                //资料库
                {
                    path: '/banner_list',
                    component: resolve => require(['../components/page/banner/list.vue'], resolve),
                    meta: { title: 'banner列表' ,keepAlive: true}
                },
                {
                    path: '/banner_add',
                    component: resolve => require(['../components/page/banner/add.vue'], resolve),
                    meta: { title: '添加banner' }
                },
                {
                    path: '/brand',
                    component: resolve => require(['../components/page/brand/list.vue'], resolve),
                    meta: { title: '商品品牌',keepAlive: true}
                },
                {
                    path: '/sizes',
                    component: resolve => require(['../components/page/sizes/list.vue'], resolve),
                    meta: { title: '商品尺寸',keepAlive: true}
                },
                {
                    path: '/category_list',
                    component: resolve => require(['../components/page/category/list.vue'], resolve),
                    meta: { title: '商品类目' ,keepAlive: true}
                },
                {
                    path: '/category_edit',
                    component: resolve => require(['../components/page/category/add.vue'], resolve),
                    meta: { title: '添加编辑类目'},
                },
                {
                    path: '/series',
                    component: resolve => require(['../components/page/series/list'], resolve),
                    meta: { title: '商品系列'}
                },
                {
                    path: '/series_edit',
                    component: resolve => require(['../components/page/series/add.vue'], resolve),
                    meta: { title: '编辑系列'}
                },
                {
                    path: '/properties',
                    component: resolve => require(['../components/page/properties/index'], resolve),
                    meta: { title: '商品属性' },
                },
                //门店
                {
                    path: '/partner_edit',
                    component: resolve => require(['../components/page/partner/edit'], resolve),
                    meta: { title: '编辑合伙人'},
                  },
                  {
                    path: '/partner_add',
                    component: resolve => require(['../components/page/partner/edit'], resolve),
                    meta: { title: '添加合伙人'}
                  },
                  {
                    path: '/partner_list',
                    component: resolve => require(['../components/page/partner/list'], resolve),
                    meta: { title: '合伙人管理'}
                  },
                  {
                    path: '/shopkeeper_edit',
                    component: resolve => require(['../components/page/shopkeeper/add'], resolve),
                    meta: { title: '编辑店长'}
                  },
                  {
                    path: '/shopkeeper_add',
                    component: resolve => require(['../components/page/shopkeeper/add'], resolve),
                    meta: { title: '添加店长'}
                  },
                  {
                    path: '/shopkeeper_list',
                    component: resolve => require(['../components/page/shopkeeper/list'], resolve),
                    meta: { title: '店长管理'}
                  },
                  {
                    path: '/region_list',
                    component: resolve => require(['../components/page/region/region'], resolve),
                    meta: { title: '区域管理'}
                  },
                  {
                    path: '/shop_add',
                    component: resolve => require(['../components/page/shop/add'], resolve),
                    meta: { title: '添加门店'}
                  },
                  {
                    path: '/shop_edit',
                    component: resolve => require(['../components/page/shop/add'], resolve),
                    meta: { title: '编辑门店' }
                  },
                  {
                    path: '/shop_list',
                    component: resolve => require(['../components/page/shop/list'], resolve),
                    meta: { title: '门店管理'}
                  },
                  {
                    path: '/shop_verify',
                    component: resolve => require(['../components/page/shop/verify'], resolve),
                    meta: { title: '门店审核'}
                  },
                  //商品
                  {
                    path: '/item_list',
                    component: resolve => require(['../components/page/item/list'], resolve),
                    meta: { title: '商品'}
                  },
                  {
                    path: '/item_edit',
                    component: resolve => require(['../components/page/item/edit'], resolve),
                    meta: { title: '编辑商品'},
                    hidden: true
                  },
                  //交易
                  {
                    path: '/trade_index',
                    component: resolve => require(['../components/page/trade/list'], resolve),
                    meta: { title: '订单管理'}
                  },
                  {
                    path: '/trade_delivery',
                    component: resolve => require(['../components/page/trade/packet_list'], resolve),
                    meta: { title: '发货管理'}
                  },
                  {
                    path: '/refund',
                    component: resolve => require(['../components/page/refund/list'], resolve),
                    meta: { title: '退货管理'}
                  },
                  {
                    path: '/ticket',
                    component: resolve => require(['../components/page/trade/ticket'], resolve),
                    meta: { title: '取货单管理'}
                  },
                  //会员
                  {
                    path: '/member',
                    component: resolve => require(['../components/page/member/list'], resolve),
                    meta: { title: '会员'}
                  },
                  {
                    path: '/partnerApply',
                    component: resolve => require(['../components/page/partnerApply/partnerApply'], resolve),
                    meta: { title: '线上合伙人'}
                  },
                  //营销
                  {
                    path: '/coupon',
                    component: resolve => require(['../components/page/coupon/list'], resolve),
                    meta: { title: '优惠券'}
                  },
                  {
                    path: '/coupon_edit',
                    component: resolve => require(['../components/page/coupon/add.vue'], resolve),
                    meta: { title: '添加优惠券'}
                  },
                  {
                    path: '/marketing',
                    component: resolve => require(['../components/page/marketing/list'], resolve),
                    meta: { title: '商品营销'}
                  },
                  {
                    path: '/marketing_edit',
                    component: resolve => require(['../components/page/marketing/add.vue'], resolve),
                    meta: { title: '编辑商品营销'}
                  },
                  //用户与权限
                  {
                    path: '/menu',
                    component: resolve => require(['../components/page/menu/edit'], resolve),
                    meta: { title: '权限管理'}
                  },
                  {
                    path: '/role',
                    component: resolve => require(['../components/page/role/list.vue'], resolve),
                    meta: { title: '角色管理'}
                  },
                  {
                    path: '/role_edit',
                    component: resolve => require(['../components/page/role/edit.vue'], resolve),
                    meta: { title: '配置角色权限'}
                  },
                  {
                    path: '/user',
                    component: resolve => require(['../components/page/user/list.vue'], resolve),
                    meta: { title: '用户管理'}
                  },
                  {
                    path: '/user_edit',
                    component: resolve => require(['../components/page/user/edit.vue'], resolve),
                    meta: { title: '修改用户角色'}
                  },
                  {
                    path: '/user_add',
                    component: resolve => require(['../components/page/user/add.vue'], resolve),
                    meta: { title: '添加用户'},
                  },
                  //设置
                  {
                    path: '/setting_banner',
                    component: resolve => require(['../components/page/setting/banner'], resolve),
                    meta: { title: '首页设置'}
                  },
                  {
                    path: '/setting_recommend',
                    component: resolve => require(['../components/page/setting/recommend'], resolve),
                    meta: { title: '推荐设置'}
                  },
                  {
                    path: '/setting_vip',
                    component: resolve => require(['../components/page/setting/vip'], resolve),
                    meta: { title: 'VIP设置'}
                  },
                  {
                    path: '/freight',
                    component: resolve => require(['../components/page/setting/freight'], resolve),
                    meta: { title: '运费设置'}
                  },
                  {
                    path: '/presentCategory',
                    component: resolve => require(['../components/page/setting/presentCategory'], resolve),
                    meta: { title: '小程序呈现品类'}
                  },
                  {
                    path: '/presentSeries',
                    component: resolve => require(['../components/page/setting/presentSeries'], resolve),
                    meta: { title: '小程序呈现系列'}
                  },
                  {
                    path: '/itemsWeeklyNew',
                    component: resolve => require(['../components/page/setting/itemsWeeklyNew'], resolve),
                    meta: { title: '每周上新'}
                  },
                  {
                    path: '/itemsDesigner',
                    component: resolve => require(['../components/page/setting/itemsDesigner'], resolve),
                    meta: { title: '设计师推荐'}
                  },
                  {
                    path: '/itemsHot',
                    component: resolve => require(['../components/page/setting/itemsHot'], resolve),
                    meta: { title: '热销商品'}
                  },
                  //库存
                  {
                    name:'stockcommon',
                    path: '/stockcommon',
                    component: resolve => require(['../components/page/stockcommon/index'], resolve),
                    meta: { keepAlive: true,title: '普通库存'}
                  },
                  {
                    name:'stockproblem',
                    path: '/stockproblem',
                    component: resolve => require(['../components/page/stockproblem/list'], resolve),
                    meta: { keepAlive: true,title: '次品库存'}
                  },
                  {
                    path: '/stockproblemrecord',
                    component: resolve => require(['../components/page/stockproblemrecord/index'], resolve),
                    meta: { title: '次品登记', noCache: true }
                  },
                  {
                    path: '/allot',
                    component: resolve => require(['../components/page/allot/list'], resolve),
                    meta: { title: '调拨通知', noCache: true }
                  },
                  {
                    path: '/allotSend',
                    component: resolve => require(['../components/page/send/allotSend'], resolve),
                    meta: { title: '调拨发货单', noCache: true }
                  },
                  {
                    path: '/send',
                    component: resolve => require(['../components/page/send/index'], resolve),
                    meta: { title: '发货单', noCache: true }
                  },
                  {
                    path: '/distribute',
                    component: resolve => require(['../components/page/distribute/distribute'], resolve),
                    meta: { title: '铺货单', noCache: true }
                  },
                  {
                    path: '/supply',
                    component: resolve => require(['../components/page/supply/supply'], resolve),
                    meta: { title: '补货单', noCache: true }
                  },
                  {
                    path: '/inventory',
                    component: resolve => require(['../components/page/inventory/index'], resolve),
                    meta: { title: '盘存单', noCache: true }
                  },
                  {
                    path: '/recall',
                    component: resolve => require(['../components/page/recall/recall.vue'], resolve),
                    meta: { title: '退仓单', noCache: true }
                  },
                  {
                    path: '/test',
                    component: resolve => require(['../components/page/Test.vue'], resolve),
                    meta: { title: 'test', noCache: true }
                  },
                  {
                    path: '/service',
                    component: resolve => require(['../components/page/service/service.vue'], resolve),
                    meta: { title: '客服管理' }
                 },
                 {
                  path: '/service_task',
                  component: resolve => require(['../components/page/service/serviceTask.vue'], resolve),
                  meta: { title: '客服任务界面' }
                 },
                 {
                  path: '/tradeService',
                  component: resolve => require(['../components/page/service/tradeService.vue'], resolve),
                  meta: { title: '订单管理(客服)' }
                 },
                 {
                  path: '/dailySummary',
                  component: resolve => require(['../components/page/summary/dailySummary.vue'], resolve),
                  meta: { title: '每日总结' }
                 },
                 {
                  path: '/weeklySummary',
                  component: resolve => require(['../components/page/summary/weeklySummary.vue'], resolve),
                  meta: { title: '每周总结' }
                 },
                 {
                  path: '/moonthlySummary',
                  component: resolve => require(['../components/page/summary/moonthlySummary.vue'], resolve),
                  meta: { title: '每月总结' }
                 },
                 {
                  path: '/refund_money',
                  component: resolve => require(['../components/page/refund/refundMoney.vue'], resolve),
                  meta: { title: '退款管理' }
                 },
                 {
                  path: '/discount',
                  component: resolve => require(['../components/page/discount/discount.vue'], resolve),
                  meta: { title: '折扣' }
                 },
                 {
                  path: '/seckill',
                  component: resolve => require(['../components/page/seckill/seckill.vue'], resolve),
                  meta: { title: '秒杀' }
                 },
                 {
                  path: '/fixedPrice',
                  component: resolve => require(['../components/page/fixedPrice/fixedPrice.vue'], resolve),
                  meta: { title: '一口价' }
                 },
                 {
                  path: '/group',
                  component: resolve => require(['../components/page/group/group.vue'], resolve),
                  meta: { title: '拼团' }
                 },
                 {
                  path: '/encouragement',
                  component: resolve => require(['../components/page/encouragement/encouragement.vue'], resolve),
                  meta: { title: '销售激励' }
                 },
                 {
                  path: '/saleTarget',
                  component: resolve => require(['../components/page/saleTarget/saleTarget.vue'], resolve),
                  meta: { title: '销售目标分解' }
                 },
                 {
                    path: '/shareProfit',
                    component: resolve => require(['../components/page/trade/shareProfit.vue'], resolve),
                    meta: { title: '结算分成' }
                 },
                 {
                  path: '/tradeProfit',
                  component: resolve => require(['../components/page/trade/tradeProfit.vue'], resolve),
                  meta: { title: '结算分润' }
                 },
                 {
                  path: '/shopHandOver',
                  component: resolve => require(['../components/page/handOver/shopHandOver.vue'], resolve),
                  meta: { title: '门店交接' }
                 },
                 {
                  path: '/workHandOver',
                  component: resolve => require(['../components/page/handOver/workHandOver.vue'], resolve),
                  meta: { title: '工作交接项目' }
                 },
                 {
                  path: '/material',
                  component: resolve => require(['../components/page/material/material.vue'], resolve),
                  meta: { title: '素材资料' }
                 },
                 {
                  path: '/exhibition',
                  component: resolve => require(['../components/page/exhibition/exhibition.vue'], resolve),
                  meta: { title: '门店陈列' }
                 },
                 {
                  path: '/poster',
                  component: resolve => require(['../components/page/poster/poster.vue'], resolve),
                  meta: { title: '海报' }
                 },
                 {
                  path: '/shareCode',
                  component: resolve => require(['../components/page/setting/shareCode.vue'], resolve),
                  meta: { title: '分享码管理' }
                 },
                 {
                  path: '/checkItemsOnline',
                    component: resolve => require(['../components/page/check/checkItemsOnline.vue'], resolve),
                    meta: { title: '宝贝上线审核' }
                 },
                 {
                  path: '/checkShop',
                    component: resolve => require(['../components/page/check/checkShop.vue'], resolve),
                    meta: { title: '门店审核' }
                 },
                 {
                  path: '/checkAllot',
                    component: resolve => require(['../components/page/check/checkAllot.vue'], resolve),
                    meta: { title: '调拨通知审核' }
                 },
                 {
                  path: '/checkDistribute',
                    component: resolve => require(['../components/page/check/checkDistribute.vue'], resolve),
                    meta: { title: '铺货单审核' }
                 },
                 {
                  path: '/checkSupply',
                    component: resolve => require(['../components/page/check/checkSupply.vue'], resolve),
                    meta: { title: '补货单审核' }
                 },
                 {
                  path: '/checkRefund',
                    component: resolve => require(['../components/page/check/checkRefund.vue'], resolve),
                    meta: { title: '退仓单审核' }
                 },
                 {
                  path: '/checkDiscount',
                    component: resolve => require(['../components/page/check/checkDiscount.vue'], resolve),
                    meta: { title: '折扣审核' }
                 },
                 {
                  path: '/checkSeckill',
                    component: resolve => require(['../components/page/check/checkSeckill.vue'], resolve),
                    meta: { title: '秒杀审核' }
                 },
                 {
                  path: '/checkGroup',
                    component: resolve => require(['../components/page/check/checkGroup.vue'], resolve),
                    meta: { title: '拼团审核' }
                 },
                 {
                  path: '/checkCutdown',
                    component: resolve => require(['../components/page/check/checkCutdown.vue'], resolve),
                    meta: { title: '砍价审核' }
                 },
                 {
                  path: '/checkCoupon',
                    component: resolve => require(['../components/page/check/checkCoupon.vue'], resolve),
                    meta: { title: '优惠券审核' }
                 },
                 {
                  path: '/cutdown',
                  component: resolve => require(['../components/page/cutdown/cutdown.vue'], resolve),
                  meta: { title: '砍价' }
                 },
                 {
                  path: '/message',
                  component: resolve => require(['../components/page/message/message.vue'], resolve),
                  meta: { title: '消息' }
                 },
                 //报表
                 {
                    path: '/vipGetCash',
                    component: resolve => require(['../components/page/reportForm/vipGetCash.vue'], resolve),
                    meta: { title: '会员提现' }
                  },
                  {
                    path: '/getPartnerReserve',
                    component: resolve => require(['../components/page/reportForm/getPartnerReserve.vue'], resolve),
                    meta: { title: '(汇总)合伙人储值消费' }
                  },
                  {
                    path: '/getShopReserve',
                    component: resolve => require(['../components/page/reportForm/getShopReserve.vue'], resolve),
                    meta: { title: '(汇总)店铺储值消费' }
                  },
                  {
                    path: '/getShopMemberSaleDetail',
                    component: resolve => require(['../components/page/reportForm/getShopMemberSaleDetail.vue'], resolve),
                    meta: { title: '(明细)店铺会员销售' }
                  },
                  {
                    path: '/getShopVipReserve',
                    component: resolve => require(['../components/page/reportForm/getVipReserve.vue'], resolve),
                    meta: { title: '(汇总)会员储值消费' }
                  },
                  {
                    path: '/getVipReserveDetail',
                    component: resolve => require(['../components/page/reportForm/getVipReserveDetail.vue'], resolve),
                    meta: { title: '(明细)会员储值消费' }
                  },
                  {
                    path: '/getShopStorageDifferencesQuery',
                    component: resolve => require(['../components/page/reportForm/getShopStorageDifferencesQueryDetail.vue'], resolve),
                    meta: { title: '(明细)店铺商品进销存差异查询' }
                  },
                  {
                    path: '/storeMerchandiseInventoryDetail',
                    component: resolve => require(['../components/page/reportForm/storeMerchandiseInventoryDetail.vue'], resolve),
                    meta: { title: '(明细)店铺商品进销存管理' }
                  },
                  {
                    path: '/shopSalesScheduleDetail',
                    component: resolve => require(['../components/page/reportForm/shopSalesScheduleDetail.vue'], resolve),
                    meta: { title: '(明细)店铺销售' }
                  },
                  {
                    path: '/storeLogisticsList',
                    component: resolve => require(['../components/page/reportForm/storeLogisticsList.vue'], resolve),
                    meta: { title: '(明细)店铺物流' }
                  },
                  
                  {
                    path: '/orderTrackingForm',
                    component: resolve => require(['../components/page/reportForm/orderTrackingForm.vue'], resolve),
                    meta: { title: '售前订单跟踪' }
                  },
                  //商品报表
                  {
                    path: '/singleSale',
                    component: resolve => require(['../components/page/reportFormItem/singleSale.vue'], resolve),
                    meta: { title: '单品销售' }
                  },
                  {
                    path: '/hotStyleSale',
                    component: resolve => require(['../components/page/reportFormItem/hotStyleSale.vue'], resolve),
                    meta: { title: '爆款销售分析' }
                  },
                  {
                    path: '/saleDetail',
                    component: resolve => require(['../components/page/reportFormItem/saleDetail.vue'], resolve),
                    meta: { title: '(明细)销售明细' }
                  },
                  {
                    path: '/saleSummary',
                    component: resolve => require(['../components/page/reportFormItem/saleSummary.vue'], resolve),
                    meta: { title: '(汇总)销售汇总' }
                  },
                  {
                    path: '/refundDetail',
                    component: resolve => require(['../components/page/reportFormItem/refundDetail.vue'], resolve),
                    meta: { title: '(明细)退货明细' }
                  },
                  {
                    path: '/refundSummary',
                    component: resolve => require(['../components/page/reportFormItem/refundSummary.vue'], resolve),
                    meta: { title: '(汇总)退货汇总' }
                  },
                  {
                    path: '/shopAllocationSummary',
                    component: resolve => require(['../components/page/reportFormItem/shopAllocationSummary.vue'], resolve),
                    meta: { title: '(汇总)店铺调拨' }
                  },
                  {
                    path: '/shopAllocationFellow',
                    component: resolve => require(['../components/page/reportFormItem/shopAllocationFellow.vue'], resolve),
                    meta: { title: '(跟进)店铺调拨' }
                  },
                  {
                    path: '/categorySale',
                    component: resolve => require(['../components/page/reportFormItem/categorySale.vue'], resolve),
                    meta: { title: '店铺销售品类分析' }
                  },
                  {
                    path: '/shopSaleRank',
                    component: resolve => require(['../components/page/reportFormItem/shopSaleRank.vue'], resolve),
                    meta: { title: '店铺销售排名' }
                  },
                  {
                    path: '/dashboard',
                    component: resolve => require(['../components/page/Dashboard.vue'], resolve),
                    meta: { title: '系统首页' }
                  },
                
                // {
                //     path: '/icon',
                //     component: resolve => require(['../components/page/Icon.vue'], resolve),
                //     meta: { title: '自定义图标' }
                // },
                // {
                //     path: '/table',
                //     component: resolve => require(['../components/page/BaseTable.vue'], resolve),
                //     meta: { title: '基础表格' }
                // },
                // {
                //     path: '/tabs',
                //     component: resolve => require(['../components/page/Tabs.vue'], resolve),
                //     meta: { title: 'tab选项卡' }
                // },
                // {
                //     path: '/form',
                //     component: resolve => require(['../components/page/BaseForm.vue'], resolve),
                //     meta: { title: '基本表单' }
                // },
                {
                  // 富文本编辑器组件
                  path: '/editor',
                  component: resolve => require(['../components/page/VueEditor.vue'], resolve),
                  meta: { title: '更新日志' }
                },
                // {
                //     // markdown组件
                //     path: '/markdown',
                //     component: resolve => require(['../components/page/Markdown.vue'], resolve),
                //     meta: { title: 'markdown编辑器' }    
                // },
                // {
                //     // 图片上传组件
                //     path: '/upload',
                //     component: resolve => require(['../components/page/Upload.vue'], resolve),
                //     meta: { title: '文件上传' }   
                // },
                // {
                //     // vue-schart组件
                //     path: '/charts',
                //     component: resolve => require(['../components/page/BaseCharts.vue'], resolve),
                //     meta: { title: 'schart图表' }
                // },
                // {
                //     // 拖拽列表组件
                //     path: '/drag',
                //     component: resolve => require(['../components/page/DragList.vue'], resolve),
                //     meta: { title: '拖拽列表' }
                // },
                // {
                //     // 拖拽Dialog组件
                //     path: '/dialog',
                //     component: resolve => require(['../components/page/DragDialog.vue'], resolve),
                //     meta: { title: '拖拽弹框' }
                // },
                // {
                //     // 国际化组件
                //     path: '/i18n',
                //     component: resolve => require(['../components/page/I18n.vue'], resolve),
                //     meta: { title: '国际化' }
                // },
                // {
                //     // 权限页面
                //     path: '/permission',
                //     component: resolve => require(['../components/page/Permission.vue'], resolve),
                //     meta: { title: '权限测试', permission: true }
                // },
                {
                    path: '/404',
                    component: resolve => require(['../components/page/404.vue'], resolve),
                    meta: { title: '404' }
                },
                {
                    path: '/403',
                    component: resolve => require(['../components/page/403.vue'], resolve),
                    meta: { title: '403' }
                }
            ]
        },
        {
            path: '/login',
            component: resolve => require(['../components/page/Login.vue'], resolve)
        },
        {
            path: '*',
            redirect: '/404'
        }
    ]
})
