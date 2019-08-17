<template>
  <div>
      <div style="height:40px">
          <div style="float:left">
            <el-button type="primary" @click="createNew()" plain icon="el-icon-plus">创建</el-button>
            <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
          </div>
      </div>
     

      <el-table :data="items"  height="600" style="width: 100%"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">

          <el-table-column show-overflow-tooltip prop="title" label="活动标题" min-width='100'></el-table-column>
          <el-table-column show-overflow-tooltip prop="startTime" label="开始时间" min-width="140"></el-table-column>
          <el-table-column show-overflow-tooltip prop="endTime" label="结束时间"  min-width="140"></el-table-column>
          
          <el-table-column show-overflow-tooltip prop="" label="秒杀商品"  min-width="100">
            <template slot-scope="scope">
               <span>{{getAllItemName(scope.row.items)}}</span>
               <!-- <span>{{scope.row.items}}</span> -->
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip  label="客户类型" min-width='100'>
              <template slot-scope="scope">
                  <span v-if="scope.row.customerType === 'SILVER'">银卡客户</span>
                  <span v-if="scope.row.customerType === 'GOLD'">金卡客户</span>
                  <span v-if="scope.row.customerType === 'NON'">全部客户</span>
                  
              </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="couponsAllowed" label="是否使用优惠券"  min-width="100">
              <template slot-scope="scope">
                  <span v-if="scope.row.couponsAllowed === false">否</span>
                  <span v-else>是</span>
              </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip prop="shareBenefit" label="是否参与分润"  min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.shareBenefit === false">否</span>
                <span v-else>是</span>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip label="审核" width="210">
            <template slot-scope="scope">
              <el-button :disabled="scope.row.auditStatus != 'UNCOMMITTED'" size="mini" type="primary" plain="" @click="submitToCheck(scope.$index, scope.row)">提交</el-button>
              <el-button :disabled="scope.row.auditStatus != 'REVIEWING'" type="success" size="mini" plain=""  @click="checkPass(scope.$index, scope.row)">通过</el-button>
              <el-button :disabled="scope.row.auditStatus != 'REVIEWING'" type="danger" size="mini" plain=""  @click="checkReject(scope.$index, scope.row)">拒绝</el-button>
            </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip  label="开启/禁用"   width="80">
             <template slot-scope="scope">
                  <el-switch v-model="scope.row.status" @change='statusChange(scope.$index, scope.row)' active-color="#13ce66" inactive-color="#ff4949"></el-switch>
             </template>
          </el-table-column>

          <el-table-column show-overflow-tooltip label="操作" width="170" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" type="primary" plain="" @click="showDetail(scope.$index, scope.row)">绑定商品</el-button>
              <el-button size="mini" type="primary" plain="" @click="updateDetail(scope.$index, scope.row)">修改</el-button>
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

      <el-dialog   :visible.sync="dialogTableVisible" class="detailTable"  fullscreen>
   
         <el-card style="margin-top:10px">
            <div slot="header">
               <h2>已经绑定的活动商品</h2>
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
              <el-table-column show-overflow-tooltip prop="name" label="类别"></el-table-column>
              <el-table-column show-overflow-tooltip prop="brandName" label="款号"></el-table-column>
              <el-table-column show-overflow-tooltip prop="color" label="颜色"></el-table-column>
              <el-table-column show-overflow-tooltip prop="sizeName" label="尺码"></el-table-column>
              <el-table-column show-overflow-tooltip prop="tagPrice" label="吊牌价"></el-table-column>
              <el-table-column show-overflow-tooltip prop="price" label="市场价"></el-table-column>
              <el-table-column show-overflow-tooltip prop="activityPrice" label="砍价价格"></el-table-column>
              <el-table-column show-overflow-tooltip prop="activityStock" label="折扣限量"></el-table-column>

              <el-table-column show-overflow-tooltip  label="解绑活动商品">
                <template slot-scope="scope">
                    <el-button type="danger" @click="removeItem(scope.$index, scope.row)">解绑</el-button>
                </template>
              </el-table-column>

            </el-table>
          </el-card>

          <el-card>
            <div slot="header">
               <h2>绑定活动商品</h2>
            </div>
        <!-- 添加商品。。。。。。。。。。。。。。。。。。。。 -->
    
              <SkuInput-app @onInsertSkuData='insertSkuData'></SkuInput-app>  
              <el-table border :data="skuTableData">
                    <el-table-column prop="year" label="年份" > </el-table-column>
                    <el-table-column prop="season" label="季节" > </el-table-column>
                    <el-table-column prop="brandName" label="品牌" > </el-table-column>
                    <el-table-column prop="name" label="sku名称" > </el-table-column>
                    <el-table-column prop="stock" label="库存" > </el-table-column>
                    <el-table-column prop="tagPrice" label="吊牌价" > </el-table-column>
                    <el-table-column label="砍价价格" >
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.getInputPrice" placeholder="请输入砍价价格" ></el-input>
                        </template>  
                    </el-table-column>

                    <el-table-column label="砍价限量" >
                        <template slot-scope="scope">
                            <el-input v-model="scope.row.getInputRestStock" placeholder="请输入砍价限量数量"></el-input>
                        </template>  
                    </el-table-column>

                    <el-table-column label="操作" >
                        <template slot-scope="scope">
                            <el-button type="danger" @click="deleteBindItem(scope.$index, scope.row)">删除</el-button>
                        </template>  
                    </el-table-column>
                   
                </el-table>
                
          </el-card>
          <el-button type="primary" @click="bindActivityItem()" plain>确认绑定</el-button>
      </el-dialog>

       <!-- 创建弹出框 -->

      <el-dialog  :visible.sync="createTableVisible" class="detailTable"  fullscreen>
          <el-card>
            <div slot="header">
               <h2>创建</h2>
            </div>

           <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
                <div style="height:40px;margin-left:12px">
                  <div style="float:left;line-height:30px">活动门店</div>
                  <div style="float:left;margin-left:12px">
                    <ShopIdInput-app @OnGetShopIdsFromChild='GetShopIdsFromChild'></ShopIdInput-app>
                  </div>
                  
                </div>
                    
                <br>
           
                <el-form-item label="活动名称">
                    <el-input v-model="form.title" placeholder="请输入活动名称"></el-input>
                </el-form-item>
                <br>
                
                <el-form-item label="开始日期">
                      <el-date-picker
                        v-model="form.startTime"
                        type="datetime"
                        placeholder="请输入开始日期">
                      </el-date-picker>
                   
                </el-form-item>
                <br>

                <el-form-item label="结束日期">
                    <!-- <el-input v-model="form.endTime" placeholder="请输入结束日期"></el-input> -->
                    <div class="block">
                      <span class="demonstration"></span>
                      <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        placeholder="请输入结束日期">
                      </el-date-picker>
                    </div>
                </el-form-item>
                <br>

                <el-form-item label="客户类型">
                    <el-select v-model="form.customerType" placeholder="活动针对客户类型">
                      <el-option value="GOLD" label="金卡客户"></el-option>
                      <el-option value="SILVER" label="银卡客户"></el-option>
                      <el-option value="NON" label="全部客户"></el-option>
                    </el-select>
                </el-form-item>
                <br>

                <el-form-item label="优惠券">
                  <el-select v-model="form.couponsAllowed" placeholder="是否使用优惠券">
                    <el-option value="true" label="是"></el-option>
                    <el-option value="false" label="否"></el-option>
                  </el-select>
                </el-form-item>
                <br>

                <el-form-item label="分润">
                  <el-select v-model="form.shareBenefit" placeholder="是否分润">
                    <el-option value="true" label="是"></el-option>
                    <el-option value="false" label="否"></el-option>
                  </el-select>
                </el-form-item>

          </el-form>
        </el-card>
        <el-button type="primary" @click="submitCreateNew">创建</el-button>
        <el-button @click="closeCreateTable()">取消</el-button>
      </el-dialog>


     <!-- 修改弹出框 -->

      <el-dialog  :visible.sync="updateTableVisible" class="detailTable"  fullscreen>
          <el-card>
            <div slot="header">
               <h2>修改</h2>
            </div>

           <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
         
                <el-form-item label="活动名称">
                    <el-input v-model="updateForm.title" placeholder="请输入活动名称"></el-input>
                </el-form-item>
                <br>
                
                <el-form-item label="开始日期">
                    <el-date-picker
                      v-model="updateForm.startTime"
                      type="datetime"
                      placeholder="请输入开始日期">
                    </el-date-picker>
                </el-form-item>
                <br>
                <el-form-item label="结束日期">
                    <div class="block">
                      <span class="demonstration"></span>
                      <el-date-picker
                        v-model="updateForm.endTime"
                        type="datetime"
                        placeholder="请输入结束日期">
                      </el-date-picker>
                    </div>
                </el-form-item>
                <br>
                <el-form-item label="客户类型">
                    <el-select v-model="updateForm.customerType" placeholder="活动针对客户类型">
                      <el-option value="GOLD" label="金卡客户"></el-option>
                      <el-option value="SILVER" label="银卡客户"></el-option>
                      <el-option value="NON" label="全部客户"></el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="优惠券">
                  <el-select v-model="updateForm.couponsAllowed" placeholder="是否使用优惠券">
                    <el-option value='true' label="是"></el-option>
                    <el-option value='false' label="否"></el-option>
                  </el-select>
                </el-form-item>
                <br>

                <el-form-item label="是否分润">
                  <el-select v-model="updateForm.shareBenefit" placeholder="是否分润">
                    <el-option value='true' label="是"></el-option>
                    <el-option value='false' label="否"></el-option>
                  </el-select>
                </el-form-item>

                <br>
          </el-form>
        </el-card>
        <el-button type="primary" @click="submitUpdate()">修改</el-button>
        <el-button @click="closeUpdateTable()">取消</el-button>
      </el-dialog>


  </div>
