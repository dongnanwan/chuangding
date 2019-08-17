<template>
  <div>
      <el-table :data="items" style="width: 100%"  border highlight-current-row>
          <!-- <el-table-column show-overflow-tooltip label="单据状态" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'Created'">待审核</span> 
                <span v-else-if="scope.row.status == 'Consigned'">等待确认</span>
                <span v-else-if="scope.row.status == 'Finished'">已完成</span>
                <span v-else-if="scope.row.status == 'Cancelled'">已经取消</span>
                <span v-else-if="scope.row.status == 'Waiting'">等待中</span>
                <span v-else>{{scope.row.status}}</span>
              </template>
          </el-table-column> -->
          
          <el-table-column show-overflow-tooltip min-width="150" prop="" label="开始时间">
              <template slot-scope="scope">
                  <span>{{new Date(scope.row.created).toLocaleString()}}</span>
              </template>
          </el-table-column>
          
          <el-table-column show-overflow-tooltip min-width="150" prop="" label="结束时间">
              <template slot-scope="scope">
                  <span>{{new Date(scope.row.created).toLocaleString()}}</span>
              </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="" label="销售数量"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" prop="payment" label="实销金额"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="120" prop="" label="分润金额"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="" label="公司分成"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="" label="金牌店长分成"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="120" prop="" label="老板分成"></el-table-column>
         
        
          <el-table-column show-overflow-tooltip min-width="120" label="查看明细">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="info"
                @click="showDetail(scope.$index, scope.row)">查看明细</el-button>
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
         
              <el-table-column show-overflow-tooltip prop="year" label="年份"></el-table-column>
              <el-table-column show-overflow-tooltip prop="season" label="季节"></el-table-column>
              <el-table-column show-overflow-tooltip prop="secondName" label="类别"></el-table-column>
              <el-table-column show-overflow-tooltip prop="code" label="款号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
              <el-table-column show-overflow-tooltip prop="size" label="尺码"></el-table-column>
              <el-table-column show-overflow-tooltip prop="sex" label="性别"></el-table-column>
              <el-table-column show-overflow-tooltip prop="num" label="待取货数量"></el-table-column>
              <el-table-column show-overflow-tooltip prop="" label="取货数(点货数)"></el-table-column>
              <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价"></el-table-column>
              <el-table-column show-overflow-tooltip prop="series" label="系列"></el-table-column>
            </el-table>
        </el-card>
        
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
            loading:true
        }
    },
    computed:{
    },
    methods:{
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
        this.$axios.get('/api/settlement/list',{params:this.params}).then(res=>{
            this.items = res.data.data.data
            this.total = res.data.data.total
            console.log(res.data)
        })
      },
       showDetail(index, row) {
          this.loading = true
          this.dialogTableVisible = true
          this.gridData = []

          this.$axios.get(`/api/trade/${row.tradeId}/profit`).then(res=>{
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
