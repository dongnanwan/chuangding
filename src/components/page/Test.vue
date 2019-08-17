<template>
  <div>
    <div style="height:40px">
      <div style="float:left">
        <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
      </div>
    </div>

    <el-table :data="items" style="width: 100%"  border highlight-current-row
      v-loading="indexLoading"
      element-loading-text="数据加载中......"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      <el-table-column show-overflow-tooltip prop="id" label="ID" min-width="80"></el-table-column>
      <el-table-column show-overflow-tooltip prop="name" label="角色" min-width="150"></el-table-column>
      <el-table-column show-overflow-tooltip label="操作" width="125">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" plain="" @click="showRoleTable(scope.$index,scope.row)">配置角色权限</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog  :visible.sync="roleTableVisible" class="detailTable" fullscreen>
      <el-card shadow="hover" style="margin-top:10px">
        <div slot="header" class="clearfix" style="height:25px"> 
          <h2>配置角色权限</h2>
        </div>
        <div>
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
          label: 'label'
        },
        treeData:[],
        roleArr:[],
        updateRoleId:''
      }
    },
    methods:{
      saveSetup(){
        this.$axios.put('/api/role/update/role-permission',{permissionId:this.$refs.tree.getCheckedKeys().join(','),id:this.updateRoleId}).then(res=>{
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
        // this.treeData = []
        this.roleArr = []
        this.roleTableVisible = true
        this.updateRoleId = row.id
        this.$axios.get(`/api/permission`).then(res=>{
          if(res.data.code == 200){
            this.treeData = res.data.data
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
        }).then(res=>{
          this.$axios.get(`/api/role/get/role-permission/${row.id}`).then(res=>{
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
        this.$axios.get('/api/role',{params:this.params}).then(res=>{
          if(res.data.code == 200){
            this.items = res.data.data
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

