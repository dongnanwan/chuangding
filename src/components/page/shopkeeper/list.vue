<template>
  <div>
    <div style="padding-bottom:10px">
        <el-button type="primary" @click="showCreateDia()" plain icon="el-icon-plus">创建</el-button>
        <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
        <br>
        <el-input v-model="inputShopName" v-on:keyup.native="searchShopName" placeholder="请输入店长名称" style="margin-top:10px;width:300px"></el-input>
    </div>

    <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column fixed prop="id" label="ID" min-width="80"></el-table-column>
        <el-table-column prop="name" label="店长" min-width="150"></el-table-column>
        <el-table-column prop="creditCode" label="身份证号码" min-width="150"></el-table-column>
        <el-table-column prop="telephone" label="手机" min-width="150"></el-table-column>
        <el-table-column prop="memberId" label="微信会员ID" min-width="150"></el-table-column>
        <el-table-column prop="cardBank" label="开户银行" min-width="150"></el-table-column>
        <el-table-column prop="cardNo" label="银行卡号" min-width="150"></el-table-column>
        <el-table-column prop="cardOwner" label="开户姓名" min-width="150"></el-table-column>
        <el-table-column show-overflow-tooltip  label="操作" width="360" fixed="right">
            <template slot-scope="scope">
                <el-button type="primary" plain=""  @click="showEditDia(scope.$index,scope.row)" >修改</el-button>
                <el-button type="primary" plain="" @click="showBindWechart(scope.$index,scope.row)" >绑定微信</el-button>
                <el-button type="danger" plain="" @click="showUnbindWechart(scope.$index,scope.row)" >解绑微信</el-button>
                <el-button :disabled="!scope.row.memberId" type="primary" plain=""  @click="downloadCode(scope.$index,scope.row)" >下载二维码</el-button>
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
        <h2>{{diaTitle}}</h2>
        </div>

        <el-form ref="form" :model="form" label-width="80px" :inline="true"  class="demo-form-inline">
            <el-form-item label="姓名">
                <el-input v-model="form.name" placeholder="输入姓名"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="身份证">
                <el-input v-model="form.creditCode" placeholder="请输入身份证"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="手机">
                <el-input v-model="form.telephone" placeholder="输入手机"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="开户银行">
                <el-input v-model="form.cardBank" placeholder="开户银行"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="银行卡号">
                <el-input v-model="form.cardNo" placeholder="银行卡号"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="开户姓名">
                <el-input v-model="form.cardOwner" placeholder="开户姓名"></el-input>
            </el-form-item>
        </el-form>
    </el-card>
    <el-button v-if="isCreate" type="primary" plain @click="submitCreateNew">创建</el-button>
    <el-button v-if="!isCreate" type="primary" plain @click="submitEdit">修改</el-button>
    <el-button @click="closeCreateTable()">取消</el-button>
    </el-dialog>

    <!-- 绑定微信弹出框 -->

    <el-dialog  :visible.sync="bindWechartVisible" class="detailTable"  fullscreen>
    <el-card>
        <div slot="header" class="clearfix" style="height:25px"> 
        <h2>绑定小程序会员码</h2>
        </div>
        <el-form  label-width="80px" :inline="true"  class="demo-form-inline">
            <el-form-item label="小程序会员码">
                <el-input v-model="memberCode" placeholder="小程序会员码"></el-input>
            </el-form-item>
        </el-form>
    </el-card>
    <el-button type="primary" plain @click="submitBindWechart()">绑定</el-button>
    <el-button @click="bindWechartVisible = false">取消</el-button>
    </el-dialog>

  </div>
</template>

<script>
  export default {
    data(){
        return {
            inputShopName:'',
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
            },
            shopNameOptions:[],
            multipleSelection: [],
            msgCreate:'msg',
            msgType:'success',
            diaTitle:'',
            isCreate:true,
            editId:'',
            bindId:'',
            bindWechartVisible:false,
            memberCode:''
        }
    },
    computed:{
    },
    methods:{
        showUnbindWechart(index,row){
            this.$confirm('是否确认解绑?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.unbindWechart(index,row)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        unbindWechart(index,row){
            this.$axios.post(`/api/shopkeeper/unbind/${row.id}`).then((res)=>{
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
        downloadCode(index,row){
            window.open(`/api/share-code/download-member-mini_code?memberId=${row.memberId}&name=${this.name}`)
        },
        searchShopName(){
            this.params.page = 1
            this.$axios.get(`/api/shopkeeper?name=${this.inputShopName}`,{params:this.params}).then(res=>{
                this.items = res.data.data.data
                this.total = res.data.data.total
            })
        },
        submitBindWechart(){
            this.$axios.post(`/api/shopkeeper/bind/${this.bindId}?memberCode=${this.memberCode}`).then((res)=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.bindWechartVisible = false
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
        //消息++++
        msgCreateOpen() {
            this.$message({
                message:this.msgCreate,
                type:this.msgType,
                showClose: true
            });
        },
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
            this.$axios.get('/api/shopkeeper',{params:this.params}).then(res=>{
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
        showCreateDia(){
            this.isCreate = true
            this.diaTitle = '创建'
            this.form = {}
            this.createTableVisible = true
        },
        showEditDia(index,row){
            this.isCreate = false
            this.diaTitle = '修改'
            this.form = row
            this.editId = row.id
            this.createTableVisible = true
        },
        submitCreateNew() {
            this.$axios.post('/api/shopkeeper',this.form).then((res)=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.createTableVisible = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        submitEdit(){
            this.$axios.put(`/api/shopkeeper/update/${this.editId}`,this.form).then((res)=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.createTableVisible = false
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
        showBindWechart(index,row){
            this.memberCode = ''
            this.bindWechartVisible = true
            this.bindId = row.id
        }
    },
    mounted(){
       this.getInfo()
    }
  }
</script>

<style scoped>
 
</style>



