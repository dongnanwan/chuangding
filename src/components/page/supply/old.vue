<template>
  <div>
      <el-button type="primary" @click="createNew()" plain>创建</el-button>
      <!-- <el-button type="primary" @click="createErpPlan()">生成ERP计划</el-button> -->
      <el-button type="primary" @click="createErpSend()" plain>生成ERP发货单</el-button>
        <el-table :data="items" style="width: 100%"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="verifyStatus" label="状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.verifyStatus == 'Verify_Success'">审核成功</span> 
                <span v-else-if="scope.row.verifyStatus == 'Created'">待审核</span>
                <span v-else-if="scope.row.verifyStatus == 'Verify_Failure'">审核失败</span>
                <span v-else-if="scope.row.verifyStatus == 'Verifying'">审核中</span>
                <span v-else-if="scope.row.verifyStatus == 'Canceled'">已取消</span>
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
          <el-table-column show-overflow-tooltip min-width="80" prop="shopName" label="店铺"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="totalBookCount" label="总件数"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip min-width="80" prop="" label="发货中"></el-table-column> -->
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
          <el-table-column show-overflow-tooltip min-width="100" label="查看明细">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                @click="showDetail(scope.$index, scope.row)">查看明细</el-button>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip min-width="100" prop="" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                @click="submitCheck(scope.$index, scope.row)">提交审核</el-button>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip min-width="150" prop="" label="审核" width="150">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="success"
                @click="checkPass(scope.$index, scope.row)">通过</el-button>

              <el-button
                size="mini"
                type="danger"
                @click="checkReject(scope.$index, scope.row)">拒绝</el-button>
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
            <el-table-column show-overflow-tooltip prop="year" label="年份"></el-table-column>
            <el-table-column show-overflow-tooltip prop="season" label="季节"></el-table-column>
            <el-table-column show-overflow-tooltip prop="secondName" label="类别"></el-table-column>
            <el-table-column show-overflow-tooltip prop="code" label="款号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
            <el-table-column show-overflow-tooltip prop="size" label="尺码"></el-table-column>
            <el-table-column show-overflow-tooltip prop="sex" label="性别"></el-table-column>
            <el-table-column show-overflow-tooltip prop="bookCount" label="数量"></el-table-column>
            <el-table-column show-overflow-tooltip prop="" label="未发货"></el-table-column>
            <el-table-column show-overflow-tooltip prop="" label="发货中"></el-table-column>
            <el-table-column show-overflow-tooltip prop="" label="已发货"></el-table-column>
            <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价"></el-table-column>
            <el-table-column show-overflow-tooltip prop="series" label="系列"></el-table-column>
            <el-table-column show-overflow-tooltip prop="" label="波段"></el-table-column>
            <el-table-column show-overflow-tooltip prop="barcode" label="条形码"></el-table-column>
          </el-table>
        </el-card>
        
      </el-dialog>


       <!-- 创建弹出框 -->

      <el-dialog  :visible.sync="createTableVisible" class="detailTable"  fullscreen>

        <el-card shadow="hover" style="margin-top:10px">
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>单据基本信息</h2>
            </div>
            <el-form ref="form" :model="form" label-width="80px" :inline="false"  class="demo-form-inline">
                <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:12px">选择店铺</p>
                    <div style="float:left;padding-left:12px">
                        <ShopIdInput-app @OnGetShopIdFromChild='GetShopIdFromChild'></ShopIdInput-app>
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

        <el-button type="primary" @click="submitCreate()" plain>创建</el-button>
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
            items:[],
            total:0,
            // shopId:[],
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
            form:{
              shopId: '',
              remark: '',
              counts:[]
            },
            shopNameOptions:[],
            multipleSelection: [],
            skuTableData:[],
            msgCreate:'msg',
            msgType:'success'
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
        this.$axios.get('/api/distribute/all/supply',{params:this.params}).then(res=>{
            this.items = res.data.data.data
            this.total = res.data.data.total
            if(res.data.code){
              this.indexLoading = false
            }
        })
      },
      showDetail(index, row) {
          this.loading = true
          this.dialogTableVisible = true
          this.gridData = []
          
          this.$axios.get('/api/distribute/'+row.code).then(res=>{
            for(let i of res.data.data.items){
              this.gridData.push(i)
            }
            this.loading = false
          })
      },
      submitCheck(a,b){
        this.$axios.put(`/api/distribute/${b.code}/verify`).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = res.data.message
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
            // console.log(res.data)
            if(res.data.code == 200){
              this.msgCreate = res.data.message
              this.msgType = 'success'
              this.msgCreateOpen()
              this.getInfo()
              // this.$axios.put(`/api/distribute/${b.code}/send`).then((res)=>{
              //   console.log('.......................xxxxxxxxxxxx')
              // })
            }else{
              this.msgCreate = res.data.message
              this.msgType = 'error'
              this.getInfo()
              // this.$axios.put(`/api/distribute/${b.code}/send`).then((res)=>{
              //   console.log('.......................yyyyyyyyyyyy')
              // })
            }
          })
      },
      checkReject(a,b){
          this.$axios.put(`/api/distribute/${b.code}/verify/failure?reason='拒绝通过'`).then((res)=>{
            // console.log(res.data)
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
      submitCreate() {
        this.skuTableData.forEach((val,ind)=>{
          this.form.counts.push({count:parseInt(val.count),skuId:val.id,itemId:val.itemId})
        })

        this.$axios.post('/api/distribute/create/supply',this.form).then((res)=>{
          if(res.data.code == 200){
            alert('创建成功')
             this.getInfo()
          }else{
            alert(res.data.message)
          }
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
        this.multipleSelection.forEach((res)=>{
          arr.push(res.code)
        })
        if(arr.length > 0){
          this.$axios.put('/api/distribute/produce/plan?codes='+arr).then((res)=>{
            // console.log(res)
          })
        }
      },
      createErpSend(){
        for(let i of this.multipleSelection){
          

          let counts =  i.items.map((val,ind)=>{
            return {count:val.bookCount,itemId:val.itemId,skuId:val.skuId}
          })

          let SendBody = {counts:counts,remark:i.remark}

          this.$axios.put(`/api/distribute/${i.code}/send`,SendBody).then((res)=>{
            // console.log(res)
          })
        }
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
        console.log('xxxxx')
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
