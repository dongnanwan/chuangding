<template>
  <div>
    <div style="height:40px">
        <div style="float:left">
            <el-button type="primary" plain @click="createNew()" icon="el-icon-plus">创建</el-button>
            <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
        </div>
    </div>

    <div style="margin-bottom:10px">
        <el-date-picker
            v-model="searchData.beginTime"
            type="datetime"
            placeholder="开始日期">
        </el-date-picker>

        <el-date-picker
            v-model="searchData.endTime"
            type="datetime"
            
            placeholder="结束日期">
        </el-date-picker>

        <el-button type="primary"  @click="search()" plain="" icon="el-icon-search">查询</el-button>
    </div>
    
    <el-table :data="items" style="width: 100%" height="600" show-summary  border highlight-current-row v-loading="indexLoading" element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        
        <el-table-column show-overflow-tooltip min-width="150" prop="" label="开始时间">
            <template slot-scope="scope">
                <span>{{new Date(scope.row.beginTime).toLocaleString()}}</span>
            </template>
        </el-table-column>
        
        <el-table-column show-overflow-tooltip min-width="150" prop="" label="结束时间">
            <template slot-scope="scope">
                <span>{{new Date(scope.row.endTime).toLocaleString()}}</span>
            </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip min-width="80" prop="shop.regionName" label="区域"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" prop="shop.provinceName" label="省份"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" prop="shop.partner.name" label="合伙人"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" prop="shop.manager.name" label="店长"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="160" prop="shop.name" label="门店"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" prop="cardAmount" label="售卡额"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" prop="rechargeAmount" label="储值额"></el-table-column>

        <el-table-column show-overflow-tooltip  label="金牌店长收益" align="center" width="300">
            <el-table-column show-overflow-tooltip prop="managerMemberProfit" label="会员收益" width="100" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="managerTurnoverProfit" label="营业额分成" width="100" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip  label="合计" prop="totalManagerProfit" width="100" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="managerDeductions" label="扣款" width="100" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip  label="实际分成" prop="totalManagerProfit" width="100" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.managerTurnoverProfit-scope.row.managerDeductions}}</span>
                </template>
            </el-table-column>
        </el-table-column>

        <el-table-column show-overflow-tooltip  label="合伙人收益" align="center" width="300">
            <el-table-column show-overflow-tooltip prop="partnerMemberProfit" label="会员收益" width="100" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="partnerTurnoverProfit" label="营业额分成" width="100" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip  label="合计" width="100" prop="totalPartnerProfit" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="partnerDeductions" label="扣款" width="100" align="center"></el-table-column>
            
             <el-table-column show-overflow-tooltip  label="实际分成" prop="totalManagerProfit" width="100" align="center">
                <template slot-scope="scope">
                    <span>{{scope.row.partnerTurnoverProfit-scope.row.partnerDeductions}}</span>
                </template>
            </el-table-column>
        </el-table-column>

        <el-table-column show-overflow-tooltip min-width="100" prop="memberProfit" label="普通会员收益"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="couponCost" label="成本"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="companyProfit" label="公司收益"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="120" prop="shop.partner.name" label="结算结果">
            <template slot-scope="scope">
                <span v-if='scope.row.status == "UNSETTLE"'>未结算</span>
                <span v-else-if='scope.row.status == "SUCCESS"'>成功</span>
                <span v-else-if='scope.row.status == "FAILED"'>失败</span>
            </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip width="275" fixed="right"  label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                type="primary"
                plain
                @click="showSettle(scope.$index, scope.row)">结算</el-button>
              
            <el-button
                size="mini"
                type="primary"
                plain
                @click="showDetail(scope.$index, scope.row)">售卡</el-button>
            <el-button
                size="mini"
                type="primary"
                plain
                @click="showResult(scope.$index, scope.row)">结果</el-button>
            <el-button
                size="mini"
                type="primary"
                plain
                @click="showEdit(scope.$index, scope.row)">修改</el-button>   
              
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

        <el-card shadow="hover" style="margin-top:10px">
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>创建</h2>
            </div>
            <el-form ref="form" :model="form" label-width="80px" :inline="false"  class="demo-form-inline">
                <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:12px">选择店铺</p>
                    <div style="float:left;padding-left:12px">
                        <ShopIdInput-app @OnGetShopIdsFromChild='GetShopIdFromChild'></ShopIdInput-app>
                    </div>
                </div>

                <el-form-item label="开始时间" style="width:295px">
                  <div class="block">
                      <el-date-picker
                        v-model="form.beginTime"
                        type="datetime"
                        placeholder="选择日期时间">
                      </el-date-picker>
                  </div>
                </el-form-item>

                <el-form-item label="结束时间" style="width:295px">
                  <div class="block">
                  <el-date-picker
                    v-model="form.endTime"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
                  </div>
                </el-form-item>
              </el-form>
        </el-card>  

        <el-button type="primary" @click="submitCreate()" plain>创建</el-button>
        <el-button type="primary" @click="closeCreateTable()" plain>取消</el-button>
    </el-dialog>

    <!-- 修改弹出框 -->

    <el-dialog  :visible.sync="editTableVisible" class="detailTable"  fullscreen>

        <el-card shadow="hover" style="margin-top:10px">
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>修改</h2>
            </div>
            <el-form  label-width="80px" :inline="false"  class="demo-form-inline">
                <el-form-item label="开始时间" style="width:295px">
                  <div class="block">
                      <el-date-picker
                        v-model="editForm.beginTime"
                        type="datetime"
                        placeholder="选择日期时间">
                      </el-date-picker>
                  </div>
                </el-form-item>

                <el-form-item label="结束时间" style="width:295px">
                  <div class="block">
                  <el-date-picker
                    v-model="editForm.endTime"
                    type="datetime"
                    placeholder="选择日期时间">
                  </el-date-picker>
                  </div>
                </el-form-item>
              </el-form>
        </el-card>  

        <el-button type="primary" @click="submitEdit()" plain>修改</el-button>
        <el-button type="primary" @click="editTableVisible = false" plain>取消</el-button>
    </el-dialog>


    <!--售卡明细弹出框 -->

    <el-dialog :visible.sync="detailTableVisible" class="detailTable"  fullscreen>
        <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>售卡明细</h2>
            </div>
            <el-table 
                style="width: 100%"
                border
                :data="detailGridData"
                v-loading="loadingDetail"
                element-loading-text="数据加载中......"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
            >
                <el-table-column prop="shop.regionName" show-overflow-tooltip  label="区域" min-width="150"></el-table-column>
                <el-table-column prop="shop.provinceName" show-overflow-tooltip  label="省份" min-width="100"></el-table-column>
                <el-table-column prop="shop.partner.name" show-overflow-tooltip  label="合伙人" min-width="100"></el-table-column>
                <el-table-column prop="shop.name" show-overflow-tooltip  label="门店" min-width="100"></el-table-column>
                <el-table-column show-overflow-tooltip  label="日期" min-width="180">
                    <template slot-scope="scope">
                        {{new Date(scope.row.createdOn).toLocaleString()}}
                    </template>
                </el-table-column>
                <el-table-column prop="superiorMemberId" show-overflow-tooltip  label="上级会员ID" min-width="100"></el-table-column>
                <el-table-column prop="memberId" show-overflow-tooltip  label="会员ID" min-width="100"></el-table-column>
                <el-table-column prop="identity" show-overflow-tooltip  label="会员身份" min-width="100"></el-table-column>
                <el-table-column show-overflow-tooltip  label="金卡/银卡" min-width="100">
                    <template slot-scope="scope">
                        <span v-if="scope.row.memberVip == 'SILVER'">银卡</span>
                        <span v-else-if="scope.row.memberVip == 'GOLD'">金卡</span>
                        <span v-else>{{scope.row.memberVip}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="amount" show-overflow-tooltip  label="售卡额" min-width="100"></el-table-column>
            </el-table>
        </el-card>
    </el-dialog>

    <!--结算结果弹出框 -->

    <el-dialog :visible.sync="resultTableVisible" class="detailTable"  fullscreen>
        <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>结算结果</h2>
            </div>
        
            <el-table 
                style="width: 100%"
                border
                :data="resultGridData"
                v-loading="resultLoading"
                element-loading-text="数据加载中......"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
            >
                <el-table-column prop="memberId" show-overflow-tooltip  label="会员ID" min-width="100"></el-table-column>
                <el-table-column  show-overflow-tooltip  label="会员身份" min-width="100">
                    <template slot-scope="scope">
                        <span v-if='scope.row.identity == "MANAGER"'>金牌店长</span>
                        <span v-else-if='scope.row.identity == "PARTNER"'>合伙人</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip  label="结算开始时间" min-width="180">
                    <template slot-scope="scope">
                        {{new Date(scope.row.beginTime).toLocaleString()}}
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip  label="结算结束时间" min-width="180">
                    <template slot-scope="scope">
                        {{new Date(scope.row.endTime).toLocaleString()}}
                    </template>
                </el-table-column>
                <el-table-column prop="profit" show-overflow-tooltip  label="收益" min-width="100"></el-table-column>
                <el-table-column  show-overflow-tooltip  label="结算状态" min-width="100">
                    <template slot-scope="scope">
                        <span v-if='scope.row.status == "UNSETTLE"'>未结算</span>
                        <span v-else-if='scope.row.status == "SUCCESS"'>成功</span>
                        <span v-else-if='scope.row.status == "FAILED"'>失败</span>
                         <span v-else>{{scope.row.status}}</span>
                    </template>
                </el-table-column>

                <el-table-column  show-overflow-tooltip  label="操作" width="105">
                    <template slot-scope="scope">
                        <el-button
                            size="mini"
                            type="primary"
                            plain
                            @click="recreate(scope.$index, scope.row)">重新支付</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </el-dialog>

    <!-- 结算操作弹出框 -->
    <el-dialog :visible.sync="settlementTableVisible" class="detailTable"  fullscreen>
        <el-card>
            <div slot="header" class="clearfix" style="height:25px">
                <h2>结算</h2>
            </div>
            <el-form  label-width="80px" :inline="false"  class="demo-form-inline">
                
                <el-form-item label="身份" style="width:295px">
                    <el-select v-model="settleForm.identity" placeholder="请选择身份" style="width:250px" @change="identityChange()">
                        <el-option label="店长" value="MANAGER"></el-option>
                        <el-option label="合伙人" value="PARTNER"></el-option>
                    </el-select>
                </el-form-item>
              

                <div v-if="settleForm.identity == 'MANAGER'">
                    <el-form-item label="开户姓名" style="width:295px">
                        <el-input v-model="rowInfo.shop.manager.cardOwner" :disabled="true" style="width:250px"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="开户银行" style="width:295px">
                        <el-input v-model="rowInfo.shop.manager.cardBank" :disabled="true" style="width:250px"></el-input>
                    </el-form-item>
                    
                    <el-form-item label="银行卡号" style="width:295px">
                        <el-input v-model="rowInfo.shop.manager.cardNo" :disabled="true" style="width:250px"></el-input>
                    </el-form-item>
                </div>
                
                

                <div v-if="settleForm.identity == 'PARTNER'">
                    <el-form-item label="开户姓名" style="width:295px">
                        <el-input v-model="rowInfo.shop.partner.cardOwner" :disabled="true" style="width:250px"></el-input>
                    </el-form-item>
                   
                    <el-form-item label="开户银行" style="width:295px">
                        <el-input v-model="rowInfo.shop.partner.cardBank" :disabled="true" style="width:250px"></el-input>
                    </el-form-item>
                   
                    <el-form-item label="银行卡号" style="width:295px">
                        <el-input v-model="rowInfo.shop.partner.cardNo" :disabled="true" style="width:250px"></el-input>
                    </el-form-item>
                </div>
                
              
                <el-form-item label="流水单号" style="width:295px">
                    <el-input placeholder="请输入流水单号" v-model="settleForm.settlementNum" style="width:250px"></el-input>
                </el-form-item>
            </el-form>
        </el-card>
        <el-button @click="settle()" :disabled="settleDisable" type="primary">确认结算</el-button>
    </el-dialog>

</div>
</template>

<script>
import ShopIdInput from '../../common/ShopIdsInput.vue'
export default {
    data(){
        return {
            value1:'',
            items:[],
            total:0,
            shopId:[],
            pageSizes:[10, 20],
            params:{
                size:10,
                page:1
            },
            createTableVisible: false,
            detailTableVisible:false,
            editTableVisible:false,
            indexLoading:true,
            form: {
                shopId: '',
                beginTime:'',
                endTime:''
            },
            shopNameOptions:[],
            remark:'',
            sendCode:'',
            msgCreate:'msg',
            msgType:'success',
            detailGridData:[],
            loadingDetail:true,
            resultTableVisible:false,
            resultGridData:[],
            resultLoading:true,
            editTableVisible:false,
            editId:'',
            editForm:[],
            searchData:[],
            settlementTableVisible:false,
            settleForm:{},
            rowInfo:{
                shop:{
                    manager:{},
                    partner:{}
                }
            },
            settleDisable:true
        }
    },
    components:{
        'ShopIdInput-app':ShopIdInput
    },
    methods:{
        identityChange(){
            this.settleDisable = false
        },
        search(){
            this.params.page = 1
            if(this.searchData.beginTime){
                this.params.beginTime = this.searchData.beginTime.getTime() 
            }
            if(this.searchData.endTime){
                this.params.endTime = this.searchData.endTime.getTime()
            }
            this. getInfo()
        },
        showEdit(index,row){
            this.editTableVisible = true
            this.editForm = row
            this.editId = row.id
        },
        submitEdit(){
            let beginTime = new Date(this.editForm.beginTime).getTime()
            let endTime = new Date(this.editForm.endTime).getTime()
            this.$axios.post(`/api/settlement/recreate?settlementIds=${this.editId}&beginTime=${beginTime}&endTime=${endTime}`).then((res)=>{
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
        recreate(index,row){
            this.$axios.put(`/api/settlement/settle/${row.id}`).then((res)=>{
                console.log(res)
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
        showDetail(index,row){
            this.detailTableVisible = true
            this.loadingDetail = true
            this.$axios.get(`/api/settlement/buy-card-detail/${row.shopId}`).then(res=>{
                if(res.data.code == 200){
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
        showResult(index,row){
            this.resultTableVisible = true
            this.resultLoading = true
            this.resultGridData = row.credentialList
            this.resultLoading = false
        },
        refreshData(){
            this.getInfo()
        },
        showSettle(index,row){
            this.settleForm = {}
            this.settlementTableVisible = true
            this.settlementId = row.id
            this.rowInfo = row
        },
        settle(){
            if(!this.settleForm.settlementNum){
                this.msgCreate = '请填写流水单号'
                this.msgType = 'error'
                this.msgCreateOpen()
                return
            }
            this.settleDisable = true
            this.$axios.put(`/api/settlement/settle/${this.settlementId}?identity=${this.settleForm.identity}&settlementNum=${this.settleForm.settlementNum}`).then((res)=>{
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
        msgCreateOpen() {
            this.$message({
                message:this.msgCreate,
                type:this.msgType,
                showClose: true
            });
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
            this.$axios.get('/api/settlement/list',{params:this.params}).then(res=>{
              console.log(res.data.data.data)
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
        createNew(){
            this.createTableVisible = true
            this.$axios.get('/api/shop').then((res)=>{
                this.shopNameOptions = res.data.data.data
            })
        },
        submitCreate() {
            this.$axios.post(`/api/settlement/create?beginTime=${this.form.beginTime.getTime()}&endTime=${this.form.endTime.getTime()}&shopIds=${this.form.shopIds}`).then((res)=>{
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
        GetShopIdFromChild(data){
            console.log(data)
            if(data == null){
                this.form.shopIds = ''
            }else{
                this.form.shopIds = data.join(',')
            }
            
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
