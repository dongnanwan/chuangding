<template>
  <div>
    <div style="padding-bottom:10px">
        <el-button type="primary" @click="showCreateDia()" plain icon="el-icon-plus">创建</el-button>
        <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
        
        <br>
        <el-input v-model="inputShopName" v-on:keyup.native="searchShopName" placeholder="请输入区域名称" style="margin-top:10px;width:300px"></el-input>
    </div>
    

    <el-table :data="items" style="width: 100%" height="600"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column fixed prop="id" label="ID" min-width="80"></el-table-column>
        <el-table-column prop="code" label="区域代码" min-width="150"></el-table-column>
        <el-table-column prop="name" label="区域名称" min-width="150"></el-table-column>
        <el-table-column prop="provinceName" label="省份" min-width="150"></el-table-column>
        <el-table-column prop="manager" label="区域负责人" min-width="150"></el-table-column>

        <el-table-column show-overflow-tooltip  label="操作" width="78">
            <template slot-scope="scope">
                <el-button type="primary" plain=""  @click="showEditDia(scope.$index,scope.row)" >修改</el-button>
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
            <el-form-item label="代码">
                <el-input v-model="form.code" placeholder="输入区域代码"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="名称">
                <el-input v-model="form.name" placeholder="请输入区域名称"></el-input>
            </el-form-item>
            <br>

            <div style="margin-left:40px;margin-bottom:10px">
                <app-provinceSelect @OnGetDataFromChild='getProvince'></app-provinceSelect>
                <el-input v-model="form.provinceName" style="width:200px"></el-input>
            </div>

            <div style="height:50px">
                <p style="float:left;line-height:30px;padding-left:25px">负责人</p>
                
                <div style="float:left;padding-left:12px">
                    <app-userSelect @OnGetDataFromChild='childMethod' :mangerName='parentData'></app-userSelect>
                </div>
            </div>
           
        </el-form>
    </el-card>
    <el-button v-if="isCreate" type="primary" plain @click="submitCreateNew">创建</el-button>
    <el-button v-if="!isCreate" type="primary" plain @click="submitEdit">修改</el-button>
    <el-button @click="closeCreateTable()">取消</el-button>
    </el-dialog>

  </div>
</template>

<script>
import userSelect from '../../common/userSelect.vue'
import provinceSelect from '../../common/provinceMulSelect.vue'
import qs from 'qs'
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
            parentData:''
        }
    },
    components:{
        'app-userSelect':userSelect,
        'app-provinceSelect':provinceSelect
    },
    computed:{
    },
    methods:{
        getProvince(data){
            let nameStr = ''
            let idStr = ''
            data.forEach((val,ind)=>{
                nameStr += val.name + ','
                idStr += val.id + ','
            })
            this.form.provinceId = idStr.substring(0,idStr.length - 1)
            this.form.provinceName = nameStr.substring(0,nameStr.length - 1)
        },
        childMethod(data){
            this.form.manager = data.name
        },
        searchShopName(){
            this.params.page = 1
            this.$axios.get(`/api/address/region?name=${this.inputShopName}`,{params:this.params}).then(res=>{
                this.items = res.data.data.data
                this.total = res.data.data.total
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
            this.$axios.get('/api/address/region',{params:this.params}).then(res=>{
                console.log(res)
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
            this.parentData = row.manager
            console.log(this.parentData)
        },
        submitCreateNew() {
            // console.log(qs.stringify(this.form))
            this.$axios.post('/api/address/region',qs.stringify(this.form)).then((res)=>{
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
            console.log(qs.stringify(this.form))
            this.$axios.put(`/api/address/region/${this.editId}?name=${this.form.name}&code=${this.form.code}&manager=${this.form.manager}&provinceId=${this.form.provinceId}&provinceName=${this.form.provinceName}`).then((res)=>{
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
        }
    },
    mounted(){
       this.getInfo()
    }
  }
</script>

<style scoped>
 
</style>



