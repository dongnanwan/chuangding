<template>
  <div>
    <div style="padding-bottom:10px">
        <el-button type="primary" @click="showCreateDia()" plain icon="el-icon-plus">创建</el-button>
        <el-button type="primary" plain="" @click="refreshData()" icon="el-icon-refresh">刷新</el-button>
        
        <br>
        <div>

            <el-input v-model="inputShopName" v-on:keyup.native="searchShopName" placeholder="请输入门店名称" style="margin-top:10px;width:220px"></el-input>
            <div style="display:inline-block">
                <ParterInput-app  @OnGetDataFromChild='getPartnerIdFromChildOut'></ParterInput-app>
            </div>

            <div style="display:inline-block">
                <shopKeeperSingleSelect-app  @OnGetDataFromChild='GetShopKeeperIdFromChildOut'></shopKeeperSingleSelect-app>
            </div>

            
            <el-select v-model="form.provinceId" placeholder="省" @change="onProvinceChange">
                <el-option
                    v-for="item in provinceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>

            <el-select v-model="form.cityId" placeholder="市"  @change="onCityChange">
                <el-option
                    v-for="item in cityList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>

            <el-select v-model="form.areaId" placeholder="区">
                <el-option
                    v-for="area in areaList"
                    :key="area.id"
                    :label="area.name"
                    :value="area.id">
                </el-option>
            </el-select>

            <el-button @click="searchShopName" type="primary" plain="" icon="el-icon-search">搜索</el-button>

        </div>
        
    </div>
    <el-table :data="items" style="width: 100%"  height="600" border highlight-current-row @selection-change="handleSelectionChange" v-loading="indexLoading" element-loading-text="数据加载中......"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)">
        <el-table-column show-overflow-tooltip prop="id" label="门店ID" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="name" label="门店名称" min-width="240"></el-table-column>
        <el-table-column show-overflow-tooltip prop="displayName" label="门店别名" min-width="240"></el-table-column>
        <el-table-column show-overflow-tooltip prop="partner.name" label="合伙人" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="manager.name" label="店长" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="regionName" label="区域" min-width="120"></el-table-column>
        <el-table-column show-overflow-tooltip prop="provinceName" label="省" min-width="80"></el-table-column>
        
        <el-table-column show-overflow-tooltip prop="cityName" label="市" min-width="80"></el-table-column>
        <el-table-column show-overflow-tooltip prop="areaName" label="区" min-width="100"></el-table-column>
        <el-table-column show-overflow-tooltip prop="address" label="地址" min-width="220"></el-table-column>
        <el-table-column show-overflow-tooltip prop="displayAddress" label="地址别名" min-width="240"></el-table-column>
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
                <span v-else-if="scope.row.status == 'Verify_Failure'">审核失败</span>
                <span v-else-if="scope.row.status == 'Verify_Success'">审核通过</span>
                <span v-else-if="scope.row.status == 'Wait_Verify'">审核失败</span>
                <span v-else-if="scope.row.status == 'Open'">上线</span>
                <span v-else-if="scope.row.status == 'Close'">下线</span>
                <span v-else>{{scope.row.status}}</span>
            </template>
        </el-table-column>

        <el-table-column show-overflow-tooltip fixed="right" label="操作" width="240">
          <template slot-scope="scope">
           
            <el-button
                v-if="scope.row.status == 'Open'"
                size="mini"
                type="danger"
                plain=""
                @click="offLine(scope.$index, scope.row)">下线</el-button>
            <el-button
                v-if="scope.row.status == 'Close' || scope.row.status == 'Verify_Success'"
                size="mini"
                type="success"
                plain=""
                @click="onLine(scope.$index, scope.row)">上线</el-button> 
            <el-button
                v-if="scope.row.status != 'Close' && scope.row.status != 'Open' && scope.row.status != 'Verify_Success'"
                :disabled="scope.row.status != 'Created'"
                size="mini"
                type="warning"
                plain=""
                @click="checkStart(scope.$index, scope.row)">提交</el-button>
            <el-button
                :disabled="scope.row.status == 'Open' || scope.row.status == 'Wait_Verify'"
                size="mini"
                type="primary"
                plain=""
                @click="showEditDia(scope.$index, scope.row)">编辑</el-button>
            <el-button
                size="mini"
                type="primary"
                plain=""
                @click="showBindKeeperDia(scope.$index, scope.row)">绑定店长</el-button>
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
                <el-form-item label="店铺别名">
                    <el-input v-model="form.displayName" style="width:215px"></el-input>
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
                <el-form-item label="地址别名">
                    <el-input v-model="form.displayAddress" style="width:215px"></el-input>
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
import ParterInput from '../../common/parterSelect.vue'
import shopKeeperSingleSelect from '../../common/shopKeeperSingleSelect.vue'

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
                page:1
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
            editId:'',
            inputShopName: '',
            searchForm:{}
        }
    },
    components:{
       'ShopIdInput-app':ShopIdInput,
       'ShopKeeperInput-app':ShopKeeperInput,
       'ParterInput-app':ParterInput,
       'ShopIdInput-app':ShopIdInput,
       'shopKeeperSingleSelect-app':shopKeeperSingleSelect
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
        GetShopKeeperIdFromChildOut(data){
            this.searchForm.managerId = data
            console.log(data)
        },
        getPartnerIdFromChildOut(data){
            this.searchForm.partnerId = data
        },
        search(){
            
        },
        searchShopName(){
            this.params.page = 1
            let provinceId = this.form.provinceId ? this.form.provinceId : ''
            let cityId = this.form.cityId ? this.form.cityId : ''
            let areaId = this.form.areaId ? this.form.areaId : ''
            let partnerId = this.searchForm.partnerId ? this.searchForm.partnerId : ''
            let managerId = this.searchForm.managerId ? this.searchForm.managerId : ''
            this.$axios.get(`/api/shop?name=${this.inputShopName}&provinceId=${provinceId}&cityId=${cityId}&areaId=${areaId}&partnerId=${partnerId}&managerId=${managerId}`,{params:this.params}).then((res)=>{
                this.items = res.data.data.data
                this.total = res.data.data.total
            })
        },
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
        getRegion(){
            this.$axios.get(`/api/address/region?page=1&size=80`).then(res=>{
                if(res.data.code == 200){
                    this.regionList = res.data.data.data
                }else{
                    this.msgCreate = '获取省份列表失败'
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        getProvince(){
            this.$axios.get(`/api/address/province?page=1&size=40&name=`).then(res=>{
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
            this.searchShopName()
        },
        handleCurrentChange(val) {
            this.params.page = val
            this.searchShopName()
        },
        getInfo(){
            this.indexLoading = true
            this.$axios.get('/api/shop',{params:this.params}).then(res=>{
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
            this.getRegion()
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
            this.form.shopId = data.join(',')
        }
    },
    mounted(){
        this.getInfo()
        this.getProvince()
    }
}
</script>

<style scoped>
 
</style>

