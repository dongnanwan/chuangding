<template>
    <div>
        <div style="height:40px">
        <div style="float:left">
            <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
        </div>
        </div>

        <el-table :data="items" style="width: 100%"  border highlight-current-row
            height="600"
            v-loading="indexLoading"
            element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <el-table-column show-overflow-tooltip prop="memberId" label="会员ID" min-width="80"></el-table-column>
            <el-table-column show-overflow-tooltip prop="type" label="类型" min-width="80">
                <template slot-scope="scope">
                    <span v-if="scope.row.type == 'PERSONAL'">个人</span>
                    <span v-else-if="scope.row.type == 'WX_GROUP'">微信群</span>
                    <span v-else-if="scope.row.type == 'MINI_PROGRAM'">小程序</span>
                    <span v-else>{{scope.row.type}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="originCodeUrl" label="原码内容" min-width="80">
                <template slot-scope="scope">
                    <img v-if="scope.row.originCodeUrl" :src="'https://img.chuangdingshop.com/' + scope.row.originCodeUrl" :alt="scope.row.title" width="25" height="25" class="am-img-thumbnail">
                    <p v-else>暂无图片</p>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="livingCode" label="活码地址" min-width="80">
                <template slot-scope="scope">
                    <img v-if="scope.row.livingCode" :src="'https://img.chuangdingshop.com/' + scope.row.livingCode" :alt="scope.row.title" width="25" height="25" class="am-img-thumbnail">
                    <p v-else>暂无图片</p>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="创建时间" min-width="80">
                <template slot-scope="scope">
                    <span v-if="scope.row.create">{{new Date(scope.row.create).toLocaleString()}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip  label="操作" width="80">
                <template slot-scope="scope">
                    <el-button type="danger"  @click="showDelete(scope.$index,scope.row)" >删除</el-button>
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
                page:1
            },
            indexLoading:true,
            msgCreate:'msg',
            msgType:'success',
        }
    },
    methods:{
        showDelete(index,row){
            this.$confirm('确认删除?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.deleteOne(index,row)
            }).catch(() => {     
            });
        },
        deleteOne(index,row){
            this.$axios.delete(`/api/share-code/delete/${row.id}`,{params:this.params}).then(res=>{
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
            this.$axios.get('/api/share-code/list',{params:this.params}).then(res=>{
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
        }
    },
    mounted(){
        this.getInfo()
    }
}
</script>

<style scoped>
 
</style>

