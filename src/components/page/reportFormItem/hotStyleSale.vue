<template>
<div>
    <div style="padding-bottom:8px">
        <el-button type="primary" @click="printCheck()" plain  icon="el-icon-printer">每日审核打印</el-button>
        <el-button type="primary" @click="showExcelData()" plain  icon="el-icon-download" :disabled="excelDisable">导出数据</el-button>
    </div>

    <div style="padding-bottom:8px">
        <div style="float:left">
            <span style="color:red;font-size:20px">*</span>
            <el-date-picker
            v-model="searchForm.time"
            type="date"
            placeholder="请选择日期">
            </el-date-picker>
        </div>

        <!-- <div style="float:left">
            <span style="color:red;font-size:20px">*</span>
            <el-date-picker
            v-model="searchForm.endTime"
            type="datetime"
            placeholder="结束日期">
            </el-date-picker>
        </div> -->

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
            <el-table-column show-overflow-tooltip sortable="" prop="regionName" label="大区" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip sortable="" prop="provinceName" label="省" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip sortable="" prop="cityName" label="市" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip sortable="" prop="shopName" label="店铺" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip sortable="" prop="code" label="款号" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip sortable="" prop="mainImage" label="款号图片" min-width="80" align="center">
                <template slot-scope="scope">
                    <img v-if="scope.row.mainImage" :src="'https://img.chuangdingshop.com/' + scope.row.mainImage" :alt="scope.row.title" width="25" height="25" class="am-img-thumbnail">
                    <p v-else>暂无图片</p>
                </template>    
            </el-table-column>
            <el-table-column show-overflow-tooltip sortable="" prop="sevenDayTurnover" label="七天成交金额" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip sortable="" prop="dayTurnover" label="日成交金额" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip sortable="" prop="sevenDayNum" label="七天成交人数" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip sortable="" prop="dayNum" label="日天成交人数" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip sortable="" prop="customerTransaction" label="客单价" min-width="80" align="center"></el-table-column>
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
import axios from 'axios'
import XLSX from 'xlsx'


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
            },
            excelData:[],
            excelDisable:true,
            paramsExport:{}
        }
    },
    components:{
        'regionSelect-app':regionSelect,
        'partnerSelect-app':parterSelect
    },
    methods:{
        showExcelData(){
            this.$confirm('是否确认导出所有数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.exportData()
            }).catch(() => {
                    
            });
        },
        exportData(){
            var data = this.excelData
            var ws = XLSX.utils.json_to_sheet(data);
            var wb = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(wb, ws, "data");
            XLSX.writeFile(wb, "data.xlsx");
        },
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
                sums[index] = '总价';
                return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[6] = this.totalList.sevenDayTurnoverTotal
                    sums[9] = this.totalList.dayNumTotal
                    sums[7] = this.totalList.dayTurnoverTotal
                    sums[8] = this.totalList.sevenDayNumTotal
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
        getPartnerIdFromChild(data){
            this.searchForm.partnerId = data
        },
        search(){
            this.params.page = 1
            this.params.time = new Date(this.searchForm.time).getTime()
            this.params.regionId = this.searchForm.regionId
            this.params.partnerId = this.searchForm.partnerId
            this.params.provinceId = this.searchForm.provinceId
            this.params.cityId = this.searchForm.cityId
            if(!this.params.time){
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
            this.excelDisable = true
            this.indexLoading = true
            this.params.cityId = this.searchForm.cityId
            this.params.provinceId = this.searchForm.provinceId
            this.$axios.get('/api/hotStyleSalesAnalysis/getHotStyleSalesAnalysis',{params:this.params}).then(res=>{
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
            }).then(res=>{
                if(this.total != 0){
                    this.$axios.get('/api/hotStyleSalesAnalysis/getHotStyleSalesAnalysis',{params:Object.assign(this.paramsExport,this.params,{size:this.total})}).then(res=>{
                        if(res.data.code == 200){
                            this.excelData = res.data.data.data
                            this.excelDisable = false
                            console.log(this.excelData)
                        }else{

                        }
                    })
                }
            })
            
            this.$axios.get('/api/hotStyleSalesAnalysis/getHotStyleSalesAnalysisTotal',{params:this.params}).then(res=>{
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
    }
}
</script>

<style scoped>

</style>

