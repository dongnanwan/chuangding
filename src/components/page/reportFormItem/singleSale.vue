<template>
    <div>
        <div style="padding-bottom:8px">
            <el-button type="primary" @click="printCheck()" plain icon="el-icon-printer">每日审核打印</el-button>
            <el-button type="primary" @click="showExcelData()" plain  icon="el-icon-download" :disabled="excelDisable">导出数据</el-button>
        </div>

        <div style="padding-bottom:8px">

            <div style="display:inline-block">
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

            <el-select v-model="searchForm.cityId" placeholder="市" @change="onCityChange">
                <el-option
                    v-for="item in cityList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                </el-option>
            </el-select>

            <div style="display:inline-block">
                <shopInput-app @OnGetDataFromChild="getShopIdFromChild" :fatherData='fatherList'></shopInput-app>
            </div>

            <el-input v-model="params.year" placeholder="年份" style="width:220px">
               
            </el-input>
            <el-input v-model="params.season" placeholder="季节" style="width:220px"></el-input>
            <!-- <el-input v-model="params.item" placeholder="款号" style="width:220px"></el-input>
            <el-input v-model="params.sex" placeholder="性别" style="width:220px"></el-input>
            <el-input v-model="params.category" placeholder="品类" style="width:220px"></el-input>
            <el-input v-model="params.part" placeholder="波段" style="width:220px"></el-input> -->

            <el-button @click="search" icon="el-icon-search" type="primary" plain>搜索</el-button>
        </div>

        <div ref="printTable">
            <el-table
                :data="items"
                style="width: 100%"
                border
                highlight-current-row
                height="650"
                v-loading="indexLoading"
                element-loading-text="数据加载中......"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
                show-summary=""
                :summary-method="getSummaries"
            >
                <el-table-column show-overflow-tooltip sortable="" prop="code" label="款号" min-width="100" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="mainImage" label="图片" min-width="80" align="center">
                    <template slot-scope="scope">
                        <img v-if="scope.row.mainImage" :src="'https://img.chuangdingshop.com/' + scope.row.mainImage" :alt="scope.row.title" width="25" height="25" class="am-img-thumbnail">
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="category" label="产品类别" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="tagPrice" label="吊牌价" min-width="80" align="center" ></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="part" label="产品波段" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="totalInStorage" label="总入库" min-width="80" align="center" ></el-table-column>

                <el-table-column show-overflow-tooltip sortable="" prop="saleAmount" label="总销售金额" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="saleNum" label="总销售数" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="soldPercent" label="售罄" min-width="80" align="center" ></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="averageSalesDiscount" label="平均销售折扣" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="totalStock" label="实时总库存数(总仓+店)" min-width="80" align="center" ></el-table-column>

                <el-table-column show-overflow-tooltip sortable="" label="总库存" min-width="150" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.saleNum + scope.row.totalStock}}</span>
                    </template>
                </el-table-column>
                
                <el-table-column show-overflow-tooltip sortable="" label="到店日期" min-width="150" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.toShopTime">{{new Date(scope.row.toShopTime).toLocaleString()}}</span>
                        <span v-else></span>
                    </template>
                </el-table-column>

                <el-table-column show-overflow-tooltip sortable="" prop="deliveryShops" label="发货店铺数" min-width="80" align="center" ></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="existingShops" label="现有店铺数" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip sortable="" prop="averageShopSales" label="平均店铺销售数" min-width="80" align="center" ></el-table-column>
                
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
import shopInput from "../../common/shopInput.vue";
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
                endTime:''
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
         getSummaries(param) {
            // console.log(param)
            const { columns, data } = param;
            const sums = [];
            columns.forEach((column, index) => {
                if (index === 0) {
                    sums[index] = '合计';
                    return;
                }
                const values = data.map(item => Number(item[column.property]));
                if (!values.every(value => isNaN(value))) {
                    sums[1] = this.totalList['averageSalesDiscount']
                    sums[6] = this.totalList['saleAmount']
                    sums[7] = this.totalList['saleNum']
                    sums[1] = this.totalList['soldPercent']
                    sums[5] = this.totalList['totalInStorage']
                    sums[10] = this.totalList['totalStock']
                    // sums[1] = this.totalList['totalTagPrice']
                    sums[11] = this.totalList['totalStock'] + this.totalList['saleNum']

                   
                } else {
                }
            });
            return sums;
        },
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
            // console.log({'高':2})
            // console.log(data)
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
        search() {
            // this.params.startTime = new Date(this.params.startTime).getTime();
            // this.params.endTime = new Date(this.params.endTime).getTime();

            // if (!this.params.startTime || !this.params.endTime) {
            //     this.msgCreate = "请填写时间";
            //     this.msgType = "error";
            //     this.msgCreateOpen();
            // } else {
            //     this.getInfo();
            // }
            this.params.page = 1
            this.getInfo()
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
            this.params.shopIds = data;
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
            this.params.cityId = this.searchForm.cityId
            this.params.provinceId = this.searchForm.provinceId
            this.params.shopId = this.searchForm.shopIds
            this.indexLoading = true;


            this.$axios.get('/api/shop-sales/single-product-total',{params:this.params}).then(res=>{
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

            this.$axios.get("/api/shop-sales/single-product", {params: this.params}).then(res => {
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
                    this.$axios.get('/api/shop-sales/single-product',{params:Object.assign(this.paramsExport,this.params,{size:this.total})}).then(res=>{
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
        // this.params.startTime = new Date(new Date() - 24*60*60*1000)
        // this.params.endTime = new Date()
        // this.search()
        this.indexLoading = false;
        this.getProvince()
    }
};
</script>

<style scoped>

</style>

