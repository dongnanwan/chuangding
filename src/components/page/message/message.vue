<template>
  <div>
        <div style="height:40px">
            <div style="float:left">
                <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
            </div>
        </div>

        <el-table :data="indexGridData" style="width: 100%"  border highlight-current-row
            height="600"
            v-loading="indexLoading"
            element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            >
            <el-table-column show-overflow-tooltip prop="id" label="ID" min-width="90"></el-table-column>
            <el-table-column show-overflow-tooltip prop="notificationType" label="通知类型" min-width="80"></el-table-column>
            <el-table-column show-overflow-tooltip prop="pushId" label="推送对象" min-width="60"></el-table-column>
            <el-table-column show-overflow-tooltip prop="msgContent" label="消息内容" min-width="300"></el-table-column>
            <el-table-column show-overflow-tooltip label="消息创建时间" min-width="110">
                <template slot-scope="scope">
                    {{new Date(scope.row.createDate).toLocaleString()}}
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="isRead" label="是否已读" min-width="80">
                <template slot-scope="scope">
                    <span v-if='scope.row.isRead == 0'>否</span>
                    <span v-else-if='scope.row.isRead == 1'>是</span>
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
            indexGridData:[],
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
            this.$axios.get(`/api/message/all?userId=${sessionStorage.getItem("user_id")}`,{params:this.params}).then(res=>{
                console.log(res.data.data)
                if(res.data.code == 200){
                    this.indexGridData = res.data.data.data
                    this.total = res.data.data.total
                    this.indexLoading = false
                        let unreadyMsg = 0
                    res.data.data.data.forEach((val,ind)=>{
                        if(val.isRead == 0){
                            unreadyMsg ++
                        }
                    })
                    console.log(unreadyMsg)
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

