<template>
  <div>
      <div style="height:40px">
          <div style="float:left">
                <el-button type="warning" plain="" @click="refreshData()">刷新</el-button>
          </div>
      </div>
      <el-table height="600" :data="items" style="width: 100%"  border highlight-current-row
        v-loading="indexLoading"
        element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column show-overflow-tooltip prop="tradeId" label="相关订单ID" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="payment" label="订单金额" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="inviter" label="邀请人" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="inviterProfit" label="邀请人分润" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="managerName" label="金牌店长" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="managerProfit" label="金牌店长分润" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="partnerName" label="合伙人" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="partnerProfit" label="合伙人分润" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip  label="单据时间" min-width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.createdOn == null">未完成</span>
                <span v-else>{{new Date(parseInt(scope.row.createdOn)).toLocaleString()}}</span>
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
  </div>
</template>

<script>
  export default {
    data(){
      return {
        items:[],
        total:0,
        pageSizes:[10, 20],
        params:{
            size:10,
            page:1
        },
        indexLoading:true,
        msgCreate:'msg',
        msgType:'success',
      }
    },
    methods:{
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
        this.$axios.get('/api/trade/profits',{params:this.params}).then(res=>{
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
      }
    },
    mounted(){
      this.getInfo()
    }
  }
</script>

<style scoped>
 
</style>

