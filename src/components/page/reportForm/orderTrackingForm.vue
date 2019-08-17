<template>
    <div>
        <div style="padding-bottom:8px">
            <el-button type="primary" @click="printCheck()" plain  icon="el-icon-printer">每日审核打印</el-button>
            <el-button type="primary" @click="showExcelData()" plain  icon="el-icon-download" :disabled="excelDisable">导出数据</el-button>
        </div>

        <div style="padding-bottom:8px">
        <div style="display:inline-block">
            <el-date-picker
            v-model="searchForm.startTime"
            type="datetime"
            placeholder="开始日期">
            </el-date-picker>
        </div>

        <div style="display:inline-block">
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
            <shopInput-app  @OnGetDataFromChild='getShopIdFromChild'></shopInput-app>
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

            <el-table-column show-overflow-tooltip  label="创建日期" min-width="150" align="center">
                <template slot-scope="scope">
                <span v-if="scope.row.tradeCreated">{{new Date(scope.row.tradeCreated).toLocaleString()}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="付款日期" min-width="150" align="center">
                <template slot-scope="scope">
                <span v-if="scope.row.tradePayTime">{{new Date(scope.row.tradePayTime).toLocaleString()}}</span>
                </template>
            </el-table-column>

            <el-table-column show-overflow-tooltip prop="regionName" label="区域" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="shopName" label="店铺" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="tradeId" label="订单号" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="purchaser" label="买家" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="contactWay" label="联系方式" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip prop="amount" label="金额" min-width="80" align="center"></el-table-column>

            <el-table-column show-overflow-tooltip label="状态" min-width="100" align="center">
                <template slot-scope="scope">
                <span v-if="scope.row.status == 10">待付款</span>
                <span v-else-if="scope.row.status == 25">已付款，活动中</span>
                <span v-else-if="scope.row.status == 30">待发货</span>
                <span v-else-if="scope.row.status == 50">卖家已发货</span>
                <span v-else-if="scope.row.status == 60">申请退款</span>
                <span v-else-if="scope.row.status == 100">已完成</span>
                <span v-else-if="scope.row.status == 110">已关闭</span>
                <span v-else-if="scope.row.status == 111">系统关闭</span>
                <span v-else-if="scope.row.status == 112">退款关闭</span>
                <span v-else>{{scope.row.status}}</span>
                </template>
            </el-table-column>
            
            <el-table-column show-overflow-tooltip  label="产品信息" align="center">
                <el-table-column show-overflow-tooltip label="款号" prop="code" min-width="140" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip label="颜色" prop="color" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip label="尺码" prop="size" min-width="80" align="center"></el-table-column>
                <el-table-column show-overflow-tooltip label="件数" prop="number" min-width="80" align="center"></el-table-column>
            </el-table-column>
            
            <el-table-column show-overflow-tooltip label="处理客服" prop="serviceName" min-width="80" align="center"></el-table-column>
            <el-table-column show-overflow-tooltip  label="处理时间" min-width="150" align="center">
                <template slot-scope="scope">
                <span v-if="scope.row.handlingTime">{{new Date(scope.row.handlingTime).toLocaleString()}}</span>
                </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip label="完成时间" min-width="150" align="center">
                <template slot-scope="scope">
                <span v-if="scope.row.completedTime">{{new Date(scope.row.completedTime).toLocaleString()}}</span>
                </template>
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
                page:1,
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
                this.$axios.get('/api/orderTrackingForm/getOrderTrackingForm',{params:this.params}).then(res=>{
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
                        this.$axios.get('/api/orderTrackingForm/getOrderTrackingForm',{params:Object.assign(this.paramsExport,this.params,{size:this.total})}).then(res=>{
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

