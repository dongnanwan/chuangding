<template>
  <div>
        <div >
            <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
        </div>

        <div style="margin-top:10px;height:30px">

          <div style="float:left">
              <ShopIdInput-app @OnGetDataFromChild='GetShopIdFromChild'></ShopIdInput-app>
          </div>
           
          <div style="float:left">
            <el-button type="primary" plain @click="search()" icon="el-icon-search">搜索</el-button>
          </div>
           
        </div>

      <el-table :data="items" height="600" border highlight-current-row style="width:100%;margin-top:10px;"
        v-loading="indexLoading"
        element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
          <el-table-column prop="status" label="状态" :show-overflow-tooltip="true" min-width="70">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'Verify_Success'" class="success-status">审核成功</span>
              <span v-else-if="scope.row.status == 'Verify_Failure'" class="fail-status">审核失败</span>
              <span v-else>未审核</span>
            </template>
          </el-table-column>
          <el-table-column prop="inferiorCode" label="单号" :show-overflow-tooltip="true"  min-width="170"></el-table-column>
          <el-table-column label="申请门店" min-width="80" prop="shopName">
              <!-- <template slot-scope="scope">
                <ul v-for='item in shopNameOptions' :key="item.id">
                  <li v-if="scope.row.shopId == item.id">{{item.name}}</li>
                </ul>
              </template> -->
          </el-table-column>
          <el-table-column prop="createdByName" label="申请人" :show-overflow-tooltip="true" min-width="80"></el-table-column>
          <el-table-column prop="created" label="申请时间" :show-overflow-tooltip="true" min-width="140">
            <template slot-scope='scope'>
              <span>{{new Date(parseInt(scope.row.created)).toLocaleString()}}</span>
            </template>
          </el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="70" prop="year" label="年份"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="70" prop="season" label="季节"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="70" prop="series" label="类别"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="140" prop="code" label="款号"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="70" prop="color" label="颜色"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="70" prop="size" label="尺码"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="70" prop="applyCount" label="申请数"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="70" prop="tagPrice" label="吊牌总额"></el-table-column>
          <el-table-column :show-overflow-tooltip="true" min-width="150" prop="reason" label="申请原因" ></el-table-column>
          <el-table-column label="申请图片"   min-width="70" show-overflow-tooltip>
            <template slot-scope="scope">
              <img v-if="scope.row.images" :src="'https://img.chuangdingshop.com/' + scope.row.images[0]" :alt="scope.row.title" width="30" height="30" class="am-img-thumbnail">
              <p v-else>暂无图片</p>
            </template>
          </el-table-column>

          <el-table-column  label="审核" width="145" fixed="right">
            <template slot-scope="scope">
              <span v-if="scope.row.status == 'Verify_Success' || scope.row.status == 'Verify_Failure'" >已审核</span>
              <div v-else>
                <el-button
                  size="mini"
                  type="success"
                  @click="checkPass(scope.$index, scope.row)">通过</el-button>
                <el-button
                  size="mini"
                  type="danger"
                  @click="checkReject(scope.$index, scope.row)">拒绝</el-button>
              </div>
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
import ShopIdInput from '../../common/shopInput.vue'
  export default {
    data(){
        return {
            items:[],
            total:0,
            shopId:0,
            pageSizes:[10, 20],
            params:{
                size:10,
                page:1
            },
            shopNameOptions:[],
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
        this.$axios.get('/api/inferior/record',{params:this.params}).then(res=>{
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
      search(){
        this.params.page = 1
        this.params.shopId = this.shopId
        this.getInfo()
      },
      checkPass(a,b){
        this.$axios.put(`/api/inferior/record/${b.inferiorCode}/verify/success`).then((res)=>{
          // console.log(res.data)
          if(res.data.code == 200){
            alert('审核成功')
          
          }else{
            alert(res.data.message)
          }
        })
      },
      checkReject(a,b){
         this.$axios.put(`/api/inferior/record/${b.inferiorCode}/verify/failure`).then((res)=>{
          if(res.data.code == 200){
            alert('已拒绝')
            this.getInfo()
          }else{
            alert(res.data.message)
          }
        })
      },
      GetShopIdFromChild(data){
        this.shopId = data
        // console.log(data)
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
  .success-status{
    color: green
  }
  .fail-status{
    color: red
  }
</style>


