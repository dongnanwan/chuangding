<template>
  <div>
    <div style="padding-bottom:10px">
        <el-button type="primary" @click="showCreateDia()" plain icon="el-icon-plus">创建</el-button>
        <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
    </div>
 
    <el-table :data="items" height="600" style="width: 100%"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column fixed prop="name" label="模版名称" show-overflow-tooltip min-width="100"></el-table-column>

        <el-table-column show-overflow-tooltip prop="valuation" label="计价方式" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.valuation == 'BY_QUANTITY'">按数量</span>
                <span v-else-if="scope.row.valuation == 'BY_AMOUNT'">按价格</span>
            </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="valuation" label="已绑定商品" min-width="150">
            <template slot-scope="scope">
                <span v-for="item in scope.row.items" :key="item.id">{{item.code+','}}</span>
            </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="是否通用" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.general == true">是</span>
                <span v-else-if="scope.row.general == false">否</span>
            </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip label="状态:是否开启" min-width="100">
            <template slot-scope="scope">
                <span v-if="scope.row.status == true">是</span>
                <span v-else-if="scope.row.status == false">否</span>
            </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip prop="remarks" label="备注" min-width="150"></el-table-column>

        <el-table-column show-overflow-tooltip  label="操作" width="275" fixed="right">
            <template slot-scope="scope">
                <el-button type="success" v-if="scope.row.status == false" plain=""  @click="open(scope.$index,scope.row)" >启用</el-button>
                <el-button type="danger" v-if="scope.row.status == true" plain=""  @click="stop(scope.$index,scope.row)" >关闭</el-button>
                <el-button type="primary" plain="" @click="bindItemsShow(scope.$index,scope.row)">商品</el-button>
                <el-button type="primary" plain="" @click="showRegular(scope.$index,scope.row)" >规则</el-button>
                <el-button type="danger" plain="" @click="templateDeleteShow(scope.$index,scope.row)" >删除</el-button>
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
            <el-form-item label="模版名称">
                <el-input v-model="form.name" placeholder="模版名称"></el-input>
            </el-form-item>
            <br>
            <el-form-item label="计价方式">
                <el-select v-model="form.valuation" placeholder="计价方式">
                    <el-option value="BY_QUANTITY" label="按数量"></el-option>
                    <el-option value="BY_AMOUNT" label="按价格"></el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="是否通用">
                <el-select v-model="form.general" placeholder="是否通用">
                    <el-option value="true" label="是"></el-option>
                    <el-option value="false" label="否"></el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="备注">
                <el-input v-model="form.remarks" placeholder="模版名称"></el-input>
            </el-form-item>
        </el-form>
    </el-card>
    <el-button v-if="isCreate" type="primary" plain @click="submitCreateNew">创建</el-button>
    <el-button v-if="!isCreate" type="primary" plain @click="submitEdit">修改</el-button>
    <el-button @click="closeCreateTable()">关闭</el-button>
    </el-dialog>

    <!-- 规则 -->

    <el-dialog  :visible.sync="regularVisible" class="detailTable"  fullscreen>
        <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
                <h2>规则</h2>
            </div>
           
            <el-table :data="regularData"  style="width: 100%"  border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)">

                <el-table-column prop="areaName" label="地区" min-width="150"></el-table-column>

                <el-table-column prop="first" label="首件/首价" min-width="100"></el-table-column>

                <el-table-column prop="initialFee" label="首费" min-width="150"></el-table-column>

                <el-table-column prop="subsequent" label="续件/续价" min-width="150"></el-table-column>
                
                <el-table-column prop="subsequentFee" label="续费" min-width="150"></el-table-column>

                <el-table-column show-overflow-tooltip  label="操作" width="80">
                    <template slot-scope="scope">
                        <el-button type="danger"  @click="ruleDeleteShow(scope.$index,scope.row)">删除</el-button>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>
        <el-button type="primary" @click="createRegularVisible = true;regularForm.area = ''">新建规则</el-button>
        <el-button @click="regularVisible = false">取消</el-button>
    </el-dialog>

    <!-- 创建规则 -->

    <el-dialog  :visible.sync="createRegularVisible" class="detailTable"  fullscreen>
        <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
            <h2>创建规则</h2>
            </div>
            <el-form ref="form" label-width="80px" :inline="true"  class="demo-form-inline">
                
                <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:12px">添加省份</p>
                    <div style="float:left;padding-left:12px">
                      <div style="float:left">
                        <app-regionSelect @onTrigParentEvent='getDataFromChild'></app-regionSelect>
                      </div>
                      <div style="float:left">
                        <el-input v-model="regularForm.area" disabled=""></el-input>
                      </div>
                    </div>
                </div>
                <br>
                <el-form-item label="首件/首价">
                    <el-input v-model="regularForm.first" placeholder="首件/首价"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="首费">
                    <el-input v-model="regularForm.initialFee" placeholder="首费"></el-input>
                </el-form-item>
                 <br>
                <el-form-item label="续件/续价">
                    <el-input v-model="regularForm.subsequent" placeholder="续件/续价"></el-input>
                </el-form-item>
                 <br>
                <el-form-item label="续费">
                    <el-input v-model="regularForm.subsequentFee" placeholder="续费"></el-input>
                </el-form-item>
            </el-form>
        </el-card>

        <el-button v-if="isCreate" type="primary" plain @click="regularSubmitCreateNew">创建</el-button>
        <el-button @click="createRegularVisible = false">取消</el-button>

    </el-dialog>

    <!-- 绑定商品 -->

    <el-dialog  :visible.sync="bindItemsVisible" class="detailTable"  fullscreen>
        <el-card>
            <div slot="header" class="clearfix" style="height:25px"> 
            <h2>绑定商品</h2>
            </div>
            <el-form ref="form" label-width="80px" :inline="true"  class="demo-form-inline">
                <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:12px">绑定商品</p>
                    <div style="float:left;padding-left:12px">
                      <div style="float:left">
                        <itemSelect-app @onInsertSkuData='getItemIds'></itemSelect-app>
                      </div>
                      <div style="float:left">
                        <el-input v-model="itemsIds" disabled=""></el-input>
                      </div>
                    </div>
                </div>
            </el-form>
        </el-card>

        <el-button v-if="isCreate" type="primary" plain @click="bindItemsSubmitCreateNew">绑定</el-button>
        <el-button @click="bindItemsVisible = false">关闭</el-button>

    </el-dialog>


  </div>
