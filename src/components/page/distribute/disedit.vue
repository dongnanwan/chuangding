<template>
  <div>
      <div style="height:40px">
        <div style="float:left">
          <el-button type="primary" plain @click="createNew()">创建</el-button>
          <el-button type="primary" plain @click="createErpPlan()">生成ERP计划</el-button>
          <el-button type="warning" plain="" @click="refreshData()">刷新</el-button>
        </div>
      </div>
      
     
      <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            @selection-change="handleSelectionChangeIndexTable"
            >
          <el-table-column type="selection" width="55"></el-table-column>
         
          <el-table-column show-overflow-tooltip prop="verifyStatus" label="状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.verifyStatus == 'Verify_Success'">审核成功</span> 
                <span v-else-if="scope.row.verifyStatus == 'Created'">待审核</span>
                <span v-else-if="scope.row.verifyStatus == 'Verify_Failure'">审核失败</span>
                <span v-else-if="scope.row.verifyStatus == 'Verifying'">审核中</span>
                <span v-else>{{scope.row.verifyStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="transitStatus" label="发货状态">
              <template slot-scope="scope">
                <span v-if="scope.row.transitStatus == 'Wait_Receive'">等待接收</span> 
                <span v-else-if="scope.row.transitStatus == 'Wait_Consign'">等待确认</span>
                <span v-else-if="scope.row.transitStatus == 'Finished'">已完成</span>
                <span v-else>{{scope.row.transitStatus}}</span>
              </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" label="是否已生成erp计划">
             <template slot-scope="scope">
                <span v-if="scope.row.produced == true">是</span> 
                <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" prop="code" label="单号"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="120" prop="shopName" label="店铺"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="totalBookCount" label="总件数"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="totalConsignCount" label="已发货"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="totalBookAmount" label="吊牌总额"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="120" prop="remark" label="备注"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="createByName" label="创建人"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="150"  label="创建时间" >
            <template slot-scope="scope">
              <span v-if="scope.row.createdOn == null"></span>
              <span v-else>{{new Date(parseInt(scope.row.createdOn)).toLocaleString()}}</span>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip width="210"   label="审核">
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
          </el-table-column>

          <el-table-column show-overflow-tooltip width="265" fixed="right"  label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="editData(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                @click="showDetail(scope.$index, scope.row)">明细</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                @click="showErpSender(scope.$index, scope.row)">生成Erp发货单</el-button>  
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

      <el-dialog  :visible.sync="dialogTableVisible" class="detailTable"   fullscreen>
        <el-card>
          <div slot="header" class="clearfix" style="height:25px"> 
            <h2 v-if="!isERP">明细</h2>
            <h2 v-if="isERP">请勾选要发货的sku并选择要发货数量</h2>
          </div>
          

          <el-table 
              border
              :data="gridData"
              v-loading="loading"
              element-loading-text="数据加载中......"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" min-width="50" v-if="isERP"></el-table-column>
            <el-table-column show-overflow-tooltip label="本次发货数" min-width="130" v-if="isERP">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.thisSendNumber"  controls-position="right"  :min="0" :max="scope.row.bookCount-scope.row.consignCount"></el-input-number>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="year" label="年份"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="season" label="季节"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="secondName" label="类别"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="code" label="款号"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="color" label="颜色"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="size" label="尺码"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="sex" label="性别"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="bookCount" label="数量"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="" label="未发货">
              <template slot-scope="scope" >
                {{scope.row.bookCount - scope.row.consignCount}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="consignCount" label="已发货"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="tagPrice" label="吊牌价"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="series" label="系列"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="" label="波段"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="barcode" label="条形码"></el-table-column>
          </el-table>
        </el-card>
        <el-button v-if="isERP" type="primary" plain @click="createErpSend()">生成ERP发货单</el-button>
        <el-button type="primary" @click="dialogTableVisible = false" plain>取消</el-button>
      </el-dialog>

 <!-- 创建弹出框 -->

      <el-dialog  :visible.sync="createTableVisible" class="detailTable"  fullscreen>

        <el-card shadow="hover" style="margin-top:10px">
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>{{createTableTitle}}</h2>
            </div>
            <el-form ref="form" :model="form" label-width="80px" :inline="false"  class="demo-form-inline">
                <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:12px">选择店铺</p>
                    <div style="float:left;padding-left:12px">
                        <ShopIdInput-app @OnGetShopIdFromChild='GetShopIdFromChild' :shopNameProp='updataShopName'></ShopIdInput-app>
                    </div>
                </div>

                <el-form-item label="总件数" style="width:295px">
                  <el-input  :value="totalNumber" disabled=""></el-input>
                </el-form-item>


                <el-form-item label="吊牌总额" style="width:295px">
                  <el-input  :value="totalTagPrice" disabled=""></el-input>
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

              <SkuInput-app @onInsertSkuData='insertSkuData'></SkuInput-app> 

              <el-table border :data="skuTableData">
                  <el-table-column prop="year" label="年份" min-width="80"> </el-table-column>
                  <el-table-column prop="season" label="季节" min-width="80"> </el-table-column>
                  <el-table-column prop="brandName" label="品牌" min-width="80"> </el-table-column>
                  <el-table-column prop="name" label="sku名称" min-width="80"> </el-table-column>
                  <el-table-column prop="stock" label="库存" min-width="80"> </el-table-column>
                  <el-table-column prop="tagPrice" label="吊牌价" min-width="80"> </el-table-column>

                  <el-table-column label="数量" min-width="80">
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
            
        </el-card>  

        <el-button v-if="isCreate" type="primary" @click="submitCreate()" plain>创建</el-button>
        <el-button v-if='!isCreate' type="primary" @click="submitEdit()" plain>修改</el-button>
        <el-button type="primary" @click="closeCreateTable()" plain>取消</el-button>
      </el-dialog>

  </div>
</template>

<script>
  import ShopIdInput from '../../common/ShopIdInput.vue'
  import SkuInputVue from '../../common/SkuInput.vue';
  export default {
    data(){
        return {
          isCreate:true,
          createTableTitle:'',
          isERP:false,
          items:[],
          total:0,
          shopId:[],
          pageSizes:[10, 20],
          params:{
              size:10,
              page:1
          },
          gridData: [],
          dialogTableVisible: false,
          createTableVisible: false,
          loading:true,
          indexLoading:true,
          form: {
            shopId: '',
            remark: '',
            counts:[]
          },
          shopNameOptions:[],
          multipleSelection: [],
          multipleSelectionIndexTable:[],
          skuTableData:[],
          remark:'',
          sendCode:'',
          msgCreate:'msg',
          msgType:'success',
          updateData:{},
          updataShopName:'',
          editCode:''
        }
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
    components:{
      'SkuInput-app':SkuInputVue,
      'ShopIdInput-app':ShopIdInput
    },
    methods:{
      submitEdit(){
        
        this.skuTableData.forEach((val,ind)=>{
          this.form.counts.push({count:parseInt(val.count),skuId:val.id,itemId:val.itemId})
        })

        this.$axios.post(`/api/distribute/${this.editCode}/modify`,this.form).then((res)=>{
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
      editData(index,row){
        this.loading = true
        this.createTableTitle = '修改'
        this.createTableVisible = true
        this.isCreate = false
        this.editCode = row.code
        this.$axios.get('/api/distribute/'+row.code).then(res=>{
          console.log(res.data.data)
          // for(let i of res.data.data.items){
          //   i.thisSendNumber = i.bookCount - i.consignCount
          //   this.gridData.push(i)
          // }
          // this.loading = false
          
          this.updataShopName = res.data.data.shopName
          this.form.remark = res.data.data.remark
          this.form.shopId = res.data.data.shopId
          this.form.counts = res.data.data.items
          this.skuTableData = res.data.data.items
          this.skuTableData.forEach((val,ind)=>{
            val.count = val.bookCount
            val.brandName = val.brand
          })
          this.loading = false
        })
      },
        createNew(){
          
        this.createTableTitle = '创建'
        this.createTableVisible = true
        this.isCreate = true
        this.form = {
            shopId: '',
            remark: '',
            counts:[]
          }
        this.skuTableData = []
        this.$axios.get('/api/shop').then((res)=>{
          this.shopNameOptions = res.data.data.data
        })
      },
      refreshData(){
        this.getInfo()
      },
      msgCreateOpen() {
        this.$message({
          message:this.msgCreate,
          type:this.msgType,
          showClose: true
        });
      },
      deleteRowInfo(index){
          this.skuTableData.splice(index,1)
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
        this.$axios.get('/api/distribute/all/distribute',{params:this.params}).then(res=>{
          console.log(res)
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
      showErpSender(index,row){
        this.isERP = true
        this.loading = true
        this.dialogTableVisible = true
        this.gridData = []
        
        this.$axios.get('/api/distribute/'+row.code).then(res=>{
          for(let i of res.data.data.items){
            i.thisSendNumber = i.bookCount - i.consignCount
            this.gridData.push(i)
          }
          this.loading = false
          this.remark = res.data.data.remark 
          this.sendCode = res.data.data.code
          
        })
      },
      showDetail(index, row) {
          this.isERP = false
          this.loading = true
          this.dialogTableVisible = true
          this.gridData = []
          
          this.$axios.get('/api/distribute/'+row.code).then(res=>{
            console.log(res)
            for(let i of res.data.data.items){
              i.thisSendNumber = i.bookCount - i.consignCount
              this.gridData.push(i)
            }
            this.loading = false
            this.remark = res.data.data.remark 
            this.sendCode = res.data.data.code
            
          })
      },
      submitCheck(a,b){
        this.$axios.put(`/api/distribute/${b.code}/verify`).then((res)=>{
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
          this.$axios.put(`/api/distribute/${b.code}/verify/failure?reason='拒绝通过'`).then((res)=>{
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
      submitCreate() {
        this.skuTableData.forEach((val,ind)=>{
          this.form.counts.push({count:parseInt(val.count),skuId:val.id,itemId:val.itemId})
        })
        this.$axios.post('/api/distribute/create/distribute',this.form).then((res)=>{
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
          // console.log(res)
        })
      },
      addDetailInfo(){
        this.form.counts.push({})
      },
      closeCreateTable(){
        this.createTableVisible = false
      },
      createErpPlan(){
        let arr = []
        this.multipleSelectionIndexTable.forEach((res)=>{
          arr.push(res.code)
        })
        if(arr.length > 0){
          this.$axios.put('/api/distribute/produce/plan?codes='+arr).then((res)=>{
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
        }else{
          this.msgCreate = '请选择一个或多个铺货单'
          this.msgType = 'error'
          this.msgCreateOpen()
        }
      },
      createErpSend(){
        if(this.multipleSelection.length  == 0){
          this.msgCreate = '请至少选择一个sku商品'
          this.msgType = 'error'
          this.msgCreateOpen()
        }else{
          let counts =  this.multipleSelection.map((val,ind)=>{
              return {count:val.thisSendNumber,itemId:val.itemId,skuId:val.skuId}
          })
          var SendBody = {counts:counts,remark:this.remark}
  
          this.$axios.put(`/api/distribute/${this.sendCode}/send`,SendBody).then((res)=>{
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
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSelectionChangeIndexTable(val){
        this.multipleSelectionIndexTable = val;
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
