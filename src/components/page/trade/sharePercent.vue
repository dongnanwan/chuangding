<template>
  <div>
    <div style="height:40px">
        <div style="float:left">
            <el-button type="primary" plain @click="createNew()">创建</el-button>
            <el-button type="warning" plain="" @click="refreshData()">刷新</el-button>
        </div>
    </div>
    
    <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row v-loading="indexLoading" element-loading-text="数据加载中......"
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
        <el-table-column show-overflow-tooltip min-width="100" prop="shop.name" label="门店"></el-table-column>
        
        <el-table-column show-overflow-tooltip min-width="80" prop="salesNum" label="销售数量"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" prop="salesAmount" label="实销金额"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="80" prop="salesAmount" label="分润金额"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="companyProfit" label="公司分成"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="shop.manager.name" label="金牌店长"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="managerProfit" label="金牌店长分成"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="120" prop="shop.partner.name" label="合伙人"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="120" prop="partnerProfit" label="合伙人分成"></el-table-column>

        <el-table-column show-overflow-tooltip width="210"   label="审核">
            <template slot-scope="scope">
                <el-button
                size="mini"
                plain=""
                type="warning"
                @click="submitCheck(scope.$index, scope.row)">提交</el-button>
                <el-button
                size="mini"
                plain=""
                type="success"
                @click="checkPass(scope.$index, scope.row)">通过</el-button>

                <el-button
                size="mini"
                plain=""
                type="danger"
                @click="checkReject(scope.$index, scope.row)">拒绝</el-button>
            </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip width="80" fixed="right"  label="操作">
            <template slot-scope="scope">
                <el-button
                size="mini"
                type="primary"
                plain
                @click="settle(scope.$index, scope.row)">结算</el-button>
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
                <h2>单据基本信息</h2>
            </div>
            <el-form ref="form" :model="form" label-width="80px" :inline="false"  class="demo-form-inline">
                <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:12px">选择店铺</p>
                    <div style="float:left;padding-left:12px">
                        <ShopIdInput-app @OnGetShopIdFromChild='GetShopIdFromChild'></ShopIdInput-app>
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
                    <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>
                </el-form>
        </el-card>  

        <el-button type="primary" @click="submitCreate()" plain>创建</el-button>
        <el-button type="primary" @click="closeCreateTable()" plain>取消</el-button>
    </el-dialog>

  </div>
</template>

<script>
import ShopIdInput from '../../common/ShopIdInput.vue'
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
        }
    },
    components:{
        'ShopIdInput-app':ShopIdInput
    },
    methods:{
        refreshData(){
            this.getInfo()
        },
        settle(index,row){
            this.$axios.put(`/api/settlement/settle/${row.id}`).then((res)=>{
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
        showErpSender(index,row){
            this.isERP = true
            this.loading = true
            this.dialogTableVisible = true
            this.gridData = []
            
            this.$axios.get('/api/distribute/'+row.code).then(res=>{
                for(let i of res.data.data.items){
                    i.thisSendNumber = i.bookCount - i.consignCount
                    this.gridData.push(i)
                }
                this.loading = false
                this.remark = res.data.data.remark 
                this.sendCode = res.data.data.code
                
            })
        },
        submitCheck(index,row){
            this.$axios.put(`/api/settlement/commit/${row.id}`).then((res)=>{
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
        checkPass(index,row){
            this.$axios.put(`/api/settlement/audit/${row.id}?isPassed=true`).then((res)=>{
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
            this.$axios.put(`/api/settlement/audit/${row.id}?isPassed=false`).then((res)=>{
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
            this.$axios.post(`/api/settlement/create?beginTime=${this.form.beginTime.getTime()}&endTime=${this.form.endTime.getTime()}&shopId=${this.form.shopId}`).then((res)=>{
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
            this.form.shopId = data
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
