<template>
    <div>
        <div style="padding-bottom:8px">
            <el-button type="primary" @click="printCheck()" plain  icon="el-icon-printer">每日审核打印</el-button>
            <el-button type="primary" @click="showExcelData()" plain  icon="el-icon-download" :disabled="excelDisable">导出数据</el-button>
        </div>

        <div style="padding-bottom:8px">
            <div style="display:inline-block">
                <regionInput-app  @OnGetDataFromChild='getRegionIdFromChild'></regionInput-app>
            </div>

            <div style="display:inline-block">
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
            </div>

            <div style="display:inline-block">
                <shopInput-app :fatherData='fatherList' @OnGetDataFromChild='getShopIdFromChild'></shopInput-app>
            </div>

            <el-input v-model="searchForm.selectYear" style="width:200px" placeholder="请输入年份"></el-input>

            <el-select v-model="searchForm.selectSeason" placeholder="请输入季节">
                <el-option label="春" value="春"></el-option>
                <el-option label="夏" value="夏"></el-option>
                <el-option label="秋" value="秋"></el-option>
                <el-option label="冬" value="冬"></el-option>
                <el-option label="显示全部" value=""></el-option>
            </el-select>

            <el-button @click="search" icon="el-icon-search" type="primary" plain="">搜索</el-button>

        </div>

        
        <div ref="printTable">
            <el-table :data="items" style="width: 100%"  border highlight-current-row
                height="600"
                v-loading="indexLoading"
                element-loading-text="数据加载中......"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0, 0, 0, 0.8)"
            >
                <el-table-column show-overflow-tooltip prop="regionName" label="大区" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip prop="provinceName" label="省" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip prop="cityName" label="市" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip prop="shopName" label="店铺" min-width="120" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip label="年份" min-width="120" align="center">
                    <template slot-scope="scope">
                        <span>{{scope.row.year}}</span>
                    </template>
                </el-table-column>
                <el-table-column show-overflow-tooltip prop="season" label="季节" min-width="120" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip prop="code" label="款号" min-width="120" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip prop="color" label="颜色" min-width="120" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip prop="size" label="尺码" min-width="120" align="center"></el-table-column>

                <el-table-column show-overflow-tooltip label="期初数" min-width="90" align="center">
                    <el-table-column show-overflow-tooltip prop="openingBalanceNum" label="数量" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="openingBalancePrice" label="吊牌总价" min-width="90" align="center"></el-table-column>
                </el-table-column>

                <el-table-column show-overflow-tooltip label="发货数(包含调入)" min-width="90" align="center">
                    <el-table-column show-overflow-tooltip prop="deliverGoodsNum" label="数量" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="deliverGoodsPrice" label="吊牌总价" min-width="90" align="center"></el-table-column>
                </el-table-column>

                <el-table-column show-overflow-tooltip label="退货数(包含调出)" min-width="90" align="center">
                    <el-table-column show-overflow-tooltip prop="refundGoodsNum " label="数量" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="refundGoodsPrice" label="吊牌总价" min-width="90" align="center"></el-table-column>
                </el-table-column>

                <el-table-column show-overflow-tooltip label="销售(取货和销售发货)" min-width="90" align="center">
                    <el-table-column show-overflow-tooltip prop="saleGoodsNum" label="数量" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="saleGoodsPrice" label="吊牌总价" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="saleActualPrice" label="实销总金额" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="saleAverageDiscount " label="品均折扣" min-width="90" align="center"></el-table-column>
                </el-table-column>

                <el-table-column show-overflow-tooltip label="盘点" min-width="90" align="center">
                    <el-table-column show-overflow-tooltip prop="inventoryProfitNum" label="盘盈数" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="inventoryProfitPrice" label="盘盈吊牌价" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="inventoryLossesNum" label="盘亏数" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="inventoryLossesPrice" label="盘亏吊牌价" min-width="90" align="center"></el-table-column>
                </el-table-column>

                <el-table-column show-overflow-tooltip label="在途" min-width="90" align="center">
                    <el-table-column show-overflow-tooltip prop="onPassageNum" label="数量" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="onPassagePrice" label="吊牌总价" min-width="90" align="center"></el-table-column>
                </el-table-column>

                <el-table-column show-overflow-tooltip label="期末库存" min-width="90" align="center">
                    <el-table-column show-overflow-tooltip prop="realStorageNum" label="实存" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="realStoragePrice" label="实存金额" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="totalStorageNum" label="总库存" min-width="90" align="center"></el-table-column>
                    <el-table-column show-overflow-tooltip prop="totalStoragePrice" label="总金额" min-width="90" align="center"></el-table-column>
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
// import vipInput from '../../common/vipInput.vue'
    import regionInput from '../../common/regionCustomizeSelect.vue'
    import shopInput from '../../common/shopInput.vue'
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
                searchForm:{},
                provinceList:[],
                cityList:[],
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
            'shopInput-app':shopInput,
            'regionInput-app':regionInput
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
                        this.fatherList.provinceId = this.searchForm.provinceId
                        this.cityList.unshift({id:0,name:'显示全部'})
                    }else{
                        this.msgCreate = '获取市列表失败'
                        this.msgType = 'error'
                        this.msgCreateOpen()
                    }
                })
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
            getShopIdFromChild(data){
                this.searchForm.shopId = data
            },
            search(){
                this.params.page = 1
                this.params.regionId = this.searchForm.regionId
                this.params.shopId = this.searchForm.shopId
                this.params.selectYear =  this.searchForm.selectYear
                this.params.selectSeason =  this.searchForm.selectSeason
                this.params.provinceId = this.searchForm.provinceId
                this.params.cityId = this.searchForm.cityId
                // if((!this.params.regionId && !this.params.shopId)){
                //   this.msgCreate = '请填写时间'
                //   this.msgType = 'error'
                //   this.msgCreateOpen()
                // }else{
                //   this.getInfo()
                // }
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
                this.excelDisable = true
                this.indexLoading = true
                this.params.cityId = this.searchForm.cityId
                this.params.provinceId = this.searchForm.provinceId
                this.$axios.get('/api/storeMerchandiseInventory/getStoreMerchandiseInventoryManagement',{params:this.params}).then(res=>{
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
                }).then(res=>{
                    if(this.total != 0){
                        this.$axios.get('/api/storeMerchandiseInventory/getStoreMerchandiseInventoryManagement',{params:Object.assign(this.paramsExport,this.params,{size:this.total})}).then(res=>{
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
        mounted(){
            this.indexLoading = false
            this.getProvince()
        }
    }
</script>

<style scoped>
 
</style>

