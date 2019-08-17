<template>
  <div>
      <div style="height:40px">
        <div style="float:left">
          <el-button type="primary" @click="createNew()" plain icon="el-icon-plus">创建</el-button>
          <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
        </div>
      </div>

      <el-table :data="items" style="width: 100%" row-key="id" border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column show-overflow-tooltip min-width="80" prop="id" label="id"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="label" label="自定义类目"></el-table-column>
        <el-table-column show-overflow-tooltip min-width="100" prop="categoryNames" label="ERP产品类目"></el-table-column>
       
        <el-table-column show-overflow-tooltip min-width="120" label="呈现图片">
          <template slot-scope="scope">
              <img v-if="scope.row.icon" :src="'https://img.chuangdingshop.com/' + scope.row.icon" :alt="scope.row.title" width="25" height="25" class="am-img-thumbnail">
              <p v-else>暂无图片</p>
          </template>
        </el-table-column>
      
        <el-table-column show-overflow-tooltip width="80"  label="操作" >
          <template slot-scope="scope">
            <!-- <el-button type="primary" plain="" @click="deleteData(scope.$index,scope.row)">修改</el-button> -->
            <el-button type="danger" plain="" @click="deleteShow(scope.$index,scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :page-sizes="pageSizes"
          :page-size="pageSizes[0]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
        </el-pagination>
      </div> -->
       <!-- 创建弹出框 -->

      <el-dialog  :visible.sync="createTableVisible" class="detailTable"  fullscreen>
          <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>创建</h2>
            </div>
            <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
                <el-form-item label="名称"> 
                    <el-input v-model="form.label" placeholder=""></el-input>
                    </el-form-item>
                <br>
              
                <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:12px">父级类目</p>
                    <div style="float:left;padding-left:12px">
                      <div style="float:left">
                        <parentIdSelect-app :parentIdTableData='items' @onGetDataFromChild='getParentId'></parentIdSelect-app>
                      </div>
                      
                    </div>
                </div>
                <br>
                <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:12px">ERP类目</p>
                    <div style="float:left;padding-left:12px">
                      <div style="float:left">
                        <seriesSelect-app @onInsertSkuData='categoryFromChild'></seriesSelect-app>
                      </div>
                      <div style="float:left">
                        <el-input v-model="categoryIds" disabled></el-input>
                      </div>
                    </div>
                </div>
                <br>
                <el-form-item label="呈现图片">
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
              
            </el-form>
          </el-card>
          <el-button type="primary" @click="submitCreateNew" :disabled="createDisabled">创建</el-button>
          <el-button @click="closeCreateTable()">取消</el-button>
      </el-dialog>


  </div>
</template>

<script>
import ShopIdInput from '../../common/ShopIdsInput.vue'
import itemSelect from '../../common/itemSelect.vue'
import seriesSelect from '../../common/categorySelect.vue'
import parentIdSelect from '../../common/parentIdSelect.vue'
  export default {
    data(){
      return {
        createDisabled:false,
        optionProps: {
          value: 'id',
          label: 'label',
          children: 'children'
        },
        parentIdSelect:[],
        parentIdArr:[],
        items:[],
        total:0,
        shopId:[],
        pageSizes:[10, 20],
        params:{
            size:100,
            page:1
        },
        createTableVisible: false,
        indexLoading:true,
        form: {},
        shopNameOptions:[],
        multipleSelection: [],
        msgCreate:'msg',
        msgType:'success',
        myHeaders: {Authorization:''},
        upload:'',
        categoryIds:'',

      }
    },
    components:{
      'ShopIdInput-app':ShopIdInput,
      'itemSelect-app':itemSelect,
      'seriesSelect-app':seriesSelect,
      'parentIdSelect-app':parentIdSelect
    },
    computed:{
      status(){
          return 123
      }
    },
    methods:{
      deleteShow(index,row) {
          this.$confirm('是否确认删除该', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
          }).then(() => {
              this.deleteData(index,row)
          }).catch(() => {
              this.$message({
                  type: 'info',
                  message: '已取消删除'
              });          
          });
      },
      getParentId(data){
        this.form.parentId = data.id
        console.log(data)
      },
      handleChange(value) {
        console.log(value);
      },
      categoryFromChild(data){
        this.categoryIds = ''
        data.forEach((val,ind)=>{
          this.categoryIds += val.id + ','
        })
        this.categoryIds = this.categoryIds.substring(0,this.categoryIds.length-1)
        // console.log(this.categoryIds)
      },
      refreshData(){
        this.getInfo()
      },
      deleteData(index,row){
        this.$axios.delete(`/api/present-category/delete/${row.id}`).then(res=>{
          if(res.data.code == 200){
            // this.parentIdArr = 
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
        
        // console.log(res,file)
        if (res.code === 200) {
          this.form.icon = res.data
          // this.form.fileKey += res.data + ','
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
        let arr = []
        this.indexLoading = true
        this.$axios.get('/api/present-category').then(res=>{
          // console.log(res.data.data)
          if(res.data.code == 200){
            this.items = res.data.data
            this.parentIdArr = res.data.data
            arr = res.data.data
            console.log(arr)
            arr.forEach((val,ind)=>{
              if(val.children){
                // val.
              }
            })
            this.total = res.data.total
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
        this.createDisabled = true
        this.form.categoryIds = this.categoryIds
        console.log(this.form)
        this.$axios.post(`/api/present-category/add`,this.form).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            this.createTableVisible = false
            this.createDisabled = false
            // this.form = {}
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

