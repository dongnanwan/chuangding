<template>
  <div>
    <div style="padding-bottom:10px">
      <el-button type="primary" @click="createNew()" plain>创建</el-button>
      <el-button type="warning" plain="" @click="refreshData()">刷新</el-button>
    </div>
      

      <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
          element-loading-spinner="el-icon-loading"
          element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column show-overflow-tooltip prop="nickName" label="客服" min-width='200'></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="用户" min-width='200'></el-table-column>
        <el-table-column show-overflow-tooltip prop="receive" label="在线/下线" min-width='200'>
          <template slot-scope="scope">
            <span v-if='scope.row.receive == true'>在线</span>
            <span v-else>下线</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip  label="操作" width="80">
          <template slot-scope="scope">
            <el-button type="danger" v-if="scope.row.receive == true" @click="changeStatus(scope.$index,scope.row)" >下线</el-button>
            <el-button type="success" v-else @click="changeStatus(scope.$index,scope.row)" >上线</el-button>
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
            <h2>创建一个新的客服</h2>
          </div>

            <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
                <br>
                <el-form-item label="性别">
                  <el-select v-model="form.gender" placeholder="请选择性别">
                    <el-option value="0" label="女"></el-option>
                    <el-option value="1" label="男"></el-option>
                  </el-select>
                </el-form-item>
                <br>
                <el-form-item label="手机">
                  <el-input v-model="form.phone" placeholder="手机号码"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="客服昵称">
                  <el-input v-model="form.nickName" placeholder="请输入昵称"></el-input>
                </el-form-item>
                
                <br>
            </el-form>
        </el-card>
        <el-button type="primary" plain @click="submitCreateNew">创建</el-button>
        <el-button @click="closeCreateTable()">取消</el-button>
      </el-dialog>

  </div>
</template>

<script>
import { setTimeout } from 'timers';
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
                page:1,
                shopId:0
            },
            createTableVisible: false,
            indexLoading:true,
            form: {
            //   gender:'男',
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
        this.$axios.get('/api/customer-service/list',{params:this.params}).then(res=>{
          if(res.data.code == 200){
            console.log(res.data)
            this.items = res.data.data
            this.total = res.data.data.length
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
        this.$axios.get('/api/shop').then((res)=>{
          this.shopNameOptions = res.data.data.data
        })
      },
      submitCreateNew() {
        console.log(this.form)
        this.$axios.post('/api/customer-service/add',this.form).then((res)=>{
          console.log(res.data.message)
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
      changeStatus(a,b){
        console.log(b)
        this.$axios.put(`/api/customer-service/change-status/${b.id}?isReceive=${!b.receive}`).then(res=>{
            // console.log(res)
            this.getInfo()
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



