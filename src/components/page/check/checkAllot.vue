<template>
  <div>
    <div style="height:40px">
      <!-- <el-button type="primary" @click="createNew()" plain>创建</el-button> -->
      <el-button type="primary" plain="" @click="refreshData()" icon='el-icon-refresh'>刷新</el-button>
    </div>

      

      <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row
        v-loading="indexLoading"
        element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
          <el-table-column show-overflow-tooltip prop="verifyStatus" label="状态" min-width="80">
            <template slot-scope="scope">
              <span v-if="scope.row.verifyStatus == 'Verify_Success'">审核成功</span> 
                <span v-else-if="scope.row.verifyStatus == 'Created'">待审核</span>
                <span v-else-if="scope.row.verifyStatus == 'Verifying'">审核中</span>
                <span v-else-if="scope.row.verifyStatus == 'Verify_Failure'">审核失败</span>
                <span v-else>{{scope.row.verifyStatus}}
              </span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="code" label="调拨单号" min-width="180"></el-table-column>
          <el-table-column show-overflow-tooltip prop="sender" label="发货方" min-width="120"></el-table-column>
          <el-table-column show-overflow-tooltip prop="remark" label="备注" min-width="150"></el-table-column>
          <el-table-column show-overflow-tooltip prop="receiver" label="收货方" min-width="80"></el-table-column>
          <el-table-column show-overflow-tooltip prop="receiverAddress" label="收货地址" min-width="150"></el-table-column>
          <el-table-column show-overflow-tooltip prop="receiverTel" label="联系方式" min-width="110"></el-table-column>
          

          <el-table-column show-overflow-tooltip fixed="right" label="操作" width="260">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="showDetail(scope.$index, scope.row)">明细</el-button>
              <el-button
                size="mini"
                type="success"
                plain=""
                @click="checkPass(scope.$index, scope.row)">通过审核</el-button>
              <el-button
                size="mini"
                type="danger"
                plain=""
                @click="checkReject(scope.$index, scope.row)">拒绝审核</el-button>
                
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
        <el-card shadow="hover">
          <div slot="header" class="clearfix" style="height:25px"> 
              <h2>明细</h2>
          </div>
          <el-table 
              border
              :data="gridData"
              :span-method="objectSpanMethod"
              v-loading="loading"
              element-loading-text="数据加载中......"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column show-overflow-tooltip prop="allocateCode" label="调拨单号" fixed></el-table-column>
            <el-table-column show-overflow-tooltip prop="transitStatus" label="产品图片"></el-table-column>
            <el-table-column show-overflow-tooltip prop="year" label="年份"></el-table-column>
            <el-table-column show-overflow-tooltip prop="season" label="季节"></el-table-column>
            <el-table-column show-overflow-tooltip prop="secondName" label="类别"></el-table-column>
            <el-table-column show-overflow-tooltip prop="code" label="款号"></el-table-column>
            <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
            <el-table-column show-overflow-tooltip prop="size" label="尺码"></el-table-column>
            <el-table-column show-overflow-tooltip prop="brand" label="性别"></el-table-column>
            <el-table-column show-overflow-tooltip prop="bookCount" label="发货数量"></el-table-column>
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
                    <p style="float:left;line-height:30px;padding-left:12px">发货店铺</p>
                    <div style="float:left;padding-left:12px">
                        <ShopIdInput-app @OnGetShopIdFromChild='GetSenderFromChild'></ShopIdInput-app>
                    </div>
                </div>

                <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:12px">收货店铺</p>
                    <div style="float:left;padding-left:12px">
                        <ShopIdInput-app @OnGetShopIdFromChild='GetReceiverFromChild'></ShopIdInput-app>
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
  import ShopIdInput from '../../common/ShopIdInput.vue';
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
                page:1,
                verifyStatus:'Verifying'
            },
            gridData: [],
            dialogTableVisible: false,
            createTableVisible: false,
            loading:true,
            form: {
              sender: '',
              receiver: '',
              remark: '',
              skuCounts:[]
            },
            shopNameOptions:[],
            multipleSelection: [],
            skuTableData:[],
            msgCreate:'msg',
            msgType:'success',
            indexLoading:true
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
      refreshData(){
        this.getInfo()
      },
      deleteRowInfo(index){
        this.skuTableData.splice(index,1)
      },
      objectSpanMethod({ row, column, rowIndex, columnIndex }) {
        // console.log(this. gridData.length)
        if (columnIndex === 0) {
          if (rowIndex  === 0) {
            return {
              rowspan: this. gridData.length,
              colspan: 1
            };
          } else {
            return {
              rowspan: 0,
              colspan: 0
            };
          }
        }
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
        this.$axios.get('/api/allocate',{params:this.params}).then(res=>{
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
          this.loading = true
          this.dialogTableVisible = true
          this.gridData = []
          
          this.$axios.get('/api/allocate/'+row.code).then(res=>{
            for(let i of res.data.data.items){
              this.gridData.push(i)
            }
            this.loading = false
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
          this.form.skuCounts.push({count:parseInt(val.count),skuId:val.id,itemId:val.itemId})
        })
        this.$axios.post('/api/allocate/create',this.form).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            this.createTableVisible = false
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
        })
      },
      closeCreateTable(){
        this.createTableVisible = false
      },
      submitCheck(a,b){
        this.$axios.put(`/api/allocate/${b.code}/submit`).then((res)=>{
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
        this.$axios.put(`/api/allocate/${b.code}/verify/success`).then((res)=>{
          // if(res.data.code == 200){
          //   alert('审核成功')
          //   this.getInfo()
          //   this.$axios.put(`/api/allocate/${b.code}/send`).then((res)=>{
          //     console.log('.......................xxxxxxxxxxxx')
          //   })
          // }else{
          //   alert(res.data.message)
          //   this.getInfo()
          //   this.$axios.put(`/api/allocate/${b.code}/send`).then((res)=>{
          //     console.log('.......................yyyyyyyyyyyy')
          //   })
          // }
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
        this.$axios.put(`/api/allocate/${b.code}/verify/failure?denyReason='拒绝通过'`).then((res)=>{
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
      GetReceiverFromChild(data){
        this.form.receiver = data
      },
      GetSenderFromChild(data){
        this.form.sender = data
      },
      createSender(index,row){
        this.$axios.put(`/api/allocate/${row.code}/send`).then((res)=>{
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
      msgCreateOpen() {
        this.$message({
          message:this.msgCreate,
          type:this.msgType,
          showClose: true
        });
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
