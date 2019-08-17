<template>
  <div>
      <div style="padding-bottom:10px">
        <el-button type="warning" plain="" @click="refreshData()">刷新</el-button>
      </div>
      
      <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row
        v-loading="indexLoading"
        element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
          <el-table-column show-overflow-tooltip label="状态">
              <template slot-scope="scope">
                <span v-if="scope.row.submitStatus == 0">未提交</span> 
                <span v-else-if="scope.row.submitStatus == 1">已提交</span>
               
                <span v-else>{{scope.row.submitStatus}}</span>
              </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="summaryTime" label="每日记录时间">
            <template slot-scope="scope">
              <span>{{new Date(parseInt(scope.row.summaryTime)).toLocaleString()}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="shopManagerName" label="店长"></el-table-column>
          
          <el-table-column show-overflow-tooltip prop="shopName" label="所在门店"></el-table-column>
         
           <!-- <el-table-column show-overflow-tooltip label="门店每日记录">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"

                @click="showDetail(scope.$index, scope.row)">查看</el-button>
            </template>
          </el-table-column> -->

         
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

      <el-dialog title="明细" :visible.sync="dialogTableVisible" class="detailTable"  fullscreen>
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
          <el-table-column show-overflow-tooltip prop="brand" label="性别"></el-table-column>
          <el-table-column show-overflow-tooltip prop="bookCount" label="待发货数量"></el-table-column>
          <el-table-column show-overflow-tooltip prop="" label="收货数(点货数)"></el-table-column>
          <el-table-column show-overflow-tooltip prop="bookCount" label="发货数(点货数)"></el-table-column>
          <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价"></el-table-column>
          <el-table-column show-overflow-tooltip prop="series" label="系列"></el-table-column>
        </el-table>
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
              page:1
          },
          gridData: [],
          dialogTableVisible: false,
          createTableVisible: false,
          loading:true,
          indexLoading:true
      }
    },
    computed:{
    },
    methods:{
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
        this.$axios.get('/api/getDailyWorkSummary',{params:this.params}).then(res=>{
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
          
          this.$axios.get(`/api/getDailySummaryDetail?id=${row.id}`).then(res=>{
            // for(let i of res.data.data.items){
            //   this.gridData.push(i)
            // }
            // this.loading = false
            console.log(res.data.data)
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
