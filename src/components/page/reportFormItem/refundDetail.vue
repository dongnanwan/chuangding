<template>
    <div>
        <div style="padding-bottom:8px">
            <el-button type="primary" @click="printCheck()" plain icon="el-icon-printer">每日审核打印</el-button>
            <el-button type="primary" @click="showExcelData()" plain  icon="el-icon-download" :disabled="excelDisable">导出数据</el-button>
        </div>

        <div style="padding-bottom:8px">
            <div style="display:inline-block">
                <!-- <span style="color:red">*</span> -->
                <el-date-picker v-model="params.startTime" type="datetime" placeholder="开始日期" class="inputSize"></el-date-picker>
            </div>

            <div style="display:inline-block">
                <!-- <span style="color:red">*</span> -->
                <el-date-picker v-model="params.endTime" type="datetime" placeholder="结束日期" class="inputSize"></el-date-picker>
            </div>

            <!-- <div style="display:inline-block">
                <regionInput-app  @OnGetDataFromChild='getRegionIdFromChild'></regionInput-app>
            </div>

            <el-select v-model="searchForm.provinceId" placeholder="省" @change="onProvinceChange">
                <el-option
                    v-for="item in provinceList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>

            <el-select v-model="searchForm.cityId" placeholder="市">
                <el-option
                    v-for="item in cityList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select> -->

            <div style="display:inline-block" class="inputSize">
                <shopInput-app :fatherData='fatherList' @OnGetDataFromChild="getShopIdFromChild"></shopInput-app>
            </div>

            <el-input v-model="params.year" placeholder="年份" class="inputSize">
               
            </el-input>
            <el-input v-model="params.season" placeholder="季节" class="inputSize"></el-input>
            <el-input v-model="params.item" placeholder="款号" class="inputSize"></el-input>
            <el-input v-model="params.sex" placeholder="性别" class="inputSize"></el-input>
            <el-input v-model="params.category" placeholder="品类" class="inputSize"></el-input>
            <el-input v-model="params.part" placeholder="波段" class="inputSize"></el-input>

            <el-button @click="search" icon="el-icon-search" type="primary" plain>搜索</el-button>
        </div>

        <div ref="printTable">
            <el-table
                :data="items"
                style="width: 100%"
                border
                highlight-current-row
                height="600"
                v-loading="indexLoading"
                element-loading-text="数据加载中......"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                show-summary=""
                :summary-method="getSummaries"
                >
                <el-table-column show-overflow-tooltip label="销售日期" min-width="150" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.created">{{new Date(scope.row.created).toLocaleString()}}</span>
                    </template>
                </el-table-column>

                <el-table-column show-overflow-tooltip sortable="" label="年份" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.year}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="season" label="季节" min-width="80" align="center" ></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="item" label="款号" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="color" label="颜色" min-width="80" align="center" ></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" label="尺码" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.size}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="category" label="品类" min-width="80" align="center" ></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="sex" label="性别" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="series" label="系列" min-width="80" align="center" ></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" label="波段" min-width="80" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.part}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="shopName" label="店铺名称" min-width="280" align="center" ></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="tagPrice" label="吊牌价" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="refundAmount" label="退货额" min-width="80" align="center" ></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="refundNum" label="退货数量" min-width="80" align="center"></el-table-column>
                
            </el-table>
        </div>

        <div class="block">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :page-sizes="pageSizes"
                :page-size="pageSizes[0]"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total"
            ></el-pagination>
        </div>
    </div>
</template>

<script>
import regionInput from '../../common/regionCustomizeSelect.vue'
import shopInput from "../../common/shopInput.vue"
import axios from 'axios'
import XLSX from 'xlsx'

export default {
    data() {
        return {
            printClass: "#printTest",
            items: [],
            total: 0,
            pageSizes: [10, 20,1000],
            params: {
                size: 10,
                page: 1,
                startTime:'',
                endTime:'',
                reportType:1
            },
            indexLoading: true,
            msgCreate: "msg",
            msgType: "success",
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
        };
    },
    components: {
        'regionInput-app':regionInput,
        "shopInput-app": shopInput
    },
    methods: {
        showExcelData(){
            this.$confirm('是否确认导出所有数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.exportData()
            }).catch((e) => {
                console.log(e)
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
              
                    sums[12] = this.totalList.refundAmountTotal
                    // sums[10] = this.totalList.refundAmountTotal
                    // sums[14] = this.totalList.refundNumTotal
                    // sums[10] = this.totalList.refundTagPriceTotal
                    sums[13] = this.totalList.refundNumTotal
                    sums[11] = this.totalList.refundTagPriceTotal
                } else {
                    sums[index] = '';
                }
            });
            return sums;
        },
        search() {
            this.params.page = 1
            this.params.startTime = new Date(this.params.startTime).getTime();
            this.params.endTime = new Date(this.params.endTime).getTime();

            if (!this.params.startTime || !this.params.endTime) {
                this.msgCreate = "请填写时间";
                this.msgType = "error";
                this.msgCreateOpen();
            } else {
                this.getInfo();
            }
        },
        printCheck() {
            function myPrint(obj) {
                var newWindow = window.open("打印窗口", "_blank"); //打印窗口要换成页面的url
                var docStr = obj.innerHTML;
                newWindow.document.write(docStr);
                newWindow.document.close();
                newWindow.print();
                newWindow.close();
            }
            myPrint(this.$refs.printTable);
        },
        getShopIdFromChild(data) {
            this.params.shopId = data;
        },
        refreshData() {
            // this.getInfo()
        },
        msgCreateOpen() {
            this.$message({
                message: this.msgCreate,
                type: this.msgType,
                showClose: true
            });
        },
        handleSizeChange(val) {
            this.params.size = val;
            this.getInfo();
        },
        handleCurrentChange(val) {
            this.params.page = val;
            this.getInfo();
        },
        getInfo() {
            this.excelDisable = true
            this.indexLoading = true;
            this.params.cityId = this.searchForm.cityId
            this.params.provinceId = this.searchForm.provinceId

            this.$axios.get('/api/salesAndReturnReport/getMerchandiseRefundReportTotal',{params:this.params}).then(res=>{
                if(res.data.code == 200){
                    this.totalList = res.data.data
                }else{
                    this.msgCreate = res.data.message
                    this.msgType = 'error'
                    this.msgCreateOpen()
                    this.indexLoading = false
                }
            })

            this.$axios.get("/api/salesAndReturnReport/getMerchandiseRefundReport", {params: this.params}).then(res => {
                if (res.data.code == 200) {
                    this.items = res.data.data.data;
                    this.total = res.data.data.total;
                    this.indexLoading = false;
                } else {
                    this.msgCreate = res.data.message;
                    this.msgType = "error";
                    this.msgCreateOpen();
                    this.indexLoading = false;
                }
            }).then(res=>{
                if(this.total != 0){
                    this.$axios.get("/api/salesAndReturnReport/getMerchandiseRefundReport",{params:Object.assign(this.paramsExport,this.params,{size:this.total})}).then(res=>{
                        if(res.data.code == 200){
                            this.excelData = res.data.data.data
                            this.excelDisable = false
                        }else{

                        }
                    })
                }
            })
        }
    },
    mounted() {
        this.getProvince()
        this.params.startTime = new Date(new Date() - 24*60*60*1000)
        this.params.endTime = new Date()
        this.search()
        this.indexLoading = false;
    }
};
</script>

<style scoped>
.inputSize{
    width:200px
}
</style>

