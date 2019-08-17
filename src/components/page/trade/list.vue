<template>
  <div>
      
      <div>
          <div style="margin-bottom:10px">
            <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
          </div>

          <div style="margin-bottom:10px">
          
            <el-date-picker
              v-model="params.created"
              type="datetime"
              placeholder="开始日期">
            </el-date-picker>
        
            <el-date-picker
              v-model="params.createdEnd"
              type="datetime"
              placeholder="结束日期">
            </el-date-picker>

            <el-select v-model="params.status" placeholder="状态">
              <el-option value="WAIT_PAY" label="待付款"></el-option>
              <el-option value="WAIT_DISPATCH" label="待分配"></el-option>
              <el-option value="WAIT_CONSIGN" label="待发货"></el-option>
              <el-option value="WAIT_RECEIVE" label="待收货"></el-option>
              <el-option value="FINISHED" label="已完成"></el-option>
              <el-option value="TUAN_ING" label="拼团中"></el-option>
              <el-option value="REFUND" label="申请退款"></el-option>
              <el-option value="CLOSE" label="关闭"></el-option>
              <el-option value="" label="全部"></el-option>
            </el-select>

            <el-select v-model="params.option" placeholder="提货方式">
              <el-option value="pickInShop" label="门店自提"></el-option>
              <el-option value="deliveryByHQ" label="总部配送"></el-option>
              <el-option value="" label="全部"></el-option>
            </el-select>

            <el-input v-model="params.id" style="width:200px" placeholder="ID"></el-input>
            <el-input v-model="params.memberId" style="width:200px" placeholder="会员ID"></el-input>
            <el-button @click="search()" type="primary" plain="" icon="el-icon-search">搜索</el-button>
          </div>
      </div>

      <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row
        v-loading="indexLoading"
        element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
          
      <el-table-column show-overflow-tooltip sortable prop="id" label="ID" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="memberNick" label="会员" min-width="140"></el-table-column>
      <el-table-column show-overflow-tooltip prop="memberId" label="会员ID" min-width="140"></el-table-column>
      <!-- <el-table-column show-overflow-tooltip label="商品" min-width="240">
        <template slot-scope="scope">
          <span v-for="order in scope.row.orders" :key="order.id">
            {{order.title+','}}
          </span>
        </template>
      </el-table-column> -->
      <el-table-column show-overflow-tooltip prop="dispatchOption" label="提货方式" min-width="100">
        <template slot-scope="scope">
          <span v-if="scope.row.dispatchOption == 'pickInShop'">门店自提</span> 
          <span v-else-if="scope.row.dispatchOption == 'deliveryByHQ'">总部配送</span>
          <span v-else>{{scope.row.dispatchOption}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="订单状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 'WAIT_PAY'">待付款</span> 
          <span v-else-if="scope.row.status == 'WAIT_DISPATCH'">待分配</span>
          <span v-else-if="scope.row.status == 'WAIT_CONSIGN'">待发货</span>
          <span v-else-if="scope.row.status == 'WAIT_RECEIVE'">待收货</span>
          <span v-else-if="scope.row.status == 'FINISHED'">完成</span>
          <span v-else-if="scope.row.status == 'TUAN_ING'">已付款 拼团中</span>
          <span v-else-if="scope.row.status == 'REFUND'">申请退款</span>
          <span v-else-if="scope.row.status == 'CLOSE'">关闭</span>
          <span v-else>{{scope.row.status}}</span>
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
      <el-table-column show-overflow-tooltip prop="payTime" label="付款时间" min-width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.payTime">{{new Date(scope.row.payTime).toLocaleString()}}</span>
          <span v-else>未付款</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="更新时间" min-width="160">
        <template slot-scope="scope">
          <span v-if="scope.row.modified">{{new Date(scope.row.modified).toLocaleString()}}</span>
          <span v-else></span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip label="收货信息" min-width="220">
        <template slot-scope="scope">
          {{'姓名:'+scope.row.receiverPerson+',地址:'+scope.row.receiverProvince+scope.row.receiverCity+scope.row.receiverArea+scope.row.receiverAddress+',联系电话:'+scope.row.receiverPhone}}
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="buyerMemo" label="备注" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip fixed="right" label="操作" width="155">
        <template slot-scope="scope">
          <el-button type="primary" plain @click="showDetail(scope.$index,scope.row)">详情</el-button>
          <template></template>
          <el-button  :disabled="scope.row.status != 'WAIT_DISPATCH'" type="primary" plain @click="dispatchTask(scope.$index,scope.row)">再分配</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :page-sizes="pageSizes"
        :page-size="pageSizes[0]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>

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
                  <span v-else-if="scope.row.status == 'WAIT_DISPATCH'">待分配</span>
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
  export default {
    data(){
        return {
          items:[],
          total:0,
          shopId:[],
          pageSizes:[10, 20],
          params:{
              size:10,
              page:1,
              id:'',
              memberNick:''
          },
          gridData: [],
          dialogTableVisible: false,
          createTableVisible: false,
          loading:true,
          indexLoading:true,
          msgCreate:'msg',
          msgType:'success',
          searchForm:{}
        }
    },
    computed:{
    },
    methods:{
      search(){
        this.params.page = 1

        if(typeof(this.params.created) != 'number' && typeof(this.params.created) != 'undefined'){
          this.params.created = this.params.created ? new Date(this.params.created).getTime() : ''
        }


        if(typeof(this.params.createdEnd) != 'number' && typeof(this.params.createdEnd) != 'undefined'){
          this.params.createdEnd = this.params.createdEnd ? new Date(this.params.createdEnd).getTime() : ''
        }
       
        this.getInfo()
      },
      msgCreateOpen() {
        this.$message({
          message:this.msgCreate,
          type:this.msgType,
          showClose: true
        });
      },
      refreshData(){
        this.getInfo()
      },
      handleSizeChange(val) {
        this.params.size = val 
        this.params.page = 1
        this.getInfo()
      },
      handleCurrentChange(val) {
        this.params.page = val
        this.getInfo()
      },
      getInfo(){
        this.indexLoading = true
        this.$axios.get('/api/trade',{params:this.params}).then(res=>{
          console.log(res.data.data)
          if(res.data.code == 200){
            this.items = res.data.data.data
            this.total = res.data.data.total
            this.indexLoading = false
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
            this.indexLoading = false
          }
        })
      },
      showDetail(index, row) {
        // console.log(row)
          this.loading = true
          this.dialogTableVisible = true
          this.gridData = []
          this.$axios.get(`/api/trade/${row.id}`).then(res=>{
            for(let i of res.data.data.orders){
              this.gridData.push(i)
            }
            this.loading = false
            // console.log(res.data.data)
          })
      },
      dispatchTask(index,row){
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
    // updated(){
    //   this.params.id = this.$route.query.routerData
    //   this.getInfo()
    // },
    mounted(){
      this.params.id = this.$route.query.routerData
      this.getInfo()
    },
    watch: {
        '$route'(to, from) {
          this.params.id = to.query.routerData
          this.getInfo()
        }
    }
  }
</script>

<style scoped>
 
</style>
