<template>
  <div>
      <div style="height:40px">
        <div style="float:left">
          <!-- <el-button type="primary" plain @click="dataFit()">数据同步</el-button> -->
          <el-button type="primary" plain @click="createTableVisible = true;form.fileKeys = ''" icon="el-icon-plus">添加</el-button>
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
        <el-table-column show-overflow-tooltip prop="id" label="ID" min-width="80"></el-table-column>
        <el-table-column label="图片"  min-width="80">
          <template slot-scope="scope">
            <img v-if="scope.row.fileKey" :src="'https://img.chuangdingshop.com/' + scope.row.fileKey"  width="30" height="30" class="am-img-thumbnail">
            <p v-else>暂无图片</p>
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="145" fixed="right">
          <template slot-scope="scope">
          <el-button
            size="mini"
            type="primary"
            plain
            @click="showEditDialog(scope.$index, scope.row)">编辑</el-button>
          <el-button
            size="mini"
            type="primary"
            plain
            @click="showDeleteDialog(scope.$index, scope.row)">删除</el-button>
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

       <!-- 编辑出框 -->

      <el-dialog :visible.sync="createTableVisible"  fullscreen>
        <el-card>
          <div slot="header" class="clearfix" style="height:25px"> 
            <h2>编辑内容</h2>
          </div>
          <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
            
            <el-form-item label="图片">
              <div>
                <img width="100" height="100" :src="'https://img.chuangdingshop.com/' + form.fileKeys" v-if="form.fileKeys">
                <span v-else>暂无图片</span>
              </div>
            </el-form-item>

            <br>

            <el-form-item label="修改图片">
              <el-upload
                class="avatar-uploader"
                action="/api/upload"
                :show-file-list="false"
                accept="JPG, JPEG, PNG"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload"
                :headers="myHeaders"
                >
                <img v-if="imageUrl" :src="'https://img.chuangdingshop.com/' + imageUrl" class="avatar">
              </el-upload>
            </el-form-item>

          </el-form>
        </el-card>
        <el-button type="primary" @click="submitCreateNew">提交</el-button>
        <el-button @click="closeCreateTable()">取消</el-button>
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
        createTableVisible: false,
        form:{},
        myHeaders: {Authorization:''},
        imageUrl:'',
        editName:''
      }
    },
    methods:{
      showDeleteDialog(index,row){
        this.$axios.delete(`/api/poster/delete/${row.id}`,{params:this.params}).then(res=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.getInfo()
            this.msgCreateOpen()
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
          }
        })
      },
      refreshData(){
        this.getInfo()
      },
      handleAvatarSuccess (res, file) {
        if (res.code === 200) {
          this.imageUrl = res.data
          this.form.fileKeys =  this.imageUrl
        }
      },
      beforeAvatarUpload (file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG|PNG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      submitCreateNew() {
        this.$axios.post(`/api/poster/save?fileKeys=${this.form.fileKeys}`).then(res=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            this.createTableVisible = false
            this.loading = false
            this.form.id = ''
            this.form.fileKeys = ''
            this.imageUrl = ''
          }else{
            this.msgCreate = res.data.message
            this.msgType = 'error'
            this.msgCreateOpen()
            this.loading = false
          }
        })
      },
      closeCreateTable(index,row){
        this.createTableVisible = false
      },
      showEditDialog(index,row){
        this.imageUrl = ''
        this.createTableVisible = true
        this.form.fileKeys = row.fileKey
        this.form.id = row.id
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
        this.$axios.get('/api/poster/list',{params:this.params}).then(res=>{
          if(res.data.code == 200){
            console.log(res.data)
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
      this.myHeaders.Authorization = 'Authorization'+' '+window.sessionStorage['token']
    }
  }
</script>

<style scoped>

</style>

