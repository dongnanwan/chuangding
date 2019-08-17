<template>
    <div>
        <div>
            <div style="margin-bottom:10px">
                <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
            </div>
            <div style="margin-bottom:10px">
                <el-select v-model="params.status">
                    <el-option label="已取消" value="Cancelled"></el-option>
                    <el-option label="成功" value="Completed"></el-option>
                    <el-option label="待处理" value="Drawing"></el-option>
                    <el-option label="显示全部" value=""></el-option>
                </el-select>
                <el-input v-model="params.memberId" placeholder="请输入会员ID" style="width:200px"></el-input>
                <el-button type="primary" @click="search()" icon="el-icon-search" plain="">搜索</el-button>
            </div>
        </div>

        <el-table :data="items" style="width: 100%"  border highlight-current-row
            height="600"
            v-loading="indexLoading"
            element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <el-table-column show-overflow-tooltip prop="code" label="提现单单号" min-width="180"></el-table-column>
            <el-table-column show-overflow-tooltip prop="status" label="提现状态" min-width="80">
                <template slot-scope="scope">
                    <span v-if='scope.row.status == "Cancelled"'>已取消</span>
                    <span v-else-if='scope.row.status == "Completed"'>成功</span>
                    <span v-else-if='scope.row.status == "Drawing"'>待处理</span>
                    <span v-else>{{scope.row.status}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="memberId" label="会员id" min-width="70"></el-table-column>
            <el-table-column show-overflow-tooltip prop="accountId" label="账户id" min-width="240"></el-table-column>
            <el-table-column show-overflow-tooltip prop="amount" label="提现金额" min-width="70"></el-table-column>
            <el-table-column show-overflow-tooltip prop="cardNo" label="银行卡账号" min-width="240"></el-table-column>
            <el-table-column show-overflow-tooltip prop="cardOwner" label="开户名" min-width="80"></el-table-column>
            <el-table-column show-overflow-tooltip prop="cardBank" label="开户行" min-width="80"></el-table-column>
            <el-table-column show-overflow-tooltip prop="payNo" label="交易流水" min-width="240"></el-table-column>
            <el-table-column show-overflow-tooltip prop="reason" label="拒绝理由" min-width="180"></el-table-column>
            <el-table-column show-overflow-tooltip prop="createdOn" label="创建时间" min-width="150">
                <template slot-scope="scope">
                    <span>{{new Date(scope.row.createdOn).toLocaleString()}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="completedOn" label="完成时间" min-width="150">
                <template slot-scope="scope">
                    <span>{{new Date(scope.row.completedOn).toLocaleString()}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip fixed="right" label="操作" width="193">
                <template slot-scope="scope">
                    <el-button
                        :disabled="scope.row.status == 'Completed'"
                        size="mini"
                        type="success"
                        plain
                        @click="showPass(scope.$index, scope.row)">确认提现</el-button>
                    <el-button
                        :disabled="scope.row.status == 'Completed'"
                        size="mini"
                        type="danger"
                        plain=""
                        @click="showReject(scope.$index, scope.row)">拒绝提现</el-button>
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
export default {
    data(){
        return {
            items:[],
            total:0,
            pageSizes:[10, 20],
            params:{
                size:10,
                page:1,
                memberId:''
            },
            indexLoading:true,
            msgCreate:'msg',
            msgType:'success',
            reason:'',
            payNo:''
        }
    },
    methods:{
        search(){
            this.params.page = 1
            this.getInfo()
        },
        showPass(index,row){
            this.$prompt('请输入流水单号', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
            }).then(({ value }) => {
                 this.payNo = value
            }).then(()=>{
                this.pass(index,row)
            }).catch(()=>{

            })
        },
        showReject(index,row) {
            this.$prompt('请输入拒绝理由', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(({ value }) => {
                this.reason = value
            }).then(()=>{
                this.reject(index,row)
            }).catch(()=>{
                
            })
        },
        pass(index,row){
            this.$axios.put(`/api/withdraw/${row.code}/complete?payNo=${this.payNo}`).then(res=>{
                if(res.data.code == 200){
                    this.$message({
                        type: 'success',
                        message:'操作成功'
                    });
                    this.getInfo()
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                    this.indexLoading = false
                }
            })
        },
        reject(index,row){
            this.$axios.put(`/api/withdraw/${row.code}/cancel?reason=${this.reason}`).then(res=>{
                if(res.data.code == 200){
                    this.$message({
                        type: 'success',
                        message:'操作成功'
                    });
                    this.getInfo()
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                    this.indexLoading = false
                }
            })
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
        getInfo(){
            this.indexLoading = true
            this.$axios.get('/api/withdraw',{params:this.params}).then(res=>{
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
    },
    mounted(){
        this.getInfo()
    }
}
</script>

<style scoped>
 
</style>

