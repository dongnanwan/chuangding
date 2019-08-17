<template>
  <div>
      <div style="height:40px">
        <div style="float:left">
          <el-button type="primary" plain @click="dataFit()">数据同步</el-button>
          <el-button type="warning" plain="" @click="refreshData()">刷新</el-button>
        </div>
      </div>

      <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row
        v-loading="indexLoading"
        element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
      >
        <el-table-column show-overflow-tooltip prop="id" label="ID" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="尺寸" min-width="80"></el-table-column>
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
        this.$axios.get('/api/size',{params:this.params}).then(res=>{
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
      dataFit(){
        this.indexLoading = true
        this.$axios.get(`/api/import/size`).then(res=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
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

