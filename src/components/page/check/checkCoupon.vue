<template>
  <div>
    <div style="padding-bottom:10px">
        <el-button type="primary" @click="showCreateDia()" plain icon="el-icon-plus">创建</el-button>
        <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
    </div>

    <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column show-overflow-tooltip prop="id" label="ID" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip label="状态" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.status == 'Verify_Success'">审核成功</span> 
              <span v-else-if="scope.row.status == 'Created'">待审核</span>
              <span v-else-if="scope.row.status == 'Verifying'">审核中</span>
              <span v-else-if="scope.row.status == 'Verify_Failure'">审核失败</span>
              <span v-else>{{scope.row.status}}
            </span>
          </template>
        </el-table-column>
        
        <el-table-column show-overflow-tooltip prop="title" label="标题" min-width="180"></el-table-column>
        <el-table-column show-overflow-tooltip prop="type" label="类型" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.type == 'PERCENT'">打折</span>
            <span v-else-if="scope.row.type == 'DIRECT'">满减</span>
            <span v-else-if="scope.row.type == 'CASH'">现金</span>
            <span v-else-if="scope.row.type == 'GIFT'">赠品</span>
          </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="startTime" label="开始时间" min-width="150">
          <template slot-scope="scope">
            <span>{{new Date(scope.row.startTime).toLocaleString()}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="" label="结束时间" min-width="150">
          <template slot-scope="scope">
            <span>{{new Date(scope.row.endTime).toLocaleString()}}</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="description" label="描述" min-width="220"></el-table-column>
        <el-table-column show-overflow-tooltip prop="conditions" label="使用门槛" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="amount" label="面值/折扣" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="planNum" label="总数量" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="giftNum" label="赠品数" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="num" label="领取数量" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="birth" label="是否是生日券" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.birth == false">否</span>
            <span v-else-if="scope.row.birth == true">是</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="benefitSingle" label="不与会员优惠叠加" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.benefitSingle == false">否</span>
            <span v-else-if="scope.row.benefitSingle == true">是</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="open" label="是否开放领取" min-width="100">
          <template slot-scope="scope">
            <span v-if="scope.row.open == false">否</span>
            <span v-else-if="scope.row.open == true">是</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="primaryCost" label="成本价" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="allowGoods" label="适用产品" min-width="150"></el-table-column>
        <el-table-column show-overflow-tooltip prop="denyGoods" label="不适用产品" min-width="150"></el-table-column>

        <el-table-column show-overflow-tooltip fixed="right" label="操作" width="193">
          <template slot-scope="scope">
            <!-- <el-button type="primary" :disabled="scope.row.type != 'GIFT'" plain=""  @click="showBindWechart(scope.$index,scope.row)" >赠品</el-button>
            <el-button type="primary" plain=""  @click="showEditDia(scope.$index,scope.row)" >修改</el-button>
            <el-button type="primary" plain=""  @click="showDeleteDia(scope.$index,scope.row)" >删除</el-button>
            <el-button type="primary" plain=""  @click="showDetail(scope.$index,scope.row)" >查看</el-button>
            <el-button type="warning" plain=""  @click="showCheck(scope.$index,scope.row)" :disabled="scope.row.status != 'Created'" >提交审核</el-button> -->
            <el-button
                size="mini"
                type="success"
                plain=""
                @click="checkPass(scope.$index, scope.row)">通过审核</el-button>
              <el-button
                size="mini"
                type="danger"
                plain=""
                @click="checkReject(scope.$index, scope.row)">拒绝审核</el-button>
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

    <!-- 创建弹出框 -->

    <el-dialog  :visible.sync="createTableVisible" class="detailTable"  fullscreen>
    <el-card>
        <div slot="header" class="clearfix" style="height:25px"> 
        <h2>{{diaTitle}}</h2>
        </div>

        <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
            <el-form-item label="标题">
                <el-input v-model="form.title" placeholder="请输标题"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="类型">
                  <el-select v-model="form.type" placeholder="优惠券类型">
                    <el-option value="PERCENT" label="打折"></el-option>
                    <el-option value="DIRECT" label="满减"></el-option>
                    <el-option value="CASH" label="现金"></el-option>
                    <el-option value="GIFT" label="赠品"></el-option>
                  </el-select>
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
            <el-form-item v-if="form.type == 'GIFT'" label="赠品可领取数">
                <el-input  v-model="form.giftNum" placeholder="赠品可领取数"></el-input>
            </el-form-item>
            <br>

            <el-form-item label="使用金额">
                <el-input v-model="form.conditions" placeholder="请输使用金额"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="面额" v-if="form.type != 'GIFT'">
                <el-input v-model="form.amount" placeholder="输入面额"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="总数量">
                <el-input v-model="form.planNum" placeholder="请输入总数量"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="不与会员优惠叠加">
                <el-select v-model="form.benefitSingle" placeholder="不与会员优惠叠加">
                  <el-option value="true" label="是"></el-option>
                  <el-option value="false" label="否"></el-option>
                </el-select>
              </el-form-item>
            <br>
            <el-form-item label="是否开放领取">
                <el-select v-model="form.open" placeholder="是否开放领取">
                  <el-option value="true" label="是"></el-option>
                  <el-option value="false" label="否"></el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item  label="成本价">
                <el-input v-model="form.primaryCost" placeholder="请输入成本价"></el-input>
            </el-form-item>
            <br>
            <el-form-item  label="描述">
                <el-input v-model="form.description" placeholder="请输入描述"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="是否是生日券">
                <el-select v-model="form.birth" placeholder="是否是生日券">
                  <el-option value="true" label="是"></el-option>
                  <el-option value="false" label="否"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </el-card>

    <el-card shadow="hover" style="margin-top:10px">
        <div slot="header" class="clearfix" style="height:25px"> 
            <h2>适用产品</h2>
        </div>

          <SkuInput-app @onInsertSkuData='insertSkuData'></SkuInput-app> 

          <el-table border :data="allowSkuTableData">
              <el-table-column prop="id" label="skuId" min-width="80"> </el-table-column>
            <el-table-column prop="color" label="颜色" min-width="80"> </el-table-column>
            <el-table-column prop="size" label="尺码" min-width="80"> 
              <template slot-scope="scope">
                <span>{{scope.row.size?scope.row.size:scope.row.sizeName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="skuName" label="sku名称" min-width="80"> 
              <template slot-scope="scope">
                <span>{{scope.row.skuName?scope.row.skuName:scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.title?scope.row.title:scope.row.brandName}}</span>
              </template>
            </el-table-column>

              <el-table-column label="操作" min-width="80">
                <template slot-scope="scope">
                    <el-button type="danger" @click="deleteRowInfo(scope.$index)">删除</el-button>
                </template>  
              </el-table-column>
          </el-table>
    </el-card> 

    <el-card shadow="hover" style="margin-top:10px">
        <div slot="header" class="clearfix" style="height:25px"> 
            <h2>不适用产品</h2>
        </div>

          <SkuInput-app @onInsertSkuData='denyGoodsInsertSkuData'></SkuInput-app> 

          <el-table border :data="denySkuTableData">
              <el-table-column prop="id" label="skuId" min-width="80"> </el-table-column>
            <el-table-column prop="color" label="颜色" min-width="80"> </el-table-column>
            <el-table-column prop="size" label="尺码" min-width="80"> 
              <template slot-scope="scope">
                <span>{{scope.row.size?scope.row.size:scope.row.sizeName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="skuName" label="sku名称" min-width="80"> 
              <template slot-scope="scope">
                <span>{{scope.row.skuName?scope.row.skuName:scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.title?scope.row.title:scope.row.brandName}}</span>
              </template>
            </el-table-column>

              <el-table-column label="操作" min-width="80">
                <template slot-scope="scope">
                    <el-button type="danger" @click="denyGoodsDeleteRowInfo(scope.$index)">删除</el-button>
                </template>  
              </el-table-column>
          </el-table>
    </el-card> 

    <el-button v-if="isCreate" type="primary" plain @click="submitCreateNew">创建</el-button>
    <el-button v-if="!isCreate" type="primary" plain @click="submitEdit">修改</el-button>
    <el-button @click="closeCreateTable()">取消</el-button>
    </el-dialog>

    <!-- 绑定赠品 -->

    <el-dialog  :visible.sync="bindWechartVisible" class="detailTable"  fullscreen>
    <el-card>
        <div slot="header" class="clearfix" style="height:25px"> 
        <h2>设置赠品</h2>
        </div>
        <SkuInput-app @onInsertSkuData='giftInsertSkuData'></SkuInput-app> 

        <el-table border :data="giftSkuTableData">
            <el-table-column prop="id" label="skuId" min-width="80"> </el-table-column>
            <el-table-column prop="color" label="颜色" min-width="80"> </el-table-column>
            <el-table-column prop="size" label="尺码" min-width="80"> 
              <template slot-scope="scope">
                <span>{{scope.row.size?scope.row.size:scope.row.sizeName}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="skuName" label="sku名称" min-width="80"> 
              <template slot-scope="scope">
                <span>{{scope.row.skuName?scope.row.skuName:scope.row.name}}</span>
              </template>
            </el-table-column>
            <el-table-column prop="title" label="标题" min-width="80">
              <template slot-scope="scope">
                <span>{{scope.row.title?scope.row.title:scope.row.brandName}}</span>
              </template>
            </el-table-column>

            <el-table-column label="操作" min-width="80">
              <template slot-scope="scope">
                  <el-button type="danger" @click="giftDeleteRowInfo(scope.$index)">删除</el-button>
              </template>  
            </el-table-column>
        </el-table>
    </el-card>
    <el-button type="primary" plain @click="submitBindWechart()">确认</el-button>
    <el-button @click="bindWechartVisible = false">取消</el-button>
    </el-dialog>

    <!-- 领券详情 -->

    <el-dialog  :visible.sync="detailTableVisible" class="detailTable"  fullscreen="">
      <el-card>
          <div slot="header" class="clearfix" style="height:25px"> 
            <h2>领券详情</h2>
          </div>
          <el-date-picker
            v-model="detailParams.startTime"
            type="datetime"
            placeholder="请输入开始日期">
          </el-date-picker>

          <el-date-picker
            v-model="detailParams.endTime"
            type="datetime"
            placeholder="请输入结束日期">
          </el-date-picker>
          <el-input v-model="detailParams.memberId" style="width:220px" placeholder="会员id"></el-input>

          <div style="display:inline-block">
            <shopInput-app @OnGetDataFromChild="getShopIdFromChild"></shopInput-app>
          </div>
 
          <el-button type="primary" @click="detailSearch()" plain="" icon="el-icon-search" style="margin-bottom:10px"> 搜索</el-button>
          <el-table border :data="detailData" fullscreen v-loading="detailLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading" element-loading-background="rgba(0, 0, 0, 0.8)">
              <el-table-column prop="memberId" label="会员id" > </el-table-column>
              <el-table-column prop="created" label="领取时间" >
                <template slot-scope="scope">
                  <span>{{new Date(scope.row.created).toLocaleString()}}</span>
                </template>  
              </el-table-column>
              <el-table-column prop="useTime" label="使用时间" >
                <template slot-scope="scope">
                  <span v-if="scope.row.useTime">{{new Date(scope.row.useTime).toLocaleString()}}</span>
                  <span v-else>还未使用</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" >
                  <template slot-scope="scope">
                      <el-button type="danger" @click="showUseDetail(scope.$index, scope.row)">查看使用明细</el-button>
                  </template>  
              </el-table-column>
          </el-table>

          <div class="block">
            <el-pagination
              @size-change="detailHandleSizeChange"
              @current-change="detailHandleCurrentChange"
              :page-sizes="detailPageSizes"
              :page-size="detailPageSizes[0]"
              layout="total, sizes, prev, pager, next, jumper"
              :total="detailTotal">
            </el-pagination>
          </div>
      </el-card>

    </el-dialog>

     <!-- 使用详情 -->

    <el-dialog  :visible.sync="usedetailTableVisible" class="detailTable"  fullscreen="">
      <el-card>
        <div slot="header" class="clearfix" style="height:25px"> 
          <h2>使用详情</h2>
        </div>
        
        <el-table border :data="useDetailData" fullscreen>
          <el-table-column prop="promotionCouponId" label="赠品id" > </el-table-column>
          <el-table-column prop="skuId" label="skuId" > </el-table-column>
          <el-table-column prop="code" label="款号" > </el-table-column>
          <el-table-column prop="color" label="颜色" > </el-table-column>
          <el-table-column prop="size" label="尺码" > </el-table-column>
        </el-table>
      </el-card>
    </el-dialog>
  </div>
</template>

<script>
  import SkuInputVue from '../../common/SkuInput.vue';
  import shopInput from "../../common/shopInput.vue";
  export default {
    data(){
        return {
          usedetailTableVisible:false,
          useDetailData:[],
          detailLoading:true,
          giftSkuTableData:[],
          detailData:[],
          detailTableVisible:false,
          items:[],
          total:0,
          shopId:[],
          pageSizes:[10, 20],
          params:{
              size:10,
              page:1,
              shopId:0,
              status:'Verifying'
          },
          createTableVisible: false,
          indexLoading:true,
          form: {
            amount:0,
            primaryCost:0
          },
          shopNameOptions:[],
          multipleSelection: [],
          msgCreate:'msg',
          msgType:'success',
          diaTitle:'',
          isCreate:true,
          editId:'',
          bindId:'',
          bindWechartVisible:false,
          memberCode:'',
          allowSkuTableData:[],
          denySkuTableData:[],
          detailPageSizes:[10, 20],
          detailParams:{
              size:10,
              page:1,
              memberId:'',
              startTime:'',
              endTime:''
          },
          detailTotal:0,
          detailId:''
        }
    },
    computed:{
    },
    components:{
      'SkuInput-app':SkuInputVue,
      'shopInput-app':shopInput
    },
    methods:{
        checkPass(index,row){
            this.$axios.put(`/api/coupon/${row.id}/verify/success`).then((res)=>{
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
            this.$axios.put(`/api/coupon/${row.id}/verify/failure`).then((res)=>{
            // console.log(res.data)
            if(res.data.code == 200){
                this.msgCreate = '操作成功'
                this.msgType = 'success'
                this.msgCreateOpen()
                this.getInfo()
            }else{
                this.msgCreate = res.data.message
                this.msgType = 'error'
                this.msgCreateOpen()
                this.indexLoading = false
            }
            })
        },
      showCheck(index,row) {
        this.$confirm('确认提交审核?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.submitCheck(index,row)
        }).catch(() => {
                  
        });
      },
      submitCheck(index,row){
        this.$axios.put(`/api/coupon/${row.id}/submit`).then((res)=>{
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
      getShopIdFromChild(data) {
          this.detailParams.shopId = data;
      },
      detailSearch(){
        if(this.detailParams.startTime){
          this.detailParams.startTime = new Date(this.detailParams.startTime).getTime()
        }
        if(this.detailParams.endTime){
          this.detailParams.endTime = new Date(this.detailParams.endTime).getTime()
        }
        
        
        this.getDetail()
      },
      showUseDetail(index,row){
        this.usedetailTableVisible = true
        this.useDetailData = row.gifts
      },
      giftInsertSkuData(data){
        console.log(data)
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

          let arr = this.giftSkuTableData
          
          data.forEach((value,index)=>{
            arr.push(value)
          })

          this.giftSkuTableData = unique(arr)
      },
      giftDeleteRowInfo(index){
        this.giftSkuTableData.splice(index,1)
      },
      deleteRowInfo(index){
        this.allowSkuTableData.splice(index,1)
      },
      denyGoodsDeleteRowInfo(index){
        this.denySkuTableData.splice(index,1)
      },
      denyGoodsInsertSkuData(data){
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

          let arr = this.denySkuTableData
          
          data.forEach((value,index)=>{
            arr.push(value)
          })

          this.denySkuTableData = unique(arr)
      },
      insertSkuData(data){
        function unique(array){     
          var allArr = [];   
          for(var i=0;i<array.length;i++){
            var flag = true;
      　    for(var j=0;j<allArr.length;j++){
              if(array[i].id == allArr[j].id){
        　　　　　   flag = false;
        　　   }
            }
            if(flag){
            　　allArr.push(array[i]);
            }
          }
            return allArr;
          }　　

          let arr = this.allowSkuTableData
          
          data.forEach((value,index)=>{
            arr.push(value)
          })

          this.allowSkuTableData = unique(arr)
      },
      showDetail(index,row){
        this.detailLoading = true
        this.detailTableVisible = true
        this.detailId = row.id
        console.log(row)
        this.getDetail()
      },
      getDetail(){
        this.$axios.get(`/api/coupon/records?promotionCouponId=${this.detailId}`,{params:this.detailParams}).then((res)=>{
            if(res.data.code == 200){
                this.detailData = res.data.data.data
                this.detailTotal = res.data.data.total
                this.detailLoading = false
                console.log(res.data.data)
            }else{
                this.msgCreate = res.data.message
                this.msgType = 'error'
                this.msgCreateOpen()
                this.detailLoading = false
            }
        })
      },
      showDeleteDia(index,row){
        var that = this
        this.$confirm('是否确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteThis(index,row)
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
      },
      deleteThis(index,row){
        this.$axios.delete(`/api/coupon/${row.id}`).then((res)=>{
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
      submitBindWechart(){
        // console.log(this.giftSkuTableData)
        let arr = []
        this.giftSkuTableData.forEach((val,ind)=>{
          arr.push({promotionCouponId:this.bindId,itemId:val.itemId,skuId:val.id})
        })
          this.$axios.put(`/api/coupon/${this.bindId}/gifts`,arr).then((res)=>{
              if(res.data.code == 200){
                  this.msgCreate = '操作成功'
                  this.msgType = 'success'
                  this.msgCreateOpen()
                  this.getInfo()
                  this.giftSkuTableData = []
                  this.bindWechartVisible = false
              }else{
                  this.msgCreate = res.data.message
                  this.msgType = 'error'
                  this.msgCreateOpen()
              }
          })
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
        detailHandleSizeChange(val){
          this.detailParams.size = val 
          this.detailParams.page = 1
          this.getDetail()
        },
        detailHandleCurrentChange(val){
          this.detailParams.page = val
          this.getDetail()
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
            this.$axios.get('/api/coupon',{params:this.params}).then(res=>{
                if(res.data.code == 200){
                  console.log(res)
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
        showCreateDia(){
          this.isCreate = true
          this.diaTitle = '创建'
          this.form = {
            amount:0
          }
          this.createTableVisible = true
        },
        showEditDia(index,row){
          this.editId = row.id
          this.createTableVisible = true
          this.isCreate = false
          this.diaTitle = '修改'
          this.$axios.get(`/api/coupon/${row.id}`,{params:this.params}).then(res=>{
            if(res.data.code == 200){
              console.log(res.data.data)
              this.form = Object.assign(res.data.data,{open:row.open.toString(),benefitSingle:row.benefitSingle.toString()})
              this.allowSkuTableData = res.data.data.allowGoodsSku
              this.denySkuTableData = res.data.data.denyGoodsSku
            }else{
              this.msgCreate = res.data.message
              this.msgType = 'error'
              this.msgCreateOpen()
              this.indexLoading = false
            }
          })
        },
        submitCreateNew() {
          this.form.allowGoods = []
          this.form.denyGoods = []
          this.allowSkuTableData.forEach((val,ind)=>{
            this.form.allowGoods.push(val.id) 
          })

          this.denySkuTableData.forEach((val,ind)=>{
            this.form.denyGoods.push(val.id) 
          })

          this.$axios.post('/api/coupon',this.form).then((res)=>{
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
        submitEdit(){
            this.form.allowGoods = []
            this.allowSkuTableData.forEach((val,ind)=>{
              this.form.allowGoods.push(val.id)
            })
            this.form.denyGoods = []
            this.denySkuTableData.forEach((val,ind)=>{
              this.form.denyGoods.push(val.id)
            })
            this.$axios.post('/api/coupon',this.form).then((res)=>{
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
        addDetailInfo(){
            this.form.counts.push({})
        },
        closeCreateTable(){
            this.createTableVisible = false
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        showBindWechart(index,row){
    
          row.gifts.forEach((val,ind)=>{
            val.id = val.skuId
          })
          this.giftSkuTableData = row.gifts
          this.bindWechartVisible = true
          this.bindId = row.id
        }
    },
    mounted(){
       this.getInfo()
    }
  }
</script>

<style scoped>
 
</style>



