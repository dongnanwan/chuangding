<template>
  <div>
    <div style="padding-bottom:10px">
        <!-- <el-button type="primary" @click="showCreateDia()" plain>创建</el-button> -->
        <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
    </div>
    <el-table :data="items" style="width: 100%"  height="500" border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column show-overflow-tooltip prop="name" label="门店名称" min-width="240"></el-table-column>
        <el-table-column show-overflow-tooltip prop="partner.name" label="合伙人" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="manager.name" label="店长" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="provinceName" label="省" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="cityName" label="市" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="areaName" label="区" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="address" label="地址" min-width="220"></el-table-column>
        <el-table-column show-overflow-tooltip prop="phone" label="联系电话" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip  label="营业时间" min-width="150">
            <template slot-scope="scope">
                <span>{{scope.row.openTime}}</span>
            </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="statusText" label="门店状态" min-width="80">
            <template slot-scope="scope">
                <span v-if="scope.row.status == 'Created'">未审核</span>
                <span v-else-if="scope.row.status == 'Wait_Verify'">审核中</span>
                <span v-else-if="scope.row.status == 'Verify_Success'">审核通过</span>
                <span v-else-if="scope.row.status == 'Wait_Verify'">审核失败</span>
                <span v-else-if="scope.row.status == 'Open'">上线</span>
                <span v-else-if="scope.row.status == 'Close'">下线</span>
                <span v-else>{{scope.row.status}}</span>
            </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip fixed="right" label="审核" width="145">
          <template slot-scope="scope">
           
            <el-button
                size="mini"
                type="success"
                plain=""
                @click="checkPass(scope.$index, scope.row)">通过</el-button>
            <el-button
                size="mini"
                type="danger"
                plain=""
                @click="checkReject(scope.$index, scope.row)">拒绝</el-button>
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
                
                <el-form-item label="店铺名称">
                    <el-input v-model="form.name" style="width:215px"></el-input>
                </el-form-item>
                 <br>
                <el-form-item label="区域">
                    <el-select v-model="form.regionId" placeholder="请选择">
                        <el-option
                            v-for="region in regionList"
                            :key="region.id"
                            :label="region.name"
                            :value="region.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>

                <el-form-item label="省">
                    <el-select v-model="form.provinceId" placeholder="请选择" @change="onProvinceChange">
                        <el-option
                            v-for="item in provinceList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="市">
                    <el-select v-model="form.cityId" placeholder="请选择"  @change="onCityChange">
                        <el-option
                            v-for="item in cityList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="区">
                    <el-select v-model="form.areaId" placeholder="请选择">
                        <el-option
                            v-for="area in areaList"
                            :key="area.id"
                            :label="area.name"
                            :value="area.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <br>
                <el-form-item label="店铺地址">
                    <el-input v-model="form.address" style="width:215px"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="营业时间">
                    <el-input v-model="form.openTime" style="width:215px"></el-input>
                </el-form-item>
                <br>
                <el-form-item label="联系电话">
                    <el-input v-model="form.phone" style="width:215px"></el-input>
                </el-form-item>
                <br>
                <div style="height:50px">
                    <p style="float:left;line-height:30px;padding-left:23px">合伙人</p>
                    <div style="float:left;padding-left:14px">
                        <ParterInput-app @OnGetDataFromChild='GetParterIdFromChild' :shopName='fatherPartner'></ParterInput-app>
                    </div>
                </div>
     
            </el-form>
        </el-card>
        <el-button v-if='!isCreate' type="primary" @click="submitEdit">修改</el-button>
        <el-button v-if='isCreate' type="primary" @click="submitCreateNew">创建</el-button>
        <el-button @click="closeCreateTable()">取消</el-button>
    </el-dialog>
    <!-- 绑定店长 -->
    <el-dialog  :visible.sync="bindKeeperVisible" fullscreen>
      <el-card>
        <div slot="header" class="clearfix" style="height:25px"> 
            <h2>绑定店长</h2>
        </div>
        <el-form>
            <ShopKeeperInput-app @OnGetShopIdFromChild='GetShopKeeperIdFromChild'></ShopKeeperInput-app>
        </el-form>
      </el-card>
      <div>
            <el-button @click="bindKeeperVisible = false">取 消</el-button>
            <el-button type="primary" @click="bindShopkeeper(currentId)">确 定</el-button>
      </div>
    </el-dialog>
