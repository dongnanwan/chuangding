<template>
  <div>
    <div style="padding-bottom:8px">
      <el-button type="primary" @click="createNew()" plain>创建</el-button>
      <el-button type="warning" plain="" @click="refreshData()">刷新</el-button>
    </div>
      
    <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
      element-loading-spinner="el-icon-loading"
      element-loading-background="rgba(0, 0, 0, 0.8)">
      <el-table-column show-overflow-tooltip min-width="200" prop="handOver" label="交接类型"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="200" prop="handProject" label="项目"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="200" prop="serialNum" label="序号"></el-table-column>
      <el-table-column show-overflow-tooltip min-width="200" prop="reviewContent" label="交接内容"></el-table-column>
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
                  <el-form-item label="交接类型">
                    <el-select v-model="form.handOver" placeholder="请选择交接类型">
                      <el-option value="早班交接" label="早班交接"></el-option>
                      <el-option value="晚班交接" label="晚班交接"></el-option>
                    </el-select>
                  </el-form-item>
                  <br>
                  <el-form-item label="项目"> 
                    <el-input v-model="form.handProject" placeholder="请如开门流程，服务"></el-input>
                  </el-form-item>
                  <br>
                  <el-form-item label="序号"> 
                    <el-input v-model="form.serialNum" placeholder="填写数字"></el-input>
                  </el-form-item>
                   <br>
                  <el-form-item label="交接内容"> 
                    <el-input v-model="form.reviewContent" placeholder=""></el-input>
                  </el-form-item>
                  <br>
            </el-form>
          </el-card>
          <el-button type="primary" @click="submitCreateNew">创建</el-button>
          <el-button @click="closeCreateTable()">取消</el-button>  
      </el-dialog>
  </div>
</template>

<script>
import ShopIdInput from '../../common/ShopIdInput.vue'
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
        },
        shopNameOptions:[],
        multipleSelection: [],
        msgCreate:'msg',
        msgType:'success'
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
        this.$axios.get('/api/getWorkHandOver',{params:this.params}).then(res=>{
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
         console.log(this.form)
         this.$axios.post(`/api/addWorkHandOver`,this.form).then((res)=>{
          if(res.data.code == 200){
            this.msgCreate = '操作成功'
            this.msgType = 'success'
            this.msgCreateOpen()
            this.getInfo()
            setTimeout(function(){
               this.createTableVisible = false
            },2000)
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
        this.form.shopId = data
      }
    },
    mounted(){
       this.getInfo()
    }
  }
</script>

<style scoped>
 
</style>

