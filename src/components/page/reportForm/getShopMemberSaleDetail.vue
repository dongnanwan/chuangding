<template>
    <div>

        <div style="padding-bottom:8px">
            <el-button type="primary" @click="printCheck()" plain  icon="el-icon-printer">每日审核打印</el-button>
            <el-button type="primary" @click="showExcelData()" plain  icon="el-icon-download" :disabled="excelDisable">导出数据</el-button>
        </div>

        <div style="padding-bottom:8px">
        
        <div style="display:inline-block">
            <span style="color:red;font-size:20px">*</span>
            <el-date-picker
                v-model="searchForm.startTime"
                type="datetime"
                placeholder="开始日期">
            </el-date-picker>
        </div>

        <div style="display:inline-block">
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
            <shopInput-app :fatherData='fatherList'  @OnGetDataFromChild='getShopIdFromChild'></shopInput-app>
            </div>
        
        

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
            <el-table-column show-overflow-tooltip  label="日期/时/分" min-width="150" align="center">
                <template slot-scope="scope">
                <span>{{new Date(scope.row.created).toLocaleString()}}</span>
                </template>
            </el-table-column>
            <el-table-column sortable="" show-overflow-tooltip prop="regionName" label="大区" min-width="80" align="center"></el-table-column>
            <el-table-column sortable="" show-overflow-tooltip prop="provinceName" label="省" min-width="80" align="center"></el-table-column>
            <el-table-column sortable="" show-overflow-tooltip prop="cityName" label="市" min-width="80" align="center"></el-table-column>
            <el-table-column sortable="" show-overflow-tooltip prop="shopName" label="店铺" min-width="80" align="center"></el-table-column>
            <el-table-column sortable="" show-overflow-tooltip label="会员ID" min-width="80" align="center">
                <template slot-scope="scope">
                <span>{{scope.row.memberId}}</span>
                </template>
            </el-table-column>
            <el-table-column sortable="" show-overflow-tooltip prop="initialFortunellaVenosa" label="初始金豆" min-width="80" align="center"></el-table-column>
            
            <el-table-column show-overflow-tooltip  label="销售" align="center">
                <el-table-column sortable="" show-overflow-tooltip label="款号" prop="salesStyleNumber" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip label="颜色" prop="salesColor" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip label="尺码" prop="salesSizes" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip label="吊牌价" prop="salesTagPrice" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip label="折扣" prop="salesDiscount" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip label="销售件数" prop="salesNumbers" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip label="销售金豆" prop="salesFortunellaVenosa" min-width="80" align="center"></el-table-column>
            </el-table-column>

            <el-table-column show-overflow-tooltip prop="id" label="退货" align="center">
                <el-table-column sortable="" show-overflow-tooltip label="款号" prop="refundStyleNumber" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip label="颜色" prop="refundColor" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip label="尺码" prop="refundSizes" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip label="吊牌价" prop="refundTagPrice" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip label="折扣" prop="refundDiscount" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip label="销售件数" prop="refundNumbers" min-width="80" align="center"></el-table-column>
                <el-table-column sortable="" show-overflow-tooltip label="销售金豆" prop="refundFortunellaVenosa" min-width="80" align="center"></el-table-column>
            </el-table-column>

            <!-- <el-table-column show-overflow-tooltip prop="" label="销售件数合计" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="fortunellaVenosaFreight" label="营收金豆" min-width="80" align="center"></el-table-column> -->
            <el-table-column sortable="" show-overflow-tooltip prop="remainingFortunellaVenosa" label="结存金豆" min-width="80" align="center"></el-table-column>

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
            'regionSelect-app':regionSelect,
            'shopInput-app':shopInput
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
                this.params.startTime = new Date(this.searchForm.startTime).getTime()
                this.params.endTime = new Date(this.searchForm.endTime).getTime()
                this.params.regionId = this.searchForm.regionId
                this.params.shopId = this.searchForm.shopId
                this.params.provinceId = this.searchForm.provinceId
                this.params.cityId = this.searchForm.cityId
                if(!this.params.startTime || !this.params.endTime){
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
                this.$axios.get('/api/shopMemberSalesEnquiry/getShopMemberSalesEnquiryList',{params:this.params}).then(res=>{
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
                }).then(res=>{
                    if(this.total != 0){
                        this.$axios.get('/api/shopMemberSalesEnquiry/getShopMemberSalesEnquiryList',{params:Object.assign(this.paramsExport,this.params,{size:this.total})}).then(res=>{
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
            // this.getInfo()
        }
    }
</script>

<style scoped>
 
</style>

