
<template>
  <div>
      <div style="">
          <div style="margin-bottom:10px">
               <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
          </div>

           <div style="margin-bottom:10px">
              <el-input v-model="params.tradeId" style="width:200px" placeholder="订单号"></el-input>
              <el-input v-model="params.receiverName" style="width:200px" placeholder="客户"></el-input>
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
              <el-option value="Delivery" label="已发货"></el-option>
              <el-option value="Waiting" label="等待"></el-option>
              <el-option value="Cancelled" label="已取消"></el-option>
              <el-option value="Picking" label="点货中"></el-option>
              <el-option value="" label="全部"></el-option>
            </el-select>

            <el-button @click="search()" type="primary" plain="" icon="el-icon-search">搜索</el-button>
          </div>
      </div>
      <el-table
        border
        :data="items"
        style="width: 100%"
        height="600" 
        v-loading="indexLoading"
        element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
      <!-- <el-table-column prop="shopName" label="发货类型" min-width="80"></el-table-column> -->
      <el-table-column show-overflow-tooltip sortable prop="id" label="ID" min-width="140"></el-table-column>
      <el-table-column show-overflow-tooltip prop="status" label="发货状态" min-width="80">
        <template slot-scope="scope">
          <span v-if="scope.row.status == 'Delivery'">已发货</span>
          <span v-else-if="scope.row.status == 'Waiting'">等待</span>
          <span v-else-if="scope.row.status == 'Cancelled'">已取消</span>
          <span v-else-if="scope.row.status == 'Picking'">点货中</span>
          <span v-else>{{scope.row.status}}</span>
        </template>
      </el-table-column>
      <el-table-column show-overflow-tooltip prop="tradeId" label="订单号" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="expressNo" label="快递单号" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="receiverName" label="客户姓名" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="receiverPhone" label="客户电话" min-width="100"></el-table-column>
      <!-- <el-table-column prop="receiverAddress" label="付款时间" min-width="100"></el-table-column> -->
      <el-table-column show-overflow-tooltip prop="receiverAddress" label="收货地址" min-width="100"></el-table-column>
      <el-table-column show-overflow-tooltip prop="shopName" label="发货门店" min-width="80"></el-table-column>

      <el-table-column show-overflow-tooltip prop="totalNum" label="发货数量" min-width="80"></el-table-column>
      <el-table-column  show-overflow-tooltip  label="发货时间" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.modified == null"></span>
          <span v-else>{{new Date(parseInt(scope.row.modified)).toLocaleString()}}</span>
        </template>
      </el-table-column>
      
      <el-table-column show-overflow-tooltip  label="单据时间" min-width="150">
        <template slot-scope="scope">
          <span v-if="scope.row.created == null"></span>
          <span v-else>{{new Date(parseInt(scope.row.created)).toLocaleString()}}</span>
        </template>
      </el-table-column>

      <el-table-column show-overflow-tooltip label="查看" width="245" fixed="right">
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain=""
            @click="showDetail(scope.$index, scope.row)">明细</el-button>
          <el-button
            size="mini"
            type="primary"
            plain=""
            @click="showExpress(scope.$index, scope.row)">物流</el-button>
          <el-button
            size="mini"
            type="primary"
            plain=""
            @click="showTransfer(scope.$index, scope.row)">发货单转让</el-button> 
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

      <el-dialog :visible.sync="dialogTableVisible" class="detailTable"  fullscreen>
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
            <!-- <el-table-column show-overflow-tooltip prop="sendCode" label="调拨单号" fixed></el-table-column> -->
            <el-table-column label="产品图片"  width="70" show-overflow-tooltip>
              <template slot-scope="scope">
                <img v-if="scope.row.mainImg" :src="'https://img.chuangdingshop.com/' + scope.row.mainImg" :alt="scope.row.title" width="60" height="60" class="am-img-thumbnail">
                <p v-else>暂无图片</p>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="year" label="年份"></el-table-column>
            <el-table-column show-overflow-tooltip prop="season" label="季节"></el-table-column>
            <el-table-column show-overflow-tooltip prop="secondName" label="类别"></el-table-column>
            <el-table-column show-overflow-tooltip prop="code" label="款号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
            <el-table-column show-overflow-tooltip prop="size" label="尺码"></el-table-column>
            <el-table-column show-overflow-tooltip prop="sex" label="性别"></el-table-column>
            <el-table-column show-overflow-tooltip prop="num" label="发货数量"></el-table-column>
            <!-- <el-table-column show-overflow-tooltip prop="receiveCount" label="收货数(点货数)"></el-table-column> -->
            <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价"></el-table-column>
            <el-table-column show-overflow-tooltip prop="series" label="系列"></el-table-column>
            <el-table-column show-overflow-tooltip prop="barcode" label="条形码"></el-table-column>
          </el-table>
        </el-card>
      </el-dialog>

       <!-- 物流弹出框 -->
      

       <el-dialog  :visible.sync="expressTableVisible" class="detailTable"  fullscreen >

          <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
              <h2>物流</h2>
            </div>

            <el-table 
              border
              :data="expressTableData"
              v-loading="expressTabaleLoading"
              element-loading-text="数据加载中......"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              >
                <el-table-column show-overflow-tooltip prop="expressNo" label="相关单号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="" label="图片">
                  <template slot-scope="scope">
                    <img v-if="scope.row.expressImage" :src="'https://img.chuangdingshop.com/' + scope.row.expressImage" :alt="scope.row.title" width="25" height="25" class="am-img-thumbnail">
                    <p v-else>暂无图片</p>
                  </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="expressName" label="快递公司"></el-table-column>
                <el-table-column show-overflow-tooltip prop="expressCode" label="快递编码"></el-table-column>
                
              </el-table>
            </el-card>
        </el-dialog>
        <!-- 发货单转让 -->
       <el-dialog  :visible.sync="tansferTableVisible" class="detailTable"  fullscreen >
         
          <el-card >
            <div slot="header" class="clearfix" style="height:25px"> 
              <h2>请选择要转让的店铺</h2>
            </div>
            <div style="height:80px">
              <div style="display:inline-block;position:absolute;" class="inputSize">
                <shopInput-app @OnGetDataFromChild="getShopIdFromChild"></shopInput-app>
              </div>
            </div>
      
          </el-card>
          <el-button type="primary" @click="saveTransfer()" plain="">确认</el-button>
          <el-button @click="tansferTableVisible = false" plain="">取消</el-button>
        </el-dialog>
  </div>
