<template>
  <div>
      <div style="height:40px">
        <div style="float:left">
          <el-button type="primary" plain="" @click="createNew()" icon="el-icon-plus">创建</el-button>
          <!-- <el-button type="primary" plain="" @click="createErpPlanShow()" icon="el-icon-plus">生成ERP计划</el-button> -->
          <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
          
          <div style="margin:10px 0">
            <div style="float:left">
              <ShopIdInputx-app @OnGetDataFromChild='GetShopIdFromChildSearch'></ShopIdInputx-app>
            </div>
            <el-button type="primary"  plain="" @click="searchIndex()" icon="el-icon-search">搜索</el-button>
          </div>
          
        </div>
      </div>

      <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            @selection-change="handleSelectionChangeIndexTable"
            >
          <el-table-column type="selection" width="55"></el-table-column>
         
          <el-table-column show-overflow-tooltip prop="verifyStatus" label="状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.verifyStatus == 'Verify_Success'">审核成功</span> 
                <span v-else-if="scope.row.verifyStatus == 'Created'">待审核</span>
                <span v-else-if="scope.row.verifyStatus == 'Verify_Failure'">审核失败</span>
                <span v-else-if="scope.row.verifyStatus == 'Verifying'">审核中</span>
                <span v-else-if="scope.row.verifyStatus == 'Canceled'">已取消</span>
                <span v-else-if="scope.row.verifyStatus == 'Cancelled'">已取消</span>
                <span v-else>{{scope.row.verifyStatus}}</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="transitStatus" label="发货状态">
              <template slot-scope="scope">
                <span v-if="scope.row.transitStatus == 'Wait_Receive'">等待接收</span> 
                <span v-else-if="scope.row.transitStatus == 'Wait_Consign'">等待确认</span>
                <span v-else-if="scope.row.transitStatus == 'Finished'">已完成</span>
                <span v-else>{{scope.row.transitStatus}}</span>
              </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" label="是否已生成erp计划">
             <template slot-scope="scope">
                <span v-if="scope.row.produced == true">是</span> 
                <span v-else>否</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="180" prop="code" label="单号"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="220" prop="shopName" label="店铺"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="totalBookCount" label="总件数"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="totalConsignCount" label="已发货"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="totalBookAmount" label="吊牌总额"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="120" prop="remark" label="备注"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="createByName" label="创建人"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="150"  label="创建时间" >
            <template slot-scope="scope">
              <span v-if="scope.row.createdOn == null"></span>
              <span v-else>{{new Date(parseInt(scope.row.createdOn)).toLocaleString()}}</span>
            </template>
          </el-table-column>

          <!-- <el-table-column show-overflow-tooltip width="210"   label="审核">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="warning"
                plain=""
                @click="submitCheck(scope.$index, scope.row)">提交</el-button>
              <el-button
                size="mini"
                type="success"
                plain=""
                @click="checkPass(scope.$index, scope.row)">通过</el-button>

              <el-button
                size="mini"
                type="danger"
                plain=""
                @click="checkReject(scope.$index, scope.row)">拒绝</el-button>
            </template>
          </el-table-column> -->

          <el-table-column show-overflow-tooltip width="420" fixed="right"  label="操作">
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="primary"
                plain
                @click="showDetail(scope.$index, scope.row)">明细</el-button>
              <el-button
                size="mini"
                type="warning"
                plain=""
                @click="submitCheck(scope.$index, scope.row)">提交审核</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                @click="cancelDisShow(scope.$index, scope.row)">取消</el-button>
              
             <el-button
                size="mini"
                type="primary"
                plain
                @click="showEditTable(scope.$index, scope.row)">修改</el-button>
              <el-button
                size="mini"
                type="primary"
                plain
                @click="showErpSender(scope.$index, scope.row)">生成Erp发货单</el-button>  
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

      <!-- 明细&&发货单弹出框 -->

      <el-dialog  :visible.sync="dialogTableVisible" class="detailTable"   fullscreen>
        <el-card>
          <div slot="header" class="clearfix" style="height:25px"> 
            <h2 v-if="!isERP">明细</h2>
            <h2 v-if="isERP">请选择要发货sku的数量</h2>
          </div>

          <div style="margin-bottom:10px">
            
            <el-checkbox v-model="filterItem.isStoreMoreThanZero">库存大于0</el-checkbox>
            <el-checkbox v-model="filterItem.isNotSenderNumMoreThanZero">未发货数大于0</el-checkbox>
            
            <el-select v-model="filterItem.part" class="searchItem" placeholder="波段">
                <el-option
                    v-for="item in searchData.part"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                    </el-option>
            </el-select>
            <el-input v-model="filterItem.batch" placeholder="输入批次" style="display:inline-block;width:200px;margin-left:10px;"></el-input>
            <el-button @click="filterStore()" type="primary" icon="el-icon-search" style="margin-left:10px">数据筛选</el-button>
            <div v-if="isERP">
              <h3> 当前页发货数:<span style="color:red">{{allTotalThisPage}}</span></h3>
              <h3>总计发货数:<span style="color:red">{{allTotal}}</span></h3>
            </div>

          </div>
          <!-- <el-button type="primary" @click="selectAll">全选</el-button> -->
          <el-table
              :data="gridData.slice((currentPagexxx-1)*pagesizexxx,currentPagexxx*pagesizexxx)" 
              border
              v-loading="loading"
              element-loading-text="数据加载中......"
              element-loading-spinner="el-icon-loading"
              element-loading-background="rgba(0, 0, 0, 0.8)"
              @selection-change="handleSelectionChange"
          >
            <!-- <el-table-column type="selection" min-width="50" v-if="isERP"></el-table-column> -->
          
            <el-table-column show-overflow-tooltip label="本次发货数" min-width="130" v-if="isERP">
              <template slot-scope="scope">
                <el-input-number v-model="scope.row.thisSendNumber"  controls-position="right"  :min="0" :max="(scope.row.bookCount-scope.row.consignCount)>scope.row.inStorage?scope.row.inStorage:(scope.row.bookCount-scope.row.consignCount)"></el-input-number>
              </template>
            </el-table-column>
            <!-- <el-table-column show-overflow-tooltip min-width="80" prop="thisSendNumber" label="本次发货数"></el-table-column> -->
            <el-table-column show-overflow-tooltip min-width="80" prop="batch" label="批次"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="year" label="年份"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="season" label="季节"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="secondName" label="类别"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" sortable prop="code" label="款号"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="color" label="颜色"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="size" label="尺码"></el-table-column>
            <!-- <el-table-column show-overflow-tooltip min-width="80" prop="sex" label="性别"></el-table-column> -->
            <el-table-column show-overflow-tooltip min-width="80" prop="" label="总部库存">
              <template slot-scope="scope">
                {{scope.row.inStorage}}
                <!-- {{getStoreBySku(scope.row.skuId)}} -->
              </template>
              
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="bookCount" label="数量"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="" label="未发货">
              <template slot-scope="scope" >
                {{scope.row.bookCount - scope.row.consignCount}}
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="consignCount" label="已发货"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="tagPrice" label="吊牌价"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="series" label="系列"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="part" label="波段"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="80" prop="barcode" label="条形码"></el-table-column>
            <!-- <el-table-column show-overflow-tooltip min-width="80" sortable="" prop="skuId" label="skuId"></el-table-column> -->
          </el-table>

          <el-pagination
            @size-change="handleSizeChangexxx"
            @current-change="handleCurrentChangexxx"
            :current-page="currentPagexxx"
            :page-sizes="[10,50,100,500]"
            :page-size="pagesizexxx"
            layout="total, sizes, prev, pager, next, jumper"
            :total='parseInt(totalxxx)'>
          </el-pagination>
        </el-card>
        <el-button v-if="isERP" type="primary" plain @click="createErpSend()" :disabled="sendDisable">生成ERP发货单</el-button>
        <el-button type="primary" @click="dialogTableVisible = false" plain>取消</el-button>
      </el-dialog>

 <!-- 创建弹出框 -->

      <el-dialog  :visible.sync="createTableVisible" class="detailTable"  fullscreen>

        <el-card shadow="hover" style="margin-top:10px">
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>单据基本信息</h2>
            </div>
            <el-form ref="form" :model="form" label-width="80px" :inline="false"  class="demo-form-inline">
                <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:12px">选择店铺</p>
                    <span style="line-height:30px;">{{addShopName}}</span>
                    <div style="float:left;padding-left:12px">
                        <ShopIdInput-app @OnGetShopIdFromChild='GetShopIdFromChild'></ShopIdInput-app>
                    </div>
                </div>

                <el-form-item label="总件数" style="width:295px">
                  <el-input  :value="totalNumber" disabled=""></el-input>
                </el-form-item>


                <el-form-item label="吊牌总额" style="width:295px">
                  <el-input  :value="totalTagPrice" disabled=""></el-input>
                </el-form-item>

                <el-form-item label="备注" style="width:295px">
                  <el-input type="textarea" v-model="form.remark"></el-input>
                </el-form-item>
             </el-form>
        </el-card>  

        <el-card shadow="hover" style="margin-top:10px">
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>单据行信息</h2>
            </div>

              <SkuInput-app @onInsertSkuData='insertSkuData'></SkuInput-app> 

              <el-table border :data="skuTableData">
                  <el-table-column prop="year" label="年份" min-width="80"> </el-table-column>
                  <el-table-column prop="season" label="季节" min-width="80"> </el-table-column>
                  <el-table-column prop="brandName" label="品牌" min-width="80"> </el-table-column>
                  <el-table-column prop="name" label="sku名称" min-width="80"> </el-table-column>
                  <el-table-column prop="stock" label="库存" min-width="80"> </el-table-column>
                  <el-table-column prop="tagPrice" label="吊牌价" min-width="80"> </el-table-column>

                  <el-table-column label="数量" min-width="80">
                      <template slot-scope="scope">
                          <el-input v-model="scope.row.count" placeholder="请输入数量"></el-input>
                      </template>  
                  </el-table-column>

                  <el-table-column label="操作" min-width="80">
                    <template slot-scope="scope">
                        <el-button type="danger" @click="deleteRowInfo(scope.$index)">删除</el-button>
                    </template>  
                  </el-table-column>
              </el-table>
            
        </el-card>  

        <el-button type="primary" @click="submitCreate()" plain>创建</el-button>
        <el-button type="primary" @click="closeCreateTable()" plain>取消</el-button>
      </el-dialog>

    <!-- 修改弹出框 -->

      <el-dialog  :visible.sync="editTableVisible" class="detailTable"  fullscreen>

        <el-card shadow="hover" style="margin-top:10px">
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>单据基本信息</h2>
            </div>
            <el-form ref="form" :model="editForm" label-width="80px" :inline="false"  class="demo-form-inline">
              <div style="height:50px">
                  <p style="float:left;line-height:30px;padding-left:12px">选择店铺</p>
                  <!-- <el-input v-model="editShopName"></el-input> -->
                  <span style="line-height:30px;">{{editShopName}}</span>
                  <div style="float:left;padding-left:12px">
                      <ShopIdInput-app @OnGetShopIdFromChild='EditGetShopIdFromChild' :shopNameProp='editShopName'></ShopIdInput-app>
                      <!-- <span>{{editShopName}}</span> -->
                  </div>
              </div>

              <el-form-item label="总件数" style="width:295px">
                <el-input  :value="editTotalNumber" disabled=""></el-input>
              </el-form-item>


              <el-form-item label="吊牌总额" style="width:295px">
                <el-input  :value="editTotalTagPrice" disabled=""></el-input>
              </el-form-item>

              <el-form-item label="备注" style="width:295px">
                <el-input type="textarea" v-model="editForm.remark"></el-input>
              </el-form-item>
            </el-form>
        </el-card>  

        <el-card shadow="hover" style="margin-top:10px">
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>单据行信息</h2>
            </div>

              <SkuInput-app @onInsertSkuData='editInsertSkuData'></SkuInput-app> 

              <el-table border :data="editSkuTableData">
                  <el-table-column prop="year" label="年份" min-width="80"> </el-table-column>
                  <el-table-column prop="season" label="季节" min-width="80"> </el-table-column>
                  <el-table-column prop="brandName" label="品牌" min-width="80"> </el-table-column>
                  <el-table-column prop="name" label="sku名称" min-width="80">
                    <template slot-scope="scope">
                      <span v-if="scope.row.name">{{scope.row.name}}</span>
                      <span v-else>{{scope.row.code+'-'+scope.row.color+'-'+scope.row.size}}</span>
                    </template>
                  </el-table-column>
                  <!-- <el-table-column prop="stock" label="库存" min-width="80"> </el-table-column> -->
                  <el-table-column prop="tagPrice" label="吊牌价" min-width="80"> </el-table-column>

                  <el-table-column label="数量" min-width="80">
                      <template slot-scope="scope">
                        <input type="text" style="height:25px;border-radius:3px" v-model="scope.row.count" placeholder="请输入数量">
                      </template>  
                  </el-table-column>

                  <el-table-column label="操作" min-width="80">
                    <template slot-scope="scope">
                        <el-button type="danger" @click="editDeleteRowInfo(scope.$index)">删除</el-button>
                    </template>  
                  </el-table-column>
              </el-table>
            
        </el-card>  

        <el-button type="primary" @click="submitEdit()" plain>修改</el-button>
        <el-button type="primary" @click="editTableVisible = false" plain>取消</el-button>
      </el-dialog>

  </div>