</div>
</template>

<script>
import ShopIdInput from '../../common/ShopIdsInput.vue'
import ShopKeeperInput from '../../common/ShopKeeperInput.vue'
import ParterInput from '../../common/ParterInput.vue'
export default {
    data(){
        return {
            diaTitle:'',
            items:[],
            total:0,
            shopId:[],
            pageSizes:[10, 20],
            params:{
                size:10,
                page:1,
                status:'Wait_Verify'
            },
            bindKeeperVisible:false,
            createTableVisible: false,
            indexLoading:true,
            form: {
            },
            shopNameOptions:[],
            multipleSelection: [],
            msgCreate:'msg',
            msgType:'success',
            shopkeeperId:'',
            currentId: 0,
            provinceList:[],
            cityList:[],
            areaList:[],
            regionList:[],
            isCreate:true,
            editId:''
        }
    },
    components:{
       'ShopIdInput-app':ShopIdInput,
       'ShopKeeperInput-app':ShopKeeperInput,
       'ParterInput-app':ParterInput
    },
    computed:{
        fatherPartner(){
            try{
                return this.form.partner.name
            }catch(e){
                return ''
            }
        }
    },
    methods:{
        onProvinceChange(){
            this.$axios.get(`/api/address/city?page=1&size=40&provinceId=${this.form.provinceId}`).then(res=>{
                if(res.data.code == 200){
                    this.cityList = res.data.data.data
                }else{
                    this.msgCreate = '获取市列表失败'
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        onCityChange(){
            this.$axios.get(`/api/address/area?page=1&size=40&cityId=${this.form.cityId}&name=`).then(res=>{
                if(res.data.code == 200){
                    this.areaList = res.data.data.data
                }else{
                    this.msgCreate = '获取区域表失败'
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        getProvince(){
            this.$axios.get(`/api/address/province?page=1&size=40`).then(res=>{
                if(res.data.code == 200){
                    this.provinceList = res.data.data.data
                }else{
                    this.msgCreate = '获取省份列表失败'
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        bindShopkeeper (shopId) {
            this.$axios.put(`/api/shop/manager/change?shopId=${shopId}&managerId=${this.shopkeeperId}`).then(res=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.bindKeeperVisible = false
                    this.getInfo()
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        GetShopKeeperIdFromChild(data){
            this.shopkeeperId = data
        },
        GetParterIdFromChild(data){
            this.form.partnerId = data
        },
        showBindKeeperDia(index,row){
            this.bindKeeperVisible = true
            this.currentId = row.id
        },
        checkStart(index,row){
            this.$axios.put(`/api/shop/verify/${row.id}/start`).then(res=>{
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
        offLine(index,row){
            this.$axios.put(`/api/shop/${row.id}/unable`).then(res=>{
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
        onLine(index,row){
            this.$axios.put(`/api/shop/${row.id}/enable`).then(res=>{
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
            this.$axios.get('/api/shop',{params:this.params}).then(res=>{
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
            this.getProvince()
        },
        showEditDia(index,row){
            this.isCreate = false
            this.editId = row.id
            this.diaTitle = '修改'
            this.form = row
            this.createTableVisible = true
            this.getProvince()
        },
        submitCreateNew() {
            this.$axios.post(`/api/shop`,this.form).then((res)=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.createTableVisible = false
                    this.form = {}
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        submitEdit(){
            this.$axios.put(`/api/shop/${this.editId}`,this.form).then((res)=>{
                if(res.data.code == 200){
                    this.msgCreate = '操作成功'
                    this.msgType = 'success'
                    this.msgCreateOpen()
                    this.getInfo()
                    this.createTableVisible = false
                    this.form = {}
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
        },
        checkPass(index,row){
            this.$axios.put(`/api/shop/verify/${row.id}/success`).then((res)=>{
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
        checkReject(index,row){
            this.$axios.put(`/api/shop/verify/${row.id}/failure?reason='拒绝'`).then((res)=>{
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
        }
    },
    mounted(){
        this.getInfo()
    }
}
</script>

<style scoped>
 
</style>

