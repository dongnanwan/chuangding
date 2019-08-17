<template>
    <div>
        <div style="height:40px">
            <div style="float:left">
                <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
                <el-button type="primary" plain="" @click="createTableVisible = true" icon="el-icon-plus">添加</el-button>
            </div>
        </div>

        <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row
            v-loading="indexLoading"
            element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
        >
            <el-table-column show-overflow-tooltip fixed prop="id" label="ID" min-width="60"></el-table-column>
            <el-table-column show-overflow-tooltip prop="name" label="用户名" min-width="120"></el-table-column>
            <el-table-column show-overflow-tooltip prop="status" label="是否启用" min-width="120">
                <template slot-scope="scope">
                    <span v-if='scope.row.status == true'>是</span>
                    <span v-else-if='scope.row.status == false'>否</span>
                    <span v-else>{{scope.row.status}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="sysName" label="角色" min-width="300">
                <template slot-scope="scope">
                    <span v-for="item in scope.row.roles" :key="item.id">{{item.name+' '}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="sysName" label="系统名" min-width="120"></el-table-column>
            <el-table-column show-overflow-tooltip label="操作" width="145" fixed="right">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" plain="" @click="showRoleTable(scope.$index,scope.row)">编辑</el-button>
                    <el-button v-if="scope.row.status == false" type="success" size="mini" plain="" @click="openUser(scope.$index,scope.row)">启用</el-button>
                    <el-button v-if="scope.row.status == true" type="danger" size="mini" plain="" @click="closeUser(scope.$index,scope.row)">禁用</el-button>
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

        <el-dialog  :visible.sync="roleTableVisible" class="detailTable" fullscreen @close='roleTableClose()'>
            <el-card shadow="hover" style="margin-top:10px">
                <div slot="header" class="clearfix" style="height:25px"> 
                    <h2>配置用户角色</h2>
                </div>
                <div>
                    <!-- <el-button @click="save()">保存</el-button> -->
                  
                    <el-tree
                        :data="treeData"
                            show-checkbox
                            node-key="id"
                            default-expand-all
                            :default-checked-keys="roleArr"
                            :props="defaultProps"
                            @node-click="handleNodeClick"
                            ref="tree"
                            :check-strictly='true'
                        >
                    </el-tree>
                </div>
            </el-card>
            <el-button @click="saveSetup()" type="primary">保存配置</el-button>
        </el-dialog>

         <!-- 创建弹出框 -->

        <el-dialog  :visible.sync="createTableVisible" class="detailTable"  fullscreen>
            <el-card>
                <div slot="header" class="clearfix" style="height:25px"> 
                <h2>创建一个新用户</h2>
                </div>

                <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
                    <el-form-item label="姓名">
                        <el-input v-model="form.name"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="昵称">
                        <el-input v-model="form.sysName"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="密码">
                        <el-input v-model="form.password"></el-input>
                    </el-form-item>
                    <br>
                    <el-form-item label="手机">
                        <el-input v-model="form.phone"></el-input>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-button  type="primary" plain @click="submitCreateNew">创建</el-button>
            <el-button @click="createTableVisible = false">取消</el-button>
        </el-dialog>
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
            roleTableVisible:false,
            defaultProps: {
                children: 'children',
                label: 'name'
            },
            treeData:[],
            roleArr:[],
            updateRoleId:'',
            roleName:'',
            checkedRoles:[],
            createTableVisible:false,
            form:{}
        }
    },
    methods:{
        openUser(index,row){
            this.$axios.put(`/api/user/update/status/${row.id}?status=true`).then(res=>{
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
        closeUser(index,row){
            this.$axios.put(`/api/user/update/status/${row.id}?status=false`).then(res=>{
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
            this.$axios.delete(`/api/role/delete/${row.id}`).then(res=>{
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
        submitCreateNew(){
            this.$axios.post(`/api/user/add`,this.form).then(res=>{
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
        roleTableClose(){
            console.log('close')
            this.roleArr = []
            // this.roleTableVisible = false
        },
        saveSetup(){
            this.$axios.put('/api/user/update/user-role',{roleId:this.$refs.tree.getCheckedKeys().join(','),id:this.updateRoleId}).then(res=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.roleTableVisible = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        handleNodeClick(data){
            console.log(data)
        },
        showRoleTable(index,row){
            this.roleArr = []
            this.roleTableVisible = true
            this.updateRoleId = row.id

            this.$axios.get(`/api/role`).then(res=>{
                if(res.data.code == 200){
                    console.log(res.data.data)
                    this.treeData = res.data.data
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            }).then(res=>{
                this.$axios.get(`/api/user/get/user-role?name=${row.name}`).then(res=>{
                    if(res.data.code == 200){
                        this.roleArr = res.data.data.split(',')
                    }else{
                        this.msgCreate = res.data.message
                        this.msgType = 'error'
                        this.msgCreateOpen()
                    }
                })
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
            this.$axios.get('/api/user',{params:this.params}).then(res=>{
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
        }
    },
    mounted(){
        this.getInfo()
    }
}
</script>

<style scoped>
 
</style>