</template>

<script>
import shopInput from "../../common/shopInput.vue"
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
                shopId:0,
                tradeId:''
            },
            gridData: [],
            dialogTableVisible: false,
            createTableVisible: false,
            loading:true.data,
            expressTableData:[],
            expressTabaleLoading:false,
            expressTableVisible:false,
            indexLoading:true,
            msgCreate:'msg',
            msgType:'success',
            tansferTableVisible:false,
            packetIdTransfer:'',
            tradeIdTransfer:'',
            shopIdTransfer:''
        }
    },
    computed:{
    },
    components: {
      "shopInput-app": shopInput
    },
    methods:{
      saveTransfer(){
        this.$axios.put(`/api/trade/packet/${this.packetIdTransfer}/transfer?tradeId=${this.tradeIdTransfer}&shopId=${this.shopIdTransfer}`).then(res=>{
          if(res.data.code == 200){
              this.$message({
                  type: 'success',
                  message:'操作成功'
              });
              this.getInfo()
          }else{
              this.msgCreate = res.data.message
              this.msgType = 'error'
              this.msgCreateOpen()
              this.indexLoading = false
          }
        })
      },
      getShopIdFromChild(data) {
        this.shopIdTransfer = data;
      },
      showTransfer(index,row){
        this.tansferTableVisible = true
        this.packetIdTransfer = row.id
        this.tradeIdTransfer = row.tradeId
      },
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
        this.$axios.get('/api/trade/all/packet',{params:this.params}).then(res=>{
          if(res.data.code == 200){
            console.log(res.data.data)
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
          this.loading = true
          this.dialogTableVisible = true
          this.gridData = []
          
          this.$axios.get(`/api/trade/packet/${row.id}`).then(res=>{
            for(let i of res.data.data.items){
              this.gridData.push(i)
            }
            this.loading = false
            console.log(res.data.data)
          })
      },
      showExpress(index, row){
        this.expressTableData = []
          // this.expressTabaleLoading = true
         
          // this.expressTableData = []
          
          // this.$axios.get('/api/send/'+row.code).then(res=>{
          //   if(typeof(res.data.data.expresses) != 'undefined'){
          //       for(let i of res.data.data.expresses){
          //         this.expressTableData.push(i)
          //       }
          //   }
            
          //   this.expressTabaleLoading = false
            
          // })
          this.expressTableData.push(row)
          this.expressTableVisible = true

          // if(typeof(row.expresses) != 'undefined'){
          //     for(let i of row.expresses){
          //       this.expressTableData.push(i)
          //     }
          //     this.expressTableVisible = true
          // }else{
          //   this.msgCreate = '暂无物流信息'
          //   this.msgType = 'error'
          //   this.msgCreateOpen()
          // }


      },
    },
    mounted(){
      // this.params.tid = this.$route.query.routerData
      this.params.tradeId = this.$route.query.routerData
      this.getInfo()
    },
    watch: {
        '$route'(to, from) {
          this.params.tradeId = to.query.routerData
          this.getInfo()
        }
    }
  }
</script>

<style scoped>
 .aa{
   position: absolute
 }
</style>

