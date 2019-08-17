<template>
  <div>
      <div style="padding-bottom:8px">
        <el-button type="warning" plain="" @click="refreshData()">刷新</el-button>
      </div>
        
        <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row
          v-loading="indexLoading"
          element-loading-text="数据加载中......"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)"
        >
          <el-table-column show-overflow-tooltip min-width="150" prop="transitionState" label="交接状态">
              <template slot-scope="scope">
                  <span v-if='scope.row.transitionState == 1'>已交接</span>
                  <span v-else-if="scope.row.transitionState == 0">未交接</span>
                  <span v-else>{{scope.row.transitionState}}</span>
              </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip min-width="100" prop="handOver" label="交接类型"></el-table-column>

          <el-table-column show-overflow-tooltip min-width="150" label="交接时间">
              <template slot-scope="scope">
                  <span>{{new Date(scope.row.handOverDate).toLocaleString()}}</span>
              </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip min-width="100" prop="shopManagerName" label="交接店长"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="shopName" label="所在门店"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="inventoryCode" label="点数单号"></el-table-column>
          <el-table-column show-overflow-tooltip width="80" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain=""
                @click="showDetail(scope.$index, scope.row)">明细</el-button>
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
              <el-table-column show-overflow-tooltip prop="handProject" label="项目"></el-table-column>
              <el-table-column show-overflow-tooltip prop="serialNum" label="序号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="reviewContent" label="交接内容"></el-table-column>
              <el-table-column show-overflow-tooltip prop="handResult" label="交接结果">
                <template slot-scope="scope">
                  <span v-if="scope.row.handResult == 0"><i style='color:green;font-size:25px' class="el-icon-success"></i></span>
                  <span v-else-if="scope.row.handResult == 1"><i style='color:red;font-size:25px' class="el-icon-error"></i></span>
                  <span v-else></span>
                </template>
              </el-table-column>
              
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
        this.$axios.get('/api/getStoreHandOver',{params:this.params}).then(res=>{
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

          this.$axios.get(`/api/getStoreHandResult?id=${row.id}`).then(res=>{
            for(let i of res.data.data.data){
              this.gridData.push(i)
            }
            this.loading = false
            console.log(res.data.data.data)
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
