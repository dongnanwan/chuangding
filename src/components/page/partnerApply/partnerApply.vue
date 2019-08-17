<template>
    <div>
        <div style="padding-bottom:8px">
            
            <div style="margin-bottom:8px">
                <el-button type="primary" @click="createNew()" plain icon="el-icon-plus">创建</el-button>
                <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
            </div>
            
            <div>
                <el-select v-model="params.status"  placeholder="状态" class="searchItems"> 
                    <el-option label="新建" value="Created"></el-option>
                    <el-option label="申请中" value="Verifying"></el-option>
                    <el-option label="成功" value="Verify_Success"></el-option>
                    <el-option label="失败" value="Verify_Failure"></el-option>
                    <el-option label="取消" value="Canceled "></el-option>
                </el-select>

                <el-input v-model="params.memberId" placeholder="会员ID" class="searchItems"></el-input>

                <el-button @click="search()" type="primary" plain="" icon="el-icon-search">搜索</el-button>
            </div>
        </div>
        
        <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)">
            <el-table-column show-overflow-tooltip min-width="200" prop="status" label="状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status == 'Verify_Failure'">拒绝</span> 
                    <span v-else-if="scope.row.status == 'Verify_Success'">成功</span>
                    <span v-else-if="scope.row.status == 'Verifying'">申请中</span>
                    <span v-else>{{scope.row.status}}</span>
                </template> 
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="200" prop="applyTime" label="申请时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.applyTime">{{new Date(scope.row.applyTime).toLocaleString()}}</span>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="200" prop="memberId" label="申请会员id"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="200" prop="memberNick" label="申请会员"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="200" prop="memberTelephone" label="会员电话"></el-table-column>
            <el-table-column show-overflow-tooltip min-width="200" prop="agreeTime" label="同意申请时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.agreeTime">{{new Date(scope.row.agreeTime).toLocaleString()}}</span>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="200" prop="rejectTime" label="拒绝时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.rejectTime">{{new Date(scope.row.rejectTime).toLocaleString()}}</span>
                    <span v-else></span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip min-width="200" prop="rejectReason" label="拒绝理由"></el-table-column>
            <el-table-column show-overflow-tooltip fixed="right" label="操作" width="145">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="success"
                        plain=""
                        @click="showPass(scope.$index, scope.row)">同意</el-button>
                    <el-button
                        size="mini"
                        type="danger"
                        plain=""
                        @click="showReject(scope.$index, scope.row)">拒绝</el-button>
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
                    <h2>创建</h2>
                </div>
                <div style="height:40px;">
              
                    <div style="position:absolute">
                        <vipInput-app @OnGetDataFromChild='getVipIdFromChild'></vipInput-app>
                    </div>
                </div>
            </el-card>
            <el-button type="primary" @click="submitCreateNew">创建</el-button>
            <el-button @click="closeCreateTable()">取消</el-button>  
        </el-dialog>
    </div>
</template>

<script>
    import ShopIdInput from '../../common/ShopIdInput.vue'
    import vipInput from '../../common/vipInput.vue'
    export default {
        data(){
            return {
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
                },
                shopNameOptions:[],
                multipleSelection: [],
                msgCreate:'msg',
                msgType:'success',
                addVipId:'',
                reason:''
            }
        },
        components:{
            'ShopIdInput-app':ShopIdInput,
            'vipInput-app':vipInput
        },
        computed:{
            status(){
                return 123
            }
        },
        methods:{
            search(){
                this.getInfo()
            },
            getVipIdFromChild(data){
                this.addVipId = data
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
                this.$axios.get('/api/virtual/partner',{params:this.params}).then(res=>{
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
            createNew(){
                this.createTableVisible = true
            },
            submitCreateNew() {
                this.$axios.post(`/api/virtual/partner?memberId=${this.addVipId}`).then((res)=>{
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
            GetShopIdFromChild(data){
                this.form.shopId = data
            },
            showPass(index,row) {
                this.$confirm('是否确认通过?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   this.checkPass(index,row)
                }).catch(() => {
                             
                });
            },
            showReject(index,row) {
                this.$prompt('请输入拒绝理由', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(({ value }) => {
                    this.reason = value
                    this.checkReject(index,row)
                }).catch(() => {
                       
                });
            },
            checkPass(index,row){
                this.$axios.put(`/api/virtual/partner/${row.id}/agree?reason=${this.reason}`).then((res)=>{
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
                this.$axios.put(`/api/virtual/partner/${row.id}/reject`).then((res)=>{
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
            }
        },
        mounted(){
            this.getInfo()
        }
    }
</script>

<style scoped>
.searchItems{
    width:200px;
}
</style>

