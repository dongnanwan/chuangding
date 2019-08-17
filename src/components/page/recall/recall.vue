<template>
  <div>
    <div style="padding-bottom:10px">
      <el-button type="primary" @click="createNew()" plain icon="el-icon-plus">创建</el-button>
      <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
    </div>
      
      <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-table-column show-overflow-tooltip prop="verifyStatus" label="状态" min-width="70">
            <template slot-scope="scope">
                <span v-if="scope.row.verifyStatus == 'Verify_Success'">审核成功</span> 
                <span v-else-if="scope.row.verifyStatus == 'Created'">待审核</span>
                <span v-else-if="scope.row.verifyStatus == 'Canceled'">已取消</span>
                <span v-else-if="scope.row.verifyStatus == 'Verifying'">正在审核</span>
                <span v-else-if="scope.row.verifyStatus == 'Verify_Failure'">审核失败</span>
                <span v-else>{{scope.row.verifyStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="recallType" label="退仓类型" min-width="70">
            <template slot-scope="scope">
                <span v-if="scope.row.recallType == 'Inferior'">次品退仓</span> 
                <span v-else>普通退仓</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="transitStatus" label="单据状态" min-width="70">
              <template slot-scope="scope">
                <span v-if="scope.row.transitStatus == 'Wait_Receive'">等待接收</span> 
                <span v-else-if="scope.row.transitStatus == 'Wait_Consign'">等待确认</span>
                <span v-else-if="scope.row.transitStatus == 'Finished'">已完成</span>
                <span v-else-if="scope.row.transitStatus == 'Received'">等待收货</span>
                <span v-else>{{scope.row.transitStatus}}</span>
              </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip label="是否已生成erp" min-width="70">
             <template slot-scope="scope">
                <span v-if="scope.row.recalled == true">是</span> 
                <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" prop="code" label="退仓单号"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="120" prop="shopName" label="退仓门店"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="120" prop="remark" label="备注"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="70" prop="totalRecallCount" label="发货数"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="70" prop="totalRecallAmount" label="退货吊牌总额"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="difference" label="是否有差异">
            <template slot-scope="scope">
              <span v-if="scope.row.difference == false">否</span>
              <span v-else>是</span>
            </template>
          </el-table-column>
          
           <el-table-column show-overflow-tooltip  label="单据时间" min-width="160">
            <template slot-scope="scope">
              <span>{{new Date(parseInt(scope.row.created)).toLocaleString()}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip  label="发货时间" min-width="160">
            <template slot-scope="scope">
              <span>{{new Date(parseInt(scope.row.modified)).toLocaleString()}}</span>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip min-width="70" prop="totalReceiveCount" label="收货数(点货数)"></el-table-column>

         

          <!-- <el-table-column show-overflow-tooltip prop="" label="审核" min-width="210">
            <template slot-scope="scope">
               <el-button
                size="mini"
                type="warning"
                 plain=""
                @click="submitCheck(scope.$index, scope.row)">提交</el-button>
              <el-button
                size="mini"
                type="success"
                 plain=""
                @click="checkPass(scope.$index, scope.row)">通过</el-button>

              <el-button
                size="mini"
                type="danger"
                 plain=""
                @click="checkReject(scope.$index, scope.row)">拒绝</el-button>
            </template>
          </el-table-column> -->

          <el-table-column show-overflow-tooltip fixed="right" label="操作" width="340">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                 plain=""
                @click="submitCheck(scope.$index, scope.row)">提交审核</el-button>
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
                @click="createErpRecall(scope.$index, scope.row)">生成退货单</el-button>
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

      <el-dialog  :visible.sync="dialogTableVisible"   fullscreen >
        <el-button
                size="mini"
                type="danger"
                plain
                @click="confirmReceive()">足额退仓</el-button>
        <el-card shadow="hover">
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
                <el-table-column show-overflow-tooltip prop="year" label="年份"></el-table-column>
                <el-table-column show-overflow-tooltip prop="season" label="季节"></el-table-column>
                <el-table-column show-overflow-tooltip prop="secondName" label="类别"></el-table-column>
                <el-table-column show-overflow-tooltip prop="code" label="款号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
                <el-table-column show-overflow-tooltip prop="size" label="尺码"></el-table-column>
                <!-- <el-table-column show-overflow-tooltip prop="sex" label="性别"></el-table-column> -->

                <!-- <el-table-column show-overflow-tooltip prop="" label="系统库存"></el-table-column> -->

                <el-table-column show-overflow-tooltip prop="recallCount" label="发货数(点货数)"></el-table-column>
                <el-table-column show-overflow-tooltip prop="receiveCount" label="收货数(点货数)"></el-table-column>

                <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价"></el-table-column>
                <el-table-column show-overflow-tooltip prop="series" label="系列"></el-table-column>
                <!-- <el-table-column show-overflow-tooltip prop="" label="波段"></el-table-column> -->
                <el-table-column show-overflow-tooltip prop="barcode" label="条形码"></el-table-column>
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
            <el-table-column show-overflow-tooltip prop="stockCount" label="发货数量"></el-table-column>
            <el-table-column show-overflow-tooltip prop="checkCount" label="收货数(点货数)"></el-table-column>
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
      </el-dialog>

       <!-- 物流弹出框 -->

       <el-dialog  :visible.sync="expressTableVisible"   fullscreen >
         <el-card shadow="hover">
              <div slot="header" class="clearfix" style="height:25px"> 
                  <h2>物流信息</h2>
              </div>
              <el-table 
                  border
                  :data="expressTableData"
                  v-loading="expressTabaleLoading"
                  element-loading-text="数据加载中......"
                  element-loading-spinner="el-icon-loading"
                  element-loading-background="rgba(0, 0, 0, 0.8)"
              >
                <!-- <el-table-column show-overflow-tooltip prop="" label="相关单号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="" label="快递单号"></el-table-column>
                <el-table-column show-overflow-tooltip prop="" label="应付方"></el-table-column>
                <el-table-column show-overflow-tooltip prop="" label="实付方"></el-table-column>
                <el-table-column show-overflow-tooltip prop="" label="运费"></el-table-column>
                <el-table-column show-overflow-tooltip prop="" label="日期"></el-table-column>
                <el-table-column show-overflow-tooltip prop="" label="快递单附件"></el-table-column>

                <el-table-column show-overflow-tooltip prop="" label="单据时间"></el-table-column> -->

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


       <!-- 创建弹出框 -->

      <el-dialog title="" :visible.sync="createTableVisible" class="detailTable"  fullscreen >
          <el-card shadow="hover">
              <div slot="header" class="clearfix" style="height:25px"> 
                  <h2>单据基本信息</h2>
              </div>

              <el-form ref="form" :model="form" label-width="80px" :inline="false"  class="demo-form-inline">

                  <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:12px">选择店铺</p>
                    <div style="float:left;padding-left:12px">
                        <ShopIdInput-app @OnGetDataFromChild='GetShopIdFromChild'></ShopIdInput-app>
                    </div>
                  </div>
                
                  
                  <el-form-item label="总件数" style="width:295px">
                    <el-input  :value="totalNumber" disabled=""></el-input>
                  </el-form-item>
                

                  <el-form-item label="吊牌总额" style="width:295px">
                    <el-input  :value="totalTagPrice" disabled=""></el-input>
                  </el-form-item>
                

                  <el-form-item  label="退仓类型">
                        <el-select v-model="form.type" placeholder="请选择类型">
                          <el-option value="Common" label="普通退仓"></el-option>
                          <el-option value="Inferior" label="次品退仓"></el-option>
                        </el-select>
                  </el-form-item>
                  
                  <el-form-item label="备注" style="width:295px">
                    <el-input type="textarea" v-model="form.remark"></el-input>
                  </el-form-item>
              </el-form>
          </el-card>  

          <el-card shadow="hover" style="margin-top:10px">
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>单据行信息</h2>
            </div>

            <div>
                <SkuInput-app @onInsertSkuData='insertSkuData'></SkuInput-app>  
                <el-table border :data="skuTableData">
                      <el-table-column prop="year" label="年份"> </el-table-column>
                      <el-table-column prop="season" label="季节"> </el-table-column>
                      <el-table-column prop="brandName" label="品牌"> </el-table-column>
                      <el-table-column prop="name" label="sku名称"> </el-table-column>
                      <el-table-column prop="stock" label="库存"> </el-table-column>
                      <el-table-column prop="tagPrice" label="吊牌价"> </el-table-column>
                      <el-table-column label="数量">
                          <template slot-scope="scope">
                              <el-input v-model="scope.row.count" placeholder="请输入数量"></el-input>
                          </template>  
                      </el-table-column>

                      <el-table-column label="操作" min-width="80">
                        <template slot-scope="scope">
                            <el-button type="danger" @click="deleteRowInfo(scope.$index)">删除</el-button>
                        </template>  
                      </el-table-column>
                  </el-table>
              </div>
          </el-card>

          <el-button type="primary" @click="submitCreate()" plain>创建</el-button>
          <el-button type="primary" @click="closeCreateTable()" plain>取消</el-button>
                
          
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
  import ShopIdInput from '../../common/shopInputUnrelative.vue'
  import SkuInputVue from '../../common/SkuInput.vue';
  export default {
    data(){
        return {
            items:[],
            total:0,
            // shopId:[],
            pageSizes:[10, 20],
            params:{
                size:10,
                page:1
            },
            gridData: [],
            skuTableData:[],
            expressTableData:[],
            dialogTableVisible: false,
            createTableVisible: false,
            expressTableVisible:false,
            loading:true,
            indexLoading:true,
            expressTabaleLoading:true,
            form:{
              shopId: '',
              remark: '',
              counts:[],
              type:'Common'
            },
            shopNameOptions:[],
            multipleSelection: [],
            msgCreate:'msg',
            msgType:'success',
            differenceData:[],
            handleTableVisible:false,
            handleForm:{
              responsiblePerson:'',
              responsibleAmount:0,
              remark:'',
              differenceType:'OTHERS'
            },
            handleCode:'',
            handleSkuId:''
        }
    },
    components:{
      'SkuInput-app':SkuInputVue,
      'ShopIdInput-app':ShopIdInput
    },
    computed:{
        totalNumber(){
          let num = 0
          if(this.skuTableData){
              this.skuTableData.forEach((val,ind)=>{
                num += (parseInt(val.count) || 0)
              })
          }
          return num 
        },
        totalTagPrice(){
          let num = 0
          if(this.skuTableData){
              this.skuTableData.forEach((val,ind)=>{
                num += (parseInt(val.count) || 0) * (val.tagPrice)
              })
          }
          return num 
        }
    },
    methods:{
      confirmReceive() {
        let arr = []

        this.gridData.forEach((val,ind)=>{
          arr.push({count:val.recallCount,itemId:val.itemId,skuId:val.skuId})
        })

        this.$confirm('是否确认退仓?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$axios.put(`/api/recall/${this.handleCode}/consign`,arr).then(res=>{
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
               
        });
      },
      doHandle(){
        this.$axios.put(`/api/recall/${this.handleCode}/deal?skuIds=${[this.handleSkuId]}&responsiblePerson=${this.handleForm.responsiblePerson}&responsibleAmount=${this.handleForm.responsibleAmount}&remark=${this.handleForm.remark}&differenceType=${this.handleForm.differenceType}`).then(res=>{
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
        console.log(row)
        this.handleSkuId = row.skuId
        this.handleTableVisible = true
      },
      refreshData(){
        this.getInfo()
      },
      deleteRowInfo(index){
        this.skuTableData.splice(index,1)
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
        this.$axios.get('/api/recall/',{params:this.params}).then(res=>{
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
        this.$axios.get('/api/recall/'+row.code).then(res=>{
          console.log(res)
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
          
          this.$axios.get('/api/recall/'+row.code).then(res=>{
            for(let i of res.data.data.expresses){
              this.expressTableData.push(i)
            }
            this.expressTabaleLoading = false
          })
      },
      submitCheck(a,b){
        this.$axios.put(`/api/recall/${b.code}/submitToVerify`).then((res)=>{
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
          this.$axios.put(`/api/recall/${b.code}/verify/success`).then((res)=>{
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
      checkReject(a,b){
          this.$axios.put(`/api/recall/${b.code}/verify/failure?reason='拒绝通过'`).then((res)=>{
            // console.log(res.data)
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
      createNew(){
        this.createTableVisible = true
        this.$axios.get('/api/shop').then((res)=>{
          this.shopNameOptions = res.data.data.data
        })
      },
      submitCreate() {
        this.skuTableData.forEach((val,ind)=>{
          this.form.counts.push({count:parseInt(val.count),skuId:val.id,itemId:val.itemId})
        })

        this.$axios.post('/api/recall/create',this.form).then((res)=>{
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
      addDetailInfo(){
        this.form.counts.push({})
      },
      closeCreateTable(){
        this.createTableVisible = false
      },
    //   createErpSend(){
    //       this.$axios.put(`/api/recall/${i.code}/send`,SendBody).then((res)=>{
    //         console.log(res)
    //       })
    //   },
      createErpRecall(a,b){
          this.$axios.put(`/api/recall/${b.code}/send`).then((res)=>{
              // console.log(res.data)
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      //触发自定义事件的方法
      insertSkuData(data){

          function unique(array){     
                var allArr = [];   
                for(var i=0;i<array.length;i++){
                      var flag = true;
                　    for(var j=0;j<allArr.length;j++){
                      if(array[i].id == allArr[j].id){
                　　　　　   flag = false;
                　　    };
                };
                if(flag){
                　　allArr.push(array[i]);
                };
          };
            return allArr;
          }　　

          let arr = this.skuTableData
          
          data.forEach((value,index)=>{
            arr.push(value)
          })

          this.skuTableData = unique(arr)

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
 .tableRowInfo{
   border: 1px solid #eee;
   padding: 10px;
 }
 .rowInfoP{
   font-size: 20px;
   padding-bottom: 20px;
   font-weight: bolder
 }
</style>
