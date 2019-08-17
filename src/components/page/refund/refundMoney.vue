<template>
  <div>
      <div>
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

           

            <el-select v-model="params.type" placeholder="退款方式">
              <el-option value="GoodsToHQ" label="退货到总部"></el-option>
              <el-option value="Money" label="仅退款"></el-option>
              <el-option value="GoodsToShop" label="退货到门店"></el-option>
              <el-option value="" label="全部"></el-option>
            </el-select>

            <el-input v-model="params.tid" style="width:200px" placeholder="订单ID"></el-input>
            <el-input v-model="params.memberId" style="width:200px" placeholder="会员ID"></el-input>
            <el-button @click="search()" type="primary" plain="" icon="el-icon-search">搜索</el-button>
          </div>
      </div>

      <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
         
          <el-table-column show-overflow-tooltip prop="status" label="状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.status == 'FINISHED'">交易完成</span>
                <span v-else-if="scope.row.status == 'WAIT_MONEY'">等待退款</span>
                <span v-else-if="scope.row.status == 'WAIT_CONSIGN'">待退货</span>
                <span v-else-if="scope.row.status == 'WAIT_RECEIVE'">待总部收货</span>
                <span v-else-if="scope.row.status == 'CLOSE'">退货关闭</span>
                <span v-else-if="scope.row.status == 'APPLY'">申请退款</span>
                <span v-else-if="scope.row.status == 'REFUSE'">已拒绝</span>
                <span v-else>{{scope.row.status}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="80" show-overflow-tooltip prop="id" label="ID" ></el-table-column>
          <el-table-column min-width="80" show-overflow-tooltip prop="tradeId" label="相关订单"></el-table-column>
          <el-table-column min-width="80" show-overflow-tooltip prop="memberName" label="会员"></el-table-column>

          <!-- <el-table-column show-overflow-tooltip prop="code" label="商品" ></el-table-column> -->
           <el-table-column min-width="120" show-overflow-tooltip  label="退款方式">
            <template slot-scope="scope">
                <span v-if="scope.row.type == 'GoodsToHQ'">退货到总部</span> 
                <span v-else-if="scope.row.type == 'Money'">仅退款</span>
                <span v-else-if="scope.row.type == 'GoodsToShop'">退货到门店</span>
                <span v-else>{{scope.row.type}}</span>
            </template>
          </el-table-column>
          <el-table-column min-width="140" show-overflow-tooltip prop="reason" label="退款原因"></el-table-column>

           <!-- <el-table-column show-overflow-tooltip prop="code" label="跟单状态" ></el-table-column> -->
          <el-table-column min-width="80" show-overflow-tooltip prop="amount" label="退款金额"></el-table-column>
          <el-table-column min-width="80" show-overflow-tooltip prop="postFee" label="邮费"></el-table-column>

          <el-table-column min-width="150" show-overflow-tooltip  label="申请时间">
            <template slot-scope="scope">
              <span>{{new Date(parseInt(scope.row.applyTime)).toLocaleString()}}</span>
            </template>
          </el-table-column>

          
          <el-table-column min-width="150" show-overflow-tooltip  label="批准时间">
            <template slot-scope="scope">
              <span>{{new Date(parseInt(scope.row.agreeTime)).toLocaleString()}}</span>
            </template>
          </el-table-column>

          <!-- <el-table-column show-overflow-tooltip prop="" label="是否已退款"></el-table-column>

          <el-table-column show-overflow-tooltip  label="退款时间">
            <template slot-scope="scope">
              <span>{{new Date(parseInt(scope.row.created)).toLocaleString()}}</span>
            </template>
          </el-table-column> -->

          <!-- <el-table-column show-overflow-tooltip prop="" label="接待客服"></el-table-column> -->

          <el-table-column fixed="right" width="170" show-overflow-tooltip prop="" label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="showDetail(scope.$index, scope.row)">明细</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                @click="agreeRefundMoney(scope.$index, scope.row)">同意退款</el-button>
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

      <el-dialog  :visible.sync="dialogTableVisible"   fullscreen>
         <el-card shadow="hover" style="margin-top:10px">
            <div slot="header" class="clearfix" style="height:25px"> 
              <h2>退款明细</h2>
            </div>
            <el-table 
                border
                :data="gridData"
                v-loading="loading"
                element-loading-text="数据加载中......"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
            >
              <el-table-column show-overflow-tooltip prop="code" label="封面图片">
                <template slot-scope="scope">
                  <img v-if="scope.row.mainImg" :src="'https://img.chuangdingshop.com/' + scope.row.mainImg" :alt="scope.row.title" width="60" height="60" class="am-img-thumbnail">
                  <p v-else>暂无图片</p>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="code" label="商品"></el-table-column>
              <el-table-column show-overflow-tooltip prop="secondName" label="类别"></el-table-column>
              <el-table-column show-overflow-tooltip prop="brand" label="品牌"></el-table-column>
              <el-table-column show-overflow-tooltip prop="year" label="年份"></el-table-column>
              <el-table-column show-overflow-tooltip prop="season" label="季节"></el-table-column>
              <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
              <el-table-column show-overflow-tooltip prop="size" label="尺码"></el-table-column>
              <el-table-column show-overflow-tooltip prop="sex" label="性别"></el-table-column>
              <el-table-column show-overflow-tooltip prop="series" label="系列"></el-table-column>
              <el-table-column show-overflow-tooltip prop="" label="波段"></el-table-column>
              <el-table-column show-overflow-tooltip prop="price" label="市场价"></el-table-column>
              <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价"></el-table-column>
              <el-table-column show-overflow-tooltip prop="num" label="退货数量"></el-table-column>
              <el-table-column show-overflow-tooltip prop="receiveNum" label="自动退货数"></el-table-column>
              <el-table-column show-overflow-tooltip label="实际退货数">
                <template slot-scope="scope">
                  <span>{{scope.row.num-scope.row.receiveNum}}</span>
                </template>
              </el-table-column>
              <el-table-column show-overflow-tooltip prop="barcode" label="条形码"></el-table-column>
              <el-table-column show-overflow-tooltip prop="" label="内部条码"></el-table-column> 
            </el-table>
          </el-card>  
      </el-dialog>

       <!-- 创建弹出框 -->

  </div>
</template>

<script>
import { setTimeout } from 'timers';
import ShopIdInput from '../../common/ShopIdInput.vue'
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
                status:'WAIT_MONEY',
                tid:'',
                memberId:''
            },
            gridData: [],
            dialogTableVisible: false,
            loading:true,
            indexLoading:true,
            form: {
              shopId: '',
              type: ''
            },
            shopNameOptions:[],
            multipleSelection: [],
            msgCreate:'msg',
            msgType:'success',
            searchForm:{}
        }
    },
    components:{
      'ShopIdInput-app':ShopIdInput
    },
    computed:{
        status(){
            return 123
        }
    },
    methods:{
      search(){
         if(typeof(this.params.created) != 'number' && typeof(this.params.created) != 'undefined'){
          this.params.created = this.params.created ? new Date(this.params.created).getTime() : ''
        }


        if(typeof(this.params.createdEnd) != 'number' && typeof(this.params.createdEnd) != 'undefined'){
          this.params.createdEnd = this.params.createdEnd ? new Date(this.params.createdEnd).getTime() : ''
        }
        this.params.page = 1
        // this.params.tid = this.searchForm.id
        this.getInfo()
      },
      refreshData(){
        this.getInfo()
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
        this.indexLoading = true
        this.$axios.get('/api/refund',{params:this.params}).then(res=>{
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
          
          this.$axios.get('/api/refund/'+row.id).then(res=>{
              console.log(res.data.data.items)
            for(let i of res.data.data.items){
              this.gridData.push(i)
            }
            this.loading = false
           
          })
      },
      agreeRefundMoney(a,b){
          
        this.$axios.post(`/api/refund/${b.id}/money/agree`).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '退款成功'
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
      createNew(){
        this.createTableVisible = true
        this.$axios.get('/api/shop').then((res)=>{
          this.shopNameOptions = res.data.data.data
        })
      },
     
      addDetailInfo(){
        this.form.counts.push({})
      },
     
      handleSelectionChange(val) {
        this.multipleSelection = val;
      }
    },
    mounted(){
       this.getInfo()
       
    }
  }
</script>

<style scoped>
 
</style>

