<template>
<div>
    <div style="padding-bottom:8px">
        <el-button type="primary" @click="printCheck()" plain  icon="el-icon-printer">每日审核打印</el-button>
    </div>

    <div style="padding-bottom:8px">
        <div style="float:left">
            <span style="color:red;font-size:20px">*</span>
            <el-date-picker
                v-model="searchForm.beginTime"
                type="datetime"
                placeholder="开始日期">
            </el-date-picker>
        </div>

        <div style="float:left">
            <span style="color:red;font-size:20px">*</span>
            <el-date-picker
                v-model="searchForm.endTime"
                type="datetime"
                placeholder="结束日期">
            </el-date-picker>
        </div>
    
        <div style="display:inline-block">
            <regionSelect-app @OnGetDataFromChild='getRegionIdFromChild'></regionSelect-app>
        </div>

        <el-select v-model="searchForm.provinceId"  placeholder="省" @change="onProvinceChange">
            <el-option
                v-for="item in provinceList"
                :key="item.id"
                :label="item.name"
                :value="item.id">
            </el-option>
        </el-select>

        <el-select v-model="searchForm.cityId"  placeholder="市" @change="onCityChange">
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

        <div style="display:inline-block">
            <category-app @OnGetDataFromChild="getCategoryIdFromChild"></category-app>
        </div>

        <el-button type="primary" @click='search' icon="el-icon-search" plain="">搜索</el-button>

    </div>

    <div ref="printTable">
        <el-table :data="items" style="width: 100%"  border highlight-current-row
            height="600"
            show-summary=""
            v-loading="indexLoading"
            element-loading-text="数据加载中......"
            element-loading-spinner="el-icon-loading"
            element-loading-background="rgba(0, 0, 0, 0.8)"
            :summary-method="getSummaries"
            >
            <!-- <el-table-column show-overflow-tooltip prop="category" label="店铺" min-width="160" align="center"></el-table-column> -->
            <el-table-column show-overflow-tooltip prop="category" sortable="" label="类别" min-width="160" align="center"></el-table-column>

            <el-table-column show-overflow-tooltip label="当前年份" sortable=""  align="center">
                <el-table-column show-overflow-tooltip label="销售数量" sortable="" min-width="80" prop="totalSalesNum" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip label="吊牌价" sortable="" min-width="80" prop="totalTagPrice" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip label="实销额" sortable="" min-width="80" prop="totalActualAmount" align="center"></el-table-column>
            </el-table-column>

            <el-table-column show-overflow-tooltip label="当前年份前一年" sortable=""  align="center">
                <el-table-column show-overflow-tooltip label="销售数量" sortable="" min-width="80" prop="lastYearTotalSalesNum" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip label="吊牌价" sortable="" min-width="80" prop="lastYearTotalTagPrice" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip label="实销额"  sortable="" min-width="80" prop="lastYearTotalActualAmount" align="center"></el-table-column>
            </el-table-column>

            <el-table-column show-overflow-tooltip prop="increasing" label="同比增长" min-width="160" align="center"></el-table-column>
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
import shopInput from "../../common/shopInput.vue"
import categorySelect from "../../common/categoryInput.vue"
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
        "shopInput-app": shopInput,
        'category-app':categorySelect
    },
    methods:{
        getCategoryIdFromChild(data){
            this.params.categoryId = data
        },
        getShopIdFromChild(data) {
            this.params.shopId = data;
        },
        getRegionIdFromChild(data){
            this.searchForm.regionId = (data == null) ? 0 : data
            this.fatherList.regionId = (data == null) ? 0 : data
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
            // this.fatherList.cityId = this.searchForm.cityId
            this.fatherList.cityId = (this.searchForm.cityId == null) ? 0 : this.searchForm.cityId
        },
        onProvinceChange(){
            this.searchForm.provinceId =  (this.searchForm.provinceId == null) ? 0 : this.searchForm.provinceId
            this.$axios.get(`/api/address/city?page=1&size=40&provinceId=${this.searchForm.provinceId}`).then(res=>{
                if(res.data.code == 200){
                    this.fatherList.provinceId =  (this.searchForm.provinceId == null) ? 0 : this.searchForm.provinceId
                    this.cityList = res.data.data.data
                    this.cityList.unshift({id:0,name:'显示全部'})
                }else{
                    this.msgCreate = '获取市列表失败'
                    this.msgType = 'error'
                    this.msgCreateOpen()
                }
            })
        },
        getSummaries(param) {
            // console.log(param)
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]))
                if (!values.every(value => isNaN(value))) {
                    sums[1] = this.totalList.totalResultSalesNum
                    sums[2] = this.totalList.totalResultTagPrice
                    sums[3] = this.totalList.totalResultActualAmount
                    sums[4] = this.totalList.lastYearTotalResultSalesNum
                    sums[5] = this.totalList.lastYearTotalResultTagPrice
                    sums[6] = this.totalList.lastYearTotalResultActualAmount
                } else {
                    // sums[index] = 'N/A';
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
        getPartnerIdFromChild(data){
            this.searchForm.partnerId = data
        },
        search(){
            this.params.page = 1
            this.params.beginTime = new Date(this.searchForm.beginTime).getTime()
            this.params.endTime = new Date(this.searchForm.endTime).getTime()
            this.params.regionId = this.searchForm.regionId
            this.params.partnerId = this.searchForm.partnerId
            this.params.provinceId = this.searchForm.provinceId
            this.params.cityId = this.searchForm.cityId
            if(!this.params.beginTime || !this.params.endTime){
                this.msgCreate = '请填写时间'
                this.msgType = 'error'
                this.msgCreateOpen()
            }else{
                this.getInfo()
            }
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
            this.$axios.get('/api/shop-sales/category',{params:this.params}).then(res=>{
                if(res.data.code == 200){
                    console.log(res.data.data.data)
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

            this.$axios.get('/api/shop-sales/category-total',{params:this.params}).then(res=>{
                if(res.data.code == 200){
                    console.log(res.data.data)
                    this.totalList = res.data.data
                    
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
        // this.getInfo()
    }
}
</script>

<style scoped>

</style>

