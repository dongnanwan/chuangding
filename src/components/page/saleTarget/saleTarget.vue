<template>
  <div>
      <div style="padding-bottom:8px">
        <el-button type="primary" @click="createNew()" plain  icon="el-icon-plus">创建</el-button>
        <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
      </div>
      

      <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row  v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
         
          <el-table-column show-overflow-tooltip prop="targetYear" min-width="100" label="月份">
            <template slot-scope="scope">
              <span>{{scope.row.targetYear+'-'+scope.row.targetMonth}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="totalDay" label="天数" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="performanceTargets" label="本月总目标" min-width="100"></el-table-column>
          <el-table-column show-overflow-tooltip prop="shopName" label="门店" min-width="100"></el-table-column>
         
          <el-table-column show-overflow-tooltip label="操作" fixed="right" width="80">
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

      <!-- 明细弹出框 ---------------------------------------------------->

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
              <el-table-column show-overflow-tooltip prop="shopName" label="门店"></el-table-column>
              <el-table-column show-overflow-tooltip prop="targetDay" label="日期"></el-table-column>
              <el-table-column show-overflow-tooltip prop="performanceTargets" label="目标业绩"></el-table-column>
              <el-table-column show-overflow-tooltip prop="actuallyComplete" label="实际完成"></el-table-column>
              <el-table-column show-overflow-tooltip prop="dayCompletionRate" label="本日完成率"></el-table-column>
              <el-table-column show-overflow-tooltip prop="comparedLastMonth" label="上月同比"></el-table-column>
              <el-table-column show-overflow-tooltip prop="monthComplete" label="本月完成"></el-table-column>
              <el-table-column show-overflow-tooltip prop="monthCompletionRate" label="本月完成率"></el-table-column>
              <el-table-column show-overflow-tooltip prop="customerTransaction" label="客单价"></el-table-column>
              <el-table-column show-overflow-tooltip prop="guestOrders" label="客单量"></el-table-column>
              <el-table-column show-overflow-tooltip prop="percentageDifference" label="比利差"></el-table-column>
            
              
            </el-table>
         </el-card>
      </el-dialog>

       <!-- 创建弹出框 ---------------------------------------->

      <el-dialog :visible.sync="createTableVisible" class="detailTable"  fullscreen>
        
          <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
              <h2>创建</h2>
            </div>
            <el-form ref="form" :model="addForm" label-width="80px" :inline="true"  class="demo-form-inline">
                
                  <ShopIdInput-app @OnGetShopIdsFromChild='GetShopIdFromChild'></ShopIdInput-app>
                
                  <br>

                  <el-form-item>
                    <el-input-number v-model="addForm.targetYear" @change="handleTargetYearChange" :min="2015" :max="2050" label="年份"></el-input-number>
                  </el-form-item>
                  <el-form-item>
                    <el-input-number v-model="addForm.targetMonth" @change="handleTargetMonthChange" :min="1" :max="12" label="月份"></el-input-number>
                  </el-form-item>

                  <br>
                    <el-button @click="getDayNumber(addForm.targetYear,addForm.targetMonth)">确认</el-button>
                  <br>
            </el-form>
          </el-card>

          <el-card style="margin-top:10px" >
            <div slot="header" class="clearfix" style="height:25px"> 
              <h2>输入每日目标</h2>
            </div>
            <el-table  border :data="addTableData">
                <el-table-column show-overflow-tooltip prop="targetMonth" label="月份"></el-table-column>
                <el-table-column show-overflow-tooltip prop="targetDay" label="日期"></el-table-column>
                <el-table-column show-overflow-tooltip label="目标业绩">
                    <template slot-scope="scope">
                        <el-input v-model="scope.row.performanceTargets" placeholder="请输入目标业绩"></el-input>
                    </template>
                </el-table-column>
            </el-table>   
          </el-card>
          
          <el-button type="primary" @click="submitCreateNew">创建</el-button>
          <el-button @click="closeCreateTable()">取消</el-button>
          
      </el-dialog>


  </div>
</template>

<script>
import { setTimeout } from 'timers';
import ShopIdInput from '../../common/ShopIdsInput.vue'
  export default {
    data(){
        return {
            addForm:{
                targetYear:new Date().getFullYear(),
                targetMonth:new Date().getMonth()+1,
                detailList:[]
            },
            items:[],
            total:0,
            shopId:[],
            pageSizes:[10, 20],
            params:{
                size:10,
                page:1,
                shopId:0
            },
            gridData: [],
            addTableData:[],
            dialogTableVisible: false,
            createTableVisible: false,
            loading:true,
            indexLoading:true,
            form: {
              shopId: '',
              type: ''
            },
            shopNameOptions:[],
            multipleSelection: [],
            msgCreate:'msg',
            msgType:'success'
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
      refreshData(){
        this.getInfo()
      },
      getDayNumber(year, month){
          this.addTableData = []
          let days = new Date(year, month, 0).getDate()
          for(let i = 0;i < days;i ++){
              this.addTableData.push({targetMonth:month,targetDay:i+1})
          }
        this.dayTargetTableShow = true
      },
      handleTargetYearChange(){
        console.log('yearchange')
      },
      handleTargetMonthChange(){
        console.log('monthchange')
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
        this.$axios.get('/api/getStoreSaleTarget',{params:this.params}).then(res=>{
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
        this.$axios.get(`/api/getSaleTargetDetail`,{params:{targetYear:row.targetYear,targetMonth:row.targetMonth,shopId:row.shopId}}).then(res=>{
          this.gridData = res.data.data.data
          this.gridData.sort((a,b)=>{
            return a.targetDay - b.targetDay
          })
          this.loading = false
          console.log(res)
        })
      },
      createNew(){
        this.createTableVisible = true
        this.$axios.get('/api/shop').then((res)=>{
          this.shopNameOptions = res.data.data.data
        })
      },
      submitCreateNew() {
        let flag = true
        let flag2 = true
         this.addTableData.forEach((val,ind)=>{
             this.addForm.detailList.push({targetDay:val.targetDay,performanceTargets:val.performanceTargets})
         })
         if(!this.addForm.shopId ){
             flag = false
         }else if(this.addForm.detailList.length == 0){
            flag = false
         }
        this.addForm.detailList.forEach((val,ind)=>{
            if(val.performanceTargets == undefined){
                flag = false
                flag2 = false
            }
        })

        console.log(this.addForm)
         
        if(flag){
          this.$axios.post(`/api/addStoreSaleTarget`,this.addForm).then((res)=>{
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
        }else{
            this.msgCreate = res.data.message
            this.msgType = '请填写完整'
            this.msgCreateOpen()
            this.addForm.detailList = []
        }
         
      },
      addDetailInfo(){
        this.form.counts.push({})
      },
      closeCreateTable(){
        this.createTableVisible = false
      },
      GetShopIdFromChild(data){
        // this.addForm.shopId = data
        console.log(data)
        
        if(data == null){
          this.addForm.shopId = []
        }else{
          this.addForm.shopId = data
        }
      }
    },
    mounted(){
       this.getInfo()
    }
  }
</script>

<style scoped>
 
</style>

