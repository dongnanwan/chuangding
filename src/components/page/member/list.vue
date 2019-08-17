<template>
  <div>
      <div style="height:40px">
        <div style="float:left">
            <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
        </div>
      </div>

      <div style="margin-bottom:10px">

        <el-date-picker
          class="searchItem"
          v-model="params.startTime"
          type="datetime"
          placeholder="开始日期">
        </el-date-picker>

        <el-date-picker
          class="searchItem"
          v-model="params.endTime"
          type="datetime"
          placeholder="结束日期">
        </el-date-picker>

        <div style="display:inline-block" class="searchItem">
            <ShopIdInput-app :fatherData='fatherList'  @OnGetDataFromChild='GetShopIdFromChild'></ShopIdInput-app>
        </div>

        <div style="display:inline-block" class="searchItem">
            <parterSelect-app @OnGetDataFromChild='GetPartnerIdFromChild'></parterSelect-app>
        </div>
        
        <el-select v-model="params.vip"  placeholder="会员等级" class="searchItem">
          <el-option
            v-for="item in vipRank"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
        </el-select>

        <el-select v-model="params.memberStatus"  placeholder="会员状态" class="searchItem">
          <el-option label="正常" value="NORMAL"></el-option>
          <el-option label="僵尸" value="ZOMBIE"></el-option>
        </el-select>

        <el-select v-model="params.vipFrom"  placeholder="会员来源" class="searchItem">
          <el-option label="购买" value="BUY"></el-option>
          <el-option label="转移" value="TRANSFER"></el-option>
        </el-select>

        <el-input v-model="params.memberId" class="searchItem" placeholder="会员ID"></el-input>

        <el-input v-model="params.memberCode" class="searchItem" placeholder="会员号"></el-input>

        <el-button @click="search()" type="primary" plain="" icon="el-icon-search">搜索</el-button>
      </div>

      <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row
        v-loading="indexLoading"
        element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column show-overflow-tooltip prop="id" label="ID" min-width="60"></el-table-column>
        <el-table-column show-overflow-tooltip prop="shopName" label="门店名" min-width="60"></el-table-column>
        <el-table-column show-overflow-tooltip prop="modified" label="成为会员时间" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.modified">{{new Date(scope.row.modified).toLocaleString()}}</span>
            <span v-else>还未成为会员</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="memberCode" label="会员号" min-width="150"></el-table-column>
        <el-table-column show-overflow-tooltip prop="nick" label="昵称" min-width="210"></el-table-column>
        <el-table-column show-overflow-tooltip prop="levelString" label="会员等级" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.vip == 'NON'">非会员</span> 
                <span v-else-if="scope.row.vip == 'SILVER'">银牌会员</span>
                <span v-else-if="scope.row.vip == 'GOLD'">金牌会员</span>
                <span v-else>{{scope.row.vip}}</span>
            </template>
        </el-table-column>
        
        <el-table-column show-overflow-tooltip prop="inviter" label="上级会员名" min-width="60"></el-table-column>
        <el-table-column show-overflow-tooltip prop="mid" label="上级会员ID" min-width="60"></el-table-column>

        <el-table-column show-overflow-tooltip prop="vipFrom" label="会员来源" min-width="100">
          <template slot-scope="scope">
              <span v-if="scope.row.vipFrom == 'BUY'">购买</span> 
              <span v-else-if="scope.row.vipFrom == 'TRANSFER'">转移</span>
              <span v-else>{{scope.row.vipFrom}}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="memberStatus" label="会员状态" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.memberStatus == 'NORMAL'">正常</span> 
            <span v-else-if="scope.row.memberStatus == 'ZOMBIE'">僵尸</span>
            <span v-else>{{scope.row.memberStatus}}</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="操作" fixed="right"  width="205">
            <template slot-scope="scope">
              <el-button @click="showCreatCode(scope.$index,scope.row)" type='primary' plain>下载会员码</el-button>
              <el-button @click="history(scope.$index,scope.row)" type='primary' plain>查看下级</el-button>
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

      <!-- 下级弹出框 -->

      <el-dialog  :visible.sync="historyTableVisible" class="detailTable" fullscreen>
        <el-card shadow="hover" style="margin-top:10px">
          <div slot="header" class="clearfix" style="height:25px"> 
            <h2>所有下级</h2>
          </div>

          <el-table :data="detailGridData"  style="width: 100%"  border highlight-current-row
            v-loading="loadingDetail"
            element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
          >
            <el-table-column show-overflow-tooltip prop="id" label="ID" min-width="60"></el-table-column>
            <el-table-column show-overflow-tooltip prop="memberCode" label="会员号" min-width="150"></el-table-column>
            <el-table-column show-overflow-tooltip prop="nick" label="昵称" min-width="210"></el-table-column>
            <el-table-column show-overflow-tooltip prop="levelString" label="会员等级" min-width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.vip == 'NON'">非会员</span> 
                    <span v-else-if="scope.row.vip == 'SILVER'">银牌会员</span>
                    <span v-else-if="scope.row.vip == 'GOLD'">金牌会员</span>
                    <span v-else>{{scope.row.vip}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="mid" label="上级会员ID" min-width="60"></el-table-column>
            
          </el-table>
        </el-card>
      </el-dialog>
  </div>
</template>

<script>
  import shopInput from '../../common/shopInput.vue'
  import parterSelect from '../../common/parterSelect.vue'
  export default {
    data(){
      return {
        items:[],
        total:0,
        totalHistory:0,
        shopId:0,
        pageSizes:[10, 20],
        pageSizesHistory:[10, 20],
        params:{
            size:10,
            page:1
        },
        paramsHistory:{
            size:100000,
            page:1
        },
        shopNameOptions:[],
        historyTableVisible:false,
        detailGridData:[],
        historyTableLoading:true,
        msgCreate:'msg',
        msgType:'success',
        indexLoading:true,
        upMemberId:'',
        loadingDetail:true,
        vipRank:[
          {value:'GOLD',label:'金卡会员'},
          {value:'SILVER',label:'银卡会员'},
          {value:'NON',label:'非会员'},
          {value:'',label:'显示全部'}
        ],
        memberName:'',
        fatherList:{
            provinceId:0,
            regionId:0,
            cityId:0
        }
      }
    },
    components:{
      'ShopIdInput-app':shopInput,
      'parterSelect-app':parterSelect
    },
    computed:{
    },
    methods:{
      GetPartnerIdFromChild(data){
        this.params.partnerId = data
      },
      showCreatCode(index,row){
        this.$prompt('请输入姓名', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          this.memberName = value
        }).then(()=>{
          this.creatCode(index,row)
        }).catch(()=>{

        })
      },
      creatCode(index,row){
        window.open(`/api/share-code/download-member-mini_code?memberId=${row.id}&name=${this.memberName}`)
      },
      search(){
        this.params.page = 1
        if(this.params.startTime && typeof(this.params.startTime) != 'number'){
          this.params.startTime = new Date(this.params.startTime).getTime()
        }
        if(this.params.endTime && typeof(this.params.endTime) != 'number'){
           this.params.endTime = new Date(this.params.endTime).getTime()
        }
        // if(!this.params.startTime){
        //   this.params.startTime = ''
        // }

        // if(!this.params.endTime){
        //   this.params.endTime = ''
        // }

        // this.params.startTime = new Date(this.params.startTime).getTime()
        // this.params.endTime = new Date(this.params.endTime).getTime()
        this.getInfo()
      },
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
        this.$axios.get('/api/member/findMembers',{params:this.params}).then(res=>{
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
        this.loadingDetail = true
        this.detailGridData = []
        this.paramsHistory.inviter = this.upMemberId
        this.$axios.get('/api/member/findMembers',{params:this.paramsHistory}).then(res=>{
          console.log(res.data.data)

          if(res.data.code == 200){
            // res.data.data.data.forEach((val,ind)=>{
            //   if(this.upMemberId == val.mid){
            //     this.detailGridData.push(val)
            //   }
            // })
            this.detailGridData = res.data.data.data
            this.loadingDetail = false
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
            this.loadingDetail = false
          }
        })
      },
      GetShopIdFromChild(data){
        this.shopId = data
        this.params.shopId = data
        // console.log(data)
      },
      history(index,row){
        // console.log(row)
        this.historyTableVisible = true
        this.upMemberId = row.id
        this.getHistoryInfo()
      }
    },
    mounted(){
       this.getInfo()
    }
  }
</script>

<style scoped>
 .searchItem{
   width:200px
 }
</style>