</template>

<script>
  import ShopIdInput from '../../common/ShopIdButton.vue'
  import ShopIdInputx from '../../common/shopInput.vue'
  import SkuInputVue from '../../common/SkuInput.vue';
  export default {
    data(){
        return {
          editTableVisible:false,
          isERP:false,
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
          indexLoading:true,
          form: {
            shopId: '',
            remark: '',
            counts:[]
          },
          editForm: {
            shopId: '',
            remark: '',
            counts:[]
          },
          shopNameOptions:[],
          multipleSelection: [],
          multipleSelectionIndexTable:[],
          skuTableData:[],
          editSkuTableData:[],
          remark:'',
          sendCode:'',
          msgCreate:'msg',
          msgType:'success',
          editCode:'',
          editShopName:'',
          addShopName:'',
          pagesizexxx:10,
          currentPagexxx:1,
          totalxxx:100,
          allData:[],
          allGridData:[],
          filterItem:{
            isStoreMoreThanZero:false,
            isNotSenderNumMoreThanZero:false,
            part:'',
            batch:''
          },
          searchData:{
            part:[
                {value:'春一波',label:'春一波'},
                {value:'春二波',label:'春二波'},
                {value:'春三波',label:'春三波'},
                {value:'春四波',label:'春四波'},
                {value:'夏一波',label:'夏一波'},
                {value:'夏二波',label:'夏二波'},
                {value:'夏三波',label:'夏三波'},
                {value:'夏四波',label:'夏四波'},
                {value:'秋一波',label:'秋一波'},
                {value:'秋二波',label:'秋二波'},
                {value:'秋三波',label:'秋三波'},
                {value:'秋四波',label:'秋四波'},
                {value:'冬一波',label:'冬一波'},
                {value:'冬二波',label:'冬二波'},
                {value:'冬三波',label:'冬三波'},
                {value:'冬四波',label:'冬四波'},
                {value:'',label:'全部'}
            ]
          },
          searchDataIndex:{
            shopId:''
          },
          sendDisable:false
        }
    },
    computed:{
         allTotal(){
          let rst = 0
          this.gridData.forEach((val,ind)=>{
            rst += val.thisSendNumber
          })
          return rst
        },
        allTotalThisPage(){
          let rst = 0
          this.gridData.slice((this.currentPagexxx-1)*this.pagesizexxx,this.currentPagexxx*this.pagesizexxx).forEach((val,ind)=>{
            rst += val.thisSendNumber
          })
          return rst
        },
        editTotalNumber(){
          let num = 0
          if(this.editSkuTableData){
              this.editSkuTableData.forEach((val,ind)=>{
                num += (parseInt(val.count) || 0)
              })
          }
          return num 
        },
        editTotalTagPrice(){
          let num = 0
          if(this.editSkuTableData){
              this.editSkuTableData.forEach((val,ind)=>{
                num += (parseInt(val.count) || 0) * (val.tagPrice)
              })
          }
          return num 
        },
        totalNumber(){
          let num = 0
          if(this.skuTableData){
              this.skuTableData.forEach((val,ind)=>{
                num += (parseInt(val.count) || 0)
              })
          }
          return num 
        },
        totalTagPrice(){
          let num = 0
          if(this.skuTableData){
              this.skuTableData.forEach((val,ind)=>{
                num += (parseInt(val.count) || 0) * (val.tagPrice)
              })
          }
          return num 
        }
    },
    components:{
      'SkuInput-app':SkuInputVue,
      'ShopIdInput-app':ShopIdInput,
      'ShopIdInputx-app':ShopIdInputx
    },
    methods:{
      cancelDisShow(index,row) {
          this.$confirm('是否确认删除该', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.deleteOne(index,row)
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消删除'
              });          
          });
      },
      deleteOne(index,row){
        this.$axios.put(`/api/distribute/${row.code}/cancel`).then(res=>{
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
      searchIndex(){
        this.params.page = 1
        this.params.shopId = this.searchDataIndex.shopId
        this.getInfo()
      },
      filterStore(){
        this.gridData = []
        this.allGridData.forEach((res,ind)=>{
          this.gridData.push(res)
        })

        if(this.filterItem.isStoreMoreThanZero){
          for(let i = 0;i < this.gridData.length;i ++){
            if(this.gridData[i].inStorage == 0){
              this.gridData.splice(i,1)
              i --
            }
          }
        }

        if(this.filterItem.isNotSenderNumMoreThanZero){
          for(let i = 0;i < this.gridData.length;i ++){
            if(this.gridData[i].bookCount - this.gridData[i].consignCount == 0){
              this.gridData.splice(i,1)
              i --
            }
          }
        }

        if(this.filterItem.part !=''){
          for(let i = 0;i < this.gridData.length;i ++){
            if(this.gridData[i].part != this.filterItem.part){
              this.gridData.splice(i,1)
              i --
            }
          }
        }

        if(this.filterItem.batch !=''){
          for(let i = 0;i < this.gridData.length;i ++){
            if(this.gridData[i].batch != this.filterItem.batch){
              this.gridData.splice(i,1)
              i --
            }
          }
        }
        
        this.currentPagexxx = 1
        this.totalxxx = this.gridData.length
      },
      selectAll(){
        this.multipleSelection = this.gridData
        console.log(this.multipleSelection)
      },
      handleSizeChangexxx(val) {
          this.pagesizexxx = val;
      },
      handleCurrentChangexxx(val) {
       this.gridData.forEach((val,ind)=>{
         console.log(val.thisSendNumber)
       })
          this.currentPagexxx = val;
      },
      getStoreBySku(skuId){
        this.$axios.get(`/api/stock/multi?skuIds=${[skuId]}`).then(res=>{
          // console.log(res)
          // console.log(res.data.data[0].inStorage)
          return res.data.data[0].inStorage
        })
      },
      showEditTable(index,row){
        this.editSkuTableData = []
        this.editForm = {
            shopId: '',
            remark: '',
            counts:[]
        }
        this.editTableVisible = true
        this.editCode = row.code
        this.$axios.get('/api/distribute/'+row.code).then(res=>{
          // console.log(res.data.data)
          // for(let i of res.data.data.items){
          //   i.thisSendNumber = i.bookCount - i.consignCount
          //   this.gridData.push(i)
          // }
          // this.loading = false
          
          this.editShopName = res.data.data.shopName
          this.editForm.remark = res.data.data.remark
          this.editForm.shopId = res.data.data.shopId
          // this.editForm.counts = res.data.data.items

          this.editSkuTableData = res.data.data.items
          this.editSkuTableData.forEach((val,ind)=>{
            val.count = val.bookCount
            val.brandName = val.brand
            val.id = val.skuId
          })
        })
      },
      submitEdit() {
        // console.log(this.editSkuTableData)
        this.editSkuTableData.forEach((val,ind)=>{
          this.editForm.counts.push({count:parseInt(val.count),skuId:val.id,itemId:val.itemId})
        })
        // console.log(this.editForm)
        this.$axios.post(`/api/distribute/${this.editCode}/modify`,this.editForm).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            this.editTableVisible = false
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
        })
      },
      refreshData(){
        this.params.shopId = ''
        this.getInfo()
      },
      msgCreateOpen() {
        this.$message({
          message:this.msgCreate,
          type:this.msgType,
          showClose: true
        });
      },
      deleteRowInfo(index){
          this.skuTableData.splice(index,1)
      },
      editDeleteRowInfo(index){
          this.editSkuTableData.splice(index,1)
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
        this.$axios.get('/api/distribute/all/supply',{params:this.params}).then(res=>{
          if(res.data.code == 200){
            console.log(res.data.data)
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
      showErpSender(index,row){
        this.sendDisable = false
        this.pagesizexxx = 10
        this.currentPagexxx = 1
        this.isERP = true
        this.loading = true
        this.dialogTableVisible = true
        this.gridData = []
        this.multipleSelection = []
        this.allGridData = []
        this.allData = []
        this.filterItem.isStoreMoreThanZero = false
        this.filterItem.isNotSenderNumMoreThanZero = false
        let skuArr = []
        this.$axios.get('/api/distribute/'+row.code).then(res=>{
            this.totalxxx = res.data.data.items.length
            res.data.data.items.forEach((val,ind)=>{
                skuArr.push(val.skuId)
                val.thisSendNumber = 0
            })
            this.$axios.get(`/api/stock/multi?skuIds=${skuArr}`).then(skus=>{
                res.data.data.items.forEach((value,index)=>{
                  value.inStorage = 0
                })
                skus.data.data.forEach((val,ind)=>{
                    res.data.data.items.forEach((value,index)=>{
                        if(value.skuId == val.skuId){
                            try{
                                value.inStorage = val.inStorage
                            }catch(e){
                                value.inStorage = 0
                            }
                        }
                        if(value.inStorage > value.bookCount - value.consignCount){
                            value.thisSendNumber = value.bookCount - value.consignCount
                        }else{
                            value.thisSendNumber = value.inStorage
                        }
                    })
                })
                this.gridData = res.data.data.items
                res.data.data.items.forEach((res,ind)=>{
                    this.allGridData.push(res)
                })
                this.loading = false
            })
            this.remark = res.data.data.remark 
            this.sendCode = res.data.data.code
          })
      },
      showDetail(index, row) {
          this.pagesizexxx = 10
          this.currentPagexxx = 1
          this.isERP = false
          this.loading = true
          this.dialogTableVisible = true
 
          this.multipleSelection = []
          this.gridData =[]
          this.allGridData = []
          this.allData = []

          
        let skuArr = []

        this.$axios.get('/api/distribute/'+row.code).then(res=>{
            this.totalxxx = res.data.data.items.length

            // console.log(res.data.data)
            res.data.data.items.forEach((val,ind)=>{
                skuArr.push(val.skuId)
            })

            // console.log(skuArr)

            this.$axios.get(`/api/stock/multi?skuIds=${skuArr}`).then(skus=>{
                // console.log(skus.data.data)
                res.data.data.items.forEach((value,index)=>{
                  value.inStorage = 0
                })
                skus.data.data.forEach((val,ind)=>{
                    res.data.data.items.forEach((value,index)=>{
                        
                        if(value.skuId == val.skuId){
                            try{
                                value.inStorage = val.inStorage
                            }catch(e){
                                value.inStorage = 0
                            }
                        }
                        if(value.inStorage > value.bookCount){
                            value.thisSendNumber = value.bookCount - value.consignCount
                        }else{
                            value.thisSendNumber = value.inStorage
                        }
                    })
                })
                this.gridData = res.data.data.items
                // this.allGridData = res.data.data.items
                res.data.data.items.forEach((res,ind)=>{
                    this.allGridData.push(res)
                })
                this.loading = false
                console.log(res.data.data.items)
            })
            this.remark = res.data.data.remark 
            this.sendCode = res.data.data.code
            
          })
      },
      submitCheck(a,b){
        this.$axios.put(`/api/distribute/${b.code}/verify`).then((res)=>{
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
      checkPass(a,b){
          this.$axios.put(`/api/distribute/${b.code}/verify/success`).then((res)=>{
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
      checkReject(a,b){
          this.$axios.put(`/api/distribute/${b.code}/verify/failure?reason='拒绝通过'`).then((res)=>{
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
      submitCreate() {
        this.skuTableData.forEach((val,ind)=>{
          this.form.counts.push({count:parseInt(val.count),skuId:val.id,itemId:val.itemId})
        })
        this.$axios.post('/api/distribute/create/supply',this.form).then((res)=>{
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
      addDetailInfo(){
        this.form.counts.push({})
      },
      closeCreateTable(){
        this.createTableVisible = false
      },
      createErpPlanShow() {
          this.$confirm('是否确认', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.createErpPlan()
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消删除'
              });          
          });
      },
      createErpPlan(){
        let arr = []
        this.multipleSelectionIndexTable.forEach((res)=>{
          arr.push(res.code)
        })
        
        if(arr.length > 0){
          this.$axios.put('/api/distribute/produce/plan?codes='+arr).then((res)=>{
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
          this.msgCreate = '请选择一个或多个铺货单'
          this.msgType = 'error'
          this.msgCreateOpen()
        }
      },
      createErpSend(){
        this.sendDisable = true
        this.multipleSelection = this.gridData
        if(this.multipleSelection.length  == 0){
          this.msgCreate = '请至少选择一个sku商品'
          this.msgType = 'error'
          this.msgCreateOpen()
        }else{
          

          let counts =  this.multipleSelection.map((val,ind)=>{
                return {count:val.thisSendNumber,itemId:val.itemId,skuId:val.skuId}
          })

          for(let i = 0;i < counts.length;i ++){
            if(counts[i].count == 0 || counts[i].count == undefined){
              counts.splice(i,1)
              i -- 
            }
          }

          var SendBody = {counts:counts,remark:this.remark}
  
          this.$axios.put(`/api/distribute/${this.sendCode}/send`,SendBody).then((res)=>{
            if(res.data.code == 200){
              this.msgCreate = '操作成功'
              this.msgType = 'success'
              this.multipleSelection = []
              this.gridData =[]
              this.allGridData = []
              this.allData = []
              this.dialogTableVisible = false
              this.msgCreateOpen()
              this.getInfo()
            }else{
              this.msgCreate = res.data.message
              this.msgType = 'error'
              this.msgCreateOpen()
              this.sendDisable = false
            }
          })
        }
      },
      handleSelectionChange(val) {
      //   function unique(array){     
      //           var allArr = [];   
      //           for(var i=0;i<array.length;i++){
      //                 var flag = true;
      //           　    for(var j=0;j<allArr.length;j++){
      //                 if(array[i].barcode == allArr[j].barcode){
      //           　　　　　   flag = false;
      //           　　    };
      //           };
      //           if(flag){
      //           　　allArr.push(array[i]);
      //           };
      //     };
      //       return allArr;
      //     }　　
      //   val.forEach((value,index)=>{
      //     this.multipleSelection.push(value);
      //   })
        
      //  this.multipleSelection = unique(this.multipleSelection)

       console.log(this.multipleSelection)
      },
      handleSelectionChangeIndexTable(val){
        this.multipleSelectionIndexTable = val;
      },
      //触发自定义事件的方法
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

          let len1 = this.skuTableData.length
          this.skuTableData = unique(arr)
          let len2 = this.skuTableData.length

          if((len1 - len2) > 0 ){
            this.msgCreate = `有${len1-len2}个sku重复插入`
            this.msgType = 'error'
            this.msgCreateOpen()
          }
      },
      editInsertSkuData(data){
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

          let arr = this.editSkuTableData
          
          data.forEach((value,index)=>{
            arr.push(value)
          })
          let len1 = this.editSkuTableData.length
          this.editSkuTableData = unique(arr)
          let len2 = this.editSkuTableData.length
          if((len1 - len2) > 0 ){
            this.msgCreate = `有${len1-len2}个sku重复插入`
            this.msgType = 'error'
            this.msgCreateOpen()
          }
      },
      GetShopIdFromChild(data){
        this.form.shopId = data.shopId
        this.addShopName = data.shopName
      },
      EditGetShopIdFromChild(data){
        this.editForm.shopId = data.shopId
        this.editShopName = data.shopName
      },
      GetShopIdFromChildSearch(data){
        this.searchDataIndex.shopId = data
      }
    },
    mounted(){
       this.getInfo()
    }
  }
</script>

<style scoped>
 .tableRowInfo{
   border: 1px solid #eee;
   padding: 10px;
   
 }
 .rowInfoP{
   font-size: 20px;
   padding-bottom: 20px;
   font-weight: bolder
 }
</style>
