<template>
  <div>
      <div style="height:40px">
        <div style="float:left">
          <el-button type="primary" plain @click="dataFit()">数据同步</el-button>
          <el-button type="warning" plain="" @click="refreshData()">刷新</el-button>
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
        <el-table-column show-overflow-tooltip prop="name" label="品牌" min-width="80"></el-table-column>
        <el-table-column label="图片"  min-width="80">
          <template slot-scope="scope">
            <img v-if="scope.row.icoUrl" :src="'https://img.chuangdingshop.com/' + scope.row.icoUrl"  width="30" height="30" class="am-img-thumbnail">
            <p v-else>暂无图片</p>
          </template>
        </el-table-column>
        <el-table-column  label="操作" width="80" fixed="right">
          <template slot-scope="scope">
          <el-button
              size="mini"
              type="primary"
              plain
              @click="showEditDialog(scope.$index, scope.row)">编辑</el-button>
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
            <el-form-item label="名称">
              <input type="text" v-model="form.name" disabled style="width:200px;height:30px;border-radius:5px">
            </el-form-item>

            <br>
            <el-form-item label="图片">
              <div>
                <img width="100" height="100" :src="'https://img.chuangdingshop.com/' + form.icoUrl" v-if="form.icoUrl">
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
        <el-button type="primary" @click="submitCreateNew">修改</el-button>
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
            page:1,
            pid:13,
            name:''
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
      refreshData(){
        this.getInfo()
      },
      handleAvatarSuccess (res, file) {
        if (res.code === 200) {
          this.imageUrl = res.data
          this.form.icoUrl =  this.imageUrl
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
        this.$axios.post('/api/series',this.form).then(res=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            this.loading = false
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
        this.form.name = row.name
        this.form.icoUrl = row.icoUrl
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
        this.$axios.get('/api/series',{params:this.params}).then(res=>{
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
        this.$axios.get(`/api/import/series`).then(res=>{
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
      this.myHeaders.Authorization = 'Authorization'+' '+window.sessionStorage['token']
    }
  }
</script>

<style scoped>

</style>

