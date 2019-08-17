<template>
  <div>
      
      <div style="height:40px">
          <div style="float:left">
            <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
            <div style="margin:10px 0">
            <div style="float:left">
              <ShopIdInputx-app @OnGetDataFromChild='GetShopIdFromChildSearch'></ShopIdInputx-app>
            </div>
            
            <el-button type="primary"  plain="" @click="searchIndex()" icon="el-icon-search">搜索</el-button>
          </div>
          </div>

          
      </div>

      <el-table :data="items" style="width: 100%"  border highlight-current-row
        v-loading="indexLoading"
        element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        height="600"
      >
        <el-table-column show-overflow-tooltip min-width="180" prop="originalUnique" label="来源单号"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" label="单据状态" >
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'Created'">新创建</span> 
                <span v-else-if="scope.row.status == 'Consigned'">已发货</span>
                <span v-else-if="scope.row.status == 'Finished'">已完成</span>
                <span v-else-if="scope.row.status == 'Cancelled'">已取消</span>
                <span v-else-if="scope.row.status == 'Picked'">备货中</span>
                <span v-else-if="scope.row.status == 'Received'">已收货</span>
                <span v-else>{{scope.row.status}}</span>
              </template>
          </el-table-column>
         
          <el-table-column show-overflow-tooltip min-width="180" prop="code" label="单号"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="120" prop="sender" label="发货方"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="120" prop="receiver" label="收货方"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="totalConsignCount" label="发货数"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="totalReceiveCount" label="收货数"></el-table-column>
          <el-table-column show-overflow-tooltip  label="发货时间" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.consignTime == null"></span>
              <span v-else>{{new Date(parseInt(scope.row.consignTime)).toLocaleString()}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip  label="收货时间" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.receiveTime == null"></span>
              <span v-else>{{new Date(parseInt(scope.row.receiveTime)).toLocaleString()}}</span>
            </template>
          </el-table-column>
         
          <el-table-column show-overflow-tooltip min-width="80" prop="remark" label="备注"></el-table-column>
          
          <el-table-column show-overflow-tooltip min-width="180" prop="receiverAddress" label="收货地址"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="120" prop="receiverTel" label="联系方式"></el-table-column>
        
          <el-table-column show-overflow-tooltip  label="单据时间" min-width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.createdOn == null"></span>
              <span v-else>{{new Date(parseInt(scope.row.createdOn)).toLocaleString()}}</span>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip label="操作" width="140" fixed="right">
            <template slot-scope="scope">
              <!-- <el-button
                size="mini"
                type="primary"
                plain
                @click="cancelThis(scope.$index, scope.row)">取消</el-button> -->
              <el-button
                size="mini"
                type="primary"
                plain
                @click="showDetail(scope.$index, scope.row)">明细</el-button>
              
              <el-button
                size="mini"
                type="primary"
                plain
                @click="showExpress(scope.$index, scope.row)">物流</el-button>
             
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
         <el-button
                size="mini"
                type="danger"
                plain
                @click="confirmReceive()">足额收货</el-button>
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
            <el-table-column show-overflow-tooltip prop="year" label="年份"></el-table-column>
            <el-table-column show-overflow-tooltip prop="season" label="季节"></el-table-column>
            <el-table-column show-overflow-tooltip prop="secondName" label="类别"></el-table-column>
            <el-table-column show-overflow-tooltip prop="code" label="款号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
            <el-table-column show-overflow-tooltip prop="size" label="尺码"></el-table-column>
            <el-table-column show-overflow-tooltip prop="sex" label="性别"></el-table-column>
            <el-table-column show-overflow-tooltip prop="consignCount" label="预计发货数"></el-table-column>
            <el-table-column show-overflow-tooltip prop="realConsignCount" label="点货数"></el-table-column>
            <el-table-column show-overflow-tooltip prop="receiveCount" label="收货数(点货数)"></el-table-column>
            <el-table-column show-overflow-tooltip  label="差异数">
              <template slot-scope="scope">
                {{scope.row.consignCount-scope.row.receiveCount}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价"></el-table-column>
            <el-table-column show-overflow-tooltip prop="series" label="系列"></el-table-column>
          </el-table>
        </el-card>
      <!-- 差异 -->
        <el-card style="margin-top:10px">
          <div slot="header" class="clearfix" style="height:25px">
            <h2>收货差异以及处理结果</h2>
          </div>

          <el-table 
              border
              :data="differenceData"
              v-loading="loading"
              element-loading-text="数据加载中......"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <!-- <el-table-column show-overflow-tooltip prop="sendCode" label="调拨单号" fixed></el-table-column> -->
            <el-table-column show-overflow-tooltip prop="year" label="年份"></el-table-column>
            <el-table-column show-overflow-tooltip prop="season" label="季节"></el-table-column>
            <el-table-column show-overflow-tooltip prop="secondName" label="类别"></el-table-column>
            <el-table-column show-overflow-tooltip prop="code" label="款号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
            <el-table-column show-overflow-tooltip prop="size" label="尺码"></el-table-column>
            <!-- <el-table-column show-overflow-tooltip prop="sex" label="性别"></el-table-column> -->
            <el-table-column show-overflow-tooltip prop="consignCount" label="发货数量"></el-table-column>
            <el-table-column show-overflow-tooltip prop="receiveCount" label="收货数(点货数)"></el-table-column>
            <el-table-column show-overflow-tooltip  label="差异数">
              <template slot-scope="scope">
                {{scope.row.consignCount-scope.row.receiveCount}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价"></el-table-column>
            <el-table-column show-overflow-tooltip prop="" label="吊牌差异总额">
              <template slot-scope="scope">
                {{(scope.row.consignCount-scope.row.receiveCount)*scope.row.tagPrice}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="responsiblePerson" label="责任方"></el-table-column>
            <el-table-column show-overflow-tooltip prop="responsibleAmount" label="责任金额"></el-table-column>
            <el-table-column show-overflow-tooltip prop="" label="责任说明"></el-table-column>
            <el-table-column show-overflow-tooltip prop="" label="是否已处理">
              <template slot-scope="scope">
                <span v-if="scope.row.deal == false">否</span>
                <span v-else-if="scope.row.deal == true">是</span>
                <span v-else>?</span>
              </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="操作" width="210" fixed="right">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  type="primary"
                  plain
                  :disabled="scope.row.deal == true"
                  @click="showHandle(scope.$index, scope.row)">差异处理</el-button>
              </template>
            </el-table-column>
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
                <el-table-column show-overflow-tooltip prop="originalCode" label="相关单号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="expressNo" label="快递单号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="shouldPayer" label="应付方"></el-table-column>
                <el-table-column show-overflow-tooltip prop="realPayer" label="实付方"></el-table-column>
                <el-table-column show-overflow-tooltip prop="postFee" label="运费"></el-table-column>
                <el-table-column show-overflow-tooltip  label="单据时间" min-width="150">
                  <template slot-scope="scope">
                    <span v-if="scope.row.created == null"></span>
                    <span v-else>{{new Date(parseInt(scope.row.created)).toLocaleString()}}</span>
                  </template>
                </el-table-column>
              </el-table>
            
          
            </el-card>

        </el-dialog>

        <!-- 差异处理 -->
      

      <el-dialog  :visible.sync="handleTableVisible" class="detailTable"  fullscreen >

        <el-card>
          <div slot="header" class="clearfix" style="height:25px"> 
            <h2>差异处理</h2>
          </div>

          <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
            <el-form-item label="责任方">
              <el-input v-model="form.responsiblePerson"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="责任金额">
              <el-input v-model="form.responsibleAmount"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="责任原因">
              <el-select v-model="form.differenceType">
                <el-option label="漏收" value="FORGET"></el-option>
                <el-option label="丢失" value="LOST"></el-option>
                <el-option label="其他" value="OTHERS"></el-option>
              </el-select>
            </el-form-item>
            <br>
            <el-form-item label="责任说明">
              <el-input v-model="form.remark"></el-input>
            </el-form-item>
          </el-form>

        </el-card>
        <el-button @click="doHandle" type="primary">确认</el-button>
      </el-dialog>
       

  </div>
</template>

<script>
  import ShopIdInput from '../../common/ShopIdButton.vue'
  import ShopIdInputx from '../../common/shopInput.vue'
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
          original:'Allocate'
        },
        gridData: [],
        differenceData:[],
        expressTableData:[],
        dialogTableVisible: false,
        createTableVisible: false,
        expressTabaleLoading:false,
        expressTableVisible:false,
        indexLoading:true,
        loading:true,
        searchDataIndex:{
            shopId:''
        },
        sendCode:'',
        handleTableVisible:false,
        form:{
          responsiblePerson:'',
          responsibleAmount:0,
          remark:'',
          differenceType:'OTHERS'
        },
        handleCode:'',
        handleSkuId:''
      }
    },
    computed:{
    },
    components:{
      
      'ShopIdInput-app':ShopIdInput,
      'ShopIdInputx-app':ShopIdInputx
    },
    methods:{
      doHandle(){
        this.$axios.put(`/api/send/${this.handleCode}/deal?skuIds=${[this.handleSkuId]}&responsiblePerson=${this.form.responsiblePerson}&responsibleAmount=${this.form.responsibleAmount}&remark=${this.form.remark}&differenceType=${this.form.differenceType}`).then(res=>{
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
      },
      showHandle(index,row){
        console.log(row)
        this.handleSkuId = row.skuId
        this.handleTableVisible = true
      },
      confirmReceive() {
        let arr = []
        console.log(this.gridData)
        this.gridData.forEach((val,ind)=>{
          arr.push({count:val.realConsignCount,itemId:val.itemId,skuId:val.skuId})
        })
        // console.log(arr)
        this.$confirm('是否确认收货?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // console.log(123)
          this.$axios.put(`/api/send/${this.sendCode}/receive/byAdmin`,arr).then(res=>{
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
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      searchIndex(){
        this.params.receiver = this.searchDataIndex.shopId
        
        this.getInfo()
      },
       GetShopIdFromChildSearch(data){
        this.searchDataIndex.shopId = data
      },
      msgCreateOpen() {
          this.$message({
              message:this.msgCreate,
              type:this.msgType,
              showClose: true
          });
      },
      cancelThis(index,row){
        console.log(row)
        this.$axios.put(`/api/distribute/${row.originalUnique}/send/cancel?sendCode=${row.code}`).then(res=>{
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
      },
      refreshData(){
        this.params.receiver = ''
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
        this.$axios.get('/api/send/all',{params:this.params}).then(res=>{
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
        console.log(row)
        this.handleCode = row.code
        this.loading = true
        this.dialogTableVisible = true
        this.gridData = []
        this.differenceData = []
        this.sendCode = row.code
        this.$axios.get('/api/send/'+row.code).then(res=>{
          for(let i of res.data.data.items){
            this.gridData.push(i)
          }
          for(let j of res.data.data.differenceItems){
            this.differenceData.push(j)
          }
          this.loading = false
        })
      },
      showExpress(index, row){
          this.expressTabaleLoading = true
          this.expressTableVisible = true
          this.expressTableData = []
          this.$axios.get('/api/send/'+row.code).then(res=>{
            if(res.data.data.consignExpress != null){
               this.expressTableData.push(res.data.data.consignExpress)
            }
           
            this.expressTabaleLoading = false
          })
      },
    },
    mounted(){
       this.getInfo()
    }
  }
</script>

<style scoped>
 
</style>



