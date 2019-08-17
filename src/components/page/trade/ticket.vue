<template>
  <div>
      <div >
          <div style="margin-bottom:10px">
                <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
          </div>
          <div style="margin-bottom:10px">
              <el-date-picker
              v-model="params.created"
              type="datetime"
              placeholder="开始日期">
            </el-date-picker>
        
            <el-date-picker
              v-model="params.createdEnd"
              type="datetime"
              placeholder="结束日期">
            </el-date-picker>

            <el-select v-model="params.status" placeholder="状态">
              <el-option value="Consigned" label="审批成功"></el-option>
              <el-option value="Finished" label="待退货"></el-option>
              <el-option value="Canceled" label="待总部收货"></el-option>
              <el-option value="Waiting" label="退货关闭"></el-option>
              <el-option value="Picked" label="申请退款"></el-option>
              <el-option value="" label="全部"></el-option>
            </el-select>

            <el-input v-model="params.tradeId" style="width:200px" placeholder="订单ID"></el-input>
            <el-input v-model="params.memberId" style="width:200px" placeholder="会员ID"></el-input>
            <el-button @click="search()" type="primary" plain="" icon="el-icon-search">搜索</el-button>
          </div>
      </div>
      <el-table :data="items" style="width: 100%"  border highlight-current-row
        height="600"
        v-loading="indexLoading"
        element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
          <el-table-column show-overflow-tooltip label="单据状态" min-width="100">
              <template slot-scope="scope">
                <span v-if="scope.row.status == 'Created'">待审核</span> 
                <span v-else-if="scope.row.status == 'Consigned'">等待确认</span>
                <span v-else-if="scope.row.status == 'Finished'">已完成</span>
                <span v-else-if="scope.row.status == 'Canceled'">已取消</span>
                <span v-else-if="scope.row.status == 'Waiting'">待取货</span>
                <span v-else-if="scope.row.status == 'Picked'">已取货</span>
                <span v-else>{{scope.row.status}}</span>
              </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="tradeId" label="取货单号"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" prop="pickCode" label="取货码"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip min-width="100" prop="" label="是否校验"></el-table-column> -->
          <el-table-column show-overflow-tooltip min-width="140" prop="memberName" label="会员姓名"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip min-width="100" prop="" label="联系方式"></el-table-column> -->

          <!-- <el-table-column show-overflow-tooltip min-width="100" prop="" label="付款时间"></el-table-column> -->
          <el-table-column show-overflow-tooltip min-width="120" prop="shopName" label="取货门店"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="100" prop="totalNum" label="取货数量"></el-table-column>
          <!-- <el-table-column show-overflow-tooltip min-width="100" prop="" label="取货时间"></el-table-column> -->
          <el-table-column show-overflow-tooltip min-width="150" prop="" label="单据时间">
              <template slot-scope="scope">
                  <span>{{new Date(scope.row.created).toLocaleString()}}</span>
              </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="80" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
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
        <el-button
          size="mini"
          type="danger"
          plain
          @click="confirmReceive()">足额取货</el-button>
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
              <el-table-column show-overflow-tooltip prop="num" label="取货数量"></el-table-column>
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
                page:1,
                tradeId:'',
                memberId:''
            },
            gridData: [],
            dialogTableVisible: false,
            createTableVisible: false,
            loading:true,
            indexLoading:true,
            sendCode:''
        }
    },
    computed:{
    },
    methods:{
      search(){
        this.params.page = 1
        if(typeof(this.params.created) != 'number' && typeof(this.params.created) != 'undefined'){
          this.params.created = this.params.created ? new Date(this.params.created).getTime() : ''
        }


        if(typeof(this.params.createdEnd) != 'number' && typeof(this.params.createdEnd) != 'undefined'){
          this.params.createdEnd = this.params.createdEnd ? new Date(this.params.createdEnd).getTime() : ''
        }
        // this.params.tid = this.searchForm.id
        this.getInfo()
      },
      confirmReceive() {
        let arr = []

        this.gridData.forEach((val,ind)=>{
          arr.push({count:val.num,itemId:val.itemId,skuId:val.skuId})
        })

        this.$confirm('是否确认收货?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          console.log(this.sendCode)
          console.log(arr)
          this.$axios.put(`/api/trade/ticket/${this.sendCode}/pick`,arr).then(res=>{
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
      msgCreateOpen() {
        this.$message({
          message:this.msgCreate,
          type:this.msgType,
          showClose: true
        });
      },
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
        this.$axios.get('/api/trade/all/ticket',{params:this.params}).then(res=>{
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
         console.log(row)
          this.loading = true
          this.dialogTableVisible = true
          this.gridData = []
          this.sendCode = row.pickCode

          this.$axios.get('/api/trade/ticket/'+row.pickCode).then(res=>{
            for(let i of res.data.data.items){
              this.gridData.push(i)
            }
            this.loading = false
            // console.log(res.data.data)
          })
      }
    },
    mounted(){
      // this.params.tid = this.$route.query.routerData
      this.params.tradeId = this.$route.query.routerData
      this.getInfo()
    }
    ,
    watch: {
        '$route'(to, from) {
          this.params.tradeId = to.query.routerData
          this.getInfo()
        }
    }
  }
</script>

<style scoped>
 
</style>
