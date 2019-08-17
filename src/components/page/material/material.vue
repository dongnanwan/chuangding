<template>
  <div>
      <div style="height:40px">
        <div style="float:left">
          <el-button type="primary" @click="createNew()" plain icon="el-icon-plus">创建</el-button>
          <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
        </div>
      </div>
     
      <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)">
          <el-table-column show-overflow-tooltip min-width="100" prop="title" label="标题"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="120" prop="remark" label="内容"></el-table-column>
          <el-table-column show-overflow-tooltip min-width="80" prop="shopId" label="门店">
            <template slot-scope="scope">
              <span v-if="scope.row.shopList.length > 0" v-for='item in scope.row.shopList'>{{item.name}},</span>
              <span v-else>全部门店</span>
            </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip min-width="150" prop="fileKey" label="附件">
             <template slot-scope="scope">
                <!-- <embed v-if="scope.row.fileKey" :src="'https://img.chuangdingshop.com/' + scope.row.fileKey" width="800px" height="2100px" /> -->
                
                <!-- <span v-if="scope.row.fileKey" v-for="item,index in scope.row.fileKey">
                  <a v-if="scope.row.fileKey" target="blank" :href="'https://img.chuangdingshop.com/' + scope.row.fileKey">附件{{index}}</a>
                </span> -->
                <span>图片({{scope.row.imgFiles.length}})视频({{scope.row.videoFiles.length}})</span>
              </template>
          </el-table-column>
          <el-table-column show-overflow-tooltip width="80"  label="操作" >
            <template slot-scope="scope">
              <el-button type="primary" plain="" @click="deleteData(scope.$index,scope.row)">删除</el-button>
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
            <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
                <el-form-item label="标题"> 
                    <el-input v-model="form.title" placeholder=""></el-input>
                    </el-form-item>
                <br>
                <el-form-item label="私密等级"> 
                  <el-select v-model="form.resourceLevel">
                    <el-option value='SECRET' label="私密"></el-option>
                    <el-option value='OPEN' label="公开"></el-option>
                  </el-select>
                  </el-form-item>
                <br>
                <el-form-item label="内容"> 
                  <el-input v-model="form.remark" placeholder=""></el-input>
                  </el-form-item>
                <br>
                <el-form-item label="上传附件">
                  <el-upload
                    class="upload-file"
                    drag
                    action="/api/upload"
                    :headers="myHeaders"
                    :on-success="handleAvatarSuccess"
                  >
                    <i class="el-icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                  </el-upload>
                </el-form-item>

                <br>
                <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:12px">选择店铺</p>
                    <div style="float:left;padding-left:12px">
                        <ShopIdInput-app @OnGetShopIdsFromChild='GetShopIdFromChild'></ShopIdInput-app>
                    </div>
                </div>
                <br>
            </el-form>
          </el-card>
          <el-button type="primary" @click="submitCreateNew">创建</el-button>
          <el-button @click="closeCreateTable()">取消</el-button>
      </el-dialog>
  </div>
</template>

<script>
import { setTimeout } from 'timers';
import ShopIdInput from '../../common/ShopIdsInput.vue'
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
              materialFiles:[]
            },
            shopNameOptions:[],
            multipleSelection: [],
            msgCreate:'msg',
            msgType:'success',
            myHeaders: {Authorization:''},
            upload:''
        }
    },
    components:{
       'ShopIdInput-app':ShopIdInput
    },
    computed:{
        status(){
            return 123
        }
    },
    methods:{
      refreshData(){
        this.getInfo()
      },
      deleteData(index,row){
        this.$axios.delete(`/api/material/delete/${row.id}`).then(res=>{
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
      handleAvatarSuccess (res, file) {
        console.log(res,file)
        if (res.code === 200) {
          // this.upload = res.data
          this.form.materialFiles.push({fileKey:res.data})
        }
      },
      beforeAvatarUpload (file) {
        // console.log(file)
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
        this.$axios.get('/api/material/list',{params:this.params}).then(res=>{
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
      createNew(){
          this.createTableVisible = true
      },
      submitCreateNew() {
        // console.log(this.form)
        this.$axios.post(`/api/material/save`,this.form).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            this.createTableVisible = false
            this.form = {}
            this.form.materialFiles = []
            this.upload = ''
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
        console.log(data)
        this.form.shopId = data.join(',')
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

