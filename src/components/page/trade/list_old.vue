<template>

  <div>
     <!-- 订单管理-->
    <el-table
      border
      :data="items"
      style="width: 100%">
      <el-table-column show-overflow-tooltip sortable fixed prop="id" label="ID" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="memberNick" label="会员" min-width="140"></el-table-column>
      <el-table-column show-overflow-tooltip label="商品" min-width="240">
        <template slot-scope="scope">
          <!-- <span class="item-list" v-for="order in scope.row.orders" style="margin-top:8px;margin-bottom:8px" :key="order.id"> -->
            <!-- <img :src="'https://img.chuangdingshop.com/' + order.mainImg"  style="margin-right:10px;margin-top:10px" > -->
            <!-- <div class="info"> -->
              <!-- <span class="title">{{order.title}}</span> -->
              <!-- <span class="spec">尺码：{{order.spec}}</span><br/>
              <span class="spec">数量：{{order.num}}</span> -->
            <!-- </div> -->
          <!-- </span> -->

          <span v-for="order in scope.row.orders" :key="order.id">
            {{order.title+','}}
          </span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="dispatchOptionStr" label="提货方式" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip label="订单状态" min-width="80">
        <template slot-scope="scope">
          {{scope.row.statusStr}}
        </template>
      </el-table-column>


      <el-table-column show-overflow-tooltip label="总金额" min-width="80">
        <template slot-scope="scope">{{scope.row.totalAmount.toFixed(2)}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="邮费" min-width="80">
        <template slot-scope="scope">{{(scope.row.postFee||0).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="优惠金额" min-width="80">
        <template slot-scope="scope">{{(scope.row.discountAmount).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="付款金额" min-width="80">
        <template slot-scope="scope">{{(scope.row.payment).toFixed(2)}}</template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="payTime" label="付款时间" min-width="140">
        <template slot-scope="scope">
          {{dateformat(scope.row.payTime)}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="更新时间" min-width="140">
        <template slot-scope="scope">
          {{dateformat(scope.row.modified)}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="收货信息" min-width="220">
        <template slot-scope="scope">
          <!-- {{scope.row.receiverPerson}} {{scope.row.receiverPhone}}<br/> -->
          {{'姓名:'+scope.row.receiverPerson+',地址:'+scope.row.receiverProvince+scope.row.receiverCity+scope.row.receiverArea+scope.row.receiverAddress+',联系电话:'+scope.row.receiverPhone}}
         
        </template>
      </el-table-column>

      <!-- <el-table-column show-overflow-tooltip label="是否确认收货" min-width="90">
        <template slot-scope="scope">{{scope.row.evaluate == false?'否':'是'}}</template>
      </el-table-column> -->
      <!-- <el-table-column show-overflow-tooltip label="发货情况" min-width="90" prop="">
       
      </el-table-column>

      <el-table-column show-overflow-tooltip label="接待客服" min-width="90" prop="">
       
      </el-table-column> -->

      <el-table-column show-overflow-tooltip fixed="right" label="操作" min-width="160">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="showDetail(scope.$index,scope.row)">详情</el-button>
          <template></template>
          <el-button  :disabled="scope.row.statusStr != 'WAIT_DISPATCH'" type="primary" plain @click="dispatch(scope.$index,scope.row)">再分配</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="params.page"
      :page-sizes="[5, 10, 20, 50, 100]"
      :page-size="params.size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    <!-- 明细弹出框 -->
      <el-dialog  :visible.sync="dialogTableVisible" class="detailTable"  fullscreen>
        <el-card>
          <div slot="header" class="clearfix" style="height:25px"> 
            <h2>明细</h2>
          </div>
            <el-table 
                border
                :data="gridData"
                v-loading="loading"
                element-loading-text="数据加载中......"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <el-table-column show-overflow-tooltip label="状态">
                <template slot-scope="scope">
                  <span v-if="scope.row.status == 'WAIT_CONSIGN'">待发货</span> 
                  <span v-else-if="scope.row.status == 'WAIT_RECEIVE'">待收货</span>
                  <span v-else-if="scope.row.status == 'FINISHED'">完成</span>
                  <span v-else-if="scope.row.status == 'TUAN_ING'">已付款 拼团中</span>
                  <span v-else-if="scope.row.status == 'REFUND'">申请退款</span>
                  <span v-else-if="scope.row.status == 'CLOSE'">关闭</span>
                  <span v-else>{{scope.row.status}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip label="封面图片">
                <template slot-scope="scope">
                  <img v-if="scope.row.mainImg" :src="'https://img.chuangdingshop.com/' + scope.row.mainImg" :alt="scope.row.title" width="50" height="50" class="am-img-thumbnail">
                  <p v-else>暂无图片</p>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="title" label="商品"></el-table-column>
              <el-table-column show-overflow-tooltip prop="code" label="款号"></el-table-column>
              <!-- <el-table-column show-overflow-tooltip prop="secondName" label="类别"></el-table-column> -->
              <!-- <el-table-column show-overflow-tooltip prop="title" label="品牌"></el-table-column> -->
              <!-- <el-table-column show-overflow-tooltip prop="color" label="年份"></el-table-column> -->
              <!-- <el-table-column show-overflow-tooltip prop="size" label="季节"></el-table-column> -->
              <!-- <el-table-column show-overflow-tooltip prop="spec" label="颜色-尺码"></el-table-column> -->
              <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
              <el-table-column show-overflow-tooltip prop="size" label="尺码"></el-table-column>
              <!-- <el-table-column show-overflow-tooltip prop="sex" label="性别"></el-table-column> -->
              <!-- <el-table-column show-overflow-tooltip prop="sex" label="系列"></el-table-column> -->
              <!-- <el-table-column show-overflow-tooltip prop="" label="波段"></el-table-column> -->
              <el-table-column show-overflow-tooltip prop="price" label="市场价"></el-table-column>
              <el-table-column show-overflow-tooltip prop="totalAmount" label="下单金额"></el-table-column>
              <el-table-column show-overflow-tooltip prop="num" label="下单数量"></el-table-column>
              <el-table-column show-overflow-tooltip prop="payment" label="付款总额"></el-table-column>
              <el-table-column show-overflow-tooltip prop="barcode" label="EAN13-条形码"></el-table-column>
              <!-- <el-table-column show-overflow-tooltip prop="barcode" label="内部条码"></el-table-column> -->
            </el-table>
          </el-card>
        </el-dialog>

  </div>
</template>

<script>
import dateFormat from '@/assets/date.js'

export default {
  data () {
    return {
      gridData: [],
      dialogTableVisible: false,
      loading:true,
      msgCreate:'msg',
      msgType:'success'
    }
  },
  methods: {
    msgCreateOpen() {
      this.$message({
        message:this.msgCreate,
        type:this.msgType,
        showClose: true
      });
    },
    handleSizeChange (val) {
      this.$store.dispatch('Trade_SIZE_CHG', val)
      this.$store.dispatch('Trade_LIST')
    },
    handleCurrentChange (val) {
      this.$store.dispatch('Trade_PAGE_CHG', val)
      this.$store.dispatch('Trade_LIST')
    },
    dateformat (val) {
      return dateFormat(val, 'yyyy-MM-dd hh:mm:ss')
    },
    showDetail(index,row) {
      this.loading = true
      this.dialogTableVisible = true
      this.gridData = []
      console.log(row)
      
      this.$axios.get(`/api/trade/${row.id}`).then(res=>{
        for(let i of res.data.data.orders){
          this.gridData.push(i)
        }
        
        this.loading = false
        console.log(res.data.data)
      })
    },
    dispatch(index,row){
      this.$axios.put(`/api/trade/${row.id}/dispatch`).then((res)=>{
        if(res.data.code == 200){
          this.msgCreate = '操作成功'
          this.msgType = 'success'
          this.msgCreateOpen()
          this.getInfo()
        }else{
          this.msgCreate = res.data.message
          this.msgType = 'error'
          this.msgCreateOpen()
        }
      })
    }
  },
  computed: {
    total () {
      return this.$store.getters.trade.total
    },
    params () {
      return this.$store.getters.trade.params
    },
    items () {
      this.$store.getters.trade.list.forEach(value => {
        // 提货方式
        if (value.dispatchOption === 'pickInShop') {
          value.dispatchOptionStr = '门店自提'
        } else if (value.dispatchOption === 'deliveryByHQ') {
          value.dispatchOptionStr = '总部配送'
        }

        // 订单状态
        if (value.status === 'WAIT_PAY') {
          value.statusStr = '待付款'
        } else if (value.status === 'WAIT_CONSIGN') {
          value.statusStr = '待发货'
        } else if (value.status === 'WAIT_RECEIVE') {
          value.statusStr = '待收货'
        } else if (value.status === 'FINISHED') {
          value.statusStr = '完成'
        } else if (value.status === 'TUAN_ING') {
          value.statusStr = '已付款 拼团中'
        } else if (value.status === 'REFUND') {
          value.statusStr = '申请退款'
        } else if (value.status === 'CLOSE') {
          value.statusStr = '关闭'
        }
      })
      return this.$store.getters.trade.list
    }
   
  },
  mounted () {
    //  this.params.tid = this.$route.query.routerData
    //   this.getInfo()
    this.openLoading('加载中...')
    this.$store.dispatch('Trade_LIST').then((res) => {
      this.closeLoading()
    })
  }
}
</script>

<style type="text/css" lang="scss" scoped>
  .item-list {
    display: flex;
    img {
      width: 50px;
      height: 50px;
    }
    .info {
      width: 150px;
    }
    .title {
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .spec {
      width: 120px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
</style>