</template>

<script>
import regionSelect from '../../common/regionSelect'
import itemSelect from '../../common/itemSelect.vue'
  export default {
    data(){
        return {
            itemsIds:'',
            bindItemsVisible:false,
            regularForm:{
                area:''
            },
            createRegularVisible:false,
            items:[],
            total:0,
            shopId:[],
            pageSizes:[10, 20],
            params:{
                size:10,
                page:1,
                shopId:0
            },
            createTableVisible:false,
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
            regularVisible:false,
            regularData:[],
            memberCode:'',
            addRuleId:''
        }
    },
    components:{
        'app-regionSelect':regionSelect,
        'itemSelect-app':itemSelect
    },
    computed:{
    },
    methods:{
        templateDeleteShow(index,row) {
            this.$confirm('是否确认删除该', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.templateDelete(index,row)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        templateDelete(index,row){
            this.$axios.delete(`/api/freight/delete-template/${row.id}`).then((res)=>{
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
        ruleDeleteShow(index,row){
            this.$confirm('是否确认删除该', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.ruleDelete(index,row)
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                });          
            });
        },
        ruleDelete(index,row){
            this.$axios.delete(`/api/freight/delete-rule/${row.id}`).then((res)=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.regularVisible = false
                    
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        getItemIds(data){
            console.log(data)
            this.itemsIds = ''
            data.forEach((val,ind)=>{
            this.itemsIds += val.id + ','
            })
            this.itemsIds = this.itemsIds.substring(0,this.itemsIds.length-1)
        },
        bindItemsSubmitCreateNew(){
            this.$axios.put(`/api/freight/bind-items/${this.bindId}?itemIds=${this.itemsIds}`).then((res)=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.regularVisible = false
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        bindItemsShow(index,row){
            console.log(row)
            this.bindId = row.id
            this.bindItemsVisible = true
        },
        bindItems(index,row){
            console.log(row)
        },
        getDataFromChild(data){
            let area = ''
            let areaName = ''
            data.forEach((val,ind)=>{
                area += val.id + ','
                areaName += val.name + ','
            })
            area = area.substring(0,area.length-1)
            areaName = areaName.substring(0,areaName.length-1)
            this.regularForm.area = area
            this.regularForm.areaName = areaName
        },
        regularSubmitCreateNew(){
            this.regularForm.templateId = this.addRuleId

            this.regularForm.first = parseInt(parseFloat(this.regularForm.first)*100)
            this.regularForm.initialFee = parseFloat(this.regularForm.initialFee)
            this.regularForm.subsequent = parseInt(parseFloat(this.regularForm.subsequent)*100)
            this.regularForm.subsequentFee = parseFloat(this.regularForm.subsequentFee)

            this.$axios.post('/api/freight/add-rule',this.regularForm).then((res)=>{
                
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.createRegularVisible = false
                    this.regularVisible = false
                    this.regularForm = {
                        area:''
                    }
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        showRegular(index,row){
            
            this.regularVisible = true
            this.addRuleId = row.id
            this.regularData = row.freightRules
        },
        open(index,row){
            this.$axios.put(`/api/freight/change-status/${row.id}`).then((res)=>{
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
            this.$axios.put(`/api/freight/change-status/${row.id}`).then((res)=>{
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
                    this.regularVisible = false
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
            this.$axios.get('/api/freight/list',{params:this.params}).then(res=>{
                if(res.data.code == 200){
                    console.log(res.data.data)
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
            this.$axios.post('/api/freight/add-template',this.form).then((res)=>{
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
        }
    },
    mounted(){
       this.getInfo()
    }
  }
</script>

<style scoped>
 
</style>