</template>

<script>

import SkuInputVue from '../../common/SkuInputOnline.vue';
import ShopIdInputVue from '../../common/ShopIdsInput.vue';
  export default {
    data(){
        return {
            isOpen:false,
            value1: '',
            items:[],
            total:0,
            shopId:[],
            pageSizes:[10, 20],
            params:{
                size:10,
                page:1,
                type:'BARGAIN'
            },
            gridData: [],
            dialogTableVisible: false,
            createTableVisible: false,
            updateTableVisible: false,
            loading:true,
            indexLoading:true,
            form: {
              type: 'BARGAIN'
            },
            updateForm:{

            },
            addItemForm:{
              skuList:[]
            },
            shopNameOptions:[],
            multipleSelection: [],
            msgCreate:'msg',
            msgType:'success',
            skuTableData:[],
            activityId:'',
            getThisRow:{}
        }
    },
    components:{
      'SkuInput-app':SkuInputVue,
      'ShopIdInput-app':ShopIdInputVue
    },
    methods:{
      refreshData(){
        this.getInfo()
      },
      getAllItemName(res){
        return res.map((val,ind)=>{
          return val.code
        }).length > 0 ? res.map((val,ind)=>{
          return val.code
        }) : '暂无商品'
        
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
        this.$axios.get('/api/activity/list',{params:this.params}).then(res=>{
          console.log(res)
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
      checkPass(index,row){
        
        this.$axios.put(`/api/activity/audit/${row.id}?isPassed=true`).then((res)=>{
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
      },
      checkReject(index,row){
         this.$axios.put(`/api/activity/audit/${row.id}?isPassed=false`).then((res)=>{
          // console.log(res.data)
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
          this.getThisRow = row

          this.activityId = row.id
          this.loading = true
          this.dialogTableVisible = true
          this.gridData = []
          if (row.items.length > 0){
            for(let i = 0;i < row.items.length;i ++){
              this.$axios.get(`/api/activity/item-detail/${row.items[i].activityId}/${row.items[i].id}`,{params:{activityType:'BARGAIN'}}).then(res=>{
                  // console.log(res)
                  res.data.data.activitySkuList.forEach((val,ind)=>{
                    this.gridData.push(val)
                  })
                  if(i == row.items.length-1 || row.items.length == 0){
                    this.loading = false
                  }
              })
            }
          }else{
            this.loading = false
          }
          
      },
      updateDetail(index,row){
        // console.log(row.id)
        this.updateForm = {type:'BARGAIN',id:row.id,title:row.title,startTime:row.startTime,endTime:row.endTime,customerType:row.customerType,couponsAllowed:row.couponsAllowed.toString(),shareBenefit:row.shareBenefit.toString()}
        // console.log(this.updateForm)
        this.updateTableVisible = true
      },
      removeItem(a,b){
        this.$axios.put(`/api/activity/remove-item/${b.activityItemId}`).then((res)=>{
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
      },
      createNew(){
        this.createTableVisible = true
        this.$axios.get('/api/shop').then((res)=>{
          this.shopNameOptions = res.data.data.data
        })
      },
      submitCreateNew() {
        //  console.log(this.form)
         this.$axios.post(`/api/activity/save-bargain-activity`,this.form).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            this.createTableVisible = false
         
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
          
        })
      },
      submitUpdate(){
        console.log(this.updateForm)
       
        this.$axios.put(`/api/activity/modified-bargain`,this.updateForm).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            this.createTableVisible = false
         
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
          // console.log(res)
        })
      },
      bindActivityItem() {
        let flag = true
        
        this.skuTableData.forEach((val,ind)=>{
          this.addItemForm.skuList.push({activityId:this.activityId,itemId:val.itemId,id:val.id,activityPrice:parseFloat(val.getInputPrice),activityStock:parseInt(val.getInputRestStock)})
        })
        console.log(this.addItemForm)
        this.addItemForm.skuList.forEach((val,ind)=>{
            if(!val.activityPrice || !val.activityStock){
                flag = false
            }
        })

        if(flag){
            this.$axios.put(`/api/activity/bind-items/${this.activityId}`,this.addItemForm.skuList).then((res)=>{
                if(res.data.code == 200){
                  this.msgCreate = '操作成功'
                  this.msgType = 'success'
                  this.msgCreateOpen()
                  this.getInfo()
                  this.dialogTableVisible = false
                }else{
                  this.msgCreate = res.data.message
                  this.msgType = 'error'
                  this.msgCreateOpen()
                }
                this.skuTableData = []
                this.addItemForm.skuList = []
            })
        }else{
            this.msgCreate ='请输入砍价价格和砍价限量'
            this.msgType = 'error'
            this.msgCreateOpen()
        }
      },
      closeCreateTable(){
        this.createTableVisible = false
      },
      closeUpdateTable(){
        this.updateTableVisible = false
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      GetShopIdsFromChild(data){
        if(data == null){
          this.form.shopId = ''
        }else{
          this.form.shopId = data.join(',')
        }
      },
      insertSkuData(data){
       function unique(array){     
                var allArr = [];   
                for(var i=0;i<array.length;i++){
                      var flag = true;
                　    for(var j=0;j<allArr.length;j++){
                      if(array[i].id == allArr[j].id){
                　　　　　   flag = false;
                　　    };
                };
                if(flag){
                　　allArr.push(array[i]);
                };
          };
            return allArr;
          }　　

          let arr = this.skuTableData
          
          data.forEach((value,index)=>{
            arr.push(value)
          })

          this.skuTableData = unique(arr)
      },
      statusChange(index,row){
        this.$axios.put(`/api/activity/toggle-status/${row.id}`).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            this.createTableVisible = false
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
        })
      },
      submitToCheck(index,row){
        this.$axios.put(`/api/activity/commit/${row.id}`).then((res)=>{
         if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            this.createTableVisible = false
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
        })
      },
      deleteBindItem(index,row){
        this.skuTableData.splice(index,1)
        console.log(this.skuTableData)
      }
    },
    mounted(){
       this.getInfo()
    }
    
  }
</script>

<style scoped>
  h2{
    padding: 10px;
  }
</style>

