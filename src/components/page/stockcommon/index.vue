<template>
  <div>
        <div style="margin-bottom:10px">
            <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
            <el-button type="primary" plain @click="dataFit()" icon="el-icon-upload">数据同步</el-button>
        </div>
        
        <div style="margin-bottom:10px">
          <div style="display:inline-block">
            <ShopIdInput-app @OnGetDataFromChild='GetShopIdFromChild'></ShopIdInput-app>
          </div>
          <div style="display:inline-block">
            <el-input v-model="params.code" placeholder="款号" @keyup.native="getInfo" style="width:250px"></el-input>
          </div>
          <el-input v-model="params.year" placeholder="年份"  style="width:250px"></el-input>
          <el-input v-model="params.part" placeholder="波段" style="width:250px"></el-input>
          <el-select v-model="params.series" placeholder="系列">
              <el-option value="5" label="森系"></el-option>
              <el-option value="10" label="时尚"></el-option>
              <el-option value="8" label="可爱"></el-option>
              <el-option value="11" label="简欧"></el-option>
              <el-option value="12" label="快时尚"></el-option>
              <el-option value="9" label="其他"></el-option>
              <el-option value="" label="全部"></el-option>
          </el-select>
          <el-select v-model="params.sex" placeholder="性别">
              <el-option value="男" label="男"></el-option>
              <el-option value="女" label="女"></el-option>
              <el-option value="中性" label="中性"></el-option>
              <el-option value="" label="全部"></el-option>
          </el-select>
          <el-select v-model="params.season" placeholder="季节" @change="getInfo">
              <el-option
                v-for="item in seasonList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
          </el-select>
          <div style="display:inline-block">
              <el-button type="primary" plain @click="search()" icon="el-icon-search">搜索</el-button>
          </div>
        
        </div>

      <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row 
        show-summary=""
        v-loading="indexLoading"
        element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column show-overflow-tooltip prop="shopName" label="门店名称" min-width="120"></el-table-column>
        <el-table-column show-overflow-tooltip label="年份" min-width="80">
           <template slot-scope="scope">
              <span>{{scope.row.year}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="season" label="季节" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="secondCategory" label="类别" min-width="120"></el-table-column>
        <el-table-column show-overflow-tooltip prop="code" label="款号" min-width="130"></el-table-column>
        <el-table-column show-overflow-tooltip prop="color" label="颜色" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip  label="尺寸" min-width="80">
          <template slot-scope="scope">
              <span>{{scope.row.size}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="inStorage" label="门店库存" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="inTravel" label="在途库存" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="sex" label="性别" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="series" label="系列" min-width="80"></el-table-column>
        <!-- <el-table-column show-overflow-tooltip prop="skuid" label="波段" min-width="80"></el-table-column> -->
        <el-table-column show-overflow-tooltip  label="条码" min-width="120">
          <template slot-scope="scope">
              <span>{{scope.row.barcode}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="操作" fixed="right"  width="80">
            <template slot-scope="scope">
                <el-button @click="history(scope.$index,scope.row)" type='primary' plain>流水</el-button>
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

      <!-- 流水弹出框 -->
      <el-dialog  :visible.sync="historyTableVisible" class="detailTable" fullscreen>
        <el-card shadow="hover" style="margin-top:10px">
          <div slot="header" class="clearfix" style="height:25px"> 
            <h2>流水信息</h2>
          </div>

          <el-table 
              border
              :data="historyData"
              v-loading="historyTableLoading"
              element-loading-text="数据加载中......"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column show-overflow-tooltip  label="类型" fixed>
                <template slot-scope="scope">
                  <span v-if="scope.row.storageChange >= 0">入库</span> 
                  <span v-else>出库</span>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="skuName" label="SKU"></el-table-column>
            <el-table-column show-overflow-tooltip prop="storageChange" label="数量"></el-table-column>
            <el-table-column show-overflow-tooltip prop="changeReason" label="来源业务"></el-table-column>
            <el-table-column show-overflow-tooltip label="单据时间">
              <template slot-scope="scope">  
                  <span>{{new Date(parseInt(scope.row.created)).toLocaleString()}}</span> 
              </template>
            </el-table-column> 
          </el-table>

          <div class="block">
            <el-pagination
              @size-change="handleSizeChangeHistory"
              @current-change="handleCurrentChangeHistory"
              :page-sizes="pageSizesHistory"
              :page-size="pageSizesHistory[0]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="totalHistory">
            </el-pagination>
          </div>
        </el-card>
      </el-dialog>
  </div>
</template>

<script>
  import ShopIdInput from '../../common/shopInput.vue'
  export default {
    data(){
      return {
        seasonList:[
            {value:'春',label:'春'},
            {value:'夏',label:'夏'},
            {value:'秋',label:'秋'},
            {value:'冬',label:'冬'},
            {value:'',label:'全部'}
        ],
        items:[],
        total:0,
        totalHistory:0,
        shopId:0,
        pageSizes:[10, 20,1000],
        pageSizesHistory:[10, 20],
        params:{
            size:10,
            page:1
        },
        paramsHistory:{
            size:10,
            page:1
        },
        shopNameOptions:[],
        historyTableVisible:false,
        historyData:[],
        historyTableLoading:true,
        msgCreate:'msg',
        msgType:'success',
        indexLoading:true
      }
    },
    components:{
      'ShopIdInput-app':ShopIdInput
    },
    computed:{
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
      handleSizeChangeHistory(val) {
        this.paramsHistory.size = val 
        this.getHistoryInfo()
      },
      handleCurrentChangeHistory(val) {
        this.paramsHistory.page = val
        this.getHistoryInfo()
      },
      getInfo(){
        this.indexLoading = true
        this.$axios.get('/api/stock/all',{params:this.params}).then(res=>{
          if(res.data.code == 200){
            // console.log(res.data.data)
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
      getHistoryInfo(){
        this.$axios.get('/api/stock/history',{params:this.paramsHistory}).then(res=>{
          this.historyData = res.data.data.data
          this.totalHistory = res.data.data.total
          // console.log(this.historyData)
          this.historyTableLoading = false
          // console.log(res)
        })
      },
      search(){
        this.params.page = 1
        this.params.shopId = this.shopId
        this.getInfo()
      },
      GetShopIdFromChild(data){
        // console.log(123)
        this.shopId = data
        console.log(this.params)
        // console.log(data)
      },
      history(index,row){
        // console.log(row)
        this.historyTableVisible = true
        this.paramsHistory.shopId = row.shopId
        this.paramsHistory.itemId = row.itemId
        this.paramsHistory.skuId = row.skuId
        this.getHistoryInfo()
      },
      dataFit(){
        this.loading = true
        this.$axios.post(`/api/stock/fit`).then(res=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            this.loading = false
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
            this.loading = false
          }
        })
      }
    },
    mounted(){
       this.getInfo()
       this.$axios.get('/api/shop').then((res)=>{
         this.shopNameOptions = res.data.data.data
       })
    },
    beforeRouteLeave(to, from, next) {
          // 设置下一个路由的 meta
        to.meta.keepAlive = true;  // 让 A 缓存，即不刷新
        from.meta.keepAlive = true;
        next();
    }
  }
</script>

<style scoped>
 
</style>

