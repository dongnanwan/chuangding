<template>
  <div>
    <div style="padding-bottom:10px">
        <el-button type="primary" @click="showCreateDia()" plain icon="el-icon-plus">创建</el-button>
        <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
    </div>
    

    <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column fixed prop="id" label="ID" min-width="80"></el-table-column>
        <el-table-column prop="event" label="激励事件" min-width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.event == 'BIND_TELEPHONE'">绑定手机</span>
                <span v-else-if="scope.row.event == 'BEEN_GOLD'">成为金卡会员</span>
                <span v-else-if="scope.row.event == 'BEEN_SILVER'">成为银卡会员</span>
                <span v-else-if="scope.row.event == 'PERFECT_INFO'">完善信息</span>
            </template>
        </el-table-column>
        <el-table-column prop="reward" label="激励奖励" min-width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.reward == 'TICKET'">优惠券</span>
                <span v-else-if="scope.row.reward == 'BEAN'">金豆</span>
                <span v-else-if="scope.row.reward == 'FEE'">佣金</span>
            </template>
        </el-table-column>
        <el-table-column prop="amount" label="激励价值" min-width="150"></el-table-column>
        <el-table-column prop="status" label="是否启用" min-width="150">
            <template slot-scope="scope">
                <span v-if="scope.row.status == true">是</span>
                <span v-else-if="scope.row.status == false">否</span>
            </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip  label="操作" width="145">
            <template slot-scope="scope">
                <el-button type="success" v-if="scope.row.status == false" plain=""  @click="open(scope.$index,scope.row)" >启用</el-button>
                <el-button type="danger" v-if="scope.row.status == true" plain=""  @click="stop(scope.$index,scope.row)" >关闭</el-button>
                <el-button type="primary" plain="" @click="deleteOne(scope.$index,scope.row)" >删除</el-button>
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
            <el-form-item label="激励事件">
                <el-select v-model="form.event" placeholder="激励事件">
                    <el-option value="BIND_TELEPHONE" label="绑定手机号"></el-option>
                    <el-option value="BEEN_GOLD" label="成为金卡会员"></el-option>
                    <el-option value="BEEN_SILVER" label="成为银卡会员"></el-option>
                    <el-option value="PERFECT_INFO" label="完善信息"></el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="激励奖励">
                <el-select v-model="form.reward" placeholder="激励奖励">
                    <el-option value="TICKET" label="优惠券"></el-option>
                    <el-option value="BEAN" label="金豆"></el-option>
                    <el-option value="FEE" label="佣金"></el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="激励价值">
                <el-input v-model="form.amount" placeholder="激励价值"></el-input>
            </el-form-item>
            <div style="color:red">
                <span>奖励选择优惠券时，价值录入的是优惠券id</span>
                    <br>
                <span>奖励选择金豆时，价值录入的是金豆数量,如39.9需录入3990</span>
                    <br>
                <span> 奖励选择佣金时，价值录入的是佣金,如39.9需录入3990</span>
            </div>
            
         
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
        open(index,row){
            this.$axios.put(`/api/encouragement/${row.id}/open`).then((res)=>{
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
        stop(index,row){
            this.$axios.put(`/api/encouragement/${row.id}/stop`).then((res)=>{
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
        deleteOne(index,row){
            this.$axios.delete(`/api/encouragement/${row.id}/delete`).then((res)=>{
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
        submitBindWechart(){
            // console.log(this.bindId,this.memberCode)
            this.$axios.post(`/api/partner/bind/${this.bindId}?memberCode=${this.memberCode}`).then((res)=>{
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
            this.$axios.get('/api/encouragement/all',{params:this.params}).then(res=>{
                if(res.data.code == 200){
                    // console.log(res)
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
            this.$axios.post('/api/encouragement',this.form).then((res)=>{
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
            this.$axios.put(`/api/partner/modify/${this.editId}`,this.form).then((res)=>{
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
        changeStatus(a,b){
            this.$axios.put(`/api/customer-service/change-status/${b.id}?isReceive=${!b.receive}`).then(res=>{
                this.getInfo()
            })
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



