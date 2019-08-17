<template>
    <div>
        <div style="padding-bottom:8px">
          <el-button type="primary" @click="printCheck()" plain  icon="el-icon-printer">每日审核打印</el-button>
        </div>

        <div style="padding-bottom:8px">
          <div style="display:inline-block">
            <shopInput-app  @OnGetDataFromChild='getSendShopIdFromChild'></shopInput-app>
          </div>
          <div style="display:inline-block">
            <shopInput-app  @OnGetDataFromChild='getReciveShopIdFromChild'></shopInput-app>
          </div>

          

          <div style="display:inline-block">
            <el-date-picker
              v-model="searchForm.startTime"
              type="datetime"
              placeholder="开始日期">
            </el-date-picker>
          </div>

          <div style="display:inline-block">
            <el-date-picker
              v-model="searchForm.endTime"
              type="datetime"
              placeholder="结束日期">
            </el-date-picker>
          </div>
          <el-button @click="search" icon="el-icon-search" type="primary" plain="">搜索</el-button>
        </div>

        <div ref="printTable">
          <el-table :data="items" style="width: 100%"  border highlight-current-row
              height="600"
              v-loading="indexLoading"
              element-loading-text="数据加载中......"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              >
              <el-table-column show-overflow-tooltip prop="sender" label="发货方" min-width="80" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="receiver" label="收货方" min-width="80" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip label="日期" min-width="150" align="center">
                <template slot-scope="scope">
                <span>{{new Date(scope.row.created).toLocaleString()}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="orderNo" label="订单号" min-width="80" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="expressName" label="承运单位" min-width="80" align="center"></el-table-column>
              <el-table-column show-overflow-tooltip prop="expressNo" label="物流单号" min-width="80" align="center"></el-table-column>
              
              <el-table-column show-overflow-tooltip  label="公司" align="center">
                <el-table-column show-overflow-tooltip label="到付" prop="companyReceiverPay" min-width="140" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip label="寄付" prop="companySenderPay" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip label="额外费用" prop="companyExtraCharges" min-width="80" align="center"></el-table-column>
              </el-table-column>

              <el-table-column show-overflow-tooltip  label="店铺" align="center">
                <el-table-column show-overflow-tooltip label="到付" prop="storeReceiverPay" min-width="140" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip label="寄付" prop="storeSenderPay" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip label="额外费用" prop="storeExtraCharges" min-width="80" align="center"></el-table-column>
              </el-table-column>

          </el-table>
        </div>
        
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
    </div>
</template>

<script>
import regionSelect from '../../common/regionCustomizeSelect.vue'
import shopInput from '../../common/shopInput.vue'

export default {
    data(){
      return {
        printClass:'#printTest',
        items:[],
        total:0,
        pageSizes:[10, 20,1000],
        params:{
          size:10,
          page:1,
        },
        indexLoading:true,
        msgCreate:'msg',
        msgType:'success',
        searchForm:{}
      }
    },
    components:{
        'regionSelect-app':regionSelect,
        'shopInput-app':shopInput
    },
    methods:{
      printCheck(){
        function myPrint(obj){
          var newWindow=window.open("打印窗口","_blank");//打印窗口要换成页面的url
          var docStr = obj.innerHTML;
          newWindow.document.write(docStr);
          newWindow.document.close();
          newWindow.print();
          newWindow.close();
        }
        myPrint(this.$refs.printTable)
        
      },
      getReciveShopIdFromChild(data){
        this.searchForm.shopIdRecive = data
      },
      getSendShopIdFromChild(data){
        this.searchForm.shopIdSend = data
      },
      getRegionIdFromChild(data){
        this.searchForm.regionId = data
      },
      search(){
        this.params.page = 1
        this.params.startTime = new Date(this.searchForm.startTime).getTime()
        this.params.endTime = new Date(this.searchForm.endTime).getTime()
        this.params.partnerId = this.searchForm.partnerId
        this.params.sender = this.searchForm.shopIdSend
        this.params.shopIdRecive = this.searchForm.shopIdRecive
        if(!this.params.startTime || !this.params.endTime){
          this.msgCreate = '请填写时间'
          this.msgType = 'error'
          this.msgCreateOpen()
        }else{
          this.getInfo()
        }
      },
      refreshData(){
        // this.getInfo()
      },
      msgCreateOpen() {
        this.$message({
          message:this.msgCreate,
          type:this.msgType,
          showClose: true
        });
      },
      handleSizeChange(val) {
        this.params.size = val 
        this.getInfo()
      },
      handleCurrentChange(val) {
        this.params.page = val
        this.getInfo()
      },
      getInfo(){
        this.indexLoading = true
        this.params.cityId = this.searchForm.cityId
        this.params.provinceId = this.searchForm.provinceId
        this.$axios.get('/api/storeLogisticsList/getStoreLogisticsList',{params:this.params}).then(res=>{
          if(res.data.code == 200){
            console.log(res.data.data.data)
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
      }
    },
    mounted(){
      this.indexLoading = false
    }
  }
</script>

<style scoped>
 
</style>

