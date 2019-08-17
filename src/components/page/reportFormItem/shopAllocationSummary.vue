<template>
<div>
    <div style="padding-bottom:8px">
        <el-button type="primary" @click="printCheck()" plain  icon="el-icon-printer">每日审核打印</el-button>
    </div>

    <div style="padding-bottom:8px">
    
    <div style="display:inline-block">
        <regionSelect-app @OnGetDataFromChild='getRegionIdFromChild'></regionSelect-app>
    </div>

    <el-select v-model="searchForm.provinceId" placeholder="省" @change="onProvinceChange">
        <el-option
            v-for="item in provinceList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
    </el-select>

    <el-select v-model="searchForm.cityId" placeholder="市" @change="onCityChange">
        <el-option
            v-for="item in cityList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
        </el-option>
    </el-select>

    <div style="display:inline-block">
        <shopInput-app :fatherData='fatherList' @OnGetDataFromChild="getShopIdFromChild"></shopInput-app>
    </div>

    <el-button type="primary" @click='search' icon="el-icon-search" plain="">搜索</el-button>

    </div>

    <div ref="printTable">
        <el-table :data="items" style="width: 100%"  border highlight-current-row
            height="600"
            v-loading="indexLoading"
            element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            show-summary=""
            :summary-method="getSummaries"
            >
            <el-table-column show-overflow-tooltip sortable="" prop="shopName" label="店铺" min-width="80" align="center"></el-table-column>
            

            <el-table-column show-overflow-tooltip  label="调出"  align="center">
                <el-table-column show-overflow-tooltip sortable="" label="SKC" min-width="80" prop="allocationOut.skc" align="center">
            
                </el-table-column>
                <el-table-column show-overflow-tooltip sortable="" label="数量" min-width="80" prop="allocationOut.num" align="center">
            
                </el-table-column>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="调入"  align="center">
                <el-table-column show-overflow-tooltip sortable="" label="SKC" min-width="80" prop="allocationIn.skc" align="center">
            
                </el-table-column>
                <el-table-column show-overflow-tooltip sortable="" label="数量" min-width="80" prop="allocationIn.num" align="center">
            
                </el-table-column>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="总仓补货"  align="center">
                <el-table-column show-overflow-tooltip sortable="" label="SKC" min-width="80" prop="allocationHQ.skc" align="center">
            
                </el-table-column>
                <el-table-column show-overflow-tooltip sortable="" label="数量" min-width="80" prop="allocationHQ.num" align="center">
            
                </el-table-column>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="店铺现有库存"  align="center">
                <el-table-column show-overflow-tooltip sortable="" label="SKC" min-width="80" prop="shopStock.skc" align="center">
            
                </el-table-column>
                <el-table-column show-overflow-tooltip sortable="" label="数量" min-width="80" prop="shopStock.num" align="center">
            
                </el-table-column>
            </el-table-column>
            
        </el-table>
    </div>

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
</div>
</template>

<script>
import regionSelect from '../../common/regionCustomizeSelect.vue'
import parterSelect from '../../common/ParterInput.vue'
import shopInput from "../../common/shopInput.vue";

export default {
data(){
    return {
        printClass:'#printTest',
        items:[],
        total:0,
        pageSizes:[10, 20,1000],
        params:{
            size:10,
            page:1
        },
        indexLoading:true,
        msgCreate:'msg',
        msgType:'success',
        provinceList:[],
        cityList:[],
        totalList:[],
        searchForm:{
         regionId:0
        },
        regionSelect:0,
        fatherList:{
            provinceId:0,
            regionId:0,
            cityId:0
        }
    }
},
components:{
    'regionSelect-app':regionSelect,
    'partnerSelect-app':parterSelect,
    "shopInput-app": shopInput
},
methods:{
    getRegionIdFromChild(data){
        this.searchForm.regionId = data
        this.fatherList.regionId = data
        this.getProvince()
    },
    getProvince(){
        this.$axios.get(`/api/address/province?page=1&size=40&name=&regionId=${this.searchForm.regionId}`).then(res=>{
            if(res.data.code == 200){
                this.provinceList = res.data.data.data
                this.provinceList.unshift({id:0,name:'显示全部'})
            }else{
                this.msgCreate = '获取省份列表失败'
                this.msgType = 'error'
                this.msgCreateOpen()
            }
        })
    },
    onCityChange(){
        this.fatherList.cityId = this.searchForm.cityId
    },
    onProvinceChange(){
        this.$axios.get(`/api/address/city?page=1&size=40&provinceId=${this.searchForm.provinceId}`).then(res=>{
            if(res.data.code == 200){
                this.cityList = res.data.data.data
                this.fatherList.provinceId = this.searchForm.provinceId
                this.cityList.unshift({id:0,name:'显示全部'})
            }else{
                this.msgCreate = '获取市列表失败'
                this.msgType = 'error'
                this.msgCreateOpen()
            }
        })
    },
    getSummaries(param) {
        const { columns, data } = param;
        const sums = [];
        columns.forEach((column, index) => {
            if (index === 0) {
                sums[index] = '合计';
                return;
            }
            const values = data.map(item => Number(item[column.property]));
            if (!values.every(value => isNaN(value))) {
                sums[6] = this.totalList['hqNum']
                sums[5] = this.totalList['hqSkc']
                sums[4] = this.totalList['inNum']
                sums[3] = this.totalList['inSkc']
                sums[2] = this.totalList['outNum']
                sums[1] = this.totalList['outSkc']
                sums[8] = this.totalList['stockNum']
                sums[7] = this.totalList['stockSkc']
                
            } else {
            }
        });
        return sums;
    },
    printCheck(){
        function myPrint(obj){
            var newWindow=window.open("打印窗口","_blank");//打印窗口要换成页面的url
            var docStr = obj.innerHTML;
            newWindow.document.write(docStr);
            newWindow.document.close();
            newWindow.print();
            newWindow.close();
        }
        myPrint(this.$refs.printTable)
    },
    getShopIdFromChild(data) {
        this.params.shopId = data;
    },
    getPartnerIdFromChild(data){
        this.searchForm.partnerId = data
    },
    search(){
        this.params.page = 1
        this.params.regionId = this.searchForm.regionId
        this.params.partnerId = this.searchForm.partnerId
        this.params.provinceId = this.searchForm.provinceId
        this.params.cityId = this.searchForm.cityId
        this.getInfo()
    },
    refreshData(){
    // this.getInfo()
    },
    msgCreateOpen() {
        this.$message({
            message:this.msgCreate,
            type:this.msgType,
            showClose: true
        });
    },
    handleSizeChange(val) {
        this.params.size = val 
        this.getInfo()
    },
    handleCurrentChange(val) {
        this.params.page = val
        this.getInfo()
    },
    getInfo(){
        this.indexLoading = true
        this.params.cityId = this.searchForm.cityId
        this.params.provinceId = this.searchForm.provinceId
        this.$axios.get('/api/shop-allocation/summary',{params:this.params}).then(res=>{
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

        this.$axios.get('/api/shop-allocation/summary-total',{params:this.params}).then(res=>{
            if(res.data.code == 200){
                this.totalList = res.data.data
                console.log(res.data)
            }else{
                this.msgCreate = res.data.message
                this.msgType = 'error'
                this.msgCreateOpen()
                this.indexLoading = false
            }
        })
    }
},
mounted(){
    this.indexLoading = false
    this.getProvince()
}
}
</script>

<style scoped>

</style>

