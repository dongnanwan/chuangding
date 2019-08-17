<template>
  <div>
      <div style="padding-bottom:8px"> 
        <el-button type="primary" @click="createNew()" plain icon='el-icon-plus'>创建</el-button>
        <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>  
      </div>

      <div style="padding-bottom:8px"> 
        <!-- <div style="float:left">
            <el-date-picker
                v-model="params.createdOn"
                type="datetime"
                placeholder="开始日期">
            </el-date-picker>
        </div> -->

        <!-- <div style="float:left">
            <el-date-picker
                v-model="params.endTime"
                type="datetime"
                placeholder="结束日期">
            </el-date-picker>
        </div> -->

        <el-input placeholder="单号" v-model="params.code" class="searchInput"></el-input>

        <div style="display:inline-block" class="searchInput">
          <shopInput-app :fatherData='fatherList' @OnGetDataFromChild="getShopIdFromChild"></shopInput-app>
        </div>
        

        <el-select v-model="params.difference" placeholder="是否有差异">
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>

        <el-select v-model="params.dealt" placeholder="是否已处理">
          <el-option label="是" :value="true"></el-option>
          <el-option label="否" :value="false"></el-option>
        </el-select>
        <el-button type='primary' plain="" @click="search()" icon="el-icon-search">搜索</el-button>
      </div>
      
      <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
         
          <el-table-column show-overflow-tooltip prop="status" label="状态" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.status == 'Verify_Success'">审批成功</span> 
                <span v-else-if="scope.row.status == 'Created'">未审批</span>
                <span v-else-if="scope.row.status == 'Closed'">审批取消</span>
                <span v-else-if="scope.row.status == 'Checked'">已审批</span>
                <span v-else>{{scope.row.status}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="160" prop="code" label="盘存单号"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="shopName" label="盘存店铺"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="createdName" label="盘点人"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" label="盘存时间" width="150">
            <template slot-scope="scope">
              <span v-if="scope.row.checkTime == null">还未盘存</span>
              <span v-else>{{new Date(parseInt(scope.row.checkTime)).toLocaleString()}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="totalStockCount" label="库存数"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="totalCheckCount" label="盘点数(点货数)"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="difference" label="是否有差异">
            <template slot-scope="scope">
              <span v-if="scope.row.difference == false">否</span>
              <span v-else>是</span>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip min-width="100" label="是否已处理">
            <template slot-scope="scope">
              <span v-if="scope.row.dealt == false">否</span>
              <span v-else>是</span>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip min-width="100" label="单据时间" width="150">
            <template slot-scope="scope">
              <span>{{new Date(parseInt(scope.row.created)).toLocaleString()}}</span>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip fixed="right" width="170" prop="" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain=""
                @click="showDetail(scope.$index, scope.row)">明细</el-button>
              <el-button
                size="mini"
                type="warning"
                plain=""
                @click="deleteOne(scope.$index, scope.row)">取消审批</el-button>
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

      
      <el-dialog  :visible.sync="dialogTableVisible" class="detailTable"  fullscreen>
         <!-- 差异 -->
        <el-card>
          <div slot="header" class="clearfix" style="height:25px">
            <h2>收货差异以及处理结果</h2>
          </div>
          <el-button @click="multiHandle()" type="primary" plain="">批量处理</el-button>
          <el-table 
              border
              :data="differenceData"
              v-loading="loading"
              element-loading-text="数据加载中......"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <!-- <el-table-column show-overflow-tooltip prop="sendCode" label="调拨单号" fixed></el-table-column> -->
            <el-table-column show-overflow-tooltip prop="year" label="年份"></el-table-column>
            <el-table-column show-overflow-tooltip prop="season" label="季节"></el-table-column>
            <el-table-column show-overflow-tooltip prop="secondName" label="类别"></el-table-column>
            <el-table-column show-overflow-tooltip prop="code" label="款号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
            <el-table-column show-overflow-tooltip prop="size" label="尺码"></el-table-column>
            <!-- <el-table-column show-overflow-tooltip prop="sex" label="性别"></el-table-column> -->
            <el-table-column show-overflow-tooltip prop="stockCount" label="库存数"></el-table-column>
            <el-table-column show-overflow-tooltip prop="checkCount" label="盘点数"></el-table-column>
            <el-table-column show-overflow-tooltip  label="差异数">
              <template slot-scope="scope">
                 {{scope.row.checkCount - scope.row.stockCount}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价"></el-table-column>
            <el-table-column show-overflow-tooltip prop="" label="吊牌差异总额">
              <template slot-scope="scope">
                {{scope.row.checkCount - (scope.row.stockCount)*scope.row.tagPrice}}
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
        <!-- 明细弹出框 -->
        <el-card style="margin-top:10px">
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
              <el-table-column show-overflow-tooltip prop="inventoryCode" label="盘存单号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="year" label="年份"></el-table-column>
              <el-table-column show-overflow-tooltip prop="season" label="季节"></el-table-column>
              <el-table-column show-overflow-tooltip prop="secondName" label="类别"></el-table-column>
              <el-table-column show-overflow-tooltip prop="code" label="款号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
              <el-table-column show-overflow-tooltip prop="size" label="尺码"></el-table-column>
              <el-table-column show-overflow-tooltip prop="stockCount" label="库存数"></el-table-column>
              <el-table-column show-overflow-tooltip prop="checkCount" label="盘点数(点货数)"></el-table-column>
              <el-table-column show-overflow-tooltip prop="" label="差异数">
                <template slot-scope="scope">
                  {{scope.row.checkCount - scope.row.stockCount}}
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价"></el-table-column>
              <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌总额"></el-table-column>
              <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌差异总额"></el-table-column>
              <el-table-column show-overflow-tooltip prop="series" label="系列"></el-table-column>
              <el-table-column show-overflow-tooltip prop="" label="波段"></el-table-column>
              <el-table-column show-overflow-tooltip prop="barcode" label="条形码"></el-table-column>
            </el-table>
          </el-card>
      </el-dialog>

       <!-- 创建弹出框 -->

      <el-dialog  :visible.sync="createTableVisible" class="detailTable"  fullscreen>
          <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
              <h2>创建</h2>
            </div>
            <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
                  <ShopIdInput-app @OnGetShopIdFromChild='GetShopIdFromChild'></ShopIdInput-app>
                  <br>

                  <el-form-item>
                    <el-select v-model="form.type" placeholder="请选择类型">
                      <el-option value="Daily_Inventory" label="每日盘存"></el-option>
                      <el-option value="HQ_Inventory" label="定期盘存"></el-option>
                    </el-select>
                  </el-form-item>
                  <br>
            </el-form>
          </el-card>
          <el-button type="primary" @click="submitCreateNew">创建</el-button>
          <el-button @click="closeCreateTable()">取消</el-button>
      </el-dialog>

      <!-- 差异处理 -->
      

      <el-dialog  :visible.sync="handleTableVisible" class="detailTable"  fullscreen >

        <el-card>
          <div slot="header" class="clearfix" style="height:25px"> 
            <h2>差异处理</h2>
          </div>

          <el-form ref="form" :model="handleForm" label-width="80px" :inline="true"  class="demo-form-inline">
            <el-form-item label="责任方">
              <el-input v-model="handleForm.responsiblePerson"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="责任金额">
              <el-input v-model="handleForm.responsibleAmount"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="责任原因">
              <el-select v-model="handleForm.differenceType">
                <el-option label="漏收" value="FORGET"></el-option>
                <el-option label="丢失" value="LOST"></el-option>
                <el-option label="店长丢失" value="MANAGER_LOST"></el-option>
                <el-option label="其他" value="OTHERS"></el-option>
              </el-select>
            </el-form-item>
            <br>
            <el-form-item label="责任说明">
              <el-input v-model="handleForm.remark"></el-input>
            </el-form-item>
          </el-form>

        </el-card>
        <el-button @click="doHandle" type="primary">确认</el-button>
      </el-dialog>


  </div>
</template>

<script>
import ShopIdInput from '../../common/ShopIdInput.vue'
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
              shopId:0
          },
          gridData: [],
          differenceData:[],
          dialogTableVisible: false,
          createTableVisible: false,
          loading:true,
          indexLoading:true,
          form: {
            shopId: '',
            type: ''
          },
          shopNameOptions:[],
          multipleSelection: [],
          msgCreate:'msg',
          msgType:'success',
          handleTableVisible:false,
          handleForm:{
            responsiblePerson:'',
            responsibleAmount:0,
            remark:'',
            differenceType:'OTHERS'
          },
          handleCode:'',
          handleSkuId:[],
          fatherList:{
              provinceId:0,
              regionId:0,
              cityId:0
          },
          multipleSelection:[]
        }
    },
    components:{
      "shopInput-app": shopInput
    },
    computed:{
      status(){
        return 123
      }
    },
    methods:{
      multiHandle(){
        this.handleTableVisible = true
        this.multipleSelection.forEach((val,ind)=>{
          this.handleSkuId.push(val.skuId)
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      getShopIdFromChild(data) {
        this.params.shopId = data;
      },
      search(){
        this.params.page = 1
        this.getInfo()
      },
      doHandle(){
        this.$axios.put(`/api/inventory/${this.handleCode}/deal?skuIds=${this.handleSkuId}&responsiblePerson=${this.handleForm.responsiblePerson}&responsibleAmount=${this.handleForm.responsibleAmount}&remark=${this.handleForm.remark}&differenceType=${this.handleForm.differenceType}`).then(res=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            this.dialogTableVisible = false
            this.handleTableVisible = false
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
        })
      },
      showHandle(index,row){
        this.handleSkuId = [row.skuId]
        this.handleTableVisible = true
      },
      refreshData(){
        this.getInfo()
      },
      //消息++++
      msgCreateOpen() {
        this.$message({
          message:this.msgCreate,
          type:this.msgType,
          showClose: true
        });
      },
      //----
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
        this.$axios.get('/api/inventory',{params:this.params}).then(res=>{
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
          this.handleCode = row.code
          this.loading = true
          this.dialogTableVisible = true
          this.gridData = []
          this.differenceData = []
          
          this.$axios.get('/api/inventory/'+row.code).then(res=>{
            for(let i of res.data.data.items){
              this.gridData.push(i)
            }
            for(let j of res.data.data.differenceItems){
              this.differenceData.push(j)
            }
            this.loading = false
            console.log(res.data)
          })
      },
      deleteOne(a,b){
        this.$axios.put(`/api/inventory/${b.code}/cancel`).then((res)=>{
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
      checkPass(a,b){
          this.$axios.put(`/api/distribute/${b.code}/verify/success`).then((res)=>{
            if(res.data.code == 200){
              alert('审核成功')
              this.getInfo()

            }else{
              alert(res.data.message)
              this.getInfo()

            }
          })
      },
      checkReject(a,b){
          this.$axios.put(`/api/distribute/${b.code}/verify/failure?reason='拒绝通过'`).then((res)=>{
            if(res.data.code == 200){
              alert('已拒绝')
              this.getInfo()
            }else{
              alert(res.data.message)
            }
          })
      },
       createNew(){
        this.createTableVisible = true
        this.$axios.get('/api/shop').then((res)=>{
          this.shopNameOptions = res.data.data.data
        })
      },
      submitCreateNew() {
         console.log(this.form)
         this.$axios.post(`/api/inventory/create?shopId=${this.form.shopId}&type=${this.form.type}`).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = res.data.message
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            setTimeout(function(){
               this.createTableVisible = false
            },2000)
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
        })
      },
      addDetailInfo(){
        this.form.counts.push({})
      },
      closeCreateTable(){
        this.createTableVisible = false
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      GetShopIdFromChild(data){
        this.form.shopId = data
      }
    },
    mounted(){
      this.getInfo()
    }
  }
</script>

<style scoped>
 .searchInput{
   width:200px;
 }
</style>

